import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get("area")
    const type = searchParams.get("type")
    const minBudget = searchParams.get("minBudget")
    const maxBudget = searchParams.get("maxBudget")
    const gender = searchParams.get("gender")

    const where: any = {}

    if (area) where.area = area
    if (type) where.type = type
    if (minBudget) where.budget = { ...where.budget, gte: parseInt(minBudget) }
    if (maxBudget) where.budget = { ...where.budget, lte: parseInt(maxBudget) }
    if (gender) where.gender = gender

    const ads = await getPrisma().ad.findMany({
      where,
      include: {
        user: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, description, location, area, budget, gender, smoker, jobType, images } = body

    const ad = await getPrisma().ad.create({
      data: {
        type,
        title,
        description,
        location,
        area,
        budget,
        gender,
        smoker: smoker === "true" ? true : smoker === "false" ? false : null,
        jobType,
        images,
      }
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}