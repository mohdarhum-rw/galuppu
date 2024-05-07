
import 'dart:convert';
import 'dart:io';
import 'dart:math';

void main() {
  // JSON data
  String jsonString = '''
  {
    "integer_count": 10,
    "route": "10-3-6-1-7-54-32-14-16-33",
    "shops": [
        {
            "name": "Lotus bakery",
            "location": "Opposite to Allens "
        },
        {
            "name": "3rd main road petty shop",
            "location": "Anna nagar east"
        },
        {
            "name": "Gokul News Mart",
            "location": "Anna nagar east"
        },
        {
            "name": "Sri Raag Snacks",
            "location": "Anna nagar east"
        },
        {
            "name": "MK store",
            "location": "Kilpauk"
        },
        {
            "name": "Nambiar Tea Shop",
            "location": "Mount Road"
        },
        {
            "name": "My father tea shop",
            "location": "Nungambakkam"
        },
        {
            "name": "MKB News Mart",
            "location": "Choolaimedu"
        },
        {
            "name": "TP chatiram corner petty shop",
            "location": "Kilpauk"
        },
        {
            "name": "Subin Tea shop",
            "location": "Nungambakkam"
        }
    ],
    "executive_username": "shaharhum",
    "executive_name": "Shah Mohd Arhum",
    "assigned_by": "manager",
    "drinknames": {
        "RoseMilk": 1,
        "Pista": 4,
        "BadamMilk": 2,
        "GoliSoda": 3
    },
    "notes": "this is a mockup of the structure"
  }
  ''';

  Map<String, dynamic> jsonData = jsonDecode(jsonString);

  // Initialize the outermost list
  List<Map<String, List<Map<String, dynamic>>>> shopLists = [];

  // Iterate over shops
  List<dynamic> shops = jsonData["shops"];
  for (var shop in shops) {
    // Initialize the inner list for drinks
    List<Map<String, dynamic>> drinkList = [];

    // Iterate over drink names
    Map<String, dynamic> drinkNames = jsonData["drinknames"];
    drinkNames.forEach((drinkName, _) {
      // Generate random values for initial given and received
      int given = Random().nextInt(10) + 1;
      int received = Random().nextInt(10) + 1;
      drinkList.add({
        drinkName: [
          {"given": given},
          {"received": received}
        ]
      });
    });

    // Add the shop with drink list to outermost list
    shopLists.add({shop["name"]: drinkList});
  }

  print('Shop Lists Before Operation:');
  print(shopLists);

  // Edit values for given and received based on user input
  editValues(shopLists);

  print('\nShop Lists After Operation:');
  print(shopLists);
}

void editValues(List<Map<String, List<Map<String, dynamic>>>> shopLists) {
  print('Enter the shop name:');
  String shopName = stdin.readLineSync()!;
  print('Enter the drink name:');
  String drinkName = stdin.readLineSync()!;
  print('Enter the new value for "given":');
  int newGiven = int.parse(stdin.readLineSync()!);
  print('Enter the new value for "received":');
  int newReceived = int.parse(stdin.readLineSync()!);

  // Update values in shopLists
  for (var shop in shopLists) {
    if (shop.containsKey(shopName)) {
      for (var drink in shop[shopName]!) {
        if (drink.containsKey(drinkName)) {
          drink[drinkName]![0]['given'] = newGiven;
          drink[drinkName]![1]['received'] = newReceived;
          print('Values updated successfully.');
          return;
        }
      }
    }
  }

  print('Shop or drink not found. Please try again.');
}
