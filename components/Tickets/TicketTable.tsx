'use client';
import { formatRelativeTime } from "@/utils/time";
import TicketStatusSelect from "./TicketStatusSelect";
import TicketPrioritySelect from "./TicketPrioritySelect";
import TicketAssigneeSelect from "./TicketAssigneeSelect";
import { useTickets } from "@/hooks/useTickets";
import { useToast } from "@/hooks/useToast";
import { Ticket, TicketPriority, TicketStatus } from "@/types";

const TicketTable = () => {
  const {
    tickets,
    teamMembers,
    currentTime,
    updateTicketStatus,
    updateTicketPriority,
    updateTicketAssignee,
    handleTagShortcut,
    openTicketDetails,
    searchTerm,
    statusFilter,
    filterBadgeCount,
    clearAllFilters,
  } = useTickets();
  const { pushToast } = useToast();

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateTicketStatus(id, status);
    pushToast(`Status updated to ${status}`);
  };

  const handlePriorityChange = (id: string, priority: TicketPriority) => {
    updateTicketPriority(id, priority);
    pushToast(`Priority updated to ${priority}`);
  };

  const handleAssigneeChange = (id: string, assignee: string | null) => {
    updateTicketAssignee(id, assignee);
    pushToast(assignee ? `Assigned to ${assignee}` : "Ticket unassigned");
  };

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    statusFilter !== "all" ||
    filterBadgeCount > 0;
  if (tickets.length === 0) {
    return (
      <div className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i className="fa-solid fa-inbox text-2xl text-gray-300" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No tickets found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-white sticky top-0 z-10">
        <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
          <th className="px-6 py-3 font-medium w-16 text-center">ID</th>
          <th className="px-6 py-3 font-medium w-32">Status</th>
          <th className="px-6 py-3 font-medium">Subject</th>
          <th className="px-6 py-3 font-medium w-40">Priority</th>
          <th className="px-6 py-3 font-medium w-48">Requester</th>
          <th className="px-6 py-3 font-medium w-40">Assignee</th>
          <th className="px-6 py-3 font-medium w-32 text-right">Created</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            teamMembers={teamMembers}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onAssigneeChange={handleAssigneeChange}
            onTagClick={handleTagShortcut}
            onOpenDetails={openTicketDetails}
            currentTime={currentTime}
          />
        ))}
      </tbody>
    </table>
  );
};

const statusSelectClasses =
  "bg-gray-50 border border-gray-200 text-xs font-medium rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 pr-8 transition-all hover:bg-gray-100";

const statusColors: Record<TicketStatus, string> = {
  active: "text-blue-700",
  queued: "text-yellow-700",
  escalated: "text-red-700",
  ended: "text-gray-600",
};

const priorityColors: Record<TicketPriority, string> = {
  critical: "text-red-700 font-bold",
  urgent: "text-orange-600 font-semibold",
  normal: "text-blue-600",
  low: "text-gray-500",
};

type TicketRowProps = {
  ticket: Ticket;
  teamMembers: readonly string[];
  currentTime: number;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onPriorityChange: (id: string, priority: TicketPriority) => void;
  onAssigneeChange: (id: string, assignee: string | null) => void;
  onTagClick: (tag: string) => void;
  onOpenDetails: (id: string) => void;
};

const TicketRow = ({
  ticket,
  teamMembers,
  currentTime,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onTagClick,
  onOpenDetails,
}: TicketRowProps) => (
  <tr
    className="table-row-hover group cursor-pointer transition-colors"
    onClick={() => onOpenDetails(ticket.id)}
  >
    <td className="px-6 py-3.5 font-mono text-xs text-gray-400 group-hover:text-gray-600 text-center">
      {ticket.id}
    </td>
    <td className="px-6 py-3.5" onClick={(event) => event.stopPropagation()}>
      <TicketStatusSelect
        value={ticket.status}
        onChange={(value: TicketStatus) => onStatusChange(ticket.id, value)}
        className="inline-block w-32 text-[12px]"
        selectClassName={`${statusSelectClasses} ${statusColors[ticket.status as TicketStatus]}`}
      />
    </td>
    <td className="px-6 py-3.5">
      <div className="font-medium text-gray-900 mb-0.5">{ticket.title}</div>
      <div className="flex items-center gap-2 flex-wrap">
        {ticket.tags.map((tag: string) => (
          <button
            key={tag}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTagClick(tag);
            }}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </td>
    <td className="px-6 py-3.5" onClick={(event) => event.stopPropagation()}>
      <TicketPrioritySelect
        value={ticket.priority}
        onChange={(value: TicketPriority) => onPriorityChange(ticket.id, value)}
        className="inline-block w-32"
        selectClassName={priorityColors[ticket.priority as TicketPriority]}
      />
    </td>
    <td className="px-6 py-3.5">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
          {ticket.requester.charAt(0)}
        </div>
        <span className="text-sm text-gray-700">{ticket.requester}</span>
      </div>
    </td>
    <td className="px-6 py-3.5" onClick={(event) => event.stopPropagation()}>
      <TicketAssigneeSelect
        value={ticket.assignee}
        options={teamMembers}
        onChange={(value) => onAssigneeChange(ticket.id, value)}
        className="w-40"
        selectClassName="cursor-pointer hover:bg-gray-100 transition-all"
      />
    </td>
    <td className="px-6 py-3.5 text-right text-gray-400 text-xs whitespace-nowrap">
      {formatRelativeTime(ticket.createdAt, currentTime)}
    </td>
  </tr>
);

export default TicketTable;