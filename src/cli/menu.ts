import {
  fecharTerminal,
  perguntar,
} from "@/cli/terminal";

import { executarCadastroPaciente } from "@/cli/acoes/cadastrar-paciente";
import { executarListagemPacientes } from "@/cli/acoes/listar-paciente";
import { executarExibicaoFila } from "@/cli/acoes/exibir-fila";
import { executarChamadaProximoPaciente } from "@/cli/acoes/chamar-proximo-paciente";
import { executarFinalizacaoAtendimento } from "@/cli/acoes/finalizar-atendimento";
import { executarExibicaoEstatisticas } from "@/cli/acoes/exibir-estatisticas";
import { executarImportacaoPacientes } from "@/cli/acoes/importar-pacientes";
import { nomeSistema, versaoSistema } from "@/config/sistema";

import { executarConsultaPaciente } from "./acoes/consultar-paciente";

type OpcaoMenu =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "0";

function exibirCabecalho(): void {
  console.clear();

  console.log("====================================");
  console.log(` ${nomeSistema}`);
  console.log(` Versão: ${versaoSistema}`);
  console.log("====================================");
}

function exibirOpcoes(): void {
  console.log(`
1. Cadastrar paciente
2. Listar pacientes
3. Consultar paciente
4. Exibir fila de atendimento
5. Chamar próximo paciente
6. Finalizar atendimento
7. Exibir estatísticas
8. Importar pacientes do JSON
0. Encerrar
`);
}

function opcaoValida(opcao: string): opcao is OpcaoMenu {
  const opcoes: OpcaoMenu[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "0",
  ];

  return opcoes.includes(opcao as OpcaoMenu);
}

async function pausar(): Promise<void> {
  await perguntar("\nPressione Enter para continuar...");
}

async function executarOpcao(
  opcao: OpcaoMenu,
): Promise<boolean> {
  switch (opcao) {
    case "1":
      await executarCadastroPaciente();
      await pausar();
      return true;

    case "2":
     	executarListagemPacientes();
      await pausar();
      return true;

    case "3":
      await executarConsultaPaciente();
      await pausar();
      return true;

    case "4":
      await executarExibicaoFila();
      await pausar();
      return true;

    case "5":
      executarChamadaProximoPaciente();
      await pausar();
      return true;

    case "6":
      await executarFinalizacaoAtendimento();
      await pausar();
      return true;

    case "7":
      await executarExibicaoEstatisticas();
      await pausar();
      return true;

    case "8":
      await executarImportacaoPacientes();
      await pausar();
      return true;

    case "0":
      console.log("\nSistema encerrado.");
      return false;
  }
}

export async function iniciarMenu(): Promise<void> {
  let sistemaAtivo = true;

  while (sistemaAtivo) {
    exibirCabecalho();
    exibirOpcoes();

    const opcao = await perguntar(
      "Escolha uma opção: ",
    );

    if (!opcaoValida(opcao)) {
      console.log("\nOpção inválida.");
      await pausar();
      continue;
    }

    sistemaAtivo = await executarOpcao(opcao);
  }

  fecharTerminal();
}