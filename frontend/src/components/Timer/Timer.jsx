export function Timer({ segundos, label = "Tempo" }) {
    return (
      <p>
        {label}: {segundos}s
      </p>
    );
  }