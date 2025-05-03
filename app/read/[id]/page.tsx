import { redirect } from "next/navigation";
import { use } from "react";

type ReadByIdPageProps = {
  params: {
    id: string;
  };
};

export default function ReadByIdPage({ params }: ReadByIdPageProps) {
  // Unwrap params if it's a Promise
  const resolvedParams = params instanceof Promise ? use(params) : params;
  redirect(`/book/by-id/${resolvedParams.id}`);
}
