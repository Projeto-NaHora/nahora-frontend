import { useMemo } from 'react';

export type Category = {
  id: string;
  name: string;
  emoji: string;
  slug: string;
};

/**
 * Mock hook that returns the list of categories shown in the B02 design (Todas as categorias).
 * The list is intentionally small and deterministic so it can be used by the UI while the
 * real API/service is implemented.
 */
export function useCategories() {
  const categories = useMemo<Category[]>(
    () => [
      { id: 'eletrica', name: 'Elétrica', emoji: '⚡', slug: 'eletrica' },
      { id: 'encanamento', name: 'Encanamento', emoji: '🔧', slug: 'encanamento' },
      { id: 'pintura', name: 'Pintura', emoji: '🎨', slug: 'pintura' },
      { id: 'limpeza', name: 'Limpeza', emoji: '🧹', slug: 'limpeza' },
      { id: 'ar-condicionado', name: 'Ar-cond.', emoji: '❄️', slug: 'ar-condicionado' },
      { id: 'marcenaria', name: 'Marcenaria', emoji: '🪵', slug: 'marcenaria' },
      { id: 'mudancas', name: 'Mudanças', emoji: '📦', slug: 'mudancas' },
      { id: 'pedreiro', name: 'Pedreiro', emoji: '🏗️', slug: 'pedreiro' },
    ],
    []
  );

  return { categories };
}

export default useCategories;
