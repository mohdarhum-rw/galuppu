import 'dart:convert';
import 'dart:ffi';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:idontknow/card_component.dart';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';

class CustomBottomNavigationBar extends StatefulWidget {
  final Function(int) onIndexChanged; // Define the callback function

  const CustomBottomNavigationBar({Key? key, required this.onIndexChanged})
      : super(key: key);

  @override
  State<CustomBottomNavigationBar> createState() =>
      _CustomBottomNavigationBarState();
}

class _CustomBottomNavigationBarState extends State<CustomBottomNavigationBar> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
            // Call the callback function to notify the parent widget
            widget.onIndexChanged(currentPageIndex);
          });
        },
        indicatorColor: Color.fromARGB(255, 129, 205, 255),
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(Icons.route),
            icon: Icon(Icons.route_outlined),
            label: 'Routes',
          ),
          NavigationDestination(
            selectedIcon: Icon(Icons.query_stats),
            icon: Icon(Icons.query_stats_outlined),
            label: 'Rates',
          ),
          NavigationDestination(
            selectedIcon: Icon(Icons.supervisor_account),
            icon: Icon(Icons.supervisor_account_outlined),
            label: 'Profile',
          ),
        ],
      ),
      body: getPageContent(currentPageIndex),
    );
  }

  Widget getPageContent(int index) {
    switch (index) {
      case 0:
        return RoutesPage();
      case 1:
        return const Center(
          child: Text('Rates Page'),
        );
      case 2:
        return const Center(
          child: Text('Profile Page'),
        );
      default:
        return const Center(
          child: Text('Unknown Page'),
        );
    }
  }
}

class RoutesPage extends StatefulWidget {
  @override
  _RoutesPageState createState() => _RoutesPageState();
}

class _RoutesPageState extends State<RoutesPage> {
  List<Map<String, dynamic>> _cards = [];
  List<Map<String, dynamic>> _filteredCards = [];
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = false; // Flag to track loading state
  bool _iserror = false;
  List<Map<String, List<Map<String, dynamic>>>> shopLists = [];
  List<Map<String, dynamic>> shopListsnew = [];
  final lol = Logger('name');
  var drinkname = '';
  dynamic data;

  void addToShoplist(Map<String, dynamic> drinkArray) {
    setState(() {
      shopListsnew.add(drinkArray);
    });
  }

  @override
  void initState() {
    super.initState();
    _fetchDataFromAPI(); // Call method to fetch data when widget initializes
  }

//this will display a loading thingy
  Future<void> _fetchDataFromAPI() async {
    setState(() {
      _isLoading = true;
    });

//actual request made here
    try {
      final response =
          await http.get(Uri.parse('http://172.16.1.221:8000/masterdata'));
      if (response.statusCode == 200) {
        data = jsonDecode(response.body);

//OLD METHOD FOR GENERATINNG MASTER LISTS BEFORE THE ANY CARD IS INTERACTED WITH. i think this is the bad approach. so, the shopinfo widget builds the inner lists and then
//it is appended to the shoplistnew list. it then can be sent anywhere.

        // Iterate over shops
        // List<dynamic> shops = data["shops"];
        // for (var shop in shops) {
        //   // Initialize the inner list for drinks
        //   List<Map<String, dynamic>> drinkList = [];

        //   // Iterate over drink names
        //   Map<String, dynamic> drinkNames = data["drinknames"];
        //   drinkNames.forEach((drinkName, _) {
        //     int given = Random().nextInt(100) + 1;
        //     int received = Random().nextInt(100) + 1;
        //     drinkList.add({
        //       drinkName: [
        //         {"given": given},
        //         {"received": received}
        //       ]
        //     });
        //   });

        //   // Add the shop with drink list to outermost list
        //   shopLists.add({shop["name"]: drinkList});
        // }
        // print(shopLists);
        setState(() {
          // Set _shopMap with the last shopMap value
          _cards = List<Map<String, dynamic>>.from(data['shops']);
          _filteredCards = _cards;
          _isLoading = false;
          _iserror = false;
        });
      } else {
        _iserror = true;
      }
    } catch (error) {
      print('Error: $error');
      setState(() {
        _isLoading = false;
        _iserror = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // print(data);
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 80,
        backgroundColor: const Color.fromARGB(255, 41, 42, 59),
        title: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 1,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(25.0),
            color: const Color.fromARGB(255, 58, 70, 95),
          ),
          child: TextField(
            cursorColor: Colors.white,
            controller: _searchController,
            onChanged: _filterCards,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Search...',
              prefixIcon: const Icon(
                Icons.search,
                size: 20,
              ),
              suffixIcon: IconButton(
                  onPressed: () {
                    _searchController.clear();
                    _resetSearchResults();
                  },
                  icon: const Icon(Icons.clear)),
              suffixIconColor: Colors.white,
              prefixIconColor: Colors.white,
              border: InputBorder.none,
              hintStyle: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w300,
              ),
              contentPadding: const EdgeInsets.all(12),
            ),
          ),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: Colors.grey,
                  ),
                  SizedBox(
                      height:
                          30), // Spacer between CircularProgressIndicator and Text
                  Text(
                      style: TextStyle(fontSize: 16, fontFamily: "Rubik"),
                      'Please Wait... :D'), // Text indicating data fetching
                ],
              ),
            ) // Show indicator if loading
          : _iserror
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.sentiment_dissatisfied,
                        color: Color.fromARGB(255, 194, 72, 63),
                        size: 45,
                      ),
                      SizedBox(height: 13),
                      Text(
                          style: TextStyle(fontSize: 16, fontFamily: "Rubik"),
                          'Something went wrong. Try reloading?'),
                    ],
                  ),
                )
              : Column(
                  children: [
                    ListView.builder(
                      scrollDirection: Axis.vertical,
                      shrinkWrap: true,
                      itemCount: _filteredCards.length,
                      itemBuilder: (_, index) {
                        final card = _filteredCards[index];
                        // String specificShopName = card['name']; // Example shop name
                        // List<Map<String, dynamic>>? specificShopDrinks;

                        // // Iterate over shopLists to find the specific shop
                        // for (var shopData in shopLists) {
                        //   if (shopData.containsKey(specificShopName)) {
                        //     // Found the specific shop
                        //     specificShopDrinks = shopData[specificShopName];
                        //     break; // Stop the loop once the specific shop is found
                        //   }
                        // }
                        return Column(
                          children: [
                            ExpandableCard(
                              title: card['name'],
                              content: card['location'],
                              addToShoplist: addToShoplist,
                            ),
                          ],
                        );
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20, bottom: 20),
                      child: IconButton.outlined(
                          tooltip: 'Upload!',
                          iconSize: 30,
                          onPressed: () => {print(shopListsnew)},
                          icon: Icon(Icons.cloud_upload)),
                    )
                  ],
                ),
    );
  }

  void _resetSearchResults() {
    setState(() {
      _filteredCards = List.from(_cards);
    });
  }

  void _filterCards(String searchText) {
    setState(() {
      _filteredCards = _cards
          .where((card) =>
              card['name'].toLowerCase().contains(searchText.toLowerCase()))
          .toList();
    });
  }
}

