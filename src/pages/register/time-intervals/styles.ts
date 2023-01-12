import { styled, Box, Text } from "@ignite-ui/react";

export const IntervalBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
});

export const IntervalContainer = styled("div", {
  border: "1px solid $gray600",
  borderRadius: "$md",
  marginBottom: "$4",
});

export const IntervalItem = styled("div", {
  display: "flex",
  alignContent: "center",
  justifyContent: "space-between",
  padding: "$3",

  "& + &": {
    border: "1px solid $gray600",
  },
});

export const IntervalDay = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
});

export const IntervalInputs = styled("div", {
  display: "flex",
  alignContent: "center",
  gap: "$2",

  // mudar a cor do indicador de relogio
  "input::-webkit-calendar-picker-indicator": {
    // não aceita alterar por color ou background, somente por filtro de cores
    filter: "invert(100%) brightness(30%) ",
  },
});

export const FormErros = styled(Text, {
  color: "#f75a68",
  marginBottom: "$4",
  margin: "auto $4 $4 ",
  textAlign: "center",
});
