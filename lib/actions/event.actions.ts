'use server';

import {connectToDatabase} from "@/lib/mongodb";
import {Event} from "@/database/event.model";   // ✅ FIXED IMPORT

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug });
        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean();

        return similarEvents;
    } catch (error) {
        console.error("Error fetching similar events:", error);
        return [];
    }
};
