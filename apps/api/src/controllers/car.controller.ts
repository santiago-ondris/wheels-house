import { Controller, Get, Post, Put, Body, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { CarService } from 'src/services/car.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { createCarValidator, deleteCarValidator, getCarValidator, listCarsValidator, updateCarValidator } from 'src/validators/car.validator';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createCar(@Request() req, @Body() carData: CreateCarDTO) {
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
    @Put('update-info/:carId')
    async updateCar(@Request() req, @Body() carChanges: CarUpdateDTO, @Param('carId') carId) {
        await updateCarValidator(req.user, carChanges, carId);

        return await this.carService.updateCarService(carChanges, carId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':carId')
    async deleteCar(@Request() req, @Param('carId') carId) {
        await deleteCarValidator(req.user, carId);

        return await this.carService.deleteCarService(carId);
    }
}