import type {
  AtualizacaoPaciente,
  NovoPaciente,
  Paciente,
  StatusAtendimento,
  InformacoesTriagem
} from "@/models/paciente";
import { ErroValidacaoPaciente, ErroAplicacao } from "@/errors/erro-aplicacao";
import { validarNovoPaciente } from "@/validators/paciente-validator";
import { classificarPrioridade } from "@/services/triagem-service";
import type { PacienteApi } from "@/models/paciente-api";
import { CODIGOS_ERRO } from "@/errors/codigos-erro";

// array to store patients
const pacientes: Paciente[] = [];

let proximoId = 1;

// function to validate the data of a new patient
function validarDadosNovoPaciente(
  dados: NovoPaciente,
): void {
  const erros = validarNovoPaciente(dados);

  if (erros.length > 0) {
    throw new ErroValidacaoPaciente(erros);
  }
}

// function to ensure that the CPF is not already registered in the system
function garantirCpfDisponivel(cpf: string): void {
  const pacienteExistente =
    buscarPacientePorCpf(cpf);

  if (!pacienteExistente) {
    return;
  }

  throw new ErroAplicacao(
    CODIGOS_ERRO.CPF_JA_CADASTRADO,
    `O CPF ${cpf} já está vinculado ao paciente ${pacienteExistente.id}.`,
    "usuario",
  );
}

// function to generate a unique ID for each patient
function gerarIdPaciente(): string {
  return `PAC-${String(proximoId).padStart(3, "0")}`;
}

// function to create a new patient object
function criarPaciente(
  dados: NovoPaciente,
  informacoesTriagem: InformacoesTriagem,
): Paciente {
  const prioridade = classificarPrioridade({
    idade: dados.idade,
    sintomas: dados.sintomas,
    ...informacoesTriagem,
  });

  return {
    ...dados,
    id: gerarIdPaciente(),
    dataChegada: new Date(),
    prioridade,
    status: "aguardando",
  };
}

function armazenarPaciente(
  paciente: Paciente,
): void {
  pacientes.push(paciente);
  proximoId++;
}

export function cadastrarPaciente(
  dados: NovoPaciente,
  informacoesTriagem: InformacoesTriagem = {},
): Paciente {
  validarDadosNovoPaciente(dados);
  garantirCpfDisponivel(dados.cpf);

  const paciente = criarPaciente(
    dados,
    informacoesTriagem,
  );

  armazenarPaciente(paciente);

  return paciente;
}

//function to list all patients
export function listarPacientes(): ReadonlyArray<Paciente> {
  return pacientes;
}

// function to search for a patient by ID
export function buscarPacientePorId(
  id: string,
): Paciente | undefined {
  return pacientes.find((paciente) => paciente.id === id);
}

// function to update a patient's information
export function atualizarPaciente(
  id: string,
  alteracoes: AtualizacaoPaciente,
): Paciente | undefined {
  const paciente = buscarPacientePorId(id);

  if (!paciente) {
    return undefined;
  }

  Object.assign(paciente, alteracoes);

  return paciente;
}

// function to change the status of a patient's attendance
export function alterarStatusAtendimento(
  id: string,
  novoStatus: StatusAtendimento,
): Paciente | undefined {
  const paciente = buscarPacientePorId(id);

  if (!paciente) {
    return undefined;
  }

  paciente.status = novoStatus;

  return paciente;
}

// function for change Patient API[] to Patient[]
function converterPacienteApi(
  dados: PacienteApi,
): NovoPaciente {
  return {
    nome: dados.nome,
    idade: dados.idade,
    cpf: dados.cpf,
    sintomas: dados.sintomas,

    ...(dados.telefone !== undefined
      ? { telefone: dados.telefone }
      : {}),
  };
}

function garantirCpfsUnicosNoArquivo(
  pacientes: ReadonlyArray<NovoPaciente>,
): void {
  const cpfs = pacientes.map(
    (paciente) => paciente.cpf,
  );

  const cpfDuplicado =
    localizarCpfDuplicado(cpfs);

  if (!cpfDuplicado) {
    return;
  }

  throw new ErroAplicacao(
    CODIGOS_ERRO.CPF_JA_CADASTRADO,
    `O CPF ${cpfDuplicado} aparece mais de uma vez no arquivo de importação.`,
    "usuario",
  );
}

function buscarPacienteComCpfCadastrado(
  pacientes: ReadonlyArray<NovoPaciente>,
): Paciente | undefined {
  for (const paciente of pacientes) {
    const pacienteExistente =
      buscarPacientePorCpf(paciente.cpf);

    if (pacienteExistente) {
      return pacienteExistente;
    }
  }

  return undefined;
}

function garantirCpfsNaoCadastrados(
  pacientes: ReadonlyArray<NovoPaciente>,
): void {
  const pacienteExistente =
    buscarPacienteComCpfCadastrado(
      pacientes,
    );

  if (!pacienteExistente) {
    return;
  }

  throw new ErroAplicacao(
    CODIGOS_ERRO.CPF_JA_CADASTRADO,
    `O CPF ${pacienteExistente.cpf} já está vinculado ao paciente ${pacienteExistente.id}.`,
    "usuario",
  );
}

function validarPacientesImportados(
  pacientes: ReadonlyArray<NovoPaciente>,
): void {
  pacientes.forEach(
    validarDadosNovoPaciente,
  );
}

function cadastrarPacientesImportados(
  pacientes: ReadonlyArray<NovoPaciente>,
): Paciente[] {
  return pacientes.map((paciente) =>
    cadastrarPaciente(paciente),
  );
}

export function importarPacientes(
  dadosExternos: PacienteApi[],
): Paciente[] {
  const novosPacientes =
    dadosExternos.map(converterPacienteApi);

  validarPacientesImportados(novosPacientes);
  garantirCpfsUnicosNoArquivo(novosPacientes);
  garantirCpfsNaoCadastrados(novosPacientes);

  return cadastrarPacientesImportados(
    novosPacientes,
  );
}

function normalizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function buscarPacientePorCpf(
  cpf: string,
): Paciente | undefined {
  const cpfNormalizado = normalizarCpf(cpf);

  return pacientes.find(
    (paciente) =>
      normalizarCpf(paciente.cpf) === cpfNormalizado,
  );
}

function localizarCpfDuplicado(
  cpfs: string[],
): string | undefined {
  const cpfsEncontrados = new Set<string>();

  return cpfs.find((cpf) => {
    const cpfNormalizado = normalizarCpf(cpf);

    if (cpfsEncontrados.has(cpfNormalizado)) {
      return true;
    }

    cpfsEncontrados.add(cpfNormalizado);

    return false;
  });
}