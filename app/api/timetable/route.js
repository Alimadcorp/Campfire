import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
    url: process.env.ADMIN_REDIS,
    token: process.env.ADMIN_REDIS_TOKEN,
})

const TIMETABLE_KEY = 'campfire:timetable:tasks'

export async function GET() {
    try {
        const tasks = await redis.get(TIMETABLE_KEY)
        return NextResponse.json({ tasks: tasks || [] })
    } catch (error) {
        console.error('Redis GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
}

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
