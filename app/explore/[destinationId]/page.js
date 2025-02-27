import axios from "axios";
import DestinationDetails from "@/components/ui/DestinationDetails";
import Loading from "@/components/ui/Loading";

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      "http://tajawul.runasp.net/api/Destination"
    );
    const destinations = response.data.destinations || [];

    return destinations.map((destination) => ({
      destinationId: destination.destinationId, // ✅ Creates static pages for these IDs
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty if API fails
  }
}

export default async function DestinationPage({ params }) {
  const { destinationId } = params;

  try {
    const response = await axios.get(
      `http://tajawul.runasp.net/api/Destination?DestinationId=${destinationId}`,
      {
        next: { revalidate: 120 }, // ✅ ISR: Updates every 120 seconds
      }
    );

    const destination = response.data;

    return <DestinationDetails destination={destination} />;
  } catch (error) {
    console.error("Error fetching destination details:", error);
    return <p style={{ color: "red" }}>Failed to load destination.</p>;
  }
}
