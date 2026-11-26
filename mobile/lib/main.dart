import 'package:material_ui/material_ui.dart';

import 'models/evento.dart';
import 'services/evento_service.dart';
import 'tela_meus_ingressos.dart';
import 'models/inscricao_evento.dart';
import 'services/inscricao_evento_service.dart';

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
                Expanded(child: Container(height: 8, color: vermelho)),
                Expanded(child: Container(height: 8, color: amarelo)),
                Expanded(child: Container(height: 8, color: azul)),
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
                        style: TextStyle(fontSize: 16, color: Colors.grey),
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
                        descricao: 'Consulte suas inscrições e apresente seus ingressos.',
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
                        descricao: 'Consulte inscrições e realize o check-in dos participantes.',
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
                style: TextStyle(color: Colors.grey, fontSize: 12),
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
      MaterialPageRoute(builder: (context) => TelaLogin(perfil: perfil)),
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
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
                      style: const TextStyle(fontSize: 13, color: Colors.grey),
                    ),
                  ],
                ),
              ),

              const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}

class TelaLogin extends StatelessWidget {
  final String perfil;

  const TelaLogin({super.key, required this.perfil});

  @override
  Widget build(BuildContext context) {
    final bool participante = perfil == 'Participante';

    final Color cor = participante ? vermelho : azul;

    return Scaffold(
      appBar: AppBar(
        title: Text('Login - $perfil'),
        backgroundColor: Colors.white,
      ),

      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),

              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(
                    participante
                        ? Icons.confirmation_number_outlined
                        : Icons.qr_code_scanner,
                    size: 75,
                    color: cor,
                  ),

                  const SizedBox(height: 24),

                  Text(
                    'Acesso $perfil',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Entre para continuar no Eventoon.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey, fontSize: 15),
                  ),

                  const SizedBox(height: 32),

                  TextField(
                    decoration: InputDecoration(
                      labelText: 'E-mail',
                      prefixIcon: const Icon(Icons.email_outlined),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),

                  const SizedBox(height: 18),

                  TextField(
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Senha',
                      prefixIcon: const Icon(Icons.lock_outline),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  const Text(
                    'Acesso demonstrativo. Os dados digitados '
                    'não serão verificados.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),

                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => TelaPerfil(perfil: perfil),
                        ),
                      );
                    },

                    style: ElevatedButton.styleFrom(
                      backgroundColor: cor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),

