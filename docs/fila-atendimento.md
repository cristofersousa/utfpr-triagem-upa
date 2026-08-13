# Guia da Fila de Atendimento

Este documento descreve o funcionamento da fila de atendimento do Sistema de Triagem da UPA.

A fila organiza os pacientes conforme:

1. prioridade definida pela triagem;
2. data e horário de chegada;
3. status atual do atendimento.

> As regras deste projeto têm finalidade exclusivamente acadêmica e não devem ser utilizadas como protocolo médico real.

## Organização dos arquivos

```text
src/
├── config/
│   └── prioridades.ts
└── services/
    ├── paciente-service.ts
    └── fila-service.ts
```

### `prioridades.ts`

Responsável por relacionar cada prioridade a um peso numérico.

### `paciente-service.ts`

Responsável por armazenar os pacientes e permitir a alteração do status do atendimento.

### `fila-service.ts`

Responsável por:

- listar a fila ordenada;
- chamar o próximo paciente;
- finalizar um atendimento;
- desconsiderar pacientes que não estão aguardando.

## Peso das prioridades

O sistema utiliza um peso numérico para ordenar os pacientes:

| Prioridade | Peso | Classificação |
| :---: | :---: | --- |
| `vermelho` | 5 | Emergência |
| `laranja` | 4 | Muito urgente |
| `amarelo` | 3 | Urgente |
| `verde` | 2 | Pouco urgente |
| `azul` | 1 | Não urgente |

A configuração é representada por um `Record`:

```ts
export const PESO_PRIORIDADE: Record<Prioridade, number> = {
  vermelho: 5,
  laranja: 4,
  amarelo: 3,
  verde: 2,
  azul: 1,
};
```

## Uso do `Record`

O Utility Type:

```ts
Record<Prioridade, number>
```

determina que:

- todas as prioridades precisam estar presentes;
- cada prioridade precisa possuir um valor do tipo `number`;
- nenhuma prioridade diferente das previstas pode ser adicionada.

Se uma prioridade for esquecida, o TypeScript apresentará um erro durante a verificação do código.

Esse recurso contribui para o requisito **RA02 — Utility Types**.

## Regras da fila

Para participar da fila, o paciente deve possuir o status:

```ts
"aguardando"
```

Pacientes com estes status não aparecem na fila:

```text
em-atendimento
atendido
cancelado
```

A ordenação utiliza duas regras.

### Primeira regra: prioridade

Pacientes com maior peso aparecem primeiro:

```text
vermelho
laranja
amarelo
verde
azul
```

### Segunda regra: ordem de chegada

Quando dois pacientes possuem a mesma prioridade, será posicionado primeiro aquele que chegou antes.

Exemplo:

| Paciente | Prioridade | Chegada | Posição |
| --- | :---: | :---: | :---: |
| Maria | `amarelo` | 10:05 | 1 |
| João | `amarelo` | 10:15 | 2 |

## Alteração do status

A função abaixo pertence ao serviço de pacientes:

```ts
alterarStatusAtendimento(
  id: string,
  novoStatus: StatusAtendimento,
): Paciente | undefined
```

Responsabilidades:

- localizar o paciente pelo identificador;
- alterar o status do atendimento;
- retornar o paciente atualizado;
- retornar `undefined` quando o paciente não for encontrado.

A alteração permanece no serviço de pacientes porque esse serviço é responsável por modificar os dados armazenados.

## Listagem da fila

A função:

```ts
listarFilaAtendimento(): Paciente[]
```

possui as seguintes responsabilidades:

1. obter todos os pacientes;
2. filtrar somente os pacientes aguardando;
3. criar uma nova lista;
4. ordenar pela prioridade;
5. desempatar pela data de chegada;
6. retornar a fila ordenada.

### Filtragem

```ts
const pacientesAguardando = listarPacientes().filter(
  (paciente) => paciente.status === "aguardando",
);
```

O método `filter()` cria uma lista contendo somente os pacientes que aguardam atendimento.

### Cópia do array

```ts
[...pacientesAguardando]
```

O Spread Operator cria uma nova lista antes da ordenação.

Isso evita alterar diretamente o array utilizado como fonte dos dados, pois o método `sort()` modifica o array no qual é executado.

