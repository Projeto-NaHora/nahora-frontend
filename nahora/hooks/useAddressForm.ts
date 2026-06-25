import { useReducer, useEffect } from "react";
import type { EnderecoResponse, TipoEndereco } from "@/features/profile/types";
import { buscarCep } from "@/services/cep";

// ── Types ───────────────────────────────────────────────────────────────────

interface AddressFormState {
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  padrao: boolean;
  cepBuscando: boolean;
  loaded: boolean;
}

type AddressFormAction =
  | { type: "INITIALIZE"; address: EnderecoResponse }
  | { type: "SET_FIELD"; field: keyof AddressFormState; value: string | boolean }
  | { type: "SET_CEP_RESULT"; logradouro: string; bairro: string; cidade: string; uf: string }
  | { type: "SET_CEP_BUSCANDO"; value: boolean };

// ── Module-scope pure helpers (not rebuilt on every render) ─────────────────

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

function isCepComplete(cep: string): boolean {
  return cep.replace(/\D/g, "").length === 8;
}

// ── Reducer ─────────────────────────────────────────────────────────────────

const initialState: AddressFormState = {
  tipo: "CASA",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  padrao: false,
  cepBuscando: false,
  loaded: false,
};

function addressFormReducer(
  state: AddressFormState,
  action: AddressFormAction,
): AddressFormState {
  switch (action.type) {
    case "INITIALIZE":
      return {
        tipo: action.address.tipo,
        cep: action.address.cep,
        logradouro: action.address.logradouro ?? "",
        numero: action.address.numero ?? "",
        complemento: action.address.complemento ?? "",
        bairro: action.address.bairro ?? "",
        cidade: action.address.cidade ?? "",
        uf: action.address.uf ?? "",
        padrao: action.address.padrao ?? false,
        cepBuscando: false,
        loaded: true,
      };

    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_CEP_RESULT":
      return {
        ...state,
        logradouro: action.logradouro,
        bairro: action.bairro,
        cidade: action.cidade,
        uf: action.uf,
      };

    case "SET_CEP_BUSCANDO":
      return { ...state, cepBuscando: action.value };

    default:
      return state;
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useAddressForm(existingAddress?: EnderecoResponse) {
  const [state, dispatch] = useReducer(addressFormReducer, initialState);

  // Single dispatch to initialize from existing address — no cascade
  useEffect(() => {
    if (existingAddress && !state.loaded) {
      dispatch({ type: "INITIALIZE", address: existingAddress });
    }
  }, [existingAddress, state.loaded]);

  const handleCepBlur = async () => {
    const digits = state.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    dispatch({ type: "SET_CEP_BUSCANDO", value: true });
    try {
      const result = await buscarCep(digits);
      if (result) {
        dispatch({
          type: "SET_CEP_RESULT",
          logradouro: result.logradouro ?? "",
          bairro: result.bairro ?? "",
          cidade: result.cidade ?? "",
          uf: result.estado ?? "",
        });
      }
    } catch {
      // Silently ignore CEP lookup errors
    }
    dispatch({ type: "SET_CEP_BUSCANDO", value: false });
  };

  const isValid =
    isCepComplete(state.cep) &&
    !!state.logradouro &&
    !!state.numero &&
    !!state.bairro &&
    !!state.cidade &&
    !!state.uf;

  return {
    ...state,
    dispatch,
    handleCepBlur,
    isValid,
  };
}
