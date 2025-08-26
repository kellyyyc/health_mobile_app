import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXERCISES_KEY } from "./storageKeys";

export const pad = (n) => n.toString().padStart(2, "0");

export const formatDate = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

export const addExercise = async (date, newExercise) => {
  try {
    const stored = await AsyncStorage.getItem(EXERCISES_KEY);
    const exercises = stored ? JSON.parse(stored) : {};

    const currentDateArray = exercises[date] ? exercises[date] : [];
    currentDateArray.push(newExercise);
    exercises[date] = currentDateArray;
    console.log(newExercise);
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
    return 0;
  } catch (error) {
    return 1;
  }
};

export const getAllExercises = async () => {
  try {
    const stored = await AsyncStorage.getItem(EXERCISES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const clearAllExercises = async () => {
  try {
    await AsyncStorage.removeItem(EXERCISES_KEY);
    return 0;
  } catch (error) {
    return 1;
  }
};

export const getExercisesByDate = async (date) => {
  try {
    const stored = await AsyncStorage.getItem(EXERCISES_KEY);
    const exercises = stored ? JSON.parse(stored) : {};
    return exercises[date] ? exercises[date] : [];
  } catch (error) {
    return [];
  }
};

export const toSections = (exercisesByDate) =>
  Object.entries(exercisesByDate)
    .sort(([d1], [d2]) => (d1 < d2 ? 1 : -1))
    .map(([date, data]) => ({ title: date, data }));
