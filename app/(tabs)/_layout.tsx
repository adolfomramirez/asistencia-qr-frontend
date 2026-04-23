import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { getToken } from '../../services/authService';

export default function TabLayout() {
  const token = getToken();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 10,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="grid-view" color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color, fontSize: 14, fontWeight: focused ? '700' : '500' }}>
              Inicio
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="history" color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color, fontSize: 14, fontWeight: focused ? '700' : '500' }}>
              Historial
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="person-outline" color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color, fontSize: 14, fontWeight: focused ? '700' : '500' }}>
              Perfil
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}