import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCarDTO } from 'src/dto/car.dto';
import { CarService } from 'src/services/car.service';
import { createCarValidator, listCarsValidator } from 'src/validators/car.validator';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    async createCar(@Request() req, @Body() carData: CreateCarDTO) {
        console.log(carData);
        await createCarValidator(carData, req.user);

        return await this.carService.createCarService(carData, req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('list/:username')
    async listCars(@Request() req, @Param('username') username) {
        await listCarsValidator(req.user, username);
        
        return this.carService.listCars(username);
    }
}