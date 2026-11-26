# PRD — Eventoon

## 1. Objetivo do produto

O sistema permite o gerenciamento de eventos, lotes, vagas e inscrições, além do controle de presença dos participantes. O organizador utiliza o cliente web para administrar eventos, lotes, inscrições e acompanhar o comparecimento. A recepção utiliza o aplicativo mobile para ler o QR Code dos ingressos e registrar o check-in, enquanto o participante busca eventos, realiza sua inscrição e exibe o código do ingresso.

---

## 2. Personas

### Persona 1 — Ana, 35 anos, organizadora de eventos

- **Contexto:** Ana é responsável pela organização de eventos e precisa controlar eventos, lotes, vagas, inscrições e presença dos participantes.
- **Cliente principal:** web
- **Objetivo principal no sistema:** Gerenciar eventos, lotes e inscrições e acompanhar o comparecimento dos participantes.
- **Maior frustração atual (sem o sistema):** Precisar controlar informações de eventos, inscrições e presença por processos manuais ou informações espalhadas.
- **Critério de sucesso:** Conseguir administrar as informações do evento e acompanhar o comparecimento em um único sistema.

### Persona 2 — Carlos, 24 anos, recepcionista

- **Contexto:** Carlos atua na recepção de um evento e precisa atender vários participantes durante o período de entrada.
- **Cliente principal:** mobile
- **Objetivo principal no sistema:** Ler rapidamente o QR Code ou localizar a inscrição de um participante e registrar seu check-in.
- **Maior frustração atual (sem o sistema):** Demorar para localizar a inscrição ou registrar incorretamente a entrada de um participante.
- **Critério de sucesso:** Validar a inscrição pelo QR Code ou busca e registrar o check-in de forma rápida e correta.

### Persona 3 — Júlia, 22 anos, participante

- **Contexto:** Júlia busca eventos de seu interesse, realiza sua inscrição e utiliza seu celular para apresentar seu código durante o credenciamento.
- **Cliente principal:** mobile
- **Objetivo principal no sistema:** Buscar eventos, se inscrever e apresentar o código do seu ingresso.
- **Maior frustração atual (sem o sistema):** Ter dificuldade para localizar as informações necessárias para sua entrada no evento.
- **Critério de sucesso:** Acessar rapidamente sua inscrição e apresentar seu código no momento do credenciamento.

---

## 3. Requisitos funcionais

### 3.1 Autenticação e sessão

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-001 | O usuário entra no sistema informando e-mail e senha e recebe acesso às funcionalidades permitidas para seu perfil (no mobile, acesso simulado por escolha de perfil). | Alta | todas | web / mobile |
| RF-002 | O usuário encerra a sessão e deixa de ter acesso às funcionalidades protegidas. | Alta | todas | web / mobile |
| RF-003 | O usuário pode criar uma nova conta informando nome, e-mail e senha. | Média | organizador | web |

### 3.2 Gerenciamento de eventos e lotes

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-010 | O organizador pode cadastrar um evento informando nome, descrição, local e data. | Alta | organizador | web |
| RF-011 | O organizador pode consultar os eventos cadastrados e visualizar os dados de um evento. | Alta | organizador | web |
| RF-012 | O organizador pode atualizar os dados de um evento. | Média | organizador | web |
| RF-013 | O organizador pode cadastrar um lote vinculado a um evento, informando nome, quantidade de vagas e período de validade. | Alta | organizador | web |
| RF-014 | O organizador pode consultar os lotes vinculados a um evento. | Alta | organizador | web |
| RF-015 | O organizador pode atualizar os dados de um lote. | Média | organizador | web |

### 3.3 Inscrições e lista de espera

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-020 | O organizador pode cadastrar uma inscrição de participante vinculada a um evento e a um lote (e o participante pode se inscrever pelo app mobile). | Alta | organizador / participante | web / mobile |
| RF-021 | O sistema gera automaticamente um código único para cada inscrição. | Alta | organizador / participante | web / mobile |
| RF-022 | Quando não houver vaga disponível no lote, uma nova inscrição recebe o status `LISTA_ESPERA`. | Alta | organizador | web |
| RF-023 | O organizador pode consultar as inscrições de um evento e sua situação. | Alta | organizador | web |
| RF-024 | O participante pode buscar eventos, consultar sua própria inscrição e exibir o código do ingresso. | Alta | participante | mobile |

