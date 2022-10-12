import { CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { DEFAULT_SEGMENT_INPUT } from "../constants";

export const PathSegment = (props: {
  close?: Function;
  onChange: (value: string) => void;
}) => {
  const [input, setInput] = useState(DEFAULT_SEGMENT_INPUT);

  return (
    <InputGroup>
      <Input
        ml={0}
        w={`${input.length + 4 + Number(!!props.close) * 2}ch`}
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
