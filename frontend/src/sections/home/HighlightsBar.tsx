import { useAboutStats } from "../../hooks/useAboutStats";

export default function HighlightsBar() {
  const { data: highlights, isPending, isError } = useAboutStats();

  if (isPending) {
    return (
      <section
        role="status"
        aria-label="Loading hotel highlights"
        className="relative z-20 mx-auto w-full max-w-330 lg:-mt-20"
      >
        <div className="grid grid-cols-1 bg-ink shadow-soft md:grid-cols-2 lg:grid-cols-5">
          {[0, 1, 2, 3].map((cell) => (
            <div key={cell} className="space-y-3 px-6 py-5 lg:py-12">
              <div className="animate-pulse motion-reduce:animate-none h-3 w-28 rounded bg-white/10" />
              <div className="animate-pulse motion-reduce:animate-none h-4 w-full rounded bg-white/10" />
              <div className="animate-pulse motion-reduce:animate-none h-4 w-3/4 rounded bg-white/10" />
            </div>
          ))}
          <div className="min-h-32.5 bg-forest md:col-span-2 lg:col-span-1" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative z-20 mx-auto w-full max-w-330 bg-ink p-6 text-white lg:-mt-20">
        Unable to load hotel highlights.
      </section>
    );
  }

  return (
    <section
      aria-label="Hotel highlights"
      className="relative z-20 mx-auto w-full max-w-330 lg:-mt-20"
    >
      <div className="grid grid-cols-1 bg-ink shadow-soft md:grid-cols-2 lg:grid-cols-5">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="px-6 py-5 lg:py-12">
            <h2 className="font-sans text-[12px] font-bold tracking-[1px] uppercase text-white">
              {highlight.title}
            </h2>

            <p className="mt-2 text-[16px] leading-[1.8] text-body">
              {highlight.description}
            </p>
          </div>
        ))}

        <a
          href="#about_us"
          className="flex min-h-32.5 items-center justify-center bg-forest px-6 py-8 text-center font-sans text-[14px] font-bold tracking-[1px] uppercase text-white md:col-span-2 lg:col-span-1"
        >
          Learn More About Our Commitment
        </a>
      </div>
    </section>
  );
}
