import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addComment, getCommentsByPostId } from "@/lib/comments";

// Controller: GET /api/comments?postId=... - ดึงรายการความคิดเห็นตาม postId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ comments: [] });
  }

  return NextResponse.json({ comments: getCommentsByPostId(postId) });
}

// Controller: POST /api/comments - เพิ่มความคิดเห็นใหม่ (Server Validation + Auth Guard)
export async function POST(request: Request) {
  // 1. Task W.3: Server Authentication Guard (ตรวจสอบ Session Cookie)
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session || !session.value) {
    return NextResponse.json(
      { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { postId, author, rating, comment } = body;

    // 2. Task W.2: Server-side Validation (อย่างน้อย Field ละ 1 เงื่อนไข)
    const errors: Record<string, string> = {};

    if (!postId || typeof postId !== "string" || postId.trim() === "") {
      errors.postId = "ไม่พบ ID ของบทความที่ต้องการแสดงความคิดเห็น";
    }

    if (!author || typeof author !== "string" || author.trim().length < 2) {
      errors.author = "ชื่อผู้แสดงความคิดเห็นต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      errors.rating = "คะแนนประเมินต้องเป็นตัวเลขระหว่าง 1 ถึง 5 ดาว";
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      errors.comment = "ข้อความความคิดเห็นต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
    }

    // หากพบข้อมูลไม่ผ่านเงื่อนไข ส่ง HTTP 400
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้องตามเงื่อนไข", details: errors },
        { status: 400 }
      );
    }

    // 3. Task W.4: เรียกใช้ Model (lib/comments.ts) เพื่อบันทึกข้อมูล
    const newComment = addComment({
      postId: String(postId).trim(),
      author: author.trim(),
      rating: numRating,
      comment: comment.trim(),
    });

    return NextResponse.json(
      { message: "เพิ่มความคิดเห็นสำเร็จ", comment: newComment },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
