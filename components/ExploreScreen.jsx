import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import globalStyles from "../styles/global";
import { COLORS } from "../styles/themes";

export default function ExploreScreen() {
  return (
    <>
      <LinearGradient
        colors={[COLORS.secondary, "transparent"]}
        style={globalStyles.gradient}
      />
      <SafeAreaView>
        <View style={globalStyles.content}>
          <Text style={globalStyles.title}>Explore</Text>
          <View style={styles.box}></View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    paddingTop: 10,
    height: "50%",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: COLORS.lightBackground,
  },
});
