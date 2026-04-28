import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Platform, LogBox } from "react-native";

LogBox.ignoreLogs([
  "[Reanimated] Reduced motion setting is enabled",
  "shadow*",
  "style.resizeMode is deprecated"
]);
import { getMyAttendanceSummary, getMyRecentAttendances } from "../services/attendanceService";
import { getProfile, getToken, getUser, loadAuthData, logout } from "../services/authService";

// Helper for shadow compatibility
const getShadowStyle = (elevation: number, opacity: number, radius: number, offset: number) => {
  if (Platform.OS === "web") {
    return { boxShadow: `0px ${offset}px ${radius}px rgba(15, 23, 42, ${opacity})` };
  }
  return {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: offset },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};

export default function PerfilScreen() {
  const token = getToken();
  const backendUser = getUser();
  const [summary, setSummary] = useState({ present: 0, late: 0, pending: 0, total: 0 });
  const [recentAttendances, setRecentAttendances] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    loadAuthData()
      .then(async () => {
        const currentToken = getToken();
        if (!currentToken) {
          setLoading(false);
          return;
        }

        try {
          const [summaryData, recentData, profileData] = await Promise.all([
            getMyAttendanceSummary(),
            getMyRecentAttendances(8),
            getProfile(),
          ]);

          setSummary(summaryData || { present: 0, late: 0, pending: 0, total: 0 });
          setRecentAttendances(recentData || []);
          setProfile(profileData);
        } catch (e) {
          // Si el usuario es ADMIN o MAESTRO, no mostramos error por no tener perfil de alumno
          const currentUser = getUser();
          if (currentUser?.role?.toUpperCase() !== 'ADMIN' && currentUser?.role?.toUpperCase() !== 'MAESTRO') {
            setError((e as Error).message || "No se pudo cargar el perfil.");
          }
        } finally {
          setLoading(false);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const userName = backendUser?.name || backendUser?.username || "Usuario";
  const userEmail = backendUser?.email || "Sin correo";

  const levelLabels: Record<string, string> = {
    BRONZE: "Bronce 🥉",
    SILVER: "Plata 🥈",
    GOLD: "Oro 🥇",
    DIAMOND: "Diamante 💎",
  };

  const levelColors: Record<string, { background: string; text: string }> = {
    BRONZE: { background: "#F59E0B", text: "#1F2937" },
    SILVER: { background: "#64748B", text: "#F8FAFC" },
    GOLD: { background: "#D97706", text: "#FEF3C7" },
    DIAMOND: { background: "#2563EB", text: "#DBEAFE" },
  };

  const profileLevel = profile?.level || "BRONZE";
  const formattedLevel = levelLabels[profileLevel] || profileLevel;
  const progressPercent = Math.min(100, Math.max(0, profile?.progress ?? 0));
  const nextLevelLabel = levelLabels[profile?.nextLevel || ""] || profile?.nextLevel || "Siguiente nivel";

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
    const dateText = date.toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
    const time = timeValue ? new Date(timeValue) : null;
    const timeText = time ? time.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" }) : "--:--";
    return `${dateText} · ${timeText}`;
  };

  if (!token && !isReady) return null;
  if (!token && isReady) return <Redirect href="/login" />;

  return (
    <View style={styles.screen}>
      <View style={[styles.shell, isLargeScreen && styles.shellLarge]}>
        <View style={styles.header}>
          <View style={styles.headerGlowOne} />
          <View style={styles.headerGlowTwo} />
          <Text style={styles.headerTitle}>AsistenciaQR</Text>
          <Text style={styles.headerSubtitle}>Sistema de control de asistencia</Text>
          <Text style={styles.headerUser}>{userName}</Text>
          <Text style={styles.headerEmail}>{userEmail}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={isLargeScreen ? styles.rowLayout : undefined}>
            <View style={isLargeScreen ? styles.leftColumn : undefined}>
              <View style={[styles.profileSummaryCard, getShadowStyle(6, 0.08, 24, 10)]}>
                <View style={styles.profileSummaryTop}>
                  <View style={styles.avatarWrapper}>
                    {profile?.avatarUrl ? (
                      <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
                      </View>
                    )}
                    <View style={[styles.levelBadge, { backgroundColor: levelColors[profileLevel]?.background || "#2563EB" }]}>
                      <Text style={[styles.levelBadgeText, { color: levelColors[profileLevel]?.text || "#FFFFFF" }]}>{formattedLevel}</Text>
                    </View>
                  </View>

                  <Text style={styles.profileSummaryName}>{userName}</Text>
                  <Text style={styles.profileSummaryEmail}>{userEmail}</Text>
                </View>

                {backendUser?.role?.toUpperCase() !== 'ADMIN' && backendUser?.role?.toUpperCase() !== 'MAESTRO' && (
                  <>
                    <View style={[styles.pointsCard, getShadowStyle(4, 0.08, 14, 5)]}>
                      <View style={styles.pointsCardHeader}>
                        <Text style={styles.pointsCardTitle}>Puntos acumulados</Text>
                        <MaterialIcons name="emoji-events" size={20} color="#F59E0B" />
                      </View>
                      <Text style={styles.pointsCardValue}>{profile?.points ?? 0}</Text>
                      <Text style={styles.pointsCardCaption}>Nivel actual: {formattedLevel}</Text>
                    </View>

                    <View style={styles.progressSection}>
                      <View style={styles.progressHeaderRow}>
                        <Text style={styles.progressSectionLabel}>Progreso hacia el siguiente nivel</Text>
                        <Text style={styles.progressSectionValue}>{progressPercent}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                      </View>
                      <Text style={styles.progressHint}>
                        {profile ? `${profile.pointsToNext ?? 0} puntos para ${nextLevelLabel}` : "Cargando progreso..."}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={isLargeScreen ? styles.rightColumn : undefined}>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionCard, styles.actionBlue, getShadowStyle(2, 0.08, 6, 2)]} onPress={() => router.push({ pathname: "/scanQR" })}>
                  <View style={[styles.actionIconWrap, styles.actionIconBlue, getShadowStyle(3, 0.18, 6, 2)]}>
                    <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionTitle}>Escanear QR</Text>
                  <Text style={styles.actionSubtitle}>Registrar clase</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionCard, styles.actionFuchsia, getShadowStyle(2, 0.08, 6, 2)]}>
                  <View style={[styles.actionIconWrap, styles.actionIconFuchsia, getShadowStyle(3, 0.18, 6, 2)]}>
                    <MaterialIcons name="photo-camera" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionTitle}>Tomar Foto</Text>
                  <Text style={styles.actionSubtitle}>Actualizar perfil</Text>
                </TouchableOpacity>

                {backendUser?.role?.toUpperCase() === 'ADMIN' && (
                  <TouchableOpacity style={[styles.actionCard, { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }, getShadowStyle(2, 0.08, 6, 2)]} onPress={() => router.push({ pathname: "/admin-qr" })}>
                    <View style={[styles.actionIconWrap, { backgroundColor: "#EF4444" }, getShadowStyle(3, 0.18, 6, 2)]}>
                      <MaterialIcons name="admin-panel-settings" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.actionTitle}>Admin QR</Text>
                    <Text style={styles.actionSubtitle}>Panel Admin</Text>
                  </TouchableOpacity>
                )}
                {backendUser?.role?.toUpperCase() === 'MAESTRO' && (
                  <TouchableOpacity style={[styles.actionCard, { borderColor: "#FDE047", backgroundColor: "#FEF9C3" }, getShadowStyle(2, 0.08, 6, 2)]} onPress={() => router.push({ pathname: "/admin-qr" })}>
                    <View style={[styles.actionIconWrap, { backgroundColor: "#EAB308" }, getShadowStyle(3, 0.18, 6, 2)]}>
                      <MaterialIcons name="class" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.actionTitle}>Generar QR</Text>
                    <Text style={styles.actionSubtitle}>Iniciar Clase</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.block}>
                <Text style={styles.blockTitle}>Resumen de Hoy</Text>
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryCard, getShadowStyle(2, 0.07, 4, 1)]}>
                    <Text style={[styles.summaryCount, { color: "#10B981" }]}>{summary.present}</Text>
                    <Text style={styles.summaryLabel}>Presente</Text>
                  </View>
                  <View style={[styles.summaryCard, getShadowStyle(2, 0.07, 4, 1)]}>
                    <Text style={[styles.summaryCount, { color: "#F59E0B" }]}>{summary.late}</Text>
                    <Text style={styles.summaryLabel}>Tardanza</Text>
                  </View>
                  <View style={[styles.summaryCard, getShadowStyle(2, 0.07, 4, 1)]}>
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
                  <View style={[styles.recentCard, getShadowStyle(2, 0.07, 4, 1)]}>
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
                      <MaterialIcons name={statusToIcon[recentItem.status] || "help"} size={26} color={statusToColor[recentItem.status] || "#94A3B8"} />
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
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  shellLarge: {
    maxWidth: "100%",
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
    paddingHorizontal: "2%",
    flex: 1,
  },
  rowLayout: {
    flexDirection: "row",
    gap: 40,
    marginTop: 30,
    width: "100%",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 2,
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
  profileSummaryCard: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 22,
  },
  profileSummaryTop: {
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#CBD5E1",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  levelBadge: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: [{ translateX: -45 }],
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  profileSummaryName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  profileSummaryEmail: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  pointsCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  pointsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pointsCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  pointsCardValue: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1D4ED8",
    marginBottom: 6,
  },
  pointsCardCaption: {
    fontSize: 13,
    color: "#475569",
  },
  progressSection: {
    marginTop: 18,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressSectionLabel: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
    marginRight: 12,
  },
  progressSectionValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  progressBar: {
    marginTop: 12,
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E0F2FE",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  progressHint: {
    marginTop: 10,
    fontSize: 12,
    color: "#475569",
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
