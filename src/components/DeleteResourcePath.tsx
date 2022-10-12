import { CloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export const DeleteResourcePath = (props: {
  onClick: Function;
  isActive: boolean;
}) => {
  return (
    <IconButton
      aria-label="Delete path"
      icon={<CloseIcon />}
      variant="outline"
      color="red.200"
      onClick={() => {
        props.onClick();
      }}
      isDisabled={!props.isActive}
    />
  );
};
