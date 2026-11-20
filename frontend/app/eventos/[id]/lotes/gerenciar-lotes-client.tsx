'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';

import styles from '../../novo/page.module.css';

import {
  listarLotes,
  criarLote,
  atualizarLote,
  type Lote,
} from '../../../actions/lotes';

function formatarData(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(data));
}

function converterDataLocal(data: string) {
  const valor = new Date(data);

  return new Date(
    valor.getTime() - valor.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);
}

export default function GerenciarLotes({
  eventoId,
}: {
  eventoId: number;
}) {

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const [loteEditando, setLoteEditando] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [atualizacao, setAtualizacao] = useState(0);

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarLotes() {
      if (!Number.isSafeInteger(eventoId) || eventoId <= 0) {
        setErro('Identificador de evento inválido.');
        setCarregando(false);
        return;
      }

      try {
        const resultado = await listarLotes(eventoId);

        if (!ativo) return;

        if (resultado.erro) {
          setErro(resultado.erro);
        } else {
          setLotes(resultado.lotes ?? []);
        }
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os lotes.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarLotes();

    return () => {
      ativo = false;
    };
  }, [eventoId, atualizacao]);

  function limparFormulario() {
    setNome('');
    setQuantidade('');
    setInicio('');
    setFim('');
    setLoteEditando(null);
  }

  function editarLote(lote: Lote) {
    setLoteEditando(lote.id);
    setNome(lote.nome);
    setQuantidade(String(lote.quantidade));
    setInicio(converterDataLocal(lote.inicio));
    setFim(converterDataLocal(lote.fim));

    setErro('');
    setMensagem('');
  }

  async function salvarLote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro('');
    setMensagem('');

    const quantidadeNumero = Number(quantidade);
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 1) {
      setErro('A quantidade de vagas deve ser um número inteiro maior que zero.');
      return;
    }

    if (
      Number.isNaN(dataInicio.getTime()) ||
      Number.isNaN(dataFim.getTime()) ||
      dataInicio >= dataFim
    ) {
      setErro('A data de início deve ser anterior à data de término.');
      return;
    }

    setSalvando(true);

    try {
      const dados = {
        nome: nome.trim(),
        quantidade: quantidadeNumero,
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString(),
      };

      const resultado = loteEditando !== null
        ? await atualizarLote(loteEditando, dados)
        : await criarLote(eventoId, dados);

      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }

      setMensagem(
        loteEditando !== null
          ? 'Lote atualizado com sucesso!'
          : 'Lote cadastrado com sucesso!',
      );

      limparFormulario();
      setAtualizacao((valor) => valor + 1);
    } catch {
      setErro('Ocorreu um erro ao salvar o lote.');
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

        <h1>Lotes do evento</h1>

        <p className={styles.descricao}>
          Cadastre e gerencie os lotes de vagas deste evento.
        </p>

        <h2>
          {loteEditando !== null ? 'Editar lote' : 'Cadastrar novo lote'}
        </h2>

        <form onSubmit={salvarLote}>
          <label htmlFor="nome">Nome do lote</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Primeiro lote"
            required
          />

          <label htmlFor="quantidade">Quantidade de vagas</label>
          <input
            id="quantidade"
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />

          <label htmlFor="inicio">Data e hora de início</label>
          <input
            id="inicio"
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            required
          />

          <label htmlFor="fim">Data e hora de término</label>
          <input
            id="fim"
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            required
          />

          <button type="submit" disabled={salvando}>
            {salvando
              ? 'Salvando...'
              : loteEditando !== null
                ? 'Salvar alterações'
                : 'Cadastrar lote'}
          </button>

          {loteEditando !== null && (
            <button
              type="button"
              onClick={limparFormulario}
              disabled={salvando}
            >
              Cancelar edição
            </button>
          )}
        </form>

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

        <h2>Lotes cadastrados</h2>

        {carregando ? (
          <p>Carregando lotes...</p>
        ) : lotes.length === 0 ? (
          <p>Nenhum lote cadastrado neste evento.</p>
        ) : (
          lotes.map((lote) => (
            <article
              key={lote.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '14px',
              }}
            >
              <h3>{lote.nome}</h3>

              <p>Vagas: {lote.quantidade}</p>

              <p>Início: {formatarData(lote.inicio)}</p>

              <p>Término: {formatarData(lote.fim)}</p>

              <button
                type="button"
                onClick={() => editarLote(lote)}
              >
                Editar lote
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}