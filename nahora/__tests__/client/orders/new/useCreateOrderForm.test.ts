import { renderHook, act } from '@tests/test-utils';
import { useCreateOrderForm } from '@/features/orders/hooks/useCreateOrderForm';
import { orderService } from '@/features/orders/service';

jest.mock('@/features/orders/service', () => ({
  orderService: { criar: jest.fn(), uploadMidia: jest.fn() },
}));

jest.mock('@/features/orders/hooks/useMidiasPicker', () => ({
  useMidiasPicker: () => ({
    mediaUris: [],
    isUploading: false,
    uploadError: null,
    pickFromCamera: jest.fn(),
    pickFromGallery: jest.fn(),
    removeMedia: jest.fn(),
    uploadAll: jest.fn().mockResolvedValue([]),
    reset: jest.fn(),
  }),
}));

jest.mock('@/utils/apiError', () => ({
  parseApiError: jest.fn((e) => ({
    message: (e as Error).message,
    fieldErrors: {},
    statusCode: null,
  })),
  getApiErrorMessage: jest.fn((e, fallback) => fallback),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useCreateOrderForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns form with correct default values', () => {
    const { result } = renderHook(() => useCreateOrderForm());

    expect(result.current.form.getValues()).toEqual({
      categoria: '',
      descricao: '',
      enderecoDiferente: false,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      urgencia: 'NORMAL',
      turno: 'MANHA',
    });
  });

  test('builds dataDesejada from turno + 1 week from today', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista para instalar um chuveiro novo',
      );
      result.current.form.setValue('turno', 'TARDE');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        dataDesejada: expect.stringMatching(/^20\d{2}-\d{2}-\d{2}T14:00:00$/),
        orcamentoEstimado: 0,
      }),
    );
  });

  test('uses MANHA → 08:00 for dataDesejada', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'PINTURA');
      result.current.form.setValue(
        'descricao',
        'Pintura completa do apartamento de 2 quartos',
      );
      result.current.form.setValue('turno', 'MANHA');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        dataDesejada: expect.stringMatching(/T08:00:00$/),
      }),
    );
  });

  test('sends endereco when enderecoDiferente is true', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ENCANAMENTO');
      result.current.form.setValue(
        'descricao',
        'Torneira da cozinha pingando sem parar',
      );
      result.current.form.setValue('enderecoDiferente', true);
      result.current.form.setValue('cep', '01001000');
      result.current.form.setValue('logradouro', 'Rua das Flores');
      result.current.form.setValue('numero', '123');
      result.current.form.setValue('complemento', 'Apto 45');
      result.current.form.setValue('bairro', 'Centro');
      result.current.form.setValue('cidade', 'São Paulo');
      result.current.form.setValue('estado', 'SP');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        endereco: {
          cep: '01001000',
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      }),
    );
  });

  test('does not send endereco when toggle is off', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Trocar disjuntor geral do quadro',
      );
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    const callArgs = (orderService.criar as jest.Mock).mock.calls[0][0];
    expect(callArgs.endereco).toBeUndefined();
  });

  test('validates descricao min 20 chars', async () => {
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue('descricao', 'curto');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    // Should not call service on validation failure
    expect(orderService.criar).not.toHaveBeenCalled();
    expect(result.current.errors.descricao).toBeDefined();
  });

  test('validates endereco fields when toggle is on', async () => {
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista para instalar um chuveiro',
      );
      result.current.form.setValue('enderecoDiferente', true);
      // Don't fill endereco fields — should fail validation
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).not.toHaveBeenCalled();
    expect(result.current.errors.cep?.message).toBe('CEP inválido');
    expect(result.current.errors.logradouro?.message).toBe('Informe o logradouro');
    expect(result.current.errors.numero?.message).toBe('Informe o número');
    expect(result.current.errors.bairro?.message).toBe('Informe o bairro');
    expect(result.current.errors.cidade?.message).toBe('Informe a cidade');
    expect(result.current.errors.estado?.message).toBe('Selecione um estado válido');
  });

  test('validates CEP format when enderecoDiferente is on', async () => {
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista para instalar um chuveiro',
      );
      result.current.form.setValue('enderecoDiferente', true);
      result.current.form.setValue('cep', 'abc');
      result.current.form.setValue('logradouro', 'Rua Teste');
      result.current.form.setValue('numero', '123');
      result.current.form.setValue('bairro', 'Centro');
      result.current.form.setValue('cidade', 'SP');
      result.current.form.setValue('estado', 'SP');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).not.toHaveBeenCalled();
    expect(result.current.errors.cep?.message).toBe('CEP inválido');
    expect(result.current.errors.logradouro).toBeUndefined();
    expect(result.current.errors.numero).toBeUndefined();
  });

  test('validates estado format when enderecoDiferente is on', async () => {
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista para instalar um chuveiro',
      );
      result.current.form.setValue('enderecoDiferente', true);
      result.current.form.setValue('cep', '01001000');
      result.current.form.setValue('logradouro', 'Rua Teste');
      result.current.form.setValue('numero', '123');
      result.current.form.setValue('bairro', 'Centro');
      result.current.form.setValue('cidade', 'SP');
      // Don't set estado — defaults to ''
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).not.toHaveBeenCalled();
    expect(result.current.errors.estado?.message).toBe('Selecione um estado válido');
  });

  test('passes validation when all address fields are valid', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista para instalar um chuveiro',
      );
      result.current.form.setValue('enderecoDiferente', true);
      result.current.form.setValue('cep', '01001-000');
      result.current.form.setValue('logradouro', 'Rua Teste');
      result.current.form.setValue('numero', '123');
      result.current.form.setValue('bairro', 'Centro');
      result.current.form.setValue('cidade', 'São Paulo');
      result.current.form.setValue('estado', 'SP');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(orderService.criar).toHaveBeenCalled();
  });

  test('redirects to success on successful submit', async () => {
    (orderService.criar as jest.Mock).mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'ELETRICA');
      result.current.form.setValue(
        'descricao',
        'Preciso de um eletricista urgente para instalar chuveiro',
      );
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockPush).toHaveBeenCalledWith('/(client)/(orders)/success');
  });

  test('handleClear resets form to defaults', () => {
    const { result } = renderHook(() => useCreateOrderForm());

    act(() => {
      result.current.form.setValue('categoria', 'PINTURA');
      result.current.form.setValue('descricao', 'Pintar a casa toda');
      result.current.form.setValue('turno', 'NOITE');
      result.current.handleClear();
    });

    expect(result.current.form.getValues()).toEqual({
      categoria: '',
      descricao: '',
      enderecoDiferente: false,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      urgencia: 'NORMAL',
      turno: 'MANHA',
    });
  });
});
