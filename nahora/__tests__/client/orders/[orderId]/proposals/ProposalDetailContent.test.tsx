import React from "react";
import { render, screen, fireEvent } from "@tests/test-utils";
import { ProposalDetailContent } from "@/features/proposals/components/ProposalDetailContent";
import { createMockProposta, createMockHorarioSlotList } from "@tests/factories/proposals";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

const mockProposal = createMockProposta({
  valor: 350,
  horariosDisponiveis: createMockHorarioSlotList(2),
});

describe("ProposalDetailContent", () => {
  test("renders professional name in badge", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("Carlos Almeida")).toBeOnTheScreen();
  });

  test("renders initials in avatar circle", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("CA")).toBeOnTheScreen();
  });

  test("renders section heading", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText(/Revise os dias da prestação/)).toBeOnTheScreen();
  });

  test("renders time slot heading", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("Resumo dos horários")).toBeOnTheScreen();
  });

  test("renders financial card with formatted value", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("350,00")).toBeOnTheScreen();
    expect(screen.getByText("Valor total da proposta")).toBeOnTheScreen();
  });

  test("renders accept and reject buttons", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("Aceitar proposta")).toBeOnTheScreen();
    expect(screen.getByText("Recusar")).toBeOnTheScreen();
  });

  test("shows spinner on accept button when isAccepting is true", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={true}
      />,
    );
    const activityIndicator =
      screen.UNSAFE_getByType(require("react-native").ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });

  test("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={onBack}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    fireEvent.press(screen.getByText("←"));
    expect(onBack).toHaveBeenCalled();
  });

  test("calls onAccept when accept button pressed", () => {
    const onAccept = jest.fn();
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={onAccept}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    fireEvent.press(screen.getByText("Aceitar proposta"));
    expect(onAccept).toHaveBeenCalled();
  });

  test("calls onReject when reject button pressed", () => {
    const onReject = jest.fn();
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={onReject}
        isAccepting={false}
      />,
    );
    fireEvent.press(screen.getByText("Recusar"));
    expect(onReject).toHaveBeenCalled();
  });

  test("disables buttons when isAccepting is true", () => {
    const onAccept = jest.fn();
    const onReject = jest.fn();
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={onAccept}
        onReject={onReject}
        isAccepting={true}
      />,
    );
    fireEvent.press(screen.getByText("Recusar"));
    expect(onAccept).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
  });

  test("renders header title", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("Detalhes da proposta")).toBeOnTheScreen();
  });

  test("renders calendar month selector", () => {
    render(
      <ProposalDetailContent
        proposal={mockProposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    const now = new Date();
    const monthLabel = `${[
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ][now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByText(monthLabel)).toBeOnTheScreen();
  });

  test("renders proposal with no horarios without crashing", () => {
    const proposal = createMockProposta({ horariosDisponiveis: undefined });
    render(
      <ProposalDetailContent
        proposal={proposal}
        onBack={jest.fn()}
        onAccept={jest.fn()}
        onReject={jest.fn()}
        isAccepting={false}
      />,
    );
    expect(screen.getByText("Resumo dos horários")).toBeOnTheScreen();
  });
});
