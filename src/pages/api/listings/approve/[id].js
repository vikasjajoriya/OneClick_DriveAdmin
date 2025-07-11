import { logAction } from "@/data/auditLogs";
import { mockListings } from "@/data/mockListings";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  } 

  // console.log("req",req.query);
  const { id } = req.query;

  const listing = mockListings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  listing.status = "approved";

  logAction("AdminUser", "approved", id);
  return res.status(200).json({ message: "Listing approved", listing });
}
