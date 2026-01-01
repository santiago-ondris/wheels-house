import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCarDTO {

}

export class CarToDB extends CreateCarDTO {
    userId: number;
}