# EvenToon — Sistema de Credenciamento e Check-in de Eventos

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
| **Backend (API REST)** | Node.js 24 (`24.22.0`), NestJS 12, Prisma 7 (`@prisma/adapter-pg`), JWT (`@nestjs/jwt` / `passport-jwt`) |
| **Banco de dados** | PostgreSQL 18 (provisionado via Docker Compose) |
| **Cliente Web** | Next.js 15 (App Router), React 19, TypeScript |
| **App Mobile** | Flutter 3.5 / Dart |

---

## Funcionalidades implementadas

### Backend (`backend/`)
- **Autenticação e autorização:** registro (`POST /auth/registro`), login (`POST /auth/login`), perfil (`GET /auth/perfil`), hash de senhas e controle por perfis (`ORGANIZADOR`, `RECEPCIONISTA`, `PARTICIPANTE`) via `JwtAuthGuard` e `RolesGuard`.
- **Eventos e Lotes:** CRUD de eventos (com listagem pública e listagem restrita ao organizador), bloqueio de exclusão com vínculos (`409 Conflict`) e gestão de lotes/vagas.
- **Usuários, Inscrições e Check-in:** cadastro de participantes e recepcionistas, geração automática de código único de inscrição, controle de lotação com `LISTA_ESPERA`, registro de check-in único por inscrição e contagem de presentes.

### Cliente Web (`web/`)
- Login e cadastro de conta com armazenamento do token JWT em cookie `HttpOnly`.
- Visualização/listagem de eventos.
- Cadastro e edição de eventos do organizador autenticado.
- Gerenciamento de inscrições.

### App Mobile (`mobile/`)
- Tela de login simulado com escolha de perfil (**Participante** ou **Recepcionista**), conforme orientação da disciplina.
- **Fluxo Participante:** buscar eventos, realizar inscrição e exibir o código do ingresso.
- **Fluxo Recepcionista:** leitura do código QR do ingresso para validação de entrada.

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
├── web/                      ← Cliente Web Next.js (App Router)
└── mobile/                   ← App Mobile Flutter
```

---

## Pré-requisitos

- **Node.js 24** e **npm**
- **Docker** e **Docker Compose** (ou PostgreSQL 18 instalado localmente)
- **Flutter SDK 3.5** configurado com emulador Android/iOS ou dispositivo físico (`flutter doctor`)

---

## Passo a passo — preparando o ambiente do zero

### 1. Clonar o repositório

```bash
git clone https://github.com/schellx/web-mob-trabalho.git
cd web-mob-trabalho
```

### 2. Subir o banco de dados (PostgreSQL 18)

Usando o `docker-compose.yml` da raiz (configurado com banco `appdb`, usuário `app` e senha `app` na porta `5432`):

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
```

Instale as dependências, gere o cliente do Prisma 7 e aplique as migrations:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
cd ..
```

### 4. Configurar e instalar o Cliente Web (`web/`)

Crie o arquivo `web/.env.local` (não versionado no Git):

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Instale as dependências:

```bash
cd web
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

**Observação sobre o endereço da API no mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina host. Utilize conforme o ambiente:

| Onde o app roda | URL da API |
|---|---|
| Emulador Android | `http://10.0.2.2:3000` |
| Simulador iOS | `http://localhost:3000` |
| Dispositivo físico | `http://<IP-DA-SUA-MAQUINA>:3000` |

---

## Rodando os três ao mesmo tempo

Precisa de três terminais, com o banco já no ar:

```bash
docker compose up -d                       # banco, se o grupo usa Docker
cd backend && npm run start:dev            # terminal 1 — API em :3000
cd web     && npm run dev -- -p 3001       # terminal 2 — web em :3001
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