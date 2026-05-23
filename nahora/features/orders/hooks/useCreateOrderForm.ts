import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { orderService } from "../service";
import { useMidiasPicker } from "./useMidiasPicker";
import { buscarCep } from "@/services/cep";
import { parseApiError } from "@/utils/apiError";
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

export function useCreateOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuscandoCep, setIsBuscandoCep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const midiasPicker = useMidiasPicker();

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
    formState: { errors },
  } = form;

  const enderecoDiferente = watch("enderecoDiferente");
  const cepValue = watch("cep");

  // Autofill endereço via ViaCEP quando o CEP atinge 8 dígitos
  // setValue é omitido de propósito — é uma referência estável do react-hook-form
  useEffect(() => {
    if (!enderecoDiferente) return;

    const digits = (cepValue || "").replace(/\D/g, "");
    if (digits.length !== 8) return;

    let cancelled = false;
    setIsBuscandoCep(true);

    buscarCep(digits)
      .then((endereco) => {
        if (cancelled || !endereco) return;
        // Usa shouldValidate: false para evitar validação durante o preenchimento
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

        // 2. Monta objeto EnderecoRequest se o toggle estiver ativo
        let endereco: EnderecoRequest | undefined;
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
        }

        // 3. Monta dataDesejada = 1 semana a partir de hoje + turno
        const dataDesejada = buildDataDesejada(data.turno);

        // 4. Cria o pedido
        const created = await orderService.criar({
          categoria: data.categoria as CategoriaServico,
          descricao: data.descricao,
          endereco,
          fotos: fotosUrls,
          urgencia: data.urgencia as Urgencia,
          orcamentoEstimado: 0,
          dataDesejada,
        });

        // 5. Limpa o estado e redireciona
        midiasPicker.reset();
        router.push({
          pathname: "/(client)/(orders)/success",
          params: { orderId: String(created.id) },
        });
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
    [router, midiasPicker, setError, buildDataDesejada],
  );

  const handleClear = useCallback(() => {
    form.reset({
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
  }, [form, midiasPicker]);

  return {
    form,
    control,
    isSubmitting,
    isBuscandoCep,
    errorMessage,
    errors,
    enderecoDiferente,
    midiasPicker,
    onSubmit: handleSubmit(onSubmit),
    handleClear,
  };
}
