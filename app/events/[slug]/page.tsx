import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = async ({
                                    params,
                                }: {
    params: { slug: string };
}) => {
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetails params={params} />
            </Suspense>
        </main>
    );
};

export default EventDetailsPage;

