import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, addExercise } from "../helperFunctions";

import globalStyles from "../styles/global";
import { COLORS, FONTS } from "../styles/themes";

export default function AddExerciseModal({ isVisible, onClose, reload }) {
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const onChangeDate = (_, selected) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selected) {
      setDateObj(selected);
      setDate(formatDate(selected));
    }
  };

  const onChangeTime = (_, selectedTime) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      let hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");

      const ampm = hours < 12 ? "AM" : "PM";
      hours = hours % 12 || 12;

      setTime(`${hours}:${minutes} ${ampm}`);
    }
  };

  const [dateObj, setDateObj] = useState(new Date());
  const [date, setDate] = useState(formatDate(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(getCurrentTime());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const [name, setName] = useState("");
  const [numSets, setNumSets] = useState("");
  const [numReps, setNumReps] = useState("");
  const [weight, setWeight] = useState("");

  const resetForm = () => {
    const today = new Date();
    setDateObj(today);
    setDate(formatDate(today));
    setName("");
    setNumSets("");
    setNumReps("");
    setWeight("");
    setTime(getCurrentTime());
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleAdd = async () => {
    if (date && time && name && name != "") {
      const newExercise = {
        id: Date.now(),
        name,
        date,
        time,
        sets: parseInt(numSets, 10),
        reps: parseInt(numReps, 10),
        weight: parseInt(weight, 10),
      };

      addExercise(date, newExercise).then(() => {
        resetForm();
        reload();
        onClose();
      });
    }
  };

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  useEffect(() => {
    if (date && time && name && name != "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [date, time, name]);

  const Line = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: COLORS.inactive,
          marginTop: 5,
          marginBottom: 5,
        }}
      />
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modal}>
        <View style={styles.menu}>
          <Pressable onPress={handleCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Pressable disabled={isDisabled} onPress={handleAdd}>
            <Text
              style={[
                styles.add,
                { color: isDisabled ? COLORS.inactive : COLORS.blue },
              ]}
            >
              Add Exercise
            </Text>
          </Pressable>
        </View>
        <View style={styles.container}>
          <Pressable
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Date</Text>
            <Text style={styles.input}>{date}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
          <Line />
          <Pressable
            style={styles.inputContainer}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.label}>Time</Text>
            <Text style={styles.input}>{time}</Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={dateObj}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              onChange={onChangeTime}
            />
          )}
          <Line />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              onChangeText={setName}
              value={name}
              style={styles.input}
              autoFocus={true}
            ></TextInput>
          </View>
          {!name && <Text style={styles.helper}>Enter a name</Text>}
          <Line />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of sets</Text>
            <TextInput
              onChangeText={setNumSets}
              value={numSets}
              placeholder="0"
              placeholderTextColor={COLORS.inactive}
              style={styles.input}
              keyboardType="numeric"
            ></TextInput>
          </View>
          <Line />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of reps</Text>
            <TextInput
              onChangeText={setNumReps}
              value={numReps}
              placeholder="0"
              placeholderTextColor={COLORS.inactive}
              style={styles.input}
              keyboardType="numeric"
            ></TextInput>
          </View>
          <Line />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              onChangeText={setWeight}
              value={weight}
              placeholder="0"
              placeholderTextColor={COLORS.inactive}
              style={styles.input}
              keyboardType="numeric"
            ></TextInput>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingTop: 10,
    height: "50%",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: COLORS.lightBackground,
  },
  modal: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.darkBackground,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  menu: {
    backgroundColor: COLORS.lightGray,
    height: 64,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 30,
  },
  container: {
    backgroundColor: COLORS.mediumGray,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cancel: {
    color: COLORS.blue,
    fontSize: FONTS.mediumLarge,
    top: 20,
    left: 20,
    position: "absolute",
  },
  add: {
    fontSize: FONTS.mediumLarge,
    top: 20,
    right: 20,
    position: "absolute",
    fontWeight: "bold",
  },

  inputContainer: {
    display: "flex",
    flexDirection: "row",
    height: 32,
  },
  label: {
    textAlignVertical: "center",
    color: COLORS.inactive,
    fontSize: FONTS.medium,
    width: "70%",
    alignContent: "center",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: FONTS.medium,
    lineHeight: FONTS.medium * 1.4,
    minHeight: FONTS.medium * 1.8,
    paddingVertical: 6,
    textAlignVertical: "center",
  },
  helper: {
    color: COLORS.fail,
    fontSize: FONTS.small,
    marginBottom: 4,
    marginLeft: 16,
  },
});
