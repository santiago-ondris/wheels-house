import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import LoginForm from "./LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onClose();
    const token = localStorage.getItem("auth_token");
    if (token) {
      // const payload = token.split('.')[1];
      //const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // const decoded = JSON.parse(atob(base64));
      navigate(`/collection/`);
    }
  };

  const handleGoToRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar sesión">
      <LoginForm onSuccess={handleLoginSuccess} />
      
      <div className="mt-6 text-center">
        <p className="text-white/50 text-sm">
          ¿No tenés cuenta?{" "}
          <button
            onClick={handleGoToRegister}
            className="text-accent hover:text-accent/80 font-bold transition-colors"
          >
            Registrate
          </button>
        </p>
      </div>
    </Modal>
  );
}