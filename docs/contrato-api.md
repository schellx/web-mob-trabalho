# Contrato da API

Este documento descreve os endpoints implementados na API REST do sistema de credenciamento e check-in de eventos **Eventoon**, incluindo autenticação, permissões, dados aceitos e respostas retornadas pelo backend.

---

## Identificação

| Campo | Valor |
|---|---|
| Projeto | Eventoon |
| Versão do contrato | 2.1 |
| Última atualização | 26/11/2026 |
| URL base (desenvolvimento) | `http://localhost:3000` |
| Formato | JSON (`Content-Type: application/json`), exceto raiz e stubs de usuário em texto |

> **Nota para o app mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina do desenvolvedor. Use `http://10.0.2.2:3000` no emulador Android, ou o IP da máquina na rede local para dispositivo físico.

---

## 1. Convenções gerais

### 1.1 Nomenclatura

Os endpoints são organizados por recurso, utilizando nomes em português e sem acentos: `/auth`, `/usuarios`, `/eventos`, `/lotes`, `/inscricoes` e check-in e contagem (rotas aninhadas em `/inscricoes/:id/checkin` e `/eventos/:eventoId/contagem`, além das rotas demonstrativas).

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
| Usuários | Listar usuários | `GET /usuarios` | Público (sem guard) | `200` | — |
| Usuários | Consultar usuário (stub) | `GET /usuarios/:id` | Público (sem guard) | `200` | — |
| Usuários | Atualizar usuário (stub) | `PATCH /usuarios/:id` | Público (sem guard) | `200` | `400` (DTO) |
| Usuários | Excluir usuário (stub) | `DELETE /usuarios/:id` | Público (sem guard) | `200` | — |
| Eventos | Cadastrar evento | `POST /eventos` | `ORGANIZADOR` | `201` | `400`, `401`, `403` |
| Eventos | Listar meus eventos | `GET /eventos/meus` | `ORGANIZADOR` | `200` | `401`, `403` |
| Eventos | Consultar meu evento | `GET /eventos/meus/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Eventos | Listar todos os eventos | `GET /eventos` | Público | `200` | — |
| Eventos | Consultar evento | `GET /eventos/:id` | Público | `200` | `400`, `404` |
| Eventos | Atualizar evento | `PATCH /eventos/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Eventos | Excluir evento | `DELETE /eventos/:id` | `ORGANIZADOR` | `204` | `400`, `401`, `403`, `404`, `409` |
| Lotes | Cadastrar lote no evento | `POST /eventos/:eventoId/lotes` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `404` |
| Lotes | Listar lotes do evento | `GET /eventos/:eventoId/lotes` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Lotes | Atualizar lote | `PATCH /lotes/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404`, `409` |
| Inscrições | Listar minhas inscrições | `GET /inscricoes/minhas` | `PARTICIPANTE` | `200` | `401`, `403` |
| Inscrições | Cadastrar inscrição | `POST /inscricoes` | `ORGANIZADOR` | `201` | `400`, `401`, `403`, `404`, `409` |
| Inscrições | Listar/buscar inscrições do evento | `GET /inscricoes?eventoId=&busca=` | `ORGANIZADOR`, `RECEPCIONISTA` | `200` | `400`, `401`, `403`, `404` |
| Inscrições | Consultar inscrição | `GET /inscricoes/:id` | `ORGANIZADOR` | `200` | `400`, `401`, `403`, `404` |
| Check-in | Registrar check-in | `POST /inscricoes/:id/checkin` | `RECEPCIONISTA` | `200` | `400`, `401`, `403`, `404`, `409`, `500` |
| Check-in | Contagem de presença do evento | `GET /eventos/:eventoId/contagem` | `ORGANIZADOR`, `RECEPCIONISTA` | `200` | `400`, `401`, `403`, `404` |
| Demo | Ingressos do participante | `GET /inscricoes/demo/participante` | Demo sem JWT | `200` | `403` |
| Demo | Buscar inscrições do evento | `GET /inscricoes/demo/evento/:eventoId?busca=` | Demo sem JWT | `200` | `400`, `403`, `404` |
| Demo | Check-in | `POST /inscricoes/demo/:id/checkin` | Demo sem JWT | `200` | `400`, `403`, `404`, `409`, `500` |
| Demo | Contagem | `GET /eventos/demo/:eventoId/contagem` | Demo sem JWT | `200` | `400`, `403`, `404` |
| Infra | Rota raiz | `GET /` | Público | `200` | — |

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

