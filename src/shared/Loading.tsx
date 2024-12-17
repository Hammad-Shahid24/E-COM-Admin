import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface LoadingProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loading: FC<LoadingProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => {
  return (
    <AiOutlineLoading
      className={`animate-spin ${className}`}
      size={size}
      color={color}
    />
  );
};

export default Loading;
