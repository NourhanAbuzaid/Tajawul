import DestinationPage from "@/app/components/ui/DestinationPage";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";

export default async function DestinationPage({ params }) {
  const destinationId = params.destinationId;
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DestinationPage destinationId={destinationId} />
      </Suspense>
    </div>
  );
}
