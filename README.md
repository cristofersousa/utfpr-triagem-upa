# Sistema de Triagem para UPA

Projeto desenvolvido em TypeScript para simular o cadastro, a classificação de risco e o gerenciamento da fila de pacientes de uma Unidade de Pronto Atendimento (UPA).

O sistema será executado pelo terminal utilizando Node.js e desenvolvido de forma incremental durante a disciplina.

## Tecnologias

- TypeScript
- Node.js
- TSX
- Node.js Test Runner (`node:test`)

## Funcionalidades previstas

- Cadastro e atualização de pacientes;
- Classificação de risco;
- Organização da fila de atendimento;
- Consulta de pacientes;
- Geração de estatísticas;
- Simulação do carregamento de dados externos;
- Carregamento assíncrono de pacientes a partir de um arquivo JSON;
- Validação dos dados recebidos de uma fonte externa;
- Tratamento de falhas durante o carregamento dos dados.
- Validação de dados;
- Testes automatizados.

## Requisitos | Status  | Implementação

A tabela abaixo relaciona cada requisito da atividade à implementação realizada no projeto.

| Requisito                                   |  Status   | Implementação                                                          |
| ------------------------------------------- | :-------: | ---------------------------------------------------------------------- |
| R01 — Cadastro e gerenciamento de pacientes | Concluído | Cadastro, listagem, consulta e atualização de pacientes tipados        |
| R02 — Organização das funcionalidades       | Concluído | Separação em modelos, serviços, validadores, API e ações da CLI        |
| R03 — Classificação e fila                  | Concluído | Classificação de risco, ordenação da fila e controle do atendimento    |
| R04 — Consultas e estatísticas              | Concluído | Uso de `map`, `filter`, `find`, `some`, `reduce` e `join`              |
| R05 — Modelagem das entidades               | Concluído | Interfaces, Type Aliases, Union Types, destructuring e Spread Operator |
| R06 — API simulada                          | Concluído | Leitura assíncrona de JSON com Promises, `async` e `await`             |
| R07 — Testes automatizados                  | Pendente  | Será implementado utilizando `node:test`                               |
| RA01 — Expressões Regulares                 | Concluído | Validação do formato de CPF e telefone com Regex                       |
| RA02 — Utility Types                        | Concluído | Uso de `Omit`, `Pick`, `Partial`, `ReadonlyArray` e `Record`           |
| RA03 — Recurso avançado                     | Pendente  | Será implementado com Pattern Matching utilizando `ts-pattern`         |

### R01 — Cadastro e gerenciamento de pacientes

O sistema permite cadastrar pacientes por meio do terminal, armazenando nome, idade, CPF, telefone, sintomas, data de chegada, prioridade e status.

Também estão disponíveis operações para:

- listar pacientes;
- consultar por ID;
- consultar por nome;
- atualizar informações;
- alterar o status do atendimento;
- impedir CPF duplicado.

A modelagem está em `src/models/paciente.ts`, enquanto as regras estão em `src/services/paciente-service.ts`.

### R02 — Organização das funcionalidades

O projeto foi dividido em módulos independentes:

- `models`: definição das estruturas tipadas;
- `services`: regras de negócio;
- `validators`: validação dos dados;
- `api`: carregamento de dados externos;
- `cli`: interação pelo terminal;
- `errors`: códigos e classes de erros;
- `config`: configurações do sistema.

Foram utilizadas funções reutilizáveis, parâmetros obrigatórios, opcionais, default e Arrow Functions, além de importações nomeadas e de tipos.

### R03 — Classificação e gerenciamento da fila

A classificação considera informações como:

- nível de dor;
- idade;
- sintomas;
- estado de consciência;
- dificuldade respiratória;
- sangramento intenso.

A fila seleciona pacientes com status `aguardando` e os ordena primeiro pela prioridade e depois pela data de chegada.

O fluxo do atendimento é:

```text
aguardando → em-atendimento → atendido
```

A implementação utiliza `if`, `switch`, operador ternário, `while`, `continue`, operadores lógicos e relacionais.

### R04 — Consultas e estatísticas

Foram utilizados os métodos solicitados:

| Método     | Utilização                                             |
| ---------- | ------------------------------------------------------ |
| `map()`    | Transformação e importação de pacientes                |
| `filter()` | Seleção dos pacientes aguardando e por prioridade      |
| `find()`   | Busca por ID, nome e CPF                               |
| `some()`   | Verificação de pacientes emergenciais                  |
| `reduce()` | Cálculo da idade média e consolidação das estatísticas |
| `join()`   | Exibição da lista de sintomas e nomes                  |

O sistema apresenta totais por prioridade e status, além da idade média.

### R05 — Modelagem das entidades

O domínio foi modelado com:

- interfaces;
- Type Aliases;
- Union Types;
- propriedades opcionais;
- propriedades `readonly`;
- arrays de objetos;
- destructuring;
- Spread Operator.

