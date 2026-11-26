# Eventoon — Sistema de Credenciamento e Check-in de Eventos

Trabalho integrador da disciplina **Programação Web e Mobile** no modelo **um serviço e dois clientes**: uma API REST em NestJS concentra as regras de negócio e a persistência no PostgreSQL, consumida por um cliente web em Next.js e um aplicativo mobile em Flutter.

---

## Equipe (Grupo A)

| Integrante | GitHub | Responsabilidade principal |
|---|---|---|
| Maria Eduarda Schell | [`@schellx`](https://github.com/schellx) | Backend (NestJS + Prisma), App Mobile (Flutter) e documentação |
| João Vitor Dalla Lana | [`@Jao22x`](https://github.com/Jao22x) | Cliente Web (Next.js), App Mobile (Flutter) e ambiente Docker/DB |

---

## Stack utilizada

| Componente | Tecnologias e versões |
|---|---|
| **Backend (API REST)** | Node.js 24 (`24.22.0`, versão informada pelo grupo), NestJS 12, Prisma 7 (`@prisma/adapter-pg`), JWT (`@nestjs/jwt` / `passport-jwt`) |
| **Banco de dados** | PostgreSQL 18 (provisionado via Docker Compose) |
| **Cliente Web** | Next.js 16.3.8 (App Router), React 19.2.8, TypeScript |
| **App Mobile** | Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0) |

---

## Funcionalidades implementadas

### Backend (`backend/`)
- **Autenticação e autorização:** registro (`POST /auth/registro`), login (`POST /auth/login`), perfil (`GET /auth/perfil`), hash de senhas e controle por perfis (`ORGANIZADOR`, `RECEPCIONISTA`, `PARTICIPANTE`) via `JwtAuthGuard` e `RolesGuard`.
- **Eventos e Lotes:** CRUD de eventos (com listagem pública e listagem restrita ao organizador), bloqueio de exclusão com vínculos (`409 Conflict`) e gestão de lotes/vagas.
- **Usuários, Inscrições e Check-in:** cadastro de participantes e recepcionistas, geração automática de código único de inscrição, controle de lotação com `LISTA_ESPERA`, registro de check-in único por inscrição e contagem de presentes.

### Cliente Web (`frontend/`)
- Login, cadastro de conta de organizador e logout, com token JWT em cookie `HttpOnly`.
- Listagem e consulta dos próprios eventos do organizador.
- Cadastro, edição e exclusão de eventos do organizador autenticado (exclusão bloqueada quando há vínculos).
- Cadastro e edição de lotes, cadastro de participantes e recepcionistas, criação/listagem de inscrições e relatório de comparecimento.

### App Mobile (`mobile/`)
- Tela de login simulado com escolha de perfil (**Participante** ou **Recepcionista**), conforme orientação da disciplina.
- **Fluxo Participante:** consultar eventos e detalhes, visualizar ingressos existentes e o código textual. O QR exibido é ilustrativo; não há autoinscrição.
- **Fluxo Recepcionista:** selecionar evento, buscar inscrições por nome/código, registrar check-in e consultar inscritos, presentes, ausentes e lista de espera. A tela de leitura QR é apenas um placeholder.

---

## Estrutura do repositório

```text
/
├── README.md                 ← este arquivo
├── docker-compose.yml        ← PostgreSQL 18 local
├── .gitignore
├── docs/
│   ├── visao.md              ← Documento de Visão
│   ├── prd.md                ← PRD (requisitos, modelo ER e arquitetura)
│   ├── contrato-api.md       ← Contrato REST completo da API
│   ├── equipe.md             ← Composição e registro de contribuições
│   └── relatorio.md          ← Relatório técnico e diário de desenvolvimento
├── backend/                  ← API NestJS + Prisma
├── frontend/                 ← Cliente Web Next.js (App Router)
├── web/                      ← Arquivos estáticos de plataforma Flutter; não é o projeto Next.js
└── mobile/                   ← App Mobile Flutter
```

---

## Pré-requisitos

- **Node.js 24** e **npm**
- **Docker** e **Docker Compose** (ou PostgreSQL 18 instalado localmente)
- **Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0)** (mínimos do lockfile) configurado com emulador Android; iOS/dispositivo físico requer ajuste da URL (`flutter doctor`)

---

## Passo a passo — preparando o ambiente do zero

### 1. Clonar o repositório

```bash
git clone https://github.com/schellx/web-mob-trabalho.git
cd frontend-mob-trabalho
```

### 2. Subir o banco de dados (PostgreSQL 18)

Usando o `docker-compose.yml` da raiz (configurado com banco `appdb`, usuário `app` e senha `app` na porta `5432` (credenciais locais de desenvolvimento)):

```bash
docker compose up -d
docker compose ps
```

> Caso utilize um PostgreSQL 18 já instalado na máquina ou hospedado, basta garantir que o serviço esteja ativo e ajustar o `DATABASE_URL` no passo seguinte.

### 3. Configurar e preparar o Backend (`backend/`)

Crie o arquivo `backend/.env` (não versionado no Git):

```env
DATABASE_URL="postgresql://app:app@localhost:5432/appdb?schema=public"
JWT_SECRET="troque-por-uma-chave-secreta-local"
NODE_ENV=development
MOBILE_DEMO=true
```

