import { useState } from "react";
import { Pencil, Save, Trash2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
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
  skeletonClass,
} from "../../components/admin/adminClasses";
import {
  useAddAdmin,
  useAdmins,
  useDeleteAdmin,
  useEditAdmin,
} from "../../hooks/useAdminUsers";
import type { AdminUser } from "../../services/adminUserApi";
import { getUserId, saveUsername } from "../../lib/auth";
import { getErrorMessage, getValidationErrors } from "../../lib/apiErrors";

const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";

// Matches Laravel: username max:255 (unique), password min:8.
// When editing, an empty password keeps the current one.
function makeSchema(isEditing: boolean) {
  return z
    .object({
      username: z
        .string()
        .trim()
        .min(1, "Username is required")
        .max(255, "Username is too long"),
      password: isEditing
        ? z.string().refine((value) => value === "" || value.length >= 8, {
            message: "Password must be at least 8 characters",
          })
        : z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
}

type AdminFormValues = z.infer<ReturnType<typeof makeSchema>>;

const emptyValues: AdminFormValues = {
  username: "",
  password: "",
  confirmPassword: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function rateLimitMessage(error: unknown, fallback: string) {
  return isAxiosError(error) && error.response?.status === 429
    ? "Too many attempts. Please wait a minute."
    : getErrorMessage(error, fallback);
}

export default function AdminUsersPage() {
  const myId = getUserId();
  const { data: admins = [], isPending, isError } = useAdmins();
  const addAdmin = useAddAdmin();
  const editAdmin = useEditAdmin();
  const deleteAdmin = useDeleteAdmin();

  // null = the form creates a new administrator.
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: (values, context, options) =>
      zodResolver(makeSchema(editing !== null))(values, context, options),
    defaultValues: emptyValues,
  });

  // Switch between creating and editing, and load the form for it.
  function selectEditing(next: AdminUser | null) {
    setEditing(next);
    reset(next ? { ...emptyValues, username: next.username } : emptyValues);
  }

  function openForm(next: AdminUser | null) {
    selectEditing(next);
    setTimeout(() => setFocus("username"), 0);
  }

  async function onSubmit(values: AdminFormValues) {
    try {
      if (editing) {
        const usernameChanged = values.username !== editing.username;
        const passwordChanged = values.password !== "";

        if (!usernameChanged && !passwordChanged) {
          toast.info("Nothing to change");
          return;
        }

        // Only send changed fields: the backend rejects re-sending the
        // same username as "already taken".
        await editAdmin.mutateAsync({
          id: editing.id,
          ...(usernameChanged ? { username: values.username } : {}),
          ...(passwordChanged ? { password: values.password } : {}),
        });

        // Renamed yourself: update the name shown in the header.
        if (editing.id === myId && usernameChanged) {
          saveUsername(values.username);
        }
        toast.success(`"${values.username}" updated`);
      } else {
        await addAdmin.mutateAsync({
          username: values.username,
          password: values.password,
        });
        toast.success(`Administrator "${values.username}" created`);
      }
      selectEditing(null);
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.username) {
        setError("username", { message: fieldErrors.username[0] });
      }
      if (fieldErrors?.password) {
        setError("password", { message: fieldErrors.password[0] });
      }
      toast.error(
        rateLimitMessage(
          error,
          editing
            ? "Failed to update the administrator"
            : "Failed to create the administrator",
        ),
      );
    }
  }

  // Runs from the confirmation dialog; errors stay in the dialog.
  async function deleteConfirmed() {
    if (!toDelete) return;
    await deleteAdmin.mutateAsync(toDelete.id);
    if (editing?.id === toDelete.id) selectEditing(null);
    toast.success(`"${toDelete.username}" deleted`);
  }

  const isLastAdmin = admins.length <= 1;

  return (
    <>
      <AdminPageHeader
        title="Admin Users"
        description="People who can sign in to this admin panel"
        actions={
          <button
            type="button"
            onClick={() => openForm(null)}
            className={primaryButtonClass}
          >
            <UserPlus size={16} aria-hidden="true" />
            Add administrator
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <section
          className={`${cardClass} xl:col-span-2`}
          aria-labelledby="admins-title"
        >
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <h2 id="admins-title" className={cardTitleClass}>
                Administrators
              </h2>
              {!isPending && !isError && (
                <span className="text-sm text-stone-500 tabular-nums">
                  {admins.length} total
                </span>
              )}
            </div>
          </div>

          {isPending ? (
            <ul
              role="status"
              aria-label="Loading administrators"
              className="divide-y divide-stone-100"
            >
              {[0, 1, 2].map((row) => (
                <li key={row} className="flex items-center gap-3 px-5 py-3">
                  <div className={`${skeletonClass} h-9 w-9 shrink-0 rounded-full`} />
                  <div className={`${skeletonClass} h-4 w-32`} />
                  <div className={`${skeletonClass} hidden h-4 w-24 sm:block`} />
                  <div className={`${skeletonClass} ml-auto h-8 w-20 rounded-lg`} />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <p role="alert" className="p-5 text-sm text-red-600">
              Failed to load administrators
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs text-stone-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Username
                    </th>
                    <th
                      scope="col"
                      className="hidden px-5 py-3 font-medium sm:table-cell"
                    >
                      Added
                    </th>
                    <th scope="col" className="px-5 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {admins.map((admin) => {
                    const isMe = admin.id === myId;

                    return (
                      <tr
                        key={admin.id}
                        className={
                          editing?.id === admin.id ? selectedRowClass : undefined
                        }
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-gold-bright"
                            >
                              {admin.username.charAt(0).toUpperCase()}
                            </span>
                            <span className="font-medium text-stone-900">
                              {admin.username}
                            </span>
                            {isMe && (
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="hidden px-5 py-3 text-stone-500 tabular-nums sm:table-cell">
                          {formatDate(admin.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openForm(admin)}
                              aria-label={`Edit ${admin.username}`}
                              className={iconButtonClass}
                            >
                              <Pencil size={16} />
                            </button>
                            {/* No deleting yourself (it would end your
                                session) or the last administrator. */}
                            {!isMe && !isLastAdmin && (
                              <button
                                type="button"
                                onClick={() => setToDelete(admin)}
                                aria-label={`Delete ${admin.username}`}
                                className={deleteButtonClass}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
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
          aria-labelledby="admin-form-title"
        >
          <div className={cardHeaderClass}>
            <div>
              <h2 id="admin-form-title" className={cardTitleClass}>
                {editing
                  ? editing.id === myId
                    ? "Edit your account"
                    : `Edit ${editing.username}`
                  : "New administrator"}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {editing
                  ? "Leave the password empty to keep it"
                  : "They sign in with this username and password"}
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="admin-username" className={labelClass}>
                Username
              </label>
              <input
                id="admin-username"
                {...register("username")}
                autoComplete="off"
                aria-invalid={!!errors.username}
                className={inputClass}
              />
              {errors.username && (
                <p className={errorTextClass}>{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className={labelClass}>
                {editing ? "New password" : "Password"}
              </label>
              <input
                id="admin-password"
                type="password"
                {...register("password")}
                autoComplete="new-password"
                placeholder={
                  editing ? "Leave empty to keep it" : "At least 8 characters"
                }
                aria-invalid={!!errors.password}
                className={inputClass}
              />
              {errors.password && (
                <p className={errorTextClass}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password-confirm" className={labelClass}>
                Confirm password
              </label>
              <input
                id="admin-password-confirm"
                type="password"
                {...register("confirmPassword")}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                className={inputClass}
              />
              {errors.confirmPassword && (
                <p className={errorTextClass}>
                  {errors.confirmPassword.message}
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
              {editing ? (
                <Save size={16} aria-hidden="true" />
              ) : (
                <UserPlus size={16} aria-hidden="true" />
              )}
              {isSubmitting
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create administrator"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete administrator?"
        description={
          <>
            <strong className="font-semibold text-stone-900">
              {toDelete?.username}
            </strong>{" "}
            will no longer be able to sign in to the admin panel. This can't be
            undone.
          </>
        }
        confirmLabel="Delete administrator"
        onConfirm={deleteConfirmed}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
