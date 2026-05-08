"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  status: Status;
  created_at: string;
}

const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_STYLES: Record<Status, string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Initial fetch
    supabase
      .from("tasks")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTasks(data ?? []);
        setLoading(false);
      });

    // Realtime subscription
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const task = payload.new as Task;
            setTasks((prev) =>
              prev.some((t) => t.id === task.id) ? prev : [task, ...prev]
            );
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Task;
            setTasks((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setTasks((prev) => prev.filter((t) => t.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      status: "todo",
      user_id: user!.id,
    });

    if (error) setError(error.message);
    else setTitle("");
    setAdding(false);
  }

  async function handleStatusChange(id: string, status: Status) {
    // Optimistic update — Realtime will confirm
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await supabase.from("tasks").update({ status }).eq("id", id);
  }

  async function handleDelete(id: string) {
    // Optimistic update — Realtime will confirm
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-8">Manage your personal task list.</p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title…"
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={adding || !title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition-colors"
        >
          {adding ? "Adding…" : "Add task"}
        </button>
      </form>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading…
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          No tasks yet. Add one above.
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm"
            >
              <span className="flex-1 text-sm text-slate-800">{task.title}</span>

              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${STATUS_STYLES[task.status]}`}
              >
                {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>

              <button
                onClick={() => handleDelete(task.id)}
                className="text-slate-300 hover:text-red-400 transition-colors ml-1"
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-slate-400">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
