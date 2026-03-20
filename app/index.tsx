import { Redirect } from 'expo-router';
import { getToken } from '../services/authService';

export default function Index() {
  const token = getToken();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
