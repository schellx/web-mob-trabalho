# Relatório Técnico de Desenvolvimento

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Eventoon |
| **Grupo** | A |
| **Integrantes** | Maria Eduarda Schell (`schellx`), João Vitor Dalla Lana (`Jao22x`) |
| **Repositório** | `https://github.com/schellx/web-mob-trabalho.git` |
| **Vídeo de apresentação** | (https://drive.google.com/file/d/1sxEOyw_qDrLlCXINLT02DOWz3VVNAdBU/view?usp=sharing) |

---

## 1. Ambiente de desenvolvimento

### 1.1 Ferramentas e versões

| Ferramenta | Versão | Quem |
|---|---|---|
| Node.js | 24.22.0 (versão informada pelo grupo) | João e Maria |
| Flutter SDK / Dart | Flutter >=3.47 / Dart >=3.14 e <4.0 (mínimos do lockfile; versão instalada não confirmada) | João e Maria |
| Next.js / React | 16.3.8 / 19.2.8 (`frontend/package.json`) | João e Maria |
| PostgreSQL | 18 | João e Maria |
| Docker | Docker Desktop | João |
| Sistema operacional | Windows 10 | João |
| Sistema operacional | Windows 11 | Maria |

**Como o banco foi provisionado:** (X) Docker Compose · ( ) PostgreSQL instalado na máquina · ( ) serviço hospedado

### 1.2 Divergências em relação ao README

| Componente | O que divergiu | Como foi resolvido |
|---|---|---|
| Backend e autenticação | A variável `JWT_SECRET` não estava configurada no ambiente local. | A variável foi adicionada ao arquivo `.env` local para permitir o funcionamento da autenticação. |
| Ambiente de desenvolvimento | Após reiniciar o computador, os comandos `node` e `npm` não eram reconhecidos no terminal. | As variáveis de ambiente (PATH) foram ajustadas e as versões instaladas foram verificadas. |
| Versões do backend | O projeto evoluiu para NestJS 12 (`^12.0.1`) e Node 24, em vez de NestJS 11 / Node 22 citados no planejamento inicial. | Adotado Prisma 7 (`@prisma/adapter-pg`) e atualizada a documentação final. |

### 1.3 Endereços de rede entre os componentes

| Origem | URL da API usada | Observação |
|---|---|---|
| Web (servidor Next.js) | `http://localhost:3000` | `API_URL` nas Server Actions; navegador acessa Next.js na porta 3001. |
| Mobile (emulador Android) | `http://10.0.2.2:3000` | `localhost` dentro do emulador aponta para o próprio emulador, não para a máquina host. |
| Mobile (dispositivo físico) | `http://<IP-LOCAL>:3000` | Requer ajuste de `EventoService.baseUrl`; usar a mesma rede Wi-Fi. |

### 1.4 Preparação do ambiente do zero

Para subir o projeto em uma máquina limpa, execute os passos abaixo na raiz do repositório:

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/schellx/web-mob-trabalho.git
   cd frontend-mob-trabalho
   ```

2. **Subir o banco de dados PostgreSQL (Docker):**
   ```bash
   docker compose up -d
   ```

3. **Configurar variáveis de ambiente do backend (`backend/.env`):**
   Crie o arquivo `.env` dentro da pasta `backend/` definindo a conexão com o PostgreSQL e o segredo do JWT:
   ```env
   DATABASE_URL="postgresql://app:app@localhost:5432/appdb?schema=public"
   JWT_SECRET="sua-chave-secreta-local"
    NODE_ENV=development
    MOBILE_DEMO=true
   ```

4. **Instalar dependências e preparar o banco (Prisma):**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   cd ..
   ```

5. **Instalar dependências do cliente web e do app mobile:**
   ```bash
   cd frontend && npm install && cd ..
   cd mobile && flutter pub get && cd ..
   ```

**Configuração do cliente web:** use `frontend/.env.local` com `API_URL=http://localhost:3000` (opcional quando se usa o padrão).

Para habilitar a demonstração mobile, configure também `NODE_ENV=development` e `MOBILE_DEMO=true` no `.env` do backend (o exemplo versionado mantém a demonstração desabilitada). As rotas usam o participante de ID **4** e o recepcionista de ID **9**; não há seed automatizado no ZIP. Antes de demonstrar os ingressos e o check-in, confirme no Prisma Studio que esses registros existem, possuem os perfis correspondentes e que há evento, lote e inscrição vinculados ao participante. Em um banco novo, crie dados pelo web/API ou Prisma Studio e garanta os IDs esperados; se forem diferentes, será necessário ajustar os IDs de demonstração no código. Não habilite essas rotas em produção.

## Rodando os três ao mesmo tempo

Precisa de três terminais, com o banco já no ar:

```bash
docker compose up -d                       # banco, se usar Docker
cd backend && npm run start:dev            # terminal 1 — API em :3000
cd frontend     && npm run dev -- -p 3001       # terminal 2 — web em :3001
cd mobile  && flutter run                  # terminal 3 — app no emulador
```

Se o banco estiver instalado na máquina ou hospedado, pule a primeira linha — basta que ele esteja no ar antes de subir a API.

---

## 2. Uso de Inteligência Artificial

### 2.1 Ferramentas utilizadas

| Ferramenta | Versão / Plano | Quem usou | Em que componente |
|---|---|---|---|
| ChatGPT | Plano gratuito | João / Maria | Backend, autenticação, integração web, Flutter e correção de erros |
| Gemini | Plano padrão | João / Maria | Revisão e consolidação da documentação técnica final |

### 2.2 Atenção específica desta stack

| Situação | Ocorreu? | Onde e como foi corrigido |
|---|---|---|
| Código gerado com Next.js Pages Router (`getServerSideProps`, `pages/api/`) | Sim | O frontend utiliza App Router. Sugestões baseadas no Pages Router foram adaptadas para Server/Client Components e cookies HttpOnly no App Router. |
| Prisma sem o adaptador `@prisma/adapter-pg`, ou importando de `@prisma/client` em vez do caminho gerado | Sim | O projeto usa Prisma 7 com `output = "../generated/prisma"` e `@prisma/adapter-pg`. Os imports sugeridos pela IA para `@prisma/client` precisaram ser ajustados manualmente para o cliente gerado. |
| Decorators ou módulos de versão antiga do NestJS | Não | A implementação utilizou controladores, serviços, DTOs e guards compatíveis com NestJS 12, validados via `npm run build`, segundo o registro do grupo. |
| Pacotes Flutter descontinuados ou incompatíveis com Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0) | Sim (pontual) | O relato do grupo menciona dificuldades com pacotes QR; na entrega, não há dependência de câmera/QR e o recurso ficou ilustrativo. O `pubspec.yaml` exige Dart ^3.14.0 e o lockfile indica Flutter >=3.47.0. |

