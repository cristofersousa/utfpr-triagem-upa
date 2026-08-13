# Guia da API Simulada

```
Ressalva: Como a atividade não consome uma API real, ela apenas abtrai o contexto para uma camada de acesso a dados que simula o comportamento de uma API. Não estou fazendo leitura de arquivo com uma requisição via HTTP.
```

Este documento descreve a simulação de comunicação com uma API utilizada pelo Sistema de Triagem da UPA.

A aplicação carrega pacientes de um arquivo JSON por meio de uma operação assíncrona. Os dados externos são validados antes de serem enviados ao serviço responsável pelo cadastro.

Essa implementação contribui para o requisito:

> **R06 — Simulação de comunicação com uma API:** utilização de Promises, retornos tipados e manipulação de JSON.

## Organização dos arquivos

```text
sistema-triagem-upa/
├── data/
│   └── pacientes.json
└── src/
    ├── api/
    │   └── paciente-api.ts
    ├── models/
    │   └── paciente-api.ts
    └── services/
        └── paciente-service.ts
```

Cada arquivo possui uma responsabilidade diferente.

| Arquivo | Responsabilidade |
| --- | --- |
| `data/pacientes.json` | Armazenar os dados externos simulados |
| `src/models/paciente-api.ts` | Definir o formato esperado dos dados externos |
| `src/api/paciente-api.ts` | Ler, converter e validar o arquivo JSON |
| `src/services/paciente-service.ts` | Transformar e cadastrar os dados recebidos |
| `src/index.ts` | Coordenar o carregamento durante a inicialização |

## Arquivo de dados

O arquivo:

```text
data/pacientes.json
```

Simula a resposta de uma API externa.

Exemplo:

```json
[
  {
    "nome": "Carlos Pereira",
    "idade": 35,
    "cpf": "111.222.333-44",
    "telefone": "(47) 99999-1111",
    "sintomas": [
      "febre",
      "dor de cabeça"
    ]
  },
  {
    "nome": "Ana Oliveira",
    "idade": 82,
    "cpf": "555.666.777-88",
    "sintomas": [
      "dor no peito"
    ]
  }
]
```

O arquivo contém somente os dados externos necessários para o cadastro.

Ele não contém:

- identificador interno;
- data de chegada;
- prioridade;
- status do atendimento.

Essas informações são controladas pela aplicação.

## Modelo da API

O arquivo: `src/models/paciente-api.ts`

Define o formato esperado para cada paciente recebido da fonte externa:

```ts
export interface PacienteApi {
  nome: string;
  idade: number;
  cpf: string;
  telefone?: string;
  sintomas: string[];
}
```

A interface `PacienteApi` representa o contrato dos dados externos.

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | :---: | --- |
| `nome` | `string` | Sim | Nome completo |
| `idade` | `number` | Sim | Idade do paciente |
| `cpf` | `string` | Sim | CPF informado |
| `telefone` | `string` | Não | Telefone para contato |
| `sintomas` | `string[]` | Sim | Sintomas relatados |

## Por que foi gerado um modelo específico

Embora `PacienteApi` seja semelhante a `NovoPaciente`, eles representam responsabilidades diferentes:

- `PacienteApi` representa dados recebidos de uma fonte externa;
- `NovoPaciente` representa os dados aceitos pelo serviço de cadastro;
- `Paciente` representa a entidade completa armazenada pelo sistema.

O fluxo de transformação é:

```text
JSON
  ↓
PacienteApi
  ↓
NovoPaciente
  ↓
Paciente
```

Essa separação permite alterar o formato da fonte externa sem modificar diretamente a entidade interna.

## Serviço da API simulada

O arquivo: `src/api/paciente-api.ts`
É responsável por:

1. simular o tempo de resposta;
2. localizar o arquivo JSON;
3. ler o conteúdo;
4. converter o texto em dados JavaScript;
5. validar a estrutura recebida;
6. retornar uma Promise tipada;
7. tratar falhas de carregamento.

A função pública é:

```ts
carregarPacientesApi(): Promise<PacienteApi[]>
```

## Simulação de atraso

A função:

```ts
function aguardar(tempoMs: number): Promise<void> {
  return new Promise((resolverPromise) => {
    setTimeout(resolverPromise, tempoMs);
  });
}
```

cria uma `Promise` que será resolvida depois do tempo informado.

A chamada:

```ts
await aguardar(1000);
```

simula um tempo de resposta de um segundo.

Essa espera existe apenas para fins acadêmicos.

## Localização do arquivo

O caminho é construído por:

```ts
const caminhoArquivo = resolve(
  process.cwd(),
  "data",
  "pacientes.json",
);
```

### `process.cwd()`

Retorna o diretório no qual o comando foi executado.

Quando executamos:

```bash
npm run dev
```

na raiz do projeto, o caminho final aponta para:

```text
sistema-triagem-upa/data/pacientes.json
```

### `resolve()`

A função `resolve()`, do módulo nativo `node:path`, combina as partes e produz o caminho completo do arquivo.

## Leitura assíncrona

A leitura acontece por meio de:

```ts
const conteudo = await readFile(
  caminhoArquivo,
  "utf-8",
);
```

`readFile()` pertence ao módulo nativo:

```ts
node:fs/promises
```

O retorno é uma Promise. Por isso, utilizamos `await`.

A codificação:

```ts
"utf-8"
```

faz com que o conteúdo seja retornado como texto.

## Conversão do JSON

Depois da leitura, o conteúdo ainda é uma `string`.

A conversão ocorre com:

```ts
const dados: unknown = JSON.parse(conteudo);
```

O fluxo é:

```text
Arquivo JSON
     ↓
string
     ↓ JSON.parse()
unknown
```

