import { memo } from "react";

const SpinLoader = memo(() => (
  <div className="flex justify-center items-center h-full">
    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
  </div>
));
export default SpinLoader;