### 3.4 Credenciamento e check-in

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-030 | A recepção pode localizar uma inscrição pela leitura do QR Code do ingresso ou por busca (nome/código). | Alta | recepcionista | mobile |
| RF-031 | A recepção pode registrar o check-in de uma inscrição válida. | Alta | recepcionista | mobile |
| RF-032 | O sistema impede que uma mesma inscrição tenha mais de um check-in. | Alta | recepcionista | mobile |
| RF-033 | O sistema permite consultar a quantidade de participantes que realizaram check-in em um evento. | Alta | organizador / recepcionista | web / mobile |
| RF-034 | O organizador pode consultar informações de comparecimento do evento. | Média | organizador | web |

---

## 4. Requisitos não funcionais

| ID | Categoria | Descrição | Critério de aceitação |
|---|---|---|---|
| RNF-001 | Segurança — credenciais | Senhas são armazenadas com hash e nunca em texto puro. | Nenhuma senha legível é armazenada no banco de dados. |
| RNF-002 | Segurança — sessão | O acesso à API é feito por token JWT com validade definida. | Token expirado é recusado com `401`. |
| RNF-003 | Segurança — rotas | Toda rota protegida exige token válido e respeita o perfil do usuário. | Requisição sem token recebe `401` e perfil sem permissão recebe `403`. |
| RNF-004 | Segurança — segredos | Chaves e credenciais ficam em variáveis de ambiente. | Nenhuma credencial real é versionada no repositório. |
| RNF-005 | Desempenho | A busca de inscrições e o registro de check-in devem responder rapidamente durante o credenciamento. | As operações principais apresentam resposta adequada ao uso durante o fluxo de entrada do evento. |
| RNF-006 | Usabilidade | As operações principais devem ser simples e apresentar mensagens claras de sucesso e erro. | A recepção consegue ler o QR Code e registrar o check-in com poucos passos. |
| RNF-007 | Manutenibilidade | As regras de negócio ficam no backend e o acesso aos dados é realizado pelo Prisma. | Os clientes não acessam diretamente o PostgreSQL e as regras de negócio não são duplicadas nos clientes. |
| RNF-008 | Comportamento em rede instável (mobile) | O aplicativo informa falhas de comunicação e não considera um check-in concluído sem confirmação. | Em caso de falha de rede, o aplicativo informa o erro e permite nova tentativa sem criar check-ins duplicados. |
| RNF-009 | Consistência | Os dados apresentados pelos clientes correspondem aos dados armazenados pela API. | Eventos e inscrições criados no web e operações realizadas no mobile refletem o mesmo estado no backend. |

---

## 5. Regras de negócio

| ID | Regra | Validação antecipada no cliente? |
|---|---|---|
| RN-001 | Cada lote pertence a um único evento e possui uma quantidade definida de vagas. | sim |
| RN-002 | A quantidade de inscrições ativas de um lote não pode ultrapassar a quantidade de vagas disponível. | sim |
| RN-003 | Quando não houver vaga disponível no lote, uma nova inscrição recebe o status `LISTA_ESPERA`. | sim |
| RN-004 | Cada inscrição recebe um código único gerado pelo servidor. | não |
| RN-005 | Uma inscrição com status `LISTA_ESPERA` ou `CANCELADA` não pode realizar check-in. | sim |
| RN-006 | Uma inscrição pode possuir no máximo um check-in. | não |
| RN-007 | O check-in só pode ser registrado para uma inscrição existente e válida para entrada. | sim |
| RN-008 | Repetir o check-in da mesma inscrição não cria um segundo registro nem altera novamente a quantidade de participantes presentes. | não |
| RN-009 | A quantidade de participantes presentes é calculada a partir das inscrições que possuem check-in registrado. | não |
| RN-010 | O código da inscrição é gerado pelo servidor e não pode ser definido pelo cliente. | não |
| RN-011 | Um evento com lotes ou inscrições vinculados não pode ser excluído (retorna `409 Conflict`). | não |

### Autorização — quem pode o quê

