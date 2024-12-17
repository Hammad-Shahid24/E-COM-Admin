import { FC } from "react";

interface ComponentHeaderProps {
  heading: string;
}

const ComponentHeader: FC<ComponentHeaderProps> = ({ heading }) => {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <h1 className="text-xl font-semibold text-gray-800 font-poppins">
        {heading}
      </h1>
      <span></span>
    </div>
  );
};

export default ComponentHeader;
