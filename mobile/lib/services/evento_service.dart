
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../models/evento.dart';

class EventoService {
  // Endereço do backend conforme o dispositivo
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000';
    }

    return 'http://10.0.2.2:3000';
  }

  Future<List<Evento>> buscarEventos() async {
    final resposta = await http.get(
      Uri.parse('$baseUrl/eventos'),
      headers: {
        'Accept': 'application/json',
      },
    ).timeout(const Duration(seconds: 15));

    if (resposta.statusCode == 200) {
      final List<dynamic> dados = jsonDecode(resposta.body);

      return dados.map((item) {
        return Evento.fromJson(item as Map<String, dynamic>);
      }).toList();
    }

    throw Exception(
      'Erro ao buscar eventos: HTTP ${resposta.statusCode}',
    );
  }
}
