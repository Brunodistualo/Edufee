import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { PaymentDto } from './payment.dto';
import { User } from '../users/users.entity';
import { Institution } from '../institution/institution.entity';
import { InstitutionPayment } from './paymentInstitutions/paymentInstitutions.entity';
import { SendMailsRepository } from '../send-mails/send-mails.repository';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(InstitutionPayment)
    private readonly institutionPaymentRepository: Repository<InstitutionPayment>,
    private readonly sendEmailRepository: SendMailsRepository,
  ) {}

  async getAllPayments(page: number, limit: number) {
    const allPayments = await this.paymentRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return allPayments;
  }

  async getPaymentById(id: string) {
    const getPayment = await this.paymentRepository.findOneBy({ id });
    if (!getPayment) {
      throw new NotFoundException(`Pago no encontrado con este ID: ${id}`);
    }
    return getPayment;
  }

  async registerPayment(paymentDto: PaymentDto): Promise<Payment> {
    const { userId, institutionId, amount, pdfImage } = paymentDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException(
        `No existe un usuario con este ID: ${userId}`,
      );
    }

    const institution = await this.institutionRepository.findOneBy({
      id: institutionId,
    });
    if (!institution) {
      throw new BadRequestException(
        `No existe una institución con este ID: ${institutionId}`,
      );
    }

    const newPayment = new Payment();
    const fee = Math.round(amount * 0.01);

    newPayment.date = new Date().toLocaleDateString();
    newPayment.amount = amount;
    newPayment.pdfImage = pdfImage;
    newPayment.user = user;
    newPayment.institution = institution;

    institution.mustPay += fee;

    await this.institutionRepository.save(institution);

    await this.sendEmailRepository.sendPaymentConfirmationEmail({
      email: user.email,
      name: user.name,
    });

    return await this.paymentRepository.save(newPayment);
  }

  async generateMonthlyPaymentOrder(
    institutionId: string,
  ): Promise<InstitutionPayment> {
    const institution = await this.institutionRepository.findOneBy({
      id: institutionId,
    });

    if (!institution) {
      throw new BadRequestException(
        `No existe una institución con este ID: ${institutionId}`,
      );
    }

    const amountDue = institution.mustPay;

    const institutionPayment = new InstitutionPayment();
    institutionPayment.date = new Date().toLocaleDateString();
    institutionPayment.amount = amountDue;
    institutionPayment.institution = institution;

    await this.institutionPaymentRepository.save(institutionPayment);

    institution.mustPay = 0;
    await this.institutionRepository.save(institution);

    return institutionPayment;
  }

  async getPaymentsByStudent(studentId: string, page: number, limit: number) {
    const pageNumber = parseInt(page as unknown as string, 10);
    const limitNumber = parseInt(limit as unknown as string, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException(
        'Los valores de page y limit deben ser números válidos.',
      );
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.payments', 'payment')
      .where('user.id = :id', { id: studentId })
      .getOne();

    if (!user) {
      throw new BadRequestException(
        `No se encontraron pagos registrados para el estudiante con ID: ${studentId}`,
      );
    }

    const [payments, count] = await Promise.all([
      this.paymentRepository.find({
        where: { user: { id: studentId } },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      }),
      this.paymentRepository.count({
        where: { user: { id: studentId } },
      }),
    ]);

    return { payments, count };
  }
}
