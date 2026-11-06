import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl text-forest">{title}</h1>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
