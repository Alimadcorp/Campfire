import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const TIMETABLE_KEY = 'campfire:timetable:tasks'

// GET - Fetch all tasks
export async function GET() {
    try {
        const tasks = await redis.get(TIMETABLE_KEY)
        return NextResponse.json({ tasks: tasks || [] })
    } catch (error) {
        console.error('Redis GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
}

// POST - Save tasks
export async function POST(request) {
    try {
        const { tasks } = await request.json()
        await redis.set(TIMETABLE_KEY, tasks)
        return NextResponse.json({ success: true, tasks })
    } catch (error) {
        console.error('Redis POST error:', error)
        return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 })
    }
}
