import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/ingresso.dart';
import 'evento_service.dart';

class IngressoService {
  Future<List<Ingresso>> buscarIngressos() async {
    final resposta = await http
        .get(
          Uri.parse('${EventoService.baseUrl}/inscricoes/demo/participante'),
          headers: {'Accept': 'application/json'},
        )
        .timeout(const Duration(seconds: 15));

    if (resposta.statusCode == 200) {
      final dynamic dados = jsonDecode(resposta.body);

      if (dados is List) {
        return dados.map((item) {
          return Ingresso.fromJson(item as Map<String, dynamic>);
        }).toList();
      }

      if (dados is Map<String, dynamic>) {
        return [Ingresso.fromJson(dados)];
      }

      return [];
    }

    throw Exception('Erro ao buscar ingressos: HTTP ${resposta.statusCode}');
  }
}
