import React, { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showPageInfo = true,
  showItemsInfo = true,
  siblingCount = 1,
  disabled = false,
  className = "",
  size = "md",
}) => {
  // Generar rango de páginas a mostrar
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // No dots on left, but dots on right
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Dots on left, but no dots on right
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Both left and right dots present
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  const handlePageChange = useCallback(
    (page) => {
      if (
        page >= 1 &&
        page <= totalPages &&
        page !== currentPage &&
        !disabled
      ) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        onPageChange?.(page);
      }
    },
    [currentPage, totalPages, disabled, onPageChange]
  );

  const handlePrevious = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  const handleNext = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  // Configuraciones de tamaño
  const sizeClasses = {
    sm: {
      button: "h-8 min-w-[32px] px-2 text-sm",
      nav: "h-8 w-8",
      text: "text-sm",
    },
    md: {
      button: "h-10 min-w-[40px] px-3 text-sm",
      nav: "h-10 w-10",
      text: "text-sm",
    },
    lg: {
      button: "h-12 min-w-[48px] px-4 text-base",
      nav: "h-12 w-12",
      text: "text-base",
    },
  };

  const currentSizeClasses = sizeClasses[size] || sizeClasses.md;

  // Información de elementos
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Información de elementos */}
      {showItemsInfo && totalItems > 0 && (
        <div
          className={`${currentSizeClasses.text} text-white order-2 sm:order-1`}
        >
          Mostrando <span className="font-medium">{startItem}</span> a{" "}
          <span className="font-medium">{endItem}</span> de{" "}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Botón anterior */}
        <button
          onClick={handlePrevious}
          disabled={disabled || currentPage <= 1}
          className={`
            ${
              currentSizeClasses.nav
            } rounded-xl border-2 border-gray-200 bg-white
            flex items-center justify-center transition-all duration-200
            ${
              disabled || currentPage <= 1
                ? "opacity-60 cursor-not-allowed text-gray-400"
                : "hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            }
          `}
          aria-label="Página anterior"
        >
          <ChevronLeft size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className={`
                    ${currentSizeClasses.button} rounded-xl
                    flex items-center justify-center text-gray-400
                  `}
                >
                  <MoreHorizontal
                    size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                  />
                </span>
              );
            }

            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={disabled}
                className={`
                  ${
                    currentSizeClasses.button
                  } rounded-xl border-2 transition-all duration-200
                  flex items-center justify-center font-medium
                  ${
                    disabled
                      ? "opacity-60 cursor-not-allowed"
                      : isCurrentPage
                      ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  }
                  ${isCurrentPage ? "animate-in zoom-in-95 duration-200" : ""}
                `}
                aria-label={`Ir a página ${pageNumber}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={handleNext}
          disabled={disabled || currentPage >= totalPages}
          className={`
            ${
              currentSizeClasses.nav
            } rounded-xl border-2 border-gray-200 bg-white
            flex items-center justify-center transition-all duration-200
            ${
              disabled || currentPage >= totalPages
                ? "opacity-60 cursor-not-allowed text-gray-400"
                : "hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            }
          `}
          aria-label="Página siguiente"
        >
          <ChevronRight size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        </button>
      </div>

      {/* Información de página */}
      {showPageInfo && (
        <div className={`${currentSizeClasses.text} text-white order-3`}>
          Página <span className="font-medium">{currentPage}</span> de{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      )}
    </div>
  );
};
