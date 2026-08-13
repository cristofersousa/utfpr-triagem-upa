import type { Paciente } from "@/models/paciente";

import { listarFilaAtendimento } from "@/services/fila-service";

function formatarHorario(data: Date): string {
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function calcularMinutosEspera(
  dataChegada: Date,
): number {
  const agora = new Date();

  const diferencaMilissegundos =
    agora.getTime() - dataChegada.getTime();

  const minutos = Math.floor(
    diferencaMilissegundos / 1000 / 60,
  );

  return Math.max(minutos, 0);
}

function formatarTempoEspera(
  minutosTotais: number,
): string {
  if (minutosTotais < 1) {
    return "menos de 1 minuto";
  }

  if (minutosTotais < 60) {
    return `${minutosTotais} minuto${
      minutosTotais === 1 ? "" : "s"
    }`;
  }

  const horas = Math.floor(
    minutosTotais / 60,
  );

  const minutosRestantes =
    minutosTotais % 60;

  const textoHoras =
    `${horas} hora${horas === 1 ? "" : "s"}`;

  if (minutosRestantes === 0) {
    return textoHoras;
  }

  const textoMinutos =
    `${minutosRestantes} minuto${
      minutosRestantes === 1 ? "" : "s"
    }`;

  return `${textoHoras} e ${textoMinutos}`;
}

function exibirItemFila(
  paciente: Paciente,
  posicao: number,
): void {
  const minutosEspera = calcularMinutosEspera(
    paciente.dataChegada,
  );

  console.log(`
${posicao}. ${paciente.nome}
   ID: ${paciente.id}
   Prioridade: ${paciente.prioridade}
   Chegada: ${formatarHorario(paciente.dataChegada)}
   Tempo de espera: ${formatarTempoEspera(minutosEspera)}
`);
}

export function executarExibicaoFila(): void {
  const fila = listarFilaAtendimento();

  console.log("\n====================================");
  console.log(" Fila de atendimento");
  console.log("====================================");

  if (fila.length === 0) {
    console.log(
      "\nNão existem pacientes aguardando atendimento.",
    );

    return;
  }

  console.log(
    `\nPacientes aguardando: ${fila.length}`,
  );

  fila.forEach((paciente, indice) => {
    exibirItemFila(paciente, indice + 1);
  });
}