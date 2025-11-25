import { memo } from "react";

import { TicketMessage } from "@/types";

type TicketMessageItemProps = {
  message: TicketMessage;
};

const TicketMessageItem = ({ message }: TicketMessageItemProps) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
      {message.sender.charAt(0)}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-900">{message.sender}</span>
        <span className="text-xs text-gray-400">{message.time}</span>
      </div>
      <p className="text-[13px] text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        {message.text}
      </p>
    </div>
  </div>
);

export default memo(TicketMessageItem);