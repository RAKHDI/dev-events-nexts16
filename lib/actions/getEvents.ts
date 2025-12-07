'use server';

import { cacheLife } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import {Event} from "@/database/event.model";

export async function getEvents() {
    'use cache';
    cacheLife('hours');

    await connectToDatabase();
    const events = await Event.find().lean();

    return JSON.parse(JSON.stringify(events));
}
