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
const ShopByThemes: FC = memo(() => {
  const { data, isLoading, isError } = useFetchAllProductsQuery({});

  // Destructure products from data object and handle fallback
  const products = data?.products || [];

  // Filter out products with empty or null productTheme
  const validProducts = products.filter(
    (product: ProductProps) =>
      product.productTheme && product.productTheme.trim() !== ""
  );

  // Extract unique themes from valid products
  const uniqueThemes = useMemo(() => {
    const themes = new Set<string>(
      validProducts.map(
        (product: ProductProps) => product.productTheme as string
      )
    );
    return Array.from(themes);
  }, [validProducts]);

  // Set up state for selected theme
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Filter products based on the selected theme
  const filteredProducts = useMemo(
    () =>
      selectedTheme
        ? validProducts.filter(
            (product: ProductProps) => product.productTheme === selectedTheme
          )
        : validProducts,
    [selectedTheme, validProducts]
  );

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
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
            Showing {filteredProducts.length} out of {validProducts.length}{" "}
            products
          </p>
          {/* Use the Dropdown component */}
          <DropDownFilter
            items={uniqueThemes}
            selectedItem={selectedTheme}
            onSelect={handleThemeChange}
            placeholder="Select a theme"
          />
        </div>
        <section className="md:grid flex flex-col md:grid-cols-5 items-center gap-6 p-2 md:p-12">
          {filteredProducts.map((product: ProductProps) => (
            <ProductCard
              productId={product._id}
              key={product._id}
              productName={product.productName}
              productImages={product.productImages}
              productPrice={product.discountedProductPrice}
              productOldPrice={product.productPrice} // Assuming this is a placeholder for discount price
              isFeatured={product.isFeatured}
            />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
});

export default ShopByThemes;
