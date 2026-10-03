import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import styles from "./CognitiveRadar.module.css";

export function CognitiveRadar({ summary }) {
  const dados = [
    { categoria: "Memória", valor: summary.memoria },
    { categoria: "Atenção", valor: summary.atencao },
    { categoria: "Velocidade", valor: summary.velocidade },
    { categoria: "Lógica", valor: summary.logica },
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={dados}>
          <PolarGrid />
          <PolarAngleAxis dataKey="categoria" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />

          <Radar
            name="Desempenho"
            dataKey="valor"
            stroke="var(--cor-accent, #5b4fe8)"
            fill="var(--cor-accent, #5b4fe8)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>

      <p className={styles.somenteLeitorDeTela}>
        Resumo cognitivo: Memória {summary.memoria}%, Atenção{" "}
        {summary.atencao}%, Velocidade {summary.velocidade}%, Lógica{" "}
        {summary.logica}%.
      </p>
    </>
  );
}