import { Link } from "react-router";
import { ArrowRight, House, Images, Phone, Plus } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
} from "../../components/admin/adminClasses";
import { useServices } from "../../hooks/useServices";
import { useGalleryImages } from "../../hooks/useGallery";
import { useTestimonials } from "../../hooks/useTestimonials";
import { useMessages } from "../../hooks/useMessages";
import { isNotFound } from "../../lib/apiErrors";

const quickActions = [
  { label: "Edit homepage hero", icon: House, to: "/admin/homepage" },
  { label: "Add a service", icon: Plus, to: "/admin/services" },
  { label: "Upload gallery photos", icon: Images, to: "/admin/media" },
  { label: "Update contact details", icon: Phone, to: "/admin/contact" },
];

const PREVIEW_ROWS = 5;
const skeletonClass = "animate-pulse rounded bg-stone-200 motion-reduce:animate-none";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function DashboardPage() {
  const services = useServices();
  const gallery = useGalleryImages();
  // Same query as page 1 of the Pending tab; only its total is used.
  const pendingTestimonials = useTestimonials({
    status: "pending",
    search: "",
    page: 1,
  });
  // Page 1 of the inbox: its total and a preview of its rows.
  const messages = useMessages(1, "");

  // Services and gallery answer 404 when empty, which means 0 here.
  const summaryCards = [
    {
      label: "Services",
      to: "/admin/services",
      hint: "Listed on the website",
      isPending: services.isPending,
      isError: services.isError && !isNotFound(services.error),
      value: services.data?.length ?? 0,
    },
    {
      label: "Gallery photos",
      to: "/admin/media",
      hint: "In the homepage gallery",
      isPending: gallery.isPending,
      isError: gallery.isError && !isNotFound(gallery.error),
      value: gallery.data?.length ?? 0,
    },
    {
      label: "Pending testimonials",
      to: "/admin/testimonials",
      hint: "Waiting for review",
      isPending: pendingTestimonials.isPending,
      isError: pendingTestimonials.isError,
      value: pendingTestimonials.data?.total ?? 0,
    },
    {
      label: "Messages",
      to: "/admin/messages",
      hint: "Received through the contact form",
      isPending: messages.isPending,
      isError: messages.isError,
      value: messages.data?.total ?? 0,
    },
  ];

  // Laravel paginates without ordering, so this is a preview of the
  // first page (sorted newest first), not the newest messages overall.
  const previewMessages = [...(messages.data?.data ?? [])]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, PREVIEW_ROWS);

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
            {card.isPending ? (
              <>
                <span
                  aria-hidden="true"
                  className={`${skeletonClass} mt-3 block h-8 w-14`}
                />
                <span
                  aria-hidden="true"
                  className={`${skeletonClass} mt-2 block h-3 w-32`}
                />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              <>
                <p className="mt-2 font-sans text-3xl font-medium text-stone-900 tabular-nums">
                  {card.isError ? "—" : card.value}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    card.isError ? "text-red-600" : "text-stone-500"
                  }`}
                >
                  {card.isError ? "Could not load" : card.hint}
                </p>
              </>
            )}

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
                Inbox preview
              </h2>
              <span className="text-xs text-stone-500">
                From the first page of the inbox
              </span>
            </div>

            <Link
              to="/admin/messages"
              className="text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {messages.isPending ? (
            <ul className="divide-y divide-stone-100" aria-hidden="true">
              {Array.from({ length: 3 }, (_, index) => (
                <li key={index} className="flex items-center gap-4 px-5 py-4">
                  <span className={`${skeletonClass} h-4 w-32`} />
                  <span className={`${skeletonClass} h-4 flex-1`} />
                  <span className={`${skeletonClass} hidden h-4 w-20 sm:block`} />
                </li>
              ))}
            </ul>
          ) : messages.isError ? (
            <p role="alert" className="p-5 text-sm text-red-600">
              Failed to load messages
            </p>
          ) : previewMessages.length === 0 ? (
            <p className="p-5 text-sm text-stone-500">No messages yet</p>
          ) : (
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
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {previewMessages.map((message) => {
                    const isUnread = message.status === "unread";

                    return (
                      <tr key={message.id}>
                        <td
                          className={`px-5 py-3 text-stone-900 ${
                            isUnread ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {message.name}
                        </td>
                        <td className="max-w-56 px-5 py-3">
                          <p className="truncate">{message.subject}</p>
                        </td>
                        <td className="hidden px-5 py-3 whitespace-nowrap text-stone-500 tabular-nums sm:table-cell">
                          {formatDate(message.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-2 ${
                              isUnread ? "text-stone-900" : "text-stone-500"
                            }`}
                          >
                            {isUnread && (
                              <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full bg-gold"
                              />
                            )}
                            {isUnread ? "Unread" : "Read"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
