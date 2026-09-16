import { Home } from "./pages/Home.jsx";
import { GamePage } from "./pages/GamePage.jsx";

import { Routes, Route } from "react-router-dom";
import { Sandbox } from "./games/visual-memory/Sandbox.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sandbox />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  );
}

export default App;
