import axios from "axios";

/** Retorno da API ViaCEP */
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * Busca endereço pelo CEP usando a API pública do ViaCEP.
 *
 * @param cep CEP com 8 dígitos (apenas números).
 * @returns Dados do endereço ou `null` se o CEP não for encontrado.
 */
export async function buscarCep(cep: string): Promise<EnderecoViaCep | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const { data } = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${digits}/json/`,
  );

  if (data.erro) return null;

  return {
    cep: data.cep,
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
}
