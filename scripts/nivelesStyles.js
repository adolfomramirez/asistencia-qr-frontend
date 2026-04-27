import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  header: {
    padding: 20,
    backgroundColor: "#6a11cb",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  progressContainer: {
    height: 10,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6a11cb",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 12,
  },
  benefitsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  benefit: {
    fontSize: 12,
    color: "#555",
  },
  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  },
  iconBoxoro: {
    backgroundColor: "#f5c52a", // color del cuadrito
    padding: 8,                // espacio alrededor del icono
    borderRadius: 10,          // bordes redondeados
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxplata: {
    backgroundColor: "#a8a18b", // color del cuadrito
    padding: 8,                // espacio alrededor del icono
    borderRadius: 10,          // bordes redondeados
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxbronce: {
    backgroundColor: "#df5e08", // color del cuadrito
    padding: 8,                // espacio alrededor del icono
    borderRadius: 10,          // bordes redondeados
    alignItems: "center",
    justifyContent: "center",
},
});