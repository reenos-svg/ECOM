import { FC, memo, useState, useMemo } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import {
  ProductProps,
  useFetchAllProductsQuery,
} from "../../Redux/rtk/productApi";
import Loader from "../../Components/ReusableComp/Loader";
import DropDownFilter from "../../Components/ReusableComp/DropDownFilter";
import Pagination from "../../Components/ReusableComp/Pagination";

interface ShopCategoryProps {
  category: string;
}

const ShopCategory: FC<ShopCategoryProps> = memo(({ category }) => {
  const { data, isLoading, isError } = useFetchAllProductsQuery({});

  // Destructure products from data object and handle fallback
  const products = data?.products || [];

  // Filter out products with empty or null productCategory
  const validProducts = products.filter(
    (product: ProductProps) =>
      product.productCategory?.name === category &&
      product.productSubCategory?.name
  );

  // Extract unique subcategories from valid products
  const subcategories = useMemo(() => {
    const subcategorySet = new Set<string>(
      validProducts.map(
        (product: ProductProps) => product.productSubCategory?.name as string
      )
    );
    return Array.from(subcategorySet);
  }, [validProducts]);

  // Set up state for selected subcategory
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const availableOptions = [10, 20, 30, 50];

  // Filter products based on the selected subcategory
  const filteredBySubcategory = useMemo(
    () =>
      selectedSubcategory
        ? validProducts.filter(
            (product: ProductProps) =>
              product.productSubCategory?.name === selectedSubcategory
          )
        : validProducts,
    [selectedSubcategory, validProducts]
  );

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(filteredBySubcategory.length / rowsPerPage),
    [filteredBySubcategory.length, rowsPerPage]
  );

  // Get current page products
  const paginatedProducts = useMemo(
    () =>
      filteredBySubcategory.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredBySubcategory, currentPage, rowsPerPage]
  );

  // Handler for changing the selected subcategory
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory === "" ? null : subcategory); // Clear filter if 'All' is selected
    setCurrentPage(1); // Reset to the first page when the subcategory changes
  };

  // Handler for changing the rows per page
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  // Handler for previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handler for next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading products.</div>;
  }

  return (
    <div>
      <Navbar />
      <main className="m-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0 p-6">
          <p className="font-ubuntu font-medium text-lg">
            Showing {paginatedProducts.length} out of{" "}
            {filteredBySubcategory.length} products
          </p>

          {/* Subcategory DropDownFilter */}
          <DropDownFilter
            items={["", ...subcategories]}
            selectedItem={selectedSubcategory}
            onSelect={handleSubcategoryChange}
            placeholder="Select a Sub-category"
          />
        </div>
        <section className="md:grid flex flex-col md:grid-cols-5 items-center gap-6 p-2 md:p-12">
          {paginatedProducts.map((product: ProductProps) => (
            <ProductCard
              productId={product._id}
              key={product._id}
              productName={product.productName}
              productImages={product.productImages}
              productPrice={product.discountedProductPrice}
              productOldPrice={product.productPrice} 
              isFeatured={product.isFeatured}
            />
          ))}
        </section>
        {/* Add Pagination component */}
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            availableOptions={availableOptions}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default ShopCategory;
