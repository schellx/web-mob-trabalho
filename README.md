# Projeto integrador — Programação Web e Mobile

## EvenToon — Credenciamento e check-in de eventos

Projeto final da disciplina de Programação Web e Mobile: **um serviço e dois clientes**. Uma API REST concentra as regras de negócio e os dados; um cliente web e um aplicativo mobile consomem a mesma API.

O EvenToon permite gerenciar eventos, lotes, vagas e inscrições, gerar códigos únicos de ingresso, manter inscrições em lista de espera e acompanhar o credenciamento e a presença dos participantes. O sistema não contempla pagamentos ou venda de ingressos.

**Integrantes:** Maria Eduarda Schell e João Vitor Dalla Lana.

> O enunciado completo do trabalho — etapas, prazos e critérios de avaliação — está na página da disciplina. Este README descreve a estrutura implementada e os passos para executar o projeto.

---

## Estrutura

```text
/
├── README.md
├── docker-compose.yml        # PostgreSQL 18 local
├── .gitignore
├── docs/
│   ├── visao.md              # Documento de Visão (Etapa 0)
│   ├── prd.md                # Requisitos do produto (Etapa 1)
│   ├── contrato-api.md       # Contrato REST da API
│   ├── equipe.md             # Composição e contribuições
│   ├── relatorio.md          # Diário técnico
│   └── rfc-001.md            # Mudança de requisito, se aplicável
├── backend/                  # API REST — NestJS e Prisma
├── frontend/                 # Cliente web — Next.js
├── mobile/                   # Aplicativo — Flutter
└── web/                      # Arquivos estáticos do Flutter Web
```

Os três componentes estão no mesmo repositório. O cliente web Next.js está em `frontend/`, e não em `web/`. A pasta `web/` da raiz contém arquivos de suporte do Flutter Web; a estrutura web utilizada pelo aplicativo Flutter está em `mobile/web/`. A pasta `web/` da raiz não é um projeto executável independente.

## Tecnologias

| Componente | Tecnologias |
|---|---|
| Backend | Node.js, TypeScript, NestJS 12, Prisma 7, PostgreSQL 18 |
| Autenticação | JWT, Passport, controle de perfis e hash de senha com scrypt |
| Cliente web | Next.js 16 (App Router), React 19, TypeScript, CSS Modules e Server Actions |
| Mobile | Flutter, Dart e pacote `http` |
| Banco local | Docker Compose |
| Testes e qualidade | Vitest e Oxlint (backend), ESLint (frontend), Flutter Test (mobile) |

As versões exatas das dependências estão nos arquivos `package.json`, `package-lock.json`, `pubspec.yaml` e `pubspec.lock` dos respectivos componentes.

## Funcionalidades implementadas

| Perfil | Cliente | Funcionalidades |
|---|---|---|
| Organizador | Web | Cadastro de conta, login e logout; listagem, criação, edição, consulta e exclusão de seus eventos; gerenciamento de lotes; cadastro de participantes e recepcionistas; criação e consulta de inscrições; relatório de presença. |
| Recepcionista | Mobile (demonstração) | Seleção de evento, consulta de participantes, busca por nome ou código, registro de check-in e contagem de inscritos e presentes. |
| Participante | Mobile (demonstração) | Consulta de eventos e detalhes, visualização dos próprios ingressos, códigos de inscrição e situação do ingresso. |

O backend valida o período e a capacidade dos lotes, gera o código de inscrição, coloca novas inscrições em lista de espera quando não há vagas e impede a duplicação de check-ins. O check-in é permitido somente para inscrições ativas.

O cliente web utiliza autenticação JWT. O acesso mobile é demonstrativo: os dados digitados no login não são validados e o aplicativo utiliza rotas específicas de desenvolvimento. A tela de leitura de QR Code é apenas ilustrativa, sem integração com a câmera. A inscrição é criada pelo organizador no web; o mobile ainda não realiza novas inscrições. Não há operação de cancelamento de inscrição ou promoção automática da lista de espera implementada.

