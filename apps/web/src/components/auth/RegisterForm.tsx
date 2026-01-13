import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, UserCircle } from "lucide-react";
import PasswordInput from "./PasswordInput";
import ImageCropperModal from "../ui/ImageCropperModal";
import { RegisterFormData, registerSchema } from "../../lib/validations/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    biography: "",
    picture: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: result.data.username,
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        password: result.data.password,
        biography: result.data.biography,
        picture: result.data.picture,
      });

      await login(result.data.username, result.data.password);
      toast.success("¡Cuenta creada exitosamente!");
      navigate('/onboarding');
    } catch (error: any) {
      const errorMsg = error?.error || "";

      if (errorMsg.includes("Username")) {
        setErrors({ username: "Este usuario ya está en uso" });
      } else if (errorMsg.includes("Email already")) {
        setErrors({ email: "Este email ya está registrado" });
      } else if (errorMsg.includes("Email address")) {
        setErrors({ email: "Email inválido" });
      } else if (errorMsg.includes("Password")) {
        setErrors({ password: "Debe tener al menos 8 caracteres, una mayúscula y una minúscula" });
      } else {
        toast.error("Error al crear la cuenta. Intentá de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setIsCropping(false);
    setIsUploadingImage(true);
    try {
      const { uploadImage } = await import("../../services/upload.service");
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      const imageUrl = await uploadImage(file, true);
      setFormData(prev => ({ ...prev, picture: imageUrl }));
      toast.success("¡Avatar listo!");
    } catch (error: any) {
      toast.error(error.message || "Error al subir la imagen");
    } finally {
      setIsUploadingImage(false);
      setTempImage(null);
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label htmlFor="username" className="block text-accent uppercase tracking-widest text-xs mb-2">
          Usuario
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            id="username"
            type="text"
            placeholder="tu_usuario"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        {errors.username && <p className="text-danger text-xs mt-1 ml-1">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-accent uppercase tracking-widest text-xs mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        {errors.email && <p className="text-danger text-xs mt-1 ml-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-accent uppercase tracking-widest text-xs mb-2">
            Nombre
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              id="firstName"
              type="text"
              placeholder="Jesus"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {errors.firstName && <p className="text-danger text-xs mt-1 ml-1">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-accent uppercase tracking-widest text-xs mb-2">
            Apellido
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              id="lastName"
              type="text"
              placeholder="Bertola"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {errors.lastName && <p className="text-danger text-xs mt-1 ml-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-accent uppercase tracking-widest text-xs mb-1">
          Contraseña
        </label>
        <p className="text-white/30 text-[10px] font-mono mb-2">
          Mínimo 8 caracteres, una mayúscula y una minúscula
        </p>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-accent uppercase tracking-widest text-xs mb-2">
          Confirmar Contraseña
        </label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
          error={errors.confirmPassword}
        />
      </div>

      <div className="pt-4 border-t border-white/5 space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-accent uppercase tracking-widest text-xs">
              Avatar (Opcional)
            </label>
            <span className="text-[10px] font-mono text-white/20 italic">Podes subirla después!</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-input-bg rounded-xl border border-white/5">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-accent/20 overflow-hidden bg-background flex items-center justify-center">
                {formData.picture ? (
                  <img src={formData.picture} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="text-white/20 w-8 h-8" />
                )}
              </div>
              {isUploadingImage && (
                <div className="absolute inset-0 bg-dark/60 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all border border-white/10">
                {isUploadingImage ? "SUBIENDO..." : "SUBIR FOTO"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
              {formData.picture && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, picture: "" })}
                  className="ml-4 text-red-400/60 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="biography" className="block text-accent uppercase tracking-widest text-xs">
              Biografía (Opcional)
            </label>
            <span className={`text-[10px] font-mono ${(formData.biography?.length ?? 0) >= 190 ? 'text-red-400' : 'text-white/20'}`}>
              {(formData.biography?.length ?? 0)}/200
            </span>
          </div>
          <textarea
            id="biography"
            placeholder="Bienvenidos sean todos..."
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value.slice(0, 200) })}
            maxLength={200}
            rows={3}
            className="w-full bg-input-bg px-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white font-bold rounded-xl transition-colors"
      >
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {isCropping && tempImage && (
        <ImageCropperModal
          image={tempImage}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          aspect={1 / 1}
          cropShape="round"
        />
      )}
    </motion.form>
  );
}