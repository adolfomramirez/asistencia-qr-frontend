import { StyleSheet, Text, View } from 'react-native';

const MiComponente = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Hola, este es mi componente básico!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default MiComponente;
