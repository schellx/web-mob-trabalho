import 'package:material_ui/material_ui.dart';

import 'models/ingresso.dart';
import 'services/ingresso_service.dart';

class TelaMeusIngressos extends StatefulWidget {
  const TelaMeusIngressos({super.key});

  @override
  State<TelaMeusIngressos> createState() => _TelaMeusIngressosState();
}

class _TelaMeusIngressosState extends State<TelaMeusIngressos> {
  final IngressoService _servico = IngressoService();

  late Future<List<Ingresso>> _ingressos;

  @override
  void initState() {
    super.initState();
    _carregarIngressos();
  }

  void _carregarIngressos() {
    _ingressos = _servico.buscarIngressos();
  }

  String _formatarData(DateTime data) {
    final dataLocal = data.toLocal();

    final dia = dataLocal.day.toString().padLeft(2, '0');
    final mes = dataLocal.month.toString().padLeft(2, '0');
    final ano = dataLocal.year;

    return '$dia/$mes/$ano';
  }

  Color _corStatus(String status) {
    if (status == 'ATIVA') {
      return Colors.green;
    }

    if (status == 'LISTA_ESPERA') {
      return Colors.orange;
    }

    return Colors.red;
  }

  String _textoStatus(String status) {
    switch (status) {
      case 'ATIVA':
        return 'Ativa';
      case 'LISTA_ESPERA':
        return 'Lista de espera';
      default:
        return status;
    }
  }

  Widget _construirIngresso(Ingresso ingresso) {
    final corStatus = _corStatus(ingresso.status);

    return Card(
      margin: const EdgeInsets.only(bottom: 20),
      color: Colors.white,
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'INGRESSO',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: corStatus.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _textoStatus(ingresso.status),
                    style: TextStyle(
                      color: corStatus,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            Text(
              ingresso.evento.nome,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 8),

            _informacao(Icons.location_on_outlined, ingresso.evento.local),

            _informacao(
              Icons.calendar_month_outlined,
              _formatarData(ingresso.evento.data),
            ),

            _informacao(Icons.confirmation_number_outlined, ingresso.lote.nome),

            const Divider(height: 30),

            const Text(
              'Código do ingresso',
              style: TextStyle(color: Colors.grey, fontSize: 13),
            ),

            const SizedBox(height: 5),

            SelectableText(
              ingresso.codigo,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),

            const SizedBox(height: 20),

            Center(
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.black12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.qr_code_2,
                      size: 110,
                      color: Colors.black87,
                    ),
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    'QR Code ilustrativo',
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            ),

            const Divider(height: 30),

            Row(
              children: [
                Icon(
                  ingresso.checkIn == null
                      ? Icons.pending_outlined
                      : Icons.check_circle_outline,
                  color: ingresso.checkIn == null
                      ? Colors.orange
                      : Colors.green,
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Text(
                    ingresso.checkIn == null
                        ? 'Check-in ainda não realizado'
                        : 'Check-in realizado em ${_formatarData(ingresso.checkIn!)}',
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _informacao(IconData icone, String texto) {
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: Row(
        children: [
          Icon(icone, size: 19, color: Colors.grey),
          const SizedBox(width: 9),
          Expanded(child: Text(texto, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meus ingressos'),
        backgroundColor: Colors.white,
      ),
      body: FutureBuilder<List<Ingresso>>(
        future: _ingressos,
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
                    const Icon(
                      Icons.error_outline,
                      size: 60,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Não foi possível carregar seus ingressos.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        setState(_carregarIngressos);
                      },
                      child: const Text('Tentar novamente'),
                    ),
                  ],
                ),
              ),
            );
          }

          final ingressos = snapshot.data ?? [];

          if (ingressos.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.confirmation_number_outlined,
                      size: 70,
                      color: Colors.grey,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Você ainda não possui ingressos.',
                      style: TextStyle(fontSize: 17),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              setState(_carregarIngressos);
              await _ingressos;
            },
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  'Você possui ${ingressos.length} ingresso(s).',
                  style: const TextStyle(fontSize: 16, color: Colors.grey),
                ),

                const SizedBox(height: 16),

                ...ingressos.map(_construirIngresso),
              ],
            ),
          );
        },
      ),
    );
  }
}