### 2.3 Evidências de uso

#### Etapa 2 — Backend

- **Quem conduziu:** Maria Eduarda Schell
- **Ferramenta e data:** ChatGPT — Outubro/2026
- **Objetivo da tarefa:** Estruturar a autenticação JWT com `Passport`, `JwtAuthGuard`, `RolesGuard` e hash de senha no NestJS.
- **Prompt utilizado:**
  ```
  Como implementar autenticação JWT com controle de perfis (ORGANIZADOR, RECEPCIONISTA, PARTICIPANTE) usando Guards e decorator customizado @Roles no NestJS com Prisma?
  ```
- **Trecho aproveitado:**
  ```ts
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR')
  ```
- **Análise crítica:** A estrutura de guards e decorators sugerida estava correta e bem desacoplada, mas o exemplo inicial não associava automaticamente o `organizadorId` a partir de `req.user.id` e deixava o campo aberto no DTO de criação de evento, o que seria uma falha de segurança.
- **A resposta usava versão desatualizada da stack?** Parcialmente — o exemplo usava import padrão do Prisma sem o caminho gerado do Prisma 7.
- **Correções feitas manualmente e por quê:** Removemos `organizadorId` do DTO de criação e passamos a obtê-lo exclusivamente de `requisicao.user.id`. Também corrigimos o `await` na consulta antes da exclusão de eventos com vínculos.
- **Evidência no repositório:** Commit `c8cc42a` e `1955a4c`.
- **Como validou:** Compilação (`npm run build`) e testes manuais das rotas com e sem token (`401` e `403`).

