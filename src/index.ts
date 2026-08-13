import { nomeSistema, versaoSistema } from "@/config/sistema";
import type { Paciente } from "@/models/paciente";
import {
  atualizarPaciente,
  cadastrarPaciente,
  listarPacientes,
} from "@/services/paciente-service";

import {
  ErroAplicacao,
  ErroValidacaoPaciente,
} from "@/errors/erro-aplicacao";

import {
  chamarProximoPaciente,
  finalizarAtendimento,
  listarFilaAtendimento,
} from "@/services/fila-service";

import {
  buscarPacientePorNome,
  existePacienteEmergencial,
  gerarListaNomes,
  listarPacientesPorPrioridade,
} from "@/services/consulta-service";

import {
  calcularIdadeMedia,
  gerarEstatisticas,
} from "@/services/estatistica-service";


const sistemaAtivo: boolean = true;
const unidade: string = "UPA Central";
const quantidadePacientes: number = 0;
const atendimentoDisponivel: boolean = true;

console.log("====================================");
console.log(` ${nomeSistema}` );
console.log(` Versão: ${versaoSistema}`);
console.log("====================================");

if (sistemaAtivo) {
  console.log("Sistema iniciado com sucesso!");
}
  console.log(
  `A ${unidade} possui ${quantidadePacientes} pacientes, aguardando atendimento.`,
  );

const statusAtendimento = atendimentoDisponivel ? "Atendimento disponível" : "Atendimento indisponível";
console.log(`Status do atendimento: ${statusAtendimento}`);

const maria = cadastrarPaciente({
  nome: "Maria da Silva",
  idade: 42,
  cpf: "123.456.789-00",
  telefone: "(47) 99999-9999",
  sintomas: ["dor de cabeça"],
});

const joao = cadastrarPaciente({
  nome: "João dos Santos",
  idade: 68,
  cpf: "987.654.321-00",
  sintomas: ["falta de ar", "dor no peito"],
});

const pacienteAtualizado = atualizarPaciente(maria.id, {
  prioridade: "laranja",
  sintomas: [...maria.sintomas, "tontura"],
});

console.log("\nPacientes cadastrados:");

console.log("\nFila de atendimento:");

listarFilaAtendimento().forEach((paciente, indice) => {
  console.log(
    `${indice + 1}. ${paciente.nome} — ${paciente.prioridade}`,
  );
});

listarPacientes().forEach((paciente) => {
  console.log(`
ID: ${paciente.id}
Nome: ${paciente.nome}
Idade: ${paciente.idade} anos
Sintomas: ${paciente.sintomas.join(", ")}
Prioridade: ${paciente.prioridade}
Status: ${paciente.status}
Chegada: ${paciente.dataChegada.toLocaleString("pt-BR")}
  `);
});

if (pacienteAtualizado) {
  console.log(
    `${pacienteAtualizado.nome} foi atualizado para a prioridade ${pacienteAtualizado.prioridade}.`,
  );
}

console.log(`Segundo paciente cadastrado: ${joao.nome}`);


console.log("\nConsultas:");

console.log(`Pacientes cadastrados: ${gerarListaNomes()}`);

const pacienteEncontrado =
  buscarPacientePorNome("Maria da Silva");

if (pacienteEncontrado) {
  console.log(
    `Paciente localizado: ${pacienteEncontrado.nome}`,
  );
} else {
  console.log("Paciente não encontrado.");
}

const pacientesAmarelos =
  listarPacientesPorPrioridade("amarelo");

console.log(
  `Pacientes amarelos: ${pacientesAmarelos.length}`,
);

const possuiEmergencia = existePacienteEmergencial();

console.log(
  possuiEmergencia
    ? "Existem pacientes em emergência."
    : "Não existem pacientes em emergência.",
);

const estatisticas = gerarEstatisticas();

console.log("\nEstatísticas:");

console.log(
  `Total de pacientes: ${estatisticas.totalPacientes}`,
);

console.log(
  `Aguardando: ${estatisticas.totalAguardando}`,
);

console.log(
  `Em atendimento: ${estatisticas.totalEmAtendimento}`,
);

console.log(
  `Atendidos: ${estatisticas.totalAtendidos}`,
);

console.log(
  `Cancelados: ${estatisticas.totalCancelados}`,
);

console.log(
  `Idade média: ${calcularIdadeMedia().toFixed(1)} anos`,
);

console.log("\nPacientes por prioridade:");

Object.entries(
  estatisticas.pacientesPorPrioridade,
).forEach(([prioridade, quantidade]) => {
  console.log(`${prioridade}: ${quantidade}`);
});
