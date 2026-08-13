import { listarPacientes } from "@/services/paciente-service";
import { exibirPaciente } from "../exibidores/paciente";


export function executarListagemPacientes(): void {
  const pacientes = listarPacientes();

  console.log("\n====================================");
  console.log(" Pacientes cadastrados");
  console.log("====================================");

  if (pacientes.length === 0) {
    console.log(
      "\nNão existem pacientes cadastrados.",
    );
    return;
  }

  console.log(
    `\nTotal de pacientes: ${pacientes.length}`,
  );

  pacientes.forEach((paciente, indice) => {
    exibirPaciente(paciente, `Paciente ${indice + 1}`);
  });
}