---

## Preparando o ambiente

Antes de executar o projeto, tenha instalado:

- Git;
- Node.js 24 LTS e npm (o Prisma 7 também admite Node.js 20.19+ ou 22.12+, dentro das respectivas linhas suportadas);
- Docker Desktop ou outra instalação acessível do PostgreSQL 18;
- Flutter SDK com Dart compatível com `^3.14.0`, conforme `mobile/pubspec.yaml`;
- Android Studio e um emulador Android para executar o aplicativo nativo, ou Chrome para executar o Flutter Web. Para iOS, são necessários macOS e Xcode, além do ajuste de endereço da API descrito adiante.

Clone o repositório do grupo (caso ainda não tenha uma cópia):

```bash
git clone https://github.com/schellx/web-mob-trabalho.git
cd web-mob-trabalho
```

As pastas dos três projetos já existem. Não é necessário executar `nest new`, `create-next-app`, `flutter create` ou `prisma init` novamente.

---

## Passo a passo — banco de dados

O projeto utiliza **PostgreSQL 18**. O grupo adotou Docker Compose, mas o Docker é opcional se já houver um banco acessível.

A URL padrão do ambiente local é:

```text
postgresql://app:app@localhost:5432/appdb?schema=public
```

Se forem utilizados outros dados de conexão, ajuste `DATABASE_URL` no backend.

### Opção A — Docker Compose (utilizada pelo grupo)

O `docker-compose.yml` na raiz está configurado com banco `appdb`, usuário `app` e senha `app`.

Na raiz do repositório:

```bash
docker compose up -d          # sobe o banco na porta 5432
docker compose ps             # confere se o banco está de pé
docker compose logs -f db     # acompanha os logs, se necessário
```

Para parar o banco ao terminar:

```bash
docker compose down           # os dados ficam no volume
```

### Opção B — PostgreSQL instalado na máquina

Com o PostgreSQL 18 instalado, crie o usuário e o banco pelo `psql` ou pgAdmin:

```sql
CREATE USER app WITH PASSWORD 'app';
CREATE DATABASE appdb OWNER app;
```

Confira a conexão:

```bash
psql "postgresql://app:app@localhost:5432/appdb" -c "SELECT version();"
```

Se a porta 5432 estiver ocupada, utilize outra porta e ajuste a conexão do backend. Não é necessário apagar o `docker-compose.yml` para utilizar esta opção.

### Opção C — serviço gerenciado na nuvem

Também é possível utilizar PostgreSQL 18 hospedado. Nesse caso, configure a URL de conexão no `.env` do backend e não versione as credenciais.

---

## Passo a passo — backend (NestJS + Prisma)

### 1. Instalar as dependências

Na raiz do repositório:

```bash
cd backend
npm ci
```

### 2. Configurar as variáveis de ambiente

Crie `backend/.env` a partir de `backend/.env.example`.

```env
DATABASE_URL="postgresql://app:app@localhost:5432/appdb?schema=public"
JWT_SECRET="troque-por-uma-chave-secreta-local"
NODE_ENV=development
MOBILE_DEMO=false
```

Substitua o valor de `JWT_SECRET` por uma chave secreta local. O arquivo `.env` não deve ser versionado.

Para testar também os fluxos demonstrativos do aplicativo mobile, altere `MOBILE_DEMO` para `true` e mantenha `NODE_ENV=development`. Reinicie o backend após mudar essas variáveis. O modo demonstrativo não deve ser utilizado em produção.

A API utiliza a porta 3000 por padrão; é possível alterá-la com a variável opcional `PORT` (nesse caso, ajuste também os clientes).

### 3. Aplicar as migrations e gerar o Prisma Client

Com o banco em execução, dentro de `backend/`:

```bash
npx prisma migrate deploy
npx prisma generate
```

