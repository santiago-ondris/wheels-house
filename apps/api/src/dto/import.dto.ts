import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Data for a single car row from Excel
export class ImportCarRowDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    scale: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    condition: string;

    @IsString()
    @IsOptional()
    series?: string | null;

    @IsString()
    @IsOptional()
    description?: string | null;

    @IsString()
    @IsOptional()
    rarity?: string | null;

    @IsString()
    @IsOptional()
    quality?: string | null;

    @IsString()
    @IsOptional()
    variety?: string | null;

    @IsString()
    @IsOptional()
    finish?: string | null;
}

// Preview response for a single row
export class ImportPreviewRowDTO {
    row: number;
    data: ImportCarRowDTO;
    isValid: boolean;
    errors: string[];

    constructor(row: number, data: ImportCarRowDTO, isValid: boolean, errors: string[] = []) {
        this.row = row;
        this.data = data;
        this.isValid = isValid;
        this.errors = errors;
    }
}

// Full preview response
export class ImportPreviewResponseDTO {
    success: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    preview: ImportPreviewRowDTO[];

    constructor(totalRows: number, validRows: number, invalidRows: number, preview: ImportPreviewRowDTO[]) {
        this.success = true;
        this.totalRows = totalRows;
        this.validRows = validRows;
        this.invalidRows = invalidRows;
        this.preview = preview;
    }
}

// Request body for confirm endpoint
export class ImportConfirmDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportCarRowDTO)
    cars: ImportCarRowDTO[];
}

// Result of import operation
export class ImportResultDTO {
    success: boolean;
    imported: number;
    failed: number;
    errors?: { index: number; name: string; error: string }[];

    constructor(success: boolean, imported: number, failed: number, errors?: { index: number; name: string; error: string }[]) {
        this.success = success;
        this.imported = imported;
        this.failed = failed;
        this.errors = errors;
    }
}
