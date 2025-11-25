'use client';

import Sidebar from "@/components/Sidebar/Sidebar";
import TicketDetailsPanel from "@/components/Tickets/TicketDetailsPanel";
import TicketHeader from "@/components/Tickets/TicketHeader";
import TicketTable from "@/components/Tickets/TicketTable";
import TicketToolbar from "@/components/Tickets/TicketToolbar";
import CreateTicketForm from "@/components/Tickets/CreateTicketForm";
import NotificationToast from "@/components/ui/NotificationToast";
import { useTickets } from "@/hooks/useTickets";
import { useToast } from "@/hooks/useToast";
import type { TicketPriority, TicketStatus } from "@/types";

export default function Home() {
  const {
    tickets,
    currentTime,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    tagOptions,
    tagFilters,
    toggleTagFilter,
    priorityOptions,
    priorityFilters,
    togglePriorityFilter,
    teamMembers,
    assigneeFilters,
    toggleAssigneeFilter,
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
    handleTagShortcut,
    openCount,
  } = useTickets();
  const { message: toastMessage, pushToast, dismissToast } = useToast();

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateTicketStatus(id, status);
    pushToast(`Status updated to ${status}`);
  };

  const handlePriorityChange = (id: string, priority: TicketPriority) => {
    updateTicketPriority(id, priority);
    pushToast(`Priority updated to ${priority}`);
  };

  const handleAssigneeChange = (id: string, assignee: string | null) => {
    updateTicketAssignee(id, assignee);
    pushToast(assignee ? `Assigned to ${assignee}` : "Ticket unassigned");
  };

  const handleCreateTicket = (input: Parameters<typeof createTicket>[0]) => {
    createTicket(input);
    pushToast("Ticket created successfully");
  };

  const showDetails = Boolean(selectedTicket);
  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    statusFilter !== "all" ||
    filterBadgeCount > 0;

  return (
    <div className="bg-white text-gray-900 antialiased h-screen flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <TicketHeader
          openCount={openCount}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewTicket={openNewTicketModal}
        />

        <TicketToolbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tagOptions={tagOptions}
          tagFilters={tagFilters}
          toggleTagFilter={toggleTagFilter}
          priorityOptions={priorityOptions}
          priorityFilters={priorityFilters}
          togglePriorityFilter={togglePriorityFilter}
          teamMembers={teamMembers}
          assigneeFilters={assigneeFilters}
          toggleAssigneeFilter={toggleAssigneeFilter}
          filterBadgeCount={filterBadgeCount}
          clearAllFilters={clearAllFilters}
        />
        
        <div className="flex-1 overflow-auto">
          <TicketTable
            tickets={tickets}
            teamMembers={teamMembers}
            currentTime={currentTime}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onAssigneeChange={handleAssigneeChange}
            onTagClick={handleTagShortcut}
            onOpenDetails={openTicketDetails}
            showClearFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        </div>
      </main>

      {
        showDetails && (
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30"
            onClick={closeTicketDetails}
          />
        )
      }

      <TicketDetailsPanel
        ticket={selectedTicket}
        isOpen={showDetails}
        teamMembers={teamMembers}
        onClose={closeTicketDetails}
        onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
        onPriorityChange={handlePriorityChange}
      />

      <CreateTicketForm
        isOpen={isModalOpen}
        onClose={closeNewTicketModal}
        onSubmit={handleCreateTicket}
      />

      <NotificationToast message={toastMessage} onDismiss={dismissToast} />
    </div>
  );
}
