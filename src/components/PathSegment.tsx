import { CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

export const PathSegment = (props: {
  close?: Function;
  onChange: (value: string) => void;
}) => {
  const [input, setInput] = useState("");

  return (
    <InputGroup>
      <Input
        ml={0}
        w={`${input.length + 8}ch`}
        type="text"
        variant={"outline"}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      />
      {props.close && (
        <InputRightElement>
          <IconButton
            aria-label="Delete segment"
            icon={<CloseIcon />}
            variant="ghost"
            color="red.100"
            p={0}
            size="xs"
            onClick={() => {
              props.close!();
            }}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
