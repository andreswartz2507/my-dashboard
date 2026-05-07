"use client";

import { DataTable, Column } from "@/components/DataTable";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

const data: User[] = [
  { name: "Alice Martin", email: "alice@example.com", role: "Admin", status: "Active", joined: "2024-01-15" },
  { name: "Bob Chen", email: "bob@example.com", role: "Editor", status: "Active", joined: "2024-02-20" },
  { name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive", joined: "2024-03-05" },
  { name: "David Kim", email: "david@example.com", role: "Editor", status: "Active", joined: "2024-03-18" },
  { name: "Eva Rossi", email: "eva@example.com", role: "Admin", status: "Active", joined: "2024-04-02" },
  { name: "Frank Müller", email: "frank@example.com", role: "Viewer", status: "Inactive", joined: "2024-04-11" },
  { name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active", joined: "2024-05-07" },
];

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
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Data</h1>
      <p className="text-sm text-slate-500 mb-8">Browse and search your records.</p>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
