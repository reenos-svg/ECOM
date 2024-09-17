import { FC, useEffect, useState, useCallback } from "react";

interface CarouselProps {
  images: string[];
}

const Carousel: FC<CarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOverlay, setIsOverlay] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 650) {
      setIsOverlay(false);
    }
  }, [windowWidth]);

  const moveImage = (isNext: boolean) => {
    setCurrentImage((prevImage) =>
      isNext ? (prevImage === images.length - 1 ? 0 : prevImage + 1) : prevImage === 0 ? images.length - 1 : prevImage - 1
    );
  };

  const toggleOverlay = useCallback(() => {
    if (windowWidth > 650) {
      setIsOverlay((prevIsOverlay) => !prevIsOverlay);
    }
  }, [windowWidth]);

  const renderedThumbnails = images.map((pic: string, index: number) => {
    const selectProductImage = () => setCurrentImage(index);
    return (
      <div
        key={pic}
        onClick={selectProductImage}
        className={`w-full flex cursor-pointer justify-center rounded-md scale-90 ${
          currentImage === index ? "border-2 border-orange bg-white opacity-30" : "hover:opacity-75"
        }`}
      >
        <img src={pic} className="w-full h-auto rounded-md" alt={`Product Preview ${index + 1}`} loading="lazy" />
      </div>
    );
  });

  return (
    <>
      <div className="max-w-[40rem] mx-auto relative">
        <button
          onClick={() => moveImage(false)}
          className="absolute top-[50%] left-3 rounded-full py-2 px-[0.65rem] bg-white hidden md:block"
        >
          <svg width="12" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1 3 9l8 8" stroke="#1D2026" strokeWidth="3" fill="none" fillRule="evenodd" />
          </svg>
        </button>

        <img
          onClick={toggleOverlay}
          className="max-h-[25rem] h-auto mx-auto rounded-lg cursor-pointer"
          src={images[currentImage]}
          alt={`Product ${currentImage + 1}`}
          loading="lazy"
        />
        <div className="grid grid-cols-4 gap-4 mt-4">{renderedThumbnails}</div>

        <button
          onClick={() => moveImage(true)}
          className="absolute top-[50%] right-3 rounded-full py-2 px-[0.65rem] bg-white hidden md:block"
        >
          <svg width="13" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="m2 1 8 8-8 8" stroke="#1D2026" strokeWidth="3" fill="none" fillRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOverlay && (
        <div className="fixed top-0 left-0 flex items-center h-full w-full z-20 bg-black/75">
          <div className="relative flex flex-col max-w-[25rem] mx-auto">
            <button onClick={toggleOverlay} className="group self-end py-4">
              <svg className="fill-white group-hover:fill-orange" width="14" height="15" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
                  fillRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={() => moveImage(false)}
              className="group absolute top-[35%] -left-8 rounded-full scale-75 py-5 px-[1.4rem] bg-white"
            >
              <svg
                className="stroke-[#1D2026] group-hover:stroke-orange"
                width="12"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 1 3 9l8 8" strokeWidth="3" fill="none" fillRule="evenodd" />
              </svg>
            </button>

            <img className="max-h-[25rem] mx-auto rounded-lg" src={images[currentImage]} alt={`Product ${currentImage + 1}`} loading="lazy" />
            <div className="grid grid-cols-4 gap-4 mt-4">{renderedThumbnails}</div>

            <button
              onClick={() => moveImage(true)}
              className="group absolute top-[35%] -right-8 rounded-full scale-75 py-5 px-[1.4rem] bg-white"
            >
              <svg
                className="stroke-[#1D2026] group-hover:stroke-orange"
                width="13"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m2 1 8 8-8 8" strokeWidth="3" fill="none" fillRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;
