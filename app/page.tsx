import React from 'react';
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/actions/getEvents";

interface IEvent {
    _id: string;
    title: string;
    slug: string;
    image: string;
    location: string;
    date: string;
    time: string;
}

const Page = async () => {
    const events: IEvent[] = await getEvents();

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br /> Event You Can't Miss
            </h1>

            <p className="text-center mt-5">
                Hackathons, Meetups, and Conferences, All in One Place
            </p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <li key={event._id} className="list-none">
                                <EventCard {...event} />
                            </li>
                        ))
                    ) : (
                        <p className="text-center mt-10">No events found.</p>
                    )}
                </ul>
            </div>
        </section>
    );
};

export default Page;
