import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { registerAttendance } from "../services/attendanceService";
import { getUser } from "../services/authService";

export default function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const studentId = getUser()?.id;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
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

  if (hasPermission === null) return <Text>Solicitando permiso de cámara...</Text>;
  if (hasPermission === false) return <Text>No se concedió acceso a la cámara</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
