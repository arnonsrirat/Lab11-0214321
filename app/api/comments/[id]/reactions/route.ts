import { NextResponse } from "next/server";
import { reactToComment, type CommentReaction } from "@/lib/comments";

type Context = { params: Promise<{ id: string }> };

const allowedReactions = new Set<CommentReaction>(["like", "heart"]);

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as { reaction?: string } | null;
  const reaction = body?.reaction;

  if (!reaction || !allowedReactions.has(reaction as CommentReaction)) {
    return NextResponse.json(
      { error: "reaction must be like or heart" },
      { status: 400 },
    );
  }

  const comment = reactToComment(id, reaction as CommentReaction);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json({ comment, reactions: comment.reactions });
}
