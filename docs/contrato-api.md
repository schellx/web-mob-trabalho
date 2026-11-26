# Contrato da API

Este documento descreve os endpoints implementados na API do sistema de credenciamento e check-in de eventos, incluindo autenticação, permissões, dados aceitos e respostas retornadas pelo backend.
---

## Por que este documento existe

O grupo trabalha em paralelo em três componentes, com menos gente do que frentes. O que impede que um trave o outro é este arquivo: com o contrato fechado, o responsável pelo cliente web pode construir a tela de listagem antes de o endpoint existir, e o responsável pelo mobile pode modelar suas classes de dados sem esperar a primeira migration.

Duas regras práticas decorrem disso:

1. **O contrato muda antes do código, nunca depois.** Quem precisa alterar um endpoint atualiza este documento e avisa o grupo no mesmo dia. Descobrir a mudança quando a tela quebra custa o dobro.
2. **O contrato é a especificação, não a documentação.** Se ele descreve um comportamento e a API faz outro, o defeito está na API — a menos que o grupo decida conscientemente mudar o contrato.

A régua de qualidade é esta: na entrega final, o contrato precisa ser suficiente para que um quarto cliente seja escrito **sem nenhuma pergunta ao grupo**.

---

## Identificação

| Campo | Valor |
|---|---|
| Projeto | Eventoon |
| Versão do contrato | 1.1 |
| Última atualização | 21/10/2026 |
| URL base (desenvolvimento) | `http://localhost:3000` |
| Formato | JSON (`Content-Type: application/json`) |

> **Nota para o app mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina do desenvolvedor. Use `http://10.0.2.2:3000` no emulador Android, ou o IP da máquina na rede local para dispositivo físico. Registre a URL usada por cada ambiente na configuração do app, nunca fixa no meio do código.

---

## 1. Convenções gerais

### 1.1 Nomenclatura

Os endpoints são organizados por recurso, utilizando nomes em português e sem acentos. Os recursos implementados nesta etapa são eventos e autenticação.

Os endpoints de autenticação são `/auth/login` e `/auth/perfil`. As operações de gerenciamento de eventos utilizam `/eventos` e `/eventos/:id`.

Os campos dos objetos utilizam nomes em português, com identificadores técnicos como `id`. Os identificadores dos usuários e eventos são números inteiros gerados pelo banco de dados.

As datas são representadas por strings no formato ISO 8601. Os campos utilizados no recurso Evento são `id`, `nome`, `descricao`, `local`, `data`, `criadoEm` e `organizadorId`.

### 1.2 Métodos e status esperados

| Operação | Método e caminho | Sucesso | Erros comuns |
|---|---|---|---|
| Login | POST /auth/login | 200 | 400, 401 |
| Consultar perfil | GET /auth/perfil | 200 | 401 |
| Listar eventos | GET /eventos | 200 | 401 |
| Consultar evento | GET /eventos/:id | 200 | 400, 401, 404 |
| Cadastrar evento | POST /eventos | 201 | 400, 401, 403 |
| Atualizar evento | PATCH /eventos/:id | 200 | 400, 401, 403, 404 |
| Excluir evento | DELETE /eventos/:id | 204 | 400, 401, 403, 404, 409 |

Os códigos de status estão detalhados nas seções específicas de cada endpoint. As operações que exigem um identificador numérico podem retornar `400` quando o parâmetro informado não é válido. As operações restritas ao perfil ORGANIZADOR podem retornar `403` quando o usuário autenticado não possui a permissão necessária.

### 1.3 Formato de erro

A API utiliza o formato padrão de erros do NestJS. O campo `statusCode` informa o código HTTP, o campo `message` contém a descrição do erro e o campo `error` apresenta o tipo de erro.

Nas falhas de validação, `message` pode conter uma lista de mensagens. Em outros erros, como recurso não encontrado ou acesso não autorizado, pode conter uma única mensagem.

Exemplo de erro de validação:

```json
{
  "statusCode": 400,
  "message": [
    "nome should not be empty",
    "local must be a string"
  ],
  "error": "Bad Request"
}
```

Exemplo de recurso não encontrado:

```json
{
  "statusCode": 404,
  "message": "Evento não encontrado.",
  "error": "Not Found"
}
```

O backend utiliza um `ValidationPipe` global com as seguintes opções:

- `whitelist`: considera apenas as propriedades que possuem regras de validação.
- `forbidNonWhitelisted`: rejeita requisições que contenham propriedades não permitidas.
- `transform`: transforma os dados recebidos conforme os tipos definidos.
- `enableImplicitConversion`: permite conversões implícitas de tipos quando aplicáveis.

