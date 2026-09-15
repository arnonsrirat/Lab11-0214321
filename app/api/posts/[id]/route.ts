import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost, validatePostFields } from "@/lib/posts";
import { getSessionUserId } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

// Controller: GET /api/posts/[id] - ดึงบทความที่สมาชิกสร้างเอง (ใช้แสดงหน้ารายละเอียด/แก้ไข)
export async function GET(request: Request, { params }: Ctx) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

// Controller: PATCH /api/posts/[id] - แก้ไขบทความ (เฉพาะเจ้าของบทความเท่านั้น)
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;

  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    return NextResponse.json(
      { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนแก้ไขบทความ" },
      { status: 401 }
    );
  }

  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 });
  }

  if (post.authorId !== sessionUserId) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์แก้ไขบทความนี้" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { title, category, author, content } = body;

    const errors = validatePostFields({ title, category, author, content });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้องตามเงื่อนไข", details: errors },
        { status: 400 }
      );
    }

    const updated = updatePost(id, {
      title: title.trim(),
      category: category.trim(),
      author: author.trim(),
      content: content.trim(),
    });

    return NextResponse.json({ message: "แก้ไขบทความสำเร็จ", post: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

// Controller: DELETE /api/posts/[id] - ลบบทความ (เฉพาะเจ้าของบทความเท่านั้น)
export async function DELETE(request: Request, { params }: Ctx) {
  const { id } = await params;

  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    return NextResponse.json(
      { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนลบบทความ" },
      { status: 401 }
    );
  }

  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 });
  }

  if (post.authorId !== sessionUserId) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์ลบบทความนี้" },
      { status: 403 }
    );
  }

  deletePost(id);
  return NextResponse.json({ ok: true }, { status: 200 });
}
