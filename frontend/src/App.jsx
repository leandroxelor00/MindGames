import { Home } from "./pages/Home.jsx";
import { GamePage } from "./pages/GamePage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Routes, Route } from "react-router-dom";
import { VisualMemory } from "./games/visual-memory/VisualMemory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game/:id" element={<GamePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
