import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR, { useSWRConfig } from "swr";

import { orderService } from "../service";
import { useMidiasPicker } from "./useMidiasPicker";
import { useOrderDetail } from "./useOrders";
import { buscarCep } from "@/services/cep";
import { geocodeAddress } from "@/services/geocode";
import { parseApiError } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";
import type { EnderecoResponse } from "@/features/profile/types";
import type { CriarPedidoFormValues, EnderecoRequest } from "../types";
import type { CategoriaServico, Urgencia } from "@/types/enums";
import { getTurnoKey } from "../types";

const schema = z
  .object({
    categoria: z.string().min(1, "Selecione um tipo de servico"),
    descricao: z
      .string()
      .min(20, "Descreva o servico com pelo menos 20 caracteres")
      .max(500, "Maximo de 500 caracteres"),
    enderecoDiferente: z.boolean(),
    cep: z.string(),
    logradouro: z.string(),
    numero: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
    urgencia: z.string().min(1, "Selecione a urgencia"),
    turno: z.string().min(1, "Selecione um turno"),
  })
  .superRefine((data, ctx) => {
    if (!data.enderecoDiferente) return;

    if (!/^\d{5}-?\d{3}$/.test(data.cep)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEP inválido",
        path: ["cep"],
      });
    }
    if (data.logradouro.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o logradouro",
        path: ["logradouro"],
      });
    }
    if (data.numero.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número",
        path: ["numero"],
      });
    }
    if (data.bairro.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o bairro",
        path: ["bairro"],
      });
    }
    if (data.cidade.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe a cidade",
        path: ["cidade"],
      });
    }
    if (data.estado.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um estado válido",
        path: ["estado"],
      });
    }
  });

/** Remove query params de presign (?X-Amz-...) de URLs do storage */
function stripPresignedParams(url: string): string {
  const qIndex = url.indexOf("?");
  return qIndex >= 0 ? url.substring(0, qIndex) : url;
}

