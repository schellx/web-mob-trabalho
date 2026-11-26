# Relatório Técnico de Desenvolvimento

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Eventoon |
| **Grupo** | A |
| **Integrantes** | Maria Eduarda Schell (`schellx`), João Vitor Dalla Lana (`Jao22x`) |
| **Repositório** | `https://github.com/schellx/web-mob-trabalho.git` |
| **Vídeo de apresentação** | _(inserir link após gravação/upload)_ |

---

## 1. Ambiente de desenvolvimento

### 1.1 Ferramentas e versões

| Ferramenta | Versão | Quem |
|---|---|---|
| Node.js | 24.22.0 | João e Maria |
| Flutter SDK | 3.5 | João e Maria |
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
| Versões do backend | O projeto evoluiu para NestJS 12 (`^12.0.1`) e Node 24, em vez de NestJS 11 / Node 22 citados no planejamento inicial. | Mantida a compatibilidade total com Prisma 7 (`@prisma/adapter-pg`) e atualizada a documentação final. |

### 1.3 Endereços de rede entre os componentes

| Origem | URL da API usada | Observação |
|---|---|---|
| Web (navegador) | `http://localhost:3000` | Endereço local da API NestJS utilizada nos testes. |
| Mobile (emulador Android) | `http://10.0.2.2:3000` | `localhost` dentro do emulador aponta para o próprio emulador, não para a máquina host. |
| Mobile (dispositivo físico) | `http://<IP-LOCAL>:3000` | Endereço IP da máquina na mesma rede Wi-Fi local. |

### 1.4 Preparação do ambiente do zero

Para subir o projeto em uma máquina limpa, execute os passos abaixo na raiz do repositório:

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/schellx/web-mob-trabalho.git
   cd web-mob-trabalho
   ```

2. **Subir o banco de dados PostgreSQL (Docker):**
   ```bash
   docker compose up -d
   ```

3. **Configurar variáveis de ambiente do backend (`backend/.env`):**
   Crie o arquivo `.env` dentro da pasta `backend/` definindo a conexão com o PostgreSQL e o segredo do JWT:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventoon?schema=public"
   JWT_SECRET="sua-chave-secreta-local"
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
   cd web && npm install && cd ..
   cd mobile && flutter pub get && cd ..
   ```

## Rodando os três ao mesmo tempo

Precisa de três terminais, com o banco já no ar:

