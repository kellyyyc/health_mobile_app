import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";

import { formatDate, getAllExercises } from "../helperFunctions";

import globalStyles from "../styles/global";
import { COLORS, FONTS } from "../styles/themes";

export default function SummaryScreen() {
  const [marked, setMarked] = useState({});
  const [today, setToday] = useState(formatDate(new Date()));

  const theme = {
    backgroundColor: COLORS.lightBackground,
    calendarBackground: COLORS.lightBackground,
    textSectionTitleColor: COLORS.inactive,
    monthTextColor: COLORS.text,
    dayTextColor: COLORS.text,
    todayTextColor: COLORS.text,
    arrowColor: COLORS.text,
    textDisabledColor: COLORS.inactive,
    textDayFontSize: FONTS.medium,
    textMonthFontSize: FONTS.mediumLarge,
    textDayHeaderFontSize: FONTS.small,
    dotStyle: { marginTop: -1, marginBottom: 3 },
  };

  const buildMarkedDates = (dates) => {
    const unique = Array.from(new Set(dates)).sort();
    const set = new Set(unique);
    const marked = {};

    unique.forEach((dateStr) => {
      const prev = new Date(dateStr);
      prev.setDate(prev.getDate() - 1);
      const next = new Date(dateStr);
      next.setDate(next.getDate() + 1);

      const prevKey = formatDate(prev);
      const nextKey = formatDate(next);

      const hasPrev = set.has(prevKey);
      const hasNext = set.has(nextKey);

      marked[dateStr] = {
        startingDay: !hasPrev,
        endingDay: !hasNext,
        color: COLORS.primary,
        textColor: COLORS.text,
      };
    });

    return marked;
  };
  const fetchExercises = async () => {
    try {
      const data = await getAllExercises();

      const exerciseDays = Object.keys(data).filter(
        (date) => Array.isArray(data[date]) && data[date].length > 0
      );

      const pills = buildMarkedDates(exerciseDays);
      const currentDay = formatDate(new Date());
      setToday(currentDay);
      let todayMarked = pills[currentDay];
      if (todayMarked) {
        todayMarked["marked"] = true;
        todayMarked["dotColor"] = COLORS.text;
        pills[currentDay] = todayMarked;
      } else {
        pills[currentDay] = { dotColor: COLORS.text };
      }

      setMarked(pills);
    } catch (e) {
      setMarked({});
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <>
      <LinearGradient
        colors={[COLORS.secondary, "transparent"]}
        style={globalStyles.gradient}
      />
      <SafeAreaView>
        <View style={globalStyles.content}>
          <Text style={globalStyles.title}>Summary</Text>
          <View style={styles.box}>
            <Calendar
              theme={theme}
              markingType="period"
              markedDates={marked}
              firstDay={1}
              hideExtraDays={true}
              futureScrollRange={0}
              maxDate={today}
              disableAllTouchEventsForDisabledDays={true}
              onMonthChange={() => fetchExercises}
            />
          </View>
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
