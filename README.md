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

## Requisitos implementados

| Requisito | Implementação |
| --- | --- |
| R01 | Cadastro, consulta e atualização de pacientes |
| R02 | Organização em funções e módulos independentes |
| R03 | Classificação de risco e gerenciamento da fila |
| R04 | Consultas e estatísticas com métodos de arrays |
| R05 | Modelagem tipada das entidades |
| R06 | Carregamento assíncrono de dados em formato JSON |
| R07 | Pendente | Testes automatizados com Node.js Test Runner |
| RA01 | Validação de CPF e telefone com Regex |
| RA02 | Uso de `Omit`, `Pick`, `Partial`, `ReadonlyArray` e `Record` |
| RA03 | Pendente | Pattern Matching com `ts-pattern` |


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

| Diretório | Responsabilidade |
| --- | --- |
| `data/` | Armazena o arquivo JSON utilizado para simular dados externos |
| `docs/` | Contém a documentação detalhada dos módulos e das regras |
| `src/api/` | Lê, converte e valida dados externos |
| `src/cli/` | Implementa a interação do usuário pelo terminal |
| `src/config/` | Centraliza configurações e valores fixos do sistema |
| `src/errors/` | Define códigos e classes de erros da aplicação |
| `src/models/` | Define interfaces, Type Aliases e contratos de dados |
| `src/services/` | Implementa as regras de negócio |
| `src/validators/` | Valida os dados de entrada |
| `tests/` | Será utilizado pelos testes automatizados |

## Interface de linha de comando

A aplicação não possui interface gráfica. A interação acontece pelo terminal por meio de uma CLI (*Command-Line Interface*).

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
node:readline/promises
```

As ações localizadas em `src/cli/acoes/` coletam os dados e apresentam os resultados, mas não implementam diretamente as regras de negócio. Essas regras permanecem nos serviços.

Para uma explicação detalhada, consulte o [Guia da Interface de Linha de Comando](docs/menu-terminal.md).
```

## Documentação

Para conhecer a modelagem e as funcionalidades relacionadas aos sistema, consulte os guias abaixo:

- [Guia do Paciente](docs/paciente.md)
- [Guia de Erros da Aplicação](docs/erros-sistema.md)
- [Guia do Serviço de Triagem](docs/triagem.md)
- [Guia de Fila de Atendimento](docs/fila-atendimento.md)
- [Guia de Consultas e Estatísticas](docs/consultas-estatisticas.md)
- [Guia da API Simulada](docs/api-simulada.md)
- [Guia da Interface de Linha de Comando](docs/menu-terminal.md)

## Como executar

Instale as dependências:

```bash
npm install
```

Execute em modo de desenvolvimento:

```bash
npm run dev
```

Verifique a tipagem:

```bash
npm run typecheck
```

Compile e execute o projeto:

```bash
npm run build
npm start
```

## Pendências

- [ ] Implementar testes automatizados com `node:test` — R07;
- [ ] Aplicar Pattern Matching com `ts-pattern` — RA03.

## Autor

Cristofer Sousa
