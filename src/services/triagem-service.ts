import type {
  DadosTriagem,
  Prioridade,
} from "@/models/paciente";

export function classificarPrioridade(
  dados: DadosTriagem,
): Prioridade {
  const {
    sintomas,
    idade,
    nivelDor = 0,
    inconsciente = false,
    dificuldadeRespirar = false,
    sangramentoIntenso = false,
  } = dados;

  if (
    inconsciente ||
    dificuldadeRespirar ||
    sangramentoIntenso
  ) {
    return "vermelho";
  }

  if (nivelDor >= 8) {
    return "laranja";
  }

  if (
    nivelDor >= 5 ||
    idade >= 80 ||
    sintomas.some((sintoma) =>
      sintoma.toLowerCase().includes("dor no peito"),
    )
  ) {
    return "amarelo";
  }

  if (nivelDor >= 1 || sintomas.length > 0) {
    return "verde";
  }

  return "azul";
}