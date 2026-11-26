# Equipe — composição e registro de contribuições

## 1. Identificação

| Campo | Valor |
|---|---|
| **Projeto** | Eventoon |
| **Grupo** | A |
| **Tema escolhido** | Sistema de credenciamento e check-in de eventos |
| **Repositório** | `https://github.com/schellx/web-mob-trabalho.git` |
| **Data de formação** | 03/09/2026 |

---

## 2. Integrantes e papéis

**Grupo de 2** — divisão entre backend, cliente web e desenvolvimento conjunto do app mobile:

| Integrante | Usuário GitHub | Responsabilidade principal | Parte compartilhada / secundária |
|---|---|---|---|
| Maria Eduarda Schell | `schellx` | Backend (NestJS + Prisma) | App mobile (Flutter) e apoio na integração web |
| João Vitor Dalla Lana | `Jao22x` | Cliente web (Next.js) | App mobile (Flutter), ambiente Docker/PostgreSQL e ajustes de integração |

---

## 3. Combinados do grupo

| Tema | Combinado |
|---|---|
| Frequência de reuniões | Alinhamentos semanais e conversas rápidas durante o desenvolvimento de cada checkpoint. |
| Canal de comunicação | Mensagens diretas (WhatsApp/Discord) e reuniões presenciais/online. |
| Prazo interno antes do prazo oficial do checkpoint | 1 a 2 dias antes da entrega oficial para testes integrados e atualização da documentação. |
| Como a revisão de código acontece | Revisão conjunta durante a integração entre frontend, backend e mobile antes de consolidar na branch principal. |
| Como avisar mudança no contrato da API | Comunicar imediatamente no canal do grupo. |
| O que fazer quando alguém trava por mais de um dia | Compartilhar o erro/tela com o outro integrante para depuração em par antes de acumular atraso. |

---

## 4. Registro por etapa

### Etapa 0 — Concepção

**Período:** de 03/09/2026 a 24/09/2026

| Integrante | O que fez | Commits / PRs de referência |
|---|---|---|
| Maria Eduarda Schell | Definição do tema, personas, requisitos funcionais, modelo ER inicial e redação do documento de visão e PRD. | Commits iniciais de documentação (`docs/visao.md`, `docs/prd.md`) |
| João Vitor Dalla Lana | Definição de escopo web/mobile, regras de negócio, critérios de aceite e revisão dos documentos iniciais. | Commits iniciais de documentação (`docs/visao.md`, `docs/prd.md`) |

**Dificuldades de coordenação:** Definir o recorte ideal entre web e mobile para que o escopo fosse viável para uma dupla.

**Ajustes combinados para a próxima etapa:** Priorizar o contrato da API e a modelagem no Prisma antes de iniciar as telas.

---

### Etapa 1 — Contrato e fundação

**Período:** de 24/09/2026 a 30/09/2026

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Maria Eduarda Schell | Estruturação inicial do backend NestJS, schema Prisma e versão inicial do contrato da API. | Backend, Docs | Criação inicial do backend e `docs/contrato-api.md` |
| João Vitor Dalla Lana | Configuração do PostgreSQL 18 via Docker Compose, validação do ambiente local e estrutura inicial do Next.js. | Infra/Banco, Web | Setup Docker e estrutura inicial do frontend |

**Dificuldades de coordenação:** Ajustes de ambiente local (Node.js/npm no PATH e configuração do `.env` com `JWT_SECRET`).

**Ajustes combinados para a próxima etapa:** Padronizar as variáveis de ambiente locais e testar o banco antes de cada sessão de desenvolvimento.

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** de 01/10/2026 a 15/10/2026

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Maria Eduarda Schell | Implementação da autenticação JWT, hash de senha, guards de perfil (`JwtAuthGuard`, `RolesGuard`), CRUD de eventos e regras de exclusão. | Backend | `c8cc42a` (JWT e hash), `1955a4c` (auth e eventos) |
| João Vitor Dalla Lana | Testes manuais das rotas com requisições HTTP, validação do banco PostgreSQL e início da prototipação da listagem web. | Backend (testes), Web | `35cf072` (primeira página com eventos de teste) |

**Dificuldades de coordenação:** Garantir que o `organizadorId` viesse do token autenticado em vez de ser enviado pelo formulário do cliente.

**Ajustes combinados para a próxima etapa:** Centralizar a validação de dono do evento no backend e integrar as telas web reais.

---

### Etapa 3 — Cliente web · Checkpoint 2

