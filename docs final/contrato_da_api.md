# Contrato da API

Este documento descreve os endpoints implementados na API REST do sistema de credenciamento e check-in de eventos **Eventoon**, incluindo autenticação, permissões, dados aceitos e respostas retornadas pelo backend.

---

## Identificação

| Campo | Valor |
|---|---|
| Projeto | Eventoon |
| Versão do contrato | 2.0 |
| Última atualização | 25/11/2026 |
| URL base (desenvolvimento) | `http://localhost:3000` |
| Formato | JSON (`Content-Type: application/json`) |

> **Nota para o app mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina do desenvolvedor. Use `http://10.0.2.2:3000` no emulador Android, ou o IP da máquina na rede local para dispositivo físico.

---

## 1. Convenções gerais

### 1.1 Nomenclatura

Os endpoints são organizados por recurso, utilizando nomes em português e sem acentos: `/auth`, `/usuarios`, `/eventos`, `/lotes`, `/inscricoes` e `/checkins` (via rotas aninhadas em `/inscricoes/:id/checkin` e `/eventos/:eventoId/contagem`).

Os identificadores das entidades (`id`) são números inteiros autoincrementais gerados pelo banco de dados PostgreSQL via Prisma. Todas as datas trafegam como strings no formato ISO 8601 em UTC (`2026-11-15T13:00:00.000Z`).

### 1.2 Mapa geral de endpoints

| Recurso | Operação | Método e caminho | Perfil exigido | Sucesso | Erros comuns |
|---|---|---|---|---|---|
| Auth | Registrar conta | `POST /auth/registro` | Público | `201` | `400`, `409` |
| Auth | Login | `POST /auth/login` | Público | `200` | `400`, `401` |
| Auth | Consultar perfil | `GET /auth/perfil` | Autenticado | `200` | `401` |
| Usuários | Cadastrar participante | `POST /usuarios/participantes` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `409` |
| Usuários | Listar participantes | `GET /usuarios/participantes` | `ORGANIZADOR` | `200` | `401`, `403` |
| Usuários | Cadastrar recepcionista | `POST /usuarios/recepcionistas` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `409` |
| Usuários | Listar usuários | `GET /usuarios` | Público (interno) | `200` | — |
| Usuários | Consultar usuário | `GET /usuarios/:id` | Público (interno) | `200` | `404` |
| Usuários | Atualizar usuário | `PATCH /usuarios/:id` | Público (interno) | `200` | `400`, `404` |
| Usuários | Excluir usuário | `DELETE /usuarios/:id` | Público (interno) | `200` | `404` |
| Eventos | Cadastrar evento | `POST /eventos` | `ORGANIZADOR` | `201` | `400`, `401`, `403` |
| Eventos | Listar meus eventos | `GET /eventos/meus` | `ORGANIZADOR` | `200` | `401`, `403` |
| Eventos | Consultar meu evento | `GET /eventos/meus/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Eventos | Listar todos os eventos | `GET /eventos` | Público | `200` | — |
| Eventos | Consultar evento | `GET /eventos/:id` | Público | `200` | `400`, `404` |
| Eventos | Atualizar evento | `PATCH /eventos/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Eventos | Excluir evento | `DELETE /eventos/:id` | `ORGANIZADOR` | `204` | `400`, `401`, `403`, `404`, `409` |
| Lotes | Cadastrar lote no evento | `POST /eventos/:eventoId/lotes` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `404` |
| Lotes | Listar lotes do evento | `GET /eventos/:eventoId/lotes` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Lotes | Atualizar lote | `PATCH /lotes/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Inscrições | Listar minhas inscrições | `GET /inscricoes/minhas` | `PARTICIPANTE` | `200` | `401`, `403` |
| Inscrições | Cadastrar inscrição | `POST /inscricoes` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `404`, `409` |
| Inscrições | Listar/buscar inscrições do evento | `GET /inscricoes?eventoId=&busca=` | `ORGANIZADOR`, `RECEPCIONISTA` | `200` | `400`, `401`, `403` |
| Inscrições | Consultar inscrição | `GET /inscricoes/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Check-in | Registrar check-in | `POST /inscricoes/:id/checkin` | `RECEPCIONISTA` | `200` | `400`, `401`, `403`, `404`, `409` |
| Check-in | Contagem de presença do evento | `GET /eventos/:eventoId/contagem` | `ORGANIZADOR`, `RECEPCIONISTA` | `200` | `400`, `401`, `403`, `404` |