Não há um filtro de exceções personalizado configurado no arquivo `main.ts`. Os erros seguem o tratamento padrão do NestJS, incluindo as exceções lançadas pelos serviços e guards.

### 1.4 Paginação

A listagem de eventos não utiliza paginação nesta versão da API. O endpoint `GET /eventos` retorna um array JSON contendo os eventos encontrados, ordenados pela data do evento em ordem crescente.

Os parâmetros `page` e `limit` não estão implementados nesse endpoint.

A paginação poderá ser adicionada futuramente caso o volume de eventos exija limitar a quantidade de registros retornados.

### 1.5 Datas

Todas as datas trafegam em ISO 8601, em UTC: `2026-08-13T14:30:00.000Z`. A conversão para o fuso do usuário é responsabilidade de cada cliente.

---

## 2. Autenticação

### 2.1 Estratégia

A API utiliza autenticação por JWT. O usuário informa seu e-mail e sua senha no login. Se as credenciais forem válidas, o backend retorna um token de acesso e os dados básicos do usuário.

As requisições autenticadas devem enviar o token no cabeçalho:

```http
Authorization: Bearer <token>
```

A validade do token é de uma hora. O backend verifica a assinatura e a expiração do JWT utilizando a variável de ambiente JWT_SECRET. Tokens inválidos ou expirados são rejeitados.

As senhas são armazenadas como hash no banco de dados. Durante o login, a senha informada é comparada com o hash armazenado para verificar as credenciais.

No cliente web, o token é armazenado em um cookie HttpOnly. Nas operações autenticadas, o servidor Next.js utiliza esse token no cabeçalho Authorization para realizar as chamadas à API.

Não há endpoint de renovação de token implementado no controlador de autenticação atual.

### 2.2 Endpoints de autenticação

#### POST /auth/login

Autentica o usuário utilizando e-mail e senha.

Requisição:

```json
{
  "email": "organizador@exemplo.com",
  "senha": "senha123"
}
```

Resposta 200:

```json
{
  "access_token": "eyJhbGciOi...",
  "usuario": {
    "id": 1,
    "nome": "Nome do usuário",
    "email": "organizador@exemplo.com",
    "tipo": "ORGANIZADOR"
  }
}
```

O token apresentado é apenas ilustrativo.

Erros:
| Status | Quando |
|---|---|
| 200 | Login realizado com sucesso. |
| 400 | E-mail com formato inválido ou senha vazia. |
| 401 | E-mail ou senha incorretos. |

#### GET /auth/perfil

Retorna os dados do usuário autenticado. É necessário enviar um token JWT válido no cabeçalho Authorization.

Resposta 200:

```json
{
  "id": 1,
  "email": "organizador@exemplo.com",
  "tipo": "ORGANIZADOR"
}
```

Erros:

| Status | Quando |
|---|---|
| 200 | Consulta realizada com sucesso. |
| 401 | Token ausente, inválido ou expirado. |

#### Cadastro de usuários

O endpoint POST /auth/registro não está implementado no controlador de autenticação atual. Portanto, não há uma rota de cadastro público de usuários documentada nesta versão da API.

### 2.3 Perfis e permissões

| Perfil | Pode | Não pode |
|---|---|---|
| ORGANIZADOR | Cadastrar eventos, listar os próprios eventos, consultar seus detalhes, editar e excluir os próprios eventos. | Editar ou excluir eventos de outro organizador. Excluir eventos que possuam lotes ou inscrições vinculados. |
| RECEPCIONISTA | Consultar a lista geral de eventos e os detalhes de qualquer evento. | Cadastrar, editar ou excluir eventos. |
| PARTICIPANTE | Consultar a lista geral de eventos e os detalhes de qualquer evento. | Cadastrar, editar ou excluir eventos. |

Todas as rotas de eventos exigem autenticação. As operações de cadastro, edição e exclusão são restritas ao perfil ORGANIZADOR.

O backend associa cada evento criado ao organizador autenticado, sem depender de um identificador de organizador enviado pelo cliente. Nas operações de consulta individual, edição e exclusão, também verifica se o evento pertence ao organizador autenticado.

A exclusão é recusada quando o evento possui lotes ou inscrições vinculados, retornando o status 409.

### 2.4 Armazenamento do token em cada cliente

| Cliente | Onde o token fica | Nível de autenticação | Observação |
|---|---|---|---|
| Web (Next.js) | Cookie HttpOnly | Completa | O servidor Next.js utiliza o token nas requisições autenticadas à API. |
| Mobile (Flutter) | Ainda não implementado nesta etapa | A definir | A estratégia de autenticação do aplicativo será documentada durante a implementação mobile. |

