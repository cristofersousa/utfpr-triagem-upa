import { createInterface } from "node:readline/promises";
import {
  stdin as entrada,
  stdout as saida,
} from "node:process";

export const terminal = createInterface({
  input: entrada,
  output: saida,
});

export async function perguntar(
  mensagem: string,
): Promise<string> {
  const resposta = await terminal.question(mensagem);

  return resposta.trim();
}

export function fecharTerminal(): void {
  terminal.close();
}