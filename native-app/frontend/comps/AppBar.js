import React from "react";
import { Appbar, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import FontLoader from "./FontLoader";

const Appbarr = ({
  title,
  boldTitle = false,
  showBackButton = false,
  showShophelp = false,
}) => {
  const displayTitle = title ? title : "title was null so here i am";
  const titleStyle = boldTitle ? { fontWeight: "bold" } : {};
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={{ backgroundColor: "#d7eefc" }}>
      <FontLoader />
      {!showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}

      <Appbar.Content
        title={displayTitle}
        style={{ paddingLeft: 10 }}
        titleStyle={[{ color: "black", fontFamily: "Urbanist" }, titleStyle]}
      />
      {!showShophelp && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="help" onPress={openMenu} />}
        >
          <Menu.Item onPress={() => {}} title="Shop is Closed" />
          <Menu.Item
            onPress={() => {}}
            title="Shop is already full of stocks"
          />
          <Menu.Item onPress={() => {}} title="Custom.." />
        </Menu>
      )}
    </Appbar.Header>
  );
};

export default Appbarr;