| ID | Regra de autorização | Perfil |
|---|---|---|
| RN-A01 | Pode cadastrar, consultar, editar e excluir seus próprios eventos e gerenciar seus lotes. | ORGANIZADOR |
| RN-A02 | Pode cadastrar participantes/recepcionistas, gerenciar inscrições e consultar comparecimento dos eventos que administra. | ORGANIZADOR |
| RN-A03 | Pode buscar inscrições, registrar check-ins e consultar a contagem de presença. | RECEPCIONISTA |
| RN-A04 | Pode consultar eventos disponíveis e visualizar sua própria inscrição e código do ingresso. | PARTICIPANTE |
| RN-A05 | Não pode alterar eventos, lotes ou inscrições administrativas. | PARTICIPANTE |
| RN-A06 | Não pode acessar funcionalidades administrativas de organizador. | RECEPCIONISTA / PARTICIPANTE |

---

## 6. Modelo de dados

### 6.1 Diagrama ER

```mermaid
erDiagram

    USUARIO {
        int id PK
        string nome
        string email UK
        string senhaHash
        TipoUsuario tipo
        datetime criadoEm
    }

    EVENTO {
        int id PK
        string nome
        string descricao
        string local
        datetime data
        int organizadorId FK
        datetime criadoEm
    }

    LOTE {
        int id PK
        string nome
        int quantidade
        datetime inicio
        datetime fim
        int eventoId FK
    }

    INSCRICAO {
        int id PK
        string codigo UK
        StatusInscricao status
        datetime criadoEm
        int participanteId FK
        int eventoId FK
        int loteId FK
    }

    CHECKIN {
        int id PK
        datetime realizadoEm
        int inscricaoId FK UK
        int recepcionistaId FK
    }

    USUARIO ||--o{ EVENTO : organiza
    EVENTO ||--o{ LOTE : possui
    EVENTO ||--o{ INSCRICAO : recebe
    LOTE ||--o{ INSCRICAO : possui
    USUARIO ||--o{ INSCRICAO : participa
    INSCRICAO ||--o| CHECKIN : possui
    USUARIO ||--o{ CHECKIN : registra
```

### 6.2 Descrição das entidades

| Entidade | Responsabilidade | Principais atributos |
|---|---|---|
| **Usuario** | Representa os usuários do sistema e seus perfis de acesso (`ORGANIZADOR`, `RECEPCIONISTA`, `PARTICIPANTE`). | `id`, `nome`, `email`, `senhaHash`, `tipo`, `criadoEm` |
| **Evento** | Representa um evento administrado por um organizador. | `id`, `nome`, `descricao`, `local`, `data`, `organizadorId`, `criadoEm` |
| **Lote** | Representa uma divisão das vagas disponíveis de um evento. | `id`, `nome`, `quantidade`, `inicio`, `fim`, `eventoId` |
| **Inscricao** | Representa a inscrição de um participante em um evento e em um lote (`ATIVA`, `CANCELADA`, `LISTA_ESPERA`). | `id`, `codigo`, `status`, `criadoEm`, `participanteId`, `eventoId`, `loteId` |
| **CheckIn** | Representa o registro da entrada de um participante no evento. | `id`, `realizadoEm`, `inscricaoId`, `recepcionistaId` |

A lista de espera é representada pelo campo `status` da entidade `Inscricao`, utilizando o valor `LISTA_ESPERA`, não sendo necessária uma entidade separada no MVP.

---

## 7. Recorte web/mobile

| Funcionalidade | Web | Mobile | Justificativa |
|---|---|---|---|
| Login e cadastro de conta | ✅ | ✅ (login simulado) | O organizador autentica-se com JWT no web; no mobile, o acesso utiliza login simulado (escolha entre participante e recepcionista), conforme orientação da disciplina. |
| Visualização de eventos | ✅ | ✅ | Organizadores gerenciam seus eventos no web; participantes buscam eventos no mobile. |
| Cadastro e edição de eventos | ✅ | — | Atividades administrativas mais adequadas à tela grande. |
| Gerenciamento de lotes e vagas | ✅ | — | Parte da configuração administrativa do evento. |
| Gerenciamento de inscrições e lista de espera | ✅ | — | O organizador administra inscrições e vagas pelo painel web. |
| Inscrição e exibição do código do ingresso | — | ✅ | O participante busca o evento, se inscreve e apresenta o código/QR Code no celular. |
| Leitura de QR Code e registro de check-in | — | ✅ | Operação presencial na entrada do evento usando a câmera do celular. |
| Contagem de participantes presentes | ✅ | ✅ | Organizador acompanha o comparecimento no web e recepção acompanha durante o credenciamento. |