**Período:** de 15/10/2026 a 25/10/2026

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| João Vitor Dalla Lana | Desenvolvimento das telas web em Next.js (login/cadastro, listagem/visita de eventos, cadastro, edição de eventos e gerenciamento de inscrições) e melhorias visuais. | Web | `a4c64bf`, `cedb8ab` |
| Maria Eduarda Schell | Integração do cookie `HttpOnly` no Next.js com a API, conclusão dos módulos de `usuarios`, `lotes`, `inscricoes` e `checkins` no backend e atualização do contrato e relatório. | Backend, Web, Docs | `1955a4c`, atualização de `docs/contrato-api.md` e `docs/relatorio.md` |

**Dificuldades de coordenação:** Regenerar o Prisma Client após mudanças no schema e sincronizar os campos retornados entre API e telas web.

**Ajustes combinados para a próxima etapa:** Iniciar o aplicativo Flutter em conjunto, adotando login simulado conforme orientação do professor.

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de 26/10/2026 a 20/11/2026

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Maria Eduarda Schell | Desenvolvimento em conjunto no Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0): estrutura das telas, fluxo de login simulado (participante/recepcionista) e integração com endpoints de eventos. | Mobile, Backend | Commits do app Flutter |
| João Vitor Dalla Lana | Desenvolvimento em conjunto no Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0): fluxo do participante (consulta de eventos e ingressos existentes, código textual) e fluxo do recepcionista (seleção de evento, busca por nome/código, check-in e contagem). | Mobile | Commits do app Flutter |

**Dificuldades de coordenação:** Configuração do Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0) e da comunicação de rede entre emulador/dispositivo e o backend local.

**Ajustes combinados para a próxima etapa:** Realizar ajustes finais de integração entre os três componentes e fechar a documentação completa.

---

### Etapa 5 — Integração e fechamento

**Período:** de 21/11/2026 a 25/11/2026

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Maria Eduarda Schell | Ajustes finais nos endpoints do backend, integração web/mobile e revisão final da documentação técnica. O ZIP contém testes unitários de serviços de inscrições e check-in. | Backend, Mobile, Docs | Commits finais de fechamento |
| João Vitor Dalla Lana | Ajustes finais nas telas web e mobile, validação dos fluxos de entrega e revisão final da documentação. O ZIP contém testes de widget da navegação mobile. | Web, Mobile, Docs | Commits finais de fechamento |

**Dificuldades de coordenação:** Conciliar os últimos ajustes de interface com a finalização da documentação no prazo da entrega.

---

## 5. Cobertura por componente

| Integrante | Backend | Web | Mobile | Cumpre a regra dos dois componentes? |
|---|---|---|---|---|
| Maria Eduarda Schell | Principal (maior volume de commits) | Apoio na integração de autenticação e contrato | Desenvolvimento conjunto (Flutter) | Sim |
| João Vitor Dalla Lana | Apoio em ambiente/banco e testes de rotas | Principal (maior volume de commits) | Desenvolvimento conjunto (Flutter) | Sim |

---

## 6. Ocorrências

| Data | Ocorrência | Encaminhamento | Professor comunicado? |
|---|---|---|---|
| Etapa 4 | Dispensa da autenticação JWT real no app mobile para foco nos fluxos de credenciamento. | Adotado login simulado (seleção de perfil participante/recepcionista) no Flutter, mantendo JWT nas rotas protegidas e no web e usando endpoints de demonstração condicionados a variáveis de ambiente no mobile. | Sim (orientação do próprio professor) |

---

## 7. Autoavaliação do grupo

**O que funcionou na divisão de trabalho:**
Ter uma divisão clara de liderança — Maria focada no backend e João no frontend web — evitou conflitos de código nas etapas iniciais, enquanto o desenvolvimento conjunto no Flutter permitiu que os dois acelerassem a entrega.

**O que não funcionou:**
Em alguns momentos o contrato da API ficou defasado em relação aos novos módulos criados no backend, exigindo conferência direta nos controllers durante a integração.

**Se recomeçassem, o que dividiriam de outro jeito:**
Manteriam a mesma divisão entre backend e web, mas reservariam um momento fixo ao final de cada semana para atualizar o contrato da API e os registros do relatório técnico continuamente.

## 8. Nota de conferência da entrega — 26/11/2026

O participante consulta eventos e seus ingressos já cadastrados (código textual e QR meramente ilustrativo); o recepcionista seleciona o evento, busca inscrições por nome ou código, registra check-in e consulta contagem de presença. A inscrição é criada pelo organizador no web; geração/leitura real de QR Code e autoinscrição mobile não foram implementadas. Os registros históricos, datas e atribuições acima foram preservados dos novos documentos fornecidos pelo grupo. O ZIP não contém histórico `.git`, portanto não permite conferir a autoria de cada commit, a data real de redação de cada etapa ou a autoria individual dos testes. Os testes existentes estão descritos no relatório técnico; não se atribui autoria específica sem evidência.