As listagens funcionais retornam arrays JSON diretos (sem envelope de paginação `page`/`limit` nesta versão do MVP). Todas as datas trafegam em ISO 8601 UTC; a formatação para o fuso local fica a cargo de cada cliente.

---

## 2. Autenticação

### 2.1 Estratégia

A API utiliza autenticação via **JWT (JSON Web Token)** com `JwtAuthGuard` e controle de perfis com `RolesGuard` e `@Roles(...)`.

As requisições protegidas devem enviar:

```http
Authorization: Bearer <token>
```

A validade do token é de 1 hora, assinado com `JWT_SECRET`. As senhas são armazenadas como hash (`senhaHash`) com `scrypt` do Node.js e sal aleatório; comparação com `timingSafeEqual`. Não há endpoint de refresh token nesta versão.

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

Resposta `201`: `{"mensagem":"Conta criada com sucesso.","usuario":{"id":1,"nome":"Ana Organizador","email":"ana@exemplo.com","tipo":"ORGANIZADOR"}}`. O perfil é fixado como `ORGANIZADOR`, sem campo `tipo` no DTO. E-mail normalizado no registro; no login o backend pesquisa o e-mail exatamente como recebido.

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
| Web (Next.js) | Cookie `HttpOnly` | Completa | O servidor Next.js envia o token no cabeçalho `Authorization`; cookie `token`, `HttpOnly`, `SameSite=Lax`, `maxAge=3600`, `Secure` em produção. |
| Mobile (Flutter) | Login simulado (sem token JWT) | Simulada | Conforme orientação docente, o app permite escolher o perfil (participante ou recepcionista) sem autenticação real e consome `GET /eventos` e quatro rotas demo descritas na seção 3.6. |

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
- `POST /eventos` (`ORGANIZADOR`): cria evento (`nome` e `local` strings não vazias, `descricao` string opcional, `data` ISO 8601). O `organizadorId` é extraído do JWT. Retorna `201`.
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
- `GET /usuarios`: retorna todos os usuários (id, nome, email, tipo, criadoEm), sem autenticação. `GET /usuarios/:id`, `PATCH /usuarios/:id` e `DELETE /usuarios/:id` não executam CRUD: retornam strings `This action returns/updates/removes a #<id> usuario` (respectivamente). O PATCH aplica o DTO parcial; não há consulta, alteração ou exclusão no banco. Não são rotas administrativas prontas para produção.
- Cadastro de participante/recepcionista: corpo `{ "nome": "Nome", "email": "pessoa@exemplo.com", "senha": "senha123" }`, nome não vazio, e-mail válido e senha com mínimo de 6 caracteres; perfil fixado pelo endpoint. Duplicidade de e-mail retorna `409`. A criação devolve id, nome, email, tipo, criadoEm; a listagem de participantes devolve id, nome e email em ordem alfabética.

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
- `PATCH /lotes/:id`: atualiza parcialmente os dados de um lote existente (`nome`, `quantidade`, `inicio`, `fim`). Retorna `200`. A quantidade é inteira ≥ 1, o nome é não vazio, datas ISO 8601 e início deve ser anterior ao fim (`400`); redução abaixo do total de inscrições ativas retorna `409`. A listagem é ordenada por `inicio`.

---

### 3.4 Inscrição (`/inscricoes`)

Representação:

```json
{
  "id": 10,
  "codigo": "EVT-974B1F03C340",
  "status": "ATIVA",
  "criadoEm": "2026-11-10T14:20:00.000Z",
  "participanteId": 2,
  "eventoId": 1,
  "loteId": 1
}
```

Valores possíveis de `status`: `ATIVA`, `CANCELADA`, `LISTA_ESPERA`.

- `GET /inscricoes/minhas` (`PARTICIPANTE`): retorna as inscrições do participante autenticado.
- `POST /inscricoes` (`ORGANIZADOR`): cria uma inscrição vinculada a participante, evento e lote. Corpo: `{ "participanteId": 2, "eventoId": 1, "loteId": 1 }` (inteiros positivos). O servidor gera o `codigo` no formato `EVT-` seguido de 12 caracteres hexadecimais maiúsculos e define o `status` como `ATIVA` ou `LISTA_ESPERA`. Evento inexistente ou de outro organizador e participante inexistente/com perfil incorreto resultam em `404`; lote incompatível ou período inválido em `400`. Retorna `201`.
- `GET /inscricoes?eventoId=<id>&busca=<texto>` (`ORGANIZADOR`, `RECEPCIONISTA`): lista as inscrições de um evento (`eventoId` obrigatório numérico), permitindo filtro opcional pelo parâmetro `busca` (nome do participante ou código da inscrição).
- `GET /inscricoes/:id` (`ORGANIZADOR`): consulta os detalhes de uma inscrição específica pertencente ao organizador; retorna `404` se inexistente ou de outro organizador.

