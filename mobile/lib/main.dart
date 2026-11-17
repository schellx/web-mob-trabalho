
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

import 'models/evento.dart';
import 'services/evento_service.dart';

void main() {
  runApp(const AplicativoEventos());
}

const Color vermelho = Color(0xFFC9080C);
const Color amarelo = Color(0xFFE5C30B);
const Color azul = Color(0xFF5C94AA);

class AplicativoEventos extends StatelessWidget {
  const AplicativoEventos({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Sistema de Eventos',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: azul,
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      ),
      home: const TelaInicial(),
    );
  }
}

class TelaInicial extends StatelessWidget {
  const TelaInicial({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Faixa com as três cores
            Row(
              children: [
                Expanded(
                  child: Container(height: 8, color: vermelho),
                ),
                Expanded(
                  child: Container(height: 8, color: amarelo),
                ),
                Expanded(
                  child: Container(height: 8, color: azul),
                ),
              ],
            ),

            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Ícone do aplicativo
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: azul.withValues(alpha: 0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.event_available,
                          size: 55,
                          color: azul,
                        ),
                      ),

                      const SizedBox(height: 20),

                      const Text(
                        'Sistema de Eventos',
                        style: TextStyle(
                          fontSize: 27,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF222222),
                        ),
                        textAlign: TextAlign.center,
                      ),

                      const SizedBox(height: 8),

                      const Text(
                        'Bem-vindo ao aplicativo!',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),

                      const SizedBox(height: 45),

                      const Text(
                        'Como deseja acessar?',
                        style: TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.w600,
                        ),
                      ),

                      const SizedBox(height: 20),

                      //Participante
                      OpcaoAcesso(
                        titulo: 'Participante',
                        descricao:
                        'Consulte suas inscrições e apresente seus ingressos.',
                        icone: Icons.confirmation_number_outlined,
                        cor: vermelho,
                        aoClicar: () {
                          abrirPagina(context, 'Participante');
                        },
                      ),

                      const SizedBox(height: 16),

                      //Recepcionista
                      OpcaoAcesso(
                        titulo: 'Recepcionista',
                        descricao:
                        'Consulte inscrições e realize o check-in dos participantes.',
                        icone: Icons.qr_code_scanner,
                        cor: azul,
                        aoClicar: () {
                          abrirPagina(context, 'Recepcionista');
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Sistema de Gestão de Eventos',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Abre a página correspondente ao perfil escolhido
  void abrirPagina(BuildContext context, String perfil) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TelaPerfil(perfil: perfil),
      ),
    );
  }
}

// Componente reutilizável para as opções de acesso
class OpcaoAcesso extends StatelessWidget {
  final String titulo;
  final String descricao;
  final IconData icone;
  final Color cor;
  final VoidCallback aoClicar;

  const OpcaoAcesso({
    super.key,
    required this.titulo,
    required this.descricao,
    required this.icone,
    required this.cor,
    required this.aoClicar,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: aoClicar,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Icon(icone, size: 38, color: cor),

              const SizedBox(width: 16),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      titulo,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      descricao,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),

              const Icon(
                Icons.arrow_forward_ios,
                size: 18,
                color: Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }
}



class TelaPerfil extends StatelessWidget {
  final String perfil;

  const TelaPerfil({
    super.key,
    required this.perfil,
  });

