# Guia do Serviço de Triagem

Este documento descreve o funcionamento da classificação de risco utilizada no Sistema de Triagem da UPA.

A triagem analisa os dados do paciente e atribui automaticamente um nível de prioridade para organizar a fila de atendimento.

> **Aviso:** as regras utilizadas neste projeto possuem finalidade exclusivamente acadêmica. Elas não representam integralmente nenhum protocolo médico oficial e não devem ser utilizadas em atendimentos reais.

## Organização

As funcionalidades da triagem estão divididas entre o modelo e o serviço:

```text
src/
├── models/
│   └── paciente.ts
└── services/
    └── triagem-service.ts
```

### Modelo

O arquivo `src/models/paciente.ts` contém:

- o tipo `Prioridade`;
- a interface `DadosTriagem`;
- a interface `Paciente`.

### Serviço

O arquivo `src/services/triagem-service.ts` contém as regras responsáveis por analisar os dados e determinar a prioridade do paciente.

## Níveis de prioridade

| Prioridade | Nível de atendimento | Descrição acadêmica |
| :---: | --- | --- |
| `vermelho` | Emergência | Necessidade de atendimento imediato |
| `laranja` | Muito urgente | Necessidade de atendimento rápido |
| `amarelo` | Urgente | Situação que requer atenção |
| `verde` | Pouco urgente | Paciente estável com sintomas |
| `azul` | Não urgente | Situação sem sinais de urgência |

## Dados utilizados na triagem

A interface `DadosTriagem` representa as informações utilizadas na classificação:

```ts
export interface DadosTriagem {
  sintomas: string[];
  idade: number;
  nivelDor?: number;
  inconsciente?: boolean;
  dificuldadeRespirar?: boolean;
  sangramentoIntenso?: boolean;
}
```

| Propriedade | Tipo | Obrigatório | Finalidade |
| --- | --- | :---: | --- |
| `sintomas` | `string[]` | Sim | Sintomas relatados pelo paciente |
| `idade` | `number` | Sim | Idade do paciente |
| `nivelDor` | `number` | Não | Intensidade da dor entre 0 e 10 |
| `inconsciente` | `boolean` | Não | Indica se o paciente está inconsciente |
| `dificuldadeRespirar` | `boolean` | Não | Indica dificuldade respiratória |
| `sangramentoIntenso` | `boolean` | Não | Indica sangramento intenso |

As propriedades opcionais recebem valores padrão quando não são informadas:

```ts
nivelDor = 0;
inconsciente = false;
dificuldadeRespirar = false;
sangramentoIntenso = false;
```

## Função de classificação

A função principal do serviço é:

```ts
classificarPrioridade(dados: DadosTriagem): Prioridade
```

Ela recebe os dados da triagem e retorna um dos valores permitidos pelo tipo `Prioridade`.

Exemplo:

```ts
const prioridade = classificarPrioridade({
  idade: 30,
  sintomas: ["dor intensa"],
  nivelDor: 9,
});
```

Resultado:

```text
laranja
```

## Regras de classificação

As regras são avaliadas da maior para a menor prioridade.

### Prioridade vermelha

O paciente recebe prioridade `vermelho` quando pelo menos uma destas condições for verdadeira:

- estiver inconsciente;
- apresentar dificuldade para respirar;
- apresentar sangramento intenso.

```ts
if (
  inconsciente ||
  dificuldadeRespirar ||
  sangramentoIntenso
) {
  return "vermelho";
}
```

### Prioridade laranja

O paciente recebe prioridade `laranja` quando o nível de dor for igual ou superior a 8:

```ts
if (nivelDor >= 8) {
  return "laranja";
}
```

### Prioridade amarela

O paciente recebe prioridade `amarelo` quando apresentar uma destas condições:

- nível de dor entre 5 e 7;
- idade igual ou superior a 80 anos;
- relato de dor no peito.

```ts
if (
  nivelDor >= 5 ||
  idade >= 80 ||
  sintomas.some((sintoma) =>
    sintoma.toLowerCase().includes("dor no peito"),
  )
) {
  return "amarelo";
}
```

### Prioridade verde

O paciente recebe prioridade `verde` quando:

