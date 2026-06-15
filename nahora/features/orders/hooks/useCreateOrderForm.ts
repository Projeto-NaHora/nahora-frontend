import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSWRConfig } from "swr";
import useSWR from "swr";

import { orderService } from "../service";
import { useOrderDetail } from "./useOrders";
import { useMidiasPicker } from "./useMidiasPicker";
import { buscarCep } from "@/services/cep";
import { geocodeAddress } from "@/services/geocode";
import { parseApiError } from "@/utils/apiError";
import { getTurnoKey } from "../types";
import { profileService } from "@/features/profile/service";
import type { EnderecoResponse } from "@/features/profile/types";
import type { CriarPedidoFormValues, EnderecoRequest } from "../types";
import type { CategoriaServico, Urgencia } from "@/types/enums";

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

export function useCreateOrderForm(editId?: number) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuscandoCep, setIsBuscandoCep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const midiasPicker = useMidiasPicker();

  // Fetch saved addresses to find default
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
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = form;

  const enderecoDiferente = watch("enderecoDiferente");
  const cepValue = watch("cep");

  // Carrega pedido existente para edicao
  const editIdNum = editId ?? 0;
  const { data: existingOrder } = useOrderDetail(editIdNum);

  useEffect(() => {
    if (!editId || !existingOrder) return;

    const turno = getTurnoKey(existingOrder.dataDesejada) ?? "MANHA";

    reset({
      categoria: existingOrder.categoria ?? "",
      descricao: existingOrder.descricao ?? "",
      enderecoDiferente: !!existingOrder.endereco,
      cep: existingOrder.endereco?.cep ?? "",
      logradouro: existingOrder.endereco?.logradouro ?? "",
      numero: existingOrder.endereco?.numero ?? "",
      complemento: "",
      bairro: existingOrder.endereco?.bairro ?? "",
      cidade: existingOrder.endereco?.cidade ?? "",
      estado: "",
      urgencia: existingOrder.urgencia ?? "NORMAL",
      turno,
    });
  }, [editId, existingOrder, reset]);

  // Autofill endereço via ViaCEP quando o CEP atinge 8 dígitos
  useEffect(() => {
    if (!enderecoDiferente) return;

    const digits = (cepValue || "").replace(/\D/g, "");
    if (digits.length !== 8) return;

    let cancelled = false;
    setIsBuscandoCep(true);

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

    return () => {
      cancelled = true;
    };
  }, [cepValue, enderecoDiferente]);

  /** Data desejada = 1 semana a partir de hoje + hora do turno */
  const buildDataDesejada = useCallback((turno: string): string => {
    const horaMap: Record<string, string> = {
      MANHA: "08:00:00",
      TARDE: "14:00:00",
      NOITE: "19:00:00",
    };
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const data = nextWeek.toISOString().slice(0, 10);
    const hora = horaMap[turno] ?? "08:00:00";
    return `${data}T${hora}`;
  }, []);

  const onSubmit = useCallback(
    async (data: CriarPedidoFormValues) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        // 1. Faz upload das midias e obtem as URLs
        let fotosUrls: string[] | undefined;
        if (midiasPicker.mediaUris.length > 0) {
          fotosUrls = await midiasPicker.uploadAll();
        }

        // 2. Monta objeto EnderecoRequest se o toggle estiver ativo;
        // caso contrário, usa o endereço padrão salvo
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

          // Geocode do endereco para obter latitude/longitude
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

        // 3. Monta dataDesejada = 1 semana a partir de hoje + turno
        const dataDesejada = buildDataDesejada(data.turno);

        const payload = {
          categoria: data.categoria as CategoriaServico,
          descricao: data.descricao,
          endereco,
          enderecoId,
          fotos: fotosUrls,
          urgencia: data.urgencia as Urgencia,
          orcamentoEstimado: 0,
          dataDesejada,
        };

        if (editId) {
          await orderService.atualizar(editId, payload);
          mutate(`order-${editId}`);
          router.back();
        } else {
          const created = await orderService.criar(payload);
          midiasPicker.reset();
          router.push({
            pathname: "/(client)/(orders)/success",
            params: { orderId: String(created.id) },
          });
        }
      } catch (error) {
        const parsed = parseApiError(
          error,
          "Erro ao salvar pedido. Tente novamente.",
        );
        setErrorMessage(parsed.message);

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
    [editId, router, midiasPicker, setError, buildDataDesejada, mutate],
  );

  const handleClear = useCallback(() => {
    reset({
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
    });
    midiasPicker.reset();
  }, [reset, midiasPicker]);

  return {
    form,
    control,
    isSubmitting,
    isBuscandoCep,
    errorMessage,
    errors,
    enderecoDiferente,
    defaultAddress,
    midiasPicker,
    isEditing: !!editId,
    onSubmit: handleSubmit(onSubmit),
    handleClear,
  };
}
