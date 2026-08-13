// criado para definir a estrutura de dados que será recebida da API
export interface PacienteApi {
  nome: string;
  idade: number;
  cpf: string;
  telefone?: string;
  sintomas: string[];
}