Instale as dependências, gere o cliente do Prisma 7 e aplique as migrations:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
cd ..
```

### 4. Configurar e instalar o Cliente Web (`frontend/`)

Crie o arquivo `frontend/.env.local` (não versionado no Git):

```env
API_URL="http://localhost:3000"
```

Instale as dependências:

```bash
cd frontend
npm install
cd ..
```

### 5. Preparar o App Mobile (`mobile/`)

Instale os pacotes Flutter:

```bash
cd mobile
flutter pub get
cd ..
```

Para habilitar a demonstração mobile, configure também `NODE_ENV=development` e `MOBILE_DEMO=true` no `.env` do backend (o exemplo versionado mantém a demonstração desabilitada). As rotas usam o participante de ID **4** e o recepcionista de ID **9**; não há seed automatizado no ZIP. Antes de demonstrar os ingressos e o check-in, confirme no Prisma Studio que esses registros existem, possuem os perfis correspondentes e que há evento, lote e inscrição vinculados ao participante. Em um banco novo, crie dados pelo web/API ou Prisma Studio e garanta os IDs esperados; se forem diferentes, será necessário ajustar os IDs de demonstração no código. Não habilite essas rotas em produção.

**Observação sobre o endereço da API no mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina host. Utilize conforme o ambiente:

| Onde o app roda | URL da API |
|---|---|
| Emulador Android | `http://10.0.2.2:3000` |
| Flutter web (`kIsWeb`) | `http://localhost:3000` (já configurado) |
| Simulador iOS | `http://localhost:3000` (ajustar `mobile/lib/services/evento_service.dart`) |
| Dispositivo físico | `http://<IP-DA-SUA-MAQUINA>:3000` (ajustar `EventoService.baseUrl`) |

---

## Rodando os três ao mesmo tempo

Precisa de três terminais, com o banco já no ar:

```bash
docker compose up -d                       # banco, se o grupo usa Docker
cd backend && npm run start:dev            # terminal 1 — API em :3000
cd frontend     && npm run dev -- -p 3001       # terminal 2 — web em :3001
cd mobile  && flutter run                  # terminal 3 — app no emulador
```

Se o banco estiver instalado na máquina ou hospedado, pule a primeira linha — basta que ele esteja no ar antes de subir a API.

---

## Comandos úteis (Backend e Prisma)

| Comando | Para quê |
|---|---|
| `npm run start:dev` | Sobe a API NestJS em modo desenvolvimento (`:3000`) |
| `npm run build` | Compila o projeto para validação de tipos e produção |
| `npx prisma generate` | Regenera o client do Prisma em `generated/prisma` |
| `npx prisma migrate dev --name <nome>` | Cria e aplica uma nova migration |
| `npx prisma studio` | Abre a interface visual para inspecionar o banco |

---

## Documentação do projeto

Toda a documentação técnica encontra-se versionada na pasta `docs/`:

| Arquivo | Conteúdo |
|---|---|
| [`docs/visao.md`](docs/visao.md) | Problema, partes interessadas, personas e escopo do produto |
| [`docs/prd.md`](docs/prd.md) | Requisitos funcionais e não funcionais, regras de negócio, diagrama ER e arquitetura |
| [`docs/contrato-api.md`](docs/contrato-api.md) | Especificação completa dos endpoints REST, DTOs, perfis e códigos de erro |
| [`docs/equipe.md`](docs/equipe.md) | Divisão de papéis, combinados do grupo e histórico de contribuições por etapa |
| [`docs/relatorio.md`](docs/relatorio.md) | Diário técnico, ambiente, uso de IA, decisões arquiteturais e reflexão final |

## Testes automatizados e validação

| Componente | Arquivo / comando | Cobertura existente no código |
|---|---|---|
| Backend | `src/inscricoes/inscricoes.service.spec.ts` | 3 casos: consulta das inscrições do participante, busca por nome/código e evento inexistente. |
| Backend | `src/checkins/checkins.service.spec.ts` | 3 casos: check-in de inscrição ativa, repetição sem duplicação e inscrição inexistente. |
| Backend | `src/eventos/*.spec.ts`, `src/usuarios/*.spec.ts`, `src/app.controller.spec.ts` | 5 casos básicos de instanciação e resposta da rota raiz. |
| Backend | `test/app.e2e-spec.ts` | 1 teste HTTP da rota raiz (`GET /`, `200`, `Hello World!`), não dos fluxos de negócio. |
| Mobile | `test/widget_test.dart` | 3 testes de widget: tela inicial e navegação demonstrativa dos dois perfis. |
| Web | `frontend/package.json` | Comandos `build` e `lint`; não há suíte automatizada de testes no ZIP. |

Executar, após configurar o ambiente e gerar o Prisma Client:

```bash
cd backend
npm test
npm run test:cov
npm run test:e2e
# Em outro terminal, na raiz do projeto:
cd mobile
flutter test
# Cliente web, na raiz do projeto:
cd frontend
npm run build
npm run lint
```

A revisão de 26/11/2026 confirmou a existência e o conteúdo dos testes por inspeção estática, não a aprovação de todos os casos. O ambiente de revisão não dispunha de Node 24, Flutter, dependências instaladas ou PostgreSQL/Docker configurado. Não há evidência de cobertura percentual ou execução E2E do fluxo completo. Os testes de serviço usam mocks do Prisma e não verificam concorrência real no banco.

## Vídeo de apresentação

[Assistir à apresentação](https://drive.google.com/file/d/1sxEOyw_qDrLlCXINLT02DOWz3VVNAdBU/view?usp=sharing).

## Limitações conhecidas

- O login mobile é demonstrativo, conforme orientação docente; as operações de demo usam IDs fixos.
- O CRUD genérico de usuários não está completo: `GET /usuarios` é público, e as rotas por ID retornam mensagens de scaffold sem efetuar operações. Não utilizar como interface administrativa de produção.
- A inscrição não possui endpoint de cancelamento nem promoção automática da lista de espera.
- A tela QR é ilustrativa; o credenciamento funcional usa busca textual.