---

#### Etapa 3 — Cliente web

- **Quem conduziu:** João Vitor Dalla Lana e Maria Eduarda Schell
- **Ferramenta e data:** ChatGPT — Outubro/2026
- **Objetivo da tarefa:** Integrar o login do Next.js (App Router) com a API NestJS armazenando o JWT em cookie `HttpOnly` e construindo o CRUD de eventos e gestão de inscrições.
- **Prompt utilizado:**
  ```
  No Next.js 15 App Router, como salvar o access_token retornado por uma API NestJS em um cookie HttpOnly e enviar esse token no header Authorization nas requisições autenticadas?
  ```
- **Trecho aproveitado:**
  ```ts
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  ```
- **Análise crítica:** A abordagem com cookie `HttpOnly` evita exposição do token ao JavaScript do navegador (XSS). Contudo, alguns trechos sugeridos misturavam APIs antigas de roteamento com o App Router.
- **A resposta usava versão desatualizada da stack?** Sim — sugeriu padrões do Pages Router em partes auxiliares.
- **Correções feitas manualmente e por quê:** Adaptamos toda a leitura/escrita de cookies e chamadas HTTP para a estrutura real de `app/` no Next.js 16.3.8 e ajustamos os formulários de cadastro, edição e listagem.
- **Evidência no repositório:** Commits `a4c64bf`, `cedb8ab` e `1955a4c`.
- **Como validou:** Build de produção do frontend e navegação completa nos fluxos de login, cadastro, criação, edição e exclusão de eventos.

---

#### Etapa 4 — App mobile

- **Quem conduziu:** Maria Eduarda Schell e João Vitor Dalla Lana
- **Ferramenta e data:** ChatGPT — Novembro/2026
- **Objetivo da tarefa:** Estruturar os fluxos mobile de login simulado, eventos, ingressos e credenciamento. A leitura de QR foi uma intenção de desenvolvimento, não um recurso concluído.
- **Prompt utilizado:**
  ```
  Como estruturar em Flutter 3 uma navegação com escolha de perfil (Participante e Recepcionista), onde o participante vê eventos e o código do ingresso e o recepcionista abre um leitor de QR Code?
  ```
- **Trecho aproveitado:** Estrutura de navegação entre telas com `Navigator.push`, gerenciamento local com `setState` e separação da camada de serviço HTTP.
- **Análise crítica:** O esqueleto ajudou a organizar as telas rapidamente, mas precisou ser adaptado ao contrato real da API Eventoon. A câmera foi prevista, porém não há implementação de leitura nem permissão de câmera no manifesto Android final.
- **A resposta usava versão desatualizada da stack?** Sim — segundo o relato, sugeriu um pacote antigo de leitura de QR Code com conflito de dependências; a versão do pacote e a tentativa não estão documentadas no ZIP.
- **Correções feitas manualmente e por quê:** O relato registra dificuldades com dependências; o código entregue usa `http` para acessar a API, código textual e busca por nome/código no lugar do QR real. A URL base foi ajustada para o emulador Android.
- **Evidência no repositório:** Commits da pasta mobile (Etapa 4).
- **Como validou:** Validação manual relatada pelo grupo; o ZIP também possui testes de widget de navegação. A revisão estática não comprova a execução dos testes ou da câmera.

---

### 2.4 Reflexão sobre o uso de IA

A IA auxiliou no desenvolvimento do backend, do frontend web e do aplicativo mobile, principalmente na implementação da autenticação, na integração entre os componentes, na correção de erros e na organização da documentação. Ao longo do trabalho, foi necessário conferir todas as sugestões com a estrutura real do projeto, corrigir incompatibilidades de versão (como Prisma 7, Next.js App Router e Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0)) e executar testes práticos para identificar problemas que não ficavam evidentes apenas pela leitura do código. A experiência mostrou que a IA acelera o desenvolvimento, mas exige validação crítica constante em arquitetura, segurança e aderência ao contrato.

---

## 3. Diário por etapa

Períodos, autoria, commits e dificuldades são registros declarados nos novos documentos do grupo. A revisão final não comprova que cada entrada foi redigida durante a sprint; o ZIP não inclui `.git` nem logs de execução. Os fatos técnicos foram corrigidos conforme o código.

