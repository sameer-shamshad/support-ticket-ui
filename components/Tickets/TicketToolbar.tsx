'use client';

import { useMemo, useState, type ReactNode } from "react";
import { useTickets } from "@/hooks/useTickets";
import { SortOption, TicketPriority, TicketStatus } from "@/types";

const STATUS_FILTERS: Array<{ id: TicketStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "queued", label: "Queued" },
  { id: "escalated", label: "Escalated" },
];

const SORT_OPTIONS: Array<{ id: SortOption; label: string }> = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "priority-high", label: "Priority (High to Low)" },
  { id: "priority-low", label: "Priority (Low to High)" },
];

const TicketToolbar = () => {
  const {
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    tagOptions,
    tagFilters,
    toggleTagFilter,
    priorityOptions,
    priorityFilters,
    togglePriorityFilter,
    teamMembers,
    assigneeFilters,
    toggleAssigneeFilter,
    filterBadgeCount,
    clearAllFilters,
  } = useTickets();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const assigneeOptions = useMemo(
    () => ["unassigned", ...teamMembers],
    [teamMembers]
  );

  return (
    <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
      <div className="flex items-center bg-gray-50 p-0.5 rounded-lg border border-gray-200/50">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-900 border border-transparent"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-gray-200 mx-1" />

      <div className="relative">
        <button
          onClick={() => {
            setIsSortOpen((prev) => !prev);
            setIsFilterOpen(false);
          }}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition"
        >
          <i className="fa-solid fa-arrow-down-wide-short text-gray-400" />
          Sort
          <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 ml-0.5" />
        </button>
        {isSortOpen && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSortBy(option.id);
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{option.label}</span>
                <i
                  className={`fa-solid fa-check text-blue-600 text-xs ${
                    sortBy === option.id ? "" : "invisible"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setIsFilterOpen((prev) => !prev);
            setIsSortOpen(false);
          }}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition"
        >
          <i className="fa-solid fa-sliders text-gray-400" />
          Filter
          {filterBadgeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">
              {filterBadgeCount}
            </span>
          )}
          <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 ml-0.5" />
        </button>
        {isFilterOpen && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-128 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsFilterOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              <FilterSection title="Tags" icon="fa-tags">
                {tagOptions.map((tag) => (
                  <FilterCheckbox
                    key={tag}
                    label={tag}
                    checked={tagFilters.includes(tag)}
                    onChange={() => toggleTagFilter(tag)}
                    iconClass={getTagIcon(tag)}
                  />
                ))}
              </FilterSection>
              <FilterSection title="Priority" icon="fa-flag">
                {priorityOptions.map((priority) => (
                  <FilterCheckbox
                    key={priority}
                    label={priority === "critical" ? "Critical" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    checked={priorityFilters.includes(priority)}
                    onChange={() => togglePriorityFilter(priority)}
                    badge={getPriorityBadge(priority)}
                  />
                ))}
              </FilterSection>
              <FilterSection title="Assignee" icon="fa-user">
                {assigneeOptions.map((assignee) => (
                  <FilterCheckbox
                    key={assignee}
                    label={
                      assignee === "unassigned" ? "Unassigned" : assignee
                    }
                    checked={assigneeFilters.includes(assignee)}
                    onChange={() => toggleAssigneeFilter(assignee)}
                    italic={assignee === "unassigned"}
                  />
                ))}
              </FilterSection>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) => (
  <div className="py-2">
    <div className="px-4 py-2 flex items-center gap-2">
      <i className={`fa-solid ${icon} text-gray-400 text-xs`} />
      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="px-2 space-y-1">{children}</div>
  </div>
);

const FilterCheckbox = ({
  label,
  checked,
  onChange,
  iconClass,
  badge,
  italic,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  iconClass?: string;
  badge?: ReactNode;
  italic?: boolean;
}) => (
  <label className="flex items-center px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer group transition-colors text-sm text-gray-700 gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
    />
    <span
      className={`flex-1 ${italic ? "text-gray-500 italic" : "text-gray-700"} group-hover:text-gray-900`}
    >
      {label}
    </span>
    {badge}
    {iconClass && (
      <i className={`fa-solid ${iconClass} text-xs text-gray-400`} />
    )}
  </label>
);

const getTagIcon = (tag: string) => {
  switch (tag) {
    case "Bug":
      return "fa-bug";
    case "Feature":
      return "fa-star";
    case "Support":
      return "fa-life-ring";
    case "Billing":
      return "fa-credit-card";
    case "Mobile":
      return "fa-mobile-screen";
    case "Critical":
      return "fa-circle-exclamation";
    default:
      return "fa-tag";
  }
};

const getPriorityBadge = (priority: TicketPriority) => {
  const styles: Record<TicketPriority, string> = {
    critical: "text-red-600 font-semibold",
    urgent: "text-orange-500 font-semibold",
    normal: "text-blue-500",
    low: "text-gray-500",
  };

  const symbols: Record<TicketPriority, string> = {
    critical: "!!!!",
    urgent: "!!!",
    normal: "!!",
    low: "!",
  };

  return (
    <span className={`text-xs ${styles[priority]}`}>{symbols[priority]}</span>
  );
};

export default TicketToolbar;