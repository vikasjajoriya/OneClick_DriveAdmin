import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function AddRecord() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/listings/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard");
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold">Add New Listing</h1>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="approved" disabled>
            Approved
          </option>
          <option value="rejected" disabled>
            Rejected
          </option>
        </select>
        <div className="flex justify-end gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            Add Listing
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </form>
    </Layout>
  );
}