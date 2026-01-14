import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { 
    ImportCarRowDTO, 
    ImportPreviewRowDTO, 
    ImportPreviewResponseDTO, 
    ImportResultDTO 
} from '../dto/import.dto';
import { 
    manufacturers, 
    brands, 
    scales, 
    colors, 
    carConditions, 
    brandNationalities 
} from '../data/carOptions';
import { CarToDB } from '../dto/car.dto';
import { createCar } from '../database/crud/car.crud';

// Example row data for reference/skipping
const EXAMPLE_ROW = {
    name: "Nissan Skyline GT-R R34",
    manufacturer: "Hot Wheels",
    brand: "Nissan",
    scale: "1/64",
    color: "Azul",
    condition: "Cerrado / En blister",
    series: "Japan Historics",
    description: "Edición especial 2024"
};

const MAX_ROWS = 500;
const MAX_NAME_LENGTH = 100;
const MAX_SERIES_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

@Injectable()
export class ImportService {
    
    async generateTemplate(): Promise<ArrayBuffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Wheels House';
        workbook.created = new Date();

        // Sheet 1: Data (main sheet)
        const dataSheet = workbook.addWorksheet('Datos');
        this.setupDataSheet(dataSheet);

        // Sheet 2: Values (visible, as reference for users to copy from)
        const valuesSheet = workbook.addWorksheet('Valores Permitidos');
        this.setupValuesSheet(valuesSheet);
        // Sheet is visible so users can copy/paste values

        // Sheet 3: Instructions
        const instructionsSheet = workbook.addWorksheet('Instrucciones');
        this.setupInstructionsSheet(instructionsSheet);

