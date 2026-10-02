export default async function Home() {
  const response = await fetch('http://localhost:3000/usuarios');

  const usuarios = await response.json();

  if (!response.ok){
    throw new Error('GET respondeu: ${response.status}');
  }

  return (
    <main>
      <h1><b><i>Usuários</i></b></h1>

      {usuarios.map((usuario: any) => (
        <p key={usuario.id}>
          {usuario.id} - {usuario.nome}
        </p>
      ))}
    </main>

  
  );
}