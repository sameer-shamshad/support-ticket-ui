import { SortOption, Ticket, TicketPriority, TicketStatus } from "@/types";

type Listener = () => void;

class TicketsStore {
  private tickets: Ticket[];
  private currentTime: number;
  private statusFilter: TicketStatus | "all" = "all";
  private searchTerm: string = "";
  private tagFilters: string[] = [];
  private priorityFilters: TicketPriority[] = [];
  private assigneeFilters: string[] = [];
  private sortBy: SortOption = "newest";
  private selectedTicketId: string | null = null;
  private isModalOpen: boolean = false;
  private listeners: Set<Listener> = new Set();

  constructor(initialTickets: Ticket[]) {
    this.tickets = initialTickets;
    this.currentTime = Date.now();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getTickets() {
    return this.tickets;
  }

  setTickets(tickets: Ticket[]) {
    this.tickets = tickets;
    this.notify();
  }

  getCurrentTime() {
    return this.currentTime;
  }

  setCurrentTime(time: number) {
    this.currentTime = time;
    this.notify();
  }

  getStatusFilter() {
    return this.statusFilter;
  }

  setStatusFilter(filter: TicketStatus | "all") {
    this.statusFilter = filter;
    this.notify();
  }

  getSearchTerm() {
    return this.searchTerm;
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.notify();
  }

  getTagFilters() {
    return this.tagFilters;
  }

  setTagFilters(filters: string[]) {
    this.tagFilters = filters;
    this.notify();
  }

  getPriorityFilters() {
    return this.priorityFilters;
  }

  setPriorityFilters(filters: TicketPriority[]) {
    this.priorityFilters = filters;
    this.notify();
  }

  getAssigneeFilters() {
    return this.assigneeFilters;
  }

  setAssigneeFilters(filters: string[]) {
    this.assigneeFilters = filters;
    this.notify();
  }

  getSortBy() {
    return this.sortBy;
  }

  setSortBy(sort: SortOption) {
    this.sortBy = sort;
    this.notify();
  }

  getSelectedTicketId() {
    return this.selectedTicketId;
  }

  setSelectedTicketId(id: string | null) {
    this.selectedTicketId = id;
    this.notify();
  }

  getIsModalOpen() {
    return this.isModalOpen;
  }

  setIsModalOpen(open: boolean) {
    this.isModalOpen = open;
    this.notify();
  }
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "T-1024",
    title: "Login failure on iOS App",
    status: "queued",
    priority: "urgent",
    requester: "John Doe",
    email: "john@example.com",
    createdAt: Date.now() - 1000 * 60 * 2,
    assignee: null,
    tags: ["Bug", "Mobile"],
    description:
      "Users are unable to log in to the iOS application. The login button appears to be non-responsive after entering credentials.",
    messages: [
      {
        sender: "John Doe",
        time: "2m ago",
        text: "I cannot log into the iOS app. The button does nothing.",
      },
    ],
  },
  {
    id: "T-1023",
    title: "Refund request for Subscription #990",
    status: "active",
    priority: "normal",
    requester: "Emma Schmidt",
    email: "emma@example.de",
    createdAt: Date.now() - 1000 * 60 * 10,
    assignee: "Sarah Johnson",
    tags: ["Billing"],
    description:
      "Customer requesting a refund for subscription #990 due to billing issues.",
    messages: [
      {
        sender: "Emma Schmidt",
        time: "15m ago",
        text: "I was charged twice. Please refund.",
      },
    ],
  },
  {
    id: "T-1022",
    title: "Feature request: Dark Mode",
    status: "active",
    priority: "low",
    requester: "Alex Thompson",
    email: "alex@example.com",
    createdAt: Date.now() - 1000 * 60 * 60,
    assignee: "Mike Chen",
    tags: ["Feature"],
    description:
      "User requesting dark mode support for better usability during nighttime.",
    messages: [],
  },
  {
    id: "T-1021",
    title: "How to update profile picture?",
    status: "ended",
    priority: "low",
    requester: "Marie Dubois",
    email: "marie@example.fr",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    assignee: "AI Bot",
    tags: ["Support"],
    description: "User asking about how to update their profile picture.",
    messages: [],
  },
  {
    id: "T-1020",
    title: "Battery draining fast on v2.0",
    status: "escalated",
    priority: "critical",
    requester: "Yuki Tanaka",
    email: "yuki@example.jp",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    assignee: "David Park",
    tags: ["Bug", "Critical"],
    description:
      "Multiple reports of excessive battery drainage on version 2.0.",
    messages: [],
  },
];

export const ticketsStore = new TicketsStore(INITIAL_TICKETS);

