import { useNotification } from "../../context/NotificationContext";
import styles from "./Toast.module.css";

export function Toast() {
  const { mensagem } = useNotification();

  if (!mensagem) {
    return null;
  }

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {mensagem}
    </div>
  );
}