import { FC } from "react";

export interface OrderItemProps {
  product: {
    _id: string;
    productName: string;
    productCategory: {
      id: string;
      name: string;
    };
    productSubCategory: {
      id: string;
      name: string;
    };
    productImages: string[];
    discountedProductPrice: number;
  };
  color: string | null;
  price: number;
  quantity: number;
  size: string;
  vendor: string;
  _id: string;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const OrderItem: FC<OrderItemProps> = ({ item }) => {
  const { product, color, price, quantity, size } = item;

  return (
    <div className="font-ubuntu text-desc mb-2  border-b-2 pb-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 mb-2">
        <div className="flex flex-row items-center gap-4">
          {product.productImages && (
            <img
              src={product?.productImages[0]}
              alt="product-image"
              className="h-36 rounded-xl"
              loading="lazy"
            />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold font-ubuntu text-desc"></span>
            <div className="flex flex-row items-center">
              <span className="text-sm font-ubuntu font-medium">
                {product.productCategory?.name} •
              </span>
              <span className="ml-1 font-ubuntu">
                {" "}
                {product.productSubCategory?.name}
              </span>
            </div>
            <span className="font-semibold w-96 text-lg">
              {product.productName}
            </span>
            {color && (
              <div className="flex flex-row items-center">
                <span className="text-sm font-ubuntu font-medium">Color •</span>
                <span className="ml-1 font-ubuntu">{color}</span>
              </div>
            )}
            {size && (
              <div className="flex flex-row items-center">
                <span className="text-sm font-ubuntu font-medium">Size •</span>
                <span className="ml-1 font-ubuntu text-sm">{size}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="font-semibold font-ubuntu text-lg">Rs. {price}</span>
          <div className="text-sm font-ubuntu">Quantity: {quantity}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
