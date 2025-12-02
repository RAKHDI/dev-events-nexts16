import React from 'react'
import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, slug, location, time, date }: Props) => {
    // Fallback images
    const posterSrc = image?.trim() || "/images/default-event.jpg";
    const pinIcon = "/icons/pin.svg";
    const calendarIcon = "/icons/calendar.svg";
    const clockIcon = "/icons/clock.svg";

    // Fallback alt text
    const posterAlt = title?.trim() || "Event poster";

    return (
        <Link href={`/events/${slug}`} id="event-card">
            {/* Main poster */}
            {posterSrc && (
                <Image
                    src={posterSrc}
                    alt={posterAlt} // always non-empty
                    width={410}
                    height={300}
                    className="poster"
                />
            )}

            {/* Location */}
            <div className="flex flex-row gap-2">
                {pinIcon && (
                    <Image src={pinIcon} alt="Location icon" width={14} height={14} />
                )}
                <p>{location}</p>
            </div>

            {/* Title */}
            <p className="title">{title || "Untitled Event"}</p>

            {/* Date & Time */}
            <div className="datetime">
                {calendarIcon && (
                    <Image src={calendarIcon} alt="Calendar icon" width={14} height={14} />
                )}
                <p>{date}</p>
                {clockIcon && (
                    <Image src={clockIcon} alt="Clock icon" width={14} height={14} />
                )}
                <p>{time}</p>
            </div>
        </Link>
    )
}

export default EventCard;