**O que ficou de fora do mobile e por quê:**
O gerenciamento de eventos, lotes, vagas, lista de espera e cadastros administrativos ficou fora do mobile por pertencer ao contexto administrativo do organizador.

**O que ficou de fora do web e por quê:**
A leitura de QR Code e o registro presencial de check-in ficaram fora do web por exigirem mobilidade e câmera na entrada do evento.

**Recorte mobile entregue:**
- Login simulado com seleção de perfil (Participante ou Recepcionista).
- Fluxo Participante: buscar eventos, realizar inscrição e exibir o código do ingresso.
- Fluxo Recepcionista: ler o código QR do ingresso para validação/check-in.

---

## 8. Arquitetura da solução

### 8.1 Visão geral dos componentes

```mermaid
flowchart TD
  W["Cliente web — Next.js 15 (App Router)<br/>Server e Client Components"]
  M["App mobile — Flutter 3.5<br/>Screens, Widgets e camada de serviço"]
  A["API REST — NestJS 12<br/>Controller · Service · Prisma"]
  D["PostgreSQL 18"]

  W -->|HTTP / JSON| A
  M -->|HTTP / JSON| A
  A --> D
```

### 8.2 Estrutura dos três projetos

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| Backend | nenhum | Utiliza a estrutura modular padrão do NestJS prevista no projeto. |
| Cliente web | nenhum | Utiliza Next.js com App Router conforme definido no projeto. |
| App mobile | nenhum | Utiliza a estrutura prevista para o aplicativo Flutter. |

### 8.3 Módulos e recursos do backend

