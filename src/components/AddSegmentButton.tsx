import { AddIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export const AddSegmentButton = (props: { onClick: Function }) => {
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
