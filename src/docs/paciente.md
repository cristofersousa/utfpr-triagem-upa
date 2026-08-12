# Guia do Módulo Paciente
---

### Status por Prioridade

```text
  | "vermelho"
  | "laranja"
  | "amarelo"
  | "verde"
  | "azul";

```

### Status por Atendimento

```text
  | "aguardando"
  | "em-atendimento"
  | "atendido"
  | "cancelado";
```

### Paciente

```text
| Propriedade   | Tipo                | Finalidade                       |
| ------------- | ------------------- | -------------------------------- |
| `id`          | `string`            | Identificação única do paciente  |
| `nome`        | `string`            | Nome completo                    |
| `idade`       | `number`            | Idade do paciente                |
| `cpf`         | `string`            | Documento usado na identificação |
| `telefone`    | `string` opcional   | Forma de contato                 |
| `sintomas`    | `string[]`          | Lista de sintomas relatados      |
| `dataChegada` | `Date`              | Momento da entrada na UPA        |
| `prioridade`  | `Prioridade`        | Classificação de risco           |
| `status`      | `StatusAtendimento` | Situação atual                   |
```

