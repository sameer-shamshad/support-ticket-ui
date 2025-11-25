import { useEffect, useMemo, useSyncExternalStore } from "react";
import { SortOption, Ticket, TicketPriority, TicketStatus } from "@/types";
import { ticketsStore } from "@/store/ticketsStore";

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

type NewTicketInput = {
  title: string;
  requester: string;
  email: string;
  priority: TicketPriority;
  description: string;
};

export const useTickets = () => {
  const tickets = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getTickets.bind(ticketsStore)
  );
  
  const currentTime = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getCurrentTime.bind(ticketsStore)
  );
  
  const statusFilter = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getStatusFilter.bind(ticketsStore)
  );
  
  const searchTerm = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getSearchTerm.bind(ticketsStore)
  );
  
  const tagFilters = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getTagFilters.bind(ticketsStore)
  );
  
  const priorityFilters = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getPriorityFilters.bind(ticketsStore)
  );
  
  const assigneeFilters = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getAssigneeFilters.bind(ticketsStore)
  );
  
  const sortBy = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getSortBy.bind(ticketsStore)
  );
  
  const selectedTicketId = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getSelectedTicketId.bind(ticketsStore)
  );
  
  const isModalOpen = useSyncExternalStore(
    ticketsStore.subscribe.bind(ticketsStore),
    ticketsStore.getIsModalOpen.bind(ticketsStore)
  );

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
    const interval = setInterval(() => ticketsStore.setCurrentTime(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTicket = (id: string, updater: (ticket: Ticket) => Ticket) => {
    const updated = tickets.map((ticket) => (ticket.id === id ? updater(ticket) : ticket));
    ticketsStore.setTickets(updated);
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
    const newFilters = tagFilters.includes(tag)
      ? tagFilters.filter((t) => t !== tag)
      : [...tagFilters, tag];
    ticketsStore.setTagFilters(newFilters);
  };

  const togglePriorityFilter = (priority: TicketPriority) => {
    const newFilters = priorityFilters.includes(priority)
      ? priorityFilters.filter((p) => p !== priority)
      : [...priorityFilters, priority];
    ticketsStore.setPriorityFilters(newFilters);
  };

  const toggleAssigneeFilter = (assignee: string) => {
    const newFilters = assigneeFilters.includes(assignee)
      ? assigneeFilters.filter((a) => a !== assignee)
      : [...assigneeFilters, assignee];
    ticketsStore.setAssigneeFilters(newFilters);
  };

  const openTicketDetails = (id: string) => ticketsStore.setSelectedTicketId(id);
  const closeTicketDetails = () => ticketsStore.setSelectedTicketId(null);

  const openNewTicketModal = () => ticketsStore.setIsModalOpen(true);
  const closeNewTicketModal = () => ticketsStore.setIsModalOpen(false);

  const clearAllFilters = () => {
    ticketsStore.setStatusFilter("all");
    ticketsStore.setSearchTerm("");
    ticketsStore.setTagFilters([]);
    ticketsStore.setPriorityFilters([]);
    ticketsStore.setAssigneeFilters([]);
  };

  const handleTagShortcut = (tag: string) => {
    if (!tagFilters.includes(tag)) {
      ticketsStore.setTagFilters([...tagFilters, tag]);
    }
  };

  const setSearchTerm = (term: string) => ticketsStore.setSearchTerm(term);
  const setStatusFilter = (filter: TicketStatus | "all") => ticketsStore.setStatusFilter(filter);
  const setSortBy = (sort: SortOption) => ticketsStore.setSortBy(sort);

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

    ticketsStore.setTickets([newTicket, ...tickets]);
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
