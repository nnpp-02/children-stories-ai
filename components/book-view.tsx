"use client";

import { data } from "@/data";
import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

export default function BookView() {
  const bookViewRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const isSinglePage = dimensions.width < 768;

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  return (
    <div>
      <HTMLFlipBook
        ref={bookViewRef}
        width={
          isSinglePage
            ? dimensions.width * 0.9
            : Math.min(dimensions.width * 0.45, 768)
        }
        height={dimensions.height * 0.95}
        size="stretch"
        minHeight={420}
        maxHeight={dimensions.height * 0.9}
        minWidth={315}
        maxWidth={dimensions.width}
        maxShadowOpacity={0.5}
        mobileScrollSupport={true}
        drawShadow
        useMouseEvents
        showCover={isSinglePage}
        onFlip={(e) => {
          setCurrentPage(e.data);
        }}
        style={{
          margin: "0 auto",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
        }}
        className=""
        startPage={0}
        flippingTime={1000}
        usePortrait={false}
        startZIndex={1000}
        autoSize={false}
        clickEventForward={false}
        swipeDistance={0}
        showPageCorners={false}
        disableFlipByClick={false}
      >
        <div className="flex flex-col justify-center items-center p-6 h-full">
          <h1 className="flex justify-center items-center h-screen text-4xl font-bold text-center">
            {data.title}
          </h1>
          <div className="flex flex-col justify-center items-center p-6 h-full">
            <h1 className="flex justify-center items-center h-screen text-center">
              {data.author}
            </h1>
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );
}
