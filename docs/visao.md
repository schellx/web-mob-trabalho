# Documento de Visão

> **Instruções:** Preencha todas as seções abaixo. Remova os blocos `> instrução` após preenchê-los. Este documento deve ser entregue ao final da **Etapa 0** e pode ser revisado até a Etapa 1.

---

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | _(ex: Central de Suporte Interno)_ |
| **Grupo** | _Maria Eduarda Schell / João Vitor Dalla Lana_ |
| **Integrantes** | _Maria Eduarda Schell / João Vitor Dalla Lana_ |
| **Disciplina** | Programação Web e Mobile |
| **Data de criação*03/09/2026* | |
| **Última atualização*24/09/2026* | |
| **Versão** | 1.0 |

---

## 1. Introdução

### 1.1 Propósito do documento

Este documento descreve a visão do sistema de credenciamento e check-in de eventos, seu contexto, os principais usuários, o escopo e as capacidades do produto. O documento serve como base para o desenvolvimento do sistema e para a definição dos requisitos do projeto.

### 1.2 Escopo do produto

**O sistema irá:**
- Permitir o cadastro e gerenciamento de eventos, lotes e vagas.
- Permitir inscrições com código único, lista de espera e consulta de ingressos.
- Permitir o registro de check-in pelo celular e acompanhar a contagem de participantes.

**O sistema não irá (fora do escopo):**
- Realizar pagamentos ou vendas de ingressos.
- Gerenciar a organização completa do evento além de inscrições, credenciamento e acompanhamento de presença.

### 1.3 Definições e siglas

| Termo | Definição |
|---|---|
| Evento | Atividade organizada que possui participantes, vagas e períodos de inscrição |
| Lote | Período ou categoria de inscrição de um evento, com quantidade determinada de vagas |
| Check-in | Registro da entrada de um participante no evento |
| Lista de espera | Lista de participantes que aguardam disponibilidade de vaga no evento |
| Código único | Código utilizado para identificar a inscrição de um participante |
---

## 2. Posicionamento

### 2.1 Declaração do problema

| Campo | Descrição |
|---|---|
| **O problema de** | _Controlar inscrições, vagas e entrada de participantes em eventos de forma organizada_ |
| **Afeta** | _Organizadores, recepcionistas e participantes dos eventos_ |
| **Cujo impacto é** | _Dificuldade para controlar vagas, localizar inscrições, registrar entradas e acompanhar a quantidade de participantes presentes_ |
| **Uma solução adequada seria** | _Um sistema que centralize o gerenciamento de eventos e inscrições e permita realizar o check-in dos participantes pelo celular_ |

### 2.2 Declaração de posição do produto


- **Para** _organizadores, recepcionistas e participantes de eventos_
- **Que** _precisam gerenciar inscrições e controlar a entrada dos participantes_
- **O** _Credenciamento e Check-in de Eventos_
- **É** _um sistema de gerenciamento de eventos e credenciamento_
- **Que** _facilita o controle de inscrições, vagas e presença dos participantes_
- **Diferente de** _processos manuais de controle de inscrições e entrada_
- **Nosso produto** _integra o gerenciamento dos eventos com o credenciamento e check-in por código ou nome, utilizando web e aplicativo mobile de acordo com o contexto de cada usuário_

---

## 3. Partes interessadas


| Parte interessada | Papel | Interesse no sistema |
|---|---|---|
| Organizador do evento | Gerencia eventos, lotes, inscrições e acompanha os resultados | Ter controle sobre inscrições, vagas e comparecimento |
| Recepcionista | Realiza o credenciamento e check-in dos participantes | Registrar entradas de forma rápida e consultar inscrições |
| Participante | Realiza sua inscrição e utiliza seu ingresso no evento | Ter acesso à sua inscrição e realizar o credenciamento de forma simples |


---

## 4. Descrição dos usuários

### 4.1 Perfil: _Organizador_

| Campo | Descrição |
|---|---|
| **Descrição** | Pessoa responsável pelo planejamento e gerenciamento do evento |
| **Responsabilidades** | Cadastrar eventos, gerenciar lotes e vagas, acompanhar inscrições, lista de espera e relatórios de comparecimento |
| **Contexto de uso** | Utiliza principalmente um computador em um ambiente de trabalho, com uma tela maior para visualizar e gerenciar informações do evento |
| **Nível técnico** | Intermediário |
| **Frequência de uso** | Semanal e diária durante períodos de inscrição e realização dos eventos |
| **Principal necessidade** | Gerenciar o evento e acompanhar inscrições e comparecimento dos participantes |


### 4.2 Perfil: Recepcionista

| Campo | Descrição |
|---|---|
| **Descrição** | Pessoa responsável pelo credenciamento e controle de entrada dos participantes no evento |
| **Responsabilidades** | Buscar inscrições, identificar participantes e registrar o check-in |
| **Contexto de uso** | Utiliza um celular na entrada do evento, geralmente em movimento e atendendo os participantes em sequência |
| **Nível técnico** | Básico |
| **Frequência de uso** | Principalmente durante a realização dos eventos |
| **Principal necessidade** | Realizar o check-in dos participantes de forma rápida e prática |

