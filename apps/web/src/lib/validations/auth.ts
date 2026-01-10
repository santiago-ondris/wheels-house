import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(20, "El usuario no puede tener más de 20 caracteres"),
    email: z.string().email("Email inválido"),
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    biography: z.string().max(200).optional(),
    picture: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  credential: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const loginEmailSchema = loginSchema.extend({
  credential: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;