  @override
  Widget build(BuildContext context) {
    final bool participante = perfil == 'Participante';

    return Scaffold(
      appBar: AppBar(
        title: Text(perfil),
        backgroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                participante ? 'Olá, participante!' : 'Olá, recepcionista!',
                style: const TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 8),

              const Text(
                'Escolha uma opção para continuar.',
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.grey,
                ),
              ),

              const SizedBox(height: 30),

              if (participante) ...[
                OpcaoAcesso(
                  titulo: 'Buscar eventos',
                  descricao:
                  'Consulte os eventos disponíveis e faça sua inscrição.',
                  icone: Icons.search,
                  cor: vermelho,
                  aoClicar: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TelaBuscarEventos(),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 16),

                OpcaoAcesso(
                  titulo: 'Ver ingressos',
                  descricao:
                  'Consulte suas inscrições e apresente seus ingressos.',
                  icone: Icons.confirmation_number_outlined,
                  cor: vermelho,
                  aoClicar: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TelaInformativa(
                          titulo: 'Meus ingressos',
                          descricao:
                          'Aqui serão exibidas suas inscrições e os respectivos códigos QR.',
                          icone: Icons.qr_code_2,
                          cor: vermelho,
                        ),
                      ),
                    );
                  },
                ),
              ] else ...[
                OpcaoAcesso(
                  titulo: 'Selecionar evento',
                  descricao:
                  'Escolha o evento em que você irá realizar os check-ins.',
                  icone: Icons.event,
                  cor: azul,
                  aoClicar: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TelaSelecaoEvento(),
                      ),
                    );
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// Tela de seleção de eventos do recepcionista
class TelaSelecaoEvento extends StatelessWidget {
  const TelaSelecaoEvento({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Selecionar evento'),
        backgroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text(
            'Eventos disponíveis',
            style: TextStyle(
              fontSize: 23,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 8),

          const Text(
            'Selecione o evento para acessar o painel de check-in.',
            style: TextStyle(color: Colors.grey),
          ),

          const SizedBox(height: 24),

          // Evento temporário para testar a navegação
          Card(
            color: Colors.white,
            elevation: 2,
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              leading: const Icon(
                Icons.event,
                size: 35,
                color: azul,
              ),
              title: const Text(
                'Evento de demonstração',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: const Text(
                'Evento temporário para testar o aplicativo.',
              ),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                    const TelaEventoRecepcionista(
                      nomeEvento: 'Evento de demonstração',
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Painel do evento selecionado pelo recepcionista
class TelaEventoRecepcionista extends StatelessWidget {
  final String nomeEvento;

  const TelaEventoRecepcionista({
    super.key,
    required this.nomeEvento,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Painel do evento'),
        backgroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Evento selecionado:',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),

            const SizedBox(height: 8),

            Text(
              nomeEvento,
              style: const TextStyle(
                fontSize: 23,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 35),

            OpcaoAcesso(
              titulo: 'Escanear QR Code',
              descricao:
              'Leia o ingresso do participante para validar a inscrição e registrar o check-in.',
              icone: Icons.qr_code_scanner,
              cor: azul,
              aoClicar: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const TelaLeitorQR(),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

// Tela temporária do leitor de QR Code
class TelaLeitorQR extends StatelessWidget {
  const TelaLeitorQR({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leitor de QR Code'),
        backgroundColor: Colors.white,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.qr_code_scanner,
                size: 90,
                color: azul,
              ),

              const SizedBox(height: 24),

              const Text(
                'Leitura de QR Code',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 12),

              const Text(
                'Nesta tela será aberta a câmera para ler os ingressos dos participantes.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Tela temporária para as opções do participante
class TelaInformativa extends StatelessWidget {
  final String titulo;
  final String descricao;
  final IconData icone;
  final Color cor;

  const TelaInformativa({
    super.key,
    required this.titulo,
    required this.descricao,
    required this.icone,
    required this.cor,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(titulo),
        backgroundColor: Colors.white,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icone,
                size: 80,
                color: cor,
              ),

              const SizedBox(height: 24),

              Text(
                titulo,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 12),

              Text(
                descricao,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TelaBuscarEventos extends StatefulWidget {
  const TelaBuscarEventos({super.key});

  @override
  State<TelaBuscarEventos> createState() =>
      _TelaBuscarEventosState();
}

class _TelaBuscarEventosState extends State<TelaBuscarEventos> {
  late Future<List<Evento>> futureEventos;

  @override
  void initState() {
    super.initState();
    carregarEventos();
  }

  void carregarEventos() {
    futureEventos = EventoService().buscarEventos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Buscar eventos'),
        backgroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                carregarEventos();
              });
            },
            icon: const Icon(Icons.refresh),
            tooltip: 'Atualizar eventos',
          ),
        ],
      ),
      body: FutureBuilder<List<Evento>>(
        future: futureEventos,
        builder: (context, snapshot) {
          // Carregando os eventos
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          // Erro ao consultar a API
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.cloud_off,
                      size: 65,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Não foi possível carregar os eventos.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 17),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${snapshot.error}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          carregarEventos();
                        });
                      },
                      icon: const Icon(Icons.refresh),
                      label: const Text('Tentar novamente'),
                    ),
                  ],
                ),
              ),
            );
          }

          final eventos = snapshot.data ?? [];

          // Nenhum evento cadastrado
          if (eventos.isEmpty) {
            return const Center(
              child: Text('Nenhum evento encontrado.'),
            );
          }

          // Exibe os eventos recebidos da API
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: eventos.length,
            itemBuilder: (context, index) {
              final evento = eventos[index];

              return Card(
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 14),
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFEAF2F4),
                    child: Icon(
                      Icons.event,
                      color: azul,
                    ),
                  ),
                  title: Text(
                    evento.nome,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      '${evento.local}\nData: ${evento.dataFormatada}',
                    ),
                  ),
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            TelaDetalhesEvento(evento: evento),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// Detalhes do evento selecionado
class TelaDetalhesEvento extends StatelessWidget {
  final Evento evento;

  const TelaDetalhesEvento({
    super.key,
    required this.evento,
  });

  @override
  Widget build(BuildContext context) {
    final descricao = evento.descricao;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalhes do evento'),
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(
              Icons.event_available,
              size: 65,
              color: azul,
            ),
            const SizedBox(height: 24),

            Text(
              evento.nome,
              style: const TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 24),

            const Text(
              'Descrição',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            Text(
              descricao == null || descricao.trim().isEmpty
                  ? 'Nenhuma descrição informada.'
                  : descricao,
              style: const TextStyle(fontSize: 16),
            ),

            const SizedBox(height: 24),

            const Text(
              'Local',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            Text(
              evento.local,
              style: const TextStyle(fontSize: 16),
            ),

            const SizedBox(height: 24),

            const Text(
              'Data',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            Text(
              evento.dataFormatada,
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}


