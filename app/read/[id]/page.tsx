import { redirect } from "next/navigation";

type ReadByIdPageProps = {
  params: {
    id: string;
  };
};

export default function ReadByIdPage({ params }: ReadByIdPageProps) {
  redirect(`/book/by-id/${params.id}`);
}