### 1.3 Formato de erro

A API utiliza o formato padrão de erros do NestJS (`statusCode`, `message` e `error`), com `ValidationPipe` global habilitado (`whitelist`, `forbidNonWhitelisted`, `transform`, `enableImplicitConversion`).

Exemplo de erro de validação (`400`):

```json
{
  "statusCode": 400,
  "message": [
    "Informe um e-mail válido.",
    "A senha deve ter pelo menos 8 caracteres."
  ],
  "error": "Bad Request"
}
```

Exemplo de recurso não encontrado (`404`):

```json
{
  "statusCode": 404,
  "message": "Evento não encontrado.",
  "error": "Not Found"
}
```

### 1.4 Paginação e datas

As listagens retornam arrays JSON diretos (sem envelope de paginação `page`/`limit` nesta versão do MVP). Todas as datas trafegam em ISO 8601 UTC; a formatação para o fuso local fica a cargo de cada cliente.

---

## 2. Autenticação

### 2.1 Estratégia

A API utiliza autenticação via **JWT (JSON Web Token)** com `JwtAuthGuard` e controle de perfis com `RolesGuard` e `@Roles(...)`.

As requisições protegidas devem enviar:

```http
Authorization: Bearer <token>
```

A validade do token é de 1 hora, assinado com `JWT_SECRET`. As senhas são armazenadas exclusivamente como hash (`senhaHash`) no banco de dados. Não há endpoint de refresh token nesta versão.

### 2.2 Endpoints de autenticação

#### `POST /auth/registro`

Registra uma nova conta de usuário.

Requisição:

```json
{
  "nome": "Ana Organizador",
  "email": "ana@exemplo.com",
  "senha": "senhaSegura123"
}
```

Regras de validação (`RegistroDto`):
- `nome`: string, entre 2 e 100 caracteres.
- `email`: e-mail válido, máximo de 254 caracteres.
- `senha`: string, entre 8 e 128 caracteres.

Resposta `201`: retorna os dados básicos do usuário criado (sem `senhaHash`).

#### `POST /auth/login`

Autentica o usuário com e-mail e senha.

Requisição:

```json
{
  "email": "organizador@exemplo.com",
  "senha": "senhaSegura123"
}
```

Resposta `200`:

```json
{
  "access_token": "eyJhbGciOi...",
  "usuario": {
    "id": 1,
    "nome": "Ana Organizador",
    "email": "organizador@exemplo.com",
    "tipo": "ORGANIZADOR"
  }
}
```

#### `GET /auth/perfil`

Requer `JwtAuthGuard`. Retorna o payload do usuário autenticado (`id`, `email`, `tipo`).

### 2.3 Perfis e permissões

| Perfil | Pode | Não pode |
|---|---|---|
| `ORGANIZADOR` | Criar, listar (`/eventos/meus`), editar e excluir seus próprios eventos; gerenciar lotes; cadastrar participantes e recepcionistas; criar e consultar inscrições; consultar contagem de presença. | Editar ou excluir eventos/lotes de outro organizador; excluir evento com lotes ou inscrições vinculados; registrar check-in. |
| `RECEPCIONISTA` | Consultar eventos públicos; listar/buscar inscrições de um evento; registrar check-in; consultar contagem de presença. | Criar, editar ou excluir eventos, lotes ou inscrições. |
| `PARTICIPANTE` | Consultar eventos públicos (`GET /eventos`, `GET /eventos/:id`); consultar suas próprias inscrições (`GET /inscricoes/minhas`). | Acessar endpoints administrativos ou registrar check-in. |

### 2.4 Armazenamento do token em cada cliente

| Cliente | Estratégia | Nível de autenticação | Observação |
|---|---|---|---|
| Web (Next.js) | Cookie `HttpOnly` | Completa | O servidor Next.js envia o token no cabeçalho `Authorization` nas chamadas à API. |
| Mobile (Flutter) | Login simulado (sem token JWT) | Simulada | Conforme orientação docente, o app permite escolher o perfil (participante ou recepcionista) sem autenticação real e consome as rotas públicas/fluxos do recorte mobile. |

