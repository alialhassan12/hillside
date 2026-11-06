import { useEffect, useState } from "react";
import {
  Check,
  Quote,
  RotateCcw,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  activeTabClass,
  cardClass,
  deleteButtonClass,
  inactiveTabClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  tabClass,
  tabListClass,
  skeletonClass,
} from "../../components/admin/adminClasses";
import {
  useChangeTestimonialStatus,
  useChangeTestimonialVisibility,
  useDeleteTestimonial,
  useTestimonials,
} from "../../hooks/useTestimonials";
import { getErrorMessage } from "../../lib/apiErrors";
import type { Testimonial, TestimonialStatus } from "../../types/testimonial";

const tabs: { status: TestimonialStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "approved", label: "Approved" },
  { status: "rejected", label: "Rejected" },
];

// Approved tab only: "" = all, "1" = shown, "0" = hidden.
type VisibilityFilter = "" | "1" | "0";

const smallButtonClass = "px-3 py-2";
// Testimonials per page in the admin grid.
const PAGE_SIZE = 6;
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
const pageButtonClass = `cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-transparent`;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function TestimonialsPage() {
  const [status, setStatus] = useState<TestimonialStatus>("pending");
  // Each tab keeps its own page.
  const [pages, setPages] = useState<Record<TestimonialStatus, number>>({
    pending: 1,
    approved: 1,
    rejected: 1,
  });
  const [visibility, setVisibility] = useState<VisibilityFilter>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toReject, setToReject] = useState<Testimonial | null>(null);
  const [toDelete, setToDelete] = useState<Testimonial | null>(null);

  const page = pages[status];
  const setPage = (next: number) =>
    setPages((current) => ({ ...current, [status]: next }));

  // Search on the server after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== search) {
        setSearch(next);
        setPages({ pending: 1, approved: 1, rejected: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const {
    data: allTestimonials = [],
    isPending,
    isError,
    isFetching,
  } = useTestimonials({
    status,
    search,
    ...(status === "approved" && visibility !== ""
      ? { visibility: Number(visibility) as 0 | 1 }
      : {}),
  });
  const changeStatus = useChangeTestimonialStatus();
  const changeVisibility = useChangeTestimonialVisibility();
  const deleteTestimonial = useDeleteTestimonial();

  // 6 per page (two rows of three), newest first.
  const total = allTestimonials.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, lastPage);
  const testimonials = allTestimonials.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Which card has a request running, to disable only its buttons.
  const busyId = changeStatus.isPending
    ? changeStatus.variables?.id
    : changeVisibility.isPending
      ? changeVisibility.variables?.id
      : undefined;

  // The card leaves this tab after a status change; if it was the last
  // one on the page, step back so the page is not empty.
  function afterLeavingTab() {
    if (testimonials.length === 1 && currentPage > 1) {
      setPage(currentPage - 1);
    }
  }

  // Throws on failure, so the reject dialog can stay open with the error.
  async function changeStatusTo(
    testimonial: Testimonial,
    next: TestimonialStatus,
  ) {
    await changeStatus.mutateAsync({ id: testimonial.id, status: next });
    afterLeavingTab();
    toast.success(
      next === "approved"
        ? "Approved. Turn on \"Shown on website\" to publish it."
        : next === "rejected"
          ? "Feedback rejected"
          : "Moved back to pending",
    );
  }

  async function onChangeStatus(
    testimonial: Testimonial,
    next: TestimonialStatus,
  ) {
    // Rejecting asks first, in our confirmation dialog.
    if (next === "rejected") {
      setToReject(testimonial);
      return;
    }

    try {
      await changeStatusTo(testimonial, next);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update the feedback"));
    }
  }

  async function onToggleVisibility(testimonial: Testimonial) {
    const isShown = !testimonial.is_shown;

    try {
      await changeVisibility.mutateAsync({
        id: testimonial.id,
        is_shown: isShown,
      });
      // With a Shown/Hidden filter on, the card leaves the list.
      if (visibility !== "") afterLeavingTab();
      toast.success(
        isShown ? "Now shown on the website" : "Hidden from the website",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to change visibility"));
    }
  }

  const emptyText = search
    ? `No ${status} feedback matches "${search}"`
    : status === "pending"
      ? "No feedback is waiting for review"
      : status === "approved"
        ? visibility === "1"
          ? "No approved feedback is shown on the website"
          : visibility === "0"
            ? "No approved feedback is hidden"
            : "No approved feedback yet"
        : "No rejected feedback";

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Review feedback sent through the homepage form. Only approved feedback that is shown appears on the website."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className={tabListClass.replace("mb-6", "")} role="group" aria-label="Status">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              onClick={() => setStatus(tab.status)}
              aria-pressed={status === tab.status}
              className={`${tabClass} ${
                status === tab.status ? activeTabClass : inactiveTabClass
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          {status === "approved" && (
            <>
              <label htmlFor="testimonial-visibility" className="sr-only">
                Visibility
              </label>
              <select
                id="testimonial-visibility"
                value={visibility}
                onChange={(event) => {
                  setVisibility(event.target.value as VisibilityFilter);
                  setPage(1);
                }}
                className={`${inputClass} w-full sm:w-40`}
              >
                <option value="">All approved</option>
                <option value="1">Shown</option>
                <option value="0">Hidden</option>
              </select>
            </>
          )}

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
            />
            <label htmlFor="testimonial-search" className="sr-only">
              Search feedback
            </label>
            <input
              id="testimonial-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search feedback"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
      </div>

      {isPending ? (
        <ul
          role="status"
          aria-label="Loading feedback"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {[0, 1, 2].map((card) => (
            <li key={card} className={`${cardClass} p-5`}>
              <div className="flex items-center gap-3">
                <div className={`${skeletonClass} h-12 w-12 shrink-0 rounded-full`} />
                <div className="flex-1 space-y-2">
                  <div className={`${skeletonClass} h-4 w-28`} />
                  <div className={`${skeletonClass} h-3 w-20`} />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className={`${skeletonClass} h-4 w-full`} />
                <div className={`${skeletonClass} h-4 w-full`} />
                <div className={`${skeletonClass} h-4 w-2/3`} />
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-stone-100 pt-3">
                <div className={`${skeletonClass} h-9 w-24 rounded-lg`} />
                <div className={`${skeletonClass} h-9 w-24 rounded-lg`} />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p role="alert" className="text-sm text-red-600">
          Failed to load feedback
        </p>
      ) : testimonials.length === 0 ? (
        <p className="text-sm text-stone-500">{emptyText}</p>
      ) : (
        <ul
          className={`grid gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {testimonials.map((testimonial) => {
            const isBusy = busyId === testimonial.id;

            return (
              <li
                key={testimonial.id}
                className={`${cardClass} flex flex-col p-5`}
              >
                <div className="flex items-center gap-3">
                  {testimonial.profile_url ? (
                    <img
                      src={testimonial.profile_url}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg font-medium text-stone-600"
                    >
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-sans text-base font-semibold text-stone-900">
                      {testimonial.name}
                    </h2>
                    <p className="truncate text-sm text-stone-500">
                      {testimonial.representation || "No organization"}
                    </p>
                  </div>
                </div>

                <Quote
                  size={22}
                  aria-hidden="true"
                  className="mt-5 fill-sand/20 text-sand"
                />
                <p className="mt-2 flex-1 text-sm leading-6 break-words whitespace-pre-line text-stone-600">
                  {testimonial.feedback}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                  <span className="tabular-nums">
                    {formatDate(testimonial.created_at)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-stone-100 pt-3">
                  {testimonial.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onChangeStatus(testimonial, "rejected")}
                        disabled={isBusy}
                        className={`${secondaryButtonClass} ${smallButtonClass} hover:text-red-600 ${disabledClass}`}
                      >
                        <X size={16} aria-hidden="true" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeStatus(testimonial, "approved")}
                        disabled={isBusy}
                        className={`${primaryButtonClass} ${smallButtonClass} ${disabledClass}`}
                      >
                        <Check size={16} aria-hidden="true" />
                        Approve
                      </button>
                    </>
                  )}

                  {testimonial.status === "approved" && (() => {
                    // While saving, show the new position straight away.
                    const isShown =
                      changeVisibility.isPending &&
                      changeVisibility.variables?.id === testimonial.id
                        ? changeVisibility.variables.is_shown
                        : testimonial.is_shown;

                    return (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isShown}
                        onClick={() => onToggleVisibility(testimonial)}
                        disabled={isBusy}
                        className={`mr-auto flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm font-medium text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${disabledClass}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
                            isShown ? "bg-forest" : "bg-stone-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none ${
                              isShown ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </span>
                        Shown on website
                      </button>
                    );
                  })()}

                  {testimonial.status === "rejected" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setToDelete(testimonial)}
                        disabled={isBusy}
                        aria-label={`Delete feedback from ${testimonial.name}`}
                        className={`${deleteButtonClass} mr-auto ${disabledClass}`}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeStatus(testimonial, "pending")}
                        disabled={isBusy}
                        className={`${secondaryButtonClass} ${smallButtonClass} ${disabledClass}`}
                      >
                        <RotateCcw size={16} aria-hidden="true" />
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeStatus(testimonial, "approved")}
                        disabled={isBusy}
                        className={`${primaryButtonClass} ${smallButtonClass} ${disabledClass}`}
                      >
                        <Check size={16} aria-hidden="true" />
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!isPending && !isError && total > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
          <span className="tabular-nums">
            Page {currentPage} of {lastPage} · {total} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={pageButtonClass}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className={pageButtonClass}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toReject !== null}
        title="Reject this feedback?"
        description={
          <>
            Feedback from{" "}
            <strong className="font-semibold text-stone-900">
              {toReject?.name}
            </strong>{" "}
            will move to the Rejected tab and won't appear on the website. You
            can restore it later.
          </>
        }
        confirmLabel="Reject feedback"
        workingLabel="Rejecting..."
        icon={X}
        onConfirm={() => changeStatusTo(toReject!, "rejected")}
        onClose={() => setToReject(null)}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this feedback?"
        description={
          <>
            Feedback from{" "}
            <strong className="font-semibold text-stone-900">
              {toDelete?.name}
            </strong>{" "}
            will be permanently deleted. This can't be undone.
          </>
        }
        confirmLabel="Delete feedback"
        onConfirm={async () => {
          await deleteTestimonial.mutateAsync(toDelete!.id);
          afterLeavingTab();
          toast.success("Feedback deleted");
        }}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
