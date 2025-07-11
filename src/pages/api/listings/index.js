import { mockListings } from "@/data/mockListings";

export default function handler(req, res) {
  res.status(200).json(mockListings);
}
// This API handler responds with a list of mock listings when accessed.