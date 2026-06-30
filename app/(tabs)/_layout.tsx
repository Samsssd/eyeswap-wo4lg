import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FONT_MEDIUM, FONT_SEMIBOLD } from '@/constants/fonts';

// Single starter tab. Add more <Tabs.Screen> entries (one per file you create in
// this (tabs) folder) for each top-level destination your app needs.
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarLabelStyle: { fontFamily: FONT_MEDIUM },
        headerTitleStyle: { fontFamily: FONT_SEMIBOLD },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
