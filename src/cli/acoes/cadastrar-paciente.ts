import { perguntar } from "@/cli/terminal";

import {
  ErroAplicacao,
  ErroValidacaoPaciente,
} from "@/errors/erro-aplicacao";

import { cadastrarPaciente } from "@/services/paciente-service";
import { validarNivelDor } from "@/validators/paciente-validator";

async function perguntarNumero(
  mensagem: string,
): Promise<number> {
  const resposta = await perguntar(mensagem);

  return Number(resposta);
}

async function perguntarSimOuNao(
  mensagem: string,
): Promise<boolean> {
  while (true) {
    const resposta = (
      await perguntar(`${mensagem} (s/n): `)
    ).toLowerCase();

    if (resposta === "s" || resposta === "sim") {
      return true;
    }

    if (resposta === "n" || resposta === "nao") {
      return false;
    }

    console.log(
      'Resposta inválida. Digite "s" para sim ou "n" para não.',
    );
  }
}

async function perguntarNivelDor(): Promise<number> {
  while (true) {
    const nivelDor = await perguntarNumero(
      "Nível da dor, de 0 a 10: ",
    );

    if (validarNivelDor(nivelDor)) {
      return nivelDor;
    }

    console.log(
      "O nível da dor deve ser um número inteiro entre 0 e 10.",
    );
  }
}

function converterSintomas(
  resposta: string,
): string[] {
  return resposta
    .split(",")
    .map((sintoma) => sintoma.trim())
    .filter((sintoma) => sintoma.length > 0);
}

function exibirErrosValidacao(
  erro: ErroValidacaoPaciente,
): void {
  console.error(
    "\nNão foi possível cadastrar o paciente:",
  );

  erro.erros.forEach(({ codigo, mensagem }) => {
    console.error(`[${codigo}] ${mensagem}`);
  });
}

export async function executarCadastroPaciente():
  Promise<void> {
  console.log("\n====================================");
  console.log(" Cadastro de paciente");
  console.log("====================================");

  const nome = await perguntar("Nome completo: ");
  const idade = await perguntarNumero("Idade: ");
  const cpf = await perguntar(
    "CPF no formato 000.000.000-00: ",
  );

  const telefone = await perguntar(
    "Telefone no formato (00) 00000-0000 (opcional): ",
  );

  const sintomasResposta = await perguntar(
    "Sintomas separados por vírgula: ",
  );

  const sintomas = converterSintomas(
    sintomasResposta,
  );

  console.log("\nDados da triagem:");

  const nivelDor = await perguntarNivelDor();

  const inconsciente = await perguntarSimOuNao(
    "O paciente está inconsciente?",
  );

  const dificuldadeRespirar =
    await perguntarSimOuNao(
      "O paciente apresenta dificuldade para respirar?",
    );

  const sangramentoIntenso =
    await perguntarSimOuNao(
      "O paciente apresenta sangramento intenso?",
    );

  try {
    const dadosPaciente = {
      nome,
      idade,
      cpf,
      sintomas,

      ...(telefone
        ? { telefone }
        : {}),
    };

    const paciente = cadastrarPaciente(
      dadosPaciente,
      {
        nivelDor,
        inconsciente,
        dificuldadeRespirar,
        sangramentoIntenso,
      },
    );

    console.log(
      "\nPaciente cadastrado com sucesso!",
    );

    console.log(`ID: ${paciente.id}`);
    console.log(`Nome: ${paciente.nome}`);

    console.log(
      `Prioridade: ${paciente.prioridade}`,
    );

    console.log(`Status: ${paciente.status}`);

    console.log(
      `Chegada: ${paciente.dataChegada.toLocaleString("pt-BR")}`,
    );
  } catch (erro: unknown) {
    if (erro instanceof ErroValidacaoPaciente) {
      exibirErrosValidacao(erro);
      return;
    }

    if (erro instanceof ErroAplicacao) {
      console.error(
        `\n[${erro.codigo}] ${erro.message}`,
      );
      return;
    }

    throw erro;
  }
}