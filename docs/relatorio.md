# Relatório Técnico de Desenvolvimento

> **Instruções:** Este documento é um diário técnico, escrito **ao longo** do projeto. Registre decisões, dificuldades e uso de IA à medida que acontecem — o que é reconstruído de memória na última semana fica genérico e se nota.
>
> O documento é organizado por **etapa**. Se o grupo trabalha em sprints mais curtas dentro de uma etapa, agrupe o relato na etapa correspondente.

---

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Eventoon |
| **Grupo** | A |
| **Integrantes** | Maria Eduarda Schell, João Vitor Dalla Lana |
| **Repositório** | `https://github.com/schellx/web-mob-trabalho.git` |
| **Vídeo de apresentação** | _(link após a entrega)_ |

---

## 1. Ambiente de desenvolvimento

> O passo a passo de instalação está no `README.md` da raiz. Esta seção registra apenas o que é **específico do grupo**: o que variou entre as máquinas e o que precisou ser resolvido fora do que o README previa.

### 1.1 Ferramentas e versões

> Só as que variam entre máquinas e costumam causar problema. Se todos usam a mesma, uma linha basta.

| Ferramenta | Versão | Quem |
|---|---|---|
| Node.js | 24.22.0 | |
| Flutter SDK | Não utilizado nesta etapa | |
| PostgreSQL | 18 | João |
| Docker _(se o grupo usou)_ | Docker Desktop | João |
| Emulador ou dispositivo usado no mobile | Não utilizado nesta etapa | |
| Sistema operacional | Windows 10 | João |
| Sistema operacional | Windows 11 | Maria |

**Como o banco foi provisionado:** _(X) Docker Compose · ( ) PostgreSQL instalado na máquina · ( ) serviço hospedado_

> Se não foi pelo `docker-compose.yml` do repositório, descreva em uma linha o que foi feito, para que outra pessoa reproduza.

### 1.2 Divergências em relação ao README

| Componente | O que divergiu | Como foi resolvido |
|---|---|---|
| Backend e autenticação | A variável `JWT_SECRET` não estava configurada no ambiente local. | A variável foi adicionada ao arquivo `.env` local para permitir o funcionamento da autenticação. |
| Ambiente de desenvolvimento | Após reiniciar o computador, os comandos Node.js e npm não eram reconhecidos no terminal. | O ambiente foi ajustado e as versões instaladas foram verificadas. |
| | | |

### 1.3 Endereços de rede entre os componentes

| Origem | URL da API usada | Observação |
|---|---|---|
| Web (navegador) | http://localhost:3000 |  Endereço local da API NestJS utilizada nos teste |
| Mobile (emulador) | | `localhost` do emulador não é o da máquina |
| Mobile (dispositivo físico) | | |

---

## 2. Uso de Inteligência Artificial

> Esta seção é **obrigatória**. Seja honesto — o uso de IA é encorajado, desde que consciente e documentado. O registro só cumpre seu papel se trouxer prompt, análise crítica e correções; sem esses três, não há evidência de que o código foi compreendido.

### 2.1 Ferramentas utilizadas

| Ferramenta | Versão / Plano | Quem usou | Em que componente |

| ChatGPT | Plano gratuito | João/Maria | Backend, autenticação, integração web e correção de erros |
| | | | |
| | | | |

### 2.2 Atenção específica desta stack

> Modelos de linguagem foram treinados com muito código das versões **anteriores** às adotadas na disciplina. Registre aqui os casos em que isso apareceu.

| Situação | Ocorreu? | Onde e como foi corrigido |
|---|---|---|
| Código gerado com Next.js Pages Router (`getServerSideProps`, `pages/api/`) | | O frontend utiliza o App Router, com as páginas organizadas na pasta frontend/app. As alterações foram adaptadas à estrutura existente do projeto |
| Prisma sem o adaptador `@prisma/adapter-pg`, ou importando de `@prisma/client` em vez do caminho gerado | | |
| Decorators ou módulos de versão antiga do NestJS | Não foi identificado um problema específico de versão | A implementação utiliza controladores, serviços e guards do NestJS para organizar as rotas, autenticação e permissões. O código foi compilado após os ajustes|
| Pacotes Flutter descontinuados ou incompatíveis com Flutter 3 | | |
| Outro | | |

### 2.3 Evidências de uso

