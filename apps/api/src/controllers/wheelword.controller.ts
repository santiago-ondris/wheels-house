import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { WheelwordService } from '../services/wheelword.service';
import { SubmitGuessDTO } from '../dto/wheelword.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../validators/auth.validator';

@Controller('wheelword')
export class WheelwordController {
    constructor(private readonly wheelwordService: WheelwordService) { }

    /**
     * GET /wheelword/today
     * Obtiene el juego del día (gameNumber, wordLength, gameDate)
     * No requiere autenticación
     */
    @Get('today')
    async getTodaysGame() {
        return await this.wheelwordService.getTodaysGame();
    }

    /**
     * POST /wheelword/guess
     * Envía un intento y recibe feedback
     * Autenticación opcional: si está logueado, guarda el progreso
     */
    @Post('guess')
    @HttpCode(HttpStatus.OK)
    @UseGuards(OptionalJwtAuthGuard)
    async submitGuess(
        @Request() req,
        @Body() guessData: SubmitGuessDTO,
        @Body('sessionAttempts') sessionAttempts?: string[]
    ) {
        const userId = req.user?.userId || null;

        return await this.wheelwordService.submitGuess(
            guessData.guess,
            userId,
            sessionAttempts || []
        );
    }

    /**
     * GET /wheelword/state
     * Obtiene el estado actual del juego para el usuario logueado
     * Requiere autenticación
     */
    @Get('state')
    @UseGuards(JwtAuthGuard)
    async getUserGameState(@Request() req) {
        return await this.wheelwordService.getUserGameState(req.user.userId);
    }

    /**
     * GET /wheelword/stats
     * Obtiene las estadísticas del usuario
     * Requiere autenticación
     */
    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getUserStats(@Request() req) {
        return await this.wheelwordService.getUserStats(req.user.userId);
    }

    /**
     * POST /wheelword/share
     * Genera el texto para compartir resultado
     * Requiere autenticación
     */
    @Post('share')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async generateShareText(
        @Request() req,
        @Body('gameNumber') gameNumber: number,
        @Body('attempts') attempts: string[],
        @Body('feedbacks') feedbacks: string[][],
        @Body('won') won: boolean
    ) {
        const text = this.wheelwordService.generateShareText(gameNumber, attempts, feedbacks, won);
        return { text };
    }
}
