import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { CODIGOS_ERRO } from "@/errors/codigos-erro";
import { ErroAplicacao } from "@/errors/erro-aplicacao";
import type { PacienteApi } from "@/models/paciente-api";

function aguardar(tempoMs: number): Promise<void> {
  return new Promise((resolverPromise) => {
    setTimeout(resolverPromise, tempoMs);
  });
}

function objetoPossuiEstruturaPaciente(
 //Adotei unknown pois dados externos não deve ser considerado confiavéis.
  valor: unknown,
): valor is PacienteApi {
  if (
    typeof valor !== "object" ||
    valor === null
  ) {
    return false;
  }

  const paciente = valor as Record<string, unknown>;

  const telefoneValido =
    paciente.telefone === undefined ||
    typeof paciente.telefone === "string";

  const sintomasValidos =
    Array.isArray(paciente.sintomas) &&
    paciente.sintomas.every(
      (sintoma) => typeof sintoma === "string",
    );

  return (
    typeof paciente.nome === "string" &&
    typeof paciente.idade === "number" &&
    typeof paciente.cpf === "string" &&
    telefoneValido &&
    sintomasValidos
  );
}

function validarRespostaApi(
  dados: unknown,
): dados is PacienteApi[] {
  return (
    Array.isArray(dados) &&
    dados.every(objetoPossuiEstruturaPaciente)
  );
}

export async function carregarPacientesApi(): Promise<
  PacienteApi[]
> {
  try {
    await aguardar(1000);

    const caminhoArquivo = resolve(
      process.cwd(),
      "data",
      "pacientes.json",
    );

    const conteudo = await readFile(
      caminhoArquivo,
      "utf-8",
    );

    const dados: unknown = JSON.parse(conteudo);

    if (!validarRespostaApi(dados)) {
      throw new Error(
        "A resposta da API possui uma estrutura inválida.",
      );
    }

    return dados;
  } catch (erro: unknown) {
    if (erro instanceof ErroAplicacao) {
      throw erro;
    }

    throw new ErroAplicacao(
      CODIGOS_ERRO.FALHA_CARREGAMENTO_API,
      "Não foi possível carregar os pacientes da API simulada.",
      "sistema",
    );
  }
}