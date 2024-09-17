import { memo } from "react";
import logo from "../../assets/aarem-bag-logo.png";

const Loader = memo(() => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={logo} alt="Loading..." className="w-24 h-24 animate-flip" />
    </div>
  );
});

export default Loader;
