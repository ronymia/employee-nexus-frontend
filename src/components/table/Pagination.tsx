import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type PaginationPropsType = {
  perPage: number;
  totalData: number;
  dataAuto?: string;
  changeHandler: (page: number) => void;
};

export default function Pagination({
  totalData,
  perPage,
  changeHandler,
}: PaginationPropsType) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(totalData / perPage);

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    changeHandler(pageNumber); // Call parent function when page changes
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const showPage = 3;
    // Show the 2 previous, current, and 2 next pages
    for (
      let i = Math.max(1, currentPage - showPage);
      i <= Math.min(currentPage + showPage, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Add ellipsis before the last page if current page is far from the last page
    if (currentPage + showPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Show the last page number if it's not already shown
    if (currentPage + showPage < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Previous Button */}
      <>
        <button
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
          className={`capitalize text-sm bg-[#f3f3f3] w-9 h-9 duration-200 hover:text-primary-focus rounded-full flex items-center justify-center drop-shadow cursor-pointer hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-primary disabled:text-base-300`}
        >
          <IoIosArrowBack className="text-2xl " />
        </button>
      </>

      {/* Page Numbers */}
      <div
        className={`bg-[#f3f3f3] px-2 py-1 flex items-center rounded-full drop-shadow`}
      >
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`h-9 w-9 bg-[#f3f3f3] hover:bg-primary hover:text-base-300 hover:rounded hover:drop-shadow font-medium cursor-pointer ${
                currentPage === page ? "rounded bg-primary text-base-300" : ""
              }`}
              onClick={() => changePage(page)}
            >
              {page}
            </button>
          ) : (
            // Ellipsis (i.e., "...")
            <span key={index} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <>
        <button
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
          className={`capitalize text-sm bg-[#f3f3f3] w-9 h-9 duration-200 hover:text-primary-focus rounded-full flex items-center justify-center drop-shadow cursor-pointer hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-primary disabled:text-base-300`}
        >
          <IoIosArrowForward className="text-2xl" />
        </button>
      </>
    </div>
  );
}
