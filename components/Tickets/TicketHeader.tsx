type TicketHeaderProps = {
  openCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewTicket: () => void;
};

const TicketHeader = ({ openCount, searchTerm, onSearchChange, onNewTicket }: TicketHeaderProps) => (
  <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
    <div className="flex items-center gap-4">
      <h1 className="text-base font-semibold text-gray-900">All Tickets</h1>
      <div className="h-4 w-px bg-gray-200" />
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <span className="font-medium text-gray-900">{openCount}</span>
        <span>open</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="relative group">
        <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs group-focus-within:text-gray-600" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          type="text"
          placeholder="Search..."
          className="pl-8 pr-3 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 rounded-md text-sm w-64 transition-all placeholder-gray-400"
        />
      </div>
      <button
        onClick={onNewTicket}
        className="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition shadow-sm flex items-center gap-2"
      >
        <i className="fa-solid fa-plus text-xs" />
        New Issue
      </button>
    </div>
  </header>
);

export default TicketHeader;

