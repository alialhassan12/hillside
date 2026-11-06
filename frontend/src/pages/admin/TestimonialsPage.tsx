import { Pencil, Quote, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  cardClass,
  deleteButtonClass,
  iconButtonClass,
  sampleBadgeClass,
} from "../../components/admin/adminClasses";

// Sample cards to show the layout only.
const sampleTestimonials = [
  { id: 1, name: "Sample Guest 1", representing: "Sample Company" },
  { id: 2, name: "Sample Guest 2", representing: "" },
  { id: 3, name: "Sample Guest 3", representing: "Sample Company" },
];

export default function TestimonialsPage() {
  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Feedback sent by guests through the homepage feedback form"
        actions={<span className={sampleBadgeClass}>Sample</span>}
      />

      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sampleTestimonials.map((testimonial) => (
          <li key={testimonial.id} className={`${cardClass} flex flex-col p-5`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg font-medium text-stone-600"
              >
                {testimonial.name.charAt(0)}
              </span>

              <div className="min-w-0">
                <h2 className="truncate font-sans text-base font-semibold text-stone-900">
                  {testimonial.name}
                </h2>
                <p className="truncate text-sm text-stone-500">
                  {testimonial.representing || "No organization"}
                </p>
              </div>
            </div>

            <Quote
              size={22}
              aria-hidden="true"
              className="mt-5 fill-sand/20 text-sand"
            />
            <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">
              The guest's feedback text appears here. Feedback can be up to
              500 characters long.
            </p>

            <div className="mt-5 flex justify-end gap-1 border-t border-stone-100 pt-3">
              <button
                type="button"
                aria-label={`Edit feedback from ${testimonial.name}`}
                className={iconButtonClass}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                aria-label={`Delete feedback from ${testimonial.name}`}
                className={deleteButtonClass}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
