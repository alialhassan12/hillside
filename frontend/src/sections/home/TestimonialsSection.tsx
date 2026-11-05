import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import FeedbackModal from "../../components/testimonials/FeedbackModal";

interface Testimonial {
  id: string;
  name: string;
  representing?: string;
  feedback: string;
}

// Temporary data for development only.
const testimonials: Testimonial[] = [
  {
    id: "demo-1",
    name: "Demo Guest 1",
    representing: "Example Company",
    feedback: "Sample feedback to test the testimonial layout.",
  },
  {
    id: "demo-2",
    name: "Demo Guest 2",
    feedback: "Another sample review to test carousel navigation.",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasTestimonials = testimonials.length > 0;
  const activeTestimonial = testimonials[activeIndex];

  function nextTestimonial() {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }

  function previousTestimonial() {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length,
    );
  }

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-330 px-6">
        <div className="text-center">
          <p className="font-sans text-[13px] font-bold uppercase tracking-[2px] text-gold">
            Testimonial
          </p>

          <h2 className="mt-4 font-serif text-[38px] text-heading sm:text-[64px]">
            Happy Guests
          </h2>

          <FeedbackModal />
        </div>

        <div className="mx-auto mt-12 max-w-225">
          {hasTestimonials ? (
            <div className="rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-12">
              <Quote size={42} className="mb-6 fill-sand/20 text-sand" />

              <p className="font-sans text-lg leading-8 text-heading sm:text-xl">
                "{activeTestimonial.feedback}"
              </p>

              <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest/10">
                  <span className="font-serif text-2xl text-forest">
                    {activeTestimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-forest">
                    {activeTestimonial.name}
                  </h3>

                  {activeTestimonial.representing && (
                    <p className="mt-1 font-sans text-sm text-gold">
                      {activeTestimonial.representing}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="py-12 text-center text-body">
              No guest reviews available yet.
            </p>
          )}

          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={previousTestimonial}
              disabled={testimonials.length < 2}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-sand text-forest transition-colors hover:bg-forest hover:text-white disabled:cursor-default disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>

            {hasTestimonials && (
              <span className="font-sans text-sm text-body">
                {activeIndex + 1} / {testimonials.length}
              </span>
            )}

            <button
              type="button"
              onClick={nextTestimonial}
              disabled={testimonials.length < 2}
              aria-label="Next testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-sand text-forest transition-colors hover:bg-forest hover:text-white disabled:cursor-default disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
