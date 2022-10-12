import { Button } from "@chakra-ui/react";

export const AddResourceButton = (props: { onClick: Function }) => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        props.onClick();
      }}
    >
      + Resource
    </Button>
  );
};
