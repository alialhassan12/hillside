import type { CSSProperties } from "react";
import { Link } from "react-router";
import { useContactBanner } from "../../hooks/useContactBanner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContacts } from "../../hooks/useContacts";
import { useCompanyAddress } from "../../hooks/useCompanyAddress";
import { getContactLink } from "../../lib/contactLink";
import { toast } from "sonner";
import { useSendMessage } from "../../hooks/useMessages";
import { getErrorMessage, getValidationErrors } from "../../lib/apiErrors";

// Limits match Laravel's POST /api/messages/send validation.
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(255, "Name is too long"),
  email: z
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  subject: z
    .string()
    .trim()
    .min(1, "Please enter a subject")
    .max(255, "Subject is too long"),
  phone: z.string().trim().max(20, "Phone number is too long").optional(),
  message: z
    .string()
    .trim()
    .min(1, "Please enter your message")
    .max(1000, "Message cannot exceed 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { data: banner } = useContactBanner();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      phone: "",
      message: "",
    },
  });

  const message = useWatch({
    control,
    name: "message",
    defaultValue: "",
  });

  const sendMessage = useSendMessage();

  async function onSubmit(values: ContactFormValues) {
    try {
      await sendMessage.mutateAsync({
        name: values.name,
        email: values.email,
        subject: values.subject,
        // Phone is optional; leave it out when empty.
        ...(values.phone ? { phone: values.phone } : {}),
        message: values.message,
      });

      reset();
      toast.success("Thank you, your message has been sent.");
    } catch (error) {
      // Keep what the guest typed and show Laravel's field errors.
      const fieldErrors = getValidationErrors(error);
      const fields = ["name", "email", "subject", "phone", "message"] as const;
      fields.forEach((field) => {
        const fieldError = fieldErrors?.[field]?.[0];
        if (fieldError) setError(field, { message: fieldError });
      });

      toast.error(
        fieldErrors
          ? "Please check the highlighted fields."
          : getErrorMessage(error, "Your message could not be sent. Please try again."),
      );
    }
  }

  const { data: contacts = [] } = useContacts();
  const { data: companyAddress } = useCompanyAddress();


  return (
    <>
      <section
        className="relative flex min-h-screen items-center justify-center bg-forest bg-cover bg-center bg-scroll lg:bg-fixed"
        style={{
          backgroundImage: banner?.contact_banner_img_url
            ? `url("${banner.contact_banner_img_url}")`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 px-6 text-center text-white motion-safe:animate-rise-in">
          <div className="mb-3 flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-sand">
              Home
            </Link>

            <span>&gt;</span>
            <span>Contact Us</span>
            <span>&gt;</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl">Contact us</h1>
        </div>
      </section>
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-225 bg-white px-6 py-10 shadow-xl sm:px-12">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-heading">Contact Us</h2>

            <p className="mt-3 font-sans text-sm text-body">
              We're open for any suggestion or just to have a chat
            </p>
          </div>

          <div data-reveal="up" className="mx-auto mt-8 grid max-w-150 grid-cols-1 gap-6 text-center sm:grid-cols-2">
            <div>
              <h3 className="font-sans text-sm font-semibold text-heading">
                Address:
              </h3>

              <p className="mt-2 text-sm leading-6 text-body">
                {companyAddress?.address ?? "Address unavailable"}
              </p>
            </div>

            {contacts.map((contact) => {
              const { kind, href, label } = getContactLink(contact.link);

              return (
                <div key={contact.id}>
                  <h3 className="font-sans text-sm font-semibold text-heading">
                    {contact.name.replace(/:\s*$/, "")}:
                  </h3>

                  {href ? (
                    <a
                      href={href}
                      {...(kind === "web"
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="mt-2 block break-all text-sm text-sand hover:text-forest"
                    >
                      {label}
                    </a>
                  ) : (
                    <p className="mt-2 break-all text-sm text-body">{label}</p>
                  )}
                </div>
              );
            })}
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            data-reveal="up"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
            className="mx-auto mt-10 max-w-150"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  {...register("name")}
                  placeholder="Name"
                  aria-label="Name"
                  aria-invalid={!!errors.name}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-sand"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  aria-invalid={!!errors.email}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-sand"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("subject")}
                  placeholder="Subject"
                  aria-label="Subject"
                  aria-invalid={!!errors.subject}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-sand"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone (optional)"
                  aria-label="Phone (optional)"
                  aria-invalid={!!errors.phone}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-sand"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <textarea
                {...register("message")}
                rows={5}
                maxLength={1000}
                placeholder="Message"
                aria-label="Message"
                aria-invalid={!!errors.message}
                className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-sand"
              />

              <p className="mt-1 text-right text-xs text-body">
                {message?.length ?? 0} / 1000
              </p>

              {errors.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="mt-5 w-full rounded-md bg-sand px-6 py-4 font-sans text-xs font-bold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