Exemplos:

```ts
type Prioridade = "vermelho" | "laranja" | "amarelo" | "verde" | "azul";
```

```ts
interface Paciente {
  readonly id: string;
  nome: string;
  idade: number;
  sintomas: string[];
  prioridade: Prioridade;
}
```

### R06 — API simulada e assincronismo

O arquivo `data/pacientes.json` simula a resposta de uma fonte externa.

A função:

```ts
carregarPacientesApi(): Promise<PacienteApi[]>
```

realiza:

1. leitura assíncrona do arquivo;
2. conversão com `JSON.parse`;
3. validação da estrutura;
4. transformação dos dados externos;
5. importação dos pacientes.

Foram utilizados `Promise`, `async`, `await`, `unknown`, Type Predicate e tratamento com `try/catch`.

### R07 — Testes automatizados

Os testes serão implementados com o Node.js Test Runner:

```ts
node: test;
```

Serão validados:

- cadastro;
- validações;
- classificação;
- ordenação da fila;
- consultas;
- estatísticas;
- carregamento assíncrono;
- bloqueio de CPF duplicado.

> Este requisito permanece pendente nesta etapa.

### RA01 — Validação com Expressões Regulares

O formato do CPF é validado com:

```ts
/^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
```

O telefone é validado com:

```ts
/^\(\d{2}\) \d{4,5}-\d{4}$/;
```

Também é utilizada Regex para normalizar o CPF:

```ts
cpf.replace(/\D/g, "");
```

A validação atual verifica o formato do CPF, não seus dígitos verificadores.

### RA02 — Utility Types

Foram utilizados:

| Utility Type    | Aplicação                                          |
| --------------- | -------------------------------------------------- |
| `Omit`          | Remover campos gerados automaticamente no cadastro |
| `Pick`          | Selecionar os campos permitidos na atualização     |
| `Partial`       | Tornar opcionais os campos de atualização          |
| `Record`        | Relacionar prioridades, status, pesos e rótulos    |
| `ReadonlyArray` | Evitar alteração direta das listas recebidas       |

Exemplo:

```ts
type AtualizacaoPaciente = Partial<
  Pick<Paciente, "nome" | "idade" | "telefone" | "sintomas" | "prioridade">
>;
```

### RA03 — Recurso avançado do ecossistema TypeScript

Será utilizada a biblioteca `ts-pattern` para aplicar Pattern Matching na classificação de risco.

O recurso será estudado e incorporado antes da entrega final.

> Este requisito permanece pendente nesta etapa.

## Estrutura do projeto

```text
sistema-triagem-upa/
├── data/
│   └── pacientes.json
├── docs/
│   ├── api-simulada.md
│   ├── consultas-estatisticas.md
│   ├── erros-sistema.md
│   ├── fila-atendimento.md
│   ├── menu-terminal.md
│   ├── paciente.md
│   └── triagem.md
├── src/
│   ├── api/
│   │   └── paciente-api.ts
│   ├── cli/
│   │   ├── acoes/
│   │   │   ├── cadastrar-paciente.ts
│   │   │   ├── chamar-proximo-paciente.ts
│   │   │   ├── consultar-paciente.ts
│   │   │   ├── exibir-estatisticas.ts
│   │   │   ├── exibir-fila.ts
│   │   │   ├── finalizar-atendimento.ts
│   │   │   ├── importar-pacientes.ts
│   │   │   └── listar-pacientes.ts
│   │   ├── exibidores/
│   │   │   └── paciente.ts
│   │   ├── menu.ts
│   │   └── terminal.ts
│   ├── config/
│   │   ├── prioridades.ts
│   │   └── sistema.ts
│   ├── errors/
│   │   ├── codigos-erro.ts
│   │   └── erro-aplicacao.ts
│   ├── models/
│   │   ├── estatistica.ts
│   │   ├── paciente-api.ts
│   │   └── paciente.ts
│   ├── services/
│   │   ├── consulta-service.ts
│   │   ├── estatistica-service.ts
│   │   ├── fila-service.ts
│   │   ├── paciente-service.ts
│   │   └── triagem-service.ts
│   ├── validators/
│   │   └── paciente-validator.ts
│   └── index.ts
├── tests/
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

### Responsabilidades dos diretórios

| Diretório         | Responsabilidade                                              |
| ----------------- | ------------------------------------------------------------- |
| `data/`           | Armazena o arquivo JSON utilizado para simular dados externos |
| `docs/`           | Contém a documentação detalhada dos módulos e das regras      |
| `src/api/`        | Lê, converte e valida dados externos                          |
| `src/cli/`        | Implementa a interação do usuário pelo terminal               |
| `src/config/`     | Centraliza configurações e valores fixos do sistema           |
| `src/errors/`     | Define códigos e classes de erros da aplicação                |
| `src/models/`     | Define interfaces, Type Aliases e contratos de dados          |
| `src/services/`   | Implementa as regras de negócio                               |
| `src/validators/` | Valida os dados de entrada                                    |
| `tests/`          | Será utilizado pelos testes automatizados                     |

## Interface de linha de comando

A aplicação não possui interface gráfica. A interação acontece pelo terminal por meio de uma CLI (_Command-Line Interface_).

O usuário pode executar as seguintes operações:

1. cadastrar um paciente;
2. listar os pacientes;
3. consultar um paciente por ID ou nome;
4. visualizar a fila de atendimento;
5. chamar o próximo paciente;
6. finalizar um atendimento;
7. consultar as estatísticas;
8. importar pacientes do arquivo JSON;
9. encerrar o sistema.

A organização da CLI segue esta separação:

```text
index.ts
   ↓
