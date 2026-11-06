import { ImageIcon, Pencil, Plus, Save, Trash2 } from "lucide-react";
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

// Sample content to show the layout only.
const sampleServices = ["Sample Service 1", "Sample Service 2", "Sample Service 3"];

const sampleDetails = [1, 2, 3];

export default function ServiceDetailsManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="Service Details"
        description="Manage the items shown inside each service, such as room types or prices"
        actions={
          <button type="button" className={primaryButtonClass}>
            <Plus size={16} aria-hidden="true" />
            Add detail
          </button>
        }
      />

      <div className={`${cardClass} mb-6 p-5`}>
        <label htmlFor="details-service" className={labelClass}>
          Service
        </label>
        <select id="details-service" className={`${inputClass} sm:max-w-sm`}>
          {sampleServices.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section
          className={`${cardClass} xl:col-span-2`}
          aria-labelledby="details-title"
        >
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <h2 id="details-title" className={cardTitleClass}>
                Service items
              </h2>
              <span className={sampleBadgeClass}>Sample</span>
            </div>
          </div>

          <ul className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {sampleDetails.map((number) => (
              <li
                key={number}
                className="overflow-hidden rounded-lg border border-stone-200"
              >
                <div className="flex aspect-square items-center justify-center bg-stone-100">
                  <ImageIcon
                    size={28}
                    className="text-stone-400"
                    aria-hidden="true"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-sans text-sm font-semibold text-stone-900">
                    Sample detail {number}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                    Description of this item, such as a room type or price.
                  </p>

                  <div className="mt-3 flex justify-end gap-1 border-t border-stone-100 pt-3">
                    <button
                      type="button"
                      aria-label={`Edit sample detail ${number}`}
                      className={iconButtonClass}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete sample detail ${number}`}
                      className={deleteButtonClass}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <form
          onSubmit={(event) => event.preventDefault()}
          className={cardClass}
          aria-labelledby="detail-form-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="detail-form-title" className={cardTitleClass}>
              New detail
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="detail-title" className={labelClass}>
                Title
              </label>
              <input
                id="detail-title"
                placeholder="e.g. room type or price"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="detail-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="detail-description"
                rows={4}
                placeholder="Short description"
                className={`${inputClass} resize-y`}
              />
            </div>

            <ImageUploadField
              label="Image (optional)"
              hint="JPG, PNG or WebP, shown as a square"
              previewClassName="aspect-square"
            />
          </div>

          <div className="flex justify-end border-t border-stone-200 px-5 py-4">
            <button type="submit" className={primaryButtonClass}>
              <Save size={16} aria-hidden="true" />
              Save detail
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
