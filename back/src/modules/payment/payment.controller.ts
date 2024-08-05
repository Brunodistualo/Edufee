import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment-detail')
export class PaymentDetailController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('id')
  getPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Get()
  getAllPayments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    return this.paymentService.getAllPayments(Number(page), Number(limit));
  }
}
