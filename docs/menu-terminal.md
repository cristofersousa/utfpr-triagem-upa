# Guia da Interface de Linha de Comando

Este documento descreve a interface de linha de comando do Sistema de Triagem da UPA.

A aplicação não possui interface gráfica. A interação ocorre pelo terminal, onde o usuário escolhe operações por meio de um menu numérico.

A CLI é responsável por:

- apresentar as opções disponíveis;
- coletar os dados digitados;
- converter as respostas recebidas;
- chamar os serviços correspondentes;
- apresentar os resultados;
- manter o sistema em execução até que o usuário escolha encerrá-lo.

## Organização dos arquivos

```text
src/
├── cli/
│   ├── acoes/
│   │   ├── cadastrar-paciente.ts
│   │   ├── chamar-proximo-paciente.ts
│   │   ├── consultar-paciente.ts
│   │   ├── exibir-estatisticas.ts
│   │   ├── exibir-fila.ts
│   │   ├── finalizar-atendimento.ts
│   │   ├── importar-pacientes.ts
│   │   └── listar-pacientes.ts
│   ├── exibidores/
│   │   └── paciente.ts
│   ├── menu.ts
│   └── terminal.ts
└── index.ts
```

## Separação de responsabilidades

| Arquivo ou diretório | Responsabilidade |
| --- | --- |
| `index.ts` | Iniciar a aplicação |
| `cli/menu.ts` | Apresentar o menu e direcionar as escolhas |
| `cli/terminal.ts` | Centralizar a leitura de dados do terminal |
| `cli/acoes/` | Executar as operações escolhidas pelo usuário |
| `cli/exibidores/` | Centralizar a apresentação de entidades |
| `services/` | Executar regras de negócio |
| `models/` | Definir os tipos e contratos de dados |
| `validators/` | Validar os dados recebidos |

A CLI não deve implementar diretamente as regras de negócio.

Por exemplo, a ação de chamada solicita a operação, mas quem define o próximo paciente é o serviço da fila:

```text
CLI
 ↓
chamarProximoPaciente()
 ↓
Fila ordenada
 ↓
Alteração do status
 ↓
Resultado apresentado no terminal
```

## Inicialização da aplicação

O arquivo `src/index.ts` representa o ponto de entrada:

```ts
import { iniciarMenu } from "@/cli/menu";

async function iniciarSistema(): Promise<void> {
  try {
    await iniciarMenu();
  } catch (erro: unknown) {
    console.error(
      "\n[SYS-001] Ocorreu um erro inesperado durante a execução.",
    );

    if (erro instanceof Error) {
      console.error(`Detalhes: ${erro.message}`);
    }

    process.exitCode = 1;
  }
}

iniciarSistema();
```

O arquivo principal possui somente a responsabilidade de:

1. iniciar o menu;
2. capturar falhas inesperadas;
3. definir um código de saída quando ocorrer um erro.

Os detalhes das operações permanecem em outros módulos.

## Terminal

O arquivo:

```text
src/cli/terminal.ts
```

centraliza o acesso à entrada e à saída do terminal.

```ts
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
  const resposta =
    await terminal.question(mensagem);

  return resposta.trim();
}

export function fecharTerminal(): void {
  terminal.close();
}
```

## Módulos nativos

A CLI utiliza módulos nativos do Node.js:

| Módulo | Finalidade |
| --- | --- |
| `node:readline/promises` | Fazer perguntas e aguardar respostas |
| `node:process` | Utilizar a entrada e a saída do processo |

Esses módulos não precisam ser instalados separadamente.

As tipagens são disponibilizadas por:

```bash
npm install --save-dev @types/node
```

## Função `perguntar()`

A função:

```ts
perguntar(mensagem: string): Promise<string>
```

apresenta uma mensagem e aguarda uma resposta.

Exemplo:

```ts
const nome = await perguntar(
  "Nome completo: ",
);
```

O método `trim()` remove espaços desnecessários no início e no final da resposta.

Como a operação aguarda a interação do usuário, seu retorno é:

```ts
Promise<string>
```

## Menu principal

O arquivo:

```text
src/cli/menu.ts
```

é responsável por:

- apresentar o cabeçalho;
- exibir as opções;
- receber a escolha;
- validar a opção;
- direcionar a execução;
- manter o sistema ativo;
- fechar o terminal.

## Opções disponíveis

```text
1. Cadastrar paciente
2. Listar pacientes
3. Consultar paciente
4. Exibir fila de atendimento
5. Chamar próximo paciente
6. Finalizar atendimento
7. Exibir estatísticas
8. Importar pacientes do JSON
0. Encerrar
```

## Tipo das opções

As opções são representadas por um Union Type:

```ts
type OpcaoMenu =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "0";
```

Isso impede que valores diferentes das opções conhecidas sejam tratados como escolhas válidas.

## Validação da opção

A função:

```ts
function opcaoValida(
  opcao: string,
): opcao is OpcaoMenu
```

