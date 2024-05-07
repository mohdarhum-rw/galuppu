import 'package:flutter/material.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'custom_bottom_navigation.dart'; // Import your custom BottomNavigationBar widget

void main() {
  runApp(const NavigationBarApp());
}

class NavigationBarApp extends StatefulWidget {
  const NavigationBarApp({Key? key}) : super(key: key);

  @override
  _NavigationBarAppState createState() => _NavigationBarAppState();
}

class _NavigationBarAppState extends State<NavigationBarApp> {
  int _selectedIndex = 0;
  final List<String> _routeNames = ['Route Info', 'Rates', 'Profile'];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(
          title: Text(
            _routeNames[_selectedIndex],
            style: _selectedIndex == 0
                ? const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Rubik',
                    color: Color.fromARGB(255, 255, 255, 255))
                : TextStyle(
                    color: Colors.white,
                  ),
          ), // Set app bar title dynamically with different styles
          backgroundColor: Color.fromARGB(255, 41, 42, 59),
          // You can add more properties to customize the AppBar as needed
        ),
        body: Stack(
          children: [
            CustomBottomNavigationBar(
              onIndexChanged: (index) {
                setState(() {
                  _selectedIndex = index;
                });
              },
            ),
            // Positioned(
            //   bottom: 90, // Adjust this value to place the FAB higher
            //   right: 16, // Adjust this value if needed
            //   child: SpeedDial(
            //     backgroundColor: Color.fromARGB(255, 41, 42, 59),
            //     foregroundColor: Colors.white,
            //     spacing: 10,
            //     animatedIcon: AnimatedIcons.menu_close,
            //     children: [
            //       SpeedDialChild(
            //         child: Icon(Icons.save),
            //         label: 'Commit Changes',
            //       )
            //     ],
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