class ExpandableCard extends StatefulWidget {
  final String title;
  final String content;
  final Function(Map<String, dynamic>) addToShoplist;

  // final dynamic drinkarray;

  const ExpandableCard({
    required this.title,
    // required this.drinkarray,
    required this.content,
    required this.addToShoplist,
    Key? key,
  }) : super(key: key);

  @override
  _ExpandableCardState createState() => _ExpandableCardState();
}

class _ExpandableCardState extends State<ExpandableCard> {
  bool _isExpanded = false;
  List<Map<String, dynamic>> shopListsnew = [];

  void addToShoplist(Map<String, dynamic> drinkArray) {
    setState(() {
      shopListsnew.add(drinkArray);
    });
  }

  @override
  Widget build(BuildContext context) {
    // List<Map<String, List<Map<String, dynamic>>>> shopLists =
    //     ModalRoute.of(context)!.settings.arguments
    //         as List<Map<String, List<Map<String, dynamic>>>>;

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 242, 250, 255),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            width: 1,
            color: const Color.fromARGB(220, 189, 206, 217),
          ),
        ),
        child: Stack(
          children: [
            Card(
              elevation: 0,
              color: Colors.transparent,
              child: ExpansionTile(
                shape: const Border(
                  bottom: BorderSide.none,
                ),
                iconColor: const Color.fromARGB(255, 58, 58, 58),
                collapsedIconColor: Colors.black,
                childrenPadding: const EdgeInsets.symmetric(
                  vertical: 10,
                  horizontal: 20,
                ),
                expandedCrossAxisAlignment: CrossAxisAlignment.start,
                onExpansionChanged: (value) {
                  setState(() {
                    _isExpanded = value;
                  });
                },
                title: Text(
                  widget.title,
                  style: const TextStyle(
                      color: Color.fromARGB(255, 54, 53, 53),
                      fontFamily: 'WorkSans',
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.8,
                      fontSize: 18),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.all(0),
                    child: Text(
                      widget.content,
                      style: const TextStyle(
                          color: Colors.black, letterSpacing: -0.2),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(80),
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: const Color.fromARGB(23, 23, 32, 32),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
            if (_isExpanded)
              Positioned(
                bottom: 4,
                right: 0,
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // String specificShopName =
                      //     widget.title; // Example shop name
                      // List<Map<String, dynamic>>? specificShopDrinks;
                      // for (var shopData in shopLists) {
                      //   if (shopData.containsKey(specificShopName)) {
                      //     // Found the specific shop
                      //     specificShopDrinks = shopData[specificShopName];
                      //     break; // Stop the loop once the specific shop is found
                      //   }
                      // }
                      // print(specificShopDrinks);
                      // print(widget.drinkarray);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Shopinfo(
                                  title: widget.title,
                                  content: widget.content,
                                  addToShoplist: widget.addToShoplist,
                                )),
                      );
                    },
                    icon: const Icon(Icons.arrow_right_alt_rounded),
                    label: const Text('Update'),
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all(
                            Color.fromARGB(255, 82, 203, 255)),
                        foregroundColor:
                            MaterialStateProperty.all(Colors.black)),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
