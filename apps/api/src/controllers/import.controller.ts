import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    UseGuards, 
    Request, 
    Res,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ImportService } from '../services/import.service';
import { JwtAuthGuard } from '../validators/auth.validator';
import { ImportConfirmDTO, ImportResultDTO, ImportPreviewResponseDTO } from '../dto/import.dto';
import { db } from '../database/index';
import { user } from '../database/schema';
import { eq } from 'drizzle-orm';

// Multer configuration for file upload
const multerOptions = {
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedMimes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new BadRequestException('Formato de archivo no válido. Use .xlsx'), false);
        }
    },
};

@Controller('car/import')
export class ImportController {
    constructor(private readonly importService: ImportService) {}

    // Helper to get userId from username
    private async getUserId(username: string): Promise<number> {
        const [userData] = await db.select({ userId: user.userId })
            .from(user)
            .where(eq(user.username, username))
            .limit(1);
        
        if (!userData) {
            throw new BadRequestException('Usuario no encontrado');
        }
        return userData.userId;
    }

    /**
     * GET /car/import/template
     * Download empty Excel template with dropdowns
     */
    @Get('template')
    async downloadTemplate(@Res() res: Response): Promise<void> {
        const buffer = await this.importService.generateTemplate();
        
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="wheels-house-plantilla.xlsx"'
        );
        res.send(Buffer.from(buffer));
    }

    /**
     * POST /car/import/preview
     * Upload Excel file and get preview with validation
     */
    @UseGuards(JwtAuthGuard)
    @Post('preview')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async previewImport(
        @Request() req: any,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ImportPreviewResponseDTO> {
        if (!file) {
            throw new BadRequestException('No se proporcionó ningún archivo.');
        }

        const userId = await this.getUserId(req.user.username);

        // Convert buffer to ArrayBuffer
        const arrayBuffer = file.buffer.buffer.slice(
            file.buffer.byteOffset,
            file.buffer.byteOffset + file.buffer.byteLength
        ) as ArrayBuffer;

        return await this.importService.parseAndValidateExcel(
            arrayBuffer,
            userId
        );
    }

    /**
     * POST /car/import/confirm
     * Confirm import of validated cars
     */
    @UseGuards(JwtAuthGuard)
    @Post('confirm')
    async confirmImport(
        @Request() req: any,
        @Body() body: ImportConfirmDTO
    ): Promise<ImportResultDTO> {
        if (!body.cars || body.cars.length === 0) {
            throw new BadRequestException('No se proporcionaron autos para importar.');
        }

        if (body.cars.length > 500) {
            throw new BadRequestException('El array excede el máximo de 500 autos.');
        }

        const userId = await this.getUserId(req.user.username);
        return await this.importService.bulkCreateCars(body.cars, userId);
    }
}

