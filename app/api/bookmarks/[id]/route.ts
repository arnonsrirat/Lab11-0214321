import { getBookmark, editBookmark, removeBookmark } from "@/lib/bookmarkService";
import { withErrorHandling } from "@/lib/withErrorHandling";

export const GET = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const bookmark = await getBookmark(id);
    if (!bookmark) {
      return Response.json({ error: "ไม่พบบุ๊กมาร์กนี้" }, { status: 404 });
    }
    return Response.json({ bookmark });
  }
);

export const PATCH = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const updates = await request.json();
    const updated = await editBookmark(id, updates);
    if (!updated) {
      return Response.json({ error: "ไม่พบบุ๊กมาร์กนี้" }, { status: 404 });
    }
    return Response.json({ ok: true, item: updated });
  }
);

export const DELETE = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const deleted = await removeBookmark(id);
    if (!deleted) {
      return Response.json({ error: "ไม่พบบุ๊กมาร์กนี้" }, { status: 404 });
    }
    return Response.json({ ok: true }, { status: 200 });
  }
);
