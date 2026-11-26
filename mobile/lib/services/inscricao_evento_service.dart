import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/inscricao_evento.dart';
import 'evento_service.dart';

class InscricaoEventoService {
  Future<List<InscricaoEvento>> buscarInscricoes(
    int eventoId, {
    String? busca,
  }) async {
    final endereco =
        '${EventoService.baseUrl}/inscricoes/demo/evento/$eventoId';

    final uriBase = Uri.parse(endereco);

    final uri = busca != null && busca.trim().isNotEmpty
        ? uriBase.replace(queryParameters: {'busca': busca.trim()})
        : uriBase;

    final resposta = await http
        .get(uri, headers: {'Accept': 'application/json'})
        .timeout(const Duration(seconds: 15));

    if (resposta.statusCode == 200) {
      final List<dynamic> dados = jsonDecode(resposta.body) as List<dynamic>;

      return dados.map((item) {
        return InscricaoEvento.fromJson(item as Map<String, dynamic>);
      }).toList();
    }

    throw Exception(
      'Erro ao buscar participantes: HTTP ${resposta.statusCode}',
    );
  }

  // Registra o check-in de uma inscrição.
  Future<Map<String, dynamic>> registrarCheckIn(int inscricaoId) async {
    final resposta = await http
        .post(
          Uri.parse(
            '${EventoService.baseUrl}/inscricoes/demo/$inscricaoId/checkin',
          ),
          headers: {'Accept': 'application/json'},
        )
        .timeout(const Duration(seconds: 15));

    if (resposta.statusCode == 200) {
      return jsonDecode(resposta.body) as Map<String, dynamic>;
    }

    throw Exception('Erro ao realizar check-in: HTTP ${resposta.statusCode}');
  }

  // Consulta a quantidade de inscritos e presentes.
  Future<Map<String, dynamic>> buscarContagem(int eventoId) async {
    final resposta = await http
        .get(
          Uri.parse('${EventoService.baseUrl}/eventos/demo/$eventoId/contagem'),
          headers: {'Accept': 'application/json'},
        )
        .timeout(const Duration(seconds: 15));

    if (resposta.statusCode == 200) {
      return jsonDecode(resposta.body) as Map<String, dynamic>;
    }

    throw Exception(
      'Erro ao consultar a contagem: HTTP ${resposta.statusCode}',
    );
  }
}
