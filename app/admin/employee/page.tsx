"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { User } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ========== SERVICE ==========

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 100;

type EmployeeQueryParameters = {
  sort?: string;
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
};

const DEFAULT_QUERY_PARAMS: EmployeeQueryParameters = {
  sort: "id",
  limit: LIMIT,
  offset: 0,
  role: "employee",
};

function buildQueryParams(overrides: EmployeeQueryParameters): string {
  const params = { ...DEFAULT_QUERY_PARAMS, ...overrides };
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)]);
  return new URLSearchParams(entries).toString();
}

async function getEmployees(
  params: EmployeeQueryParameters = {},
): Promise<User[]> {
  if (!BACKEND_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  const url = `${BACKEND_URL}/api/v1/users?${buildQueryParams(params)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Response not OK:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

// ========== HOOKS ==========

function useEmployeesList() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEmployees = useCallback(
    async (search: string = "", resetOffset: boolean = true) => {
      const currentOffset = resetOffset ? 0 : offset;

      setLoading(resetOffset);
      if (!resetOffset) setLoadingMore(true);
      setError(null);

      try {
        const params = {
          limit: LIMIT,
          offset: currentOffset,
          sort: "id",
          role: "employee",
          ...(search.trim() && { search: search.trim() }),
        };

        const newEmployees = await getEmployees(params);

        if (!newEmployees || newEmployees.length === 0) {
          setHasMore(false);
          if (resetOffset) setEmployees([]);
        } else {
          if (resetOffset) {
            setEmployees(newEmployees);
            setOffset(LIMIT);
            setTotalLoaded(newEmployees.length);
          } else {
            setEmployees((prev) => [...prev, ...newEmployees]);
            setOffset((prev) => prev + newEmployees.length);
            setTotalLoaded((prev) => prev + newEmployees.length);
          }
          setHasMore(newEmployees.length >= LIMIT);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsSearching(false);
      }
    },
    [offset],
  );

  const search = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setIsSearching(true);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setOffset(0);
        setHasMore(true);
        setTotalLoaded(0);
        fetchEmployees(value, true);
      }, 500);
    },
    [fetchEmployees],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setOffset(0);
    setHasMore(true);
    setTotalLoaded(0);
    fetchEmployees("", true);
  }, [fetchEmployees]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;
    await fetchEmployees(searchTerm, false);
  }, [loadingMore, hasMore, isSearching, searchTerm, fetchEmployees]);

  const retry = useCallback(() => {
    fetchEmployees(searchTerm, true);
  }, [fetchEmployees, searchTerm]);

  useEffect(() => {
    fetchEmployees("", true);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return {
    employees,
    loading,
    loadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    loadMore,
    retry,
  };
}

// ========== COMPONENTS ==========

function BouncingDots() {
  return (
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search employees by name or email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: boolean }) {
  return status ? (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
      Active
    </span>
  ) : (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
      Inactive
    </span>
  );
}

function EmployeeRow({ employee }: { employee: User }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={employee.profilepicture}
            alt={`${employee.firstname} ${employee.lastname}`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          {employee.id}
        </div>
      </TableCell>
      <TableCell>{employee.firstname}</TableCell>
      <TableCell>{employee.lastname}</TableCell>
      <TableCell>{employee.email}</TableCell>
      <TableCell>{employee.role}</TableCell>
      <TableCell>
        <StatusBadge status={employee.status} />
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`/admin/employees/edit/${employee.id}`}
            className="inline-flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </a>
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ========== MAIN PAGE ==========

export default function EmployeesPage() {
  const {
    employees,
    loading,
    loadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    loadMore,
    retry,
  } = useEmployeesList();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Employees
        </h1>
      </div>

      <SearchBar value={searchTerm} onChange={search} onClear={clearSearch} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={retry}
            className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <BouncingDots />
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? "No employees found matching your search"
              : "No employees found"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <EmployeeRow key={employee.id} employee={employee} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            {loadingMore ? (
              <div className="flex justify-center items-center py-4">
                <BouncingDots />
              </div>
            ) : hasMore ? (
              <button
                onClick={loadMore}
                disabled={loadingMore || isSearching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Load More Employees
              </button>
            ) : (
              <p className="text-gray-400 text-sm">
                ✨ Showing all {totalLoaded} employees
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
