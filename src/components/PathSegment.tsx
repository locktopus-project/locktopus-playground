import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SEGMENT_INPUT } from "../constants";

export const PathSegment = (props: {
  close?: Function;
  onChange: (value: string) => void;
}) => {
  const [input, setInput] = useState(DEFAULT_SEGMENT_INPUT);

  const [width, setWidth] = useState(0);
  const span = useRef<any>();

  useEffect(() => {
    if (!span.current) return;

    setWidth(span.current.offsetWidth);
  }, [input]);

  return (
    <Box>
      <Box ref={span} visibility="hidden" h={0} w="fit-content" bgColor={"red"}>
        {input}
        <DeleteSegmentButton close={() => {}} />
      </Box>
      <InputGroup>
        <Input
          ml={0}
          w={`${width + 40}px`}
          type="text"
          variant={"outline"}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />
        {props.close && (
          <InputRightElement>
            <DeleteSegmentButton
              close={() => {
                props.close!();
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

const DeleteSegmentButton = (props: { close: () => void }) => {
  return (
    <IconButton
      aria-label="Delete segment"
      icon={<CloseIcon />}
      variant="ghost"
      color="red.100"
      p={0}
      size="xs"
      onClick={() => {
        props.close();
      }}
    />
  );
};