### Etapa 0 — Concepção

**Período:** de 03/09/2026 a 24/09/2026 · **Redigido por:** Maria e João

**O que foi feito:** Definição do problema, personas (Organizador, Recepcionista e Participante), requisitos funcionais e não funcionais, regras de negócio, modelo de dados inicial e recorte web/mobile nos documentos `visao.md` e `prd.md`.

**Como o tema foi escolhido, e o que foi descartado no caminho:** Escolhemos o credenciamento e check-in de eventos (Eventoon) por ter uma divisão natural entre o administrativo no web e o uso presencial no celular. Descartamos módulos financeiros (pagamento/venda de ingressos) e integrações com hardware externo para manter o foco no MVP.

**Dificuldades:** Delimitar um escopo realista para uma dupla que cobrisse backend, web e mobile sem perder qualidade.

---

### Etapa 1 — Contrato e fundação

**Período:** de 24/09/2026 a 30/09/2026 · **Redigido por:** Maria e João

**O que foi feito:**

| Frente | O que foi feito | Por quem |
|---|---|---|
| Modelo de dados | Criação do `schema.prisma` com `Usuario`, `Evento`, `Lote`, `Inscricao` e `CheckIn`. | Maria |
| Contrato da API | Definição inicial dos endpoints e convenções em `docs/contrato-api.md`. | Maria e João |
| Projeto do backend e banco | Setup do NestJS, Prisma 7 e container PostgreSQL 18 via Docker Compose. | Maria e João |

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Lista de espera como enum `StatusInscricao` | Criar tabela separada `ListaEspera` | Simplifica consultas e transição de status no MVP. | Requer controle cuidadoso da contagem de vagas ativas no serviço de inscrições. |
| IDs inteiros autoincrementais | UUID / CUID | Rotas REST mais legíveis e modelo relacional direto. | IDs sequenciais exigem validação de posse (`organizadorId`) em todas as rotas privadas. |

**Dificuldades:** Configuração inicial do PostgreSQL no Docker e variáveis de ambiente locais.

**O que ficou para a próxima etapa:** Implementação completa da autenticação e dos módulos de domínio na API.

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** de 01/10/2026 a 15/10/2026 · **Redigido por:** Maria

**O que foi implementado:**
- Módulo `AuthModule` com registro (`POST /auth/registro`), login (`POST /auth/login`), consulta de perfil (`GET /auth/perfil`), hash de senha, `JwtAuthGuard` e `RolesGuard`.
- Módulo `EventosModule` com CRUD completo, rotas públicas (`GET /eventos`, `GET /eventos/:id`) e rotas restritas ao organizador (`GET /eventos/meus`, `POST`, `PATCH`, `DELETE`).
- Módulos `UsuariosModule`, `LotesModule`, `InscricoesModule` e `CheckinsModule` estruturados com regras de negócio no servidor.

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Separar `GET /eventos` (público) e `GET /eventos/meus` (organizador) | Proteger todas as listagens com JWT | Permite que o app mobile (com login simulado) e páginas públicas listem eventos sem quebrar a segurança administrativa do organizador. | Exige cuidado para não expor dados sensíveis na listagem pública. |
| Validação de vínculos antes da exclusão de evento | Exclusão em cascata (`ON DELETE CASCADE`) | Evita perda acidental de lotes e inscrições já realizados. | Retorna `409 Conflict` e exige tratamento de mensagem no frontend. |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| `POST /auth/registro` | Adicionado endpoint de cadastro de conta. | João | Sim (v2.0) |
| `GET /eventos/meus` e `GET /eventos` | Separação entre listagem administrativa do organizador e listagem pública de eventos. | João | Sim (v2.0) |
| `lotes`, `inscricoes`, `checkins`, `usuarios` | Inclusão de todos os endpoints implementados nos controllers. | João | Sim (v2.0) |

**Dificuldades:** Configuração do `JWT_SECRET`, regeneração do Prisma Client após mudanças no schema e ajuste do `await` na verificação de exclusão de eventos.

**O que ficou para a próxima etapa:** Integração completa do cliente web Next.js com a API.

---

### Etapa 3 — Cliente web · Checkpoint 2

