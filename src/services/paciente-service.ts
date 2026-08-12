import type {
  AtualizacaoPaciente,
  NovoPaciente,
  Paciente,
} from "@/models/paciente";

// array to store patients
const pacientes: Paciente[] = [];

let proximoId = 1;

// function to register a new patient
export function cadastrarPaciente(
  dados: NovoPaciente,
): Paciente {
  const paciente: Paciente = {
    ...dados,
    id: `PAC-${String(proximoId).padStart(3, "0")}`,
    dataChegada: new Date(),
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