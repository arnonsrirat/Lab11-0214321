import { NextResponse } from "next/server";
import { addPost, getPosts, validatePostFields } from "@/lib/posts";
import { getSessionUserId } from "@/lib/session";

// Controller: GET /api/posts - ดึงรายการบทความ
export async function GET() {
  return NextResponse.json({ posts: getPosts() });
}

// Controller: POST /api/posts - สร้างบทความใหม่ (พร้อม Server Validation & Auth Check)
export async function POST(request: Request) {
  // 1. Task W.3: Server Authentication Guard
  const sessionUserId = await getSessionUserId();

  if (!sessionUserId) {
    return NextResponse.json(
      { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนสร้างบทความ" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, category, author, content } = body;

    // 2. Task W.2: Server-side Validation (อย่างน้อย Field ละ 1 เงื่อนไข)
    const errors = validatePostFields({ title, category, author, content });

    // หากพบข้อผิดพลาดฝั่ง Server ส่ง HTTP 400 พร้อมข้อความแจ้งเตือน
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้องตามเงื่อนไข", details: errors },
        { status: 400 }
      );
    }

    // 3. Task W.4: เรียกใช้ Model เพื่อบันทึกข้อมูล (ผูก authorId กับเจ้าของบทความจาก session)
    const newPost = addPost({
      title: title.trim(),
      category: category.trim(),
      author: author.trim(),
      authorId: sessionUserId,
      content: content.trim(),
    });

    return NextResponse.json(
      { message: "สร้างบทความสำเร็จ", post: newPost },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
