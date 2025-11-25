'use client';

type TicketAssigneeSelectProps = {
  value: string | null;
  options: readonly string[];
  onChange: (value: string | null) => void;
  className?: string;
  selectClassName?: string;
};

const baseSelectClasses = "appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-[12px] rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 pr-8";

const TicketAssigneeSelect = ({ value, options, onChange, className = "", selectClassName = "" }: TicketAssigneeSelectProps) => (
    <div className={`relative ${className}`}>
        <select
            className={`${baseSelectClasses} ${selectClassName}`}
            value={value ?? ""}
            onChange={(event) => {
                const nextValue = event.target.value;
                onChange(nextValue === "" ? null : nextValue);
            }}
        >
        <option value="">Unassigned</option>
        {
            options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))
        }
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <i className="fa-solid fa-chevron-down text-[10px]" />
        </div>
    </div>
);

export default TicketAssigneeSelect;