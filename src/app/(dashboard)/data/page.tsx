"use client";

import { useEffect, useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

const columns: Column<User>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          value === "Active"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {String(value ?? "")}
      </span>
    ),
  },
  { key: "joined", header: "Joined" },
];

export default function DataPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const { data: users, error } = await supabase
        .from("users")
        .select("id, name, email, role, status, joined")
        .order("joined", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setData(users ?? []);
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Data</h1>
      <p className="text-sm text-slate-500 mb-8">Browse and search your records.</p>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading…
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Failed to load data: {error}
        </div>
      )}

      {!loading && !error && <DataTable data={data} columns={columns} />}
    </div>
  );
}
