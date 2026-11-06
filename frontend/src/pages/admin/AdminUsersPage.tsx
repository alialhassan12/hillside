import { Pencil, Save, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
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
const sampleAdmins = [
  { id: 1, name: "Sample Admin 1", email: "admin1@example.com" },
  { id: 2, name: "Sample Admin 2", email: "admin2@example.com" },
];

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader
        title="Admin Users"
        description="People who can sign in to this admin panel"
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
              <span className={sampleBadgeClass}>Sample</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs text-stone-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Name
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
                {sampleAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-600"
                        >
                          {admin.name.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-stone-900">
                            {admin.name}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-stone-500 tabular-nums sm:table-cell">
                      —
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${admin.name}`}
                          className={iconButtonClass}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${admin.name}`}
                          className={deleteButtonClass}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <form
          onSubmit={(event) => event.preventDefault()}
          className={cardClass}
          aria-labelledby="admin-form-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="admin-form-title" className={cardTitleClass}>
              New administrator
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label htmlFor="admin-name" className={labelClass}>
                Full name
              </label>
              <input
                id="admin-name"
                autoComplete="off"
                placeholder="Full name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password-confirm" className={labelClass}>
                Confirm password
              </label>
              <input
                id="admin-password-confirm"
                type="password"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-stone-200 px-5 py-4">
            <button type="submit" className={primaryButtonClass}>
              <Save size={16} aria-hidden="true" />
              Save administrator
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
