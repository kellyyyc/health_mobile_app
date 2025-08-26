import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

import AddExerciseModal from "./AddExerciseModal";
import { formatDate, getAllExercises } from "../helperFunctions";

import globalStyles from "../styles/global";
import { COLORS, FONTS } from "../styles/themes";

export default function ViewLogScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateExercises, setAllExercises] = useState({});
  const [dateObj, setDateObj] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [content, setContent] = useState([]);

  const onChangeDate = (_, selected) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selected) {
      setDateObj(selected);
      const formatted = formatDate(selected);
      setCurrentDate(formatted);
      setContent(findExercisesByDate(formatted, dateExercises));
    }
  };

  const load = async () => {
    const exercises = await getAllExercises();
    setAllExercises(exercises);
    setContent(findExercisesByDate(currentDate, exercises));
  };

  const findExercisesByDate = (date, exercises) => {
    return exercises[date] || [];
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!modalVisible) {
      load();
    }
  }, [modalVisible]);

  return (
    <>
      <LinearGradient
        colors={[COLORS.secondary, "transparent"]}
        style={globalStyles.gradient}
      />
      <SafeAreaView>
        <View style={globalStyles.content}>
          <Text style={globalStyles.title}>View Activity</Text>
          <View style={styles.center}>
            <Pressable
              style={styles.dateContainer}
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateTitle}>{currentDate}</Text>
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  paddingBottom: 5,
                }}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
          {content.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.text}>No activities yet. Add one!</Text>
            </View>
          ) : (
            <SectionList
              sections={[{ data: content }]}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.text}>
                    {item.time} · {item.sets ?? 0} sets · {item.reps ?? 0} reps
                    {item.weight ? ` x ${item.weight}kg` : ""}
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 96 }}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon
            name="add"
            size={40}
            style={{
              paddingLeft: 9,
            }}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </SafeAreaView>
      <AddExerciseModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        reload={load}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateTitle: {
    marginBottom: 6,
    color: COLORS.text,
    fontSize: FONTS.mediumLarge,
    fontWeight: "bold",
  },
  row: {
    backgroundColor: COLORS.lightBackground,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
  },
  name: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyBox: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.inactive,
    fontSize: FONTS.medium,
  },
  box: {
    paddingTop: 10,
    height: "100%",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: COLORS.lightBackground,
  },
  addButton: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.success,
    borderRadius: "50%",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    bottom: "7%",
    right: "10%",
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    height: 40,
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: COLORS.light,
    marginTop: 30,
  },
  center: {
    width: "100%",
    alignItems: "center",
  },
});
