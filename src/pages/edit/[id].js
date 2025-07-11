import { useRouter } from "next/router";
import { useState } from "react";
import { mockListings } from "@/data/mockListings";
import Layout from "@/components/Layout";

export default function EditPage({ listing }) {
  const router = useRouter();
  const [form, setForm] = useState(listing);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`/api/listings/edit/${form.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard");
  };

  // console.log("Listing updated:", form);

  return (
    <Layout>
      <form onSubmit={handleSave} className="max-w-xl mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <div className="flex justify-end gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            Save
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

export async function getServerSideProps(context) {
  const { id } = context.params;
  const listing = mockListings.find((l) => l.id === id) || null;
  if (!listing) return { notFound: true };
  return { props: { listing } };
}
