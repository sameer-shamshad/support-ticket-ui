import { useEffect, useMemo, useState } from "react";
import { SortOption, Ticket, TicketPriority, TicketStatus } from "@/types";

export const TEAM_MEMBERS = [
  "Sarah Johnson",
  "Mike Chen",
  "David Park",
  "Emily Rodriguez",
  "James Wilson",
  "AI Bot",
] as const;

export const TAG_OPTIONS = [
  "Bug",
  "Feature",
  "Support",
  "Billing",
  "Mobile",
  "Critical",
] as const;

export const PRIORITY_OPTIONS: TicketPriority[] = [
  "critical",
  "urgent",
  "normal",
  "low",
];

const PRIORITY_ORDER: Record<TicketPriority, number> = {
  critical: 4,
  urgent: 3,
  normal: 2,
  low: 1,
};

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

type NewTicketInput = {
  title: string;
  requester: string;
  email: string;
  priority: TicketPriority;
  description: string;
};

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<TicketPriority[]>([]);
  const [assigneeFilters, setAssigneeFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterBadgeCount =
    tagFilters.length + priorityFilters.length + assigneeFilters.length;

  const visibleTickets = useMemo(() => {
    let result = [...tickets];

    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(lower) ||
          ticket.title.toLowerCase().includes(lower) ||
          ticket.requester.toLowerCase().includes(lower)
      );
    }

    if (tagFilters.length > 0) {
      result = result.filter((ticket) =>
        ticket.tags.some((tag) => tagFilters.includes(tag))
      );
    }

    if (priorityFilters.length > 0) {
      result = result.filter((ticket) =>
        priorityFilters.includes(ticket.priority)
      );
    }

    if (assigneeFilters.length > 0) {
      result = result.filter((ticket) => {
        const includesUnassigned = assigneeFilters.includes("unassigned");
        if (!ticket.assignee) {
          return includesUnassigned;
        }

        return assigneeFilters.includes(ticket.assignee);
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.createdAt - b.createdAt;
        case "priority-high":
          return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        case "priority-low":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "newest":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [
    assigneeFilters,
    priorityFilters,
    searchTerm,
    sortBy,
    statusFilter,
    tagFilters,
    tickets,
  ]);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? null;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTicket = (id: string, updater: (ticket: Ticket) => Ticket) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? updater(ticket) : ticket)));
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    updateTicket(id, (ticket) => ({ ...ticket, status }));
  };

  const updateTicketPriority = (id: string, priority: TicketPriority) => {
    updateTicket(id, (ticket) => ({ ...ticket, priority }));
  };

  const updateTicketAssignee = (id: string, assignee: string | null) => {
    updateTicket(id, (ticket) => ({ ...ticket, assignee }));
  };

  const toggleTagFilter = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const togglePriorityFilter = (priority: TicketPriority) => {
    setPriorityFilters((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleAssigneeFilter = (assignee: string) => {
    setAssigneeFilters((prev) =>
      prev.includes(assignee)
        ? prev.filter((a) => a !== assignee)
        : [...prev, assignee]
    );
  };

  const openTicketDetails = (id: string) => setSelectedTicketId(id);
  const closeTicketDetails = () => setSelectedTicketId(null);

  const openNewTicketModal = () => setIsModalOpen(true);
  const closeNewTicketModal = () => setIsModalOpen(false);

  const clearAllFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setTagFilters([]);
    setPriorityFilters([]);
    setAssigneeFilters([]);
  };

  const handleTagShortcut = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev : [...prev, tag]
    );
  };

  const createTicket = (input: NewTicketInput) => {
    const currentMax = tickets.reduce((max, ticket) => {
      const numericId = Number.parseInt(ticket.id.replace("T-", ""), 10);
      if (Number.isNaN(numericId)) {
        return max;
      }
      return Math.max(max, numericId);
    }, 1000);
    const nextId = currentMax + 1;

    const newTicket: Ticket = {
      id: `T-${nextId}`,
      title: input.title,
      status: "queued",
      priority: input.priority,
      requester: input.requester,
      email: input.email,
      createdAt: Date.now(),
      assignee: null,
      tags: ["Support"],
      description: input.description,
      messages: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
  };

  return {
    tickets: visibleTickets,
    allTickets: tickets,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    tagFilters,
    toggleTagFilter,
    priorityFilters,
    togglePriorityFilter,
    assigneeFilters,
    toggleAssigneeFilter,
    sortBy,
    setSortBy,
    filterBadgeCount,
    clearAllFilters,
    updateTicketStatus,
    updateTicketPriority,
    updateTicketAssignee,
    openTicketDetails,
    closeTicketDetails,
    selectedTicket,
    isModalOpen,
    openNewTicketModal,
    closeNewTicketModal,
    createTicket,
    teamMembers: TEAM_MEMBERS,
    tagOptions: TAG_OPTIONS,
    priorityOptions: PRIORITY_OPTIONS,
    handleTagShortcut,
    openCount: tickets.filter((ticket) => ticket.status !== "ended").length,
    currentTime,
  };
};