verifica se a resposta pertence às opções disponíveis.

```ts
function opcaoValida(
  opcao: string,
): opcao is OpcaoMenu {
  const opcoes: OpcaoMenu[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "0",
  ];

  return opcoes.includes(
    opcao as OpcaoMenu,
  );
}
```

O retorno:

```ts
opcao is OpcaoMenu
```

é um Type Predicate.

Depois que a função retorna `true`, o TypeScript reconhece que a resposta é uma opção válida.

## Controle do menu

O menu utiliza um `while`:

```ts
export async function iniciarMenu():
  Promise<void> {
  let sistemaAtivo = true;

  while (sistemaAtivo) {
    exibirCabecalho();
    exibirOpcoes();

    const opcao = await perguntar(
      "Escolha uma opção: ",
    );

    if (!opcaoValida(opcao)) {
      console.log("\nOpção inválida.");
      await pausar();
      continue;
    }

    sistemaAtivo =
      await executarOpcao(opcao);
  }

  fecharTerminal();
}
```

Enquanto:

```ts
sistemaAtivo === true
```

o menu continua sendo apresentado.

Quando o usuário escolhe `0`, a função responsável pela opção retorna:

```ts
false
```

e o laço é encerrado.

## Uso de `continue`

Quando uma opção inválida é informada:

```ts
if (!opcaoValida(opcao)) {
  console.log("\nOpção inválida.");
  await pausar();
  continue;
}
```

O `continue` interrompe a iteração atual e inicia uma nova exibição do menu.

## Direcionamento com `switch`

A função:

```ts
executarOpcao(
  opcao: OpcaoMenu,
): Promise<boolean>
```

utiliza `switch` para chamar a ação correspondente.

Exemplo:

```ts
switch (opcao) {
  case "1":
    await executarCadastroPaciente();
    await pausar();
    return true;

  case "2":
    executarListagemPacientes();
    await pausar();
    return true;

  case "0":
    console.log("\nSistema encerrado.");
    return false;
}
```

O retorno indica se o menu deve continuar:

| Retorno | Resultado |
| :---: | --- |
| `true` | Exibe o menu novamente |
| `false` | Encerra a aplicação |

## Operações síncronas e assíncronas

Algumas ações não precisam aguardar entrada do usuário:

```ts
executarListagemPacientes();
executarExibicaoFila();
executarChamadaProximoPaciente();
executarExibicaoEstatisticas();
```

Essas funções retornam:

```ts
void
```

Outras ações precisam coletar informações ou aguardar operações assíncronas:

```ts
await executarCadastroPaciente();
await executarConsultaPaciente();
await executarFinalizacaoAtendimento();
await executarImportacaoPacientes();
```

Essas funções retornam:

```ts
Promise<void>
```

## Pausa entre as operações

A função:

```ts
async function pausar(): Promise<void> {
  await perguntar(
    "\nPressione Enter para continuar...",
  );
}
```

impede que o resultado desapareça imediatamente quando o menu for redesenhado.

Depois que o usuário pressiona Enter, o sistema retorna ao menu principal.

## Ações da CLI

### Cadastro de paciente

Arquivo:

```text
src/cli/acoes/cadastrar-paciente.ts
```

Responsabilidades:

- solicitar dados pessoais;
- solicitar sintomas;
- solicitar informações da triagem;
- converter idade e nível de dor;
- converter respostas de sim ou não;
- enviar os dados ao serviço de pacientes;
- apresentar os dados do paciente cadastrado;
- apresentar erros de validação.

A ação não define diretamente a prioridade. Ela envia as informações para:

```ts
cadastrarPaciente(
  dadosPaciente,
  informacoesTriagem,
);
```

O serviço de triagem é responsável pela classificação.

### Listagem de pacientes

Arquivo:

```text
src/cli/acoes/listar-pacientes.ts
```

Responsabilidades:

- obter os pacientes cadastrados;
- informar quando a lista estiver vazia;
- apresentar a quantidade;
- exibir os dados de cada paciente.

A ação utiliza:

```ts
listarPacientes()
```

### Consulta de paciente

Arquivo:

```text
src/cli/acoes/consultar-paciente.ts
```

Permite consultar por:

- ID;
- nome completo.

A busca por ID é a forma mais segura, porque o identificador é único.

A busca por nome utiliza `find()` e retorna somente o primeiro paciente correspondente.

### Exibição da fila

Arquivo:

```text
src/cli/acoes/exibir-fila.ts
```

Responsabilidades:

- obter a fila ordenada;
- informar quando a fila estiver vazia;
- apresentar posição;
- apresentar prioridade;
- apresentar horário de chegada;
- calcular e apresentar o tempo de espera.

A ordenação é realizada pelo serviço:

```ts
listarFilaAtendimento()
```

### Chamada do próximo paciente

Arquivo:

```text
src/cli/acoes/chamar-proximo-paciente.ts
```

Responsabilidades:

