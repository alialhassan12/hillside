import { useMemo, useState } from "react";
import { Link2, Pencil, Plus, Save, Trash2 } from "lucide-react";
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
} from "../../components/admin/adminClasses";
import {
  useCompanyAddress,
  useUpdateCompanyAddress,
} from "../../hooks/useCompanyAddress";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "../../hooks/useContacts";
import {
  getErrorMessage,
  getValidationErrors,
  isNotFound,
  isTooLarge,
} from "../../lib/apiErrors";
import type { Contact } from "../../types/contact";

const ICON_MAX_KB = 1048;
const ICON_ACCEPT = "image/png,image/svg+xml,image/webp";
const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";

const addressSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(255, "Address is too long"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name is too long"),
  link: z.string().trim().min(1, "Link is required").max(255, "Link is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const emptyContact: ContactFormValues = { name: "", link: "" };

export default function ContactInfoPage() {
  return (
    <>
      <AdminPageHeader
        title="Contact Information"
        description="Manage the hotel address and the contact links shown in the footer and contact page"
      />

      <AddressForm />
      <ContactMethods />
    </>
  );
}

function AddressForm() {
  const { data: company, isPending, isError, error } = useCompanyAddress();
  const updateAddress = useUpdateCompanyAddress();

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconError, setIconError] = useState("");
  // Changing the key remounts the file input so it clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  const values = useMemo(
    () => ({ address: company?.address ?? "" }),
    [company?.address],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    values,
    resetOptions: { keepDirtyValues: true },
  });

  async function onSubmit(formValues: AddressFormValues) {
    if (isTooLarge(iconFile, ICON_MAX_KB)) {
      setIconError("Icon must be about 1 MB or smaller");
      return;
    }
    setIconError("");

    try {
      await updateAddress.mutateAsync({
        address: formValues.address,
        ...(iconFile ? { address_icon: iconFile } : {}),
      });
      setIconFile(null);
      setFileInputKey((key) => key + 1);
      toast.success("Address updated successfully");
    } catch (submitError) {
      const fieldErrors = getValidationErrors(submitError);
      if (fieldErrors?.address) {
        setError("address", { message: fieldErrors.address[0] });
      }
      if (fieldErrors?.address_icon) setIconError(fieldErrors.address_icon[0]);
      toast.error(getErrorMessage(submitError, "Failed to update address"));
    }
  }

  // Update needs an existing company record (Laravel returns 404 otherwise).
  const missing = isNotFound(error);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cardClass}
      aria-labelledby="address-title"
    >
      <div className={cardHeaderClass}>
        <h2 id="address-title" className={cardTitleClass}>
          Company address
        </h2>
      </div>

      {isPending ? (
        <p className="p-5 text-sm text-stone-500">Loading address...</p>
      ) : missing ? (
        <p className="p-5 text-sm text-stone-500">
          No address exists yet, so it can't be updated here
        </p>
      ) : isError ? (
        <p role="alert" className="p-5 text-sm text-red-600">
          Failed to load the address
        </p>
      ) : (
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <div>
            <label htmlFor="company-address" className={labelClass}>
              Address
            </label>
            <textarea
              id="company-address"
              {...register("address")}
              rows={4}
              placeholder="Street, city and country"
              className={`${inputClass} resize-y`}
            />
            {errors.address && (
              <p className={errorTextClass}>{errors.address.message}</p>
            )}
          </div>

          <div>
            <ImageUploadField
              key={fileInputKey}
              label="Address icon (optional)"
              hint="Leave empty to keep the current icon, up to 1 MB"
              previewSrc={company?.address_icon_url || undefined}
              previewClassName="aspect-square sm:w-24"
              accept={ICON_ACCEPT}
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
      )}

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={isSubmitting || isPending || isError}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <Save size={16} aria-hidden="true" />
          {isSubmitting ? "Saving..." : "Save address"}
        </button>
      </div>
    </form>
  );
}

