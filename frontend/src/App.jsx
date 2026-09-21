import { Home } from "./pages/Home.jsx";
import { GamePage } from "./pages/GamePage.jsx";

import { Routes, Route } from "react-router-dom";
import { VisualMemory } from "./games/visual-memory/VisualMemory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  );
}

export default App;
