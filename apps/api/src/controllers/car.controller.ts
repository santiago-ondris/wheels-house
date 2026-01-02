import { Controller, Get, Post, Body, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { CreateCarDTO } from 'src/dto/car.dto';
import { CarService } from 'src/services/car.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { createCarValidator, deleteCarValidator, getCarValidator, listCarsValidator } from 'src/validators/car.validator';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createCar(@Request() req, @Body() carData: CreateCarDTO) {
        console.log(carData);
        await createCarValidator(carData, req.user);

        return await this.carService.createCarService(carData, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list/:username')
    async listCars(@Request() req, @Param('username') username) {
        await listCarsValidator(req.user, username);
        
        return await this.carService.listCarsService(username);
    }

    @UseGuards(JwtAuthGuard)
    @Get('info/:carId')
    async getCar(@Request() req, @Param('carId') carId) {
        await getCarValidator(req.user, carId);

        return await this.carService.getCarService(carId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':carId')
    async deleteCar(@Request() req, @Param('carId') carId) {
        await deleteCarValidator(req.user, carId);

        return await this.carService.deleteCarService(carId);
    }
}