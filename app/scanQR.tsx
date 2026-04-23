import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { registerAttendance } from "../services/attendanceService";
import { getUser } from "../services/authService";

let Html5QrcodeScanner: any = null;

if (Platform.OS === "web") {
  Html5QrcodeScanner = require("html5-qrcode").Html5QrcodeScanner;
}

export default function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const studentId = getUser()?.id;

  const ReaderDiv =
    Platform.OS === "web"
      ? () =>
          React.createElement("div", {
            id: "reader",
            style: {
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
            },
          })
      : () => null;

  useEffect(() => {
    if (Platform.OS !== "web") {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    } else {
      setHasPermission(true);
    }
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const response = await registerAttendance(data, studentId);

      router.push({
        pathname: "/confirmacion",
        params: {
          message: response.message,
          success: "true",
          points: 5,
          course: response.courseId,
        },
      });
    } catch (error: any) {
      router.push({
        pathname: "/confirmacion",
        params: {
          message: error.message || "QR inválido o expirado",
          success: "false",
        },
      });
    }
  };

  useEffect(() => {
    if (Platform.OS === "web" && Html5QrcodeScanner) {
      let scanner: any;

      const startScanner = () => {
        try {
          if (!document.getElementById("reader")) return;

          scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 15, qrbox: { width: 280, height: 280 } },
            false
          );

          scanner.render(
            (decodedText: string) => {
              if (scanner) scanner.clear();
              handleBarCodeScanned({ data: decodedText });
            },
            () => {}
          );
        } catch (e) {
          console.error("Scanner init error", e);
        }
      };

      if (!scanned) {
        setTimeout(startScanner, 200);
      }

      return () => {
        if (scanner) {
          try {
            scanner.clear().catch((e: any) =>
              console.log("Clear scanner error", e)
            );
          } catch (e) {}
        }
      };
    }
  }, [scanned]);

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se concedió acceso a la cámara</Text>
        <View style={styles.nativeProfileButton}>
          <Button
            title="Ir a Perfil"
            onPress={() => router.replace("/(tabs)/perfil")}
            color="#3B82F6"
          />
        </View>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>Escáner Web</Text>
          <Text style={styles.webSubtitle}>
            Apunta el código QR de clase hacia la cámara
          </Text>

          <ReaderDiv />

          <View style={styles.webProfileButton}>
            <Button
              title="Ir a Perfil"
              onPress={() => router.replace("/(tabs)/perfil")}
              color="#3B82F6"
            />
          </View>

          {scanned && (
            <View style={styles.webActionButton}>
              <Button
                title="Escanear de nuevo"
                onPress={() => setScanned(false)}
                color="#4F46E5"
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>

        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>

          <View style={styles.focusedContainer}>
            <View style={styles.scanCornerTL}></View>
            <View style={styles.scanCornerTR}></View>
            <View style={styles.scanCornerBL}></View>
            <View style={styles.scanCornerBR}></View>
          </View>

          <View style={styles.unfocusedContainer}></View>
        </View>

        <View style={styles.unfocusedContainer}></View>
      </View>

      <View style={styles.mobileProfileButton}>
        <Button
          title="Ir a Perfil"
          onPress={() => router.replace("/(tabs)/perfil")}
          color="#3B82F6"
        />
      </View>

      {scanned && (
        <View style={styles.scanAgainContainer}>
          <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },

  loadingText: {
    fontSize: 16,
    color: "#333",
  },

  errorText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "bold",
    marginBottom: 20,
  },

  webContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  webCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFF",
    padding: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },

  webTitle: {
    textAlign: "center",
    fontSize: 24,
    color: "#111827",
    fontWeight: "800",
    marginBottom: 8,
  },

  webSubtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 28,
  },

  webProfileButton: {
    marginTop: 12,
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
  },

  webActionButton: {
    marginTop: 12,
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
  },

  nativeProfileButton: {
    marginTop: 12,
    width: "80%",
  },

  mobileProfileButton: {
    position: "absolute",
    top: 55,
    left: 20,
    right: 20,
    zIndex: 10,
  },

  scanAgainContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  middleContainer: {
    flexDirection: "row",
    flex: 1.5,
  },

  focusedContainer: {
    flex: 6,
    position: "relative",
  },

  scanCornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderColor: "#FFF",
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },

  scanCornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderColor: "#FFF",
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },

  scanCornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderColor: "#FFF",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },

  scanCornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderColor: "#FFF",
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
});