import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
