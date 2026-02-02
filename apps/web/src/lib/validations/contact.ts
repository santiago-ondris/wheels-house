import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(50, "El nombre es demasiado largo"),
    email: z
        .string()
        .min(1, "El email es obligatorio")
        .email("Ingresá un email válido (ej: mandaleplay@gmail.com)"),
    reason: z.enum(["BUG", "SUGGESTION", "GENERAL"], {
        message: "Seleccioná un motivo válido",
    }),
    message: z
        .string()
        .min(10, "El mensaje debe tener al menos 10 caracteres")
        .max(1000, "El mensaje es demasiado largo (máx. 1000 caracteres)"),
    honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
