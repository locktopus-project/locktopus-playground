import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Badge, HStack, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ResourceRef } from "../types";
import { AddSegmentButton } from "./AddSegmentButton";
import { PathSegment } from "./PathSegment";

export const Resource = (props: {
  onChange: (resource: ResourceRef) => void;
}) => {
  const { onChange } = props;
  const [write, setWrite] = useState(true);
  const [segments, setSegments] = useState<string[]>([]);

  useEffect(() => {
    onChange({
      write,
      path: segments,
    });
  }, [write, segments, onChange]);

  const toggleButton = write ? (
    <IconButton
      aria-label="write"
      icon={<ViewIcon />}
      onClick={() => setWrite(false)}
    />
  ) : (
    <IconButton
      aria-label="write"
      icon={<EditIcon />}
      onClick={() => setWrite(true)}
      value="awd"
    />
  );

  return (
    <HStack maxW={"80vw"} overflowX="auto">
      <HStack>
        {toggleButton}
        <Badge variant={"subtle"}>{write ? "WRITE" : "READ"}</Badge>
        {segments.map((segment, i) => (
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

      <AddSegmentButton onClick={() => setSegments([...segments, ""])} />
    </HStack>
  );
};