- solicitar a chamada do próximo paciente;
- informar quando não houver pacientes;
- apresentar o paciente chamado;
- informar a alteração do status.

A regra é executada por:

```ts
chamarProximoPaciente()
```

Transição:

```text
aguardando → em-atendimento
```

### Finalização do atendimento

Arquivo:

```text
src/cli/acoes/finalizar-atendimento.ts
```

Responsabilidades:

- solicitar o ID;
- localizar o paciente;
- verificar seu status;
- solicitar a finalização ao serviço;
- apresentar o resultado.

Somente pacientes com status:

```text
em-atendimento
```

podem ser finalizados.

Transição:

```text
em-atendimento → atendido
```

### Exibição de estatísticas

Arquivo:

```text
src/cli/acoes/exibir-estatisticas.ts
```

Apresenta:

- total de pacientes;
- idade média;
- quantidade por status;
- quantidade por prioridade;
- percentual por prioridade.

Os cálculos são obtidos por:

```ts
gerarEstatisticas()
```

A CLI apenas formata e exibe os resultados.

### Importação de pacientes

Arquivo:

```text
src/cli/acoes/importar-pacientes.ts
```

Responsabilidades:

- iniciar o carregamento do JSON;
- aguardar a operação;
- importar os registros;
- apresentar os pacientes importados;
- apresentar erros da aplicação.

O fluxo é:

```text
carregarPacientesApi()
        ↓
importarPacientes()
        ↓
cadastrarPaciente()
        ↓
Pacientes armazenados
```

## Exibidor de pacientes

O arquivo:

```text
src/cli/exibidores/paciente.ts
```

centraliza a apresentação de um paciente.

A função:

```ts
exibirPaciente(
  paciente: Paciente,
  titulo = "Paciente encontrado",
): void
```

é reutilizada em:

- listagem;
- consulta;
- chamada;
- finalização.

Isso evita a repetição dos mesmos `console.log()` em várias ações.

## Tratamento de erros

A CLI diferencia:

### Erros de validação

Exemplo:

```text
[VAL-001] O nome deve possuir pelo menos 3 caracteres.
```

### Erros de regra de negócio

Exemplo:

```text
[PAC-002] O CPF já está vinculado a outro paciente.
```

### Erros do sistema

Exemplo:

```text
[API-001] Não foi possível carregar os pacientes da API simulada.
```

Erros conhecidos são tratados pelas ações sem encerrar o menu.

Erros inesperados são propagados até o `index.ts`, que define:

```ts
process.exitCode = 1;
```

## Fluxo geral

```text
index.ts
   ↓
iniciarMenu()
   ↓
Usuário escolhe uma opção
   ↓
executarOpcao()
   ↓
Ação da CLI
   ↓
Service
   ↓
Modelos e validações
   ↓
Resultado
   ↓
CLI apresenta o resultado
   ↓
Retorno ao menu
```

## Conceitos aplicados

A implementação da CLI utiliza:

- funções síncronas e assíncronas;
- `async` e `await`;
- `Promise`;
- parâmetros tipados;
- retorno `void`;
- retorno `Promise<void>`;
- Union Types;
- Type Predicates;
- arrays;
- `includes()`;
- `while`;
- `continue`;
- `switch`;
- `if/else`;
- operador ternário;
- Nullish Coalescing;
- parâmetros default;
- Arrow Functions;
- escopo de variáveis;
- importação e exportação;
- módulos nativos do Node.js;
- tratamento de erros com `try/catch`.

## Requisitos relacionados

### R01 — Cadastro e gerenciamento

A CLI permite cadastrar, listar e consultar pacientes.

### R02 — Organização das funcionalidades

Cada ação foi separada em um módulo independente.

### R03 — Estruturas de controle

O menu utiliza:

- `while`;
- `switch`;
- `if`;
- `continue`;
- operadores relacionais;
- operadores lógicos.

### R04 — Consultas e estatísticas

A CLI disponibiliza as consultas e os relatórios produzidos pelos serviços.

### R06 — Assincronismo

A importação do JSON e a leitura do terminal utilizam operações assíncronas.

## Como executar

Em desenvolvimento:

```bash
npm run dev
```

Depois da compilação:

```bash
npm run build
npm start
```

## Limitações atuais

Nesta etapa:

- os dados permanecem somente em memória;
- os dados são apagados quando o sistema é encerrado;
- a busca por nome retorna somente o primeiro resultado;
- não existe opção de cancelamento pelo menu;
- não existe opção interativa para atualizar os dados do paciente;
- os testes automatizados ainda serão implementados; - WIP
- o Pattern Matching do RA03 será estudado e implementado posteriormente. - Backlog

## Melhorias futuras

- criar a opção de atualização de pacientes;
- criar a opção de cancelamento de atendimento;
- permitir consultas parciais por nome;
- registrar o horário de início e término do atendimento;
- persistir os dados;
- implementar os testes automatizados;
- aplicar o recurso avançado previsto no RA03.