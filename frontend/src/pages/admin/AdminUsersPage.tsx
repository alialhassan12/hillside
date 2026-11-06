import { useState } from "react";
import { Info, Save, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "../../components/admin/adminClasses";
import { useAddAdmin, useEditAdmin } from "../../hooks/useAdminUsers";
import { getUserId, getUsername, saveUsername } from "../../lib/auth";
import { getErrorMessage, getValidationErrors } from "../../lib/apiErrors";

const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";

// Matches Laravel: username max:255 (unique), password min:8.
const newAdminSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .max(255, "Username is too long"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewAdminValues = z.infer<typeof newAdminSchema>;

// Both fields optional: only what changes is sent.
const accountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .max(255, "Username is too long"),
    password: z
      .string()
      .refine((value) => value === "" || value.length >= 8, {
        message: "Password must be at least 8 characters",
      }),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AccountValues = z.infer<typeof accountSchema>;

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader
        title="Admin Users"
        description="Create administrators and manage your own sign-in details"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <YourAccountForm />
        <NewAdminForm />
      </div>

      <p className="mt-6 flex items-start gap-2 text-sm text-stone-500">
        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        The list of administrators isn't available yet, so other accounts
        can't be viewed, edited or removed from here.
      </p>
    </>
  );
}

function YourAccountForm() {
  const editAdmin = useEditAdmin();
  const userId = getUserId();
  const [currentUsername, setCurrentUsername] = useState(
    () => getUsername() ?? "",
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: currentUsername,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: AccountValues) {
    if (!userId) return;

    const usernameChanged = values.username !== currentUsername;
    const passwordChanged = values.password !== "";

    if (!usernameChanged && !passwordChanged) {
      toast.info("Nothing to change");
      return;
    }

    try {
      // Only send changed fields: the backend rejects re-sending the same
      // username as "already taken".
      await editAdmin.mutateAsync({
        id: userId,
        ...(usernameChanged ? { username: values.username } : {}),
        ...(passwordChanged ? { password: values.password } : {}),
      });

      if (usernameChanged) {
        saveUsername(values.username);
        setCurrentUsername(values.username);
      }
      reset({ username: values.username, password: "", confirmPassword: "" });
      toast.success("Your account was updated");
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.username) {
        setError("username", { message: fieldErrors.username[0] });
      }
      if (fieldErrors?.password) {
        setError("password", { message: fieldErrors.password[0] });
      }
      toast.error(
        isAxiosError(error) && error.response?.status === 429
          ? "Too many attempts. Please wait a minute."
          : getErrorMessage(error, "Failed to update your account"),
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${cardClass} self-start`}
      aria-labelledby="account-title"
    >
      <div className={cardHeaderClass}>
        <div>
          <h2 id="account-title" className={cardTitleClass}>
            Your account
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Signed in as{" "}
            <span className="font-medium text-stone-900">
              {currentUsername || "Admin"}
            </span>
          </p>
        </div>
      </div>

      {!userId ? (
        <p className="p-5 text-sm text-stone-600">
          Log out and log in again to edit your account.
        </p>
      ) : (
        <>
          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="account-username" className={labelClass}>
                Username
              </label>
              <input
                id="account-username"
                {...register("username")}
                autoComplete="username"
                aria-invalid={!!errors.username}
                className={inputClass}
              />
              {errors.username && (
                <p className={errorTextClass}>{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="account-password" className={labelClass}>
                New password
              </label>
              <input
                id="account-password"
                type="password"
                {...register("password")}
                autoComplete="new-password"
                placeholder="Leave empty to keep the current password"
                aria-invalid={!!errors.password}
                className={inputClass}
              />
              {errors.password && (
                <p className={errorTextClass}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="account-password-confirm" className={labelClass}>
                Confirm new password
              </label>
              <input
                id="account-password-confirm"
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

          <div className="flex justify-end border-t border-stone-200 px-5 py-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${primaryButtonClass} ${disabledClass}`}
            >
              <Save size={16} aria-hidden="true" />
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

function NewAdminForm() {
  const addAdmin = useAddAdmin();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewAdminValues>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: NewAdminValues) {
    try {
      await addAdmin.mutateAsync({
        username: values.username,
        password: values.password,
      });
      reset();
      toast.success(`Administrator "${values.username}" created`);
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.username) {
        setError("username", { message: fieldErrors.username[0] });
      }
      if (fieldErrors?.password) {
        setError("password", { message: fieldErrors.password[0] });
      }
      toast.error(
        isAxiosError(error) && error.response?.status === 429
          ? "Too many attempts. Please wait a minute."
          : getErrorMessage(error, "Failed to create the administrator"),
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${cardClass} self-start`}
      aria-labelledby="admin-form-title"
    >
      <div className={cardHeaderClass}>
        <div>
          <h2 id="admin-form-title" className={cardTitleClass}>
            New administrator
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            They can sign in with this username and password
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
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            {...register("password")}
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
            <p className={errorTextClass}>{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <UserPlus size={16} aria-hidden="true" />
          {isSubmitting ? "Creating..." : "Create administrator"}
        </button>
      </div>
    </form>
  );
}