---

## 3. Recursos

Esta seção descreve os recursos implementados na API, incluindo suas representações, os campos aceitos, as regras de validação e os códigos de resposta. Nesta etapa, o recurso documentado é Evento, utilizado para cadastrar, consultar, editar e excluir eventos.

---

### 3.1 Evento

Descrição: representa um evento que pode receber inscrições e possuir lotes de vagas.

Consumido por: web nesta etapa. O consumo pelo aplicativo mobile será realizado na etapa de implementação do Flutter.

#### Representação

```json
{
  "id": 1,
  "nome": "Evento de tecnologia",
  "descricao": "Palestras e atividades de tecnologia",
  "local": "Auditório principal",
  "data": "2026-11-15T13:00:00.000Z",
  "criadoEm": "2026-10-20T15:30:00.000Z",
  "organizadorId": 1
}
```

| Campo | Tipo | Obrigatório na criação | Observação |
|---|---|---|---|
| `id` | número inteiro | Não | Gerado automaticamente pelo servidor. |
| `nome` | string | Sim | Não pode ser vazio. |
| `descricao` | string ou null | Não | Descrição opcional do evento. |
| `local` | string | Sim | Não pode ser vazio. |
| `data` | data/hora ISO 8601 | Sim | Deve ser uma data válida. |
| `criadoEm` | data/hora ISO 8601 | Não | Gerado automaticamente pelo banco. |
| `organizadorId` | número inteiro | Não | Definido pelo backend com base no usuário autenticado. |

#### GET /eventos

Lista os eventos cadastrados. É necessário estar autenticado.

Os eventos são retornados em ordem crescente de data. Quando o usuário autenticado possui o perfil ORGANIZADOR, são listados apenas os eventos associados a ele. Para os perfis RECEPCIONISTA e PARTICIPANTE, a listagem retorna todos os eventos.

Resposta 200: lista de eventos em formato JSON. A resposta é um array de objetos, sem envelope de paginação.

Exemplo:

```json
[
  {
    "id": 1,
    "nome": "Evento de tecnologia",
    "descricao": "Palestras e atividades de tecnologia",
    "local": "Auditório principal",
    "data": "2026-11-15T13:00:00.000Z",
    "criadoEm": "2026-10-20T15:30:00.000Z",
    "organizadorId": 1
  }
]
```

| Status | Quando |
|---|---|
| 200 | Consulta realizada com sucesso, mesmo que a lista esteja vazia. |
| 401 | Token ausente ou inválido. |

#### GET /eventos/:id

Consulta os dados de um evento pelo seu identificador numérico. É necessário estar autenticado.

Resposta 200: retorna o objeto do evento conforme a representação definida nesta seção.

| Status | Quando |
|---|---|
| 200 | Evento encontrado e acessível ao usuário. |
| 400 | Identificador não numérico. |
| 401 | Token ausente ou inválido. |
| 404 | Evento inexistente ou não pertencente ao organizador autenticado. |

#### POST /eventos

Cadastra um evento. Somente usuários com perfil ORGANIZADOR podem executar esta operação.

Requisição:

```json
{
  "nome": "Evento de tecnologia",
  "descricao": "Palestras e atividades de tecnologia",
  "local": "Auditório principal",
  "data": "2026-11-15T13:00:00.000Z"
}
```

O campo `organizadorId` não deve ser enviado pelo cliente. O backend obtém esse identificador a partir do usuário autenticado.

Resposta 201: retorna o evento criado, incluindo seu identificador, a data de criação e o identificador do organizador.

Regras de validação:

| Campo | Regra |
|---|---|
| `nome` | Deve ser uma string não vazia. |
| `descricao` | Opcional; quando informado, deve ser uma string. |
| `local` | Deve ser uma string não vazia. |
| `data` | Obrigatória e deve corresponder a uma data válida. |

| Status | Quando |
|---|---|
| 201 | Evento cadastrado com sucesso. |
| 400 | Dados inválidos. |
| 401 | Token ausente ou inválido. |
| 403 | Usuário sem perfil ORGANIZADOR. |

#### PATCH /eventos/:id

Atualiza os dados de um evento existente. Somente o organizador responsável pelo evento pode realizar a operação.

Requisição: objeto JSON contendo apenas os campos que serão alterados. Os campos disponíveis são `nome`, `descricao`, `local` e `data`, seguindo as regras de validação do cadastro.

Resposta 200: retorna o evento atualizado.

