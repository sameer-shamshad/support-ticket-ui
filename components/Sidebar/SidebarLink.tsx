'use client';

import Link from "next/link";

type SidebarLinkProps = {
  href: string;
  label: string;
  iconClassName?: string;
  badge?: string;
  indicatorClassName?: string;
  active?: boolean;
};

const baseClasses = "flex w-full items-center gap-2.5 px-2 py-1.5 rounded-md transition group";
const activeClasses = "bg-white shadow-sm border border-gray-200/50 text-gray-900";
const inactiveClasses = "text-gray-600 hover:bg-gray-200/50 border border-transparent";

const SidebarLink = ({
  href,
  label,
  iconClassName,
  badge,
  indicatorClassName,
  active = false,
}: SidebarLinkProps) => (
  <Link
    href={href}
    className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    aria-current={active ? "page" : undefined}
  >
    {indicatorClassName ? (
      <span className={`w-2 h-2 rounded-full ${indicatorClassName}`} />
    ) : iconClassName ? (
      <i
        className={`${iconClassName} w-4 text-center text-xs text-gray-400 group-hover:text-gray-600`}
      />
    ) : null}
    
    <span className="text-sm font-medium">{label}</span>

    {badge && (
      <span className="ml-auto text-xs text-gray-400 group-hover:text-gray-600">
        {badge}
      </span>
    )}
  </Link>
);

export default SidebarLink;