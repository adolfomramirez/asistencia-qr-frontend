import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import ProgressBar from "../components/ProgressBar";
import { getToken, getUser, logout } from "../services/authService";
import { getMyProfile } from "../services/profileService";

const LEVEL_LABELS: Record<string, string> = {
  BRONZE: "Bronce",
  SILVER: "Plata",
  GOLD: "Oro",
  DIAMOND: "Diamante",
};

export default function PerfilScreen() {
  const token = getToken();
  const backendUser = getUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getMyProfile()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{backendUser?.name || backendUser?.username || "Usuario"}</Text>
      <Text style={styles.email}>{backendUser?.email || ""}</Text>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} color="#007BFF" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {profile && (
        <>
          <Text style={styles.points}>{profile.points} puntos</Text>
          <Text style={styles.level}>Nivel {LEVEL_LABELS[profile.level] || profile.level}</Text>

          <ProgressBar progress={profile.progress} />
          <Text style={styles.nextLevel}>
            {profile.level === "DIAMOND"
              ? "¡Nivel máximo alcanzado!"
              : `${profile.pointsToNext} puntos para ${LEVEL_LABELS[profile.nextLevel]}`}
          </Text>

          <Text style={styles.historyTitle}>Actividad Reciente</Text>
          <FlatList
            data={profile.history}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.historyItem}>
                {item.reason}{" "}
                <Text style={{ color: item.points.startsWith("+") ? "#4CD964" : "#FF3B30" }}>
                  {item.points}
                </Text>
              </Text>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Sin actividad reciente</Text>}
          />
        </>
      )}

      {!loading && !profile && !error && (
        <Text style={styles.emptyText}>No tienes un perfil de estudiante asignado aún.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 14, color: "#888", marginTop: 2 },
  points: { fontSize: 16, marginTop: 5 },
  level: { fontSize: 18, color: "#007BFF", marginVertical: 5 },
  nextLevel: { fontSize: 14, color: "#555", marginBottom: 15 },
  historyTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  historyItem: { fontSize: 14, color: "#333", marginBottom: 5 },
  emptyText: { fontSize: 14, color: "#999", marginTop: 20, textAlign: "center" },
  errorText: { fontSize: 14, color: "#FF3B30", marginTop: 10 },
  logoutButton: { marginTop: 30, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8, borderWidth: 1, borderColor: "#FF3B30" },
  logoutText: { color: "#FF3B30", fontSize: 15, fontWeight: "500" },
});