- apresentar nível de dor entre 1 e 4;
- possuir pelo menos um sintoma;
- não atender às regras de maior prioridade.

```ts
if (nivelDor >= 1 || sintomas.length > 0) {
  return "verde";
}
```

### Prioridade azul

O paciente recebe prioridade `azul` quando nenhuma condição anterior for identificada:

```ts
return "azul";
```

## Ordem de avaliação

A ordem das condições é importante. O sistema verifica primeiro as situações mais graves:

```text
Vermelho
   ↓
Laranja
   ↓
Amarelo
   ↓
Verde
   ↓
Azul
```

Quando uma condição é atendida, a função retorna imediatamente a prioridade correspondente e não verifica as condições seguintes.

Por exemplo, um paciente com dor de nível 9 e dificuldade respiratória recebe prioridade `vermelho`, porque a dificuldade respiratória é analisada antes do nível de dor.

## Integração com o cadastro

A prioridade não é mais informada livremente durante o cadastro.

O tipo `NovoPaciente` utiliza `Omit` para retirar os campos controlados pelo sistema:

```ts
export type NovoPaciente = Omit<
  Paciente,
  "id" | "dataChegada" | "status" | "prioridade"
>;
```

O serviço de pacientes chama o serviço de triagem:

```ts
const prioridade = classificarPrioridade({
  idade: dados.idade,
  sintomas: dados.sintomas,
});
```

Depois, o resultado é incluído no paciente:

```ts
const paciente: Paciente = {
  ...dados,
  id: gerarId(),
  dataChegada: new Date(),
  prioridade,
  status: "aguardando",
};
```

Assim, a prioridade é definida pelas regras do sistema e não diretamente pelo usuário.

## Validação do nível de dor

O nível de dor deve ser um número inteiro entre 0 e 10:

```ts
export function validarNivelDor(nivelDor: number): boolean {
  return (
    Number.isInteger(nivelDor) &&
    nivelDor >= 0 &&
    nivelDor <= 10
  );
}
```

Exemplos válidos:

```text
0
4
8
10
```

Exemplos inválidos:

```text
-1
5.5
11
```

## Recursos do TypeScript utilizados

O serviço de triagem utiliza:

- `interface` para representar os dados;
- Union Type para limitar as prioridades;
- propriedades opcionais;
- parâmetros tipados;
- retorno tipado;
- destructuring;
- valores padrão;
- operadores relacionais;
- operadores lógicos;
- estruturas `if`;
- método `some()`;
- Arrow Function.

## Exemplos de classificação

### Emergência

```ts
classificarPrioridade({
  idade: 30,
  sintomas: ["desmaio"],
  inconsciente: true,
});
```

Resultado:

```text
vermelho
```

### Dor muito intensa

```ts
classificarPrioridade({
  idade: 25,
  sintomas: ["dor intensa"],
  nivelDor: 9,
});
```

Resultado:

```text
laranja
```

### Dor no peito

```ts
classificarPrioridade({
  idade: 68,
  sintomas: ["dor no peito"],
});
```

Resultado:

```text
amarelo
```

### Sintomas sem sinais de maior gravidade

```ts
classificarPrioridade({
  idade: 42,
  sintomas: ["febre", "dor de cabeça"],
});
```

Resultado:

```text
verde
```

### Sem sintomas ou sinais de urgência

```ts
classificarPrioridade({
  idade: 40,
  sintomas: [],
});
```

Resultado:

```text
azul
```

## Limitação atual

Na etapa atual, o cadastro envia para a triagem somente:

- idade;
- sintomas.

Os seguintes dados serão coletados posteriormente pelo menu do terminal:

- nível de dor;
- estado de consciência;
- dificuldade respiratória;
- sangramento intenso.

Quando essa integração for realizada, o cadastro utilizará todos os dados disponíveis para calcular a prioridade.

## Próxima etapa

A próxima etapa será implementar o gerenciamento da fila de atendimento.

A fila deverá considerar:

1. a prioridade do paciente;
2. a data e o horário de chegada;
3. o status do atendimento.

Pacientes com maior prioridade serão posicionados antes daqueles com menor prioridade. Quando dois pacientes possuírem a mesma classificação, será atendido primeiro aquele que chegou antes.