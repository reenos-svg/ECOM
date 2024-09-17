import { FC, memo, useState, useCallback, useMemo } from "react";
import { TableHeadingItem, TData } from "./TablePropsType";
import Pagination from "./Pagination";
import { formatDate } from "../../utils/FormatDate";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "./OrderDetails/OrderDetailsModal";
import CouponDetailModal from "../Dashboard/Coupons/CouponDetailModal";
import WithdrawalRequestModal from "../Dashboard/WithdrawalRequest/WithdrawalRequestModal";
import {
  useDeleteCarouselImageMutation,
  useDeleteSizeChartImageMutation,
  useSetActiveSizeChartImageMutation,
} from "../../Redux/rtk/homepageApi";
import toast from "react-hot-toast";

export interface TabelProps {
  tableHeading: TableHeadingItem[];
  tableType:
    | "ordersTable"
    | "recentOrderTable"
    | "productsTable"
    | "categoryTable"
    | "userOrdersTable"
    | "emailTable"
    | "withdrawalsTable"
    | "recentOrdersTable"
    | "couponTable"
    | "sizeChartTable"
    | "withdrawalRequestTable"
    | "carouselTable"
    | "vendorTable";
  tableData?: TData[];
}

const Table: FC<TabelProps> = memo(
  ({ tableHeading, tableType, tableData = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const availableOptions = [5, 10, 15, 20]; // Rows per page options
    const [modalContent, setModalContent] = useState(null); // State to manage modal content
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [couponModalContent, setcouponModalContent] = useState(null); // State to manage modal content
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false); // State to manage modal visibility
    const [reuqestModalContent, setRequestModalContent] = useState(null); // State to manage modal content
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // State to manage modal visibility
    const navigate = useNavigate();
    const [deleteCarouselImage] = useDeleteCarouselImageMutation(); // Use the delete mutation hook
    const [deleteSizeChartImage] = useDeleteSizeChartImageMutation(); // Use the delete mutation hook
    const [setActiveSizeChartImage] = useSetActiveSizeChartImageMutation();

    const totalPages = useMemo(
      () => Math.ceil(tableData.length / rowsPerPage),
      [tableData.length, rowsPerPage]
    );

    const handlePreviousPage = useCallback(() => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }, [currentPage, totalPages]);

    const handleRowsPerPageChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to the first page
      },
      []
    );

    const tableContainerClass =
      tableType === "recentOrderTable" ||
      tableType === "productsTable" ||
      tableType === "ordersTable" ||
      tableType === "categoryTable" ||
      tableType === "userOrdersTable" ||
      tableType === "vendorTable" ||
      tableType === "emailTable" ||
      tableType === "withdrawalsTable" ||
      tableType === "recentOrdersTable" ||
      tableType === "couponTable" ||
      tableType === "carouselTable" ||
      tableType === "sizeChartTable" ||
      tableType === "withdrawalRequestTable"
        ? "border border-gray-300 rounded-xl shadow-gray-300 shadow-sm"
        : "";

    const tableHeadRowClass =
      tableType === "recentOrderTable" ||
      tableType === "productsTable" ||
      tableType === "ordersTable" ||
      tableType === "vendorTable" ||
      tableType === "userOrdersTable" ||
      tableType === "categoryTable" ||
      tableType === "emailTable" ||
      tableType === "withdrawalsTable" ||
      tableType === "recentOrdersTable" ||
      tableType === "carouselTable" ||
      tableType === "sizeChartTable" ||
      tableType === "withdrawalRequestTable"
        ? "border border-b-gray-300 rounded-tr-xl rounded-tl-xl"
        : "";

    const tableHeadingPClass =
      tableType === "recentOrderTable" ||
      tableType === "productsTable" ||
      tableType === "ordersTable" ||
      tableType === "vendorTable" ||
      tableType === "userOrdersTable" ||
      tableType === "categoryTable" ||
      tableType === "emailTable" ||
      tableType === "withdrawalsTable" ||
      tableType === "recentOrdersTable" ||
      tableType === "carouselTable" ||
      tableType === "sizeChartTable" ||
      tableType === "withdrawalRequestTable"
        ? "text-neutral-500 font-semibold"
        : "";

    const tableRowClass =
      tableType === "recentOrderTable"
        ? "mt-3 border border-t-gray-300 border-b-gray-300"
        : tableType === "ordersTable"
        ? "mt-3 border border-t-gray-300 border-b-gray-300"
        : tableType === "productsTable"
        ? "mt-3 border border-t-gray-300 border-b-gray-300"
        : tableType === "vendorTable"
        ? "mt-3 border border-t-gray-300 border-b-gray-300"
        : tableType === "categoryTable" ||
          tableType === "userOrdersTable" ||
          tableType === "emailTable" ||
          tableType === "withdrawalsTable" ||
          tableType === "recentOrdersTable" ||
          tableType === "couponTable" ||
          tableType === "carouselTable" ||
          tableType === "sizeChartTable" ||
          tableType === "withdrawalRequestTable"
        ? "mt-3 border border-t-gray-300 border-b-gray-300"
        : "";

    const tableRowItemClass =
      tableType === "recentOrderTable"
        ? "font-semibold text-black"
        : tableType === "productsTable"
        ? "font-semibold text-black"
        : tableType === "ordersTable"
        ? "font-semibold text-black"
        : tableType === "vendorTable"
        ? "font-semibold text-black"
        : tableType === "categoryTable" ||
          tableType === "userOrdersTable" ||
          tableType === "emailTable" ||
          tableType === "withdrawalsTable" ||
          tableType === "couponTable" ||
          tableType === "withdrawalRequestTable" ||
          tableType === "carouselTable" ||
          tableType === "sizeChartTable" ||
          tableType === "recentOrdersTable"
        ? "font-semibold text-black"
        : "";

    const tableHeadinBgColorClass =
      tableType === "recentOrderTable"
        ? "bg-white"
        : tableType === "productsTable"
        ? "bg-white"
        : tableType === "ordersTable"
        ? "bg-white"
        : tableType === "vendorTable"
        ? "bg-white"
        : tableType === "categoryTable" ||
          tableType === "userOrdersTable" ||
          tableType === "couponTable" ||
          tableType === "emailTable" ||
          tableType === "withdrawalsTable" ||
          tableType === "withdrawalRequestTable" ||
          tableType === "carouselTable" ||
          tableType === "sizeChartTable" ||
          tableType === "recentOrdersTable"
        ? "bg-white"
        : "";

    // Get current rows
    const currentRows = tableData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    // Assuming `currentRows` is your data array
    const sortedRows = useMemo(() => {
      return [...currentRows].sort((a, b) => {
        const dateA = new Date(a.creationTime);
        const dateB = new Date(b.creationTime);

        // Check if both dateA and dateB are valid dates
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          // If either date is invalid, return 0 to indicate no sorting needed
          return 0;
        }

        // Perform the comparison
        if (dateA < dateB) {
          return 1; // Sort in descending order
        } else if (dateA > dateB) {
          return -1; // Sort in ascending order
        } else {
          return 0; // Dates are equal
        }
      });
    }, [currentRows]);

    const handleRowClick = useCallback(
      (id: string) => {
        navigate(`/product-details/${id}`);
      },
      [navigate]
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleOrderRowClick = useCallback((item) => {
      setModalContent(item);
      setIsModalOpen(true);
    }, []);

    const handleUserOrderRowClick = useCallback(
      (id: string) => {
        navigate(`/user/${id}/order`);
      },
      [navigate]
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleCouponVendorClick = useCallback((item) => {
      setcouponModalContent(item);
      setIsCouponModalOpen(true);
    }, []);

    const closeCouponModal = useCallback(() => {
      setIsCouponModalOpen(false);
      setModalContent(null);
    }, []);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleWithDrawalRequestClick = useCallback((item) => {
      setRequestModalContent(item);
      setIsRequestModalOpen(true);
    }, []);

    const closeWithdrawalModal = useCallback(() => {
      setIsRequestModalOpen(false);
      setRequestModalContent(null);
    }, []);

    const closeModal = useCallback(() => {
      setIsModalOpen(false);
      setModalContent(null);
    }, []);

    const handleDelete = async (imageId: string) => {
      try {
        await deleteCarouselImage(imageId).unwrap();
        toast.success("Carousel image deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete carousel image.");
      }
    };
    const handleDeleteSizeChart = async (imageId: string) => {
      try {
        await deleteSizeChartImage(imageId).unwrap();
        toast.success("Size Chart image deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete Size Chart image.");
      }
    };

    const handleActivate = async (imageId: string) => {
      try {
        // Set the selected image as active
        await setActiveSizeChartImage(imageId).unwrap();
      } catch (error) {
        console.error("Failed to activate image:", error);
      }
    };

    return (
      <>
        <div className={`w-full  pb-3 ${tableContainerClass} overflow-hidden`}>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead
                className={`w-full h-auto sticky top-0  ${tableHeadinBgColorClass}`}
              >
                <tr className={`w-full h-full flex py-3 ${tableHeadRowClass}`}>
                  {tableHeading &&
                    tableHeading.map(({ label }, index) => (
                      <th
                        key={index}
                        className={`min-w-[150px] flex ${
                          label === "List Name" || label === "S.No"
                            ? "justify-start px-14"
                            : "justify-center"
                        }  items-center`}
                        style={{ width: `${100 / tableHeading.length}%` }}
                      >
                        <p
                          className={`text-md font-ubuntu truncate ${tableHeadingPClass}`}
                        >
                          {label}
                        </p>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className={`overflow-y-auto block`}>
                {tableType === "recentOrderTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-ful h-[4rem] flex ${tableRowClass} `}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          // Check if the key is not 'listId'
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            <p
                              className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                key === "id" ? "truncate" : null
                              }`}
                            >
                              {key === "createdAt"
                                ? formatDate(item[key])
                                : item[key]}
                            </p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "productsTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full overflow-hidden h-[6rem] flex ${tableRowClass}`}
                        onClick={() => handleRowClick(item.productId)}
                      >
                        {Object.keys(item).map(
                          (key, keyIndex) =>
                            // Check if the key is not 'listId'
                            key !== "productId" &&
                            key !== "vendorId" && (
                              <td
                                key={keyIndex}
                                className={`h-full flex ${
                                  keyIndex === 0
                                    ? "justify-start px-14"
                                    : "justify-center"
                                } items-center cursor-pointer`}
                                style={{
                                  width: `${100 / tableHeading.length}%`,
                                }}
                              >
                                {key === "productImage" ? (
                                  <img
                                    src={item[key]}
                                    alt="Product"
                                    className=" h-20 rounded-xl"
                                  />
                                ) : (
                                  <p
                                    className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                      key === "id" ? "truncate" : null
                                    }`}
                                  >
                                    {key === "creationTime"
                                      ? formatDate(item[key])
                                      : item[key]}
                                  </p>
                                )}
                              </td>
                            )
                        )}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "carouselTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full overflow-hidden h-[6rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start truncate px-14"
                                : "justify-center"
                            } items-center`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "image" ? (
                              <img
                                src={item[key] as string}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : key === "status" ? (
                              <p
                                className={`text-lg font-ubuntu ${
                                  item[key] ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {item[key] ? "Active" : "Inactive"}
                              </p>
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "id" ? "truncate" : ""
                                }`}
                              >
                                {key === "updatedAt"
                                  ? formatDate(item[key] as string)
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                        <td className="h-full flex justify-center items-center">
                          <button
                            onClick={() => handleDelete(item.imageId)}
                            className="text-red-600 w-40 font-ubuntu text-lg flex items-center justify-center hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "sizeChartTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full overflow-hidden h-[6rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start truncate px-14"
                                : "justify-center"
                            } items-center`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "image" ? (
                              <img
                                src={item[key] as string}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : key === "status" ? (
                              <p
                                className={`text-lg font-ubuntu cursor-pointer ${
                                  item[key] ? "text-green-600" : "text-red-600"
                                }`}
                                onClick={() => handleActivate(item.imageId)}
                              >
                                {item[key] ? "Active" : "Inactive"}
                              </p>
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "id" ? "truncate" : ""
                                }`}
                              >
                                {key === "updatedAt"
                                  ? formatDate(item[key] as string)
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}

                        <td className="h-full flex justify-center items-center">
                          <button
                            onClick={() => handleDeleteSizeChart(item.imageId)}
                            className="text-red-600 w-40 font-ubuntu text-lg flex items-center justify-center hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {tableType === "vendorTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[6rem] flex ${tableRowClass} `}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className=" h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "vendorId" ? "truncate" : null
                                }`}
                              >
                                {key === "creationTime"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "categoryTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-ful h-[6rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className=" h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "categoryId" ? "truncate" : null
                                }`}
                              >
                                {key === "creationTime"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "ordersTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                        onClick={() => handleOrderRowClick(item)}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "status" &&
                                  item.status === "Order Placed"
                                    ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Order Confirm"
                                    ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Processing"
                                    ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "On the way"
                                    ? "bg-orange-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Delivered"
                                    ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : null
                                } ${key === "orderId" ? "truncate" : null}`}
                              >
                                {key === "creationTime" ||
                                key === "createdAt" ||
                                key === "date"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "recentOrdersTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "status" && item.status === "Ordered"
                                    ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Processing"
                                    ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Delivered"
                                    ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : null
                                } ${key === "id" ? "truncate" : null}`}
                              >
                                {key === "creationTime" ||
                                key === "createdAt" ||
                                key === "date"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "emailTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "status" && item.status === "Ordered"
                                    ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Processing"
                                    ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Delivered"
                                    ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : null
                                } ${key === "id" ? "truncate" : null}`}
                              >
                                {key === "creationTime" ||
                                key === "createdAt" ||
                                key === "date"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "withdrawalsTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "status" && item.status === "Pending"
                                    ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Completed"
                                    ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Rejected"
                                    ? "bg-red-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : null
                                } ${key === "id" ? "truncate" : null}`}
                              >
                                {key === "creationTime" ||
                                key === "createdAt" ||
                                key === "date" ||
                                key === "requestedDate"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "userOrdersTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                        onClick={() => handleUserOrderRowClick(item.orderId)}
                      >
                        {Object.keys(item).map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`h-full flex ${
                              keyIndex === 0
                                ? "justify-start px-14"
                                : "justify-center"
                            } items-center cursor-pointer`}
                            style={{
                              width: `${100 / tableHeading.length}%`,
                            }}
                          >
                            {key === "productImage" ? (
                              <img
                                src={item[key]}
                                alt="Product"
                                className="h-20 rounded-xl"
                              />
                            ) : (
                              <p
                                className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                  key === "status" && item.status === "Ordered"
                                    ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Processing"
                                    ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Delivered"
                                    ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : key === "status" &&
                                      item.status === "Cancelled"
                                    ? "bg-red-200 px-3 py-2 w-24 text-center rounded-xl"
                                    : null
                                } ${key === "orderId" ? "truncate" : null}`}
                              >
                                {key === "creationTime" || key === "createdAt"
                                  ? formatDate(item[key])
                                  : item[key]}
                              </p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {tableType === "couponTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full h-[4rem] flex ${tableRowClass}`}
                        onClick={() => handleCouponVendorClick(item)}
                      >
                        {Object.keys(item).map(
                          (key, keyIndex) =>
                            key !== "couponId" && (
                              <td
                                key={keyIndex}
                                className={`h-full flex ${
                                  keyIndex === 0
                                    ? "justify-start px-14"
                                    : "justify-center"
                                } items-center cursor-pointer`}
                                style={{
                                  width: `${100 / tableHeading.length}%`,
                                }}
                              >
                                {key === "productImage" ? (
                                  <img
                                    src={item[key]}
                                    alt="Product"
                                    className="h-20 rounded-xl"
                                  />
                                ) : (
                                  <p
                                    className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                      key === "status" &&
                                      item.status === "Active"
                                        ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                        : key === "status" &&
                                          item.status === "Inactive"
                                        ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                        : null
                                    } `}
                                  >
                                    {key === "creationTime" ||
                                    key === "createdAt"
                                      ? formatDate(item[key])
                                      : item[key]}
                                  </p>
                                )}
                              </td>
                            )
                        )}
                      </tr>
                    ))}
                  </>
                )}
                {tableType === "withdrawalRequestTable" && (
                  <>
                    {sortedRows.map((item, index) => (
                      <tr
                        key={index}
                        className={`w-full  h-[4rem] flex ${tableRowClass}`}
                        onClick={() => handleWithDrawalRequestClick(item)}
                      >
                        {Object.keys(item).map(
                          (key, keyIndex) =>
                            key !== "vendorId" && (
                              <td
                                key={keyIndex}
                                className={`h-full flex ${
                                  keyIndex === 0
                                    ? "justify-start px-14"
                                    : "justify-center"
                                } items-center cursor-pointer`}
                                style={{
                                  width: `${100 / tableHeading.length}%`,
                                }}
                              >
                                {key === "productImage" ? (
                                  <img
                                    src={item[key]}
                                    alt="Product"
                                    className="h-20 rounded-xl"
                                  />
                                ) : (
                                  <p
                                    className={`text-sm font-ubuntu ${tableRowItemClass} ${
                                      key === "status" &&
                                      item.status === "Pending"
                                        ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                                        : key === "status" &&
                                          item.status === "Completed"
                                        ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                                        : key === "status" &&
                                          item.status === "Rejected"
                                        ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                                        : null
                                    }  ${key === "id" ? "truncate" : null}`}
                                  >
                                    {key === "creationTime" ||
                                    key === "createdAt"
                                      ? formatDate(item[key])
                                      : item[key]}
                                  </p>
                                )}
                              </td>
                            )
                        )}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <OrderDetailsModal content={modalContent} onClose={closeModal} />
        )}
        {isCouponModalOpen && (
          <CouponDetailModal
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            content={couponModalContent}
            onClose={closeCouponModal}
          />
        )}
        {isRequestModalOpen && (
          <WithdrawalRequestModal
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            content={reuqestModalContent}
            onClose={closeWithdrawalModal}
          />
        )}

        {/* Pagination Controls */}
        {tableData.length > 5 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            availableOptions={availableOptions}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </>
    );
  }
);

export default Table;
