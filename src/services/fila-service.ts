import { PESO_PRIORIDADE } from "@/config/prioridades";
import type { Paciente } from "@/models/paciente";

import {
  alterarStatusAtendimento,
  listarPacientes,
  buscarPacientePorId
} from "@/services/paciente-service";


export function listarFilaAtendimento(): Paciente[] {
  const pacientesAguardando = listarPacientes().filter(
    (paciente) => paciente.status === "aguardando",
  );

  return [...pacientesAguardando].sort((pacienteA, pacienteB) => {
    const diferencaPrioridade =
      PESO_PRIORIDADE[pacienteB.prioridade] -
      PESO_PRIORIDADE[pacienteA.prioridade];

    if (diferencaPrioridade !== 0) {
      return diferencaPrioridade;
    }

    return (
      pacienteA.dataChegada.getTime() -
      pacienteB.dataChegada.getTime()
    );
  });
}

export function chamarProximoPaciente(): Paciente | undefined {
  const fila = listarFilaAtendimento();
  const proximoPaciente = fila[0];

  if (!proximoPaciente) {
    return undefined;
  }

  return alterarStatusAtendimento(
    proximoPaciente.id,
    "em-atendimento",
  );
}

export function finalizarAtendimento(
  id: string,
): Paciente | undefined {
  const paciente = buscarPacientePorId(id);

  if (
    !paciente ||
    paciente.status !== "em-atendimento"
  ) {
    return undefined;
  }

  return alterarStatusAtendimento(
    paciente.id,
    "atendido",
  );
}