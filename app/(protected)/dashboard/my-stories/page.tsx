import { getUserBooks } from "@/actions/book";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

type Book = {
  id: string;
  title: string;
  status: string;
  coverImage?: string | null;
  slug: string;
  chaptersCount: number;
  createdAt: Date;
};

export default async function MyStoriesPage() {
  const { success, books, error } = await getUserBooks();

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

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
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
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/books/${book.slug}`}>
                      {book.status === "completed" ? "Read" : "View"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
