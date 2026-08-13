import type { Prioridade } from "@/models/paciente";

export const PESO_PRIORIDADE: Record<Prioridade, number> = {
  vermelho: 5,
  laranja: 4,
  amarelo: 3,
  verde: 2,
  azul: 1,
};