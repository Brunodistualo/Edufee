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
    const fee = amount * 0.01;

    newPayment.date = new Date().toLocaleDateString();
    newPayment.amount = amount;
    newPayment.pdfImage = pdfImage;
    newPayment.user = user;
    newPayment.institution = institution;

    institution.mustPay += fee;

    await this.institutionRepository.save(institution);

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
}
