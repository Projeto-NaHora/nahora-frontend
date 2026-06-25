import React, { useEffect } from "react";
import { View,
  Text,
  ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";
import { useHomeStore } from "@/store/homeStore";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import ProfessionalCard from "@/components/ui/ProfessionalCard";
import OrderCard from "@/components/ui/OrderCard";

// Array das 8 categorias exibidas na Home
const homeCategories = [
  { id: "1", name: "Elétrica", icon: "lightning-bolt" },
  { id: "2", name: "Pedreiro", icon: "wrench" },
  { id: "3", name: "Encanamento", icon: "water" },
  { id: "4", name: "Pintura", icon: "format-paint" },
  { id: "5", name: "Marcenaria", icon: "hammer" },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const user = useAuthStore((s) => s.user);
  const { loadHomeData } = useHomeData();
  const suggestedProfessionals = useHomeStore((s) => s.suggestedProfessionals);
  const recentOrders = useHomeStore((s) => s.recentOrders);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: colors.brand }]}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Laranja (orange, sits on top of brand bg) */}
        <View style={[styles.header, { backgroundColor: colors.brand }]}>
          <View style={styles.headerTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.greetingText, { color: colors.onBrand }]}>
                Olá, {user?.nome?.split(" ")[0] || "Usuário"} 👋
              </Text>
              <Text style={[styles.mainTitle, { color: colors.onBrand }]}>O que você precisa hoje?</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.notifButton, pressed && { opacity: 0.7 }]}
              onPress={() => router.push("/(client)/(home)/notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.notifBadge} />
            </Pressable>
          </View>


          <Pressable
            style={[styles.searchBar, { backgroundColor: colors.background }]}
            onPress={() => router.push("/(client)/(home)/categories")}
          >
            <Feather name="search" size={20} color={colors.icon} />
            <Text style={[styles.searchPlaceholder, { color: colors.placeholder }]}>
              Buscar serviço, profissional...
            </Text>
          </Pressable>
        </View>

        {/* White-background sections below the header */}
        <View style={{ backgroundColor: colors.background }}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }, {paddingTop: 20}]}>Categorias</Text>
              <Pressable
                onPress={() => router.push("/(client)/(home)/categories")}
              >
                <Text style={[styles.seeAllText, { color: colors.link }]}>Ver todas</Text>
              </Pressable>
            </View>

            <View style={styles.categoriesGrid}>
              {homeCategories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() =>
                    router.push({
                      pathname: "/(client)/(home)/category/[id]",
                      params: {
                        id: cat.name,
                        icon: cat.icon,
                        categoriaId: cat.id,
                      },
                    })
                  }
                >
                  <View style={[styles.categoryIconBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={28}
                      color={colors.icon}
                    />
                  </View>
                  <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{cat.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sugeridos para você */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sugeridos para você</Text>
              <Pressable>
                <Text style={[styles.seeAllText, { color: colors.link }]}>Ver mais</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {suggestedProfessionals.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Nenhum profissional sugerido.
                </Text>
              ) : (
                suggestedProfessionals.map((prof) => (
                  <ProfessionalCard
                    key={prof.id}
                    professional={prof}
                    onPress={() =>
                      router.push({
                        pathname: "/(client)/(home)/professional/[id]",
                        params: { id: prof.id },
                      })
                    }
                  />
                ))
              )}
            </ScrollView>
          </View>

          {/* Meus pedidos recentes */}
          <View style={[styles.sectionContainerRecent, { paddingBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Meus pedidos recentes</Text>
              <Pressable>
                <Text style={[styles.seeAllText, { color: colors.link }]}>Ver todos</Text>
              </Pressable>
            </View>

            {recentOrders.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum pedido recente.</Text>
            ) : (
              recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    backgroundColor: "#F97316",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 40,
  },
  greetingText: { color: "#FFFFFF", fontSize: 16, marginBottom: 4 },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  searchPlaceholder: { marginLeft: 8, color: "#9CA3AF", fontSize: 16 },
  sectionContainer: { marginBottom: 40 },
  sectionContainerRecent: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  seeAllText: { color: "#F97316", fontSize: 14, fontWeight: "600" },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4D4F",
  },

  categoryText: { fontSize: 12, color: "#4B5563", textAlign: "center" },
  horizontalScrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyText: { color: "#9CA3AF", paddingHorizontal: 24 },
});

