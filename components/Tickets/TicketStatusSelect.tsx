'use client';
import { TicketStatus } from "@/types";

type TicketStatusSelectProps = {
  className?: string;
  selectClassName?: string;
  value: TicketStatus;
  onChange: (value: TicketStatus) => void;
  hideChevron?: boolean;
};

const STATUS_OPTIONS: TicketStatus[] = ["queued", "active", "escalated", "ended"];
const baseSelectClasses = "appearance-none cursor-pointer focus:outline-none focus-visible:outline-none w-full";

const formatLabel = (status: TicketStatus) => status.charAt(0).toUpperCase() + status.slice(1);

const TicketStatusSelect = ({ value, onChange, className = "", selectClassName = "", hideChevron = false }: TicketStatusSelectProps) => (
    <div className={`relative ${className}`}>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value as TicketStatus)}
            className={`${baseSelectClasses} ${selectClassName}`}
        >
        {
            STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                    {formatLabel(status)}
                </option>
            ))
        }
        </select>
        {
            !hideChevron && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <i className="fa-solid fa-chevron-down text-[10px]" />
                </div>
            )
        }
    </div>
);

export default TicketStatusSelect;