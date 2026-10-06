import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"
import "./index.css";
import App from "./App.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { Toast } from "./components/Toast/Toast.jsx";
 
createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <Toast />
    <AuthProvider>
      <AccessibilityProvider>
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      </AccessibilityProvider>
    </AuthProvider>
  </NotificationProvider>,
);