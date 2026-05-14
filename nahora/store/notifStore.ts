import { create } from 'zustand';

interface NotifState {
  /**
   * O número total de notificações não lidas.
   */
  unreadCount: number;

  /**
   * Define o contador exato (útil ao buscar o total do backend no login ou refresh).
   */
  setUnreadCount: (count: number) => void;

  /**
   * Incrementa o contador (útil quando chega um push do FCM via expo-notifications).
   */
  increment: () => void;

  /**
   * Decrementa o contador (útil quando o usuário marca uma notificação como lida).
   * Garante que o número nunca fique negativo.
   */
  decrement: () => void;

  /**
   * Zera o contador (útil no logout).
   */
  clear: () => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  unreadCount: 0,

  setUnreadCount: (count) => set({ unreadCount: count }),

  increment: () => 
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  decrement: () => 
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  clear: () => set({ unreadCount: 0 }),
}));