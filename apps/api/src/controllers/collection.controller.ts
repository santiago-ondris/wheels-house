import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCollectionDTO } from 'src/dto/collection.dto';
import { CollectionService } from 'src/services/collection.service';
import { createCollectionValidator } from 'src/validators/collection.validator';

@Controller()
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create-collection')
    async register(@Request() req, @Body() collectionData: CreateCollectionDTO) {
        await createCollectionValidator(collectionData, req.user);

        return await this.collectionService.createCollectionService(collectionData, req.user);
    }
}
      