class Ingresso {
  final int id;
  final String codigo;
  final String status;
  final DateTime criadoEm;
  final EventoIngresso evento;
  final LoteIngresso lote;
  final DateTime? checkIn;

  Ingresso({
    required this.id,
    required this.codigo,
    required this.status,
    required this.criadoEm,
    required this.evento,
    required this.lote,
    this.checkIn,
  });

  factory Ingresso.fromJson(Map<String, dynamic> json) {
    final dadosCheckIn = json['checkIn'];

    return Ingresso(
      id: json['id'],
      codigo: json['codigo'],
      status: json['status'],
      criadoEm: DateTime.parse(json['criadoEm']),
      evento: EventoIngresso.fromJson(json['evento']),
      lote: LoteIngresso.fromJson(json['lote']),
      checkIn: dadosCheckIn == null
          ? null
          : DateTime.parse(dadosCheckIn['realizadoEm']),
    );
  }
}

class EventoIngresso {
  final int id;
  final String nome;
  final String? descricao;
  final String local;
  final DateTime data;

  EventoIngresso({
    required this.id,
    required this.nome,
    this.descricao,
    required this.local,
    required this.data,
  });

  factory EventoIngresso.fromJson(Map<String, dynamic> json) {
    return EventoIngresso(
      id: json['id'],
      nome: json['nome'],
      descricao: json['descricao'],
      local: json['local'],
      data: DateTime.parse(json['data']),
    );
  }
}

class LoteIngresso {
  final int id;
  final String nome;

  LoteIngresso({required this.id, required this.nome});

  factory LoteIngresso.fromJson(Map<String, dynamic> json) {
    return LoteIngresso(id: json['id'], nome: json['nome']);
  }
}
