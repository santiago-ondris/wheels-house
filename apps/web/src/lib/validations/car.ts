import { z } from "zod";

export const carSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    color: z.string().min(1, "El color es requerido"),
    brand: z.string().min(1, "La marca es requerida"),
    scale: z.string().min(1, "La escala es requerida"),
    manufacturer: z.string().min(1, "El fabricante es requerido"),
    description: z.string().optional().default(""),
    designer: z.string().optional().default(""),
    series: z.string().optional().default(""),
    pictures: z.array(z.string()).optional().default([]),
});

export type CarFormData = z.infer<typeof carSchema>;

