import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import ProgressBar from "../components/ProgressBar";

export default function PerfilScreen() {
  const user = {
    name: "María González",
    points: 245,
    level: "Plata",
    progress: 73,
    nextLevelPoints: 55,
    history: [
      { id: 1, action: "Asistencia confirmada (Desarrollo Web)", points: "+5" },
      { id: 2, action: "Racha de 7 días (Bonus)", points: "+10" },
      { id: 3, action: "Asistencia temprana (Matemáticas)", points: "+3" },
    ],
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.points}>{user.points} puntos</Text>
      <Text style={styles.level}>Nivel {user.level}</Text>

      <ProgressBar progress={user.progress} />
      <Text style={styles.nextLevel}>
        {user.nextLevelPoints} puntos para Oro
      </Text>

      <Text style={styles.historyTitle}>Actividad Reciente</Text>
      <FlatList
        data={user.history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>
            {item.action} {item.points}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold" },
  points: { fontSize: 16, marginTop: 5 },
  level: { fontSize: 18, color: "#007BFF", marginVertical: 5 },
  nextLevel: { fontSize: 14, color: "#555", marginBottom: 15 },
  historyTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  historyItem: { fontSize: 14, color: "#333", marginBottom: 5 },
});
