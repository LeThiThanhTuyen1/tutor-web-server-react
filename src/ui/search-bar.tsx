import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  statusOptions: string[];
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statusOptions,
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* input search */}
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* filter */}
      <div>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">all</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
