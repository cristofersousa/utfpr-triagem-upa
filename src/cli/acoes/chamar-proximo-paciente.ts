import { exibirPaciente } from "@/cli/exibidores/paciente";
import { chamarProximoPaciente } from "@/services/fila-service";

export function executarChamadaProximoPaciente(): void {
  console.log("\n====================================");
  console.log(" Chamada para atendimento");
  console.log("====================================");

  const paciente = chamarProximoPaciente();

  if (!paciente) {
    console.log(
      "\nNão existem pacientes aguardando atendimento.",
    );

    return;
  }

  console.log("\nPróximo paciente:");

  console.log(`
====================================
ATENÇÃO: ${paciente.nome}
Dirija-se à sala de atendimento.
====================================
`);

  exibirPaciente(
    paciente,
    "Paciente chamado",
  );

  console.log(
    `O status foi atualizado para "${paciente.status}".`,
  );
}