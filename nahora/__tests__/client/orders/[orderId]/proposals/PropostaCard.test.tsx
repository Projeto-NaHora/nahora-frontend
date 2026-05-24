import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { PropostaCard } from "@/features/proposals/components/PropostaCard";
import { createMockProposta } from "@tests/factories/proposals";

describe("PropostaCard", () => {
  const baseProposta = createMockProposta();

  test("renders profissional name", () => {
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText("Carlos Almeida")).toBeOnTheScreen();
  });

  test("renders formatted price", () => {
    render(
      <PropostaCard
        proposta={createMockProposta({ valor: 250 })}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText("R$ 250")).toBeOnTheScreen();
  });

  test("renders MELHOR AVALIADO badge when destacada", () => {
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={true}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText("MELHOR AVALIADO")).toBeOnTheScreen();
  });

  test("does not render badge when not destacada", () => {
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.queryByText("MELHOR AVALIADO")).not.toBeOnTheScreen();
  });

  test("renders initials in colored circle when no foto", () => {
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText("CA")).toBeOnTheScreen();
  });

  test("renders especialidade and localidade", () => {
    render(
      <PropostaCard
        proposta={createMockProposta({
          profissional: createMockProposta().profissional,
        })}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText("Eletricista · Recife, PE")).toBeOnTheScreen();
  });

  test("renders descricao when present", () => {
    const proposta = createMockProposta({ descricao: "Serviço rápido e barato." });
    render(
      <PropostaCard
        proposta={proposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText(/Serviço rápido e barato/)).toBeOnTheScreen();
  });

  test("renders totalServicosExecutados count", () => {
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText(/87 serviços feitos/)).toBeOnTheScreen();
  });

  test("renders distancia when present", () => {
    render(
      <PropostaCard
        proposta={createMockProposta({
          profissional: { ...baseProposta.profissional, distancia: 2.4 },
        })}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={jest.fn()}
      />,
    );
    expect(screen.getByText(/2.4 km de você/)).toBeOnTheScreen();
  });

  test("calls onNegociar when Negociar button pressed", () => {
    const onNegociar = jest.fn();
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={onNegociar}
        onVerPerfil={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByText("Negociar"));
    expect(onNegociar).toHaveBeenCalled();
  });

  test("calls onVerPerfil when Ver perfil button pressed", () => {
    const onVerPerfil = jest.fn();
    render(
      <PropostaCard
        proposta={baseProposta}
        destacada={false}
        onNegociar={jest.fn()}
        onVerPerfil={onVerPerfil}
      />,
    );
    fireEvent.press(screen.getByText("Ver perfil"));
    expect(onVerPerfil).toHaveBeenCalled();
  });
});
