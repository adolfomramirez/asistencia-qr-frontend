import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, useRouter } from "expo-router";
import { getToken, getUser, logout } from "../services/authService";
import { getMyAttendanceSummary, getMyRecentAttendances } from "../services/attendanceService";

export default function PerfilScreen() {
  const token = getToken();
  const backendUser = getUser();
  const [summary, setSummary] = useState({ present: 0, late: 0, pending: 0, total: 0 });
  const [recentAttendances, setRecentAttendances] = useState<any[]>([]);
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

    Promise.all([getMyAttendanceSummary(), getMyRecentAttendances(8)])
      .then(([summaryData, recentData]) => {
        setSummary(summaryData);
        setRecentAttendances(recentData);
      })
      .catch((e) => setError(e.message || "No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, [token]);

  const userName = backendUser?.name || backendUser?.username || "Usuario";
  const userEmail = backendUser?.email || "Sin correo";

  const recentItem = recentAttendances[0];

  const statusToLabel: Record<string, string> = {
    PRESENT: "Presente",
    LATE: "Tardanza",
    ABSENT: "Pendiente",
    LEFT: "Pendiente",
  };

  const statusToColor: Record<string, string> = {
    PRESENT: "#10B981",
    LATE: "#F59E0B",
    ABSENT: "#94A3B8",
    LEFT: "#94A3B8",
  };

  const statusToIcon: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    PRESENT: "check-circle",
    LATE: "schedule",
    ABSENT: "help",
    LEFT: "help",
  };

  const formatDateTime = (dateValue?: string | Date, timeValue?: string | Date) => {
    if (!dateValue) return "Sin fecha";

    const date = new Date(dateValue);
    const dateText = date.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = timeValue ? new Date(timeValue) : null;
    const timeText = time
      ? time.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })
      : "--:--";

    return `${dateText} · ${timeText}`;
  };

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerGlowOne} />
          <View style={styles.headerGlowTwo} />
          <Text style={styles.headerTitle}>AsistenciaQR</Text>
          <Text style={styles.headerSubtitle}>Sistema de control de asistencia</Text>
          <Text style={styles.headerUser}>{userName}</Text>
          <Text style={styles.headerEmail}>{userEmail}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionCard, styles.actionBlue]}>
              <View style={[styles.actionIconWrap, styles.actionIconBlue]}>
                <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Escanear QR</Text>
              <Text style={styles.actionSubtitle}>Registrar clase</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, styles.actionFuchsia]}>
              <View style={[styles.actionIconWrap, styles.actionIconFuchsia]}>
                <MaterialIcons name="photo-camera" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Tomar Foto</Text>
              <Text style={styles.actionSubtitle}>Actualizar perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Resumen de Hoy</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryCount, { color: "#10B981" }]}>{summary.present}</Text>
                <Text style={styles.summaryLabel}>Presente</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryCount, { color: "#F59E0B" }]}>{summary.late}</Text>
                <Text style={styles.summaryLabel}>Tardanza</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryCount, { color: "#94A3B8" }]}>{summary.pending}</Text>
                <Text style={styles.summaryLabel}>Pendiente</Text>
              </View>
            </View>
          </View>

          <View style={styles.block}>
            <View style={styles.blockHeaderRow}>
              <Text style={styles.blockTitle}>Asistencias Recientes</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {recentItem ? (
              <View style={styles.recentCard}>
                <View style={styles.recentLeft}>
                  <Text style={styles.recentTitle}>{recentItem.className}</Text>

                  <View style={styles.metaRow}>
                    <MaterialIcons name="place" size={16} color="#64748B" />
                    <Text style={styles.metaText}>{recentItem.classroom || "Sin aula asignada"}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <MaterialIcons name="schedule" size={16} color="#64748B" />
                    <Text style={styles.metaText}>{formatDateTime(recentItem.date, recentItem.startTime)}</Text>
                  </View>
                </View>

                <View style={styles.recentRight}>
                  <Text style={[styles.statusBadge, { backgroundColor: statusToColor[recentItem.status] || "#94A3B8" }]}>
                    {statusToLabel[recentItem.status] || recentItem.status}
                  </Text>
                  <MaterialIcons
                    name={statusToIcon[recentItem.status] || "help"}
                    size={26}
                    color={statusToColor[recentItem.status] || "#94A3B8"}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.emptyRecentCard}>
                <Text style={styles.emptyRecentText}>No hay asistencias recientes.</Text>
              </View>
            )}
          </View>

          {loading && <ActivityIndicator style={styles.loader} color="#2563EB" />}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  shell: {
    flex: 1,
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  headerGlowOne: {
    position: "absolute",
    right: -30,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7C3AED",
    opacity: 0.7,
  },
  headerGlowTwo: {
    position: "absolute",
    right: 50,
    top: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D946EF",
    opacity: 0.45,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  headerUser: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 26,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  actionBlue: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  actionFuchsia: {
    borderColor: "#F5D0FE",
    backgroundColor: "#FDF4FF",
  },
  actionIconWrap: {
    height: 56,
    width: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIconBlue: {
    backgroundColor: "#2563EB",
  },
  actionIconFuchsia: {
    backgroundColor: "#C026D3",
  },
  actionTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  actionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  block: {
    marginTop: 28,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCount: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "700",
  },
  summaryLabel: {
    marginTop: 18,
    fontSize: 14,
    color: "#475569",
  },
  blockHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
  recentCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyRecentCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  emptyRecentText: {
    fontSize: 14,
    color: "#64748B",
  },
  recentLeft: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#64748B",
  },
  recentRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: "#10B981",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: "hidden",
  },
  loader: {
    marginTop: 18,
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 26,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
