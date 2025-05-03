import { redirect } from "next/navigation";

type ReadByIdPageProps = {
  params: {
    id: string;
  };
};

export default function ReadByIdPage({ params }: ReadByIdPageProps) {
  redirect(`/book/id/${params.id}`);
}
