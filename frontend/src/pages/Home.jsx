import { gamesRegistry } from "../games/registry";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  const { user, setUser } = useAuth();

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.brand}>MindGames</span>
        <div className={styles.navActions}>
          <Link to="/dashboard" className={styles.navLink}>
            Ver meu histórico
          </Link>

          {user ? (
            <div className={styles.navUser}>
              <span className={styles.navEmail}>
                Olá, <strong>{user.email}</strong>
              </span>
              <button className={styles.navButtonGhost} onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Entrar</Link>
              <Link to="/register" className={styles.navButtonPrimary}>Criar conta</Link>
            </>
          )}
        </div>
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.headline}>Treine sua mente com ciência.</h1>
        <p className={styles.subtitle}>
          Jogos curtos que medem atenção, memória e tempo de reação — acompanhe
          sua evolução partida após partida.
        </p>
      </header>

      <section>
        <h2 className={styles.sectionLabel}>Escolha um jogo</h2>
        <div className={styles.cardsContainer}>
          {gamesRegistry.map((registry) => (
            <Link
              className={styles.link}
              key={registry.id}
              to={`/game/${registry.id}`}
            >
              <div className={styles.card}>
                <span className={styles.cardName}>{registry.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}