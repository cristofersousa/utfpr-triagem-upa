import type {
  AtualizacaoPaciente,
  NovoPaciente,
  Paciente,
  StatusAtendimento
} from "@/models/paciente";
import { ErroValidacaoPaciente } from "@/errors/erro-aplicacao";
import { validarNovoPaciente } from "@/validators/paciente-validator";
import { classificarPrioridade } from "@/services/triagem-service";
import type { PacienteApi } from "@/models/paciente-api";

// array to store patients
const pacientes: Paciente[] = [];

let proximoId = 1;

// function to register a new patient
export function cadastrarPaciente(
  dados: NovoPaciente,
): Paciente {
    const erros = validarNovoPaciente(dados);

  if (erros.length > 0) {
    throw new ErroValidacaoPaciente(erros);
  }

  const prioridade = classificarPrioridade({
    idade: dados.idade,
    sintomas: dados.sintomas,
  });

  const paciente: Paciente = {
    ...dados,
    id: `PAC-${String(proximoId).padStart(3, "0")}`,
    dataChegada: new Date(),
    prioridade,
    status: "aguardando",

  };

  pacientes.push(paciente);
  proximoId++;

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
export function importarPacientes(
  dadosExternos: PacienteApi[],
): Paciente[] {
  return dadosExternos.map((dados) =>
    cadastrarPaciente({
      nome: dados.nome,
      idade: dados.idade,
      cpf: dados.cpf,
      telefone: dados.telefone,
      sintomas: dados.sintomas,
    }),
  );
}