```bash
docker compose up -d                       # banco, se usar Docker
cd backend && npm run start:dev            # terminal 1 — API em :3000
cd web     && npm run dev -- -p 3001       # terminal 2 — web em :3001
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
| Decorators ou módulos de versão antiga do NestJS | Não | A implementação utilizou controladores, serviços, DTOs e guards compatíveis com NestJS 12, validados via `npm run build`. |
| Pacotes Flutter descontinuados ou incompatíveis com Flutter 3.5 | Sim (pontual) | Ao estruturar a leitura de QR Code e widgets no Flutter 3.5, foi necessário conferir a compatibilidade das dependências no `pubspec.yaml` e ajustar chamadas depreciadas. |

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
- **Correções feitas manualmente e por quê:** Adaptamos toda a leitura/escrita de cookies e chamadas HTTP para a estrutura real de `app/` no Next.js 15 e ajustamos os formulários de cadastro, edição e listagem.
- **Evidência no repositório:** Commits `a4c64bf`, `cedb8ab` e `1955a4c`.
- **Como validou:** Build de produção do frontend e navegação completa nos fluxos de login, cadastro, criação, edição e exclusão de eventos.

---

#### Etapa 4 — App mobile

- **Quem conduziu:** Maria Eduarda Schell e João Vitor Dalla Lana
- **Ferramenta e data:** ChatGPT — Novembro/2026
- **Objetivo da tarefa:** Estruturar os fluxos do app Flutter 3.5 (login simulado por perfil, listagem de eventos, exibição do código do ingresso e leitura de QR Code pela recepção).
- **Prompt utilizado:**
  ```
  Como estruturar em Flutter 3 uma navegação com escolha de perfil (Participante e Recepcionista), onde o participante vê eventos e o código do ingresso e o recepcionista abre um leitor de QR Code?
  ```
- **Trecho aproveitado:** Estrutura de navegação entre telas com `Navigator.push`, gerenciamento local com `setState` e separação da camada de serviço HTTP.
- **Análise crítica:** O esqueleto ajudou a organizar as telas rapidamente, mas precisou ser adaptado ao contrato real da API Eventoon e às permissões de câmera no Android.
- **A resposta usava versão desatualizada da stack?** Sim — sugeriu um pacote antigo de leitura de QR Code com conflito de dependências no Flutter 3.5.
- **Correções feitas manualmente e por quê:** Substituímos/ajustamos as dependências compatíveis com Flutter 3.5 e configuramos a URL base para acesso ao backend fora de `localhost`.
- **Evidência no repositório:** Commits da pasta mobile (Etapa 4).
- **Como validou:** Execução e teste manual dos fluxos de participante e recepcionista no emulador/dispositivo.

---

### 2.4 Reflexão sobre o uso de IA

A IA auxiliou no desenvolvimento do backend, do frontend web e do aplicativo mobile, principalmente na implementação da autenticação, na integração entre os componentes, na correção de erros e na organização da documentação. Ao longo do trabalho, foi necessário conferir todas as sugestões com a estrutura real do projeto, corrigir incompatibilidades de versão (como Prisma 7, Next.js App Router e Flutter 3.5) e executar testes práticos para identificar problemas que não ficavam evidentes apenas pela leitura do código. A experiência mostrou que a IA acelera o desenvolvimento, mas exige validação crítica constante em arquitetura, segurança e aderência ao contrato.

---

## 3. Diário por etapa

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
- Fluxos completos no cliente web: login e cadastro de conta, listagem/visita de eventos, cadastro de eventos, edição de eventos, exclusão protegida e gerenciamento de inscrições.
- Armazenamento do token JWT em cookie `HttpOnly` no Next.js, enviando o cabeçalho `Authorization: Bearer <token>` nas chamadas autenticadas.
- Proteção das operações conforme os perfis de acesso e associação automática de novos eventos ao organizador autenticado.
- Melhorias visuais e testes manuais de autenticação e CRUD, além de builds sem erro no backend e frontend.

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
- Tela de login simulado em Flutter 3.5 permitindo escolher entre os perfis **Participante** e **Recepcionista** (conforme orientação do professor de não exigir autenticação JWT real no mobile).
- **Fluxo Participante:** busca e listagem de eventos disponíveis, tela para realizar inscrição e tela de exibição do código do ingresso.
- **Fluxo Recepcionista:** tela com leitura de código QR do ingresso para validação de entrada no evento.

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Login simulado (falso) por escolha de perfil | Autenticação JWT completa com armazenamento seguro (`flutter_secure_storage`) | Orientação explícita do professor para focar nos fluxos principais de credenciamento dentro do prazo. | O app não gerencia expiração de token; a API mantém a proteção JWT intacta para rotas administrativas. |
| Gerência de estado com `setState` | Provider / Riverpod / Bloc | Poucas telas e fluxos bem isolados; reduz complexidade e curva de aprendizado. | Em projetos maiores exigiria migração para um gerenciador de estado reativo. |

**Dificuldades:** Compatibilidade de pacotes de leitura de QR Code no Flutter 3.5 e configuração do endereço de rede (`10.0.2.2` no emulador Android) para acessar a API local.

**O que ficou para a próxima etapa:** Ajustes finais de integração entre os três componentes e finalização da documentação.

---

### Etapa 5 — Integração e fechamento

**Período:** de 21/11/2026 a 25/11/2026 · **Redigido por:** Maria e João

**O que foi ajustado para os três componentes conversarem:**
- Alinhamento das URLs base e formatos JSON entre backend NestJS, cliente web Next.js e app mobile Flutter.
- Verificação dos fluxos de ponta a ponta (cadastro de evento no web, consulta de eventos no mobile, exibição do ingresso e leitura de QR Code).
- Atualização final de todos os documentos em `docs/` (`visao.md`, `prd.md`, `contrato-api.md`, `equipe.md` e `relatorio.md`) refletindo exatamente o código entregue.

**Inconsistências encontradas e resolvidas:**
- O contrato da API ainda refletia apenas os endpoints da Etapa 2 (`auth` e `eventos`), sendo atualizado para a versão 2.0 com todos os 6 módulos implementados.
- Divergência nas versões documentadas (NestJS 11 vs. NestJS 12 instalado no `package.json`), corrigida em todos os documentos.

**Dificuldades:** Fechar os últimos ajustes visuais/funcionais simultaneamente com a consolidação completa da documentação no dia da entrega.

---

## 4. Arquitetura — decisões e evolução

### 4.1 Estrutura final

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| Backend | Nenhum | Estrutura modular padrão do NestJS (`auth`, `usuarios`, `eventos`, `lotes`, `inscricoes`, `checkins`, `prisma`). |
| Cliente web | Nenhum | Estrutura padrão do Next.js 15 com App Router. |
| App mobile | Nenhum | Estrutura padrão do Flutter 3.5. |

### 4.2 Fronteira entre backend e clientes

Todas as regras críticas — geração do código único da inscrição, controle de lotação do lote e transição para `LISTA_ESPERA`, bloqueio de exclusão de evento com vínculos (`409`), unicidade de check-in e validação de permissões por perfil — foram mantidas exclusivamente nos services e guards do NestJS. Quando surgiu a tentação de enviar `organizadorId` pelo formulário web, a decisão foi corrigir o fluxo para derivar o identificador do JWT no backend.

### 4.3 Nível de autenticação adotado no app mobile

| Aspecto | Registro |
|---|---|
| Nível adotado | **Simulada** (login falso com escolha entre Participante e Recepcionista). |
| Como o app obtém o token | Não utiliza token JWT; a seleção de perfil direciona diretamente para as telas correspondentes, conforme autorizado pelo professor. |
| O que deixou de ser tratado | Expiração de token, armazenamento seguro de sessão e refresh token no mobile. |
| Rotas da API afetadas pela escolha | Nenhuma regra de segurança administrativa foi removida; `GET /eventos` e `GET /eventos/:id` permanecem públicos para consulta, enquanto as rotas administrativas exigem JWT válido. |

### 4.4 O que os dois clientes compartilham e o que não

- **Compartilham:** A mesma API REST em NestJS, o formato JSON em português, as datas em ISO 8601 UTC e o modelo de dados único persistido no PostgreSQL via Prisma.
- **Divergem:** O cliente web implementa autenticação JWT completa com cookie `HttpOnly` e foco administrativo (organizadores), enquanto o app mobile utiliza login simulado e foco operacional/presencial (participante exibindo ingresso e recepcionista lendo QR Code).

---

## 5. Reflexão final

### 5.1 O que funcionou bem

A separação clara entre API NestJS, cliente web Next.js e app mobile Flutter permitiu trabalhar em paralelo sem acoplamento direto ao banco de dados. A divisão de liderança (Maria no backend, João no web e ambos no Flutter) manteve o projeto avançando de forma constante.

### 5.2 O que faria diferente

Atualizaríamos o `contrato-api.md` imediatamente a cada novo módulo finalizado no backend, em vez de consolidar as mudanças posteriormente, e habilitaríamos Swagger/OpenAPI desde o início para agilizar os testes manuais.

### 5.3 Principais aprendizados

| Componente | Aprendizado |
|---|---|
| Backend | Uso prático de NestJS 12, Prisma 7 com `@prisma/adapter-pg`, guards de autenticação/autorização e proteção de regras de negócio no servidor. |
| Web | Integração do Next.js 15 App Router com API externa usando cookies `HttpOnly` para proteger o token JWT. |
| Mobile | Construção de fluxos distintos por perfil em Flutter 3.5, exibição de ingresso e leitura de QR Code com integração de rede ao backend local. |
| Integração e processo | Importância do contrato da API atualizado e do controle de ambiente (`.env`, Docker, rede do emulador) para evitar bloqueios entre frentes. |

### 5.4 Autoavaliação

**Nota:** 9/10

**Justificativa:** O grupo entregou os três componentes integrados (NestJS, Next.js e Flutter), com backend completo modelado no PostgreSQL/Prisma, regras de negócio centralizadas no servidor, painel web funcional com autenticação JWT segura e aplicativo mobile cobrindo os fluxos de participante e leitura de QR Code pela recepção. O ponto que tira 1 ponto é não termos mantido a documentação atualizada em tempo real em todas as sprints e não termos adicionado testes automatizados de ponta a ponta.

---

## 6. Vídeo de apresentação

| Campo | Valor |
|---|---|
| **Link** | _(inserir link do vídeo)_ |
| **Duração** | _(inserir duração)_ |
| **Quem fala em cada parte** | Maria: arquitetura, backend e parte do mobile · João: cliente web, integração e parte do mobile |

---

## 7. Histórico de revisões

| Versão | Data | Descrição | Quem atualizou |
|---|---|---|---|
| 0.1 | 03/09/2026 | Criação do documento | Maria / João |
| 0.5 | 21/10/2026 | Registro da Etapa 3 (Cliente web) e ambiente | Maria |
| 1.0 | 25/11/2026 | Versão final completa para entrega (Etapas 0 a 5, guia de execução do zero, mobile Flutter e reflexão final) | Maria / João |