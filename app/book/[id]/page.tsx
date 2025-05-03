"use client";

import BookView from "@/components/book-view";

type BookIdPageProps = {
  params: {
    id: string;
  };
};

export default function BookIdPage({ params }: BookIdPageProps) {
  return <BookView bookId={params.id} />;
}
