import { Link } from "react-router";
import { ArrowRight, House, Images, Phone, Plus } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  sampleBadgeClass,
} from "../../components/admin/adminClasses";

const summaryCards = [
  { label: "Services", to: "/admin/services" },
  { label: "Gallery photos", to: "/admin/media" },
  { label: "Testimonials", to: "/admin/testimonials" },
  { label: "Messages", to: "/admin/messages" },
];

const quickActions = [
  { label: "Edit homepage hero", icon: House, to: "/admin/homepage" },
  { label: "Add a service", icon: Plus, to: "/admin/services" },
  { label: "Upload gallery photos", icon: Images, to: "/admin/media" },
  { label: "Update contact details", icon: Phone, to: "/admin/contact" },
];

// Sample rows to show the layout only.
const sampleMessages = [
  { id: 1, sender: "Sample Sender 1", subject: "Sample subject", date: "—" },
  { id: 2, sender: "Sample Sender 2", subject: "Sample subject", date: "—" },
  { id: 3, sender: "Sample Sender 3", subject: "Sample subject", date: "—" },
];

export default function DashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the content shown on the Hillside Hotel website"
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <li key={card.label} className={`${cardClass} p-5`}>
            <p className="text-sm text-stone-600">{card.label}</p>
            <p className="mt-2 font-sans text-3xl font-medium text-stone-900 tabular-nums">
              —
            </p>
            <p className="mt-1 text-xs text-stone-500">Not connected yet</p>

            <Link
              to={card.to}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              Manage {card.label.toLowerCase()}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className={cardClass} aria-labelledby="quick-actions-title">
          <div className={cardHeaderClass}>
            <h2 id="quick-actions-title" className={cardTitleClass}>
              Quick actions
            </h2>
          </div>

          <ul className="divide-y divide-stone-100">
            {quickActions.map((action) => (
              <li key={action.label}>
                <Link
                  to={action.to}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900"
                >
                  <action.icon
                    size={16}
                    className="text-stone-500"
                    aria-hidden="true"
                  />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight
                    size={16}
                    className="text-stone-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`${cardClass} lg:col-span-2`}
          aria-labelledby="recent-messages-title"
        >
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <h2 id="recent-messages-title" className={cardTitleClass}>
                Recent messages
              </h2>
              <span className={sampleBadgeClass}>Sample</span>
            </div>

            <Link
              to="/admin/messages"
              className="text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs text-stone-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Sender
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="hidden px-5 py-3 font-medium sm:table-cell"
                  >
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {sampleMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-5 py-3 font-medium text-stone-900">
                      {message.sender}
                    </td>
                    <td className="px-5 py-3">{message.subject}</td>
                    <td className="hidden px-5 py-3 text-stone-500 tabular-nums sm:table-cell">
                      {message.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
