import TripsHubClient from "./TripsHubClient";

async function getTrips() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/Trip?Visibility=Triphub`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trips (Status: ${res.status})`);
  }

  return res.json();
}

export default async function TripsHubPage() {
  const initialTrips = await getTrips();
  return <TripsHubClient initialTrips={initialTrips} />;
}