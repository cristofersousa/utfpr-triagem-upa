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
- Validação de dados;
- Testes automatizados.

## Estrutura inicial

```text
src/
├── api/
├── cli/
├── config/
├── models/
├── services/
├── validators/
└── index.ts
tests/
```

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