**Período:** de 15/10/2026 a 25/10/2026 · **Redigido por:** Maria e João

**O que foi implementado:**
- Integração entre o frontend Next.js (App Router) e o backend NestJS.
- Fluxos do cliente web: login/cadastro/logout, listagem e detalhes dos próprios eventos, criação/edição/exclusão protegida, cadastro e edição de lotes, cadastro de participantes e recepcionistas, criação/listagem de inscrições e relatório de comparecimento.
- Armazenamento do token JWT em cookie `HttpOnly` no Next.js, enviando o cabeçalho `Authorization: Bearer <token>` nas chamadas autenticadas.
- Proteção das operações conforme os perfis de acesso e associação automática de novos eventos ao organizador autenticado.
- Melhorias visuais e testes manuais de autenticação e CRUD, além de builds sem erro no backend e frontend, conforme relato histórico do grupo (não reexecutados nesta revisão).

**Decisões técnicas:**
- Manter toda a lógica de validação de permissões e regras de negócio no backend NestJS, utilizando o Next.js apenas para apresentação, sessão em cookie `HttpOnly` e validação básica de formulários.

**Dificuldades:**
- Incompatibilidade inicial entre o `organizadorId` esperado pelo Prisma e o formulário web, resolvida obtendo o ID diretamente do JWT no backend.
- Ajustes no ambiente local (PostgreSQL indisponível e regeneração do Prisma Client).

**Evidências no repositório:**
- `1955a4c` — Integração de autenticação e gerenciamento de eventos
- `cedb8ab` — Conclusão do CRUD de eventos e melhorias visuais
- `c8cc42a` — Autenticação JWT e hash de senha
- `a4c64bf` — Formulário de cadastro de eventos integrado à API
- `35cf072` — Primeira página frontend com eventos de teste

**O que ficou para a próxima etapa:** Desenvolvimento e integração do aplicativo mobile em Flutter.

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de 26/10/2026 a 20/11/2026 · **Redigido por:** Maria e João

**O que foi implementado:**
- Tela de login simulado em Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0) permitindo escolher entre os perfis **Participante** e **Recepcionista** (conforme orientação do professor de não exigir autenticação JWT real no mobile).
- **Fluxo Participante:** listagem e detalhes de eventos disponíveis; consulta de ingressos existentes com código textual e QR ilustrativo. Não há tela funcional de autoinscrição.
- **Fluxo Recepcionista:** seleção de evento, busca de inscrições por nome/código, check-in por botão e atualização da contagem. `TelaLeitorQR` é um placeholder, sem câmera.

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Login simulado (falso) por escolha de perfil | Autenticação JWT completa com armazenamento seguro (`flutter_secure_storage`) | Orientação explícita do professor para focar nos fluxos principais de credenciamento dentro do prazo. | O app não gerencia expiração de token; a API mantém a proteção JWT intacta para rotas administrativas. |
| Gerência de estado com `setState` | Provider / Riverpod / Bloc | Poucas telas e fluxos bem isolados; reduz complexidade e curva de aprendizado. | Em projetos maiores exigiria migração para um gerenciador de estado reativo. |

**Dificuldades:** O grupo relatou dificuldade com pacotes QR e acesso de rede (`10.0.2.2` no Android). O código final confirma integração HTTP e substituição do QR real por busca textual; não há registro suficiente para detalhar tentativas de instalação específicas.

**O que ficou para a próxima etapa:** Ajustes finais de integração entre os três componentes e finalização da documentação.

---

### Etapa 5 — Integração e fechamento

**Período:** de 21/11/2026 a 25/11/2026 · **Redigido por:** Maria e João

**O que foi ajustado para os três componentes conversarem:**
- Alinhamento das URLs base e formatos JSON entre backend NestJS, cliente web Next.js e app mobile Flutter.
- Integração dos fluxos de cadastro de evento e inscrição no web, consulta de eventos e ingresso no mobile, busca, check-in e contagem. A existência dos fluxos foi conferida estaticamente; não se afirma execução E2E integral nesta revisão.
- Atualização final de todos os documentos em `docs/` (`visao.md`, `prd.md`, `contrato-api.md`, `equipe.md` e `relatorio.md`) com revisão posterior de aderência ao código entregue em 26/11/2026.

