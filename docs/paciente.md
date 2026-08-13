# Guia do Paciente

Este documento descreve a modelagem da entidade `Paciente` e as responsabilidades das funções utilizadas para os pacientes, tais como:

1. Cadastrar
2. Consultar 
3. Atualizar 

## Organização

As funcionalidades relacionadas aos pacientes estão divididas entre o modelo e o serviço:

```text
src/
├── models/
│   └── paciente.ts
└── services/
    └── paciente-service.ts
```

### Modelo

O arquivo `src/models/paciente.ts` é responsável pela definição dos tipos e estruturas de dados do paciente.

Ele contém:

- `Prioridade`;
- `StatusAtendimento`;
- `Paciente`;
- `NovoPaciente`;
- `AtualizacaoPaciente`.

### Serviço

O arquivo `src/services/paciente-service.ts` é responsável pelas regras de gerenciamento dos pacientes.

Ele contém funções para:

- cadastrar pacientes;
- listar pacientes;
- localizar um paciente pelo identificador;
- atualizar informações de um paciente.

## Regra de unicidade do CPF

O CPF é utilizado como identificador documental e não pode estar relacionado a mais de um paciente.

Antes de concluir o cadastro, o serviço normaliza o CPF e verifica se já existe outro registro com o mesmo documento.

```ts
buscarPacientePorCpf(cpf: string): Paciente | undefined
```

## Níveis de prioridade

O tipo `Prioridade` define os valores permitidos para a classificação de risco:

```ts
type Prioridade =
  | "vermelho"
  | "laranja"
  | "amarelo"
  | "verde"
  | "azul";
```

O uso de Union Type impede que valores não previstos, como `"urgente"` ou `"crítico"`, sejam utilizados como prioridade.

## Status do atendimento

O tipo `StatusAtendimento` representa a situação atual do paciente:

```ts
type StatusAtendimento =
  | "aguardando"
  | "em-atendimento"
  | "atendido"
  | "cancelado";
```

## Estrutura do paciente

A interface `Paciente` representa um paciente registrado no sistema.

| Propriedade | Tipo | Obrigatório | Finalidade |
| --- | --- | :---: | --- |
| `id` | `string` | Sim | Identificação única do paciente |
| `nome` | `string` | Sim | Nome completo |
| `idade` | `number` | Sim | Idade do paciente |
| `cpf` | `string` | Sim | Documento usado na identificação |
| `telefone` | `string` | Não | Forma de contato |
| `sintomas` | `string[]` | Sim | Lista de sintomas relatados |
| `dataChegada` | `Date` | Sim | Momento da entrada na UPA |
| `prioridade` | `Prioridade` | Sim | Classificação de risco |
| `status` | `StatusAtendimento` | Sim | Situação atual do atendimento |

A propriedade `id` utiliza `readonly` porque não deve ser alterada depois que o paciente for cadastrado.

A propriedade `telefone` é opcional, pois seu tipo foi declarado utilizando `?`:

```ts
telefone?: string;
```

## Tipos auxiliares

### `NovoPaciente`

O tipo `NovoPaciente` representa os dados necessários para cadastrar um paciente:

```ts
type NovoPaciente = Omit<
  Paciente,
  "id" | "dataChegada" | "status"
>;
```

Os campos `id`, `dataChegada` e `status` foram omitidos porque são gerados automaticamente pelo sistema.

### `AtualizacaoPaciente`

O tipo `AtualizacaoPaciente` representa os campos que podem ser modificados:

```ts
type AtualizacaoPaciente = Partial<
  Pick<
    Paciente,
    "nome" | "idade" | "telefone" | "sintomas" | "prioridade"
  >
>;
```

O `Pick` seleciona somente as propriedades que podem ser atualizadas.

O `Partial` transforma essas propriedades em opcionais, permitindo atualizar apenas uma ou algumas informações do paciente.

## Funções do serviço

### `cadastrarPaciente()`

```ts
cadastrarPaciente(dados: NovoPaciente): Paciente
```

Responsabilidades:

- receber os dados do novo paciente;
- gerar um identificador;
- registrar a data de chegada;
- definir o status inicial como `"aguardando"`;
- adicionar o paciente à lista;
- retornar o paciente cadastrado.

### `listarPacientes()`

```ts
listarPacientes(): ReadonlyArray<Paciente>
```

Responsabilidades:

- retornar os pacientes cadastrados;
- impedir que a lista seja modificada diretamente por quem chama a função.

### `buscarPacientePorId()`

```ts
buscarPacientePorId(id: string): Paciente | undefined
```

Responsabilidades:

- localizar um paciente pelo identificador;
- retornar `undefined` quando o paciente não for encontrado.

### `atualizarPaciente()`

```ts
atualizarPaciente(
  id: string,
  alteracoes: AtualizacaoPaciente,
): Paciente | undefined
```

Responsabilidades:

- localizar o paciente pelo identificador;
- aplicar somente as alterações recebidas;
- retornar o paciente atualizado;
- retornar `undefined` quando o paciente não existir.

## Armazenamento

Nesta etapa, os pacientes são armazenados em um array em memória:

```ts
const pacientes: Paciente[] = [];
```

Os dados permanecem disponíveis somente durante a execução do programa. Quando o sistema é encerrado, os registros são apagados.