> Preencha um bloco para cada uso relevante de IA. Há três blocos prontos, um por etapa de implementação — acrescente outros se precisar, ou escreva "não utilizado nesta etapa".

---

#### Etapa 2 — Backend

- **Quem conduziu:**
- **Ferramenta e data:**
- **Objetivo da tarefa:**
- **Prompt utilizado:**
  ```
  (cole aqui o prompt principal)
  ```
- **Trecho aproveitado:**
  ```
  (cole o trecho de codigo gerado que foi usado)
  ```
- **Análise crítica:** o que estava correto, o que estava errado, riscos identificados (arquitetura, segurança, manutenção, desempenho):
- **A resposta usava versão desatualizada da stack?** Qual:
- **Correções feitas manualmente e por quê:**
- **Evidência no repositório** (commit ou PR):
- **Como validou:**

---

#### Etapa 3 — Cliente web

- **Quem conduziu:**
- **Ferramenta e data:**
- **Objetivo da tarefa:**
- **Prompt utilizado:**
  ```
  (cole aqui o prompt principal)
  ```
- **Trecho aproveitado:**
  ```
  (cole o trecho de codigo gerado que foi usado)
  ```
- **Análise crítica:**
- **A resposta usava versão desatualizada da stack?** Qual:
- **Correções feitas manualmente e por quê:**
- **Evidência no repositório** (commit ou PR):
- **Como validou:**

---

#### Etapa 4 — App mobile

- **Quem conduziu:**
- **Ferramenta e data:**
- **Objetivo da tarefa:**
- **Prompt utilizado:**
  ```
  (cole aqui o prompt principal)
  ```
- **Trecho aproveitado:**
  ```
  (cole o trecho de codigo gerado que foi usado)
  ```
- **Análise crítica:**
- **A resposta usava versão desatualizada da stack?** Qual:
- **Correções feitas manualmente e por quê:**
- **Evidência no repositório** (commit ou PR):
- **Como validou:**

---

### 2.4 Reflexão sobre o uso de IA

A IA auxiliou no desenvolvimento do backend e do frontend, principalmente na implementação da autenticação, na integração entre os componentes, na correção de erros e na compreensão das ferramentas utilizadas. Ao longo do trabalho, foi necessário conferir as sugestões com a estrutura real do projeto, ajustar configurações e executar testes para identificar problemas que não ficavam evidentes apenas pela leitura do código. A experiência mostrou que a IA pode acelerar algumas tarefas, mas as respostas precisam ser analisadas antes de serem aplicadas, especialmente em questões de autenticação, permissões e compatibilidade entre versões. A compilação e os testes manuais foram importantes para verificar se as alterações funcionavam no projeto.

---

## 3. Diário por etapa

> Preencha ao final de cada etapa, enquanto os detalhes ainda estão frescos.

---

### Etapa 0 — Concepção

**Período:** de ___ a ___ · **Redigido por:**

**O que foi feito:**

**Como o tema foi escolhido, e o que foi descartado no caminho:**

**Dificuldades:**

---

### Etapa 1 — Contrato e fundação

**Período:** de ___ a ___ · **Redigido por:**

**O que foi feito:**

| Frente | O que foi feito | Por quem |
|---|---|---|
| Modelo de dados | | |
| Contrato da API | | |
| Projeto do backend | | |

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| | | | |

**Dificuldades:**

**O que ficou para a próxima etapa:**

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** de ___ a ___ · **Redigido por:**

**O que foi implementado:**

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| | | | |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| | | | |

**Dificuldades:**

**O que ficou para a próxima etapa:**

---

### Etapa 3 — Cliente web · Checkpoint 2

Período: de 01/10/2026 a 20/10/2026
Redigido por: Maria

O que foi implementado:

- Integração inicial entre o frontend Next.js e o backend NestJS.
- Página de listagem de eventos, inicialmente desenvolvida com dados de teste e depois integrada à API.
- Formulário de cadastro de eventos integrado à API.
- Operações de consulta, edição e exclusão de eventos.
- Melhorias visuais nas páginas de gerenciamento de eventos.
- Implementação da autenticação JWT no backend e do armazenamento de hash das senhas dos usuários.
- Implementação do login no cliente web e utilização da sessão nas operações autenticadas.
- Proteção das rotas de eventos conforme os perfis de acesso definidos pelo projeto.
- Associação dos novos eventos ao organizador autenticado, sem depender de um organizador informado livremente pelo formulário.
- Correção do método de exclusão de eventos para aguardar a consulta ao banco antes de verificar a existência do registro e seus vínculos.
- Testes manuais de autenticação, consulta e cadastro de eventos, além da compilação do backend e do frontend.

