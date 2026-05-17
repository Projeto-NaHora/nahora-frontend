import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F26F21",
        tabBarInactiveTintColor: "#737373",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopColor: Colors[colorScheme ?? "light"].border,
          borderTopWidth: 1,
          height: 90,
          paddingTop: 12,
          paddingBottom: 32,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.03,
          shadowRadius: 20,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter",
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="doc.text.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(chats)"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="bubble.left.and.bubble.right.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(services)"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="briefcase.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Conta",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
