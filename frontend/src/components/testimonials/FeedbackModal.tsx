import { useRef, useState, type BaseSyntheticEvent } from "react";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSendFeedback } from "../../hooks/useTestimonials";
import { getErrorMessage, getValidationErrors } from "../../lib/apiErrors";

// Laravel: profile max:1048 (KB).
const MAX_PHOTO_SIZE = 1048 * 1024;

const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(255, "Name is too long"),
  representing: z.string().trim().max(255, "This is too long").optional(),
  feedback: z
    .string()
    .trim()
    .min(1, "Please enter your feedback")
    .max(500, "Feedback cannot exceed 500 characters"),
  photo: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files?.length || files[0].size <= MAX_PHOTO_SIZE,
      "Photo must not exceed 1 MB",
    )
    .refine(
      (files) =>
        !files?.length ||
        ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
      "Only JPG, PNG and WebP images are allowed",
    ),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      representing: "",
      feedback: "",
    },
  });

  const feedback = useWatch({
    control,
    name: "feedback",
    defaultValue: "",
  });

  function openModal() {
    setNotice("");
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  const sendFeedback = useSendFeedback();

  async function onSubmit(
    values: FeedbackFormValues,
    event?: BaseSyntheticEvent,
  ) {
    setNotice("");

    try {
      await sendFeedback.mutateAsync({
        name: values.name,
        feedback: values.feedback,
        // Optional fields are left out when empty.
        ...(values.representing
          ? { representation: values.representing }
          : {}),
        ...(values.photo?.length ? { profile: values.photo[0] } : {}),
      });

      // Closing the dialog also resets the form (see onDialogClose).
      (event?.target as HTMLElement | undefined)?.closest("dialog")?.close();
      toast.success(
        "Thank you! Your feedback was received and will appear after review.",
      );
    } catch (error) {
      // Keep what the guest typed and show Laravel's field errors.
      // The API names differ from the form: representation, profile.
      const fieldErrors = getValidationErrors(error);
      const fieldMap = {
        name: "name",
        representation: "representing",
        feedback: "feedback",
        profile: "photo",
      } as const;

      Object.entries(fieldMap).forEach(([apiField, formField]) => {
        const fieldError = fieldErrors?.[apiField]?.[0];
        if (fieldError) setError(formField, { message: fieldError });
      });

      setNotice(
        fieldErrors
          ? "Please check the highlighted fields."
          : getErrorMessage(
              error,
              "Your feedback could not be sent. Please try again.",
            ),
      );
    }
  }

  function onDialogClose() {
    reset();
    setNotice("");
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="mt-6 cursor-pointer rounded-full border border-gold px-5 py-2 font-sans text-xs font-semibold uppercase text-gold transition-colors hover:bg-gold hover:text-white"
      >
        + Add Feedback
      </button>

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        aria-labelledby="feedback-title"
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3
            id="feedback-title"
            className="font-serif text-[25px] text-heading"
          >
            Add Your Feedback
          </h3>

          <button
            type="button"
            onClick={closeModal}
            aria-label="Close feedback form"
            className="cursor-pointer rounded bg-gray-100 p-2 text-gray-500 hover:text-heading"
          >
            <X size={22} />
          </button>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-6 text-left"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="feedback-name"
                className="mb-3 block text-base text-body"
              >
                Full Name
              </label>

              <input
                id="feedback-name"
                {...register("name")}
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "feedback-name-error" : undefined
                }
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

              {errors.name && (
                <p
                  id="feedback-name-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-representing"
                className="mb-3 block text-base text-body"
              >
                Representing:
              </label>

              <input
                id="feedback-representing"
                {...register("representing")}
                placeholder="e.g., Google, Apple, Samsung"
                aria-invalid={!!errors.representing}
                aria-describedby={
                  errors.representing
                    ? "feedback-representing-error"
                    : undefined
                }
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

              {errors.representing && (
                <p
                  id="feedback-representing-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.representing.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-3 block text-base text-body"
              >
                Your Feedback
              </label>

              <textarea
                id="feedback-message"
                {...register("feedback")}
                rows={4}
                maxLength={500}
                placeholder="Write your feedback here..."
                aria-invalid={!!errors.feedback}
                aria-describedby={
                  errors.feedback ? "feedback-message-error" : undefined
                }
                className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-sm text-gray-500">
                {feedback?.length ?? 0} / 500
              </p>

              {errors.feedback && (
                <p
                  id="feedback-message-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.feedback.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-photo"
                className="mb-3 block text-base text-body"
              >
                Your Photo
              </label>

              <input
                id="feedback-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                {...register("photo")}
                aria-invalid={!!errors.photo}
                aria-describedby={
                  errors.photo ? "feedback-photo-error" : "feedback-photo-help"
                }
                className="block w-full rounded-md border border-gray-300 text-sm file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-gray-300 file:bg-gray-100 file:px-4 file:py-3"
              />

              <p
                id="feedback-photo-help"
                className="mt-2 text-sm text-gray-500"
              >
                Optional — JPG, PNG or WEBP, max 1 MB
              </p>

              {errors.photo && (
                <p
                  id="feedback-photo-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.photo.message}
                </p>
              )}
            </div>
          </div>

          {notice && (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {notice}
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase text-heading"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="cursor-pointer rounded-md bg-sand px-5 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