As migrations já estão versionadas em `backend/prisma/migrations/`. O comando `migrate deploy` aplica as migrations existentes sem criar outra migration. Para desenvolver novas alterações no schema, utilize `npx prisma migrate dev --name <nome>`.

O Prisma 7 utiliza o gerador `prisma-client`, com saída em `backend/generated/prisma/`. A conexão PostgreSQL é configurada em `prisma.config.ts` e utiliza o adaptador `@prisma/adapter-pg` no `PrismaService`.

### 4. Subir e conferir

```bash
npm run start:dev
```

A API fica disponível em `http://localhost:3000`. A rota `GET /` retorna `Hello World!` e `GET /eventos` permite consultar os eventos públicos cadastrados.

### Estrutura do backend

```text
backend/
├── .env.example
├── package.json
├── package-lock.json
├── prisma.config.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── generated/prisma/         # gerado localmente pelo Prisma
├── src/
│   ├── main.ts               # inicialização, CORS e validação global
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── auth/                 # login, registro, JWT e guards de perfil
│   ├── usuarios/             # usuários, participantes e recepcionistas
│   ├── eventos/              # gerenciamento de eventos
│   ├── lotes/                # gerenciamento de lotes
│   ├── inscricoes/           # vagas, códigos e lista de espera
│   ├── checkins/             # registro de presença e contagem
│   └── prisma/               # serviço de acesso ao banco
├── test/                     # testes e2e
├── vitest.config.ts
└── vitest.config.e2e.ts
```

Os modelos do banco são `Usuario`, `Evento`, `Lote`, `Inscricao` e `CheckIn`. Os perfis de usuário são `ORGANIZADOR`, `RECEPCIONISTA` e `PARTICIPANTE`. Os status de inscrição são `ATIVA`, `CANCELADA` e `LISTA_ESPERA` (a existência do status `CANCELADA` no modelo não significa que haja uma operação de cancelamento disponível).

### Comandos do dia a dia

| Comando | Para quê |
|---|---|
| `npm run start:dev` | Sobe a API com recarga automática |
| `npm run build` | Compila o backend |
| `npx prisma migrate deploy` | Aplica migrations existentes |
| `npx prisma migrate dev --name <nome>` | Cria e aplica uma nova migration |
| `npx prisma generate` | Regenera o Prisma Client |
| `npx prisma studio` | Abre a interface de consulta e edição de dados |
| `npm test` | Executa testes com Vitest |
| `npm run test:e2e` | Executa testes de ponta a ponta |
| `npm run lint` | Executa o Oxlint |

---

## Passo a passo — cliente web (Next.js)

### 1. Instalar as dependências

Na raiz do repositório, em outro terminal:

```bash
cd frontend
npm ci
```

### 2. Apontar para a API

O frontend utiliza a variável de ambiente **`API_URL`**, lida no servidor Next.js. Por padrão, o código utiliza `http://localhost:3000`.

Para alterar esse endereço, crie opcionalmente `frontend/.env.local`:

```env
API_URL=http://localhost:3000
```

Não é necessário configurar `NEXT_PUBLIC_API_URL`. O projeto não contém um `.env.example` no frontend.

### 3. Subir

```bash
npm run dev -- -p 3001
```

Acesse `http://localhost:3001`. Crie uma conta de organizador em `/cadastro` e entre em `/login`. As ações autenticadas do Next.js utilizam o JWT armazenado em um cookie HttpOnly, com validade de uma hora, para enviar requisições à API com `Authorization: Bearer <token>`.

### Estrutura do cliente web

```text
frontend/
├── app/
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── eventos.ts
│   │   ├── inscricoes.ts
│   │   ├── lotes.ts
│   │   └── recepcionistas.ts
│   ├── components/
│   │   └── ThemeToggle.tsx
│   ├── cadastro/page.tsx
│   ├── login/page.tsx
│   ├── eventos/
│   │   ├── layout.tsx
│   │   ├── novo/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── editar/page.tsx
│   │       ├── inscricoes/
│   │       ├── lotes/
│   │       └── relatorio/
│   ├── recepcionistas/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # listagem dos eventos do organizador
├── public/
├── next.config.ts
├── package.json
└── package-lock.json
```

