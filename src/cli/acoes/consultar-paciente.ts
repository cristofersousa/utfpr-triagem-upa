import { exibirPaciente } from "@/cli/exibidores/paciente";

import { perguntar } from "@/cli/terminal";

import { buscarPacientePorNome } from "@/services/consulta-service";

import {
  buscarPacientePorId,
  listarPacientes,
} from "@/services/paciente-service";

type OpcaoConsulta = "1" | "2" | "0";

function exibirOpcoesConsulta(): void {
  console.log(`
1. Consultar por ID
2. Consultar por nome
0. Voltar ao menu principal
`);
}

function opcaoConsultaValida(
  opcao: string,
): opcao is OpcaoConsulta {
  return (
    opcao === "1" ||
    opcao === "2" ||
    opcao === "0"
  );
}

async function consultarPorId(): Promise<void> {
  const id = (
    await perguntar(
      "Informe o ID do paciente: ",
    )
  ).toUpperCase();

  if (!id) {
    console.log("\nO ID deve ser informado.");
    return;
  }

  const paciente = buscarPacientePorId(id);

  if (!paciente) {
    console.log(
      `\nPaciente com o ID ${id} não encontrado.`,
    );

    return;
  }

  exibirPaciente(paciente);
}

async function consultarPorNome(): Promise<void> {
  const nome = await perguntar(
    "Informe o nome completo do paciente: ",
  );

  if (!nome) {
    console.log("\nO nome deve ser informado.");
    return;
  }

  const paciente = buscarPacientePorNome(nome);

  if (!paciente) {
    console.log(
      `\nPaciente com o nome "${nome}" não encontrado.`,
    );

    return;
  }

  exibirPaciente(paciente);
}

export async function executarConsultaPaciente():
  Promise<void> {
  console.log("\n====================================");
  console.log(" Consulta de paciente");
  console.log("====================================");

  if (listarPacientes().length === 0) {
    console.log(
      "\nNão existem pacientes cadastrados.",
    );

    return;
  }

  exibirOpcoesConsulta();

  const opcao = await perguntar(
    "Escolha uma opção: ",
  );

  if (!opcaoConsultaValida(opcao)) {
    console.log("\nOpção de consulta inválida.");
    return;
  }

  switch (opcao) {
    case "1":
      await consultarPorId();
      break;

    case "2":
      await consultarPorNome();
      break;

    case "0":
      break;
  }
}