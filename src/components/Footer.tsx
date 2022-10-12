import { Box, HStack, Link, Flex, Text, Divider } from "@chakra-ui/layout";

export const Footer = () => {
  const footerBar = (
    <Flex flexDirection={"column"} alignItems="center" w="full">
      <HStack p={4} gap={16} wrap="wrap">
        <Text>Gearlock Playground</Text>
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
      <Box w="full" position={"fixed"} bottom="0px">
        <Divider />
        {footerBar}
      </Box>
    </Box>
  );
};