| Status | Quando |
|---|---|
| 200 | Evento atualizado com sucesso. |
| 400 | Identificador ou dados inválidos. |
| 401 | Token ausente ou inválido. |
| 403 | Usuário sem perfil ORGANIZADOR. |
| 404 | Evento inexistente ou não pertencente ao organizador autenticado. |

#### DELETE /eventos/:id

Exclui um evento existente. Somente o organizador responsável pelo evento pode realizar a operação.

A exclusão não é permitida se o evento possuir lotes ou inscrições vinculados.

Resposta 204: exclusão realizada com sucesso, sem corpo na resposta.

| Status | Quando |
|---|---|
| 204 | Evento excluído com sucesso. |
| 400 | Identificador não numérico. |
| 401 | Token ausente ou inválido. |
| 403 | Usuário sem perfil ORGANIZADOR. |
| 404 | Evento inexistente ou não pertencente ao organizador autenticado. |
| 409 | Existem lotes ou inscrições vinculados ao evento. |
---

## 4. Endpoints de regra de negócio

Nesta versão da API, não há um endpoint separado para executar uma operação específica de regra de negócio. A regra implementada atualmente está associada à exclusão de eventos.

### 4.1 Regra de exclusão de eventos

Endpoint: DELETE /eventos/:id

O que faz: exclui um evento pertencente ao organizador autenticado, desde que não existam lotes ou inscrições vinculados a ele.

Pré-condições:
- O usuário deve estar autenticado.
- O usuário deve possuir o perfil ORGANIZADOR.
- O evento deve existir e pertencer ao organizador autenticado.
- O evento não pode possuir lotes ou inscrições vinculados.

Requisição: não possui corpo. O identificador do evento é enviado como parâmetro da rota.

Resposta 204: evento excluído com sucesso, sem corpo na resposta.

Erros específicos:

| Status | Quando |
|---|---|
| 401 | Token ausente ou inválido. |
| 403 | Usuário sem perfil ORGANIZADOR. |
| 404 | Evento inexistente ou não pertencente ao organizador autenticado. |
| 409 | O evento possui lotes ou inscrições vinculados e não pode ser excluído. |

A verificação é realizada no backend antes da exclusão. Dessa forma, a regra não depende apenas da interface web e também se aplica a outros clientes que utilizem a API.
---

## 5. Diferenças de consumo entre os clientes

Até esta etapa, não foram implementadas diferenças específicas nos endpoints para atender separadamente ao cliente web e ao aplicativo mobile. A API utiliza o mesmo contrato REST, com respostas em JSON e as mesmas regras de autenticação e autorização.

O frontend web utiliza os endpoints de autenticação e gerenciamento de eventos. O consumo pelo aplicativo mobile será definido durante a implementação do Flutter, mantendo o contrato compartilhado com o backend.

| Endpoint | Diferença | Cliente | Motivo |
|---|---|---|---|
| Endpoints de autenticação e eventos | Nenhuma diferença específica implementada até esta etapa. | Web; mobile ainda não integrado. | Manter uma única API para os dois clientes. |

---

## 6. Como verificar o contrato

A correspondência entre o contrato e a API é verificada por meio da compilação dos componentes e de testes manuais das requisições.

Até o checkpoint 2, foram realizados testes de autenticação, consulta e cadastro de eventos utilizando requisições HTTP. Também foram verificados o acesso às rotas protegidas e o comportamento das operações de gerenciamento de eventos.

A validação do contrato deve considerar os seguintes itens:

- [ ] Coleção de requisições versionada no repositório, em arquivo `.http`, Insomnia ou Postman.
- [ ] Swagger habilitado no backend. Até o momento, não há configuração do Swagger no arquivo `backend/src/main.ts`.
- [ ] Tipos do frontend conferidos em relação ao contrato da API.
- [ ] Modelos do aplicativo mobile conferidos em relação ao contrato. A implementação mobile ainda não foi realizada nesta etapa.

A compilação bem-sucedida e os testes manuais ajudam a verificar o funcionamento dos endpoints, mas não substituem a atualização do contrato quando houver mudanças na API.

O contrato deve permanecer alinhado ao código implementado, incluindo os campos das requisições e respostas, os códigos de status e as regras de autenticação e autorização.
---

## 7. Histórico de revisões

| Versão | Data | Alteração | Impacto nos clientes |
|---|---|---|---|
| 1.0 | 03/09/2026 | Criação inicial do contrato da API no repositório. | Definição inicial da interface entre o backend e os clientes. |
| 1.1 | 21/10/2026 | Revisão do contrato com base no código implementado, incluindo autenticação, permissões, endpoints de eventos, validações, erros e paginação. | Web: contrato atualizado para as operações implementadas. Mobile: referência para a futura integração com a API. |

---
