/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useState, ChangeEvent, FormEvent, useEffect } from "react";
import RenderHeader from "../ReusableComp/RenderHeading";
import { ProductsIcon, PlusIcon, XIcon } from "../Icons/Icons";
import axios from "axios";
import toast from "react-hot-toast";
import ColorSelection from "./ColorSelection";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import SwitchButton from "../ReusableComp/SwitchButton";

interface Category {
  _id: string;
  parentCategory: { _id: string } | null;
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
}

const CreateProduct: FC = () => {
  const { id } = useSelector(selectUserDetails);

  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productSize, setProductSize] = useState<string[]>([]);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [discountedProductPrice, setDiscountedProductPrice] =
    useState<number>(0);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [hasTheme, setHasTheme] = useState<boolean>(false);
  const [productTheme, setProductTheme] = useState<string>("");
  const [colors, setColors] = useState<
    { colorName: string; colorCode: string; imageUrl: File }[]
  >([]);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/category/categories"
        );
        const categoriesData = response.data.category;

        const filteredCategories = categoriesData
          .filter((cat: Category) => cat.parentCategory === null)
          .map((category: Category) => ({
            id: category._id,
            name: category.name,
            subCategories: categoriesData
              .filter(
                (subCat: Category) =>
                  subCat.parentCategory?._id === category._id
              )
              .map((subCategory: Category) => ({
                id: subCategory._id,
                name: subCategory.name,
              })),
          }));

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = () => {
      const selectedCat = categories.find((cat) => cat.id === selectedCategory);
      if (selectedCat) {
        setSubcategories(selectedCat.subCategories);
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [selectedCategory, categories]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 4);
      const updatedFiles = [...productImages, ...newFiles];
      setProductImages(updatedFiles);

      const previewArray = updatedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(previewArray);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    productSize.forEach((size) => formData.append("productSize[]", size));

    formData.append("productPrice", productPrice.toString());
    formData.append("productStock", productStock.toString());
    formData.append("productCategory", selectedCategory);
    formData.append("productSubCategory", selectedSubcategory);
    formData.append(
      "discountedProductPrice",
      discountedProductPrice.toString()
    );
    productImages.forEach((image) => formData.append("productImages", image));
    if (hasTheme) {
      formData.append("productTheme", productTheme);
    }
    formData.append("isFeatured", isFeatured.toString());

    // Append color variations to formData
    colors.forEach((color, index) => {
      formData.append(`productColors[${index}][colorName]`, color.colorName);
      formData.append(`productColors[${index}][colorCode]`, color.colorCode);
      formData.append(`productColors[${index}][imageUrl]`, color.imageUrl);
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/product/create-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        toast.success("Product added successfully!");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product");
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <RenderHeader subHeading="Add a New Product" />
          <button
            type="submit"
            className="bg-orange-400 font-ubuntu font-medium h-10 flex gap-2 text-black p-2 rounded-lg hover:bg-orange-600"
          >
            <ProductsIcon />
            Add Product
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col gap-6 md:w-2/3">
            <div className="rounded-3xl p-8 bg-orange-50 border-2">
              <div className="flex flex-col gap-4">
                <label className="font-ubuntu font-semibold text-2xl text-orange-500">
                  General Information
                </label>

                <TextInput
                  label="Name of the Product"
                  name="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <TextArea
                  label="Description of the Product"
                  name="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-20 p-4">
                  <div className="flex flex-col gap-5">
                    <SelectInput
                      label="Product Category"
                      name="productCategory"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      options={categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      }))}
                    />

                    <SelectInput
                      label="Subcategory"
                      name="productSubcategory"
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      options={subcategories.map((subcategory) => ({
                        value: subcategory.id,
                        label: subcategory.name,
                      }))}
                      disabled={!selectedCategory}
                    />
                  </div>

                  <div className="flex flex-col md:w-1/2 gap-1">
                    <label className="font-ubuntu text-orange-500">Sizes</label>
                    <label className="font-ubuntu text-sm text-orange-400">
                      Pick available Sizes
                    </label>
                    <SizeSelector
                      sizes={["S", "M", "L", "XL"]}
                      selectedSizes={productSize}
                      onSizeChange={(sizes) => setProductSize(sizes)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl md:p-8 p-4 bg-orange-50 border-2">
              <label className="font-ubuntu text-lg text-orange-500">
                Pricing and Stock
              </label>
              <div className="flex flex-col md:flex-row flex-wrap justify-between gap-2 items-center">
                <NumberInput
                  label="Base Price"
                  name="productPrice"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                />

                <NumberInput
                  label="Discounted Price"
                  name="discountedProductPrice"
                  value={discountedProductPrice}
                  onChange={(e) =>
                    setDiscountedProductPrice(Number(e.target.value))
                  }
                />

                <NumberInput
                  label="Stock"
                  name="productStock"
                  value={productStock}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                />
              </div>
              {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-expect-error */}
              <ColorSelection colors={colors} setColors={setColors} />
            </div>
          </div>

          <div className="flex flex-col gap-6 md:w-1/3">
            <ImageUploader
              previews={imagePreviews}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
            />

            <div className="rounded-3xl p-8 bg-orange-50 border-2">
              <div className="flex flex-col gap-1">
                <label className="font-ubuntu font-semibold text-2xl text-orange-500">
                  Product Theme
                </label>
                <label className="font-ubuntu text-sm text-orange-500">
                  Does your product have a theme?
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasTheme}
                    onChange={(e) => setHasTheme(e.target.checked)}
                    className="mr-2 accent-orange-500 h-3 w-3"
                  />
                  <label className="font-ubuntu">Yes, it has a theme</label>
                </div>
                {hasTheme && (
                  <TextInput
                    label="Name of the theme"
                    name="productTheme"
                    value={productTheme}
                    onChange={(e) => setProductTheme(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col  gap-4 rounded-3xl p-8 bg-orange-50 border-2">
              <div className="flex flex-row  justify-between px-4">
                <label className="font-ubuntu font-semibold text-2xl text-orange-500">
                  Featured
                </label>
                <SwitchButton
                  isChecked={isFeatured}
                  onChange={() => setIsFeatured(!isFeatured)} // Toggle the featured status
                />
              </div>
              <label className="font-ubuntu text-sm text-orange-400 mt-2">
                Toggle if this product should be featured.
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const TextInput: FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-ubuntu text-sm text-orange-500">{label}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-2 p-2 border-orange-300 rounded-lg"
    />
  </div>
);

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextArea: FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-ubuntu text-sm text-orange-500">{label}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-2 p-2 rounded-lg h-40 border-orange-300"
    />
  </div>
);

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-ubuntu text-orange-500">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border-2 p-2 rounded-lg w-72"
      disabled={disabled}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface NumberInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const NumberInput: FC<NumberInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-ubuntu text-orange-500">{label}</label>
    <input
      name={name}
      type="number"
      placeholder={label}
      value={value}
      onChange={onChange}
      className="border-2 p-2 rounded-lg w-72"
    />
  </div>
);

interface SizeSelectorProps {
  sizes: string[];
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
}

const SizeSelector: FC<SizeSelectorProps> = ({
  sizes,
  selectedSizes,
  onSizeChange,
}) => (
  <div className="flex flex-row gap-10">
    {sizes.map((size) => (
      <div key={size} className="flex flex-row gap-2 items-center">
        <input
          type="checkbox"
          name="productSize"
          value={size}
          checked={selectedSizes.includes(size)}
          onChange={(e) =>
            onSizeChange(
              e.target.checked
                ? [...selectedSizes, size]
                : selectedSizes.filter((s) => s !== size)
            )
          }
          className="accent-orange-400 h-4 w-4 rounded-3xl"
        />
        <label className="font-ubuntu font-medium">{size}</label>
      </div>
    ))}
  </div>
);

interface ImageUploaderProps {
  previews: string[];
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  previews,
  onImageChange,
  onImageRemove,
}) => (
  <div className="flex flex-col gap-1 rounded-3xl p-8 h-[75%] bg-orange-50 border-2">
    <label className="font-ubuntu font-semibold text-2xl text-orange-500">
      Upload Images
    </label>
    {previews.length > 0 && (
      <div className="mt-2 flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={previews[0]}
            alt="Main Image Preview"
            className="rounded-lg h-80 object-fill"
          />
          <button
            type="button"
            onClick={() => onImageRemove(0)}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-800"
          >
            <XIcon />
          </button>
        </div>
        <div className="flex flex-row gap-1">
          {previews.slice(1).map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Image Preview ${index + 2}`}
                className="rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index + 1)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-800"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
    {previews.length < 4 && (
      <label className="cursor-pointer flex items-center justify-center w-full h-32 bg-orange-100 border-2 border-dashed border-orange-300 rounded-lg">
        <input
          id="productImages"
          name="productImages"
          type="file"
          onChange={onImageChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <PlusIcon />
      </label>
    )}
  </div>
);
