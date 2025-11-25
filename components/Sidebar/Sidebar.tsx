'use client';
import SidebarLink from "./SidebarLink";
import { usePathname } from "next/navigation";

type SidebarProps = {
  className?: string;
};

type ViewLink = {
  href: string;
  label: string;
  badge?: string;
  iconClassName: string;
};

type QueueLink = {
  href: string;
  label: string;
  indicatorClassName: string;
};

const VIEW_LINKS: ViewLink[] = [
  { href: "/inbox", label: "Inbox", iconClassName: "fa-solid fa-inbox", badge: "12" },
  { href: "/", label: "All Tickets", iconClassName: "fa-solid fa-ticket" },
  { href: "/my-tickets", label: "My Tickets", iconClassName: "fa-regular fa-user", badge: "5" },
];

const QUEUE_LINKS: QueueLink[] = [
  { href: "/queues/urgent", label: "Urgent", indicatorClassName: "bg-red-500" },
  { href: "/queues/support", label: "Support", indicatorClassName: "bg-blue-500" },
  { href: "/queues/billing", label: "Billing", indicatorClassName: "bg-purple-500" },
] ;

const Sidebar = ({ className = "" }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`w-60 bg-gray-50 border-r border-gray-200 flex flex-col md:flex ${className}`}
    >
      <div className="h-14 flex items-center px-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center text-white text-xs">
            <i className="fa-solid fa-robot" />
          </div>
          <span>Support AI</span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <span className="px-2 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
          Views
        </span>

        {VIEW_LINKS.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            label={link.label}
            iconClassName={link.iconClassName}
            badge={link.badge}
            active={isActive(link.href)}
          />
        ))}

        <span className="px-2 py-2 mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
          Queues
        </span>
        {QUEUE_LINKS.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            label={link.label}
            indicatorClassName={link.indicatorClassName}
            active={isActive(link.href)}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200/50">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-200/50 transition">
          <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px]">
            JD
          </div>
          <span>John Doe</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;