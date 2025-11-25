import { memo } from "react";
import { TicketMessage } from "@/types";
import TicketMessageItem from "./TicketMessageItem";

type TicketActivityProps = {
  messages: TicketMessage[];
};

const TicketActivity = ({ messages }: TicketActivityProps) => (
  <div className="space-y-6">
    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
      Activity
    </h3>

    {
        messages.length > 0 ? (
            messages.map((message) => (
                <TicketMessageItem message={message} key={message.sender + message.time} />
            ))
        ) : (
            <div className="text-sm text-gray-400 italic">No messages yet</div>
        )
    }
  </div>
);

export default memo(TicketActivity);