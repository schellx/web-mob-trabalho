import styles from './page.module.css';

type Evento = {
  id: number;
  nome: string;
  descricao: string | null;
  local: string;
  data: string;
};

function formatarData(data: string) {
  const dataLocal = new Date(`${data.slice(0, 10)}T12:00:00`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dataLocal);
}

export default async function Home() {
  const response = await fetch('http://localhost:3000/eventos');

  const eventos: Evento[] = await response.json();

  return (
    <main className={styles.container}>
      <header className={styles.header}>

        <h1 className={styles.titulo}>Próximos eventos</h1>

        <p>
          Descubra eventos, workshops e experiências para participar.
        </p>
      </header>

      <section className={styles.lista}>
        {eventos.map((evento) => (
          <article className={styles.card} key={evento.id}>
            <span>EVENTO</span>
            <span><br></br>#{evento.id}</span>

            <h2> <b>{evento.nome}</b></h2>

            <p className={styles.descricao}>
              {evento.descricao || 'Sem descrição disponível.'}
            </p>

            <p>📍 {evento.local}</p>

            <p>📅 {formatarData(evento.data)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}