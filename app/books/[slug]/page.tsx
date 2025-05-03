import { redirect } from "next/navigation";

type BookSlugPageProps = {
  params: {
    slug: string;
  };
};

export default function BookSlugPage({ params }: BookSlugPageProps) {
  redirect(`/book/${params.slug}`);
}
