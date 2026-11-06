import { useEffect, useState } from "react";
import { Eye, Mail, MailOpen, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  inputClass,
  secondaryButtonClass,
  selectedRowClass,
  skeletonClass,
  tabClass,
  tabListClass,
  activeTabClass,
  inactiveTabClass,
} from "../../components/admin/adminClasses";
import {
  useChangeMessageStatus,
  useDeleteMessage,
  useMessages,
} from "../../hooks/useMessages";
import { getErrorMessage } from "../../lib/apiErrors";
import type { Message } from "../../types/message";
import type { MessageFilter } from "../../services/messageApi";

const filters: { value: MessageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
const pageButtonClass = `cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-transparent`;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Message | null>(null);

  // Search on the server after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== search) {
        setSearch(next);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const { data, isPending, isError, isFetching } = useMessages(
    page,
    search,
    filter,
  );
  const changeStatus = useChangeMessageStatus();
  const deleteMessage = useDeleteMessage();

  // Laravel returns no fixed order; show newest first on each page.
  const messages = [...(data?.data ?? [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
  const lastPage = data?.last_page ?? 1;

  const selected =
    messages.find((message) => message.id === selectedId) ?? messages[0];

  async function onToggleStatus(message: Message) {
    const status = message.status === "unread" ? "read" : "unread";

    try {
      await changeStatus.mutateAsync({ id: message.id, status });
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update the message"));
    }
  }

  // Runs from the confirmation dialog; errors stay in the dialog.
  async function deleteConfirmed() {
    if (!toDelete) return;
    await deleteMessage.mutateAsync(toDelete.id);
    setSelectedId(null);
    // Deleting the last message on a page moves back one page.
    if (messages.length === 1 && page > 1) setPage(page - 1);
    toast.success("Message deleted");
  }

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
              {data && data.total > 0 && (
                <span className="text-sm text-stone-500 tabular-nums">
                  {data.total} {filter === "all" ? "total" : filter}
                </span>
              )}
            </div>

            <div
              className={tabListClass.replace("mb-6", "")}
              role="group"
              aria-label="Filter messages"
            >
              {filters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilter(option.value);
                    setPage(1);
                    setSelectedId(null);
                  }}
                  aria-pressed={filter === option.value}
                  className={`${tabClass} px-3 py-1.5 ${
                    filter === option.value ? activeTabClass : inactiveTabClass
                  }`}
                >
                  {option.label}
                </button>
              ))}
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
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search messages"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {isPending ? (
            <ul role="status" aria-label="Loading messages" className="divide-y divide-stone-100">
              {Array.from({ length: 5 }, (_, row) => (
                <li key={row} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-36 space-y-2">
                    <div className={`${skeletonClass} h-4 w-28`} />
                    <div className={`${skeletonClass} h-3 w-36`} />
                  </div>
                  <div className={`${skeletonClass} hidden h-4 flex-1 md:block`} />
                  <div className={`${skeletonClass} hidden h-4 w-20 sm:block`} />
                  <div className={`${skeletonClass} h-4 w-14`} />
                  <div className={`${skeletonClass} ml-auto h-9 w-16 rounded-lg`} />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <p role="alert" className="p-5 text-sm text-red-600">
              Failed to load messages
            </p>
          ) : messages.length === 0 ? (
            <p className="p-5 text-sm text-stone-500">
              {search
                ? `No ${filter === "all" ? "" : `${filter} `}messages match "${search}"`
                : filter === "unread"
                  ? "No unread messages"
                  : filter === "read"
                    ? "No read messages"
                    : "No messages yet"}
            </p>
          ) : (
            <div
              className={`overflow-x-auto transition-opacity ${
                isFetching ? "opacity-60" : ""
              }`}
            >
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
                  {messages.map((message) => {
                    const isSelected = message.id === selected?.id;
                    const isUnread = message.status === "unread";

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
                            {message.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {message.email}
                          </p>
                        </td>
                        <td className="hidden max-w-56 px-5 py-3 md:table-cell">
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
          )}

          <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3 text-sm text-stone-500">
            <span className="tabular-nums">
              Page {page} of {lastPage}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPage((current) => current - 1);
                  setSelectedId(null);
                }}
                disabled={page <= 1 || isFetching}
                className={pageButtonClass}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  setPage((current) => current + 1);
                  setSelectedId(null);
                }}
                disabled={page >= lastPage || isFetching}
                className={pageButtonClass}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <article
          className={`${cardClass} self-start xl:col-span-2`}
          aria-labelledby="message-subject"
        >
          {!selected ? (
            <p className="p-5 text-sm text-stone-500">
              Select a message to read it
            </p>
          ) : (
            <>
              <div className={cardHeaderClass}>
                <h2
                  id="message-subject"
                  className={`${cardTitleClass} break-words`}
                >
                  {selected.subject}
                </h2>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-stone-200 px-5 py-4 text-sm">
                <dt className="font-medium text-stone-500">From</dt>
                <dd className="text-stone-900">{selected.name}</dd>
                <dt className="font-medium text-stone-500">Email</dt>
                <dd className="break-all text-stone-900">
                  <a
                    href={`mailto:${selected.email}`}
                    className="hover:text-forest hover:underline"
                  >
                    {selected.email}
                  </a>
                </dd>
                <dt className="font-medium text-stone-500">Phone</dt>
                <dd className="text-stone-900">{selected.phone || "—"}</dd>
                <dt className="font-medium text-stone-500">Date</dt>
                <dd className="text-stone-900 tabular-nums">
                  {formatDateTime(selected.created_at)}
                </dd>
              </dl>

              <div className="px-5 py-5 text-sm leading-7 whitespace-pre-line break-words text-stone-700">
                {selected.message}
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-stone-200 px-5 py-4">
                <button
                  type="button"
                  onClick={() => onToggleStatus(selected)}
                  disabled={changeStatus.isPending}
                  className={`${secondaryButtonClass} ${disabledClass}`}
                >
                  {selected.status === "unread" ? (
                    <>
                      <MailOpen size={16} aria-hidden="true" />
                      Mark as read
                    </>
                  ) : (
                    <>
                      <Mail size={16} aria-hidden="true" />
                      Mark as unread
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setToDelete(selected)}
                  disabled={deleteMessage.isPending}
                  className={`${secondaryButtonClass} hover:text-red-600 ${disabledClass}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  {deleteMessage.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </article>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete message?"
        description={
          <>
            The message{" "}
            <strong className="font-semibold text-stone-900">
              "{toDelete?.subject}"
            </strong>{" "}
            from {toDelete?.name} will be permanently deleted.
          </>
        }
        confirmLabel="Delete message"
        onConfirm={deleteConfirmed}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
