export type TicketStatus = "queued" | "active" | "escalated" | "ended";

export type TicketPriority = "critical" | "urgent" | "normal" | "low";

export interface TicketMessage {
  sender: string;
  time: string;
  text: string;
}

export interface Ticket {
  id: string;
  status: TicketStatus;
  title: string;
  description: string;
  priority: TicketPriority;
  requester: string;
  email: string;
  assignee: string | null;
  createdAt: number;
  tags: string[];
  messages: TicketMessage[];
}

export type SortOption = "" | "newest" | "oldest" | "priority-high" | "priority-low";