**Inconsistências encontradas e resolvidas:**
- O contrato da API ainda refletia principalmente os endpoints da Etapa 2 (`auth` e `eventos`). A versão 2.0 consolidou os módulos; a revisão 2.1 documenta as rotas demo, retornos e stubs.
- Divergência nas versões documentadas (NestJS 11 vs. NestJS 12 instalado no `package.json`), corrigida em todos os documentos.

**Dificuldades:** Fechar os últimos ajustes visuais/funcionais simultaneamente com a consolidação completa da documentação no dia da entrega.

---

## 4. Arquitetura — decisões e evolução

### 4.1 Estrutura final

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| Backend | Nenhum | Estrutura modular padrão do NestJS (`auth`, `usuarios`, `eventos`, `lotes`, `inscricoes`, `checkins`, `prisma`). |
| Cliente web | Pasta `frontend/` (não `web/`) | Next.js 16.3.8 com App Router, Server Actions e componentes de cliente/servidor. |
| App mobile | SDK documentado incorretamente na versão anterior | Flutter >=3.47 e Dart ^3.14.0, conforme arquivos de dependências. |

### 4.2 Fronteira entre backend e clientes

Todas as regras críticas — geração do código único da inscrição, controle de lotação do lote e transição para `LISTA_ESPERA`, bloqueio de exclusão de evento com vínculos (`409`), unicidade de check-in e validação de permissões por perfil — foram mantidas exclusivamente nos services e guards do NestJS. Quando surgiu a tentação de enviar `organizadorId` pelo formulário web, a decisão foi corrigir o fluxo para derivar o identificador do JWT no backend.

### 4.3 Nível de autenticação adotado no app mobile

| Aspecto | Registro |
|---|---|
| Nível adotado | **Simulada** (login falso com escolha entre Participante e Recepcionista). |
| Como o app obtém o token | Não utiliza token JWT; a seleção de perfil direciona diretamente para as telas correspondentes, conforme autorizado pelo professor. |
| O que deixou de ser tratado | Expiração de token, armazenamento seguro de sessão e refresh token no mobile. |
| Rotas da API afetadas pela escolha | `GET /eventos` permanece público; o app usa quatro endpoints demo sem JWT, com IDs fixos 4 e 9. Rotas de inscrições demo exigem `NODE_ENV=development`; check-in/contagem demo recusam `production`. Todas exigem `MOBILE_DEMO=true`. As rotas administrativas protegidas mantêm seus guards. |

### 4.4 O que os dois clientes compartilham e o que não

- **Compartilham:** A mesma API REST em NestJS, o formato JSON em português, as datas em ISO 8601 UTC e o modelo de dados único persistido no PostgreSQL via Prisma.
- **Divergem:** O cliente web implementa autenticação JWT completa com cookie `HttpOnly` e foco administrativo (organizadores), enquanto o app mobile utiliza login simulado e foco operacional/presencial (participante exibindo código textual e recepcionista buscando inscrição, registrando check-in e consultando presença).

---

### 4.5 Decisões adicionais identificadas no código final

| Componente | Escolha implementada | Alternativa técnica | Justificativa técnica / consequência |
|---|---|---|---|
| Backend | Transação `Serializable` para criação de inscrição e até 3 tentativas em `P2034` | Contagem e criação fora de transação | Reduz risco de ultrapassar vagas por concorrência; pode devolver `409` após esgotar tentativas. |
| Backend | `CheckIn.inscricaoId @unique` + `createMany(skipDuplicates: true)` | Falhar a cada repetição de check-in | Mantém o horário original e devolve `jaRealizado`, permitindo retentativa sem duplicar presença. |
| Web | Server Actions e cookie `HttpOnly`, chamadas `cache: 'no-store'` e revalidação após alterações | Token acessível ao JavaScript em localStorage e requisição direta do navegador | Reduz exposição do token ao JavaScript; servidor Next encaminha Bearer à API. Não elimina todos os riscos de XSS/CSRF. |
| Mobile | Serviços HTTP com timeout de 15 s, `FutureBuilder`, `setState` e endpoints demo | JWT completo no app e estado global | Recorte demonstrativo autorizado; evita duplicar regras de negócio e permite indicar falhas de rede. IDs fixos e flags exigem preparação do banco. |

