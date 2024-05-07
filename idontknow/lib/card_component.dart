import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Shopinfo extends StatefulWidget {
  //these are so called parameters. think of them as props in a componenetn in react.
  final String title;
  final String content;
  final Function(Map<String, dynamic>) addToShoplist;

//basically saying these are required.
  const Shopinfo({
    required this.title,
    required this.content,
    required this.addToShoplist,
    Key? key,
  }) : super(key: key);

  @override
  State<Shopinfo> createState() => _ShopinfoState();
}

class _ShopinfoState extends State<Shopinfo> {
  //init has to be done here so that it is accessible anywhere within this widget.
  late Map<String, dynamic> drinkarray = {};
  List<TextEditingController>? givenControllers;
  List<TextEditingController>? receivedControllers;
  Future<void>? _fetchData;
  bool showinvoice = false;

//think of below being the code to init stuff as soon as its mounted.
  @override
  void initState() {
    super.initState();
    _fetchData = _getdrinkdata();
  }

//a future function executes somewhere in the future.

  Future<void> _getdrinkdata() async {
    final response =
        await http.get(Uri.parse('http://172.16.1.221:8000/drinknames'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      List<Map<String, dynamic>> drinkList = [];
      data.forEach((drinkName, _) {
        drinkList.add({
          drinkName: [
            {"given": 0},
            {"received": 0}
          ]
        });
      });
      setState(() {
        drinkarray = {widget.title: drinkList};
      });
      givenControllers =
          List.generate(drinkList.length, (_) => TextEditingController());
      receivedControllers =
          List.generate(drinkList.length, (_) => TextEditingController());
    }
    print(drinkarray);
  }

  void _updateDrinkArray() {
    setState(() {
      for (int i = 0; i < drinkarray[widget.title].length; i++) {
        var givenText = givenControllers![i].text.trim();
        var receivedText = receivedControllers![i].text.trim();

        // Validate inputs
        if (givenText.isNotEmpty && receivedText.isNotEmpty) {
          // Update the drinkarray with new values
          drinkarray[widget.title][i][drinkarray[widget.title][i].keys.first][0]
              ['given'] = int.parse(givenText);
          drinkarray[widget.title][i][drinkarray[widget.title][i].keys.first][1]
              ['received'] = int.parse(receivedText);
          showinvoice = true;
        } else {
          // Show a dialog to inform the user about the invalid input
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                icon: const Icon(Icons.error),
                backgroundColor: Colors.white,
                iconColor: const Color.fromARGB(255, 145, 37, 29),
                title: const Text('Invalid Input'),
                content: const Text(
                    'You need to enter values for given and received! (Cant be null)'),
                actions: <Widget>[
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop(); // Close the dialog
                    },
                    child: Text('OK'),
                  ),
                ],
              );
            },
          );
          return; // Stop the update process if any field is empty
        }
      }
      widget.addToShoplist(drinkarray);
      Navigator.of(context).pop();
    });
    print(drinkarray); // Print updated drinkarray
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 80,
        backgroundColor: const Color.fromARGB(255, 48, 50, 61),
        titleTextStyle: const TextStyle(color: Colors.white, fontSize: 20),
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(widget.title),
      ),
      body: FutureBuilder<void>(
        future: _fetchData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // Show loading indicator while fetching data
            return const Center(
              child: CircularProgressIndicator(),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}'),
            );
          } else {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      const Padding(
                        padding: EdgeInsets.only(right: 10, left: 0),
                        child: Icon(
                          size: 30,
                          Icons.location_on,
                          color: Color.fromARGB(255, 44, 39, 194),
                        ),
                      ),
                      Text(
                        widget.content,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 54, 53, 53),
                          fontSize: 22,
                          letterSpacing: -0.8,
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 16.0),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10, top: 10),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12.0),
                      child: Image.network(
                        'https://source.unsplash.com/random', // Random image from APIs
                        width: 400,
                        height: 200,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 26, top: 10),
                    child: Text(
                      'Update Below: ',
                      style: TextStyle(
                          color: Color.fromARGB(255, 54, 53, 53),
                          letterSpacing: -0.6,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          fontFamily: 'WorkSans'),
                    ),
                  ),
                  if (drinkarray != null)
                    Container(
                      decoration: BoxDecoration(
                        color: Color.fromARGB(255, 242, 250, 255),
                        borderRadius: BorderRadius.circular(25),
                        border: Border.all(
                          width: 1,
                          color: const Color.fromARGB(220, 189, 206, 217),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.only(
                            top: 10, bottom: 10, right: 12, left: 12),
                        child: Column(
                          children: [
                            for (int i = 0;
                                i < drinkarray[widget.title].length;
                                i++)
                              Column(
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16.0),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Text(drinkarray[widget.title]
                                                  [i]
                                              .keys
                                              .first),
                                        ),
                                        SizedBox(
                                          width: 100,
                                          child: TextField(
                                            controller: givenControllers?[i],
                                            decoration: InputDecoration(
                                                labelText: 'Given'),
                                            keyboardType: TextInputType.number,
                                          ),
                                        ),
                                        SizedBox(
                                          width: 100,
                                          child: TextField(
                                            controller: receivedControllers?[i],
                                            decoration: InputDecoration(
                                                labelText: 'Received'),
                                            keyboardType: TextInputType.number,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            SizedBox(
                              height: 20,
                            ),
                            ElevatedButton(
                              style: ButtonStyle(
                                  elevation: MaterialStateProperty.all(0),
                                  backgroundColor: MaterialStateProperty.all(
                                      Color.fromARGB(255, 176, 217, 255))),
                              onPressed: _updateDrinkArray,
                              child: const Text(
                                  style: TextStyle(color: Colors.black),
                                  'Generate Invoice'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  showinvoice
                      ? Padding(
                          padding: const EdgeInsets.only(top: 36),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Color.fromARGB(255, 242, 250, 255),
                              borderRadius: BorderRadius.circular(25),
                              border: Border.all(
                                width: 1,
                                color: const Color.fromARGB(220, 189, 206, 217),
                              ),
                            ),
                            child: const Center(
                              child: Text('invoice shown'),
                              //invoice will be added later.
                            ),
                          ),
                        )
                      : Center(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 36),
                            child: Text(
                                'After you click on the button, invoice will be shown below:'),
                          ),
                        )
                ],
              ),
            );
          }
        },
      ),
    );
  }
}
