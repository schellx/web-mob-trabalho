class InscricaoEvento {
  final int id;
  final String codigo;
  final String status;
  final ParticipanteInscricao participante;
  final String nomeLote;
  final DateTime? checkInEm;

  InscricaoEvento({
    required this.id,
    required this.codigo,
    required this.status,
    required this.participante,
    required this.nomeLote,
    this.checkInEm,
  });

  factory InscricaoEvento.fromJson(Map<String, dynamic> json) {
    final dadosParticipante = json['participante'] as Map<String, dynamic>;

    final dadosLote = json['lote'] as Map<String, dynamic>;

    final dadosCheckIn = json['checkIn'] as Map<String, dynamic>?;

    return InscricaoEvento(
      id: json['id'] as int,
      codigo: json['codigo'] as String,
      status: json['status'] as String,
      participante: ParticipanteInscricao.fromJson(dadosParticipante),
      nomeLote: dadosLote['nome'] as String,
      checkInEm: dadosCheckIn == null
          ? null
          : DateTime.parse(dadosCheckIn['realizadoEm'] as String),
    );
  }
}

class ParticipanteInscricao {
  final int id;
  final String nome;
  final String email;

  ParticipanteInscricao({
    required this.id,
    required this.nome,
    required this.email,
  });

  factory ParticipanteInscricao.fromJson(Map<String, dynamic> json) {
    return ParticipanteInscricao(
      id: json['id'] as int,
      nome: json['nome'] as String,
      email: json['email'] as String,
    );
  }
}
