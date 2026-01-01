import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCarDTO } from 'src/dto/car.dto';
import { CarService } from 'src/services/car.service';
import { createCarValidator } from 'src/validators/car.validator';

@Controller()
export class CarController {
    constructor(private readonly carService: CarService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create-car')
    async register(@Request() req, @Body() carData: CreateCarDTO) {
        await createCarValidator(carData, req.user);

        return await this.carService.createCarService(carData, req.user);
    }
}