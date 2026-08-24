import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Такой страницы на сайте нет. Вернитесь на главную или позвоните нам.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="bg-bark-950 py-28 text-white">
      <div className="container-page text-center">
        <p className="text-7xl font-extrabold text-copper-400">404</p>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Страница не найдена
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-bark-300">
          Возможно, страница была перемещена. Вернитесь на главную или позвоните нам — мы
          подскажем.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            На главную
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <a href={site.phone.href} className="btn btn-ghost-light">
            {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
