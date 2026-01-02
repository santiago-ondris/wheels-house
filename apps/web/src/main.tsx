import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontFamily: 'Arvo, serif',
          },
          success: {
            iconTheme: {
              primary: '#D9731A',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#BF3939',
              secondary: 'white',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);