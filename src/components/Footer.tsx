import {
  Box,
  HStack,
  Link,
  Flex,
  Text,
  Divider,
  Stack,
} from "@chakra-ui/layout";

export const Footer = () => {
  const footerBar = (
    <Flex flexDirection={"column"} alignItems="center" w="full" p={4}>
      <HStack wrap="wrap" gap={2}>
        <Text>Locktopus Playground</Text>
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
