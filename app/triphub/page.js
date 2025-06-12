import TripsHubClient from "./TripsHubClient";

async function getTrips() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/Trip/tripHub`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trips (Status: ${res.status})`);
  }

  return res.json();
}

export default async function TripsHubPage() {
  try {
    const trips = await getTrips();
    return <TripsHubClient trips={trips} />;
  } catch (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Error loading trips</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}