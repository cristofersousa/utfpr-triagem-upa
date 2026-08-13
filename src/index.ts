import { iniciarMenu } from "@/cli/menu";

async function iniciarSistema(): Promise<void> {
  try {
    await iniciarMenu();
  } catch (erro: unknown) {
    console.error(
      "\nOcorreu um erro inesperado durante a execução.",
    );

    console.error(erro);
    process.exitCode = 1;
  }
}

iniciarSistema();