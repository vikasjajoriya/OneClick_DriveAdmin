import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { IoCloseCircleSharp, IoCheckmarkCircle } from "react-icons/io5";
import { MdEditLocationAlt } from "react-icons/md";
import { BsDatabaseFillX } from "react-icons/bs";

export async function getServerSideProps(context) {
  const auth = context.req.cookies?.auth === "true";

  if (!auth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/listings`);
    if (!res.ok) throw new Error("Failed to fetch listings");
    const listings = await res.json();

    return { props: { listings } };
  } catch (error) {
    console.error("Fetch error:", error);
    return { props: { listings: [] } };
  }
}


export default function Dashboard({ listings }) {
  const router = useRouter();
  // console.log("Listings fetched:", listings);

  const { logout } = useAuth();
  const [data, setData] = useState(listings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((fresh) => setData(fresh));
  }, []);

  const handleAction = async (id, action) => {
    await fetch(`/api/listings/${action}/${id}`, { method: "POST" });
    const updated = data.map((item) =>
      item.id === id
        ? { ...item, status: action === "approve" ? "approved" : "rejected" }
        : item
    );
    setData(updated);
  };

  // Filtered and searched data
  const filteredData = data.filter((listing) => {
    const matchesStatus = status === "all" || listing.status === status;
    const matchesSearch =
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="p-8">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Listing Dashboard</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push("/audit-log")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Audit Logs
              </button>
              <button
                onClick={() => router.push("/add")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                New Record
              </button>
            </div>
          </div>
          <div className="flex justify-end mb-4 gap-2 mt-2">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">Filter by status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="bg-gray-800 shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((listing) => (
                  <tr key={listing.id} className="border-t">
                    <td className="px-6 py-4 text-sm text-white">
                      {listing.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {listing.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          listing.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : listing.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {listing.status === "approved"
                          ? "Approved"
                          : listing.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white space-x-2 text-center">
                      <button
                        onClick={() => handleAction(listing.id, "approve")}
                        className="text-green-600 cursor-pointer"
                        title="Mark as Approved"
                        disabled={listing.status === "approved"}
                      >
                        <IoCheckmarkCircle
                          className={`text-green-600 ${listing.status === "approved" ? "opacity-50" : ""}`}
                          size={25}
                        />
                      </button>
                      <button
                        onClick={() => handleAction(listing.id, "reject")}
                        className="text-red-600 cursor-pointer"
                        title="Mark as Rejected"
                        disabled={listing.status === "rejected"}
                      >
                        <IoCloseCircleSharp
                          className={`text-red-600 ${listing.status === "rejected" ? "opacity-50" : ""}`}
                          size={25}
                        />
                      </button>
                      <button
                        onClick={() => router.push(`/edit/${listing.id}`)}
                        className="text-blue-900 cursor-pointer"
                        title="Update data"
                      >
                        <MdEditLocationAlt className="text-blue-600" size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="bg-gray-800 shadow-sm rounded-lg min-h-[12rem] flex flex-col items-center justify-center gap-4">
                <BsDatabaseFillX className="text-gray-200 h-16 w-16" />
                <span className="text-white">No Record Found</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
