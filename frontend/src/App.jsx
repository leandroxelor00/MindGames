import { Home } from "./pages/Home.jsx";
import { GamePage } from "./pages/GamePage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound.jsx";
import { Settings } from "./pages/Settings.jsx";
import { useEffect } from "react";
import { reenviarPendentes } from "./services/scoreService";

function App() {
  useEffect(() => {
    reenviarPendentes();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game/:id" element={<GamePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
