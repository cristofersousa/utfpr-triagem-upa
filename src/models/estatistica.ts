import type {
  Prioridade,
  StatusAtendimento,
} from "@/models/paciente";

export interface EstatisticasAtendimento {
  totalPacientes: number;
  totalAguardando: number;
  totalEmAtendimento: number;
  totalAtendidos: number;
  totalCancelados: number;
  idadeMedia: number;
  pacientesPorPrioridade: Record<Prioridade, number>;
  pacientesPorStatus: Record<StatusAtendimento, number>;
}