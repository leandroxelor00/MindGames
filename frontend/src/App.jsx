import { Home } from "./pages/Home.jsx";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound.jsx";
import {  lazy, Suspense, useEffect } from "react";
import { reenviarPendentes } from "./services/scoreService";

const Dashboard = lazy(() =>
  import("./pages/Dashboard.jsx").then((module) => ({
    default: module.Dashboard,
  })),
);

const GamePage = lazy(() =>
  import("./pages/GamePage.jsx").then((module) => ({
    default: module.GamePage,
  })),
);

const Login = lazy(() =>
  import("./pages/Login.jsx").then((module) => ({
    default: module.Login,
  })),
);

const Register = lazy(() =>
  import("./pages/Register.jsx").then((module) => ({
    default: module.Register,
  })),
);

const Settings = lazy(() =>
  import("./pages/Settings.jsx").then((module) => ({
    default: module.Settings,
  })),
);

function App() {
  useEffect(() => {
    reenviarPendentes();
  }, []);
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
