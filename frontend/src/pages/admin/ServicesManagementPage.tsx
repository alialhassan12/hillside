import { Link } from "react-router";
import { ConciergeBell, ListTree, Pencil, Plus, Save, Trash2 } from "lucide-react";
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
  sampleBadgeClass,
} from "../../components/admin/adminClasses";

// Sample rows to show the layout only.
const sampleServices = [
  { id: 1, name: "Sample Service 1" },
  { id: 2, name: "Sample Service 2" },
  { id: 3, name: "Sample Service 3" },
];

export default function ServicesManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Manage the services shown on the website"
        actions={
          <button type="button" className={primaryButtonClass}>
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
            <div className="flex items-center gap-3">
              <h2 id="services-title" className={cardTitleClass}>
                All services
              </h2>
              <span className={sampleBadgeClass}>Sample</span>
            </div>
          </div>

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
                {sampleServices.map((service) => {
                  return (
                    <tr key={service.id}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                            <ConciergeBell size={16} aria-hidden="true" />
                          </span>
                          <span className="font-medium text-stone-900">
                            {service.name}
                          </span>
                        </div>
                      </td>

                      <td className="hidden max-w-xs px-5 py-3 text-stone-500 md:table-cell">
                        <p className="line-clamp-2">
                          Short description of the service shown on the
                          website.
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to="/admin/service-details"
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-gold"
                          >
                            <ListTree size={16} aria-hidden="true" />
                            Details
                          </Link>
                          <button
                            type="button"
                            aria-label={`Edit ${service.name}`}
                            className={iconButtonClass}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${service.name}`}
                            className={deleteButtonClass}
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
        </section>

        <form
          onSubmit={(event) => event.preventDefault()}
          className={cardClass}
          aria-labelledby="service-form-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="service-form-title" className={cardTitleClass}>
              New service
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="service-name" className={labelClass}>
                Name
              </label>
              <input
                id="service-name"
                placeholder="Service name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="service-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="service-description"
                rows={4}
                placeholder="Short description shown on the services page"
                className={`${inputClass} resize-y`}
              />
            </div>

            <ImageUploadField
              label="Icon"
              hint="Small PNG with a transparent background"
              previewClassName="aspect-square sm:w-24"
              accept="image/png,image/svg+xml,image/webp"
            />
          </div>

          <div className="flex justify-end border-t border-stone-200 px-5 py-4">
            <button type="submit" className={primaryButtonClass}>
              <Save size={16} aria-hidden="true" />
              Save service
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
