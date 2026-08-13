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
├── docs/
│   ├── paciente.md
│   └── erros-sistema.md
│   └── triagem.md
├── api/
├── cli/
├── config/
│   └── prioridades.ts
├── errors/
│   └── codigos-erro.ts
│   └── erro-aplicacao.ts
├── models/
│   └── paciente.ts
├── services/
│   └── paciente-service.ts
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
