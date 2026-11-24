'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';

import styles from '../../novo/page.module.css';

import {
  listarLotes,
  type Lote,
} from '../../../actions/lotes';

import {
  listarParticipantes,
  criarParticipante,
  listarInscricoes,
  criarInscricao,
  type Participante,
  type Inscricao,
} from '../../../actions/inscricoes';

type Props = {
  eventoId: number;
};

export default function GerenciarInscricoes({
  eventoId,
}: Props) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [participanteId, setParticipanteId] = useState('');
  const [loteId, setLoteId] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [atualizacao, setAtualizacao] = useState(0);

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro('');

      try {
        const [
          resultadoLotes,
          resultadoParticipantes,
          resultadoInscricoes,
        ] = await Promise.all([
          listarLotes(eventoId),
          listarParticipantes(),
          listarInscricoes(eventoId),
        ]);

        if (!ativo) return;

        setLotes(resultadoLotes.lotes ?? []);
        setParticipantes(resultadoParticipantes.participantes ?? []);
        setInscricoes(resultadoInscricoes.inscricoes ?? []);

        const erroEncontrado =
          resultadoLotes.erro ||
          resultadoParticipantes.erro ||
          resultadoInscricoes.erro;

        if (erroEncontrado) {
          setErro(erroEncontrado);
        }
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os dados do evento.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarDados();

    return () => {
      ativo = false;
    };
  }, [eventoId, atualizacao]);

  async function cadastrarParticipante(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro('');
    setMensagem('');

    setSalvando(true);

    try {
      const resultado = await criarParticipante(eventoId, {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      if (resultado.erro || !resultado.participante) {
        setErro(resultado.erro ?? 'Não foi possível cadastrar o participante.');
        return;
      }

      setParticipanteId(String(resultado.participante.id));

      setNome('');
      setEmail('');
      setSenha('');

      setMensagem(
        `Participante ${resultado.participante.nome} cadastrado com sucesso!`,
      );

      setAtualizacao((valor) => valor + 1);
    } catch {
      setErro('Ocorreu um erro ao cadastrar o participante.');
    } finally {
      setSalvando(false);
    }
  }

  async function realizarInscricao(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro('');
    setMensagem('');

    const idParticipante = Number(participanteId);
    const idLote = Number(loteId);

    if (
      !Number.isInteger(idParticipante) ||
      !Number.isInteger(idLote)
    ) {
      setErro('Selecione um participante e um lote.');
      return;
    }

    setSalvando(true);

    try {
      const resultado = await criarInscricao(
        eventoId,
        idParticipante,
        idLote,
      );

      if (resultado.erro || !resultado.inscricao) {
        setErro(resultado.erro ?? 'Não foi possível realizar a inscrição.');
        return;
      }

      const inscricao = resultado.inscricao;

      setMensagem(
        `Inscrição criada! Código: ${inscricao.codigo} — Status: ${inscricao.status}.`,
      );

      setParticipanteId('');
      setLoteId('');

      setAtualizacao((valor) => valor + 1);
    } catch {
      setErro('Ocorreu um erro ao realizar a inscrição.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.formulario}>
        <Link
          href={`/eventos/${eventoId}`}
          className={styles.linkVoltar}
        >
          Voltar aos detalhes do evento
        </Link>

        <p className={styles.subtitulo}>GERENCIAMENTO</p>

        <h1>Inscrições do evento</h1>

        <p className={styles.descricao}>
          Cadastre participantes e gerencie suas inscrições.
        </p>

        {erro && (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        )}

        {mensagem && (
          <p className={styles.mensagem} role="status">
            {mensagem}
          </p>
        )}

        <hr />

        <h2>Cadastrar participante</h2>

        <form onSubmit={cadastrarParticipante}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do participante"
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="participante@email.com"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            placeholder="Mínimo de 6 caracteres"
            required
          />

          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Cadastrar participante'}
          </button>
        </form>

        <hr />

        <h2>Realizar inscrição</h2>

        {carregando ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={realizarInscricao}>
            <label htmlFor="participante">
              Selecionar participante
            </label>

            <select
              id="participante"
              value={participanteId}
              onChange={(e) => setParticipanteId(e.target.value)}
              required
            >
              <option value="">Selecione um participante</option>

              {participantes.map((participante) => (
                <option
                  key={participante.id}
                  value={participante.id}
                >
                  {participante.nome} — {participante.email}
                </option>
              ))}
            </select>

            <label htmlFor="lote">Selecionar lote</label>

            <select
              id="lote"
              value={loteId}
              onChange={(e) => setLoteId(e.target.value)}
              required
            >
              <option value="">Selecione um lote</option>

              {lotes.map((lote) => (
                <option key={lote.id} value={lote.id}>
                  {lote.nome} — {lote.quantidade} vagas
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={salvando || participantes.length === 0 || lotes.length === 0}
            >
              {salvando ? 'Processando...' : 'Realizar inscrição'}
            </button>

            {participantes.length === 0 && (
              <p>Nenhum participante cadastrado.</p>
            )}

            {lotes.length === 0 && (
              <p>Nenhum lote cadastrado neste evento.</p>
            )}
          </form>
        )}

        <hr />

        <h2>Inscrições cadastradas</h2>

        {carregando ? (
          <p>Carregando inscrições...</p>
        ) : inscricoes.length === 0 ? (
          <p>Nenhuma inscrição cadastrada neste evento.</p>
        ) : (
          inscricoes.map((inscricao) => (
            <article
              key={inscricao.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '14px',
              }}
            >
              <h3>{inscricao.participante.nome}</h3>

              <p>E-mail: {inscricao.participante.email}</p>

              <p>
                Código: <strong>{inscricao.codigo}</strong>
              </p>

              <p>Lote: {inscricao.lote.nome}</p>

              <p>
                Status:{' '}
                <strong>
                  {inscricao.status === 'ATIVA'
                    ? 'Ativa'
                    : inscricao.status === 'LISTA_ESPERA'
                      ? 'Lista de espera'
                      : 'Cancelada'}
                </strong>
              </p>

              <p>
                Inscrição em:{' '}
                {new Date(inscricao.criadoEm).toLocaleString('pt-BR')}
              </p>

              <p>
                Check-in:{' '}
                {inscricao.checkIn
                  ? 'Realizado'
                  : 'Ainda não realizado'}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}