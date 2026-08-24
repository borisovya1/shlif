import CallbackButton from "@/components/ui/CallbackButton";
import { PhoneIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export default function CtaBanner() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="container-page">
        <div className="flex flex-col items-start gap-8 rounded-[2rem] bg-copper-500 p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Готовы обсудить проект?
            </h2>
            <p className="mt-3 max-w-xl text-copper-50">
              Бесплатный выезд замерщика и смета в течение 24 часов после осмотра объекта.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CallbackButton className="btn bg-white text-copper-700 hover:bg-copper-50">
              Записаться на замер
            </CallbackButton>
            <a href={site.phone.href} className="btn btn-ghost-light">
              <PhoneIcon className="h-5 w-5" />
              {site.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