| Módulo | Recurso do domínio | Endpoints implementados |
|---|---|---|
| `AuthModule` | Autenticação | `POST /auth/registro`, `POST /auth/login`, `GET /auth/perfil` |
| `UsuariosModule` | Usuários | `POST /usuarios/participantes`, `GET /usuarios/participantes`, `POST /usuarios/recepcionistas`, `GET /usuarios`, `GET /usuarios/:id`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id` |
| `EventosModule` | Eventos | `POST /eventos`, `GET /eventos/meus`, `GET /eventos/meus/:id`, `GET /eventos`, `GET /eventos/:id`, `PATCH /eventos/:id`, `DELETE /eventos/:id` |
| `LotesModule` | Lotes | `POST /eventos/:eventoId/lotes`, `GET /eventos/:eventoId/lotes`, `PATCH /lotes/:id` |
| `InscricoesModule` | Inscrições | `GET /inscricoes/minhas`, `POST /inscricoes`, `GET /inscricoes`, `GET /inscricoes/:id` |
| `CheckinsModule` | Check-in e comparecimento | `POST /inscricoes/:id/checkin`, `GET /eventos/:eventoId/contagem` |

### 8.4 Decisões técnicas por componente

| Componente | Decisão a tomar | Escolha do grupo | Justificativa |
|---|---|---|---|
| Backend | Estratégia de autenticação | JWT simples (validade de 1 hora) | Atende à proteção das rotas e perfis sem adicionar complexidade de refresh token ao MVP. |
| Backend | Formato de identificador | Inteiro autoincremental | Simplifica os relacionamentos e rotas REST no modelo de dados. |
| Web | Fronteira Server / Client Components | Server Components para consultas e Client Components para formulários e interações | Mantém o token em cookie HttpOnly no lado do servidor e isola interatividade apenas onde necessário. |
| Web | Estratégia de revalidação e cache | Revalidação após operações de alteração | Garante exibição de dados atualizados após cadastros, edições e exclusões. |
| Mobile | Gerência de estado | `setState` | O recorte mobile possui fluxos diretos e bem delimitados, sem necessidade de gerenciador externo complexo. |
| Mobile | Nível de autenticação | Simulada (login falso) | Conforme orientação do professor, dispensou-se autenticação real no mobile para priorizar os fluxos de participante e leitura de QR Code pela recepção. |

### 8.5 Tecnologias e versões

| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | 24 (24.22.0) | Runtime do backend |
| NestJS | 12 (`^12.0.1`) | Framework da API |
| Prisma | 7 (`^7.10.0` com `@prisma/adapter-pg`) | ORM e migrations |
| PostgreSQL | 18 | Banco de dados |
| React | 19 | Biblioteca de interface |
| Next.js | 15 (App Router) | Framework do cliente web |
| Flutter / Dart | 3.5 | Framework do app mobile |
| Docker | Docker Desktop | Execução local do PostgreSQL |

---

## 9. Planejamento de sprints

| Sprint | Etapa | Tema | Requisitos previstos | Responsáveis | Entregáveis |
|---|---|---|---|---|---|
| 1 | Etapa 1 | Contrato e fundação | Definição dos requisitos, modelo de dados e contrato da API | Maria e João | PRD, contrato inicial e backend rodando |
| 2 | Etapa 2 | Backend — auth, eventos e lotes | RF-001 a RF-015 | Maria | Autenticação JWT e módulos de eventos e lotes |
| 3 | Etapa 2 / 3 | Backend — usuários, inscrições e check-in | RF-020 a RF-034 | Maria | Endpoints completos do MVP respondendo na API |
| 4 | Etapa 3 | Cliente web | RF-001 a RF-023 aplicáveis ao web | João (com apoio de Maria) | Fluxo de login/cadastro, eventos e gestão de inscrições no navegador |
| 5 | Etapa 4 | App mobile | RF-024, RF-030 e RF-031 | Maria e João | App Flutter com login simulado, fluxo participante (eventos/inscrição/ingresso) e recepcionista (leitor QR Code) |
| 6 | Etapa 5 | Integração e fechamento | Requisitos de prioridade Alta | Maria e João | Integração final, revisão da documentação, ajustes finais e entrega |

---

## 10. Critérios de aceite (MVP)

- [x] O organizador consegue cadastrar um evento e consultar seus dados.
- [x] O organizador consegue atualizar os dados de um evento.
- [x] O organizador consegue cadastrar um lote vinculado a um evento e definir sua quantidade de vagas.
- [x] O organizador consegue consultar e atualizar os lotes de um evento.
- [x] O sistema consegue registrar uma inscrição vinculada a um evento e a um lote.
- [x] Cada inscrição recebe um código único gerado pelo servidor.
- [x] Quando não houver vaga disponível no lote, uma nova inscrição recebe o status `LISTA_ESPERA`.
- [x] O organizador consegue consultar as inscrições de um evento e sua situação.
- [x] A recepção consegue ler o QR Code / localizar uma inscrição e registrar o check-in.
- [x] Uma inscrição com status `LISTA_ESPERA` ou `CANCELADA` não consegue realizar check-in.
- [x] Repetir o check-in da mesma inscrição não cria um segundo registro nem aumenta novamente a quantidade de participantes presentes.
- [x] A quantidade de participantes presentes é calculada a partir dos registros de check-in.
- [x] O participante consegue buscar eventos, se inscrever e visualizar o código do seu ingresso pelo aplicativo mobile.
- [x] Um evento criado pelo cliente web pode ser consultado por meio da API utilizada pelo aplicativo mobile.
- [x] A API valida o token JWT e o perfil nas rotas protegidas, recusando requisições sem permissão (`401`/`403`). *(No app mobile, adotou-se login simulado por perfil conforme orientação da disciplina.)*

---

## 11. Fora do escopo (explícito)

- Processamento de pagamentos, venda de ingressos, emissão de notas fiscais e integração com sistemas financeiros.
- Divulgação, marketing, transmissão do evento, notificações externas e funcionalidades fora de inscrições, credenciamento e controle de presença.
- Integração com catracas ou leitores físicos externos de QR Code.
- Recuperação de senha por e-mail e refresh token no MVP.
- Gerenciamento administrativo completo de eventos e lotes pelo aplicativo mobile.
- Autenticação JWT completa no aplicativo mobile (substituída por login simulado conforme orientação docente).

---

## 12. Histórico de revisões

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 24/09/2026 | Versão inicial do PRD. |
| 1.1 | 25/11/2026 | Atualização final com todos os endpoints implementados, versões reais da stack (NestJS 12, Node 24, Flutter 3.5), recorte mobile final e checklist de aceite. |