---

### 3.5 Check-in e Contagem (`/inscricoes/:id/checkin` e `/eventos/:eventoId/contagem`)

- `POST /inscricoes/:id/checkin` (`RECEPCIONISTA`): registra a entrada do participante para a inscrição informada, associando automaticamente o `recepcionistaId` do usuário autenticado. Retorna `200 OK` com `inscricaoId`, `codigo`, `realizadoEm` e `jaRealizado` (booleano). Inscrição inexistente: `404`; status diferente de `ATIVA`: `409`. Repetição válida: `200`, `jaRealizado: true`, preservando o horário original.
- `GET /eventos/:eventoId/contagem` (`ORGANIZADOR`, `RECEPCIONISTA`): retorna `{ "eventoId": 1, "totalInscricoes": 12, "totalInscritos": 10, "totalPresentes": 6, "totalNaoPresentes": 4, "totalListaEspera": 2 }`. `totalInscricoes` inclui todos os status; os três totais inscritos/presentes/não presentes consideram somente `ATIVA`; `totalListaEspera` conta `LISTA_ESPERA`. Evento inexistente ou de outro organizador (quando perfil organizador): `404`.

---

### 3.6 Endpoints de demonstração mobile (sem JWT)

Para habilitar a demonstração mobile, configure também `NODE_ENV=development` e `MOBILE_DEMO=true` no `.env` do backend (o exemplo versionado mantém a demonstração desabilitada). As rotas usam o participante de ID **4** e o recepcionista de ID **9**; não há seed automatizado no ZIP. Antes de demonstrar os ingressos e o check-in, confirme no Prisma Studio que esses registros existem, possuem os perfis correspondentes e que há evento, lote e inscrição vinculados ao participante. Em um banco novo, crie dados pelo web/API ou Prisma Studio e garanta os IDs esperados; se forem diferentes, será necessário ajustar os IDs de demonstração no código. Não habilite essas rotas em produção.

| Método e rota | Implementação / retorno |
|---|---|
| `GET /inscricoes/demo/participante` | `findMinhas(4)`: array de inscrições do participante fixo. |
| `GET /inscricoes/demo/evento/:eventoId?busca=<texto>` | `findAll(eventoId, 9, 'RECEPCIONISTA', busca)`: lista com dados do participante, lote e check-in. |
| `POST /inscricoes/demo/:id/checkin` | `registrar(id, 9)`, sem corpo: mesmo retorno e regras da rota protegida. |
| `GET /eventos/demo/:eventoId/contagem` | `contar(eventoId, 9, 'RECEPCIONISTA')`: mesmos totais da rota protegida. |

As duas rotas demo de inscrições exigem `MOBILE_DEMO === 'true'` **e** `NODE_ENV === 'development'`; as duas rotas de check-in/contagem exigem `MOBILE_DEMO === 'true'` **e** `NODE_ENV !== 'production'`. A recomendação comum é usar exclusivamente `development`. Não há verificação de identidade ou associação recepcionista-evento nas rotas demo; o ID 9 precisa existir para a FK do check-in. O participante do app não cria inscrição. O backend protegido continua exigindo JWT e perfil. Não há endpoint para emissão de QR, cancelamento de inscrição ou promoção de lista de espera.

### 3.7 Formato de retorno das inscrições por operação

Além dos campos escalares da inscrição, `POST /inscricoes` inclui `participante` (`id`, `nome`, `email`) e `lote` (`id`, `nome`, `quantidade`). A listagem por evento inclui esses objetos e `checkIn` (`id`, `realizadoEm` ou `null`), ordenada por `criadoEm` decrescente. `GET /inscricoes/:id` acrescenta `evento` (`id`, `nome`) e `checkIn` completo. A consulta de ingressos (`minhas` e demo participante) inclui `evento` (`id`, `nome`, `descricao`, `local`, `data`), `lote` (`id`, `nome`, `inicio`, `fim`) e `checkIn` (`realizadoEm` ou `null`), em ordem decrescente de criação. A busca por código ou nome usa `contains` sem distinção de maiúsculas/minúsculas.

