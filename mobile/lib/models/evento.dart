
class Evento {
  final int id;
  final String nome;
  final String? descricao;
  final String local;
  final String data;

  const Evento({
    required this.id,
    required this.nome,
    this.descricao,
    required this.local,
    required this.data,
  });

  // Converte o JSON recebido da API em um objeto Evento
  factory Evento.fromJson(Map<String, dynamic> json) {
    return Evento(
      id: json['id'] as int,
      nome: json['nome'] as String,
      descricao: json['descricao'] as String?,
      local: json['local'] as String,
      data: json['data'] as String,
    );
  }

  // Formata a data para exibição
  String get dataFormatada {
    final partes = data.substring(0, 10).split('-');

    return '${partes[2]}/${partes[1]}/${partes[0]}';
  }
}
