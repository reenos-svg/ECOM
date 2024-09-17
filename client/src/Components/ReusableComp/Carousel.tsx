// src/components/Carousel.tsx
import React, { memo } from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the default styles

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = memo(({ images }) => {
  return (
    <>
      <ResponsiveCarousel
        showThumbs={false} // Hide thumbnails
        showStatus={false} // Hide the status text
        infiniteLoop
        autoPlay
        interval={5000} // Slide interval in milliseconds
        transitionTime={500} // Transition time in milliseconds
        className="w-full  rounded-lg shadow-md"
      >
        {images.map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              src={image}
              alt={`Carousel image ${index + 1}`}
              className="max-h-screen h-[35rem] max-w-screen rounded-lg"
            />
          </div>
        ))}
      </ResponsiveCarousel>
    </>
  );
});

export default Carousel;
