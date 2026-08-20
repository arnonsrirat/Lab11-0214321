import { createBookmark, listBookmarks } from "@/lib/bookmarkService";
import { withErrorHandling } from "@/lib/withErrorHandling";

export const GET = withErrorHandling(async () => {
  const bookmarks = await listBookmarks();
  return Response.json({ bookmarks });
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const saved = await createBookmark(body);
  return Response.json({ ok: true, item: saved }, { status: 201 });
});