export function useEditOrderForm(orderId: number) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuscandoCep, setIsBuscandoCep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  const midiasPicker = useMidiasPicker();

  // Fetch the existing order
  const {
    data: pedido,
    isLoading: swrLoading,
    error: orderError,
    mutate: mutateOrder,
  } = useOrderDetail(orderId);

  // Global SWR mutate for cache invalidation
  const { mutate: globalMutate } = useSWRConfig();

  // Fetch saved addresses
  const { data: savedAddresses } = useSWR<EnderecoResponse[]>(
    "saved-addresses",
    () => profileService.listarEnderecos(),
    { revalidateOnFocus: false },
  );
  const defaultAddress = savedAddresses?.find((a) => a.padrao) ?? null;

  const form = useForm<CriarPedidoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoria: "",
      descricao: "",
      enderecoDiferente: false,
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      urgencia: "NORMAL",
      turno: "MANHA",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = form;

  const enderecoDiferente = useWatch({ control, name: "enderecoDiferente" });
  const cepValue = useWatch({ control, name: "cep" });

  // Pre-fill form when order data loads
  useEffect(() => {
    if (!pedido) return;

    const turno = getTurnoKey(pedido.dataDesejada) ?? "MANHA";

    reset({
      categoria: pedido.categoria ?? "",
      descricao: pedido.descricao ?? "",
      enderecoDiferente: pedido.endereco != null,
      cep: pedido.endereco?.cep ?? "",
      logradouro: pedido.endereco?.logradouro ?? "",
      numero: pedido.endereco?.numero ?? "",
      complemento: "",
      bairro: pedido.endereco?.bairro ?? "",
      cidade: pedido.endereco?.cidade ?? "",
      estado: pedido.endereco?.estado ?? "",
      urgencia: pedido.urgencia ?? "NORMAL",
      turno,
    });

    // Initialize existing media
    if (pedido.fotos && pedido.fotos.length > 0) {
      midiasPicker.initExistingUrls(pedido.fotos);
    }

    setIsLoadingOrder(false);
  }, [pedido, reset, midiasPicker.initExistingUrls]);

  // Set loading complete when SWR finishes (even if pedido is null)
  useEffect(() => {
    if (!swrLoading) {
      setIsLoadingOrder(false);
    }
  }, [swrLoading]);

  // Autofill endereço via ViaCEP quando o CEP atinge 8 dígitos
  useEffect(() => {
    if (!enderecoDiferente) return;

    const digits = (cepValue || "").replace(/\D/g, "");
    if (digits.length !== 8) return;

    let cancelled = false;

    buscarCep(digits)
      .then((endereco) => {
        if (cancelled || !endereco) return;
        setValue("logradouro", endereco.logradouro, {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("bairro", endereco.bairro, {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("cidade", endereco.cidade, {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("estado", endereco.estado, {
          shouldValidate: false,
          shouldDirty: false,
        });
      })
      .catch(() => {
        // CEP inválido ou falha de rede — usuário preenche manualmente
      })
      .finally(() => {
        if (!cancelled) setIsBuscandoCep(false);
      });

    queueMicrotask(() => {
      if (!cancelled) setIsBuscandoCep(true);
    });

    return () => {
      cancelled = true;
    };
  }, [cepValue, enderecoDiferente, setValue]);

  const buildDataDesejada = (turno: string): string => {
    const horaMap: Record<string, string> = {
      MANHA: "08:00:00",
      TARDE: "14:00:00",
      NOITE: "19:00:00",
    };
    const hora = horaMap[turno] ?? "08:00:00";
    return `2099-01-01T${hora}`;
  };

  const onSubmit = async (data: CriarPedidoFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Monta lista final de fotos: existingUrls mantidas + novas enviadas
      let fotosUrls: string[] | undefined;

      const keptUrls = midiasPicker.existingUrls;

      if (midiasPicker.mediaUris.length > 0) {
        const uploadedUrls = await midiasPicker.uploadAll();
        const newUrls = uploadedUrls.map(stripPresignedParams);
        fotosUrls = [...keptUrls, ...newUrls];
      } else {
        fotosUrls = keptUrls.length > 0 ? keptUrls : undefined;
      }

      // 2. Monta objeto EnderecoRequest se o toggle estiver ativo
      let endereco: EnderecoRequest | undefined;
      let enderecoId: number | undefined;
      if (data.enderecoDiferente) {
        endereco = {
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento || undefined,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
        };

        try {
          const address = `${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.cidade}, ${data.estado}`;
          const coords = await geocodeAddress(address);
          if (coords) {
            endereco.latitude = coords.lat;
            endereco.longitude = coords.lng;
          }
        } catch {
          // prossegue sem coordenadas se o geocoding falhar
        }
      } else if (defaultAddress) {
        enderecoId = defaultAddress.id;
      }

      // 3. Monta dataDesejada
      const dataDesejada = buildDataDesejada(data.turno);

      await orderService.atualizar(orderId, {
        descricao: data.descricao,
        categoria: data.categoria as CategoriaServico,
        urgencia: data.urgencia as Urgencia,
        fotos: fotosUrls,
        dataDesejada,
        endereco,
        enderecoId,
      });

      // Mutate the SWR cache for this order and the orders list
      await mutateOrder();
      await globalMutate((key) => typeof key === "string" && key.startsWith("meus-pedidos"));

      midiasPicker.reset();
      router.back();
    } catch (error) {
      const parsed = parseApiError(
        error,
        "Erro ao editar pedido. Tente novamente.",
      );

      let mensagem = parsed.message;
      if (!parsed.fieldErrors || Object.keys(parsed.fieldErrors).length === 0) {
        if (parsed.statusCode === 400) {
          mensagem =
            parsed.message ||
            "Dados inválidos. Verifique os campos e tente novamente.";
        } else if (parsed.statusCode === 422) {
          mensagem =
            parsed.message ||
            "Não foi possível processar o pedido. Verifique os dados.";
        } else if (parsed.statusCode === 500) {
          mensagem = "Erro interno do servidor. Tente novamente mais tarde.";
        } else if (parsed.statusCode === undefined) {
          mensagem =
            "Erro de conexão. Verifique sua internet e tente novamente.";
        }
      }
      setErrorMessage(mensagem);

      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field in form.getValues()) {
          setError(field as keyof CriarPedidoFormValues, {
            type: "server",
            message,
          });
        }
      }
    }
    setIsSubmitting(false);
  };

  const handleClear = () => {
    // Volta ao estado original (dados do pedido)
    if (!pedido) {
      reset();
      midiasPicker.reset();
      return;
    }

    const turno = getTurnoKey(pedido.dataDesejada) ?? "MANHA";

    reset({
      categoria: pedido.categoria ?? "",
      descricao: pedido.descricao ?? "",
      enderecoDiferente: pedido.endereco != null,
      cep: pedido.endereco?.cep ?? "",
      logradouro: pedido.endereco?.logradouro ?? "",
      numero: pedido.endereco?.numero ?? "",
      complemento: "",
      bairro: pedido.endereco?.bairro ?? "",
      cidade: pedido.endereco?.cidade ?? "",
      estado: pedido.endereco?.estado ?? "",
      urgencia: pedido.urgencia ?? "NORMAL",
      turno,
    });

    midiasPicker.reset();
    if (pedido.fotos && pedido.fotos.length > 0) {
      midiasPicker.initExistingUrls(pedido.fotos);
    }
  };

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return {
    pedido,
    form,
    control,
    isSubmitting,
    isBuscandoCep,
    errorMessage,
    errors,
    enderecoDiferente,
    isLoadingOrder,
    orderError,
    midiasPicker,
    onSubmit: handleSubmit(onSubmit),
    handleClear,
    handleCancel,
  };
}
