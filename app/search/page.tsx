"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchBooks } from "@/actions/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type Book = {
  id: string;
  title: string;
  status: string;
  coverImage?: string | null;
  slug: string;
  chaptersCount: number;
  createdAt: Date;
  author?: string;
};

type SearchResult = {
  success: boolean;
  books?: Book[];
  error?: string;
  message?: string;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Perform search when component mounts or query changes
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      setMessage("Please enter a search term");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result: SearchResult = await searchBooks(searchQuery);

      if (result.success) {
        setBooks(result.books || []);

        if (result.message) {
          setMessage(result.message);
        } else if (result.books && result.books.length === 0) {
          setMessage(`No books found for "${searchQuery}"`);
        }
      } else {
        setMessage(result.error || "Failed to search books");
        toast.error(result.error || "Failed to search books");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("An error occurred while searching");
      toast.error("An error occurred while searching");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Update URL with search query
      router.push(`/search?query=${encodeURIComponent(searchInput)}`);
    } else {
      toast.warning("Please enter a search term");
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Books</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search for books..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for books...</p>
        </div>
      )}

      {/* Message */}
      {message && !loading && (
        <div className="text-center py-4 text-gray-600">{message}</div>
      )}

      {/* Results */}
      {!loading && books.length > 0 && (
        <>
          <div className="mb-4 text-gray-600">
            Found {books.length} {books.length === 1 ? "book" : "books"}{" "}
            matching "{query}"
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                href={`/books/${book.slug}`}
                key={book.id}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className="h-40 bg-purple-100 flex items-center justify-center relative group-hover:brightness-105 transition-all"
                  style={{
                    backgroundImage: book.coverImage
                      ? `url(${book.coverImage})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!book.coverImage && (
                    <BookOpen className="h-12 w-12 text-purple-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 text-gray-900 truncate group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      By {book.author || "Anonymous"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(book.createdAt)}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full ml-auto">
                      {book.chaptersCount} Pages
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
