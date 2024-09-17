import { FC, ReactNode, memo } from "react";

interface RenderHeaderProps {
  heading? : string;
  subHeading? : string;
  description?: string;
  buttonComponent?: ReactNode;
}

// RenderHeader functional component
const RenderHeader: FC<RenderHeaderProps> = memo(
  ({ heading,subHeading, description, buttonComponent }) => {
    return (
      <>
        <div className="flex md:flex-row flex-col md:justify-between md:items-center">
          <div className="w-auto h-auto flex flex-col">
            {/* Header section */}
            <div className="flex gap-2 items-center py-2">
              <h1 className="md:text-4xl text-2xl font-ubuntu text-black font-semibold lg:whitespace-nowrap">
                {heading} {/* Render heading */}
              </h1>
            </div>
            <div className="flex gap-2 items-center py-2">
              <h1 className="md:text-2xl text-xl font-ubuntu text-black font-semibold lg:whitespace-nowrap">
                {subHeading} {/* Render sub-heading */}
              </h1>
            </div>
            {/* Description section */}
            <div className="">
              <p className="md:text-md md:w-3/5 font-ubuntu text-desc">{description}</p>{" "}
              {/* Render description */}
            </div>
          </div>
          <div className=" flex flex-row md:items-center  md:justify-end">
            {buttonComponent}
          </div>
        </div>
      </>
    );
  }
);

export default RenderHeader;
