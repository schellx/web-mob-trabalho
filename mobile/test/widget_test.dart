import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/main.dart';

void main() {
  testWidgets('deve exibir a tela inicial do Eventoon', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const AplicativoEventos());

    expect(find.text('Bem-vindo ao aplicativo!'), findsOneWidget);
    expect(find.text('Como deseja acessar?'), findsOneWidget);
    expect(find.text('Participante'), findsOneWidget);
    expect(find.text('Recepcionista'), findsOneWidget);
  });

  testWidgets('deve permitir entrar como participante', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const AplicativoEventos());

    await tester.tap(find.text('Participante'));
    await tester.pumpAndSettle();

    expect(find.text('Login - Participante'), findsOneWidget);

    await tester.tap(find.text('Entrar'));
    await tester.pumpAndSettle();

    expect(find.text('Olá, participante!'), findsOneWidget);
    expect(find.text('Buscar eventos'), findsOneWidget);
    expect(find.text('Ver ingressos'), findsOneWidget);
  });

  testWidgets('deve permitir entrar como recepcionista', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const AplicativoEventos());

    await tester.tap(find.text('Recepcionista'));
    await tester.pumpAndSettle();

    expect(find.text('Login - Recepcionista'), findsOneWidget);

    await tester.tap(find.text('Entrar'));
    await tester.pumpAndSettle();

    expect(find.text('Olá, recepcionista!'), findsOneWidget);
    expect(find.text('Selecionar evento'), findsOneWidget);
  });
}
