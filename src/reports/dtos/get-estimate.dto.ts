import { Transform } from 'class-transformer';
import {
  Max,
  Min,
  IsString,
  IsNumber,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  model: string;

  @IsString()
  make: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
