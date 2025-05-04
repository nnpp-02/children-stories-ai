"use server";

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { generateImageAi } from "./image";

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

type BookWithChapterCount = {
  id: string;
  bookTitle: string;
  bookCoverUrl: string | null;
  slug: string;
  status: string;
  createdAt: Date;
  _count: {
    chapters: number;
  };
};

type StoryChapter = {
  subTitle: string;
  textContent: string;
  imageDescription: string;
  page: string;
};

type StoryBook = {
  bookTitle: string;
  bookCoverDescription: string;
  chapters: StoryChapter[];
};

/**
 * Gets the authentication token from cookies
 */
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value;
}

/**
 * Gets the current user ID from the auth token
 */
async function getCurrentUserId() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, JWT_SECRET) as TokenPayload;
    return payload.id;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the current user information
 */
async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, JWT_SECRET) as TokenPayload;

    // Get full user details from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Generates a story using Google's Gemini AI
 */
async function generateStory(
  prompt: string,
  pages: number
): Promise<StoryBook | null> {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

    const promptTemplate = `
      Your job is to write a kids story book.
      The topic of the story is: ${prompt}
      The story must have exactly ${pages} chapters in an array format.

      I need the response in JSON format with the following details:
      - book title
      - book chapters in an array format with each object containing story
      subTitle, textContent, page and imageDescription to generate
      a vibrant, cartoon-style illustration using replicateAi.

      Here is an example of the JSON format:
      {
        "bookTitle": "The Three Little Acorns learn about AI",
        "bookCoverDescription": "A vibrant, cartoon-style illustration of three 
        little acorns learning about AI under a large oak tree, with glowing futuristic elements",
      
        "chapters": [
              {
                  "subTitle": "A Curious Acorn",
                  "textContent":
                  "Once upon a time, in a cozy oak tree, there were three little acorns named Oaky, Acorn, and Acorny. One day, Oaky, the most curious of the three, asked, 'What is this thing called AI that everyone keeps talking about?'",
                  "imageDescription": "A vibrant, cartoon-style illustration featuring A curious acorn looking up at a computer screen",
                  "page": "1"
              },
              {
                  "subTitle": "The Wise Old Owl",
                  "textContent":
                  "A wise old owl, who lived in a nearby hollow, heard Oaky's question. 'AI, my young friend,' hooted the owl, 'is a clever tool that can think and learn, much like a human brain. It can solve problems, create art, and even drive cars!'",
                  "imageDescription": "A vibrant, cartoon-style illustration featuring A wise old owl explaining AI to the acorns",
                  "page": "2"
              }
          ]
      }
    `;

    const result = await model.generateContent(promptTemplate);
    const response = result.response;
    const text = response.text();

    // Clean and parse the response
    const cleanResponse = text.trim().replace(/^```json|```$/g, "");
    const parsedResponse = JSON.parse(cleanResponse);

    // Make sure the response has all the required fields
    if (
      !parsedResponse.bookTitle ||
      !parsedResponse.bookCoverDescription ||
      !Array.isArray(parsedResponse.chapters)
    ) {
      console.error("Invalid response format from AI:", parsedResponse);
      return null;
    }

    // Validate and ensure all chapters have the required fields
    const validatedChapters = parsedResponse.chapters.map(
      (chapter: any, index: number) => ({
        subTitle: chapter.subTitle || `Chapter ${index + 1}`,
        textContent:
          chapter.textContent || "Content for this chapter is missing.",
        imageDescription:
          chapter.imageDescription || `Illustration for chapter ${index + 1}`,
        page: chapter.page?.toString() || (index + 1).toString(),
      })
    );

    return {
      bookTitle: parsedResponse.bookTitle,
      bookCoverDescription: parsedResponse.bookCoverDescription,
      chapters: validatedChapters,
    };
  } catch (error) {
    console.error("Error generating story with AI:", error);

    // Fallback to a simple story if AI generation fails
    const storyTitle = `Story about ${prompt.slice(0, 20)}...`;
    const chapters = Array.from({ length: pages }, (_, i) => ({
      subTitle: `Chapter ${i + 1}`,
      textContent: `This is the story content for chapter ${
        i + 1
      } about ${prompt.slice(0, 30)}...`,
      imageDescription: `A vibrant, cartoon-style illustration for chapter ${
        i + 1
      } featuring ${prompt.slice(0, 30)}...`,
      page: (i + 1).toString(),
    }));

    return {
      bookTitle: storyTitle,
      bookCoverDescription: `A vibrant cover featuring ${prompt.slice(
        0,
        30
      )}...`,
      chapters,
    };
  }
}

/**
 * Creates a new book based on the user's prompt
 */
