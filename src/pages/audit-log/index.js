import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { BsDatabaseFillX } from "react-icons/bs";
import { useRouter } from "next/router";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("/api/audit-log");
      const data = await res.json();
      setLogs(data);
    }
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
          <button
            onClick={() => router.push("/dashboard")}
            title="Go Back"
            className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
          >
            Go Back
          </button>
        </div>
        <div className="bg-gray-800 shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Listing ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4 text-sm text-white">
                    {log.listingId}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{log.admin}</td>
                  <td className="px-6 py-4 text-sm text-white">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-white">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="bg-gray-800 shadow-sm rounded-lg min-h-[12rem] flex flex-col items-center justify-center gap-4">
              <BsDatabaseFillX className="text-gray-200 h-16 w-16" />
              <span className="text-white">No Audit Log Found</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
