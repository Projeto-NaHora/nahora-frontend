import { api } from "@/services/api/client";
import { useHomeStore } from "@/store/homeStore";

export function useHomeData() {
  const setSuggestedProfessionals = useHomeStore(
    (s) => s.setSuggestedProfessionals,
  );
  const setRecentOrders = useHomeStore((s) => s.setRecentOrders);

  const loadHomeData = async () => {
    try {
      // 1. Chama a API real (ajuste a rota e os params conforme o seu backend)
      const response = await api.get("/profissionais/sugeridos", {
        params: { lat: -8.05, lng: -34.88 }, // Substitua pela localização real do usuário depois!
      });

      const payload = response.data;
      const arrayDeProfissionais = Array.isArray(payload)
        ? payload
        : payload?.profissionais || [];

      // 2. Mapeia os dados usando a mesma lógica à prova de balas da busca
      const dataMapped = arrayDeProfissionais.map((prof: any) => {
        const rawCidade = prof?.cidade || "";
        const cleanCidade = rawCidade
          .replace(/null/gi, "")
          .replace(/^[,\s]+|[,\s]+$/g, "")
          .trim();

        return {
          id: prof?.id?.toString() || Math.random().toString(),
          name: prof?.nome || prof?.name || "Sem Nome",
          category: prof?.categoriaNome || prof?.categoria || "Serviços",
          location: cleanCidade || "Localização não informada",
          avatarUrl: prof?.foto || prof?.fotoPerfil || null,
          distance: prof?.distanciaKm || prof?.distancia || 0,
          rating: prof?.mediaAvaliacoes ?? 0,
          reviews: prof?.totalAvaliacoes ?? 0,
          price: 0,
          isPlus: prof?.planoPlus || false,
        };
      });

      // 3. Salva no Zustand
      setSuggestedProfessionals(dataMapped);
    } catch (error) {
      console.error("Erro ao carregar os sugeridos da Home:", error);
    }
  };

  return { loadHomeData };
}
