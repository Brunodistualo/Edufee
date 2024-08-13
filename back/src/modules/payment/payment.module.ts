import { Module } from '@nestjs/common';
import { PaymentDetailController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentsRepository } from './payment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { User } from '../users/users.entity';
import { Institution } from '../institution/institution.entity';
import { InstitutionPayment } from './paymentInstitutions/paymentInstitutions.entity';
import { SendMailsRepository } from '../send-mails/send-mails.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User, Institution, InstitutionPayment]),
  ],
  controllers: [PaymentDetailController],
  providers: [PaymentService, PaymentsRepository, SendMailsRepository],
})
export class PaymentModule {}
