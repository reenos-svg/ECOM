import { FC, useState } from "react";
import RenderHeader from "../ReusableComp/RenderHeading";
import Loader from "../ReusableComp/Loader";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from "../../Redux/rtk/categoryApi";
import toast from "react-hot-toast";
import Button from "../ReusableComp/Button";
import { CalendarIcon } from "../Icons/Icons";

const Category: FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const updateCategories = categories?.filter(
    (category) => category.parentCategory === null
  );

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      await addCategory({ name: newCategoryName }).unwrap();
      toast.success("Category added successfully!");
      setNewCategoryName("");
      setIsAddingCategory(false); // Hide the input and button
      refetch(); // Refetch to get updated categories
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category.");
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
      <RenderHeader
        heading="Categories"
        buttonComponent={
          isAddingCategory ? (
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  className="p-2 w-96 border border-gray-300 rounded-md"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  btnContent="Add Category"
                  btnOnClick={handleAddCategory}
                />
                <Button
                  btnContent="Cancel"
                  btnOnClick={() => setIsAddingCategory(false)}
                />
              </div>
            </div>
          ) : (
            <Button
              btnContent="Add Category"
              btnOnClick={() => setIsAddingCategory(true)}
            />
          )
        }
      />

      <div className="flex flex-col gap-2 mt-4">
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
              <CalendarIcon />
              <span className="text-xs md:text-base">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex w-1/4 flex-wrap md:flex-nowrap flex-row gap-2">
              {category.subCategories.length > 0 ? (
                category.subCategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="text-lg bg-orange-100 text-orange-600 rounded-lg px-2"
                  >
                    {sub.name}
                  </div>
                ))
              ) : (
                <li className="text-sm text-gray-600">No Subcategories</li>
              )}
            </div>

            <div className="md:flex w-1/4 hidden flex-row items-center gap-2">
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className={`w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
