import { StyleSheet, View } from "react-native";

export default function ProgressBar({ progress }) {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 10,
  },
  bar: {
    height: "100%",
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
});
