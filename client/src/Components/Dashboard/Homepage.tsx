import React, { useState } from "react";
import {
  Image,
  useFetchCarouselImagesQuery,
  useFetchSizeChartImagesQuery,
  useUploadCarouselImageMutation,
  useUploadSizeChartImageMutation,
} from "../../Redux/rtk/homepageApi";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import SpinLoader from "../ReusableComp/SpinLoader";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";

interface CarouselItem {
  _id: string;
  title: string;
  updatedAt: string;
  url: string;
  status: string;
}

const Homepage: React.FC = () => {
  // Hooks for mutations
  const [uploadCarouselImage] = useUploadCarouselImageMutation();
  const [uploadSizeChartImage] = useUploadSizeChartImageMutation();

  // State for file inputs
  const [carouselImage, setCarouselImage] = useState<File | null>(null);
  const [sizeChartImage, setSizeChartImage] = useState<File | null>(null);

  // State for titles
  const [carouselTitle, setCarouselTitle] = useState("");
  const [sizeChartTitle, setSizeChartTitle] = useState("");

  // Handlers for file inputs
  const handleCarouselImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setCarouselImage(event.target.files[0]);
    }
  };

  const handleSizeChartImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setSizeChartImage(event.target.files[0]);
    }
  };

  // Handlers for title inputs
  const handleCarouselTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCarouselTitle(event.target.value);
  };

  const handleSizeChartTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSizeChartTitle(event.target.value);
  };

  // Handle submit for carousel image
  const handleCarouselSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!carouselImage || !carouselTitle) return;

    const formData = new FormData();
    formData.append("carouselImages", carouselImage);
    formData.append("title", carouselTitle);

    try {
      await uploadCarouselImage(formData).unwrap();
      alert("Carousel image uploaded successfully!");
      setCarouselImage(null);
      setCarouselTitle("");
    } catch (error) {
      alert("Failed to upload carousel image.");
    }
  };

  const { data: CarouselData, isLoading } = useFetchCarouselImagesQuery();
  const { data: SizeChartData } = useFetchSizeChartImagesQuery();

  // Ensure CarouselData is properly typed as an array

  const Carousel: CarouselItem[] = CarouselData || [];

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Image Id" },
    { label: "Title" },
    { label: "Image" },
    { label: "Updated At" },
    { label: "Status" },
    { label: "Action" },
  ] as const; // Adding 'as const' for immutability

  // Transform the API data to match the expected format
  const tableData = Carousel.map((carousel) => ({
    imageId: carousel._id,
    title: carousel.title, // Using title for clarity
    image: carousel.url,
    updatedAt: carousel.updatedAt,
    status: carousel.status,
  }));
  // Define table headings
  const SizetableHeading: TableHeadingItem[] = [
    { label: "Image Id" },
    { label: "Title" },
    { label: "Image" },
    { label: "Updated At" },
    { label: "Status" },
    { label: "Action" },
  ] as const; // Adding 'as const' for immutability

  // Transform the API data to match the expected format
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const SizetableData = SizeChartData?.map((sizeChart: Image) => ({
    imageId: sizeChart._id,
    title: sizeChart.title, // Using title for clarity
    image: sizeChart.url,
    updatedAt: sizeChart.updatedAt,
    status: sizeChart.status,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinLoader />
      </div>
    );
  }

  // Transform unique categories into an object
  const categoriesObject = () => {
    const categoriesObj = Carousel.reduce<{ [key: string]: string }>(
      (acc, item) => {
        acc[item.status] = item.status;
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

  // Handle submit for size chart image
  const handleSizeChartSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sizeChartImage || !sizeChartTitle) return;

    const formData = new FormData();
    formData.append("sizeChartImages", sizeChartImage);
    formData.append("title", sizeChartTitle);

    try {
      await uploadSizeChartImage(formData).unwrap();
      alert("Size chart image uploaded successfully!");
      setSizeChartImage(null);
      setSizeChartTitle("");
    } catch (error) {
      alert("Failed to upload size chart image.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-ubuntu font-semibold text-gray-900 mb-6">
        Image Upload
      </h1>

      {/* Carousel Image Upload Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold font-ubuntu mb-4">
          Upload Carousel Image
        </h2>
        <form onSubmit={handleCarouselSubmit}>
          <div className="mb-4">
            <input
              id="carouselTitle"
              name="carouselTitle"
              type="text"
              placeholder="Enter title for carousel image"
              value={carouselTitle}
              onChange={handleCarouselTitleChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-100 p-3 mb-4"
            />
            <input
              id="carouselImage"
              name="carouselImage"
              type="file"
              accept="image/*"
              onChange={handleCarouselImageChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-600 font-ubuntu hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Upload Carousel Image
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="mb-8">
        <SearchAbleTable
          tableData={tableData}
          tableHeading={tableHeading}
          tableType="carouselTable"
          categoryDropDownPlaceHolder="Select a Category"
          searchInputPlaceHolder="Search for Images"
          messageText="No data available"
          categoryDropDownData={categoriesObject()}
          isLoading={false}
        />
      </div>

      {/* Size Chart Image Upload Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Size Chart Image</h2>
        <form onSubmit={handleSizeChartSubmit}>
          <div className="mb-4">
            <input
              id="sizeChartTitle"
              name="sizeChartTitle"
              type="text"
              placeholder="Enter title for size chart image"
              value={sizeChartTitle}
              onChange={handleSizeChartTitleChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-100 p-3 mb-4"
            />
            <input
              id="sizeChartImage"
              name="sizeChartImage"
              type="file"
              accept="image/*"
              onChange={handleSizeChartImageChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Upload Size Chart Image
          </button>
        </form>
        {/* Table */}
        <div className="mb-8">
          <SearchAbleTable
            tableData={SizetableData}
            tableHeading={SizetableHeading}
            tableType="sizeChartTable"
            categoryDropDownPlaceHolder="Select a Category"
            searchInputPlaceHolder="Search for Images"
            messageText="No data available"
            categoryDropDownData={categoriesObject()}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