As alternativas desta tabela são análise técnica retrospectiva do código, não registro contemporâneo de discussão do grupo.

### 4.6 Limitações técnicas observadas

- O CRUD genérico de usuários por ID é scaffold sem acesso ao banco; `GET /usuarios` não tem guard e expõe dados básicos. A proteção não é global.
- Não existe vínculo recepcionista-evento para limitar o acesso do perfil recepcionista. As rotas demonstrativas são intencionalmente sem token e não servem como segurança de produção.
- Autoinscrição, QR real, cancelamento de inscrição e promoção automática da lista de espera não estão implementados. O mobile mostra `CANCELADA` como lista de espera no cartão da recepção.
- A configuração demo exige dados com IDs fixos e não há seed no ZIP. A URL do mobile é fixa por plataforma (web/Android); dispositivo físico ou iOS exige alteração.
- A interface web usa cookie seguro em produção, mas há tentativas de apagar cookie em páginas/componentes de servidor em respostas 401; o comportamento precisa ser verificado em execução no Next.js.

### 4.7 Testes automatizados implementados e validação

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

## 5. Reflexão final

### 5.1 O que funcionou bem

A separação clara entre API NestJS, cliente web Next.js e app mobile Flutter permitiu trabalhar em paralelo sem acoplamento direto ao banco de dados. A divisão de liderança (Maria no backend, João no web e ambos no Flutter) manteve o projeto avançando de forma constante.

### 5.2 O que faria diferente

Atualizaríamos o `contrato-api.md` imediatamente a cada novo módulo finalizado no backend, em vez de consolidar as mudanças posteriormente, e habilitaríamos Swagger/OpenAPI desde o início para agilizar os testes manuais.

### 5.3 Principais aprendizados

| Componente | Aprendizado |
|---|---|
| Backend | Uso prático de NestJS 12, Prisma 7 com `@prisma/adapter-pg`, guards de autenticação/autorização e proteção de regras de negócio no servidor. |
| Web | Integração do Next.js 16.3.8 App Router com API externa usando cookies `HttpOnly` para proteger o token JWT. |
| Mobile | Construção de fluxos distintos por perfil em Flutter ≥ 3.47 (Dart ≥ 3.14 e < 4.0), exibição de ingresso textual e busca/check-in com integração de rede ao backend local. |
| Integração e processo | Importância do contrato da API atualizado e do controle de ambiente (`.env`, Docker, rede do emulador) para evitar bloqueios entre frentes. |

### 5.4 Autoavaliação

**Nota:** 8,5/10

**Justificativa:**  A entrega contém API NestJS/Prisma, web administrativo e mobile demonstrativo integrado por HTTP. Há testes automatizados de serviços, widget e rota raiz; faltam testes E2E completos e comprovação da execução/percentual de cobertura. Autoinscrição e leitura/geração real de QR Code não foram concluídas, e a documentação anterior ficou defasada durante o desenvolvimento. A dispensa de JWT real no mobile é orientação docente, não uma falha do requisito.

---

## 6. Vídeo de apresentação

| Campo | Valor |
|---|---|
| **Link** | (https://drive.google.com/file/d/1sxEOyw_qDrLlCXINLT02DOWz3VVNAdBU/view?usp=sharing) |
| **Duração** | 9m19s. |
| **Quem fala em cada parte (conforme documento fornecido)** | Maria: arquitetura, backend e parte do mobile · João: cliente web, integração e parte do mobile |

---

## 7. Histórico de revisões

| Versão | Data | Descrição | Quem atualizou |
|---|---|---|---|
| 0.1 | 03/09/2026 | Criação do documento | Maria / João |
| 0.5 | 21/10/2026 | Registro da Etapa 3 (Cliente web) e ambiente | Maria |
| 1.0 | 25/11/2026 | Versão final completa para entrega (Etapas 0 a 5, guia de execução do zero, mobile Flutter e reflexão final) | Maria / João |
| 1.1 | 26/11/2026 | Revisão de aderência ao código, testes existentes, configuração demo, link de vídeo e limitações. | Revisão documental com base no ZIP |
