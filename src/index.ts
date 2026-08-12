import { nomeSistema, versaoSistema } from "@/config/sistema";
import type { Paciente } from "@/models/paciente";

const sistemaAtivo: boolean = true;
const unidade: string = "UPA Central";
const quantidadePacientes: number = 0;
const atendimentoDisponivel: boolean = true;

// add an example patient
const pacienteExemplo: Paciente = {
  id: "PAC-001",
  nome: "Maria da Silva",
  idade: 42,
  cpf: "123.456.789-00",
  telefone: "(47) 99999-9999",
  sintomas: ["febre", "dor de cabeça", "náusea"],
  dataChegada: new Date(),
  prioridade: "amarelo",
  status: "aguardando",
};


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

console.log("\nPaciente cadastrado:");
console.log(`ID: ${pacienteExemplo.id}`);
console.log(`Nome: ${pacienteExemplo.nome}`);
console.log(`Idade: ${pacienteExemplo.idade} anos`);
console.log(`Sintomas: ${pacienteExemplo.sintomas.join(", ")}`);
console.log(`Prioridade: ${pacienteExemplo.prioridade}`);
console.log(`Status: ${pacienteExemplo.status}`);
console.log(
  `Chegada: ${pacienteExemplo.dataChegada.toLocaleString("pt-BR")}`,
);

pacienteExemplo.sintomas.join(", ")