### 3.8 Autorização efetiva e erros

Os guards verificam token e papel (`401`/`403`). Quando o organizador tenta acessar um evento, lote, inscrição ou contagem que não lhe pertence, o serviço retorna `404`, não `403`. O recepcionista autenticado pode consultar e registrar check-in em qualquer evento; não há associação explícita a um evento no modelo. Os endpoints públicos de usuários permanecem uma limitação de segurança. `GET /` responde texto `Hello World!` (não JSON).

## 4. Endpoints de regra de negócio

### 4.1 Exclusão protegida de eventos (`DELETE /eventos/:id`)

Antes de excluir um evento, o backend verifica se ele pertence ao organizador autenticado e se possui lotes ou inscrições vinculados. Caso possua vínculos, retorna `409 Conflict`.

### 4.2 Controle de vagas e lista de espera (`POST /inscricoes`)

O backend gera automaticamente o `codigo` único da inscrição (campos extras são rejeitados com `400`) e conta as inscrições ativas no lote dentro de uma transação `Serializable`. Verifica período de validade e vínculo do lote com evento. Em erro de concorrência Prisma `P2034`, tenta até três vezes, retornando `409` se esgotadas. Quando o limite `quantidade` do lote é atingido, a inscrição é registrada com status `LISTA_ESPERA`.

### 4.3 Registro e idempotência de check-in (`POST /inscricoes/:id/checkin`)

- Inscrições com status `LISTA_ESPERA` ou `CANCELADA` são impedidas de realizar check-in.
- A relação `CheckIn.inscricaoId` possui restrição `@unique` no banco de dados, garantindo no máximo um check-in por inscrição. Tentativas repetidas não duplicam o registro nem alteram a contagem de presentes: `createMany({ skipDuplicates: true })` seguido da consulta do registro existente. Se não for possível confirmar o registro, retorna `500`.

---

## 5. Diferenças de consumo entre os clientes

| Fluxo / Endpoint | Cliente Web (Next.js) | App Mobile (Flutter) | Motivo |
|---|---|---|---|
| Autenticação | Login e cadastro reais (`POST /auth/login`, `POST /auth/registro`) com cookie `HttpOnly`. | Login simulado (seleção de perfil Participante ou Recepcionista). | Orientação da disciplina para priorizar os fluxos principais do mobile no prazo do MVP. |
| Eventos | Consome `GET /eventos/meus`, `POST/PATCH/DELETE /eventos` para gestão completa. | Consome `GET /eventos`; detalhes usam o objeto já retornado pela listagem. | Separação entre fluxo administrativo (web) e consulta (mobile). |
| Inscrições e Check-in | Gerencia inscrições e acompanha presença no painel administrativo. | Participante consulta código textual; recepcionista busca nome/código, registra check-in e consulta contagem pelas rotas demo. | Mobilidade na recepção; câmera/QR real não implementados. |

---

## 6. Como verificar o contrato

- [ ] Reexecutar compilação do backend e frontend no ambiente configurado; não executada nesta revisão.
- [ ] Reexecutar testes manuais integrados em banco de desenvolvimento. Existem registros históricos de validação, mas não foram reexecutados nesta revisão.
- [x] Conferência estática dos DTOs, controllers, services e consumidores com este contrato.
- [x] Identificação dos testes Vitest e Flutter no código (execução não confirmada).
- [ ] Swagger habilitado no backend (não adotado no MVP; contrato mantido neste documento).

---

## 7. Histórico de revisões

| Versão | Data | Alteração | Impacto nos clientes |
|---|---|---|---|
| 1.0 | 03/09/2026 | Criação inicial do contrato da API no repositório. | Definição inicial da interface entre backend e clientes. |
| 1.1 | 21/10/2026 | Revisão do contrato com autenticação JWT e CRUD de eventos. | Web integrado ao CRUD de eventos e autenticação. |
| 2.0 | 25/11/2026 | Documentação completa de todos os módulos implementados (`auth/registro`, `usuarios`, `eventos/meus`, `lotes`, `inscricoes`, `checkins`) e registro da estratégia simulada no mobile. | Alinhamento final entre backend, cliente web e app mobile Flutter. |
| 2.1 | 26/11/2026 | Revisão estática dos controllers, services e DTOs; inclusão das quatro rotas demo, respostas reais, stubs e concorrência. | Contrato ajustado ao ZIP entregue. |
