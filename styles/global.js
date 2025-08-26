import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "./themes";

export default StyleSheet.create({
  title: {
    fontSize: FONTS.title,
    color: COLORS.text,
    fontWeight: "bold",
    paddingLeft: "10%",
    paddingBottom: 4,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "30%",
    width: "100%",
    zIndex: -1,
  },
  content: {
    width: "100%",
    paddingTop: "15%",
    height: "100%",
  },
  regularText: {
    color: COLORS.text,
    fontSize: FONTS.regular,
  },
});