Os formulários e as páginas se comunicam com a API por meio de Server Actions e consultas executadas no servidor. O frontend utiliza App Router, sem pasta `src/` ou Pages Router.

Outros comandos: `npm run build` (compilação), `npm run start -- -p 3001` (servidor após o build) e `npm run lint` (ESLint).

---

## Passo a passo — app mobile (Flutter)

### 1. Conferir o ambiente e instalar as dependências

Na raiz do repositório, em outro terminal:

```bash
cd mobile
flutter doctor
flutter pub get
flutter devices
```

### 2. Endereço da API

A URL está centralizada em `mobile/lib/services/evento_service.dart`, no getter `EventoService.baseUrl`.

| Onde o app roda | URL da API |
|---|---|
| Flutter Web (Chrome) | `http://localhost:3000` — configurada no código |
| Emulador Android | `http://10.0.2.2:3000` — configurada no código |
| Simulador iOS | `http://localhost:3000` — requer ajuste no getter |
| Dispositivo físico | `http://<ip-da-sua-maquina>:3000` — requer ajuste no getter e acesso à rede local |

O código distingue somente Flutter Web e plataformas nativas. Por isso, o endereço de emulador Android é o padrão atual para todas as plataformas nativas. Não há configuração por `.env` no mobile.

O manifesto Android de debug já contém `android:usesCleartextTraffic="true"`, permitindo HTTP local durante o desenvolvimento. O manifesto principal declara a permissão de internet. Em iOS, também pode ser necessário configurar a política de segurança de transporte para HTTP local.

### 3. Preparar a demonstração mobile

O aplicativo possui login simulado, com acesso aos perfis Participante e Recepcionista. As requisições de consulta de eventos são públicas; as operações de ingressos e check-in usam rotas demonstrativas da API.

No `backend/.env`, configure:

```env
NODE_ENV=development
MOBILE_DEMO=true
```

O código utiliza identificadores fixos para os usuários de demonstração:

| Perfil | Identificador usado |
|---|---|
| Participante | `4` |
| Recepcionista | `9` |

O repositório não contém seed nem dados de demonstração versionados. Em uma instalação nova, as migrations criam a estrutura do banco, mas não criam esses usuários. Para reproduzir a demonstração completa, prepare os dados localmente e confira os identificadores em `npx prisma studio` (executado dentro de `backend/`).

1. Crie uma conta de organizador pelo web e cadastre um evento.
2. Crie um lote com período de inscrição vigente e vagas disponíveis.
3. Cadastre um participante e um recepcionista pelo web. Garanta que o participante de demonstração tenha ID `4` e o recepcionista tenha ID `9`. Se os IDs gerados forem diferentes, ajuste localmente os identificadores fixos nas rotas de demonstração de `inscricoes.controller.ts` e `checkins.controller.ts` para os IDs correspondentes, ou prepare o banco com os IDs esperados.
4. Crie uma inscrição para o participante de demonstração, vinculada ao evento e ao lote.
5. Com o backend em execução, abra o app como participante para consultar o ingresso, ou como recepcionista para localizar a inscrição e realizar o check-in.

As credenciais digitadas na tela de login do app não determinam os usuários consultados. O check-in demonstrativo altera os dados reais do banco local, portanto utilize apenas registros de teste.

### 4. Rodar

Com um emulador Android iniciado:

```bash
flutter run
```

Para executar no navegador:

```bash
flutter run -d chrome
```

O Flutter Web é uma execução do aplicativo mobile, não o cliente administrativo Next.js.

### Estrutura do aplicativo