O tipo inicial é `unknown` porque dados externos não devem ser considerados confiáveis antes da validação.

## Validação de um paciente externo

A função:

```ts
function objetoPossuiEstruturaPaciente(
  valor: unknown,
): valor is PacienteApi
```

verifica se um valor possui a estrutura esperada.

São analisados:

- se o valor é um objeto;
- se o objeto não é `null`;
- se o nome é uma `string`;
- se a idade é um `number`;
- se o CPF é uma `string`;
- se os sintomas formam um array de strings;
- se o telefone está ausente ou é uma `string`.

O retorno:

```ts
valor is PacienteApi
```

é um Type Predicate.

Quando a função retorna `true`, o TypeScript passa a reconhecer o valor como `PacienteApi`.

## Validação da resposta completa

A função:

```ts
function validarRespostaApi(
  dados: unknown,
): dados is PacienteApi[]
```

verifica se a resposta:

1. é um array;
2. possui somente elementos com a estrutura de `PacienteApi`.

```ts
return (
  Array.isArray(dados) &&
  dados.every(objetoPossuiEstruturaPaciente)
);
```

O método `every()` retorna `true` somente quando todos os elementos atendem à validação.

## Função de carregamento

A função principal possui retorno assíncrono tipado:

```ts
export async function carregarPacientesApi():
  Promise<PacienteApi[]> {
  // carregamento
}
```

Uma função `async` sempre retorna uma Promise.

Neste caso, quando a operação for concluída corretamente, a Promise fornecerá:

```ts
PacienteApi[]
```

## Tratamento de falhas

A leitura e a conversão são executadas dentro de um `try/catch`.

Podem gerar falhas:

- arquivo não encontrado;
- falta de permissão para leitura;
- JSON com sintaxe inválida;
- conteúdo fora da estrutura esperada;
- erro inesperado do sistema.

As falhas são convertidas em:

```text
API-001
```

Exemplo:

```ts
throw new ErroAplicacao(
  CODIGOS_ERRO.FALHA_CARREGAMENTO_API,
  "Não foi possível carregar os pacientes da API simulada.",
  "sistema",
);
```

A mensagem apresentada será semelhante a:

```text
[API-001] Não foi possível carregar os pacientes da API simulada.
Entre em contato com o TI e informe o código acima.
```

## Importação para o sistema

Depois do carregamento, os dados são enviados para:

```ts
importarPacientes(dadosExternos)
```

Essa função pertence ao `paciente-service.ts`.

Exemplo:

```ts
export function importarPacientes(
  dadosExternos: PacienteApi[],
): Paciente[] {
  return dadosExternos.map((dados) =>
    cadastrarPaciente({
      nome: dados.nome,
      idade: dados.idade,
      cpf: dados.cpf,
      telefone: dados.telefone,
      sintomas: dados.sintomas,
    }),
  );
}
```

O método `map()` transforma:

```text
PacienteApi[] → Paciente[]
```

Cada elemento é enviado para `cadastrarPaciente()`. Assim, pacientes externos passam pelas mesmas validações e regras dos cadastros internos.

## Integração com o arquivo principal

O carregamento é coordenado pelo `index.ts`:

```ts
async function carregarDadosExternos(): Promise<void> {
  const dadosExternos =
    await carregarPacientesApi();

  const pacientesImportados =
    importarPacientes(dadosExternos);

  console.log(
    `${pacientesImportados.length} pacientes importados com sucesso.`,
  );
}
```

A função é chamada durante a inicialização:

```ts
async function iniciarSistema(): Promise<void> {
  try {
    exibirCabecalho();

    await carregarDadosExternos();

    exibirPacientes();
  } catch (erro: unknown) {
    tratarErro(erro);
  }
}

iniciarSistema();
```

A leitura é acionada pela linha:

```ts
await carregarDadosExternos();
```

## Fluxo completo

```text
iniciarSistema()
        ↓
carregarDadosExternos()
        ↓
carregarPacientesApi()
        ↓
readFile()
        ↓
JSON.parse()
        ↓
validarRespostaApi()
        ↓
importarPacientes()
        ↓
cadastrarPaciente()
        ↓
Paciente armazenado em memória
```

## Bibliotecas nativas utilizadas

| Import | Finalidade |
| --- | --- |
| `node:fs/promises` | Leitura assíncrona do arquivo |
| `node:path` | Construção do caminho absoluto |
| `node:process` | Acesso indireto ao diretório atual por `process.cwd()` |

Esses módulos fazem parte do Node.js e não devem ser instalados separadamente.

Para que o TypeScript reconheça suas tipagens, o projeto utiliza:

```bash
npm install --save-dev @types/node
```

E o `tsconfig.json` contém:

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

## Recursos aplicados

A implementação utiliza:

- funções assíncronas;
- `async` e `await`;
- `Promise`;
- retorno tipado;
- `unknown`;
- Type Predicates;
- `Record<string, unknown>`;
- `Array.isArray()`;
- `every()`;
- `map()`;
- `JSON.parse()`;
- módulos nativos do Node.js;
- `try/catch`;
- classes de erro personalizadas;
- importação e exportação entre módulos.

## Requisito relacionado

### R06 — Simulação de comunicação com uma API

A implementação atende ao requisito por meio de:

- carregamento assíncrono;
- simulação de latência;
- manipulação de JSON;
- validação do formato recebido;
- tipagem da resposta externa;
- tratamento de falhas;
- transformação dos dados externos para o modelo interno.

## Limitações atuais

Nesta etapa:

- a API é simulada por um arquivo local;
- os dados são somente lidos;
- não existe uma requisição HTTP real;
- o atraso é artificial;
- os dados permanecem armazenados apenas em memória;
- a importação é interrompida quando um paciente possui dados inválidos.