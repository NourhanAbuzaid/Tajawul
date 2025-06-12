import TripDetails from "@/components/ui/TripDetails";
import { Suspense } from "react";

export default async function TripDetailsPage({ params }) {
  const { tripId } = params;

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TripDetails tripId={tripId} />
      </Suspense>
    </div>
  );
}
