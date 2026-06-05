import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;
    const url = new URL(`https://api.themoviedb.org/3/${path.join("/")}`);
    url.searchParams.set("api_key", API_KEY!);
    req.nextUrl.searchParams.forEach((value, key) =>
        url.searchParams.set(key, value),
    );
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data);
}
