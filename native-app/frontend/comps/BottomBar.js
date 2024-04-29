import * as React from "react";
import CardComponent from "./CardComponent";
import { BottomNavigation, PaperProvider } from "react-native-paper";
import Profilepage from "./Profile";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import RateTable from "./RateDeets";
import Appbarr from "./AppBar";

const BottomBarr = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "route",
      title: "Route Information",
      focusedIcon: "routes",
      // unfocusedIcon: "routes-clock",
    },
    {
      key: "chkrate",
      title: "Check Rates",
      focusedIcon: "archive-search",
      // unfocusedIcon: "archive-search-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "human-handsup",
      // unfocusedIcon: "human-male",
    },
  ]);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });

  const [sharedData, setSharedData] = React.useState({
    shopData: [],
    exName: "",
    managerName: "",
    exusn: "",
    deliveryDetails: {},
    drinknames: {},
  });

  const [loading, setLoading] = React.useState(true);

  // Function to fetch data from API and update shared data
  const fetchDataAndUpdateSharedData = async () => {
    try {
      const response = await fetch("http://172.16.1.221:8000/masterdata/");
      const data = await response.json();

      setSharedData({
        shopData: data.shops,
        exName: data.executive_name,
        managerName: data.assigned_by,
        exusn: data.executive_username,
        deliveryDetails: data.delivery_details,
        drinknames: data.drinknames,
      });
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  React.useEffect(() => {
    fetchDataAndUpdateSharedData(); // Fetch data when component mounts
  }, []);

  const renderScene = BottomNavigation.SceneMap({
    route: () => <CardComponent sharedData={sharedData} loading={loading} />,
    profile: () => <Profilepage sharedData={sharedData} />,
    chkrate: () => <RateTable />,
  });

  const getTitle = (index) => {
    if (index === 0) {
      return "Route Information ";
    } else if (index === 1) {
      return "Check Rates";
    } else if (index === 2) {
      return "Profile";
    }
  };

  return (
    <PaperProvider>
      <Appbarr
        title={getTitle(index)}
        boldTitle="True"
        showBackButton="false"
        showShophelp="false"
      />
      <BottomNavigation
        sceneAnimationType="shifting"
        sceneAnimationEnabled="false"
        shifting="true"
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ backgroundColor: "#e3e7e8" }}
        activeColor={(backgroundColor = "black")}
        inactiveColor="black"
        activeIndicatorStyle={{ backgroundColor: "#9ed9ff" }}
      />
    </PaperProvider>
  );
};

export default BottomBarr;
