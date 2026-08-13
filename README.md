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
| RA01 | Validação de CPF e telefone com Regex |
| RA02 | Uso de `Omit`, `Pick`, `Partial`, `ReadonlyArray` e `Record` |

## Estrutura inicial

```text
src/
├── data/
│   └── pacientes.json
├── docs/
│   ├── paciente.md
│   └── erros-sistema.md
│   └── triagem.md
├── api/
│   └── paciente-api.md <!-- lê, converte e valida o arquivo JSON; -->
├── cli/
├── config/
│   └── prioridades.ts
├── errors/
│   └── codigos-erro.ts
│   └── erro-aplicacao.ts
├── models/
│   └── paciente.ts
│   └── estatistica.ts
│   └── paciente-api.ts <!-- define o formato dos dados externos -->
├── services/
│   └── paciente-service.ts <!-- transforma os dados externos em pacientes do sistema -->
│   └── fila-service.ts
│   └── triagem-service.ts
│   └── estatistica-service.ts
│   └── consulta-service.ts
├── validators/
│   └── paciente-validator.ts
└── index.ts
tests/
```

## Documentação

Para conhecer a modelagem e as funcionalidades relacionadas aos sistema, consulte os guias abaixo:

- [Guia do Paciente](docs/paciente.md)
- [Guia de Erros da Aplicação](docs/erros-sistema.md)
- [Guia do Serviço de Triagem](docs/triagem.md)
- [Guia de Fila de Atendimento](docs/fila-atendimento.md)
- [Guia de Consultas e Estatísticas](docs/consultas-estatisticas.md)
- [Guia da API Simulada](docs/api-simulada.md)

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

## Autor

Cristofer Sousa
