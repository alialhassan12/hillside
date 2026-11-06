import { useState } from "react";
import { useSearchParams } from "react-router";
import { ImageIcon, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ImageUploadField from "../../components/admin/ImageUploadField";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  deleteButtonClass,
  iconButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  skeletonClass,
} from "../../components/admin/adminClasses";
import { useServices } from "../../hooks/useServices";
import {
  useCreateServiceDetail,
  useDeleteServiceDetail,
  useServiceDetails,
  useUpdateServiceDetail,
} from "../../hooks/useServiceDetails";
import {
  getErrorMessage,
  getValidationErrors,
  isNotFound,
  isTooLarge,
} from "../../lib/apiErrors";
import type { ServiceDetail } from "../../types/service";

const detailSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().trim().min(1, "Description is required"),
});

type DetailFormValues = z.infer<typeof detailSchema>;

const IMAGE_MAX_KB = 1048; // Laravel: image max:1048
const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
const emptyValues: DetailFormValues = { title: "", description: "" };

export default function ServiceDetailsManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: services = [],
    isPending: isServicesPending,
    isError: isServicesError,
  } = useServices();

  // The Details link on the Services page passes ?service=<id>.
  const requestedId = searchParams.get("service");
  const serviceId =
    services.find((service) => service.id === requestedId)?.id ??
    services[0]?.id;

  const {
    data: details = [],
    isPending: isDetailsPending,
    isError: isDetailsError,
    error: detailsError,
  } = useServiceDetails(serviceId);

  const createDetail = useCreateServiceDetail();
  const updateDetail = useUpdateServiceDetail();
  const deleteDetail = useDeleteServiceDetail();

  // null = the form creates a new detail.
  const [editing, setEditing] = useState<ServiceDetail | null>(null);
  const [toDelete, setToDelete] = useState<ServiceDetail | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  // Changing the key remounts the file input so it clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<DetailFormValues>({
    resolver: zodResolver(detailSchema),
    defaultValues: emptyValues,
  });

  // Switch between creating and editing, and load the form for it.
  function selectEditing(next: ServiceDetail | null) {
    setEditing(next);
    reset(
      next
        ? { title: next.title, description: next.description }
        : emptyValues,
    );
    setImageFile(null);
    setImageError("");
    setFileInputKey((key) => key + 1);
  }



  async function onSubmit(values: DetailFormValues) {
    if (!serviceId) return;
    if (!editing && !imageFile) {
      setImageError("Image is required");
      return;
    }
    if (isTooLarge(imageFile, IMAGE_MAX_KB)) {
      setImageError("Image must be about 1 MB or smaller");
      return;
    }
    setImageError("");

    try {
      if (editing) {
        await updateDetail.mutateAsync({
          id: editing.id,
          ...values,
          ...(imageFile ? { image: imageFile } : {}),
        });
        toast.success("Detail updated successfully");
        // Back to "New detail" with an empty form.
        selectEditing(null);
      } else {
        await createDetail.mutateAsync({
          service_id: serviceId,
          ...values,
          image: imageFile!,
        });
        toast.success("Detail created successfully");
        reset(emptyValues);
        setImageFile(null);
        setFileInputKey((key) => key + 1);
      }
    } catch (submitError) {
      const fieldErrors = getValidationErrors(submitError);
      if (fieldErrors?.title) setError("title", { message: fieldErrors.title[0] });
      if (fieldErrors?.description) {
        setError("description", { message: fieldErrors.description[0] });
      }
      if (fieldErrors?.image) setImageError(fieldErrors.image[0]);
      toast.error(
        getErrorMessage(
          submitError,
          editing ? "Failed to update detail" : "Failed to create detail",
        ),
      );
    }
  }

  // Runs from the confirmation dialog; errors stay in the dialog.
  async function deleteConfirmed() {
    if (!toDelete) return;
    await deleteDetail.mutateAsync(toDelete.id);
    if (editing?.id === toDelete.id) selectEditing(null);
    toast.success("Detail deleted successfully");
  }

  // The API answers 404 when a service has no details yet.
  const noDetails = details.length === 0 || isNotFound(detailsError);

  return (
    <>
      <AdminPageHeader
        title="Service Details"
        description="Manage the items shown inside each service, such as room types or prices"
        actions={
          <button
            type="button"
            onClick={() => {
              selectEditing(null);
              setTimeout(() => setFocus("title"), 0);
            }}
            disabled={!serviceId}
            className={`${primaryButtonClass} ${disabledClass}`}
          >
            <Plus size={16} aria-hidden="true" />
            Add detail
          </button>
        }
      />

      <div className={`${cardClass} mb-6 p-5`}>
        <label htmlFor="details-service" className={labelClass}>
          Service
        </label>
        {isServicesPending ? (
          <div
            role="status"
            aria-label="Loading services"
            className={`${skeletonClass} h-11 w-full rounded-lg sm:max-w-sm`}
          />
        ) : isServicesError || services.length === 0 ? (
          <p className="text-sm text-stone-500">
            No services found. Add a service first.
          </p>
        ) : (
          <select
            id="details-service"
            value={serviceId}
            onChange={(event) => {
              selectEditing(null);
              setSearchParams({ service: event.target.value });
            }}
            className={`${inputClass} sm:max-w-sm`}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {serviceId && (
        <div className="grid gap-6 xl:grid-cols-3">
          <section
            className={`${cardClass} xl:col-span-2`}
            aria-labelledby="details-title"
          >
            <div className={cardHeaderClass}>
              <h2 id="details-title" className={cardTitleClass}>
                Service items
              </h2>
            </div>

            {isDetailsPending ? (
              <ul
                role="status"
                aria-label="Loading service details"
                className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[0, 1, 2].map((card) => (
                  <li key={card} className="overflow-hidden rounded-lg border border-stone-200">
                    <div className={`${skeletonClass} aspect-square rounded-none`} />
                    <div className="space-y-2 p-4">
                      <div className={`${skeletonClass} h-4 w-2/3`} />
                      <div className={`${skeletonClass} h-4 w-full`} />
                      <div className={`${skeletonClass} h-4 w-1/2`} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : isDetailsError && !isNotFound(detailsError) ? (
              <p role="alert" className="p-5 text-sm text-red-600">
                Failed to load service details
              </p>
            ) : noDetails ? (
              <p className="p-5 text-sm text-stone-500">
                This service has no details yet
              </p>
            ) : (
              <ul className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {details.map((detail) => {
                  const isDeleting =
                    deleteDetail.isPending &&
                    deleteDetail.variables === detail.id;

                  return (
                    <li
                      key={detail.id}
                      className={`overflow-hidden rounded-lg border ${
                        editing?.id === detail.id
                          ? "border-stone-400"
                          : "border-stone-200"
                      }`}
                    >
                      <div className="flex aspect-square items-center justify-center bg-stone-100">
                        {detail.image_url ? (
                          <img
                            src={detail.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon
                            size={28}
                            className="text-stone-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-sans text-sm font-semibold text-stone-900">
                          {detail.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                          {detail.description}
                        </p>

                        <div className="mt-3 flex justify-end gap-1 border-t border-stone-100 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              selectEditing(detail);
                              setTimeout(() => setFocus("title"), 0);
                            }}
                            aria-label={`Edit ${detail.title}`}
                            className={iconButtonClass}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setToDelete(detail)}
                            disabled={isDeleting}
                            aria-label={`Delete ${detail.title}`}
                            className={`${deleteButtonClass} ${disabledClass}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${cardClass} self-start`}
            aria-labelledby="detail-form-title"
          >
            <div className={cardHeaderClass}>
              <h2 id="detail-form-title" className={cardTitleClass}>
                {editing ? `Edit ${editing.title}` : "New detail"}
              </h2>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label htmlFor="detail-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="detail-title"
                  {...register("title")}
                  placeholder="e.g. room type or price"
                  className={inputClass}
                />
                {errors.title && (
                  <p className={errorTextClass}>{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="detail-description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="detail-description"
                  {...register("description")}
                  rows={4}
                  placeholder="Short description"
                  className={`${inputClass} resize-y`}
                />
                {errors.description && (
                  <p className={errorTextClass}>{errors.description.message}</p>
                )}
              </div>

              <div>
                <ImageUploadField
                  key={fileInputKey}
                  label={editing ? "Image (optional)" : "Image"}
                  hint={
                    editing
                      ? "Leave empty to keep the current image, up to 1 MB"
                      : "JPG, PNG or WebP, shown as a square, up to 1 MB"
                  }
                  previewSrc={editing?.image_url}
                  previewClassName="aspect-square"
                  onFileChange={setImageFile}
                  selectedFileName={imageFile?.name}
                />
                {imageError && (
                  <p role="alert" className={errorTextClass}>
                    {imageError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-stone-200 px-5 py-4">
              {editing && (
                <button
                  type="button"
                  onClick={() => selectEditing(null)}
                  disabled={isSubmitting}
                  className={`${secondaryButtonClass} ${disabledClass}`}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${primaryButtonClass} ${disabledClass}`}
              >
                <Save size={16} aria-hidden="true" />
                {isSubmitting
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Save detail"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete service detail?"
        description={
          <>
            <strong className="font-semibold text-stone-900">
              {toDelete?.title}
            </strong>{" "}
            and its image will be removed from this service. This can't be
            undone.
          </>
        }
        confirmLabel="Delete detail"
        onConfirm={deleteConfirmed}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
