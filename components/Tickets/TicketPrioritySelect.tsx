'use client';
import { TicketPriority } from "@/types";

type TicketPrioritySelectProps = {
  className?: string;
  selectClassName?: string;
  value: TicketPriority;
  onChange: (value: TicketPriority) => void;
};

const baseSelectClasses = "appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-[12px] rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 pr-8";

const TicketPrioritySelect = ({ value, onChange, className = "", selectClassName = "" }: TicketPrioritySelectProps) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as TicketPriority)}
      className={`${baseSelectClasses} ${selectClassName}`}
    >
      <option value="critical">Critical</option>
      <option value="urgent">Urgent</option>
      <option value="normal">Normal</option>
      <option value="low">Low</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <i className="fa-solid fa-chevron-down text-[10px]" />
    </div>
  </div>
);

export default TicketPrioritySelect;