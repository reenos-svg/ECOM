import { FC, useState } from "react";
import RenderHeader from "../ReusableComp/RenderHeading";
import Loader from "../ReusableComp/Loader";
import {
  useGetCategoriesQuery,
  useAddSubCategoryMutation,
  useDeleteCategoryMutation,
} from "../../Redux/rtk/categoryApi";
import toast from "react-hot-toast";

const SubCategories: FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [addSubCategory, { isLoading: isAddingSubCategory }] =
    useAddSubCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(
    null
  );

  const updateCategories = categories?.filter(
    (category) => category.parentCategory === null
  );

  
  const handleAddSubcategory = async () => {
    if (!selectedCategoryId || !newSubcategoryName) {
      toast.error("Please select a category and enter a subcategory name.");
      return;
    }

    try {
      await addSubCategory({
        categoryId: selectedCategoryId,
        name: newSubcategoryName,
      }).unwrap();
      toast.success("Subcategory added successfully!");
      setNewSubcategoryName("");
      setSelectedCategoryId(null);
      refetch(); // Refetch to get updated categories
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Error adding subcategory.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully!");
      refetch(); // Refetch to get updated categories
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category.");
    }
  };

  const confirmDeleteSubCategory = (subCategoryId: string) => {
    setSubCategoryToDelete(subCategoryId);
  };

  const handleConfirmDeleteSubCategory = async () => {
    if (subCategoryToDelete) {
      try {
        await handleDeleteCategory(subCategoryToDelete); // Adjusted to delete a subcategory
        setSubCategoryToDelete(null);
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast.error("Error deleting subcategory.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-4">
        Error loading Categories
      </div>
    );
  }

  return (
    <div className="p-4">
      <RenderHeader heading="Categories" />
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        >
          <option value="" disabled>
            Select a Category
          </option>
          {updateCategories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          placeholder="New Subcategory Name"
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          onClick={handleAddSubcategory}
          disabled={isAddingSubCategory}
          className={`bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${
            isAddingSubCategory ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isAddingSubCategory ? "Adding..." : "Add Subcategory"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {updateCategories?.map((category) => (
          <div
            key={category._id}
            className="flex my-2 flex-row justify-between items-center border-2 border-white shadow-md p-3 rounded-lg"
          >
            <div className="flex flex-row w-1/4 items-center gap-4 ">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-black"
              />
              <span className={`text-md font-semibold`}>{category.name}</span>
            </div>

            <div className="text-[#717171] w-1/4 flex flex-row gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#717171"
                className="md:flex hidden w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
              <span className="text-xs md:text-base">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex w-1/4 flex-wrap md:flex-nowrap flex-row gap-2">
              {category.subCategories.map((sub,index) => (
                <div
                  key={index}
                  className="text-lg bg-orange-100 text-orange-600 rounded-lg px-2 cursor-pointer hover:bg-orange-200"
                  onClick={() => confirmDeleteSubCategory(sub._id)} // Add onClick handler for confirming subcategory deletion
                >
                  {sub.name}
                </div>
              ))}
            </div>

            <div className="md:flex w-1/4 hidden flex-row items-center gap-2">
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className={`w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors`}
              >
                Delete Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {subCategoryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">
              Are you sure you want to delete this subcategory?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDeleteSubCategory}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setSubCategoryToDelete(null)}
                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategories;
