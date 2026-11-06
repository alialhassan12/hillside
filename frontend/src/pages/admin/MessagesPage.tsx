import { useState } from "react";
import { Eye, MailOpen, Search, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  inputClass,
  sampleBadgeClass,
  secondaryButtonClass,
  selectedRowClass,
} from "../../components/admin/adminClasses";

// Sample rows to show the layout only.
const sampleMessages = [
  {
    id: 1,
    sender: "Sample Sender 1",
    email: "sender1@example.com",
    status: "Unread",
  },
  {
    id: 2,
    sender: "Sample Sender 2",
    email: "sender2@example.com",
    status: "Unread",
  },
  {
    id: 3,
    sender: "Sample Sender 3",
    email: "sender3@example.com",
    status: "Read",
  },
  {
    id: 4,
    sender: "Sample Sender 4",
    email: "sender4@example.com",
    status: "Read",
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(sampleMessages[0].id);

  const selectedMessage = sampleMessages.find(
    (message) => message.id === selectedId,
  );

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Messages sent by guests through the contact form"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <section
          className={`${cardClass} xl:col-span-3`}
          aria-labelledby="inbox-title"
        >
          <div className={cardHeaderClass}>
            <div className="flex items-center gap-3">
              <h2 id="inbox-title" className={cardTitleClass}>
                Inbox
              </h2>
              <span className={sampleBadgeClass}>Sample</span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
              />
              <label htmlFor="message-search" className="sr-only">
                Search messages
              </label>
              <input
                id="message-search"
                type="search"
                placeholder="Search messages"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs text-stone-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Sender
                  </th>
                  <th
                    scope="col"
                    className="hidden px-5 py-3 font-medium md:table-cell"
                  >
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
                  <th scope="col" className="px-5 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {sampleMessages.map((message) => {
                  const isSelected = message.id === selectedId;
                  const isUnread = message.status === "Unread";

                  return (
                    <tr
                      key={message.id}
                      className={isSelected ? selectedRowClass : undefined}
                    >
                      <td className="px-5 py-3">
                        <p
                          className={`text-stone-900 ${
                            isUnread ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {message.sender}
                        </p>
                        <p className="text-xs text-stone-500">{message.email}</p>
                      </td>
                      <td className="hidden px-5 py-3 md:table-cell">
                        Sample subject
                      </td>
                      <td className="hidden px-5 py-3 text-stone-500 tabular-nums sm:table-cell">
                        —
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
                          {message.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedId(message.id)}
                          aria-pressed={isSelected}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-stone-100 aria-pressed:bg-stone-100"
                        >
                          <Eye size={16} aria-hidden="true" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3 text-sm text-stone-500">
            <span>Page 1</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-stone-200 px-3 py-1.5 text-stone-400"
              >
                Previous
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-stone-200 px-3 py-1.5 text-stone-400"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <article
          className={`${cardClass} xl:col-span-2`}
          aria-labelledby="message-subject"
        >
          <div className={cardHeaderClass}>
            <h2 id="message-subject" className={cardTitleClass}>
              Sample subject
            </h2>
            <span className={sampleBadgeClass}>Sample</span>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-stone-200 px-5 py-4 text-sm">
            <dt className="font-medium text-stone-500">From</dt>
            <dd className="text-stone-900">{selectedMessage?.sender}</dd>
            <dt className="font-medium text-stone-500">Email</dt>
            <dd className="break-all text-stone-900">{selectedMessage?.email}</dd>
            <dt className="font-medium text-stone-500">Phone</dt>
            <dd className="text-stone-900">—</dd>
            <dt className="font-medium text-stone-500">Date</dt>
            <dd className="text-stone-900">—</dd>
          </dl>

          <div className="px-5 py-5 text-sm leading-7 text-stone-700">
            <p>
              The full message text appears here, so it is easy to read long
              messages without leaving the inbox.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-stone-200 px-5 py-4">
            <button type="button" className={secondaryButtonClass}>
              <MailOpen size={16} aria-hidden="true" />
              Mark as read
            </button>
            <button
              type="button"
              className={`${secondaryButtonClass} hover:text-red-600`}
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          </div>
        </article>
      </div>
    </>
  );
}
