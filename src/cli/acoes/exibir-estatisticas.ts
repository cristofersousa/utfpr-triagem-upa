import type {
  Prioridade,
  StatusAtendimento,
} from "@/models/paciente";

import { gerarEstatisticas } from "@/services/estatistica-service";

const ROTULOS_PRIORIDADE: Record<
  Prioridade,
  string
> = {
  vermelho: "Vermelho — Emergência",
  laranja: "Laranja — Muito urgente",
  amarelo: "Amarelo — Urgente",
  verde: "Verde — Pouco urgente",
  azul: "Azul — Não urgente",
};

const ROTULOS_STATUS: Record<
  StatusAtendimento,
  string
> = {
  aguardando: "Aguardando",
  "em-atendimento": "Em atendimento",
  atendido: "Atendido",
  cancelado: "Cancelado",
};

function calcularPercentual(
  quantidade: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  return (quantidade / total) * 100;
}

export function executarExibicaoEstatisticas(): void {
  const estatisticas = gerarEstatisticas();

  console.log("\n====================================");
  console.log(" Estatísticas de atendimento");
  console.log("====================================");

  if (estatisticas.totalPacientes === 0) {
    console.log(
      "\nNão existem pacientes cadastrados para gerar estatísticas.",
    );

    return;
  }

  console.log(
    `\nTotal de pacientes: ${estatisticas.totalPacientes}`,
  );

  console.log(
    `Idade média: ${estatisticas.idadeMedia.toFixed(1)} anos`,
  );

  console.log("\nPacientes por status:");

  const status = Object.entries(
    estatisticas.pacientesPorStatus,
  ) as Array<[StatusAtendimento, number]>;

  status.forEach(([statusAtendimento, quantidade]) => {
    const rotulo =
      ROTULOS_STATUS[statusAtendimento];

    console.log(`- ${rotulo}: ${quantidade}`);
  });

  console.log("\nPacientes por prioridade:");

  const prioridades = Object.entries(
    estatisticas.pacientesPorPrioridade,
  ) as Array<[Prioridade, number]>;

  prioridades.forEach(
    ([prioridade, quantidade]) => {
      const percentual = calcularPercentual(
        quantidade,
        estatisticas.totalPacientes,
      );

      const rotulo =
        ROTULOS_PRIORIDADE[prioridade];

      console.log(
        `- ${rotulo}: ${quantidade} (${percentual.toFixed(1)}%)`,
      );
    },
  );
}