```text
mobile/
├── lib/
│   ├── main.dart                     # aplicação, navegação e principais telas
│   ├── tela_meus_ingressos.dart       # consulta dos ingressos
│   ├── models/
│   │   ├── evento.dart
│   │   ├── ingresso.dart
│   │   └── inscricao_evento.dart
│   └── services/
│       ├── evento_service.dart
│       ├── ingresso_service.dart
│       └── inscricao_evento_service.dart
├── android/
├── ios/
├── web/
├── test/
├── pubspec.yaml
└── pubspec.lock
```

Outros comandos: `flutter analyze` (análise estática) e `flutter test` (testes).

---

## Rodando os três ao mesmo tempo

Após instalar as dependências, configurar o `.env`, aplicar as migrations e gerar o Prisma Client, execute os comandos abaixo, cada um a partir da raiz do repositório, em terminais separados:

```bash
docker compose up -d                 # banco PostgreSQL, se utilizado Docker
cd backend && npm run start:dev      # terminal 1 — API em :3000
cd frontend && npm run dev -- -p 3001 # terminal 2 — web em :3001
cd mobile && flutter run             # terminal 3 — aplicativo no emulador
```

Para demonstrar o mobile, também habilite `MOBILE_DEMO=true` e prepare os dados descritos na seção anterior.

| Serviço | Endereço padrão |
|---|---|
| PostgreSQL | `localhost:5432` |
| API REST | `http://localhost:3000` |
| Cliente web | `http://localhost:3001` |
| Mobile Android (acesso à API) | `http://10.0.2.2:3000` |

---

## Integração e API REST

A API centraliza a persistência, as validações, as regras de inscrição e a contagem de presença. O web administra os dados e o mobile consulta esses mesmos registros e realiza o credenciamento.

Principais endpoints implementados no código:

| Método e rota | Acesso |
|---|---|
| `POST /auth/registro`, `POST /auth/login` | Público |
| `GET /auth/perfil` | JWT válido |
| `GET /eventos`, `GET /eventos/:id` | Público |
| `GET /eventos/meus`, `GET /eventos/meus/:id` | Organizador |
| `POST /eventos`, `PATCH /eventos/:id`, `DELETE /eventos/:id` | Organizador |
| `GET /eventos/:eventoId/lotes`, `POST /eventos/:eventoId/lotes`, `PATCH /lotes/:id` | Organizador |
| `GET /usuarios/participantes`, `POST /usuarios/participantes`, `POST /usuarios/recepcionistas` | Organizador |
| `POST /inscricoes`, `GET /inscricoes/:id` | Organizador |
| `GET /inscricoes?eventoId=:id` (com `busca` opcional) | Organizador e recepcionista |
| `GET /inscricoes/minhas` | Participante |
| `POST /inscricoes/:id/checkin` | Recepcionista |
| `GET /eventos/:eventoId/contagem` | Organizador e recepcionista |

Rotas utilizadas pelo mobile em modo demonstrativo, sem token:

| Método e rota | Finalidade |
|---|---|
| `GET /inscricoes/demo/participante` | Consulta os ingressos do participante fixo |
| `GET /inscricoes/demo/evento/:eventoId` | Consulta as inscrições do evento; aceita `busca` opcional |
| `POST /inscricoes/demo/:id/checkin` | Registra check-in com o recepcionista fixo |
| `GET /eventos/demo/:eventoId/contagem` | Consulta a contagem de presença |

As rotas de demonstração de inscrições exigem `MOBILE_DEMO=true` e `NODE_ENV=development`; as de check-in e contagem exigem `MOBILE_DEMO=true` e rejeitam `NODE_ENV=production`. Configure sempre `development` para utilizar todos os fluxos. As rotas regulares protegidas continuam exigindo JWT e o perfil autorizado.

