import { exibirPaciente } from "@/cli/exibidores/paciente";
import { perguntar } from "@/cli/terminal";
import { finalizarAtendimento } from "@/services/fila-service";
import { buscarPacientePorId } from "@/services/paciente-service";

export async function executarFinalizacaoAtendimento():
  Promise<void> {
  console.log("\n====================================");
  console.log(" Finalização do atendimento");
  console.log("====================================");

  const resposta = await perguntar(
    "Informe o ID do paciente: ",
  );

  const id = resposta.toUpperCase();

  if (!id) {
    console.log("\nO ID deve ser informado.");
    return;
  }

  const paciente = buscarPacientePorId(id);

  if (!paciente) {
    console.log(
      `\nPaciente com o ID ${id} não encontrado.`,
    );

    return;
  }

  if (paciente.status !== "em-atendimento") {
    console.log(
      `\nNão é possível finalizar o atendimento de ${paciente.nome}.`,
    );

    console.log(
      `Status atual: ${paciente.status}`,
    );

    console.log(
      'Somente pacientes com status "em-atendimento" podem ser finalizados.',
    );

    return;
  }

  const pacienteFinalizado =
    finalizarAtendimento(id);

  if (!pacienteFinalizado) {
    console.log(
      "\nNão foi possível finalizar o atendimento.",
    );

    return;
  }

  console.log(
    "\nAtendimento finalizado com sucesso!",
  );

  exibirPaciente(
    pacienteFinalizado,
    "Paciente atendido",
  );

  console.log(
    `O status foi atualizado para "${pacienteFinalizado.status}".`,
  );
}