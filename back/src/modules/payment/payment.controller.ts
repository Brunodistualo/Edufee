import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './payment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/enums/enums';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { InstitutionPayment } from './paymentInstitutions/paymentInstitutions.entity';

@ApiTags('Payments')
@Controller('payments')
export class PaymentDetailController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student, Role.institution)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  getPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student, Role.institution)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getAllPayments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    return this.paymentService.getAllPayments(Number(page), Number(limit));
  }

  @Get('student/:studentId')
  async getPayments(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentService.getPaymentsByStudent(studentId, page, limit);
  }

  @Get('institution/:institutionId')
  async getPaymentOrdersInstitutions(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
  ) {
    return this.paymentService.getPaymentOrdersInstitutions(institutionId);
  }

  @Get('institution/paymentsReceived/:institutionId')
  async getPaymentsReceivedByInstitution(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
  ) {
    return this.paymentService.getPaymentsReceivedByInstitution(institutionId);
  }

  @Post('register')
  async registerPayment(@Body() paymentDto: PaymentDto) {
    return this.paymentService.registerPayment(paymentDto);
  }
  @Post('register/institution/:institutionId')
  async generateMonthlyPaymentOrder(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
  ): Promise<InstitutionPayment> {
    try {
      return await this.paymentService.generateMonthlyPaymentOrder(
        institutionId,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
