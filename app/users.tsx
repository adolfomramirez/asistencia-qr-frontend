import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { getUsers } from "../services/usersService";

type User = {
  id: number;
  username: string;
  name?: string;
  email: string;
};

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then((res) => {
        console.log("Usuarios recibidos:", res); // 👀 Verifica qué campos llegan
        setUsers(res);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudieron cargar los usuarios");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Usuarios:</Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <FlatList
        data={users}
        keyExtractor={(item, index) =>
          item.id?.toString() || item.username || item.email || index.toString()
        }
        renderItem={({ item }) => (
          <Text>
            {item.username || item.name || item.email || "Usuario sin datos"}
          </Text>
        )}
      />
    </View>
  );
}