O controller de usuários também expõe `GET /usuarios`, sem guard, e rotas `GET`, `PATCH` e `DELETE /usuarios/:id`, sem guard, cujos serviços ainda retornam mensagens de scaffold. Elas não constituem um CRUD completo de usuários e não devem ser consideradas prontas para produção.

O [contrato da API](docs/contrato-api.md) contém a documentação das etapas anteriores e ainda precisa incorporar os endpoints e mudanças mais recentes, incluindo as rotas públicas de eventos e as rotas demonstrativas do mobile. A tabela acima reflete os controllers da versão atual.

---

## Convenções de código

**O substantivo do domínio é português; o nome do padrão, do papel ou do recurso do framework é inglês.**

| Em português (domínio) | Em inglês (técnico) |
|---|---|
| `Evento`, `Usuario`, `Inscricao` | `Controller`, `Service`, `Module` |
| campos: `nome`, `descricao`, `criadoEm` | `Dto`, `Guard`, `Pipe` |
| rotas: `/eventos`, `/inscricoes` | `Page`, `Layout`, `Widget` |
| arquivos: `eventos.controller.ts` | `findAll`, `findOne`, `create`, `update`, `remove` |

Identificadores não levam acento ou cedilha: `Inscricao`, não `Inscrição`. Comentários, mensagens de commit, textos de interface e mensagens de erro voltadas ao usuário final utilizam português do Brasil.

---

## Documentação do grupo

| Arquivo | Quando | Para quê |
|---|---|---|
| [docs/visao.md](docs/visao.md) | Etapa 0 | Problema, usuários e escopo de alto nível |
| [docs/equipe.md](docs/equipe.md) | Etapa 0, atualizado a cada etapa | Composição, papéis e registro de contribuições |
| [docs/prd.md](docs/prd.md) | Etapa 1, revisado depois | Requisitos, modelo de dados, arquitetura e recorte web/mobile |
| [docs/contrato-api.md](docs/contrato-api.md) | Etapa 1, atualizado com a implementação | Endpoints, entradas, saídas, erros e autenticação |
| [docs/relatorio.md](docs/relatorio.md) | A cada etapa | Diário técnico, decisões, dificuldades e uso de IA |
| [docs/rfc-001.md](docs/rfc-001.md) | Se aplicável | Análise e implementação de uma mudança de requisito |

A documentação em `docs/` faz parte da entrega acadêmica. O contrato da API deve acompanhar a implementação, e o relatório técnico deve registrar as decisões das etapas finais. Alguns desses documentos ainda contêm campos de etapas anteriores a preencher ou atualizar.

---

## Regras do repositório

### Obrigatório

- Um repositório único do grupo, acessível ao professor.
- Cada commit feito pelo autor real do código. Em programação em par, utilizar `Co-authored-by:` na mensagem.
- Nenhuma credencial real versionada.

### Recomendado

- Manter a `main` em estado funcional.
- Fazer commits frequentes ao longo da sprint.
- Utilizar mensagens no padrão `tipo(componente): descricao`:

```text
feat(backend): adiciona endpoint de inscricoes
feat(frontend): implementa gerenciamento de lotes
feat(mobile): adiciona consulta de ingressos
fix(backend): corrige registro de check-in
docs: atualiza estrutura e instrucoes do README
```

- Criar branches por funcionalidade e revisar Pull Requests antes do merge.

### O que não versionar

Os arquivos `.gitignore` da raiz e dos componentes cobrem os principais artefatos gerados e configurações locais:

```text
node_modules/           frontend/.next/       backend/dist/
backend/generated/      mobile/.dart_tool/    mobile/build/
.env                    .env.local            coverage/
```

O backend fornece `backend/.env.example` com valores de exemplo. Nunca versione o `.env` real, chaves JWT ou credenciais de produção.

---

## Onde está o resto

O escopo acadêmico, as etapas, os prazos e os critérios de avaliação estão na página do trabalho, na disciplina. Em caso de divergência com o enunciado oficial, prevalece a orientação do professor.
