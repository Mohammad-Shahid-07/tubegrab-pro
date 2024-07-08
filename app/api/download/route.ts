import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();
  console.log("Received URL:", url);
  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  const decodedUrl = decodeURIComponent(url);
  try {
    // Check if the URL is valid
    const validUrl = new URL(decodedUrl);

    // Return a redirect response
    return NextResponse.redirect(validUrl.href, 302);
  } catch (error: any) {
    console.error("Error processing URL:", error.message);
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}
