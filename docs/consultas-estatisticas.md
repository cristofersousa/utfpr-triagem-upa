# Guia de Consultas e Estatísticas

Este documento descreve as funcionalidades responsáveis por consultar pacientes e gerar estatísticas no Sistema de Triagem da UPA.

Essas operações utilizam métodos de manipulação de arrays para transformar, filtrar, localizar, verificar e consolidar os dados armazenados.

## Organização dos arquivos

```text
src/
├── models/
│   ├── paciente.ts
│   └── estatistica.ts
└── services/
    ├── paciente-service.ts
    ├── consulta-service.ts
    └── estatistica-service.ts
```

### `paciente-service.ts`

Responsável por armazenar e disponibilizar a lista de pacientes cadastrados.

### `consulta-service.ts`

Responsável por realizar consultas específicas, como:

- localizar um paciente pelo nome;
- listar pacientes por prioridade;
- verificar se existe uma emergência;
- obter os nomes dos pacientes;
- gerar uma lista textual dos nomes.

### `estatistica-service.ts`

Responsável por:

- calcular a idade média;
- contabilizar pacientes por prioridade;
- contabilizar pacientes por status;
- gerar um relatório consolidado.

## Modelo das estatísticas

A interface `EstatisticasAtendimento` define o formato do relatório:

```ts
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
```

Essa interface garante que todas as estatísticas esperadas sejam retornadas pelo serviço.

## Consultas de pacientes

### Listar pacientes por prioridade

A função:

```ts
listarPacientesPorPrioridade(
  prioridade: Prioridade,
): Paciente[]
```

retorna todos os pacientes que possuem a prioridade informada.

Exemplo:

```ts
const pacientesAmarelos =
  listarPacientesPorPrioridade("amarelo");
```

A consulta utiliza `filter()`:

```ts
return listarPacientes().filter(
  (paciente) => paciente.prioridade === prioridade,
);
```

O método `filter()` retorna um novo array contendo apenas os pacientes que atendem à condição.

Quando nenhum paciente possuir a prioridade informada, será retornado um array vazio:

```ts
[]
```

### Buscar paciente pelo nome

A função:

```ts
buscarPacientePorNome(
  nome: string,
): Paciente | undefined
```

localiza o primeiro paciente cujo nome corresponde ao valor informado.

```ts
const nomeNormalizado = nome.trim().toLowerCase();

return listarPacientes().find(
  (paciente) =>
    paciente.nome.trim().toLowerCase() === nomeNormalizado,
);
```

Antes da comparação:

- `trim()` remove espaços no início e no final;
- `toLowerCase()` transforma o texto em letras minúsculas.

Isso permite que estas buscas sejam equivalentes:

```text
Maria da Silva
maria da silva
  MARIA DA SILVA
```

O método `find()` retorna:

- um objeto `Paciente`, quando encontra o registro;
- `undefined`, quando não encontra.

> Caso existam pacientes diferentes com nomes iguais, a função retornará somente o primeiro. Para identificar um paciente de forma única, deve-se utilizar seu `id`.

### Verificar paciente emergencial

A função:

```ts
existePacienteEmergencial(): boolean
```

verifica se existe pelo menos um paciente:

- com prioridade `vermelho`;
- com status `aguardando`.

```ts
return listarPacientes().some(
  (paciente) =>
    paciente.status === "aguardando" &&
    paciente.prioridade === "vermelho",
);
```

O método `some()` retorna:

```text
true
```

quando pelo menos um elemento atende à condição, ou:

```text
false
```

quando nenhum elemento atende.

Pacientes vermelhos que já estejam em atendimento, tenham sido atendidos ou tenham o atendimento cancelado não são considerados nessa verificação.

### Listar nomes dos pacientes

A função:

```ts
listarNomesPacientes(): string[]
```

transforma o array de pacientes em um array de nomes:

```ts
return listarPacientes().map(
  (paciente) => paciente.nome,
);
```

O método `map()` realiza a transformação:

```text
Paciente[] → string[]
```

