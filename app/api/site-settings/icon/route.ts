export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

/** GET /api/site-settings/icon
 *  Redirects to the square logo file so it can be used as dynamic favicon
 */
export async function GET() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne().lean() as { logoSquare?: string } | null;
    const url = s?.logoSquare?.split("?")[0]; // strip cache-bust query
    if (url && url.startsWith("/")) {
      return NextResponse.redirect(new URL(url, process.env.NEXTAUTH_URL || "http://localhost:3000"), 302);
    }
  } catch { /* use default */ }
  // No logo set — return 404 so browser uses its default
  return new NextResponse(null, { status: 404 });
}
