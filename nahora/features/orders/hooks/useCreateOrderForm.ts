import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { orderService } from "../service";
import { useMidiasPicker } from "./useMidiasPicker";
import { parseApiError } from "@/utils/apiError";
import type { CriarPedidoFormValues } from "../types";

const schema = z.object({
  categoria: z.string().min(1, "Selecione um tipo de serviço"),
  descricao: z
    .string()
    .min(10, "Descreva o serviço com pelo menos 10 caracteres"),
  enderecoDiferente: z.boolean(),
  enderecoId: z.number().optional(),
  turno: z.string().min(1, "Selecione um turno"),
});

export function useCreateOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const midiasPicker = useMidiasPicker();

  const form = useForm<CriarPedidoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoria: "",
      descricao: "",
      enderecoDiferente: false,
      enderecoId: undefined,
      turno: "MANHA",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = form;

  const enderecoDiferente = watch("enderecoDiferente");

  const onSubmit = useCallback(
    async (data: CriarPedidoFormValues) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        // 1. Faz upload das mídias (se houver) e obtém as URLs
        let midiasUrls: string[] | undefined;
        if (midiasPicker.mediaUris.length > 0) {
          midiasUrls = await midiasPicker.uploadAll();
        }

        // 2. Cria o pedido com as URLs das mídias anexadas
        await orderService.criar({
          titulo: data.categoria,
          descricao: data.descricao,
          categoria: data.categoria,
          urgencia: "NORMAL",
          enderecoId:
            data.enderecoDiferente && data.enderecoId ? data.enderecoId : 0,
          midias: midiasUrls,
        });

        // 3. Limpa o estado de mídias e redireciona
        midiasPicker.reset();
        router.push("/(client)/(orders)/success");
      } catch (error) {
        const parsed = parseApiError(
          error,
          "Erro ao criar pedido. Tente novamente.",
        );
        setErrorMessage(parsed.message);

        // Define erros de campo recebidos do backend
        for (const [field, message] of Object.entries(parsed.fieldErrors)) {
          if (field in form.getValues()) {
            setError(field as keyof CriarPedidoFormValues, {
              type: "server",
              message,
            });
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, midiasPicker, setError],
  );

  const handleClear = useCallback(() => {
    form.reset({
      categoria: "",
      descricao: "",
      enderecoDiferente: false,
      enderecoId: undefined,
      turno: "MANHA",
    });
    midiasPicker.reset();
  }, [form, midiasPicker]);

  return {
    form,
    control,
    isSubmitting,
    errorMessage,
    errors,
    enderecoDiferente,
    midiasPicker,
    onSubmit: handleSubmit(onSubmit),
    handleClear,
  };
}
