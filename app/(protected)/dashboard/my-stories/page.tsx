"use client";

import { getUserBooks, deleteBook } from "@/actions/book";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, Trash2, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Book = {
  id: string;
  title: string;
  status: string;
  coverImage?: string | null;
  slug: string;
  chaptersCount: number;
  createdAt: Date;
};

export default function MyStoriesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Load books on component mount
  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const result = await getUserBooks();
        if (result.success && result.books) {
          setBooks(result.books);
          setError(null);
        } else {
          setError(result.error || "Failed to load books");
        }
      } catch (err) {
        setError("An error occurred while loading your stories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  // Handle book deletion
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const result = await deleteBook(bookToDelete.id);
      if (result.success) {
        // Remove the book from the state
        setBooks(books.filter((book) => book.id !== bookToDelete.id));
        toast.success(`"${bookToDelete.title}" has been deleted successfully.`);
      } else {
        toast.error(result.error || "Failed to delete book");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  // Format the creation time
  const formatCreationTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stories</h1>
          <p className="text-gray-600">
            View and read your personalized children's stories
          </p>
        </div>
        <Button asChild className="sm:self-start flex items-center gap-2">
          <Link href="/dashboard/generate-book">
            <PlusCircle className="h-4 w-4" />
            Create New Story
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : !books || books.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Stories Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't created any stories yet. Get started by creating your
            first story!
          </p>
          <Button asChild>
            <Link href="/dashboard/generate-book">Create Your First Story</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: Book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="h-40 bg-purple-100 flex items-center justify-center"
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
                <h3 className="font-medium text-lg mb-1 text-gray-900 truncate">
                  {book.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Clock className="h-3 w-3" />
                  <span>{formatCreationTime(book.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      book.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : book.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {book.status === "completed"
                      ? `${book.chaptersCount} Pages`
                      : book.status === "failed"
                      ? "Generation Failed"
                      : "Generating..."}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteClick(book)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/books/${book.slug}`}>
                        {book.status === "completed" ? "Read" : "View"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              story "{bookToDelete?.title}" and all its chapters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
