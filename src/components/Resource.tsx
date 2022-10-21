import { AddIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Badge, HStack, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DEFAULT_RESOURCE_WRITE, DEFAULT_SEGMENT_INPUT } from "../constants";
import { ResourceRef } from "../types";
import { PathSegment } from "./PathSegment";

export const Resource = (props: {
  onChange: (resource: ResourceRef) => void;
}) => {
  const { onChange } = props;
  const [isWrite, setIsWrite] = useState(DEFAULT_RESOURCE_WRITE);
  const [segments, setSegments] = useState<string[]>([]);

  useEffect(() => {
    onChange({
      write: isWrite,
      path: segments,
    });
  }, [isWrite, segments, onChange]);

  const toggleButton = isWrite ? (
    <IconButton
      aria-label="write"
      icon={<EditIcon />}
      onClick={() => setIsWrite(false)}
    />
  ) : (
    <IconButton
      aria-label="write"
      icon={<ViewIcon />}
      onClick={() => setIsWrite(true)}
    />
  );

  return (
    <HStack maxW={"80vw"} overflowX="auto">
      <HStack>
        {toggleButton}
        <Badge variant={"subtle"}>{isWrite ? "WRITE" : "READ"}</Badge>
        {segments.map((_, i) => (
          <PathSegment
            key={i}
            onChange={(value) => {
              const newSegments = [...segments];
              newSegments[i] = value;

              setSegments(newSegments);
            }}
            close={
              i === segments.length - 1
                ? () => {
                    setSegments(segments.filter((_, j) => j !== i));
                  }
                : undefined
            }
          />
        ))}
      </HStack>

      <AddSegmentButton
        onClick={() => setSegments([...segments, DEFAULT_SEGMENT_INPUT])}
      />
    </HStack>
  );
};

const AddSegmentButton = (props: { onClick: Function }) => {
  return (
    <IconButton
      aria-label="Add segment"
      icon={<AddIcon />}
      variant="ghost"
      ml={"0px"}
      onClick={() => {
        props.onClick();
      }}
    >
      +
    </IconButton>
  );
};