---

## 3. Recursos

### 3.1 Evento (`/eventos`)

Representação:

```json
{
  "id": 1,
  "nome": "Semana de Tecnologia",
  "descricao": "Palestras e oficinas práticas",
  "local": "Auditório Principal",
  "data": "2026-11-30T13:00:00.000Z",
  "criadoEm": "2026-10-20T15:30:00.000Z",
  "organizadorId": 1
}
```

- `GET /eventos` (público): lista todos os eventos cadastrados em ordem crescente de data.
- `GET /eventos/:id` (público): retorna os detalhes de um evento pelo `id` numérico (`400` se inválido, `404` se inexistente).
- `GET /eventos/meus` (`ORGANIZADOR`): lista apenas os eventos do organizador autenticado.
- `GET /eventos/meus/:id` (`ORGANIZADOR`): retorna detalhes de um evento específico pertencente ao organizador autenticado.
- `POST /eventos` (`ORGANIZADOR`): cria evento (`nome`, `descricao` opcional, `local`, `data`). O `organizadorId` é extraído do JWT. Retorna `201`.
- `PATCH /eventos/:id` (`ORGANIZADOR`): atualiza parcialmente um evento do organizador autenticado. Retorna `200`.
- `DELETE /eventos/:id` (`ORGANIZADOR`): exclui evento do organizador autenticado. Retorna `204` sem corpo, ou `409` se houver lotes/inscrições vinculados.

---

### 3.2 Usuário (`/usuarios`)

Representação (sem expor `senhaHash`):

```json
{
  "id": 2,
  "nome": "Júlia Silva",
  "email": "julia@exemplo.com",
  "tipo": "PARTICIPANTE",
  "criadoEm": "2026-11-01T10:00:00.000Z"
}
```

- `POST /usuarios/participantes` (`ORGANIZADOR`): cadastra um usuário com perfil `PARTICIPANTE`.
- `GET /usuarios/participantes` (`ORGANIZADOR`): lista os usuários com perfil `PARTICIPANTE`.
- `POST /usuarios/recepcionistas` (`ORGANIZADOR`): cadastra um usuário com perfil `RECEPCIONISTA`.
- `GET /usuarios`, `GET /usuarios/:id`, `PATCH /usuarios/:id`, `DELETE /usuarios/:id`: operações CRUD auxiliares do módulo de usuários.

---

### 3.3 Lote (`/eventos/:eventoId/lotes` e `/lotes/:id`)

Todas as rotas exigem autenticação e perfil `ORGANIZADOR`.

Representação:

```json
{
  "id": 1,
  "nome": "1º Lote",
  "quantidade": 100,
  "inicio": "2026-11-01T00:00:00.000Z",
  "fim": "2026-11-20T23:59:59.000Z",
  "eventoId": 1
}
```

- `POST /eventos/:eventoId/lotes`: cria um lote vinculado ao evento (verifica se o evento pertence ao organizador autenticado). Retorna `201`.
- `GET /eventos/:eventoId/lotes`: lista os lotes do evento do organizador autenticado. Retorna `200`.
- `PATCH /lotes/:id`: atualiza os dados de um lote existente (`nome`, `quantidade`, `inicio`, `fim`). Retorna `200`.

---

### 3.4 Inscrição (`/inscricoes`)

Representação:

```json
{
  "id": 10,
  "codigo": "EVT-9F3A2B",
  "status": "ATIVA",
  "criadoEm": "2026-11-10T14:20:00.000Z",
  "participanteId": 2,
  "eventoId": 1,
  "loteId": 1
}
```

Valores possíveis de `status`: `ATIVA`, `CANCELADA`, `LISTA_ESPERA`.

- `GET /inscricoes/minhas` (`PARTICIPANTE`): retorna as inscrições do participante autenticado.
- `POST /inscricoes` (`ORGANIZADOR`): cria uma inscrição vinculada a participante, evento e lote. O servidor gera o `codigo` único e define o `status` como `ATIVA` ou `LISTA_ESPERA` conforme a disponibilidade de vagas do lote. Retorna `201`.
- `GET /inscricoes?eventoId=<id>&busca=<texto>` (`ORGANIZADOR`, `RECEPCIONISTA`): lista as inscrições de um evento (`eventoId` obrigatório numérico), permitindo filtro opcional pelo parâmetro `busca` (nome do participante ou código da inscrição).
- `GET /inscricoes/:id` (`ORGANIZADOR`): consulta os detalhes de uma inscrição específica.

