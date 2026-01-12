import { Controller, Get, Post, Put, Body, UseGuards, Request, Param, Delete, Query } from '@nestjs/common';
import { car } from 'src/database/schema';
import { CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { CollectionQueryDTO, BulkAddToGroupDTO } from 'src/dto/collection-query.dto';
import { CarService } from 'src/services/car.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { createCarValidator, deleteCarValidator, getCarValidator, getWishlistValidator, listCarsValidator, updateCarGroupsValidator, updateCarValidator, wishedCarToCollectionValidator } from 'src/validators/car.validator';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createCar(@Request() req, @Body() carData: CreateCarDTO) {
        console.log("HOLA");
        await createCarValidator(carData, req.user);

        return await this.carService.createCarService(carData, req.user);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('list/:username')
    async listCars(@Request() req, @Param('username') username) {
        await listCarsValidator(req.user, username);

        return await this.carService.listCarsService(username);
    }

    // Paginated list with filtering and sorting
    @Get('collection/:username')
    async listCarsPaginated(
        @Param('username') username: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('brands') brands?: string,
        @Query('colors') colors?: string,
        @Query('manufacturers') manufacturers?: string,
        @Query('scales') scales?: string,
        @Query('conditions') conditions?: string,
        @Query('countries') countries?: string,
        @Query('search') search?: string,
        @Query('groupId') groupId?: string,
    ) {
        const query: CollectionQueryDTO = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 15,
            sortBy: sortBy as any || 'id',
            sortOrder: sortOrder as any || 'desc',
            brands: brands ? brands.split(',') : undefined,
            colors: colors ? colors.split(',') : undefined,
            manufacturers: manufacturers ? manufacturers.split(',') : undefined,
            scales: scales ? scales.split(',') : undefined,
            conditions: conditions ? conditions.split(',') : undefined,
            countries: countries ? countries.split(',') : undefined,
            search,
            groupId: groupId ? parseInt(groupId) : undefined,
        };

        return await this.carService.listCarsPaginatedService(username, query);
    }

    // @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Put(':carId/groups')
    async updateCarGroups(@Request() req, @Param('carId') carId, @Body() body: { groups: number[] }) {
        await updateCarGroupsValidator(req.user, carId, body.groups);

        return await this.carService.updateCarGroupsService(carId, body.groups);
    }

    @Get(':carId/groups')
    async getCarGroups(@Param('carId') carId) {
        return await this.carService.getCarGroupsService(carId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('suggestions')
    async getSuggestions(@Request() req) {
        return await this.carService.getSuggestionsService(req.user);
    }

    @Get('featured')
    async getFeaturedCar() {
        return await this.carService.getFeaturedCarService();
    }

    @UseGuards(JwtAuthGuard)
    @Post('bulk/add-to-group')
    async bulkAddToGroup(@Request() req, @Body() body: BulkAddToGroupDTO) {
        return await this.carService.bulkAddToGroupService(
            req.user.username,
            body.groupId,
            body.carIds,
            body.filterQuery
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put('wishedCarToCollection/:carId')
    async wishedCarToCollection(@Request() req, @Param('carId') carId: number, @Body() carChanges: CarUpdateDTO) {
        await wishedCarToCollectionValidator(req.user, carId, carChanges);

        return await this.carService.wishedCarToCollectionService(carId, carChanges);
    }

    @Get('wishlist/:username')
    async getWishlist(@Param('username') username: string) {
        await getWishlistValidator(username);

        return await this.carService.getWishlistService(username);
    }
}