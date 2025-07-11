
import { logAction } from "@/data/auditLogs";
import { mockListings } from "@/data/mockListings";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  const listing = mockListings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  listing.status = "rejected";

  logAction("AdminUser", "rejected", id); 

  return res.status(200).json({ message: "Listing rejected", listing });
}
