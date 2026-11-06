import { useState } from "react";
import { Link } from "react-router";
import { ConciergeBell, ListTree, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
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
  selectedRowClass,
} from "../../components/admin/adminClasses";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "../../hooks/useServices";
import {
  getErrorMessage,
  getValidationErrors,
  isNotFound,
  isTooLarge,
} from "../../lib/apiErrors";
import type { Service } from "../../types/service";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().trim().min(1, "Description is required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const ICON_MAX_KB = 1048; // Laravel: icon max:1048
const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
const emptyValues: ServiceFormValues = { name: "", description: "" };

export default function ServicesManagementPage() {
  const { data: services = [], isPending, isError, error } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  // null = the form creates a new service.
  const [editing, setEditing] = useState<Service | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconError, setIconError] = useState("");
  // Changing the key remounts the file input so it clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyValues,
  });

  // Switch between creating and editing, and load the form for it.
  function selectEditing(next: Service | null) {
    setEditing(next);
    reset(
      next
        ? { name: next.name, description: next.description }
        : emptyValues,
    );
    setIconFile(null);
    setIconError("");
    setFileInputKey((key) => key + 1);
  }


  function startEditing(service: Service) {
    selectEditing(service);
    setTimeout(() => setFocus("name"), 0);
  }

  async function onSubmit(values: ServiceFormValues) {
    if (!editing && !iconFile) {
      setIconError("Icon is required");
      return;
    }
    if (isTooLarge(iconFile, ICON_MAX_KB)) {
      setIconError("Icon must be about 1 MB or smaller");
      return;
    }
    setIconError("");

    try {
      if (editing) {
        await updateService.mutateAsync({
          id: editing.id,
          ...values,
          ...(iconFile ? { icon: iconFile } : {}),
        });
        toast.success("Service updated successfully");
        // Back to "New service" with an empty form.
        selectEditing(null);
      } else {
        await createService.mutateAsync({ ...values, icon: iconFile! });
        toast.success("Service created successfully");
        reset(emptyValues);
        setIconFile(null);
        setFileInputKey((key) => key + 1);
      }
    } catch (submitError) {
      const fieldErrors = getValidationErrors(submitError);
      if (fieldErrors?.name) setError("name", { message: fieldErrors.name[0] });
      if (fieldErrors?.description) {
        setError("description", { message: fieldErrors.description[0] });
      }
      if (fieldErrors?.icon) setIconError(fieldErrors.icon[0]);
      toast.error(
        getErrorMessage(
          submitError,
          editing ? "Failed to update service" : "Failed to create service",
        ),
      );
    }
  }

  async function onDelete(service: Service) {
    if (
      !window.confirm(
        `Delete "${service.name}"? Its service details will no longer be shown.`,
      )
    ) {
      return;
    }

    try {
      await deleteService.mutateAsync(service.id);
      if (editing?.id === service.id) selectEditing(null);
      toast.success("Service deleted successfully");
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Failed to delete service"));
    }
  }

  // The API answers 404 when there are no services yet.
  const noServices = services.length === 0 || isNotFound(error);

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Manage the services shown on the website"
        actions={
          <button
            type="button"
            onClick={() => {
              selectEditing(null);
              setTimeout(() => setFocus("name"), 0);
            }}
            className={primaryButtonClass}
          >
            <Plus size={16} aria-hidden="true" />
            Add service
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <section
          className={`${cardClass} xl:col-span-2`}
          aria-labelledby="services-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="services-title" className={cardTitleClass}>
              All services
            </h2>
          </div>

          {isPending ? (
            <p className="p-5 text-sm text-stone-500">Loading services...</p>
          ) : isError && !isNotFound(error) ? (
            <p role="alert" className="p-5 text-sm text-red-600">
              Failed to load services
            </p>
          ) : noServices ? (
            <p className="p-5 text-sm text-stone-500">No services yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs text-stone-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Service
                    </th>
                    <th
                      scope="col"
                      className="hidden px-5 py-3 font-medium md:table-cell"
                    >
                      Description
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {services.map((service) => {
                    const isDeleting =
                      deleteService.isPending &&
                      deleteService.variables === service.id;

                    return (
                      <tr
                        key={service.id}
                        className={
                          editing?.id === service.id ? selectedRowClass : ""
                        }
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-stone-600">
                              {service.icon_url ? (
                                <img
                                  src={service.icon_url}
                                  alt=""
                                  className="h-6 w-6 object-contain"
                                />
                              ) : (
                                <ConciergeBell size={16} aria-hidden="true" />
                              )}
                            </span>
                            <span className="font-medium text-stone-900">
                              {service.name}
                            </span>
                          </div>
                        </td>

                        <td className="hidden max-w-xs px-5 py-3 text-stone-500 md:table-cell">
                          <p className="line-clamp-2">{service.description}</p>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/admin/service-details?service=${service.id}`}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-gold"
                            >
                              <ListTree size={16} aria-hidden="true" />
                              Details
                            </Link>
                            <button
                              type="button"
                              onClick={() => startEditing(service)}
                              aria-label={`Edit ${service.name}`}
                              className={iconButtonClass}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(service)}
                              disabled={isDeleting}
                              aria-label={`Delete ${service.name}`}
                              className={`${deleteButtonClass} ${disabledClass}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${cardClass} self-start`}
          aria-labelledby="service-form-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="service-form-title" className={cardTitleClass}>
              {editing ? `Edit ${editing.name}` : "New service"}
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="service-name" className={labelClass}>
                Name
              </label>
              <input
                id="service-name"
                {...register("name")}
                placeholder="Service name"
                className={inputClass}
              />
              {errors.name && (
                <p className={errorTextClass}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="service-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="service-description"
                {...register("description")}
                rows={4}
                placeholder="Short description shown on the services page"
                className={`${inputClass} resize-y`}
              />
              {errors.description && (
                <p className={errorTextClass}>{errors.description.message}</p>
              )}
            </div>

            <div>
              <ImageUploadField
                key={fileInputKey}
                label={editing ? "Icon (optional)" : "Icon"}
                hint={
                  editing
                    ? "Leave empty to keep the current icon, up to 1 MB"
                    : "Small PNG with a transparent background, up to 1 MB"
                }
                previewSrc={editing?.icon_url}
                previewClassName="aspect-square sm:w-24"
                accept="image/png,image/svg+xml,image/webp"
                onFileChange={setIconFile}
                selectedFileName={iconFile?.name}
              />
              {iconError && (
                <p role="alert" className={errorTextClass}>
                  {iconError}
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
                  : "Save service"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