---

### 3.5 Check-in e Contagem (`/inscricoes/:id/checkin` e `/eventos/:eventoId/contagem`)

- `POST /inscricoes/:id/checkin` (`RECEPCIONISTA`): registra a entrada do participante para a inscrição informada, associando automaticamente o `recepcionistaId` do usuário autenticado. Retorna `200 OK` com o registro do check-in.
- `GET /eventos/:eventoId/contagem` (`ORGANIZADOR`, `RECEPCIONISTA`): retorna a contagem de inscritos e participantes presentes (com check-in registrado) do evento informado.

---

## 4. Endpoints de regra de negócio

### 4.1 Exclusão protegida de eventos (`DELETE /eventos/:id`)

Antes de excluir um evento, o backend verifica se ele pertence ao organizador autenticado e se possui lotes ou inscrições vinculados. Caso possua vínculos, retorna `409 Conflict`.

### 4.2 Controle de vagas e lista de espera (`POST /inscricoes`)

O backend gera automaticamente o `codigo` único da inscrição (ignorando qualquer valor externo) e conta as inscrições ativas no lote. Quando o limite `quantidade` do lote é atingido, a inscrição é registrada com status `LISTA_ESPERA`.

### 4.3 Registro e idempotência de check-in (`POST /inscricoes/:id/checkin`)

- Inscrições com status `LISTA_ESPERA` ou `CANCELADA` são impedidas de realizar check-in.
- A relação `CheckIn.inscricaoId` possui restrição `@unique` no banco de dados, garantindo no máximo um check-in por inscrição. Tentativas repetidas não duplicam o registro nem alteram a contagem de presentes.

---

## 5. Diferenças de consumo entre os clientes

| Fluxo / Endpoint | Cliente Web (Next.js) | App Mobile (Flutter) | Motivo |
|---|---|---|---|
| Autenticação | Login e cadastro reais (`POST /auth/login`, `POST /auth/registro`) com cookie `HttpOnly`. | Login simulado (seleção de perfil Participante ou Recepcionista). | Orientação da disciplina para priorizar os fluxos principais do mobile no prazo do MVP. |
| Eventos | Consome `GET /eventos/meus`, `POST/PATCH/DELETE /eventos` para gestão completa. | Consome `GET /eventos` e `GET /eventos/:id` para busca de eventos pelo participante. | Separação entre fluxo administrativo (web) e consulta/inscrição (mobile). |
| Inscrições e Check-in | Gerencia inscrições e acompanha presença no painel administrativo. | Participante visualiza o código/QR Code do ingresso; recepcionista lê o QR Code na entrada. | O uso da câmera e mobilidade justifica o fluxo de ingresso e leitura de QR no celular. |

---

## 6. Como verificar o contrato

- [x] Compilação sem erros do backend NestJS (`npm run build`) e frontend Next.js.
- [x] Testes manuais das rotas de autenticação, eventos, lotes, inscrições e check-in.
- [x] Conferência dos DTOs e retornos dos controllers com este contrato.
- [ ] Swagger habilitado no backend (não adotado no MVP; contrato mantido neste documento).

---

## 7. Histórico de revisões

| Versão | Data | Alteração | Impacto nos clientes |
|---|---|---|---|
| 1.0 | 03/09/2026 | Criação inicial do contrato da API no repositório. | Definição inicial da interface entre backend e clientes. |
| 1.1 | 21/10/2026 | Revisão do contrato com autenticação JWT e CRUD de eventos. | Web integrado ao CRUD de eventos e autenticação. |
| 2.0 | 25/11/2026 | Documentação completa de todos os módulos implementados (`auth/registro`, `usuarios`, `eventos/meus`, `lotes`, `inscricoes`, `checkins`) e registro da estratégia simulada no mobile. | Alinhamento final entre backend, cliente web e app mobile Flutter. |