### 4.3 Perfil: Participante

| Campo | Descrição |
|---|---|
| **Descrição** | Pessoa inscrita em um evento que possui um ingresso ou inscrição válida |
| **Responsabilidades** | Realizar sua inscrição e apresentar seu código ou ingresso para o credenciamento |
| **Contexto de uso** | Utiliza principalmente o celular para consultar seu ingresso e apresentar seu código no momento da entrada do evento |
| **Nível técnico** | Básico |
| **Frequência de uso** | Eventual, de acordo com os eventos em que estiver inscrito |
| **Principal necessidade** | Acessar facilmente seu ingresso e realizar o credenciamento de forma rápida |
---

## 5. Visão geral do produto

### 5.1 Perspectiva do produto

o sistema será uma solução independente para gerenciamento de eventos, inscrições e credenciamento. Ele centralizará informações que poderiam ser controladas manualmente, permitindo ao organizador gerenciar eventos e inscrições pelo cliente web e a recepção realizar o check-in pelo aplicativo mobile.

### 5.2 Por que dois clientes


**O que acontece na tela grande, e por quê:**
O cliente web será utilizado principalmente pelo organizador para cadastrar e gerenciar eventos, lotes e inscrições, acompanhar a lista de espera e consultar relatórios de comparecimento. Essas atividades envolvem maior quantidade de informações e são mais adequadas a uma tela grande.

**O que acontece no celular, e por quê:**
O aplicativo mobile será utilizado principalmente pela recepção e pelos participantes. A recepção poderá buscar participantes por nome ou código e registrar o check-in diretamente na entrada do evento, enquanto o participante poderá consultar seu ingresso. O celular é mais adequado para esse contexto por permitir mobilidade e acesso rápido durante o atendimento.


**O que faz sentido existir nos dois:**
Informações relacionadas as inscrições, participantes, eventos e situação do check-in podem ser compartilhadas entre os clientes,garantindo que os dados utilizados pelo organizador, recepção e participante sejam consistentes.

### 5.3 Capacidades principais


| # | Capacidade | Descrição resumida | Cliente principal |
|---|---|---|---|
| C01 | Gerenciamento de eventos e lotes | Criar e gerenciar eventos, lotes e vagas. | web |
| C02 | Inscrições e lista de espera | Gerenciar inscrições, códigos únicos e participantes em lista de espera. | web |
| C03 | Credenciamento e check-in | Buscar participantes e registrar sua entrada no evento. | mobile |
| C04 | Acompanhamento de comparecimento | Consultar a quantidade de participantes presentes e relatórios de comparecimento. | web / mobile |

### 5.4 Suposições e dependências


**Suposições:**
- Os organizadores terão acesso à internet para gerenciar os eventos.
- Os participantes possuirão uma inscrição válida para realizar o check-in.

**Dependências:**
- Banco de dados PostgreSQL para armazenamento das informações.
- Conexão com a API do backend para comunicação entre os clientes e o sistema.

---

## 6. Restrições

| Tipo | Restrição |
|---|---|
| Backend | NestJS 11 (Node 22 LTS) + Prisma 7 + PostgreSQL 18 |
| Cliente web | React 19 + Next.js 15 com App Router |
| Cliente mobile | Flutter 3 / Dart |
| Autenticação | JWT com guards no backend; sessão completa no cliente web; no app mobile pode ser simplificada ou simulada |
| Arquitetura | Regra de negócio no backend; clientes não acessam o banco |
| Controle de versão | Repositório único do grupo no GitHub, criado a partir do repositório-modelo da disciplina |
| Prazo | Etapas 0 a 5 conforme o calendário da turma, mais apresentação |
| Documentação | Markdown, versionada no mesmo repositório |
| Escopo | O sistema será limitado às funcionalidades definidas para o MVP do projeto |
| Banco de dados | O sistema deverá utilizar PostgreSQL 18 acessível pelo backend | |

---

## 7. Qualidade

| Atributo | Relevância para este sistema |
|---|---|
| **Usabilidade** | O sistema deve permitir que organizadores, recepcionistas e participantes realizem suas tarefas de forma simples e objetiva. |
| **Desempenho** | O check-in deve responder rapidamente, pois a recepção poderá atender vários participantes em sequência. |
| **Conectividade móvel** | O aplicativo deve lidar adequadamente com possíveis variações de conexão durante o uso na entrada do evento, evitando operações duplicadas ou inconsistentes |
---

## 8. Histórico de revisões

| Versão | Data | Autor | Descrição da alteração |
|---|---|---|---|
| 1.0 | 24/09/2026 | [Maria Eduarda Schell / João Vitor Dalla Lana] | Versão inicial |