        return await workbook.xlsx.writeBuffer();
    }

    private setupDataSheet(sheet: ExcelJS.Worksheet): void {
        // Column definitions
        const columns = [
            { header: 'nombre*', key: 'nombre', width: 35 },
            { header: 'fabricante*', key: 'fabricante', width: 18 },
            { header: 'marca*', key: 'marca', width: 18 },
            { header: 'escala*', key: 'escala', width: 10 },
            { header: 'color*', key: 'color', width: 12 },
            { header: 'condición*', key: 'condicion', width: 22 },
            { header: 'serie', key: 'serie', width: 25 },
            { header: 'descripcion', key: 'descripcion', width: 40 },
        ];
        sheet.columns = columns;

        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            const isRequired = colNumber <= 6;
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: isRequired ? 'FF2A2359' : 'FF4A4A6A' }
            };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }
            };
        });
        headerRow.height = 25;

        // Add example row
        sheet.addRow([
            EXAMPLE_ROW.name,
            EXAMPLE_ROW.manufacturer,
            EXAMPLE_ROW.brand,
            EXAMPLE_ROW.scale,
            EXAMPLE_ROW.color,
            EXAMPLE_ROW.condition,
            EXAMPLE_ROW.series,
            EXAMPLE_ROW.description
        ]);

        // Style example row
        const exampleRow = sheet.getRow(2);
        exampleRow.eachCell((cell) => {
            cell.font = { italic: true, color: { argb: 'FF666666' } };
        });
    }



    private setupValuesSheet(sheet: ExcelJS.Worksheet): void {
        // Set column widths
        sheet.getColumn(1).width = 20;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 10;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 22;

        // Add header row
        const headers = ['FABRICANTES', 'MARCAS', 'ESCALAS', 'COLORES', 'CONDICIÓN'];
        headers.forEach((header, index) => {
            const cell = sheet.getCell(1, index + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2A2359' }
            };
            cell.alignment = { horizontal: 'center' };
        });
        sheet.getRow(1).height = 22;

        // Column A: Manufacturers (starting row 2)
        manufacturers.forEach((value, index) => {
            sheet.getCell(`A${index + 2}`).value = value;
        });

        // Column B: Brands
        brands.forEach((value, index) => {
            sheet.getCell(`B${index + 2}`).value = value;
        });

        // Column C: Scales
        scales.forEach((value, index) => {
            sheet.getCell(`C${index + 2}`).value = value;
        });

        // Column D: Colors
        colors.forEach((value, index) => {
            sheet.getCell(`D${index + 2}`).value = value;
        });

        // Column E: Conditions
        carConditions.forEach((value, index) => {
            sheet.getCell(`E${index + 2}`).value = value;
        });

        // Add helper text at bottom
        const maxRows = Math.max(manufacturers.length, brands.length, colors.length) + 3;
        sheet.getCell(`A${maxRows}`).value = '💡 Usa los valores de acá para completar la hoja "Datos. Cuando uses un valor, luego ya te va a aparecer para autocompletar"';
        sheet.getCell(`A${maxRows}`).font = { italic: true, color: { argb: 'FF666666' } };
    }

    private setupInstructionsSheet(sheet: ExcelJS.Worksheet): void {
        sheet.getColumn(1).width = 80;

        const instructions = [
            { text: 'INSTRUCCIONES DE USO', style: 'title' },
            { text: '', style: 'normal' },
            { text: 'Campos obligatorios (marcados con *):', style: 'subtitle' },
            { text: '• name: Nombre del modelo (ej: "\'71 Datsun 510")', style: 'normal' },
            { text: '• manufacturer: Fabricante del modelo a escala (ej: "Hot Wheels")', style: 'normal' },
            { text: '• brand: Marca del vehículo real (ej: "Nissan")', style: 'normal' },
            { text: '• scale: Escala del modelo (ej: "1/64")', style: 'normal' },
            { text: '• color: Color principal del modelo', style: 'normal' },
            { text: '• condition: Estado del empaque', style: 'normal' },
            { text: '', style: 'normal' },
            { text: 'Campos opcionales:', style: 'subtitle' },
            { text: '• series: Serie o colección (ej: "Japan Historics")', style: 'normal' },
            { text: '• description: Notas adicionales', style: 'normal' },
            { text: '', style: 'normal' },
            { text: 'NOTAS IMPORTANTES:', style: 'subtitle' },
            { text: '⚠️ Use la segunda hoja para ver como deben ser los datos', style: 'warning' },
            { text: '⚠️ Las imágenes se agregan después desde la aplicación', style: 'warning' },
            { text: '⚠️ No modificar los títulos de la fila 1', style: 'warning' },
            { text: '⚠️ No modificar ni eliminar la hoja "Valores Permitidos"', style: 'warning' },
            { text: '⚠️ Máximo 500 autos por archivo', style: 'warning' },
            { text: '⚠️ Puede borrar la fila de ejemplo antes de cargar sus datos', style: 'warning' },
        ];

        instructions.forEach((line, index) => {
            const cell = sheet.getCell(`A${index + 1}`);
            cell.value = line.text;
            
            switch (line.style) {
                case 'title':
                    cell.font = { bold: true, size: 16 };
                    break;
                case 'subtitle':
                    cell.font = { bold: true, size: 12 };
                    break;
                case 'warning':
                    cell.font = { color: { argb: 'FFCC6600' } };
                    break;
                default:
                    cell.font = { size: 11 };
            }
        });
    }

    async parseAndValidateExcel(
        buffer: ArrayBuffer, 
        userId: number
    ): Promise<ImportPreviewResponseDTO> {
        const workbook = new ExcelJS.Workbook();
        
        try {
            await workbook.xlsx.load(buffer as any);
        } catch {
            throw new BadRequestException('No se pudo leer el archivo. Verifique que no esté corrupto.');
        }

        // Get first sheet or sheet named "Datos"
        let sheet = workbook.getWorksheet('Datos');
        if (!sheet) {
            sheet = workbook.worksheets[0];
        }

        if (!sheet || sheet.rowCount <= 1) {
            throw new BadRequestException('El archivo está vacío o no contiene datos válidos.');
        }

        const preview: ImportPreviewRowDTO[] = [];
        let validRows = 0;
        let invalidRows = 0;
        let dataRowCount = 0;

        // Iterate rows starting from row 2 (skip header)
        for (let rowNum = 2; rowNum <= sheet.rowCount && dataRowCount < MAX_ROWS; rowNum++) {
            const row = sheet.getRow(rowNum);
            
            // Skip completely empty rows
            if (this.isRowEmpty(row)) continue;
            
            // Parse row data
            const rowData = this.parseRow(row);
            
            // Skip if it's the example row
            if (this.isExampleRow(rowData)) continue;

            dataRowCount++;

            // Validate row
            const errors = this.validateRowData(rowData);
            const isValid = errors.length === 0;

            if (isValid) {
                validRows++;
            } else {
                invalidRows++;
            }

            preview.push(new ImportPreviewRowDTO(rowNum, rowData, isValid, errors));
        }

        if (dataRowCount === 0) {
            throw new BadRequestException('El archivo está vacío o no contiene datos válidos.');
        }

        if (sheet.rowCount - 1 > MAX_ROWS) {
            throw new BadRequestException(`El archivo excede el máximo de ${MAX_ROWS} filas.`);
        }

        return new ImportPreviewResponseDTO(
            dataRowCount,
            validRows,
            invalidRows,
            preview
        );
    }

    private isRowEmpty(row: ExcelJS.Row): boolean {
        let isEmpty = true;
        row.eachCell({ includeEmpty: false }, () => {
            isEmpty = false;
        });
        return isEmpty;
    }

    private parseRow(row: ExcelJS.Row): ImportCarRowDTO {
        return {
            name: this.getCellValue(row.getCell(1)),
            manufacturer: this.getCellValue(row.getCell(2)),
            brand: this.getCellValue(row.getCell(3)),
            scale: this.getCellValue(row.getCell(4)),
            color: this.getCellValue(row.getCell(5)),
            condition: this.getCellValue(row.getCell(6)),
            series: this.getCellValue(row.getCell(7)) || null,
            description: this.getCellValue(row.getCell(8)) || null,
        };
    }

    private getCellValue(cell: ExcelJS.Cell): string {
        const value = cell.value;
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value.trim();
        if (typeof value === 'number') return String(value);
        if (typeof value === 'object' && 'text' in value) return String(value.text).trim();
        return String(value).trim();
    }

    private isExampleRow(data: ImportCarRowDTO): boolean {
        return (
            data.name === EXAMPLE_ROW.name &&
            data.manufacturer === EXAMPLE_ROW.manufacturer &&
            data.brand === EXAMPLE_ROW.brand &&
            data.scale === EXAMPLE_ROW.scale &&
            data.color === EXAMPLE_ROW.color &&
            data.condition === EXAMPLE_ROW.condition
        );
    }

    private validateRowData(data: ImportCarRowDTO): string[] {
        const errors: string[] = [];

        // Name validation
        if (!data.name || data.name.trim() === '') {
            errors.push('name es requerido');
        } else if (data.name.length > MAX_NAME_LENGTH) {
            errors.push(`name excede ${MAX_NAME_LENGTH} caracteres`);
        }

        // Manufacturer validation
        if (!data.manufacturer) {
            errors.push('manufacturer es requerido');
        } else if (!manufacturers.includes(data.manufacturer)) {
            errors.push(`manufacturer '${data.manufacturer}' no es válido`);
        }

        // Brand validation
        if (!data.brand) {
            errors.push('brand es requerido');
        } else if (!brands.includes(data.brand)) {
            errors.push(`brand '${data.brand}' no es válido`);
        }

        // Scale validation
        if (!data.scale) {
            errors.push('scale es requerido');
        } else if (!scales.includes(data.scale)) {
            errors.push(`scale '${data.scale}' no es válido`);
        }

        // Color validation
        if (!data.color) {
            errors.push('color es requerido');
        } else if (!colors.includes(data.color)) {
            errors.push(`color '${data.color}' no es válido`);
        }

        // Condition validation
        if (!data.condition) {
            errors.push('condition es requerido');
        } else if (!carConditions.includes(data.condition)) {
            errors.push(`condition '${data.condition}' no es válido`);
        }

        // Optional fields validation
        if (data.series && data.series.length > MAX_SERIES_LENGTH) {
            errors.push(`series excede ${MAX_SERIES_LENGTH} caracteres`);
        }

        if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
            errors.push(`description excede ${MAX_DESCRIPTION_LENGTH} caracteres`);
        }

        return errors;
    }

    async bulkCreateCars(
        cars: ImportCarRowDTO[], 
        userId: number
    ): Promise<ImportResultDTO> {
        if (cars.length > MAX_ROWS) {
            throw new BadRequestException(`El array excede el máximo de ${MAX_ROWS} autos.`);
        }

        const errors: { index: number; name: string; error: string }[] = [];
        const validCars: CarToDB[] = [];

        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            const validationErrors = this.validateRowData(car);
            
            if (validationErrors.length > 0) {
                errors.push({
                    index: i,
                    name: car.name || `Fila ${i + 1}`,
                    error: validationErrors.join(', ')
                });
                continue;
            }

            // Derive country from brand
            const country = brandNationalities[car.brand] || '';

            validCars.push(new CarToDB(
                userId,
                car.name,
                car.color,
                car.brand,
                car.scale,
                car.manufacturer,
                car.condition,
                false, // wished
                car.description || '',
                '', // designer
                car.series || '',
                country
            ));
        }

        // Insert valid cars
        let imported = 0;
        for (const carData of validCars) {
            try {
                const result = await createCar(carData);
                if (result) {
                    imported++;
                } else {
                    console.error('Failed to create car:', carData.name);
                    errors.push({
                        index: validCars.indexOf(carData),
                        name: carData.name,
                        error: 'Error al guardar en base de datos'
                    });
                }
            } catch (error) {
                console.error('Exception creating car:', carData.name, error);
                errors.push({
                    index: validCars.indexOf(carData),
                    name: carData.name,
                    error: 'Error de base de datos'
                });
            }
        }

        const failed = cars.length - imported;
        const success = failed === 0;

        return new ImportResultDTO(success, imported, failed, errors.length > 0 ? errors : undefined);
    }
}
