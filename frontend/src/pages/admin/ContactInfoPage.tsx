import { Link2, Pencil, Save, Trash2 } from "lucide-react";
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
const sampleContacts = [
  { id: 1, name: "Email", link: "mailto:name@example.com" },
  { id: 2, name: "Phone", link: "tel:+000000000" },
  { id: 3, name: "Instagram", link: "https://instagram.com/example" },
];

export default function ContactInfoPage() {
  return (
    <>
      <AdminPageHeader
        title="Contact Information"
        description="Manage the hotel address and the contact links shown in the footer and contact page"
      />

      <form
        onSubmit={(event) => event.preventDefault()}
        className={cardClass}
        aria-labelledby="address-title"
      >
        <div className={cardHeaderClass}>
          <h2 id="address-title" className={cardTitleClass}>
            Company address
          </h2>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <div>
            <label htmlFor="company-address" className={labelClass}>
              Address
            </label>
            <textarea
              id="company-address"
              rows={4}
              placeholder="Street, city and country"
              className={`${inputClass} resize-y`}
            />
          </div>

          <ImageUploadField
            label="Address icon"
            hint="Small PNG with a transparent background"
            previewClassName="aspect-square sm:w-24"
            accept="image/png,image/svg+xml,image/webp"
          />
        </div>

        <div className="flex justify-end border-t border-stone-200 px-5 py-4">
          <button type="submit" className={primaryButtonClass}>
            <Save size={16} aria-hidden="true" />
            Save address
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section
          className={`${cardClass} xl:col-span-2`}
          aria-labelledby="contacts-title"
        >
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <h2 id="contacts-title" className={cardTitleClass}>
                Contact methods
              </h2>
              <span className={sampleBadgeClass}>Sample</span>
            </div>
          </div>

          <ul className="divide-y divide-stone-100">
            {sampleContacts.map((contact) => (
              <li key={contact.id} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                  <Link2 size={16} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-900">{contact.name}</p>
                  <p className="truncate text-sm text-stone-500">
                    {contact.link}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${contact.name}`}
                    className={iconButtonClass}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${contact.name}`}
                    className={deleteButtonClass}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <form
          onSubmit={(event) => event.preventDefault()}
          className={cardClass}
          aria-labelledby="contact-form-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="contact-form-title" className={cardTitleClass}>
              New contact
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="contact-name" className={labelClass}>
                Name
              </label>
              <input
                id="contact-name"
                placeholder="e.g. Email, Phone, Facebook"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="contact-link" className={labelClass}>
                Link
              </label>
              <input
                id="contact-link"
                placeholder="mailto:, tel: or https:// link"
                className={inputClass}
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
              Save contact
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