Exemplo:

```ts
[
  { nome: "Maria da Silva", ... },
  { nome: "João dos Santos", ... },
]
```

Resultado:

```ts
[
  "Maria da Silva",
  "João dos Santos",
]
```

### Gerar lista textual dos nomes

A função:

```ts
gerarListaNomes(): string
```

utiliza `join()` para unir os nomes:

```ts
return listarNomesPacientes().join(", ");
```

Exemplo:

```ts
["Maria da Silva", "João dos Santos"]
```

Resultado:

```text
Maria da Silva, João dos Santos
```

Quando não houver pacientes cadastrados, o resultado será uma string vazia:

```ts
""
```

## Estatísticas de atendimento

### Calcular idade média

A função:

```ts
calcularIdadeMedia(): number
```

calcula a média das idades dos pacientes cadastrados.

Primeiro, o sistema verifica se existem pacientes:

```ts
if (pacientes.length === 0) {
  return 0;
}
```

Essa verificação evita uma divisão por zero.

Depois, o método `reduce()` soma as idades:

```ts
const somaIdades = pacientes.reduce(
  (acumulador, paciente) =>
    acumulador + paciente.idade,
  0,
);
```

O valor `0` representa o valor inicial do acumulador.

Considere as idades:

```ts
[42, 68, 30]
```

O processamento será:

```text
0 + 42 = 42
42 + 68 = 110
110 + 30 = 140
```

A média é obtida dividindo a soma pela quantidade:

```ts
return somaIdades / pacientes.length;
```

Nesse exemplo:

```text
140 ÷ 3 = 46,67
```

### Gerar estatísticas consolidadas

A função:

```ts
gerarEstatisticas(): EstatisticasAtendimento
```

percorre os pacientes e produz um relatório contendo:

- total de pacientes;
- total aguardando;
- total em atendimento;
- total atendido;
- total cancelado;
- idade média;
- quantidade por prioridade;
- quantidade por status.

O objeto inicial contém todas as contagens zeradas:

```ts
const estatisticasIniciais: EstatisticasAtendimento = {
  totalPacientes: 0,
  totalAguardando: 0,
  totalEmAtendimento: 0,
  totalAtendidos: 0,
  totalCancelados: 0,
  idadeMedia: 0,

  pacientesPorPrioridade: {
    vermelho: 0,
    laranja: 0,
    amarelo: 0,
    verde: 0,
    azul: 0,
  },

  pacientesPorStatus: {
    aguardando: 0,
    "em-atendimento": 0,
    atendido: 0,
    cancelado: 0,
  },
};
```

O método `reduce()` utiliza esse objeto como acumulador e atualiza suas contagens para cada paciente.

## Contagem por prioridade

A prioridade do paciente é usada como chave do objeto:

```ts
acumulador.pacientesPorPrioridade[
  paciente.prioridade
]++;
```

Exemplo de resultado:

```ts
{
  vermelho: 1,
  laranja: 0,
  amarelo: 2,
  verde: 3,
  azul: 1,
}
```

O uso de:

```ts
Record<Prioridade, number>
```

garante que todas as prioridades estejam representadas e que seus valores sejam números.

## Contagem por status

O status também é utilizado como chave:

```ts
acumulador.pacientesPorStatus[
  paciente.status
]++;
```

Exemplo:

```ts
{
  aguardando: 4,
  "em-atendimento": 1,
  atendido: 2,
  cancelado: 0,
}
```

O tipo:

```ts
Record<StatusAtendimento, number>
```

obriga o relatório a possuir uma contagem para cada status permitido.

## Uso do `switch`

Além da contagem agrupada por status, o sistema utiliza `switch` para atualizar os totais específicos:

```ts
switch (paciente.status) {
  case "aguardando":
    acumulador.totalAguardando++;
    break;

  case "em-atendimento":
    acumulador.totalEmAtendimento++;
    break;

  case "atendido":
    acumulador.totalAtendidos++;
    break;

  case "cancelado":
    acumulador.totalCancelados++;
    break;
}
```

