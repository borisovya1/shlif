import SectionHeading from "@/components/ui/SectionHeading";
import { StarIcon } from "@/components/ui/icons";
import { reviews } from "@/lib/content";

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Отзывы"
            title="Что говорят клиенты"
            text="Реальные отзывы о шлифовке, отделке и работе команды на объекте."
          />

          <div className="card flex items-center gap-5 p-5">
            <span className="text-4xl font-extrabold text-bark-900">4,8</span>
            <span>
              <span className="flex gap-0.5 text-copper-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" />
                ))}
              </span>
              <span className="mt-1 block text-sm text-bark-400">на Яндекс.Картах</span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.id} className="card flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-copper-100 text-lg font-extrabold text-copper-700">
                  {review.author.charAt(0)}
                </span>
                <span>
                  <span className="block font-bold text-bark-900">{review.title}</span>
                  <span className="block text-sm text-bark-400">{review.author}</span>
                </span>
              </div>

              <span className="mt-4 flex gap-0.5 text-copper-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" />
                ))}
              </span>

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-bark-600">
                «{review.text}»
              </blockquote>

              <figcaption className="mt-5 border-t border-bark-100 pt-4 text-xs font-semibold tracking-wide text-bark-400 uppercase">
                {review.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
