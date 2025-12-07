// lib/constants.ts

import {Key} from "react";

export type EventItem = {
    //_id: Key | null | undefined;
    image: string;
    title: string;
    description: string;
    slug: string;
    date: string;
    time: string;
    id?: number;
    location: string;
    link: string;
};

export const events: EventItem[] = [
    {
        id: 1,
        slug: "react-Rakhdi-2025",
        title: "React rakhdi 2025",
        date: "2025-06-12",
        time: "09:00 AM - 05:00 PM",
        location: "Amsterdam, Netherlands",
        description:
            "The world's largest React conference bringing together front-end developers, React enthusiasts, and industry experts for talks, workshops, and networking.",
        image: "/images/event1.png",
        link: "https://reactsummit.com/",
    },
    {
        id: 2,
        slug: "google-io-2025",
        title: "Google I/O 2025",
        date: "2025-05-14",
        time: "10:00 AM - 04:00 PM",
        location: "Mountain View, California, USA",
        description:
            "Google’s annual developer conference where engineers and developers gather to explore the latest innovations in Android, AI, and cloud technologies.",
        image: "/images/event2.png",
        link: "https://io.google/",
    },
    {
        id: 3,
        slug: "hackmit-2025",
        title: "HackMIT 2025",
        date: "2025-09-20",
        time: "08:00 AM - 08:00 PM",
        location: "Cambridge, Massachusetts, USA",
        description:
            "One of the most prestigious hackathons organized by MIT. Join thousands of students to build, code, and innovate for 24 hours straight.",
        image: "/images/event3.png",
        link: "https://hackmit.org/",
    },
    {
        id: 4,
        slug: "aws-reinvent-2025",
        title: "AWS re:Invent 2025",
        date: "2025-11-30",
        time: "09:00 AM - 06:00 PM",
        location: "Las Vegas, Nevada, USA",
        description:
            "Amazon Web Services’ flagship conference with sessions, keynotes, and networking opportunities focused on cloud computing and infrastructure.",
        image: "/images/event4.png",
        link: "https://reinvent.awsevents.com/",
    },
    {
        id: 5,
        slug: "jsconf-asia-2025",
        title: "JSConf Asia 2025",
        date: "2025-07-18",
        time: "09:30 AM - 05:30 PM",
        location: "Singapore",
        description:
            "A community-driven JavaScript conference featuring international speakers, innovative sessions, and a strong focus on web development trends.",
        image: "/images/event5.png",
        link: "https://jsconf.asia/",
    },
    {
        id: 6,
        slug: "devfest-india-2025",
        title: "DevFest India 2025",
        date: "2025-10-05",
        time: "10:00 AM - 05:00 PM",
        location: "Bangalore, India",
        description:
            "Google Developer Groups across India come together for DevFest — a celebration of technology, learning, and community building.",
        image: "/images/event6.png",
        link: "https://devfestindia.com/",
    },
];
