import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import styles from "./Register.module.css";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // Valida se as senhas são iguais antes de chamar a API
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Valida o tamanho mínimo da senha
    if (password.length < 8) {
      setError("A senha deve ter mais de 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(email, password);

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Criar conta no MindGames</h2>

        <p className={styles.subtitle}>
          Crie sua conta para acompanhar sua evolução nos jogos.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18v12H3V6Zm0 0 9 7 9-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 11V7a4 4 0 0 1 8 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 11V7a4 4 0 0 1 8 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              className={styles.input}
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta?{" "}
          <Link className={styles.footerLink} to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}