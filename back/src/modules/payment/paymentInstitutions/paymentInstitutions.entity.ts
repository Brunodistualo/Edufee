import { Institution } from 'src/modules/institution/institution.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'institution_payments' })
export class InstitutionPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  amount: number;

  @Column({ nullable: true }) // Hacer que la columna pdfImage sea opcional
  pdfImage?: string;

  @ManyToOne(
    () => Institution,
    (institution) => institution.institutionPayments,
  )
  institution: Institution;
}
