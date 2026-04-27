import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { getProfile, getUser } from "../services/authService";

const levels = [
  {
    key: "BRONZE",
    name: "Bronce",
    min: 0,
    max: 100,
    emoji: "🥉",
    color: "#F97316",
    benefits: ["Acceso básico", "Registro de asistencia"],
  },
  {
    key: "SILVER",
    name: "Plata",
    min: 100,
    max: 300,
    emoji: "🥈",
    color: "#9CA3AF",
    benefits: ["Bonus +2 puntos", "Acceso a estadísticas"],
  },
  {
    key: "GOLD",
    name: "Oro",
    min: 300,
    max: 600,
    emoji: "🥇",
    color: "#FACC15",
    benefits: ["Bonus +5 puntos", "Insignias especiales"],
  },
  {
    key: "DIAMOND",
    name: "Diamante",
    min: 600,
    max: 9999,
    emoji: "💎",
    color: "#22D3EE",
    benefits: ["Bonus +10 puntos", "Nivel máximo"],
  },
];

export default function SistemaNiveles() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const points = profile?.points ?? 0;

  const getCurrentLevel = () => {
    return levels.find(
      (lvl) => points >= lvl.min && points < lvl.max
    );
  };

  const currentLevel = getCurrentLevel();

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons
              name="trophy-outline"
              size={30}
              color="#f0eee4"
            />  
        <View style={{marginLeft: 10}}>
          <Text style={styles.title}>Sistema de Niveles</Text>
       
        <Text style={styles.subtitle}>
          Tu progreso: {points} puntos
        </Text>
        </View>
        </View>
      </View>
      </View>
      

      {/* NIVELES */}
      {levels.map((level, index) => {
        const isCurrent = currentLevel?.key === level.key;
        const completed = points >= level.max;

        const progress =
          isCurrent
            ? Math.min(
                100,
                ((points - level.min) / (level.max - level.min)) * 100
              )
            : completed
            ? 100
            : 0;

        const remaining = level.max - points;

        return (
          <View
            key={index}
            style={[
              styles.card,
              isCurrent && styles.cardActive,
            ]}
          >
            {/* TOP */}
            <View style={styles.row}>
              {/* Emoji en cuadro */}
              <View
                style={[
                  styles.emojiBox,
                  { backgroundColor: level.color },
                ]}
              >
                <Text style={styles.emoji}>{level.emoji}</Text>
              </View>

              {/* Info */}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.levelTitle}>
                  {level.name}
                </Text>
                <Text style={styles.range}>
                  {level.min} - {level.max} puntos
                </Text>
              </View>

              {/* Estado */}
              <View style={{ marginLeft: "auto" }}>
                {completed ? (
                  <Text style={styles.completed}>
                    ✔ Completado
                  </Text>
                ) : isCurrent ? (
                  <Text style={styles.current}>
                    Actual
                  </Text>
                ) : null}
              </View>
            </View>

            {/* PROGRESO SOLO NIVEL ACTUAL */}
            {isCurrent && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.progressText}>
                  {points} puntos
                </Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>

                <Text style={styles.progressInfo}>
                  {Math.round(progress)}% completado •{" "}
                  {remaining > 0 ? `${remaining} puntos restantes` : "Nivel completo"}
                </Text>
              </View>
            )}

            {/* BENEFICIOS */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.benefitsTitle}>
                Beneficios:
              </Text>

              {level.benefits.map((b, i) => (
                <Text key={i} style={styles.benefit}>
                  • {b}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  header: {
    padding: 20,
    backgroundColor: "#2563EB",
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  range: {
    fontSize: 12,
    color: "gray",
  },
  completed: {
    color: "green",
    fontWeight: "bold",
  },
  current: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    color: "#374151",
  },
  progressInfo: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  benefitsTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  benefit: {
    fontSize: 12,
    color: "#555",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});