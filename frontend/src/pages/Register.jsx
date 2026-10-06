import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { getUserId, resetUserId } from "../services/userId";
import { migrateScores } from "../services/scoreService";

import { Speakable } from "../components/Speakable/Speakable";

import styles from "./Register.module.css";

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/;

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedUsername = username.trim();

    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setError("Username inválido. Use 3 a 16 letras, números ou _");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(
        email,
        password,
        trimmedUsername,
      );

      setUser(data.user);

      try {
        const userIdAnonimo = getUserId();
        await migrateScores(userIdAnonimo);
        resetUserId();
      } catch (err) {
        console.error("Erro ao migrar scores:", err);
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div
          className={styles.badge}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Speakable
          as="h2"
          text="Criar conta no MindGames"
        >
          <h2 className={styles.title}>
            Criar conta no MindGames
          </h2>
        </Speakable>

        <Speakable
          as="p"
          text="Crie sua conta para acompanhar sua evolução nos jogos."
        >
          <p className={styles.subtitle}>
            Crie sua conta para acompanhar sua evolução nos jogos.
          </p>
        </Speakable>

        {error && (
          <Speakable
            as="div"
            text={`Erro no cadastro: ${error}`}
          >
            <div
              className={styles.error}
              role="alert"
            >
              {error}
            </div>
          </Speakable>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputGroup}>
            <Speakable
              as="span"
              text="Campo de email. Digite seu endereço de email."
            >
              <label
                className={styles.inputLabel}
                htmlFor="register-email"
              >
                Email
              </label>
            </Speakable>

            <span
              className={styles.inputIcon}
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 6h18v12H3V6Zm0 0 9 7 9-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <Speakable
              as="span"
              text="Campo de email. Digite seu endereço de email."
            >
              <input
                id="register-email"
                className={styles.input}
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Speakable>
          </div>

          <div className={styles.inputGroup}>
            <Speakable
              as="span"
              text="Campo de username. Escolha um nome de usuário de 3 a 16 caracteres, usando letras, números ou sublinhado."
            >
              <label
                className={styles.inputLabel}
                htmlFor="register-username"
              >
                Username
              </label>
            </Speakable>

            <span
              className={styles.inputIcon}
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M4 20c0-4 4-6 8-6s8 2 8 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <Speakable
              as="span"
              text="Campo de username. Escolha um username de 3 a 16 caracteres. Ele aparecerá no ranking."
            >
              <input
                id="register-username"
                className={styles.input}
                type="text"
                placeholder="Escolha um username (aparece no ranking)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                maxLength={16}
                pattern="[A-Za-z0-9_]{3,16}"
                title="3 a 16 letras, números ou _"
                required
              />
            </Speakable>
          </div>

          <div className={styles.inputGroup}>
            <Speakable
              as="span"
              text="Campo de senha. A senha precisa ter pelo menos 8 caracteres."
            >
              <label
                className={styles.inputLabel}
                htmlFor="register-password"
              >
                Senha
              </label>
            </Speakable>

            <span
              className={styles.inputIcon}
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
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

            <Speakable
              as="span"
              text="Campo de senha. Digite uma senha com pelo menos 8 caracteres."
            >
              <input
                id="register-password"
                className={styles.input}
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </Speakable>
          </div>

          <div className={styles.inputGroup}>
            <Speakable
              as="span"
              text="Campo de confirmação de senha. Digite novamente sua senha."
            >
              <label
                className={styles.inputLabel}
                htmlFor="register-confirm-password"
              >
                Confirmar senha
              </label>
            </Speakable>

            <span
              className={styles.inputIcon}
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
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

            <Speakable
              as="span"
              text="Campo de confirmação de senha. Digite novamente sua senha."
            >
              <input
                id="register-confirm-password"
                className={styles.input}
                type="password"
                placeholder="Digite novamente sua senha"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            </Speakable>
          </div>

          <Speakable
            as="span"
            text={
              loading
                ? "Criando conta. Aguarde."
                : "Botão Criar conta. Pressione para criar sua conta."
            }
          >
            <button
              className={styles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Criando conta..."
                : "Criar conta"}
            </button>
          </Speakable>
        </form>

        <Speakable
          as="p"
          text="Já tem uma conta?"
        >
          <p className={styles.footerText}>
            Já tem uma conta?{" "}
            <Speakable
              as="span"
              text="Entrar. Link para acessar sua conta."
            >
              <Link
                className={styles.footerLink}
                to="/login"
              >
                Entrar
              </Link>
            </Speakable>
          </p>
        </Speakable>
      </div>
    </div>
  );
}