"use client";

import { data } from "@/data";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Home, BookOpen } from "lucide-react";

export default function BookView() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [totalPages, setTotalPages] = useState(data.chapters.length + 2); // Cover + chapters + thank you page

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

  const isMobile = dimensions.width < 768;

  const handlePrevPage = () => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleNextPage = () => {
    if (bookRef.current && currentPage < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handleGoToPage = (pageNumber: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(pageNumber);
    }
  };

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-muted/30 to-muted/80 px-4 py-8">
      <div className="w-full max-w-7xl">
        {/* Book Navigation Controls */}
        <div className="flex justify-between items-center mb-6 px-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleGoToPage(0)}
            className="gap-2 shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Cover</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="shadow-sm hover:bg-primary/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="text-sm font-medium px-3 py-1.5 bg-background rounded-md shadow-sm border">
              {currentPage + 1} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="shadow-sm hover:bg-primary/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="default" size="lg" className="gap-2 shadow-sm">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reading Mode</span>
          </Button>
        </div>

        {/* Book Container */}
        <div className="relative mx-auto rounded-lg shadow-2xl overflow-hidden">
          <HTMLFlipBook
            ref={bookRef}
            width={
              isMobile
                ? dimensions.width * 0.9
                : Math.min(dimensions.width * 0.45, 550)
            }
            height={Math.min(dimensions.height * 0.75, 750)}
            size="stretch"
            minHeight={480}
            maxHeight={dimensions.height * 0.85}
            minWidth={320}
            maxWidth={dimensions.width}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            showCover={isMobile}
            onFlip={(e) => {
              setCurrentPage(e.data);
            }}
            flippingTime={800}
            usePortrait={false}
            startZIndex={500}
            autoSize
            clickEventForward={false}
            showPageCorners={true}
            disableFlipByClick={false}
            className="book-container"
            style={{ margin: "0 auto" }}
            startPage={0}
            drawShadow={true}
            useMouseEvents={true}
            swipeDistance={0}
          >
            {/* Cover Page */}
            <div className="relative flex flex-col justify-center items-center p-8 h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 border-r">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] bg-repeat opacity-30 mix-blend-overlay"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight tracking-tight text-slate-900 dark:text-white mb-6">
                {data.title}
              </h1>
              <div className="w-48 h-1 bg-primary/30 rounded-full my-6"></div>
              <p className="text-xl text-center text-slate-700 dark:text-slate-300 italic">
                Written by
              </p>
              <h2 className="text-2xl md:text-3xl font-medium text-center mt-3 text-slate-800 dark:text-slate-200">
                {data.author}
              </h2>
              <div className="absolute bottom-6 right-6 text-sm text-slate-500 dark:text-slate-400">
                <BookOpen className="inline-block mr-1 h-4 w-4 mb-0.5" /> Open
                to begin
              </div>
            </div>

            {/* Chapter Pages */}
            {data.chapters.map((page, index) => (
              <div
                key={index}
                className="relative flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-8 border-r"
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] bg-repeat opacity-20 mix-blend-overlay"></div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                  {page.title}
                </h1>
                <div className="relative w-full h-72 md:h-96 mt-4 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={page.image}
                    alt={page.title}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {page.content}
                </p>
                <div className="absolute bottom-6 right-6 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                  Page {index + 1}
                </div>
              </div>
            ))}

            {/* Thank You Page */}
            <div className="relative flex flex-col justify-center items-center p-8 h-full bg-gradient-to-br from-emerald-50 to-blue-100 dark:from-slate-800 dark:to-emerald-900 border-r">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] bg-repeat opacity-30 mix-blend-overlay"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-6">
                The End
              </h1>
              <div className="w-32 h-1 bg-primary/30 rounded-full my-6"></div>
              <p className="text-2xl text-center font-medium text-slate-700 dark:text-slate-300">
                Thank you for reading!
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleGoToPage(0)}
                className="mt-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="mr-2 h-4 w-4" /> Back to Cover
              </Button>
            </div>
          </HTMLFlipBook>
        </div>

        {/* Mobile-optimized Navigation for Small Screens */}
        {isMobile && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <div className="flex items-center gap-3 bg-background/90 backdrop-blur-md border rounded-full px-4 py-2 shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGoToPage(0)}
                className="rounded-full"
              >
                <Home className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-sm font-medium px-3">
                {currentPage + 1}/{totalPages}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
