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
    const smoker = searchParams.get("smoker")
    const jobType = searchParams.get("jobType")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "newest"

    const where: any = {}

    if (area) where.area = area
    if (type) where.type = type
    if (minBudget) where.budget = { ...where.budget, gte: parseInt(minBudget) }
    if (maxBudget) where.budget = { ...where.budget, lte: parseInt(maxBudget) }
    if (gender) where.gender = gender
    if (smoker) where.smoker = smoker === "true" ? true : smoker === "false" ? false : undefined
    if (jobType) where.jobType = jobType

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    let orderBy: any = { createdAt: "desc" }
    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "price-low":
        orderBy = { budget: "asc" }
        break
      case "price-high":
        orderBy = { budget: "desc" }
        break
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    const ads = await getPrisma().ad.findMany({
      where,
      include: {
        user: {
          select: { name: true, phone: true }
        }
      },
      orderBy
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