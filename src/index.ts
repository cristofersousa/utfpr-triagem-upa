import { carregarPacientesApi } from "@/api/paciente-api";

import {
  nomeSistema,
  versaoSistema,
} from "@/config/sistema";

import {
  ErroAplicacao,
  ErroValidacaoPaciente,
} from "@/errors/erro-aplicacao";

import {
  buscarPacientePorNome,
  existePacienteEmergencial,
  gerarListaNomes,
  listarPacientesPorPrioridade,
} from "@/services/consulta-service";

import { gerarEstatisticas } from "@/services/estatistica-service";

import {
  chamarProximoPaciente,
  finalizarAtendimento,
  listarFilaAtendimento,
} from "@/services/fila-service";

import {
  atualizarPaciente,
  cadastrarPaciente,
  importarPacientes,
  listarPacientes,
} from "@/services/paciente-service";

function exibirCabecalho(): void {
  console.log("====================================");
  console.log(` ${nomeSistema}`);
  console.log(` Versão: ${versaoSistema}`);
  console.log("====================================");
  console.log("Sistema iniciado com sucesso!");
}

function cadastrarPacientesExemplo(): void {
  const maria = cadastrarPaciente({
    nome: "Maria da Silva",
    idade: 42,
    cpf: "123.456.789-00",
    telefone: "(47) 99999-9999",
    sintomas: ["dor de cabeça"],
  });

  cadastrarPaciente({
    nome: "João dos Santos",
    idade: 68,
    cpf: "987.654.321-00",
    sintomas: ["falta de ar", "dor no peito"],
  });

  atualizarPaciente(maria.id, {
    prioridade: "laranja",
    sintomas: [...maria.sintomas, "tontura"],
  });

  console.log("\nPacientes de exemplo cadastrados.");
}

async function carregarDadosExternos(): Promise<void> {
  console.log("\nCarregando pacientes da API simulada...");

  const dadosExternos = await carregarPacientesApi();
  const pacientesImportados =
    importarPacientes(dadosExternos);

  console.log(
    `${pacientesImportados.length} pacientes importados com sucesso.`,
  );
}

function exibirPacientes(): void {
  console.log("\n====================================");
  console.log(" Pacientes cadastrados");
  console.log("====================================");

  listarPacientes().forEach((paciente) => {
    console.log(`
ID: ${paciente.id}
Nome: ${paciente.nome}
Idade: ${paciente.idade} anos
CPF: ${paciente.cpf}
Telefone: ${paciente.telefone ?? "Não informado"}
Sintomas: ${paciente.sintomas.join(", ")}
Prioridade: ${paciente.prioridade}
Status: ${paciente.status}
Chegada: ${paciente.dataChegada.toLocaleString("pt-BR")}
`);
  });
}

function exibirFila(): void {
  const fila = listarFilaAtendimento();

  console.log("\n====================================");
  console.log(" Fila de atendimento");
  console.log("====================================");

  if (fila.length === 0) {
    console.log("Não existem pacientes aguardando.");
    return;
  }

  fila.forEach((paciente, indice) => {
    console.log(
      `${indice + 1}. ${paciente.nome} — ${paciente.prioridade}`,
    );
  });
}

function simularAtendimento(): void {
  const proximoPaciente = chamarProximoPaciente();

  if (!proximoPaciente) {
    console.log("\nNão existem pacientes para chamar.");
    return;
  }

  console.log(
    `\nChamando ${proximoPaciente.nome} para atendimento.`,
  );

  const pacienteFinalizado = finalizarAtendimento(
    proximoPaciente.id,
  );

  if (pacienteFinalizado) {
    console.log(
      `Atendimento de ${pacienteFinalizado.nome} finalizado.`,
    );
  }
}

function exibirConsultas(): void {
  console.log("\n====================================");
  console.log(" Consultas");
  console.log("====================================");

  console.log(
    `Pacientes cadastrados: ${gerarListaNomes()}`,
  );

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

  console.log(
    existePacienteEmergencial()
      ? "Existem pacientes em emergência."
      : "Não existem pacientes em emergência.",
  );
}

function exibirEstatisticas(): void {
  const estatisticas = gerarEstatisticas();

  console.log("\n====================================");
  console.log(" Estatísticas");
  console.log("====================================");

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
    `Idade média: ${estatisticas.idadeMedia.toFixed(1)} anos`,
  );

  console.log("\nPacientes por prioridade:");

  Object.entries(
    estatisticas.pacientesPorPrioridade,
  ).forEach(([prioridade, quantidade]) => {
    console.log(`${prioridade}: ${quantidade}`);
  });

  console.log("\nPacientes por status:");

  Object.entries(
    estatisticas.pacientesPorStatus,
  ).forEach(([status, quantidade]) => {
    console.log(`${status}: ${quantidade}`);
  });
}

function tratarErro(erro: unknown): void {
  if (erro instanceof ErroValidacaoPaciente) {
    console.error(
      "\nNão foi possível processar os pacientes:",
    );

    erro.erros.forEach(({ codigo, mensagem }) => {
      console.error(`[${codigo}] ${mensagem}`);
    });

    return;
  }

  if (erro instanceof ErroAplicacao) {
    console.error(
      `\n[${erro.codigo}] ${erro.message}`,
    );

    if (erro.tipo === "sistema") {
      console.error(
        "Entre em contato com o TI e informe o código acima.",
      );
    }

    return;
  }

  console.error(
    "\n[SYS-001] Ocorreu um erro interno inesperado.",
  );

  console.error(
    "Entre em contato com o TI e informe o código SYS-001.",
  );

  console.error("Detalhes técnicos:", erro);
}

async function iniciarSistema(): Promise<void> {
  try {
    exibirCabecalho();

    cadastrarPacientesExemplo();

    await carregarDadosExternos();

    exibirPacientes();
    exibirFila();
    exibirConsultas();
    exibirEstatisticas();

    simularAtendimento();

    console.log("\nFila após o atendimento:");
    exibirFila();

    console.log("\nEstatísticas após o atendimento:");
    exibirEstatisticas();
  } catch (erro: unknown) {
    tratarErro(erro);
  }
}

iniciarSistema();