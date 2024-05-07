import 'package:flutter/material.dart';

class ExpandableCard2 extends StatefulWidget {
  final String title;
  final String content;
  final VoidCallback onDelete;
  // final VoidCallback onUpdate;

  const ExpandableCard2({
    required this.title,
    required this.content,
    required this.onDelete,
    // required this.onUpdate,
    Key? key,
  }) : super(key: key);

  @override
  _ExpandableCardState2 createState() => _ExpandableCardState2();
}

class _ExpandableCardState2 extends State<ExpandableCard2> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return const Text('lol');
  }
}
