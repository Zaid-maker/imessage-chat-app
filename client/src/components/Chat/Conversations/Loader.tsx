import { Skeleton } from "@chakra-ui/react";
import { FC } from "react";

const Loader: FC = () => {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton
          key={i}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          borderRadius={4}
          height={20}
        />
      ))}
    </>
  );
};

export default Loader;
