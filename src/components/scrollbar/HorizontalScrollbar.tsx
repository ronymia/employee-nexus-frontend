"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface HorizontalScrollbarProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export default function HorizontalScrollbar({
  children,
  className = "",
  isLoading = false,
}: HorizontalScrollbarProps) {
  // HANDLE HORIZONTAL SCROLL (Mouse Drag and Wheel)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const updateArrowVisibility = () => {
      if (!scrollContainer) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1); // -1 to fix rounding issue
    };

    if (scrollContainer) {
      updateArrowVisibility(); // Initial
      scrollContainer.addEventListener("scroll", updateArrowVisibility);
      window.addEventListener("resize", updateArrowVisibility);
    }

    return () => {
      scrollContainer?.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, []);

  // Effect for Mouse Wheel horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Crucial: Prevents default vertical scroll of the browser
      if (scrollContainer) {
        scrollContainer.scrollLeft += e.deltaY; // Scrolls horizontally
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Mouse down event for initiating the drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      scrollContainerRef.current.style.cursor = "grabbing";
      scrollContainerRef.current.style.userSelect = "none";
    }
  };

  // Mouse move event for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse up or leave event for stopping the drag
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
      scrollContainerRef.current.style.userSelect = "auto";
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      className={`inline-flex select-none items-center gap-x-2 cursor-grab overflow-x-auto overflow-y-hidden scroll-smooth w-full scrollbar-hide ${className}`}
    >
      {/* LEFT NAVIGATE */}
      {showLeftArrow && (
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollLeft -= 100;
            }
          }}
          className={`sticky hover:text-primary cursor-pointer flex justify-start items-center bg-linear-to-l from-transparent via-base-300 to-base-300 left-0 bottom-0 min-h-14 min-w-7 z-10`}
        >
          <FiChevronLeft className={`text-xl`} />
        </button>
      )}

      {/* CONTENT */}
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-base-100 text-center h-12 gap-2 flex items-center justify-center shrink-0 rounded-xl border border-gray-200 w-24 md:w-56"
            >
              <span className="loading loading-dots loading-md"></span>
            </div>
          ))
        : children}

      {/* RIGHT NAVIGATE */}
      {showRightArrow && (
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollLeft += 100;
            }
          }}
          className={`sticky flex cursor-pointer hover:text-primary justify-end items-center bg-linear-to-r from-transparent via-base-300 to-base-300 right-0 bottom-0 min-h-14 min-w-7 z-10`}
        >
          <FiChevronRight className={`text-xl`} />
        </button>
      )}
    </div>
  );
}
