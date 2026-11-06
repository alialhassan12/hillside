import { useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { LogIn } from "lucide-react";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import logo from "../../assets/logo.png";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "../../components/admin/adminClasses";
import { login } from "../../services/authApi";
import { getToken, safeAdminPath, saveSession } from "../../lib/auth";
import { getErrorMessage, getValidationErrors } from "../../lib/apiErrors";

// Matches Laravel: username required|max:255, password required|min:8.
const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(255, "Username is too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const errorTextClass = "mt-1 text-sm text-red-600";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [formError, setFormError] = useState("");

  // Where to go after login: the page that sent us here, if any.
  const fromState = (location.state as { from?: string } | null)?.from;
  const destination = safeAdminPath(fromState ?? searchParams.get("redirect"));
  const expired = searchParams.get("expired") === "1";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // Already logged in: skip the form.
  if (getToken()) {
    return <Navigate to={destination} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError("");

    try {
      const result = await login(values);
      saveSession(result.token, result.user.username, result.user.id);
      navigate(destination, { replace: true });
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.username) {
        setError("username", { message: fieldErrors.username[0] });
      }
      if (fieldErrors?.password) {
        setError("password", { message: fieldErrors.password[0] });
      }

      if (isAxiosError(error) && error.response?.status === 401) {
        setFormError("Incorrect username or password.");
      } else if (isAxiosError(error) && error.response?.status === 429) {
        setFormError("Too many attempts. Please wait a minute and try again.");
      } else if (!fieldErrors) {
        setFormError(
          getErrorMessage(error, "Could not log in. Please try again."),
        );
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12 font-sans text-stone-700">
      <title>Log in | Hillside Hotel Admin</title>
      <meta name="robots" content="noindex, nofollow" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-forest">
            <img src={logo} alt="" className="h-9 w-auto" />
          </span>
          <div>
            <h1 className="font-serif text-3xl text-forest">Hillside Admin</h1>
            <p className="mt-1 text-sm text-stone-500">
              Log in to manage the website
            </p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={`${cardClass} space-y-5 p-6`}
        >
          {expired && !formError && (
            <p role="status" className="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">
              Your session has ended. Please log in again.
            </p>
          )}

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}

          <div>
            <label htmlFor="login-username" className={labelClass}>
              Username
            </label>
            <input
              id="login-username"
              {...register("username")}
              autoComplete="username"
              autoFocus
              aria-invalid={!!errors.username}
              className={inputClass}
            />
            {errors.username && (
              <p className={errorTextClass}>{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              {...register("password")}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className={inputClass}
            />
            {errors.password && (
              <p className={errorTextClass}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButtonClass} w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <LogIn size={16} aria-hidden="true" />
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
