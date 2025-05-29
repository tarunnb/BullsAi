import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // Simulate AI response for demo purposes
    const responses = [
      "Based on Tata Power's latest financial reports, the company has shown strong growth in renewable energy investments, with a 25% increase in clean energy capacity over the past year.",
      "Tata Power's Q3 FY24 results indicate robust performance with revenue growth of 12% YoY, driven by improved operational efficiency and strategic expansion in renewable energy sectors.",
      "The company's sustainability initiatives include a commitment to achieve net-zero emissions by 2045, with significant investments in solar and wind energy projects across India.",
      "Tata Power's market position remains strong with a diversified portfolio spanning conventional and renewable energy, transmission, and distribution networks across multiple states.",
      "Recent developments show Tata Power's focus on electric vehicle charging infrastructure, with plans to install 10,000 charging points by 2025, positioning the company well for the EV transition.",
    ]

    // Simple response selection based on message content
    let response = responses[Math.floor(Math.random() * responses.length)]

    if (message.toLowerCase().includes("financial") || message.toLowerCase().includes("revenue")) {
      response = responses[1]
    } else if (message.toLowerCase().includes("sustainability") || message.toLowerCase().includes("renewable")) {
      response = responses[2]
    } else if (message.toLowerCase().includes("market") || message.toLowerCase().includes("position")) {
      response = responses[3]
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
