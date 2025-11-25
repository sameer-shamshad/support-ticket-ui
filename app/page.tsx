'use client';

import Sidebar from "@/components/Sidebar/Sidebar";
import TicketDetailsPanel from "@/components/Tickets/TicketDetailsPanel";
import TicketHeader from "@/components/Tickets/TicketHeader";
import TicketTable from "@/components/Tickets/TicketTable";
import TicketToolbar from "@/components/Tickets/TicketToolbar";
import CreateTicketForm from "@/components/Tickets/CreateTicketForm";
import NotificationToast from "@/components/ui/NotificationToast";
import { useTickets } from "@/hooks/useTickets";

export default function Home() {
  const { selectedTicket, closeTicketDetails } = useTickets();
  const showDetails = Boolean(selectedTicket);

  return (
    <div className="bg-white text-gray-900 antialiased h-screen flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <TicketHeader />
        <TicketToolbar />

        <div className="flex-1 overflow-auto">
          <TicketTable />
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

      <TicketDetailsPanel />
      <CreateTicketForm />
      <NotificationToast />
    </div>
  );
}
