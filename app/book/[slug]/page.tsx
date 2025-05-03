"use client";

import BookView from "@/components/book-view";
import { getBookBySlug } from "@/actions/book";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BookPageProps = {
  params: {
    slug: string;
  };
};

export default function BookPage({ params }: BookPageProps) {
  const [bookId, setBookId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const result = await getBookBySlug(params.slug);

        if (result.success && result.book) {
          setBookId(result.book.id);
        } else {
          setError(result.error || "Failed to load book");
        }
      } catch (err) {
        setError("An error occurred while fetching the book");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchBook();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !bookId) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
        <p className="text-destructive text-lg mb-4">
          {error || "Book not found"}
        </p>
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return <BookView bookId={bookId} />;
}
