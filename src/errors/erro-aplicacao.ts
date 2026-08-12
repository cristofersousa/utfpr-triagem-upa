import type { CodigoErro } from "@/errors/codigos-erro";
import type { ErroValidacao } from "@/validators/paciente-validator";


export type TipoErro = "usuario" | "sistema";

export class ErroAplicacao extends Error {
  constructor(
    public readonly codigo: CodigoErro,
    mensagem: string,
    public readonly tipo: TipoErro,
  ) {
    super(mensagem);

    this.name = "ErroAplicacao";
  }
}

export class ErroValidacaoPaciente extends Error {
  constructor(
    public readonly erros: ReadonlyArray<ErroValidacao>,
  ) {
    super("Os dados do paciente são inválidos.");

    this.name = "ErroValidacaoPaciente";
  }
}