import { nomeSistema, versaoSistema } from "@/config/sistema";

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