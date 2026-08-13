import type {
  Paciente,
  Prioridade,
} from "@/models/paciente";

import { listarPacientes } from "@/services/paciente-service";

export function listarPacientesPorPrioridade(
  prioridade: Prioridade,
): Paciente[] {
    // adotei filter pois pode ter mais de um paciente com a mesma prioridade
  return listarPacientes().filter(
    (paciente) => paciente.prioridade === prioridade,
  );
}

export function buscarPacientePorNome(
  nome: string,
): Paciente | undefined {
    // normalizando o nome para evitar problemas com espaços e maiúsculas/minúsculas
  const nomeNormalizado = nome.trim().toLowerCase();
 // adotei find pois só quero o primeiro paciente que encontrar com o nome informado
  return listarPacientes().find(
    (paciente) =>
      paciente.nome.trim().toLowerCase() === nomeNormalizado,
  );
}

export function existePacienteEmergencial(): boolean {
    // adotei some pois só quero saber se existe pelo menos um paciente com prioridade "vermelho" e status "aguardando"
  return listarPacientes().some(
    (paciente) =>
      paciente.status === "aguardando" &&
      paciente.prioridade === "vermelho",
  );
}

export function listarNomesPacientes(): string[] {
    // adotei map para retornar apenas umn array com os nomes dos pacientes
  return listarPacientes().map(
    (paciente) => paciente.nome,
  );
}

export function gerarListaNomes(): string {
    // adotei join para retornar uma string com os nomes dos pacientes separados por vírgula 
    // ["Maria", "João", "Carlos"]
  return listarNomesPacientes().join(", ");
}