Decisões técnicas:

Foi utilizado Next.js no frontend e NestJS no backend para manter a interface separada das regras de negócio e permitir que outros clientes utilizem a mesma API.

A autenticação foi implementada com JWT para identificar o usuário e permitir o controle de acesso conforme seu perfil. As senhas são armazenadas como hash no banco, em vez de texto puro.

O token de autenticação é guardado em um cookie HttpOnly, e as chamadas autenticadas enviam o token no cabeçalho Authorization. Essa abordagem mantém o token fora do acesso direto pelo JavaScript do navegador.

No cadastro de eventos, o organizador passou a ser identificado pelo usuário autenticado. Com isso, o sistema não depende de um identificador de organizador escolhido pelo formulário.

As operações de eventos foram separadas em rotas REST para listagem, consulta, cadastro, edição e exclusão. As regras de negócio e as verificações de permissão ficam no backend.

Mudanças no contrato da API:

POST /auth/login: implementado para autenticar o usuário e retornar o token JWT e os dados básicos da conta. O campo retornado pelo backend é access_token.. O contrato precisa ser conferido em docs/contrato-api.md.

GET /auth/perfil: utilizado para consultar os dados do usuário autenticado. O contrato precisa ser conferido em docs/contrato-api.md.

GET /eventos e GET /eventos/:id: utilizados para consultar a listagem e os detalhes dos eventos. É necessário conferir no contrato os formatos das respostas e os requisitos de autenticação.

POST /eventos: utilizado para cadastrar eventos associados ao organizador autenticado. O contrato precisa refletir os campos aceitos pela API.

PATCH /eventos/:id e DELETE /eventos/:id: utilizados para editar e excluir eventos, respeitando as regras de autenticação e autorização. As respostas e os possíveis erros precisam estar documentados.

Dificuldades:

Durante o desenvolvimento, ocorreram problemas de configuração do ambiente, como a ausência da variável JWT_SECRET e a indisponibilidade do PostgreSQL. Também foi necessário gerar novamente o Prisma Client após alterações no schema.

Nos testes de cadastro de eventos, foi encontrada uma incompatibilidade entre o identificador do organizador esperado pelo Prisma e os dados enviados pelo cliente. A implementação foi ajustada para utilizar o organizador autenticado. Também foi corrigido o método de exclusão, que precisava aguardar o resultado da consulta antes de verificar o evento e suas relações.

Validação realizada:

Foram realizados testes manuais de login e consulta de eventos com autenticação. Também foi verificada a resposta 401 para consultas sem token. O cadastro de eventos foi testado após o ajuste da associação com o organizador autenticado.

Conforme informado, os builds de produção do frontend e do backend foram executados sem erros, e as principais páginas foram testadas.

Evidências no repositório:

- Integração de autenticação e gerenciamento de eventos, commit 1955a4c: https://github.com/schellx/web-mob-trabalho/commit/1955a4c09eaf6f4c9b0447008beea1fb6be4d047
- Conclusão do CRUD de eventos e melhorias visuais, commit cedb8ab: https://github.com/schellx/web-mob-trabalho/commit/cedb8ab1ecb671852cc993494c244115a36e99a5
- Autenticação JWT e hash de senha, commit c8cc42a: https://github.com/schellx/web-mob-trabalho/commit/c8cc42ad1e5d202e839e86553dac8b4f33a335
- Formulário de cadastro de eventos integrado à API, commit a4c64bf: https://github.com/schellx/web-mob-trabalho/commit/a4c64bfa492e721e6bdd7f8e164df417c5718126
- Primeira página frontend com eventos de teste, commit 35cf072: https://github.com/schellx/web-mob-trabalho/commit/35cf072480ab2dd624fcc5d87382cca4ab8dac53

O que ficou para a próxima etapa:

