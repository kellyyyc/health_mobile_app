import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SummaryScreen from "./components/SummaryScreen.jsx";
import ViewLogScreen from "./components/ViewActivityScreen.jsx";
import ExploreScreen from "./components/ExploreScreen.jsx";

import { COLORS, FONTS } from "./styles/themes.js";
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: COLORS.darkBackground,
              height: "9%",
              paddingTop: "1%",
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.inactive,
            tabBarIcon: ({ color }) => {
              let iconName;

              if (route.name === "Summary") {
                iconName = "heart";
              } else if (route.name === "View Activity") {
                iconName = "barbell";
              } else if (route.name === "Explore") {
                iconName = "search";
              }

              return <Icon name={iconName} size={30} color={color} />;
            },
            tabBarLabelStyle: {
              fontSize: FONTS.regular,
            },
          })}
        >
          <Tab.Screen name="Summary" component={SummaryScreen} />
          <Tab.Screen name="View Activity" component={ViewLogScreen} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
