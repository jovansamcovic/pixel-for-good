import { HomePage } from "@/src/2-pages/home/HomePage";


const locales = ["en", "sr"];

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      <HomePage />
    </>
  );
}