- Atualizar o contrato da API para refletir os endpoints e os formatos de resposta atuais.
- Concluir a página de criação de conta, conforme o escopo definido pelo grupo.
- Implementar o gerenciamento de lotes.
- Implementar inscrições, códigos únicos e lista de espera.
- Implementar check-in e contagem de presença.
- Desenvolver e integrar o aplicativo mobile em Flutter.
- Ampliar os testes integrados conforme as novas funcionalidades forem implementadas.

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de ___ a ___ · **Redigido por:**

**O que foi implementado:**

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| | | | |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| | | | |

**Dificuldades:**

**O que ficou para a próxima etapa:**

---

### Etapa 5 — Integração e fechamento

**Período:** de ___ a ___ · **Redigido por:**

**O que foi ajustado para os três componentes conversarem:**

**Inconsistências encontradas entre os clientes, e como foram resolvidas:**

**Dificuldades:**

---

## 4. Arquitetura — decisões e evolução

### 4.1 Estrutura final

> A estrutura das três pastas segue o `README.md` da raiz. Registre aqui apenas os **desvios** e o motivo de cada um.

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| | | |

### 4.2 Fronteira entre backend e clientes

> Como o grupo garantiu que a regra de negócio não vazasse para os clientes? Houve algum caso em que a tentação de resolver no cliente apareceu? O que foi feito?

### 4.3 Nível de autenticação adotado no app mobile

> Registre qual dos três níveis o grupo adotou — completa, simplificada ou simulada — e por quê. A simplificação vale para o app, nunca para a API.

| Aspecto | Registro |
|---|---|
| Nível adotado | |
| Como o app obtém o token | |
| O que deixou de ser tratado (expiração, refresh, logout) | |
| Rotas da API afetadas pela escolha | _(o esperado é "nenhuma")_ |

### 4.4 O que os dois clientes compartilham e o que não

> Tipos, modelos de dados, tratamento de erro, formato de sessão: o que ficou consistente entre web e mobile, o que divergiu e por quê.

---

## 5. Resposta ao RFC _(seção condicional)_

> **A publicação de um RFC é opcional.** Se o professor publicar o arquivo `docs/rfc-001.md` e comunicar o grupo, preencha esta seção — registrando a análise **antes** de commitar qualquer código novo. Se nenhum RFC for publicado até a entrega final, marque o campo abaixo e siga para a seção 6.

**Houve RFC neste projeto?** _( ) Sim — preencher abaixo · ( ) Não — seção não aplicável_

### 5.1 Análise de impacto (antes do código)

| Aspecto | Descrição |
|---|---|
| **O que o RFC pede** | |
| **Componente de origem do pedido** | _(backend / web / mobile)_ |
| **Impacto no backend** | _(ou "não afetado", com a razão)_ |
| **Impacto no contrato da API** | |
| **Impacto no cliente web** | |
| **Impacto no app mobile** | |
| **Esforço estimado** | |
| **Decisão** | _(aceitar integralmente / aceitar com adaptação / propor alternativa — com justificativa)_ |

> Vale registrar a diferença entre onde a mudança foi pedida e onde ela acabou chegando. Essa distância é o dado mais interessante que o RFC produz.

### 5.2 Estratégia de implementação

> Em que ordem os componentes foram alterados e por quê? Como o grupo evitou quebrar o que já funcionava?

### 5.3 Reflexão após a implementação

> O que no contrato ou na arquitetura original facilitou ou dificultou a absorção da mudança? Se o contrato estivesse desatualizado quando o RFC chegou, quanto isso custou?

---

## 6. Reflexão final

### 6.1 O que funcionou bem

> O que o grupo faria da mesma forma se recomeçasse?

### 6.2 O que faria diferente

> Quais decisões técnicas ou de processo mudaria? Inclua a divisão de trabalho entre as três frentes.

### 6.3 Principais aprendizados

| Componente | Aprendizado |
|---|---|
| Backend | |
| Web | |
| Mobile | |
| Integração e processo | |

### 6.4 Autoavaliação

> De 1 a 10, como o grupo avalia o resultado final? Justifique.

**Nota:** ___/10

**Justificativa:**

---

## 7. Vídeo de apresentação

| Campo | Valor |
|---|---|
| **Link** | |
| **Duração** | |
| **Quem fala em cada parte** | |

---

## 8. Histórico de revisões

| Versão | Data | Descrição | Quem atualizou |
|---|---|---|---|
| 0.1 | | Criação do documento | |
| | | | |
| 1.0 | | Versão final | |
