import type { Paciente } from "@/models/paciente";

function formatarTelefone(
  telefone: string | undefined,
): string {
  return telefone ?? "Não informado";
}

function formatarData(data: Date): string {
  return data.toLocaleString("pt-BR");
}

export function exibirPaciente(
  paciente: Paciente,
  titulo = "Paciente encontrado",
): void {
  console.log(`
------------------------------------
${titulo}
------------------------------------
ID: ${paciente.id}
Nome: ${paciente.nome}
Idade: ${paciente.idade} anos
CPF: ${paciente.cpf}
Telefone: ${formatarTelefone(paciente.telefone)}
Sintomas: ${paciente.sintomas.join(", ")}
Prioridade: ${paciente.prioridade}
Status: ${paciente.status}
Chegada: ${formatarData(paciente.dataChegada)}
`);
}