function ContactMethods() {
  const { data: contacts = [], isPending, isError, error } = useContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  // null = the form creates a new contact.
  const [editing, setEditing] = useState<Contact | null>(null);
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
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyContact,
  });

  // Switch between creating and editing, and load the form for it.
  function selectEditing(next: Contact | null) {
    setEditing(next);
    reset(next ? { name: next.name, link: next.link } : emptyContact);
    setIconFile(null);
    setIconError("");
    setFileInputKey((key) => key + 1);
  }

  // Edit / Add buttons also move focus to the form.
  function openForm(next: Contact | null) {
    selectEditing(next);
    setTimeout(() => setFocus("name"), 0);
  }

  async function onSubmit(values: ContactFormValues) {
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
        await updateContact.mutateAsync({
          id: editing.id,
          ...values,
          ...(iconFile ? { icon: iconFile } : {}),
        });
        toast.success("Contact updated successfully");
      } else {
        await createContact.mutateAsync({ ...values, icon: iconFile! });
        toast.success("Contact created successfully");
      }
      // Back to "New contact" with an empty form.
      selectEditing(null);
    } catch (submitError) {
      const fieldErrors = getValidationErrors(submitError);
      if (fieldErrors?.name) setError("name", { message: fieldErrors.name[0] });
      if (fieldErrors?.link) setError("link", { message: fieldErrors.link[0] });
      if (fieldErrors?.icon) setIconError(fieldErrors.icon[0]);
      toast.error(
        getErrorMessage(
          submitError,
          editing ? "Failed to update contact" : "Failed to create contact",
        ),
      );
    }
  }

  async function onDelete(contact: Contact) {
    if (!window.confirm(`Delete the "${contact.name}" contact?`)) return;

    try {
      await deleteContact.mutateAsync(contact.id);
      if (editing?.id === contact.id) selectEditing(null);
      toast.success("Contact deleted successfully");
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Failed to delete contact"));
    }
  }

  // The API answers 404 when there are no contacts yet.
  const noContacts = contacts.length === 0 || isNotFound(error);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <section
        className={`${cardClass} xl:col-span-2`}
        aria-labelledby="contacts-title"
      >
        <div className={cardHeaderClass}>
          <h2 id="contacts-title" className={cardTitleClass}>
            Contact methods
          </h2>
          <button
            type="button"
            onClick={() => openForm(null)}
            className={secondaryButtonClass}
          >
            <Plus size={16} aria-hidden="true" />
            Add contact
          </button>
        </div>

        {isPending ? (
          <p className="p-5 text-sm text-stone-500">Loading contacts...</p>
        ) : isError && !isNotFound(error) ? (
          <p role="alert" className="p-5 text-sm text-red-600">
            Failed to load contacts
          </p>
        ) : noContacts ? (
          <p className="p-5 text-sm text-stone-500">No contact methods yet</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {contacts.map((contact) => {
              const isDeleting =
                deleteContact.isPending &&
                deleteContact.variables === contact.id;

              return (
                <li
                  key={contact.id}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    editing?.id === contact.id ? "bg-stone-100" : ""
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-600">
                    {contact.icon_url ? (
                      <img
                        src={contact.icon_url}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <Link2 size={16} aria-hidden="true" />
                    )}
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
                      onClick={() => openForm(contact)}
                      aria-label={`Edit ${contact.name}`}
                      className={iconButtonClass}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(contact)}
                      disabled={isDeleting}
                      aria-label={`Delete ${contact.name}`}
                      className={`${deleteButtonClass} ${disabledClass}`}
                    >
                      <Trash2 size={16} />
                    </button>
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
        aria-labelledby="contact-form-title"
      >
        <div className={cardHeaderClass}>
          <h2 id="contact-form-title" className={cardTitleClass}>
            {editing ? `Edit ${editing.name}` : "New contact"}
          </h2>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Name
            </label>
            <input
              id="contact-name"
              {...register("name")}
              placeholder="e.g. Email, Phone, Facebook"
              className={inputClass}
            />
            {errors.name && (
              <p className={errorTextClass}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-link" className={labelClass}>
              Link
            </label>
            <input
              id="contact-link"
              {...register("link")}
              placeholder="name@example.com, +232 77 444888 or https://..."
              aria-describedby="contact-link-hint"
              className={inputClass}
            />
            <p id="contact-link-hint" className="mt-1 text-xs text-stone-500">
              Enter an email address, a phone number, or a full https:// link
              for websites and social media. Other text is shown without a link.
            </p>
            {errors.link && (
              <p className={errorTextClass}>{errors.link.message}</p>
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
              previewSrc={editing?.icon_url || undefined}
              previewClassName="aspect-square sm:w-24"
              accept={ICON_ACCEPT}
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
                : "Save contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
