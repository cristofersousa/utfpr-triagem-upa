import { carregarPacientesApi } from "@/api/paciente-api";

import {
  ErroAplicacao,
  ErroValidacaoPaciente,
} from "@/errors/erro-aplicacao";

import type { Paciente } from "@/models/paciente";

import { importarPacientes } from "@/services/paciente-service";

function exibirPacienteImportado(
  paciente: Paciente,
): void {
  console.log(
    `- ${paciente.id} — ${paciente.nome} — ${paciente.prioridade}`,
  );
}

function exibirErrosValidacao(
  erro: ErroValidacaoPaciente,
): void {
  console.error(
    "\nForam encontrados dados inválidos durante a importação:",
  );

  erro.erros.forEach(({ codigo, mensagem }) => {
    console.error(`[${codigo}] ${mensagem}`);
  });
}

function exibirErroAplicacao(
  erro: ErroAplicacao,
): void {
  console.error(
    `\n[${erro.codigo}] ${erro.message}`,
  );

  if (erro.tipo === "sistema") {
    console.error(
      "Entre em contato com o TI e informe o código acima.",
    );
  }
}

export async function executarImportacaoPacientes():
  Promise<void> {
  console.log("\n====================================");
  console.log(" Importação de pacientes");
  console.log("====================================");

  console.log(
    "\nCarregando o arquivo data/pacientes.json...",
  );

  try {
    const dadosExternos =
      await carregarPacientesApi();

    console.log(
      `${dadosExternos.length} registro(s) localizado(s).`,
    );

    if (dadosExternos.length === 0) {
      console.log(
        "\nO arquivo não possui pacientes para importar.",
      );

      return;
    }

    const pacientesImportados =
      importarPacientes(dadosExternos);

    console.log(
      `\n${pacientesImportados.length} paciente(s) importado(s) com sucesso:`,
    );

    pacientesImportados.forEach(
      exibirPacienteImportado,
    );
  } catch (erro: unknown) {
    if (erro instanceof ErroValidacaoPaciente) {
      exibirErrosValidacao(erro);
      return;
    }

    if (erro instanceof ErroAplicacao) {
      exibirErroAplicacao(erro);
      return;
    }

    throw erro;
  }
}