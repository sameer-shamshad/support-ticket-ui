import TicketActivity from "./TicketActivity";
import TicketStatusSelect from "./TicketStatusSelect";
import TicketPrioritySelect from "./TicketPrioritySelect";
import TicketAssigneeSelect from "./TicketAssigneeSelect";
import { Ticket, TicketPriority, TicketStatus } from "@/types";

type TicketDetailsPanelProps = {
  ticket: Ticket | null;
  isOpen: boolean;
  teamMembers: readonly string[];
  onClose: () => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onAssigneeChange: (id: string, assignee: string | null) => void;
  onPriorityChange: (id: string, priority: TicketPriority) => void;
};

const TicketDetailsPanel = ({
  ticket,
  isOpen,
  teamMembers,
  onClose,
  onStatusChange,
  onAssigneeChange,
  onPriorityChange,
}: TicketDetailsPanelProps) => (
  <div
    className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {ticket ? (
      <>
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="font-mono">{ticket.id}</span>
            <span className="text-gray-300">/</span>
            <TicketStatusSelect
              value={ticket.status}
              onChange={(value) => onStatusChange(ticket.id, value)}
              className="-ml-2 inline-block"
              selectClassName="bg-transparent border-none text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition">
              <i className="fa-solid fa-ellipsis" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {ticket.title}
            </h2>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border border-gray-200">
                  {ticket.requester.charAt(0)}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {ticket.requester}
                  </div>
                  <div className="text-gray-500 text-xs">{ticket.email}</div>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-sm flex flex-col gap-1">
                <span className="text-gray-500 text-xs">Assignee</span>
                <TicketAssigneeSelect
                  value={ticket.assignee}
                  options={teamMembers}
                  onChange={(value) => onAssigneeChange(ticket.id, value)}
                  className="w-48"
                />
              </div>
              <div className="h-8 w-px bg-gray-200" />

              <div className="text-sm flex flex-col gap-1">
                <span className="text-gray-500 text-xs">Priority</span>
                <TicketPrioritySelect
                  className="w-32"
                  value={ticket.priority}
                  onChange={(value) => onPriorityChange(ticket.id, value)}
                />
              </div>
            </div>
          </div>

            <p className="text-[14px] max-w-none">
                <p>{ticket.description}</p>
            </p>

            <TicketActivity messages={ticket.messages} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="relative">
            <input
                type="text"
                placeholder="Reply..."
                className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-900 transition">
                <i className="fa-solid fa-paper-plane" />
            </button>
            </div>
        </div>
      </>
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a ticket to view details
      </div>
    )}
  </div>
);

export default TicketDetailsPanel;