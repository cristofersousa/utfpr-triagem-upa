import { CODIGOS_ERRO, type CodigoErro } from "@/errors/codigos-erro";
import type { NovoPaciente } from "@/models/paciente";

export interface ErroValidacao {
  codigo: CodigoErro;
  mensagem: string;
}

export function validarNome(nome: string): boolean {
  // permitted only letters and spaces, with a minimum of 3 characters
  return nome.trim().length >= 3;
}

export function validarIdade(idade: number): boolean {
    // age no accept like -5, 15.7 and 200
  return Number.isInteger(idade) && idade >= 0 && idade <= 130;
}

export function validarFormatoCpf(cpf: string): boolean {
 // 123.456.789-00
  const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regexCpf.test(cpf);
}

export function validarTelefone(telefone?: string): boolean {
  if (!telefone) {
    return true;
  }

  //formatter accepts - (47) 3333-4444 or (47) 99999-8888
  const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return regexTelefone.test(telefone);
}

// validate that the patient has at least one symptom and that all symptoms are non-empty strings
export function validarSintomas(sintomas: string[]): boolean {
  return (
    sintomas.length > 0 &&
    sintomas.every((sintoma) => sintoma.trim().length > 0)
  );
}

// validate the data of a new patient and return an array of validation errors
export function validarNovoPaciente(
  dados: NovoPaciente,
): ErroValidacao[] {
  const erros: ErroValidacao[] = [];

  if (!validarNome(dados.nome)) {
    erros.push({
      codigo: CODIGOS_ERRO.NOME_INVALIDO,
      mensagem: "O nome deve possuir pelo menos 3 caracteres."
    });
  }

  if (!validarIdade(dados.idade)) {
    erros.push({
      codigo: CODIGOS_ERRO.IDADE_INVALIDA,
      mensagem: "A idade deve ser um número inteiro entre 0 e 130."
    });
  }

  if (!validarFormatoCpf(dados.cpf)) {
    erros.push({
      codigo: CODIGOS_ERRO.CPF_INVALIDO,
      mensagem: "O CPF deve seguir o formato 000.000.000-00."
    });
  }

  if (!validarTelefone(dados.telefone)) {
    erros.push({
      codigo: CODIGOS_ERRO.TELEFONE_INVALIDO,
      mensagem: "O telefone deve seguir o formato (00) 00000-0000."
    });
  }

  if (!validarSintomas(dados.sintomas)) {
    erros.push({
      codigo: CODIGOS_ERRO.SINTOMAS_INVALIDOS,
      mensagem: "O paciente deve possuir pelo menos um sintoma."
    });
  }

  return erros;
}