menu.ts
   ↓
ações da CLI
   ↓
services
   ↓
models e validators
```

O arquivo `index.ts` inicia a aplicação, enquanto `menu.ts` mantém o menu ativo e direciona a opção escolhida para uma ação específica.

O arquivo `terminal.ts` centraliza a leitura das respostas digitadas pelo usuário utilizando o módulo nativo:

```ts
node: readline / promises;
```

As ações localizadas em `src/cli/acoes/` coletam os dados e apresentam os resultados, mas não implementam diretamente as regras de negócio. Essas regras permanecem nos serviços.

Para uma explicação detalhada, consulte o [Guia da Interface de Linha de Comando](docs/menu-terminal.md).

````

## Documentação

Para conhecer a modelagem e as funcionalidades relacionadas aos sistema, consulte os guias abaixo:

- [Guia do Paciente](docs/paciente.md)
- [Guia de Erros da Aplicação](docs/erros-sistema.md)
- [Guia do Serviço de Triagem](docs/triagem.md)
- [Guia de Fila de Atendimento](docs/fila-atendimento.md)
- [Guia de Consultas e Estatísticas](docs/consultas-estatisticas.md)
- [Guia da API Simulada](docs/api-simulada.md)
- [Guia da Interface de Linha de Comando](docs/menu-terminal.md)


## Instruções de execução

### Pré-requisitos

- Node.js 22 ou superior;
- npm;
- Git.

A versão utilizada durante o desenvolvimento foi:

```text
Node.js v22.23.1
````

### Clonar o projeto

```bash
git clone [https://github.com/cristofersousa/utfpr-triagem-upa](https://github.com/cristofersousa/utfpr-triagem-upa)
cd sistema-triagem-upa
```

### Instalar as dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Verificar os tipos

```bash
npm run typecheck
```

### Compilar

```bash
npm run build
```

### Executar o código compilado

```bash
npm start
```

## Exemplos de uso

Execute:

```bash
npm run dev
```

O menu será apresentado:

```text
====================================
 Sistema de Triagem da UPA
 Versão: 1
====================================

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

### Cadastro

```text
Escolha uma opção: 1
Nome completo: Maria da Silva
Idade: 42
CPF: 123.456.789-00
Telefone: (47) 99999-9999
Sintomas separados por vírgula: febre, dor de cabeça
Nível da dor, de 0 a 10: 6
O paciente está inconsciente? (s/n): n
O paciente apresenta dificuldade para respirar? (s/n): n
O paciente apresenta sangramento intenso? (s/n): n
```

Resultado:

```text
Paciente cadastrado com sucesso!
ID: PAC-001
Nome: Maria da Silva
Prioridade: amarelo
Status: aguardando
```

### CPF duplicado

```text
[PAC-002] O CPF 123.456.789-00 já está vinculado ao paciente PAC-001.
```

### Fila

```text
1. Maria da Silva
   ID: PAC-001
   Prioridade: amarelo
   Tempo de espera: menos de 1 minuto
```

### Chamada

```text
ATENÇÃO: Maria da Silva
Dirija-se à sala de atendimento.
Status: em-atendimento
```

### Finalização

```text
Atendimento finalizado com sucesso!
Status: atendido
```

### Importação do JSON

```text
3 registro(s) localizado(s).
3 paciente(s) importado(s) com sucesso.
```

## Pendências

- [ ] Implementar testes automatizados com `node:test` — R07;
- [ ] Aplicar Pattern Matching com `ts-pattern` — RA03.


Caso exista, dúvidas!
Abra uma Issue neste repositório.

`Última atualização: 13 de agosto de 2026`


### Autor

<div align="center">
<img src="https://github.com/cristofersousa.png" width="150px" alt="Cristofer Sousa" style="border-radius: 50%;"/>

Cristofer Sousa <br>
<a href="https://www.linkedin.com/in/cristofersousa/">
https://www.linkedin.com/in/cristofersousa/
</a> <br>
🎓 [UTFPR - Universidade Tecnológica Federal do Paraná](https://www.utfpr.edu.br/cursos/especializacao/gp/especializacao-em-desenvolvimento-web)

Campus Guarapuava - PR | Engenharia de Software  