                    child: const Text(
                      'Entrar',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class TelaPerfil extends StatelessWidget {
  final String perfil;

  const TelaPerfil({super.key, required this.perfil});

  @override
  Widget build(BuildContext context) {
    final bool participante = perfil == 'Participante';

    return Scaffold(
      appBar: AppBar(title: Text(perfil), backgroundColor: Colors.white),
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
                style: TextStyle(fontSize: 15, color: Colors.grey),
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
                        builder: (context) => const TelaMeusIngressos(),
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

class TelaSelecaoEvento extends StatefulWidget {
  const TelaSelecaoEvento({super.key});

  @override
  State<TelaSelecaoEvento> createState() => _TelaSelecaoEventoState();
}

class _TelaSelecaoEventoState extends State<TelaSelecaoEvento> {
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
        title: const Text('Selecionar evento'),
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
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Não foi possível carregar os eventos.'),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        carregarEventos();
                      });
                    },
                    child: const Text('Tentar novamente'),
                  ),
                ],
              ),
            );
          }

          final eventos = snapshot.data ?? [];

          if (eventos.isEmpty) {
            return const Center(child: Text('Nenhum evento encontrado.'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: eventos.length,
            itemBuilder: (context, index) {
              final evento = eventos[index];

              return Card(
                margin: const EdgeInsets.only(bottom: 14),
                child: ListTile(
                  leading: const Icon(Icons.event, color: azul, size: 32),
                  title: Text(
                    evento.nome,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    '${evento.local}\nData: ${evento.dataFormatada}',
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => TelaEventoRecepcionista(
                          eventoId: evento.id,
                          nomeEvento: evento.nome,
                        ),
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

// Painel do evento selecionado pelo recepcionista
class TelaEventoRecepcionista extends StatefulWidget {
  final int eventoId;
  final String nomeEvento;

  const TelaEventoRecepcionista({
    super.key,
    required this.eventoId,
    required this.nomeEvento,
  });

  @override
  State<TelaEventoRecepcionista> createState() =>
      _TelaEventoRecepcionistaState();
}

class _TelaEventoRecepcionistaState extends State<TelaEventoRecepcionista> {
  final InscricaoEventoService _servico = InscricaoEventoService();
  final TextEditingController _campoBusca = TextEditingController();

  late Future<List<InscricaoEvento>> _futureInscricoes;
  late Future<Map<String, dynamic>> _futureContagem;

  int? _inscricaoProcessando;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  void _carregarDados({String? busca}) {
    _futureInscricoes = _servico.buscarInscricoes(
      widget.eventoId,
      busca: busca,
    );

    _futureContagem = _servico.buscarContagem(widget.eventoId);
  }

  void _pesquisar() {
    setState(() {
      _carregarDados(
        busca: _campoBusca.text.trim().isEmpty ? null : _campoBusca.text.trim(),
      );
    });
  }

  Future<void> _registrarCheckIn(InscricaoEvento inscricao) async {
    setState(() {
      _inscricaoProcessando = inscricao.id;
    });

    try {
      final resultado = await _servico.registrarCheckIn(inscricao.id);

      if (!mounted) return;

      final bool jaRealizado = resultado['jaRealizado'] == true;

      setState(() {
        _inscricaoProcessando = null;

        _carregarDados(
          busca: _campoBusca.text.trim().isEmpty
              ? null
              : _campoBusca.text.trim(),
        );
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            jaRealizado
                ? 'O check-in já havia sido realizado.'
                : 'Check-in realizado com sucesso!',
          ),
          backgroundColor: Colors.green,
        ),
      );
    } catch (erro) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Não foi possível realizar o check-in: $erro'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted && _inscricaoProcessando == inscricao.id) {
        setState(() {
          _inscricaoProcessando = null;
        });
      }
    }
  }

  Widget _indicador(String titulo, String valor, IconData icone, Color cor) {
    return Container(
      constraints: const BoxConstraints(minWidth: 95),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cor.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icone, color: cor, size: 23),
          const SizedBox(height: 6),
          Text(
            valor,
            style: TextStyle(
              fontSize: 21,
              fontWeight: FontWeight.bold,
              color: cor,
            ),
          ),
          Text(
            titulo,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _construirContagem() {
    return FutureBuilder<Map<String, dynamic>>(
      future: _futureContagem,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Padding(
            padding: EdgeInsets.all(12),
            child: Center(child: CircularProgressIndicator()),
          );
        }

        if (snapshot.hasError) {
          return const Text(
            'Não foi possível carregar a contagem.',
            style: TextStyle(color: Colors.red, fontSize: 12),
          );
        }

        final dados = snapshot.data!;

        final inscritos = dados['totalInscritos'] as int? ?? 0;
        final presentes = dados['totalPresentes'] as int? ?? 0;
        final ausentes = dados['totalNaoPresentes'] as int? ?? 0;
        final espera = dados['totalListaEspera'] as int? ?? 0;

        return Wrap(
          spacing: 8,
          runSpacing: 8,
          alignment: WrapAlignment.spaceBetween,
          children: [
            _indicador('Inscritos', '$inscritos', Icons.people_outline, azul),
            _indicador(
              'Presentes',
              '$presentes',
              Icons.check_circle_outline,
              Colors.green,
            ),
            _indicador(
              'Ausentes',
              '$ausentes',
              Icons.pending_outlined,
              Colors.orange,
            ),
            _indicador('Espera', '$espera', Icons.hourglass_empty, Colors.grey),
          ],
        );
      },
    );
  }

  Widget _cartaoInscricao(InscricaoEvento inscricao) {
    final bool checkInRealizado = inscricao.checkInEm != null;
    final bool inscricaoAtiva = inscricao.status == 'ATIVA';
    final bool processando = _inscricaoProcessando == inscricao.id;

    final Color corStatus = inscricaoAtiva ? Colors.green : Colors.orange;

    return Card(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.person_outline, color: azul, size: 28),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    inscricao.participante.nome,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            Text(
              inscricao.participante.email,
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 12),

            Text(
              'Código: ${inscricao.codigo}',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),

            const SizedBox(height: 5),

            Text(
              'Lote: ${inscricao.nomeLote}',
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 12),

            Row(
              children: [
                Icon(
                  inscricaoAtiva
                      ? Icons.check_circle_outline
                      : Icons.hourglass_empty,
                  color: corStatus,
                ),
                const SizedBox(width: 8),
                Text(
                  inscricaoAtiva ? 'Inscrição ativa' : 'Lista de espera',
                  style: TextStyle(
                    color: corStatus,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),

            const Divider(height: 24),

            if (checkInRealizado) ...[
              const Row(
                children: [
                  Icon(Icons.verified, color: Colors.green),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Check-in realizado. Participante presente.',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ] else if (inscricaoAtiva) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _inscricaoProcessando == null
                      ? () => _registrarCheckIn(inscricao)
                      : null,
                  icon: processando
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.how_to_reg),
                  label: Text(
                    processando ? 'Registrando...' : 'Realizar check-in',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: azul,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                  ),
                ),
              ),
            ] else ...[
              const Text(
                'Inscrição na lista de espera. Check-in indisponível.',
                style: TextStyle(color: Colors.orange),
              ),
            ],
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _campoBusca.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Painel do evento'),
        backgroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _carregarDados(
                  busca: _campoBusca.text.trim().isEmpty
                      ? null
                      : _campoBusca.text.trim(),
                );
              });
            },
            icon: const Icon(Icons.refresh),
            tooltip: 'Atualizar dados',
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Evento selecionado:',
                    style: TextStyle(color: Colors.grey),
                  ),

                  const SizedBox(height: 5),

                  Text(
                    widget.nomeEvento,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 18),

                  const Text(
                    'Contagem de presença',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 10),

                  _construirContagem(),

                  const SizedBox(height: 18),

                  TextField(
                    controller: _campoBusca,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _pesquisar(),
                    decoration: InputDecoration(
                      labelText: 'Buscar participante',
                      hintText: 'Nome ou código do ingresso',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: IconButton(
                        onPressed: _pesquisar,
                        icon: const Icon(Icons.arrow_forward),
                        tooltip: 'Pesquisar',
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: FutureBuilder<List<InscricaoEvento>>(
                future: _futureInscricoes,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (snapshot.hasError) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Não foi possível carregar os participantes.',
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: _pesquisar,
                              child: const Text('Tentar novamente'),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  final inscricoes = snapshot.data ?? [];

                  if (inscricoes.isEmpty) {
                    return const Center(
                      child: Text('Nenhum participante encontrado.'),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    itemCount: inscricoes.length,
                    itemBuilder: (context, index) {
                      return _cartaoInscricao(inscricoes[index]);
                    },
                  );
                },
              ),
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
              const Icon(Icons.qr_code_scanner, size: 90, color: azul),

              const SizedBox(height: 24),

              const Text(
                'Leitura de QR Code',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 12),

              const Text(
                'Nesta tela será aberta a câmera para ler os ingressos dos participantes.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
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
      appBar: AppBar(title: Text(titulo), backgroundColor: Colors.white),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icone, size: 80, color: cor),

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
                style: const TextStyle(fontSize: 16, color: Colors.grey),
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
  State<TelaBuscarEventos> createState() => _TelaBuscarEventosState();
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
            return const Center(child: CircularProgressIndicator());
          }

          // Erro ao consultar a API
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.cloud_off, size: 65, color: Colors.grey),
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
            return const Center(child: Text('Nenhum evento encontrado.'));
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
                    child: Icon(Icons.event, color: azul),
                  ),
                  title: Text(
                    evento.nome,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      '${evento.local}\nData: ${evento.dataFormatada}',
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
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

  const TelaDetalhesEvento({super.key, required this.evento});

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
            const Icon(Icons.event_available, size: 65, color: azul),
            const SizedBox(height: 24),

            Text(
              evento.nome,
              style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 24),

            const Text(
              'Descrição',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
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
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Text(evento.local, style: const TextStyle(fontSize: 16)),

            const SizedBox(height: 24),

            const Text(
              'Data',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Text(evento.dataFormatada, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
