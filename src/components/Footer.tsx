import { Box, HStack, Link, Flex, Text, Divider } from "@chakra-ui/layout";

export const Footer = () => {
  const footerBar = (
    <Flex flexDirection={"column"} alignItems="center" w="full" p={4}>
      <HStack wrap="wrap" gap={2}>
        <HStack>
          <Link color="teal.500" href="https://locktopus.xyz" target="_blank">
            Locktopus
          </Link>
          <Text>Playground</Text>
        </HStack>
        <HStack>
          <Text>Build with</Text>
          <Link color="teal.500" href="https://chakra-ui.com" target="_blank">
            Chakra UI
          </Link>
        </HStack>
      </HStack>
    </Flex>
  );

  return (
    <Box>
      <Box visibility={"hidden"}>{footerBar}</Box>
      <Box
        w="full"
        position={"fixed"}
        bottom="0px"
        backdropFilter={"brightness(0.3)"}
      >
        <Divider />
        {footerBar}
      </Box>
    </Box>
  );
};