export async function createBook(data: {
  prompt: string;
  numPages: number;
  title?: string;
}) {
  try {
    // Get current user with full details
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = currentUser.id;
    const userName = currentUser.name || currentUser.email.split("@")[0];

    // Validate input
    if (!data.prompt || data.prompt.trim().length < 10) {
      return { success: false, error: "Prompt must be at least 10 characters" };
    }

    if (!data.numPages || data.numPages < 1 || data.numPages > 10) {
      return {
        success: false,
        error: "Number of pages must be between 1 and 10",
      };
    }

    // Generate the story using AI
    const storyResult = await generateStory(data.prompt, data.numPages);

    if (!storyResult) {
      return { success: false, error: "Failed to generate story" };
    }

    // Use the generated title or the provided title
    const bookTitle = data.title || storyResult.bookTitle;

    // Generate a slug from the title
    const baseSlug = slugify(bookTitle, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    try {
      // Attempt to generate book cover image - errors will be handled inside the function
      console.log("Generating book cover image...");
      const bookCoverUrl = await generateImageAi(
        storyResult.bookCoverDescription
      );

      // Generate chapter images in parallel - all errors are handled internally in generateImageAi
      console.log("Generating chapter images in parallel...");
      const chapterImagesPromises = storyResult.chapters.map(
        async (chapter) => {
          try {
            console.log(`Generating image for "${chapter.subTitle}"`);
            const imageUrl = await generateImageAi(chapter.imageDescription);
            return {
              ...chapter,
              imageUrl,
            };
          } catch (error) {
            console.warn(
              `Using default image for chapter "${chapter.subTitle}"`
            );
            return {
              ...chapter,
              imageUrl: null,
            };
          }
        }
      );

      // Wait for all chapter images to be generated
      const chaptersWithImages = await Promise.all(chapterImagesPromises);

      // Use a transaction to ensure all database operations succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // Create the book
        const newBook = await tx.book.create({
          data: {
            bookTitle,
            slug,
            bookCoverDescription: storyResult.bookCoverDescription,
            bookCoverUrl,
            numPages: data.numPages,
            userId,
          },
          select: {
            id: true,
            bookTitle: true,
            slug: true,
          },
        });

        // Create all chapters with their images
        await Promise.all(
          chaptersWithImages.map((chapter) =>
            tx.chapter.create({
              data: {
                bookId: newBook.id,
                subTitle: chapter.subTitle,
                textContent: chapter.textContent,
                imageDescription: chapter.imageDescription,
                page: chapter.page,
                imageUrl: chapter.imageUrl,
              },
            })
          )
        );

        return newBook;
      });

      console.log(
        `Book "${bookTitle}" created successfully with ID: ${result.id} by author: ${userName}`
      );
      return {
        success: true,
        book: {
          id: result.id,
          title: result.bookTitle,
          slug: result.slug,
          author: userName,
        },
      };
    } catch (dbError) {
      console.error("Database error creating book:", dbError);
      return { success: false, error: "Failed to save book to database" };
    }
  } catch (error) {
    console.error("Error creating book:", error);
    return { success: false, error: "Failed to create book" };
  }
}

/**
 * Gets all books for the current user
 */
export async function getUserBooks() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      redirect("/login");
    }

    const books = await prisma.book.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      books: books.map((book) => ({
        id: book.id,
        title: book.bookTitle,
        coverImage: book.bookCoverUrl,
        status: book.status,
        slug: book.slug,
        chaptersCount: book._count.chapters,
        createdAt: book.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching user books:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}

/**
 * Gets a single book by ID
 */
export async function getBookById(bookId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      redirect("/login");
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
        userId,
      },
      include: {
        chapters: {
          orderBy: {
            page: "asc",
          },
        },
      },
    });

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return {
      success: true,
      book: {
        id: book.id,
        title: book.bookTitle,
        coverImage: book.bookCoverUrl,
        status: book.status,
        slug: book.slug,
        chapters: book.chapters,
        createdAt: book.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: "Failed to fetch book" };
  }
}

/**
 * Gets a single book by slug
 */
export async function getBookBySlug(slug: string) {
  try {
    const book = await prisma.book.findUnique({
      where: {
        slug,
      },
      include: {
        chapters: {
          orderBy: {
            page: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    // Determine the author name - use user's name, fallback to email, or "Anonymous"
    const authorName =
      book.user.name ||
      (book.user.email ? book.user.email.split("@")[0] : "Anonymous");

    return {
      success: true,
      book: {
        id: book.id,
        title: book.bookTitle,
        coverImage: book.bookCoverUrl,
        coverDescription: book.bookCoverDescription,
        status: book.status,
        slug: book.slug,
        chapters: book.chapters,
        author: authorName,
        authorId: book.user.id,
        createdAt: book.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: "Failed to fetch book" };
  }
}

/**
 * Deletes a book by ID
 */
export async function deleteBook(bookId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // First verify the book belongs to the user
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
        userId, // Ensure it belongs to the current user
      },
      select: {
        id: true,
        bookTitle: true,
      },
    });

    if (!book) {
      return {
        success: false,
        error: "Book not found or you don't have permission to delete it",
      };
    }

    // Delete the book (cascade delete will handle chapters)
    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

/**
 * Searches for books with titles matching the query
 */
export async function searchBooks(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        books: [],
        message: "Please enter at least 2 characters to search",
      };
    }

    const books = await prisma.book.findMany({
      where: {
        bookTitle: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
        // Only include books with status completed
        status: "completed",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit results to 20 books
    });

    return {
      success: true,
      books: books.map((book) => {
        // Determine the author name
        const authorName =
          book.user.name ||
          (book.user.email ? book.user.email.split("@")[0] : "Anonymous");

        return {
          id: book.id,
          title: book.bookTitle,
          coverImage: book.bookCoverUrl,
          status: book.status,
          slug: book.slug,
          chaptersCount: book._count.chapters,
          createdAt: book.createdAt,
          author: authorName,
        };
      }),
    };
  } catch (error) {
    console.error("Error searching books:", error);
    return { success: false, error: "Failed to search books" };
  }
}
