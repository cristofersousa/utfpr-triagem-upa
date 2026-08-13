import type { EstatisticasAtendimento } from "@/models/estatistica";
import { listarPacientes } from "@/services/paciente-service";
import type {
  Paciente,
  StatusAtendimento,
} from "@/models/paciente";

function criarEstatisticasIniciais(): EstatisticasAtendimento {
  return {
    totalPacientes: 0,
    totalAguardando: 0,
    totalEmAtendimento: 0,
    totalAtendidos: 0,
    totalCancelados: 0,
    idadeMedia: 0,

    pacientesPorPrioridade: {
      vermelho: 0,
      laranja: 0,
      amarelo: 0,
      verde: 0,
      azul: 0,
    },

    pacientesPorStatus: {
      aguardando: 0,
      "em-atendimento": 0,
      atendido: 0,
      cancelado: 0,
    },
  };
}

function incrementarTotalPorStatus(
  status: StatusAtendimento,
  estatisticas: EstatisticasAtendimento,
): void {
  switch (status) {
    case "aguardando":
      estatisticas.totalAguardando++;
      break;

    case "em-atendimento":
      estatisticas.totalEmAtendimento++;
      break;

    case "atendido":
      estatisticas.totalAtendidos++;
      break;

    case "cancelado":
      estatisticas.totalCancelados++;
      break;
  }
}

function acumularEstatisticasPaciente(
  estatisticas: EstatisticasAtendimento,
  paciente: Paciente,
): EstatisticasAtendimento {
  estatisticas.totalPacientes++;

  estatisticas.pacientesPorPrioridade[
    paciente.prioridade
  ]++;

  estatisticas.pacientesPorStatus[
    paciente.status
  ]++;

  incrementarTotalPorStatus(
    paciente.status,
    estatisticas,
  );

  return estatisticas;
}

export function calcularIdadeMedia(
  pacientes: ReadonlyArray<Paciente> = listarPacientes(),
): number {
  if (pacientes.length === 0) {
    return 0;
  }

  const somaIdades = pacientes.reduce(
    (acumulador, paciente) =>
      acumulador + paciente.idade,
    0,
  );

  return somaIdades / pacientes.length;
}

export function gerarEstatisticas(): EstatisticasAtendimento {
  const pacientes = listarPacientes();

  const estatisticas = pacientes.reduce(
    acumularEstatisticasPaciente,
    criarEstatisticasIniciais(),
  );

  estatisticas.idadeMedia =
    calcularIdadeMedia(pacientes);

  return estatisticas;
}