Cada `case` representa um estado possível do atendimento.

O `break` encerra o caso atual e impede que os casos seguintes sejam executados.

## Exemplo de relatório

Considere os seguintes pacientes:

| Paciente | Idade | Prioridade | Status |
| --- | :---: | :---: | :---: |
| Maria | 42 | `verde` | `aguardando` |
| João | 68 | `amarelo` | `em-atendimento` |
| Ana | 30 | `vermelho` | `aguardando` |
| Carlos | 60 | `verde` | `atendido` |

O relatório será semelhante a:

```text
Total de pacientes: 4
Aguardando: 2
Em atendimento: 1
Atendidos: 1
Cancelados: 0
Idade média: 50,0 anos

Pacientes por prioridade:
vermelho: 1
laranja: 0
amarelo: 1
verde: 2
azul: 0
```

## Métodos de arrays utilizados

| Método | Aplicação no sistema | Tipo de resultado |
| --- | --- | --- |
| `map()` | Transformar pacientes em nomes | Novo array |
| `filter()` | Listar pacientes por prioridade | Novo array |
| `find()` | Localizar o primeiro paciente pelo nome | Elemento ou `undefined` |
| `some()` | Verificar se existe uma emergência | `boolean` |
| `reduce()` | Somar idades e consolidar estatísticas | Valor acumulado |
| `join()` | Transformar nomes em texto | `string` |

## Diferença entre os métodos

### `map()`

Utilizado quando todos os elementos precisam ser transformados:

```text
Paciente[] → string[]
```

### `filter()`

Utilizado quando queremos manter somente os elementos que atendem a uma condição:

```text
Paciente[] → Paciente[]
```

### `find()`

Utilizado quando queremos localizar somente o primeiro elemento correspondente:

```text
Paciente[] → Paciente | undefined
```

### `some()`

Utilizado quando queremos saber se existe pelo menos um elemento correspondente:

```text
Paciente[] → boolean
```

### `reduce()`

Utilizado quando queremos transformar todo o array em um único resultado:

```text
Paciente[] → EstatisticasAtendimento
```

### `join()`

Utilizado para unir os elementos de um array em uma string:

```text
string[] → string
```

## Recursos do TypeScript utilizados

A implementação utiliza:

- interfaces;
- Type Aliases;
- Union Types;
- `Record`;
- arrays de objetos;
- funções tipadas;
- retornos opcionais com `undefined`;
- Arrow Functions;
- inferência de tipos;
- `switch`;
- `if`;
- operadores relacionais;
- métodos avançados de arrays;
- importação e exportação de módulos.

## Requisitos relacionados

### R04 — Consulta, busca e geração de estatísticas

A implementação permite:

- listar pacientes por prioridade;
- localizar pacientes pelo nome;
- verificar a existência de situações emergenciais;
- calcular a idade média;
- contabilizar pacientes por prioridade;
- contabilizar pacientes por status;
- gerar informações consolidadas.

### R05 — Modelagem das entidades

A interface `EstatisticasAtendimento` define uma estrutura tipada para o relatório.

### RA02 — Utility Types

O tipo `Record` relaciona:

- cada prioridade à sua quantidade;
- cada status à sua quantidade.

## Limitações atuais

Nesta etapa:

- as consultas consideram somente os dados mantidos em memória;
- a busca por nome retorna somente o primeiro resultado;
- pacientes com nomes iguais devem ser diferenciados pelo `id`;
- as estatísticas são recalculadas sempre que solicitadas;
- os dados não permanecem disponíveis depois que o sistema é encerrado;
- ainda não existe persistência em arquivo ou banco de dados;
- ainda não existe menu interativo no terminal.

## Próxima etapa

A próxima etapa será implementar a simulação de comunicação com uma API.

Essa implementação deverá utilizar:

- funções assíncronas;
- `Promise`;
- retorno tipado;
- carregamento de dados externos simulados;
- conversão e manipulação de JSON;
- tratamento de falhas com os códigos de erro da aplicação.