### Ordenação por prioridade

```ts
const diferencaPrioridade =
  PESO_PRIORIDADE[pacienteB.prioridade] -
  PESO_PRIORIDADE[pacienteA.prioridade];
```

A subtração posiciona primeiro o paciente com o maior peso.

### Desempate pela chegada

```ts
pacienteA.dataChegada.getTime() -
pacienteB.dataChegada.getTime()
```

O método `getTime()` transforma a data em um valor numérico. A menor data representa o paciente que chegou primeiro.

## Chamada do próximo paciente

A função:

```ts
chamarProximoPaciente(): Paciente | undefined
```

possui as seguintes responsabilidades:

1. obter a fila ordenada;
2. selecionar o primeiro paciente;
3. verificar se a fila está vazia;
4. alterar o status para `em-atendimento`;
5. retornar o paciente chamado.

```ts
const fila = listarFilaAtendimento();
const proximoPaciente = fila[0];
```

O retorno pode ser `undefined` porque talvez não existam pacientes aguardando.

Quando um paciente é chamado, seu status muda:

```text
aguardando → em-atendimento
```

Por isso, ele deixa de aparecer na próxima listagem da fila.

## Finalização do atendimento

A função:

```ts
finalizarAtendimento(
  id: string,
): Paciente | undefined
```

altera o status do paciente para:

```ts
"atendido"
```

Fluxo do atendimento:

```text
aguardando
    ↓
em-atendimento
    ↓
atendido
```

## Exemplo de fila

Considere os pacientes:

| Paciente | Prioridade | Chegada |
| --- | :---: | :---: |
| Maria | `verde` | 09:30 |
| João | `vermelho` | 09:45 |
| Carlos | `amarelo` | 09:10 |
| Ana | `vermelho` | 09:40 |

A fila será:

| Posição | Paciente | Prioridade | Chegada |
| :---: | --- | :---: | :---: |
| 1 | Ana | `vermelho` | 09:40 |
| 2 | João | `vermelho` | 09:45 |
| 3 | Carlos | `amarelo` | 09:10 |
| 4 | Maria | `verde` | 09:30 |

Embora Carlos tenha chegado antes, Ana e João possuem uma prioridade superior.

Entre Ana e João, Ana aparece primeiro porque chegou antes.

## Fila vazia

Quando não houver pacientes aguardando, a função retorna:

```ts
undefined
```

A camada responsável pela exibição poderá apresentar:

```text
Não existem pacientes aguardando atendimento.
```

Esse comportamento não representa um erro do sistema. É apenas um estado válido da fila.

## Recursos utilizados

A implementação da fila utiliza:

- funções com parâmetros e retornos tipados;
- módulos com `import` e `export`;
- `Record`;
- arrays de objetos;
- `filter()`;
- `sort()`;
- Spread Operator;
- Arrow Functions;
- Conditional `if`;
- operadores relacionais;
- acesso a índices de arrays;
- Union Types;
- `Paciente | undefined`;
- manipulação de datas com `getTime()`.

## Requisitos relacionados

A fila contribui principalmente para:

### R03 — Classificação e gerenciamento da fila

- aplicação das regras de prioridade;
- controle da ordem de atendimento;
- atualização do fluxo do paciente;
- uso de estruturas de decisão.

### R04 — Consulta, busca e geração de estatísticas

- uso de `filter()` para selecionar pacientes aguardando;
- manipulação de arrays de pacientes.

### RA02 — Utility Types

- uso de `Record<Prioridade, number>` para relacionar todas as prioridades aos respectivos pesos.

## Limitações atuais

Nesta etapa:

- os pacientes permanecem armazenados somente em memória;
- a fila não persiste depois que o programa é encerrado;
- ainda não existe uma interface interativa no terminal;
- ainda não existe registro do horário de início e término do atendimento;
- o cancelamento será integrado posteriormente ao menu.

## Próxima etapa

A próxima etapa será implementar as consultas e estatísticas do sistema, utilizando:

- `map()`;
- `filter()`;
- `find()`;
- `some()`;
- `reduce()`;
- `join()`.

Essas operações permitirão consultar pacientes, verificar situações específicas e gerar informações consolidadas para a equipe.