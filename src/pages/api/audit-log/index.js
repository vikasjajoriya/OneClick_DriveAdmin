import { getAuditLogs } from "@/data/auditLogs";

export default function handler(req, res) {
  if (req.method === "GET") {
    const logs = getAuditLogs();
    res.status(200).json(logs);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}