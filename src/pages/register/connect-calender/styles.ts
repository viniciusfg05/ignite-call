import { styled, Box, Text } from "@ignite-ui/react";

export const ConectBox = styled(Box, {
  margin: "$6",
  display: "flex",
  flexDirection: "column",
});

export const ConectItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  border: "1px solid $gray600",
  padding: "$4 $6",
  borderRadius: "$md",

  marginBottom: "$2",
});

export const AuthErro = styled(Text, {
  color: "#f75a68",
  marginBottom: "$2",
});
