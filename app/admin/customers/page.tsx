'use client';

import { useState, useMemo } from 'react';
import { Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  role: 'admin' | 'user' | 'moderator';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    status: 'active',
    lastActive: 'Just now',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    status: 'active',
    lastActive: '5 minutes ago',
    role: 'user',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    status: 'inactive',
    lastActive: '2 hours ago',
    role: 'moderator',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    status: 'active',
    lastActive: '1 hour ago',
    role: 'user',
  },
  {
    id: '5',
    name: 'Emma Brown',
    email: 'emma.brown@example.com',
    status: 'pending',
    lastActive: 'Never',
    role: 'user',
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank.miller@example.com',
    status: 'active',
    lastActive: '30 minutes ago',
    role: 'user',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace.lee@example.com',
    status: 'active',
    lastActive: '15 minutes ago',
    role: 'user',
  },
  {
    id: '8',
    name: 'Henry Zhang',
    email: 'henry.zhang@example.com',
    status: 'active',
    lastActive: '45 minutes ago',
    role: 'user',
  },
];

const USERS_PER_PAGE = 5;

export default function UserListPage() {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [searchQueryString, setSearchQueryString] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const searchMatchingUsers = useMemo(() => {
    return mockUsers.filter(
      user =>
        user.name.toLowerCase().includes(searchQueryString.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQueryString.toLowerCase())
    );
  }, [searchQueryString]);

  const totalPages = Math.ceil(searchMatchingUsers.length / USERS_PER_PAGE);
  const startIndexForCurrentPage = (currentPageNumber - 1) * USERS_PER_PAGE;
  const endIndexForCurrentPage = startIndexForCurrentPage + USERS_PER_PAGE;
  const usersDisplayedOnCurrentPage = searchMatchingUsers.slice(
    startIndexForCurrentPage,
    endIndexForCurrentPage
  );

  const toggleSelectSpecificUser = (userId: string) => {
    const updatedSelectedUsers = new Set(selectedUserIds);
    if (updatedSelectedUsers.has(userId)) {
      updatedSelectedUsers.delete(userId);
    } else {
      updatedSelectedUsers.add(userId);
    }
    setSelectedUserIds(updatedSelectedUsers);
  };

  const toggleSelectAllDisplayedUsers = () => {
    if (selectedUserIds.size === usersDisplayedOnCurrentPage.length) {
      setSelectedUserIds(new Set());
    } else {
      const allUserIdsOnCurrentPage = new Set(usersDisplayedOnCurrentPage.map(user => user.id));
      setSelectedUserIds(allUserIdsOnCurrentPage);
    }
  };

  const getStatusIndicatorColor = (statusType: string) => {
    const statusColorMap: Record<string, string> = {
      active: 'bg-green-500',
      inactive: 'bg-gray-400',
      pending: 'bg-yellow-500',
    };
    return statusColorMap[statusType] || 'bg-gray-400';
  };

  const handleUserActionButtonClick = (clickedUser: User) => {
    alert(`Actions for ${clickedUser.name} (${clickedUser.email})`);
  };

  const goToPreviousPage = () => {
    if (currentPageNumber > 1) {
      setCurrentPageNumber(currentPageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPageNumber < totalPages) {
      setCurrentPageNumber(currentPageNumber + 1);
    }
  };

  const isCurrentPageFirstPage = currentPageNumber === 1;
  const isCurrentPageLastPage = currentPageNumber === totalPages;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 px-8 py-5">
        <h1 className="text-xl font-medium text-gray-900">Users</h1>
      </div>

      <div className="border-b border-gray-200 px-8 py-4 bg-white flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={isCurrentPageFirstPage}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={isCurrentPageLastPage}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQueryString}
            onChange={e => {
              setSearchQueryString(e.target.value);
              setCurrentPageNumber(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {usersDisplayedOnCurrentPage.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-white sticky top-0">
                <th className="px-8 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUserIds.size > 0 &&
                      selectedUserIds.size === usersDisplayedOnCurrentPage.length
                    }
                    onChange={toggleSelectAllDisplayedUsers}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 tracking-wide">
                  NAME
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 tracking-wide">
                  EMAIL
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 tracking-wide">
                  STATUS
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 tracking-wide">
                  ROLE
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 tracking-wide">
                  LAST ACTIVE
                </th>
                <th className="px-8 py-3 text-right text-xs font-medium text-gray-700 tracking-wide">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {usersDisplayedOnCurrentPage.map(user => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-8 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(user.id)}
                      onChange={() => toggleSelectSpecificUser(user.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-8 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusIndicatorColor(user.status)}`}
                      />
                      <span className="text-sm text-gray-700 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-600 capitalize">{user.role}</td>
                  <td className="px-8 py-4 text-sm text-gray-600">{user.lastActive}</td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleUserActionButtonClick(user)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-sm font-medium">No users found</p>
          </div>
        )}
      </div>

      {usersDisplayedOnCurrentPage.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-8 py-3 text-xs text-gray-600 flex items-center justify-between">
          <div>
            {usersDisplayedOnCurrentPage.length} of {searchMatchingUsers.length} users
            {selectedUserIds.size > 0 && ` • ${selectedUserIds.size} selected`}
          </div>
          <div className="text-gray-500">
            Page {currentPageNumber} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
