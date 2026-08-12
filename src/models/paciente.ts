// prioridade do atendimento do paciente
export type Prioridade =
  | "vermelho"
  | "laranja"
  | "amarelo"
  | "verde"
  | "azul";

// status do atendimento do paciente
  export type StatusAtendimento =
  | "aguardando"
  | "em-atendimento"
  | "atendido"
  | "cancelado";

// interface do paciente
  export interface Paciente {
    readonly id: string;
    nome: string;
    idade: number;
    cpf: string;
    telefone?: string;
    sintomas: string[];
    dataChegada: Date;
    prioridade: Prioridade;
    status: StatusAtendimento;
}
// type para criar um novo paciente, omitindo os campos id, dataChegada e status
export type NovoPaciente = Omit<Paciente, "id" | "dataChegada" | "status">;

// type para atualizar um paciente, permitindo apenas os campos nome, idade, telefone, sintomas e prioridade
export type AtualizacaoPaciente = Partial<
  Pick <
    Paciente,  
      "nome" | "idade" | "telefone" | "sintomas" | "prioridade"
    >
>;
