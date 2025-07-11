import { logAction } from "@/data/auditLogs";
import { mockListings } from "@/data/mockListings";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("req.body",req.body);
  
  const { title, description, status } = req.body;
  const newListing = {
    id: (mockListings.length + 1).toString(),
    title,
    description,
    status,
  };
  mockListings.push(newListing);
  logAction("AdminUser", "added", newListing.id);
  res.status(201).json({ message: "Listing added", listing: newListing });
}
