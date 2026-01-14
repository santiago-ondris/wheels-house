import { z } from "zod";

export const quickAddCarSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    color: z.string().min(1, "El color es requerido"),
    brand: z.string().min(1, "La marca es requerida"),
    scale: z.string().min(1, "La escala es requerida"),
    manufacturer: z.string().min(1, "El fabricante es requerido"),
});

export type QuickAddCarFormData = z.infer<typeof quickAddCarSchema>;

// Extended data to send to API (includes defaults)
export interface QuickAddCarPayload extends QuickAddCarFormData {
    condition: string;
    description: string;
    designer: string;
    series: string;
    country: string;
    pictures: string[];
}
