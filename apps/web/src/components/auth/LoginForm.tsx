import { useState } from "react";
import { Mail, User } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { loginSchema, loginEmailSchema, LoginFormData } from "../../lib/validations/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    
    const schema = loginType === "email" ? loginEmailSchema : loginSchema;
    const result = schema.safeParse({ credential, password });

    if (!result.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
  
    try {
      await login(credential, password);
      toast.success("¡Bienvenido de vuelta!");
      onSuccess?.();
    } catch (err: any) {
      console.log("Error completo:", err);
      const errorMsg = err?.error || "Error al iniciar sesión";
      
      if (errorMsg.includes("Invalid credentials")) {
        setGeneralError("Usuario o contraseña incorrectos");
      } else {
        setGeneralError("Error al iniciar sesión. Intentá de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-accent uppercase tracking-widest text-xs">
            {loginType === "email" ? "Email" : "Usuario"}
          </label>
          <button
            type="button"
            onClick={() => setLoginType(loginType === "email" ? "username" : "email")}
            className="text-white/50 hover:text-accent text-xs transition-colors"
          >
            Usar {loginType === "email" ? "usuario" : "email"}
          </button>
        </div>
        <div className="relative">
          {loginType === "email" ? (
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          ) : (
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          )}
          <input
            type={loginType === "email" ? "email" : "text"}
            placeholder={loginType === "email" ? "tu@email.com" : "tu_usuario"}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        {fieldErrors.credential && <p className="text-danger text-[10px] mt-1 ml-1">{fieldErrors.credential}</p>}
      </div>

      <div>
        <label className="block text-accent uppercase tracking-widest text-xs mb-2">
          Contraseña
        </label>
        <PasswordInput
          id="login-password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-white/50 hover:text-accent text-xs transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {generalError && (
        <p className="text-danger text-sm text-center">{generalError}</p>
      )}    

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white font-bold rounded-xl transition-colors"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}