import React from 'react';
import { render, screen, fireEvent } from '@tests/test-utils';
import { useForm } from 'react-hook-form';
import { OrderFormContent } from '@/features/orders/components/OrderFormContent';
import type { CriarPedidoFormValues } from '@/features/orders/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

const defaultValues: CriarPedidoFormValues = {
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
};

function TestHarness({
  isSubmitting = false,
  enderecoDiferente = false,
  errorMessage = null,
  errors = {},
  mediaUris = [],
  isUploadingMedia = false,
  uploadError = null,
  onPickFromCamera = jest.fn(),
  onPickFromGallery = jest.fn(),
  onRemoveMedia = jest.fn(),
  onSubmit = jest.fn(),
  onClear = jest.fn(),
}: Partial<{
  isSubmitting: boolean;
  enderecoDiferente: boolean;
  errorMessage: string | null;
  errors: Record<string, { message?: string }>;
  mediaUris: string[];
  isUploadingMedia: boolean;
  uploadError: string | null;
  onPickFromCamera: () => void;
  onPickFromGallery: () => void;
  onRemoveMedia: (index: number) => void;
  onSubmit: () => void;
  onClear: () => void;
}>) {
  const { control } = useForm<CriarPedidoFormValues>({ defaultValues });

  return (
    <OrderFormContent
      control={control}
      isSubmitting={isSubmitting}
      enderecoDiferente={enderecoDiferente}
      errorMessage={errorMessage}
      errors={errors as any}
      mediaUris={mediaUris}
      isUploadingMedia={isUploadingMedia}
      uploadError={uploadError}
      onPickFromCamera={onPickFromCamera}
      onPickFromGallery={onPickFromGallery}
      onRemoveMedia={onRemoveMedia}
      onSubmit={onSubmit}
      onClear={onClear}
    />
  );
}

describe('OrderFormContent', () => {
  test('renders title and subtitle', () => {
    render(<TestHarness />);

    expect(screen.getByText('Cadastro Pedido')).toBeOnTheScreen();
    expect(
      screen.getByText('Preencha as informações do seu pedido'),
    ).toBeOnTheScreen();
  });

  test('renders categoria picker placeholder', () => {
    render(<TestHarness />);

    expect(screen.getByText('Tipo')).toBeOnTheScreen();
  });

  test('renders descricao field', () => {
    render(<TestHarness />);

    expect(screen.getByText('Descrição')).toBeOnTheScreen();
  });

  test('renders turno chips', () => {
    render(<TestHarness />);

    expect(screen.getByText('Turno disponível')).toBeOnTheScreen();
    expect(screen.getByText('Manha')).toBeOnTheScreen();
    expect(screen.getByText('Tarde')).toBeOnTheScreen();
    expect(screen.getByText('Noite')).toBeOnTheScreen();
  });

  test('renders urgencia chips', () => {
    render(<TestHarness />);

    expect(screen.getByText('Urgência')).toBeOnTheScreen();
    expect(screen.getByText('Normal')).toBeOnTheScreen();
    expect(screen.getByText('Baixa')).toBeOnTheScreen();
    expect(screen.getByText('Urgente')).toBeOnTheScreen();
  });

  test('renders media buttons', () => {
    render(<TestHarness />);

    expect(screen.getByText('Câmera')).toBeOnTheScreen();
    expect(screen.getByText('Galeria')).toBeOnTheScreen();
  });

  test('renders action buttons', () => {
    render(<TestHarness />);

    expect(screen.getByText('Limpar')).toBeOnTheScreen();
    expect(screen.getByText('Criar Pedido')).toBeOnTheScreen();
  });

  test('disables submit button when submitting', () => {
    render(<TestHarness isSubmitting={true} />);

    const button = screen.getByText('Criando...');
    expect(button).toBeOnTheScreen();
  });

  test('shows endereco checkbox toggle', () => {
    render(<TestHarness />);

    expect(
      screen.getByText(/Usar endereço diferente/),
    ).toBeOnTheScreen();
  });

  test('shows endereco fields when toggle is on', () => {
    render(<TestHarness enderecoDiferente={true} />);

    expect(screen.getByText('CEP')).toBeOnTheScreen();
    expect(screen.getByText('Logradouro')).toBeOnTheScreen();
    expect(screen.getByText('Número')).toBeOnTheScreen();
    expect(screen.getByText('Complemento')).toBeOnTheScreen();
    expect(screen.getByText('Bairro')).toBeOnTheScreen();
    expect(screen.getByText('Cidade')).toBeOnTheScreen();
    expect(screen.getByText('Estado')).toBeOnTheScreen();
  });

  test('hides endereco fields when toggle is off', () => {
    render(<TestHarness enderecoDiferente={false} />);

    expect(screen.queryByText('CEP')).not.toBeOnTheScreen();
    expect(screen.queryByText('Logradouro')).not.toBeOnTheScreen();
  });

  test('shows global error message', () => {
    render(<TestHarness errorMessage="Erro ao criar pedido" />);

    expect(screen.getByText('Erro ao criar pedido')).toBeOnTheScreen();
  });

  test('shows field-level error messages', () => {
    render(
      <TestHarness
        errors={{
          categoria: { message: 'Selecione um tipo' },
          descricao: { message: 'Descreva melhor' },
          turno: { message: 'Selecione um turno' },
          urgencia: { message: 'Selecione a urgencia' },
        }}
      />,
    );

    expect(screen.getByText('Selecione um tipo')).toBeOnTheScreen();
    expect(screen.getByText('Descreva melhor')).toBeOnTheScreen();
    expect(screen.getByText('Selecione um turno')).toBeOnTheScreen();
    expect(screen.getByText('Selecione a urgencia')).toBeOnTheScreen();
  });

  test('shows upload error', () => {
    render(<TestHarness uploadError="Permissão de câmera não concedida." />);

    expect(
      screen.getByText('Permissão de câmera não concedida.'),
    ).toBeOnTheScreen();
  });

  test('shows media preview with remove badges', () => {
    render(
      <TestHarness mediaUris={['file://test/photo1.jpg', 'file://test/photo2.jpg']} />,
    );

    // Should have 2 images rendered
    const images = screen.UNSAFE_getAllByType(require('react-native').Image);
    expect(images.length).toBe(2);
  });

  test('shows uploading status text', () => {
    render(<TestHarness isUploadingMedia={true} />);

    expect(screen.getByText('Enviando imagens...')).toBeOnTheScreen();
  });

  test('calls onClear when Limpar button pressed', () => {
    const onClear = jest.fn();
    render(<TestHarness onClear={onClear} />);

    fireEvent.press(screen.getByText('Limpar'));
    expect(onClear).toHaveBeenCalled();
  });

  test('calls onSubmit when Criar Pedido button pressed', () => {
    const onSubmit = jest.fn();
    render(<TestHarness onSubmit={onSubmit} />);

    fireEvent.press(screen.getByText('Criar Pedido'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
