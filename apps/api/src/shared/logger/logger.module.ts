import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        PinoLoggerModule.forRoot({
            pinoHttp: {
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                transport: process.env.NODE_ENV !== 'production'
                    ? {
                        target: 'pino-pretty',
                        options: {
                            colorize: true,
                            translateTime: 'SYS:standard',
                            ignore: 'pid,hostname',
                        },
                    }
                    : undefined,
                serializers: {
                    req: (req) => ({
                        id: req.id,
                        method: req.method,
                        url: req.url,
                        query: req.query,
                        params: req.params,
                    }),
                    res: (res) => ({
                        statusCode: res.statusCode,
                    }),
                    err: (err) => ({
                        type: err.type,
                        message: err.message,
                        stack: err.stack,
                    }),
                },
                customProps: (req, res) => ({
                    context: 'HTTP',
                }),
            },
        }),
    ],
    exports: [PinoLoggerModule],
})
export class LoggerModule { }
