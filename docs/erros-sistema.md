# Guia de Erros da Aplicação

Este documento descreve a estratégia utilizada para identificar, classificar e apresentar erros no Sistema de Triagem da UPA.

O sistema diferencia erros causados por dados ou operações inválidas de falhas internas que precisam ser analisadas pela equipe de TI.

## Tipos de erro

### Erros do usuário

São problemas que podem ser corrigidos pelo próprio usuário, como:

- nome inválido;
- idade fora do intervalo permitido;
- CPF em formato incorreto;
- telefone em formato inválido;
- ausência de sintomas;
- paciente não encontrado;
- prioridade inválida.

Esses erros devem apresentar uma mensagem clara, explicando como o dado pode ser corrigido.

Exemplo:

```text
[VAL-001] O nome deve possuir pelo menos 3 caracteres.
```

### Erros do sistema

São falhas inesperadas ou técnicas que não podem ser resolvidas diretamente pelo usuário, como:

- falha durante o carregamento dos dados;
- erro na comunicação com a API simulada;
- erro interno não identificado;
- falha durante o processamento de uma operação.

Nesses casos, o sistema deve apresentar um código que possa ser informado à equipe de TI.

Exemplo:

```text
[SYS-001] Ocorreu um erro interno inesperado.
Entre em contato com o TI e informe o código SYS-001.
```

## Categorias

| Categoria | Prefixo | Exemplo | Responsabilidade |
| --- | :---: | :---: | --- |
| Validação | `VAL` | `VAL-001` | Dados inválidos informados pelo usuário |
| Paciente | `PAC` | `PAC-001` | Operações relacionadas aos pacientes |
| Triagem | `TRI` | `TRI-001` | Classificação e gerenciamento da prioridade |
| Sistema | `SYS` | `SYS-001` | Falhas internas ou inesperadas |
| API simulada | `API` | `API-001` | Carregamento ou processamento de dados externos |

## Códigos cadastrados

| Código | Identificador | Tipo | Descrição |
| :---: | --- | :---: | --- |
| `VAL-001` | `NOME_INVALIDO` | Usuário | Nome com menos de três caracteres |
| `VAL-002` | `IDADE_INVALIDA` | Usuário | Idade fora do intervalo permitido |
| `VAL-003` | `CPF_INVALIDO` | Usuário | CPF fora do formato esperado |
| `VAL-004` | `TELEFONE_INVALIDO` | Usuário | Telefone fora do formato esperado |
| `VAL-005` | `SINTOMAS_INVALIDOS` | Usuário | Paciente sem sintomas válidos |
| `PAC-001` | `PACIENTE_NAO_ENCONTRADO` | Usuário | Identificador do paciente não localizado |
| `PAC-002` | `CPF_JA_CADASTRADO` | Usuário | CPF já relacionado a outro paciente |
| `TRI-001` | `PRIORIDADE_INVALIDA` | Usuário | Prioridade não reconhecida pelo sistema |
| `SYS-001` | `ERRO_INTERNO` | Sistema | Falha interna inesperada |
| `API-001` | `FALHA_CARREGAMENTO_API` | Sistema | Falha no carregamento dos dados simulados |

## Estrutura dos arquivos

```text
src/
└── errors/
    ├── codigos-erro.ts
    └── erro-aplicacao.ts
```

### `codigos-erro.ts`

Responsável por centralizar os códigos reconhecidos pela aplicação:

```ts
export const CODIGOS_ERRO = {
  NOME_INVALIDO: "VAL-001",
  IDADE_INVALIDA: "VAL-002",
  CPF_INVALIDO: "VAL-003",
  TELEFONE_INVALIDO: "VAL-004",
  SINTOMAS_INVALIDOS: "VAL-005",

  PACIENTE_NAO_ENCONTRADO: "PAC-001",
  CPF_JA_CADASTRADO: "PAC-002",

  PRIORIDADE_INVALIDA: "TRI-001",

  ERRO_INTERNO: "SYS-001",
  FALHA_CARREGAMENTO_API: "API-001",
} as const;
```

O uso de `as const` mantém cada código como um valor literal e impede sua alteração.

### `erro-aplicacao.ts`

Responsável pelas classes utilizadas para representar erros conhecidos pela aplicação.

A classe `ErroAplicacao` contém:

- código do erro;
- mensagem;
- tipo do erro;
- informações técnicas herdadas da classe `Error`.

A classe `ErroValidacaoPaciente` permite reunir diversos erros encontrados durante a validação de um cadastro.

## Fluxo de tratamento

```text
Operação solicitada
        ↓
Validação ou processamento
        ↓
Erro identificado?
   ├── Não → continua a operação
   └── Sim
        ↓
Erro do usuário ou do sistema?
   ├── Usuário → apresenta orientação para correção
   └── Sistema → apresenta código para contato com o TI
```

## Exemplo com múltiplos erros

Quando o cadastro possuir mais de um campo inválido, todos os problemas serão apresentados:

```text
Não foi possível cadastrar o paciente:

[VAL-001] O nome deve possuir pelo menos 3 caracteres.
[VAL-002] A idade deve ser um número inteiro entre 0 e 130.
[VAL-003] O CPF deve seguir o formato 000.000.000-00.
```

Essa abordagem evita que o usuário precise corrigir e reenviar cada campo individualmente para descobrir o próximo problema.

## Observação sobre os códigos

Os códigos identificam a categoria e a natureza do erro, mas não substituem o registro técnico da falha.

Em uma aplicação real, os erros internos poderiam ser associados a:

- data e horário;
- operação executada;
- detalhes técnicos;
- stack trace;
- protocolo único da ocorrência.

Neste projeto, os códigos serão utilizados para simular o atendimento e a comunicação com a equipe de TI.