import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addPost, getPosts } from "@/lib/posts";

// Controller: GET /api/posts - ดึงรายการบทความ
export async function GET() {
  return NextResponse.json({ posts: getPosts() });
}

// Controller: POST /api/posts - สร้างบทความใหม่ (พร้อม Server Validation & Auth Check)
export async function POST(request: Request) {
  // 1. Task W.3: Server Authentication Guard
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session || !session.value) {
    return NextResponse.json(
      { error: "เข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบก่อนสร้างบทความ" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, category, author, content } = body;

    // 2. Task W.2: Server-side Validation (อย่างน้อย Field ละ 1 เงื่อนไข)
    const errors: Record<string, string> = {};

    if (!title || typeof title !== "string" || title.trim().length < 5) {
      errors.title = "หัวข้อบทความต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      errors.category = "กรุณาเลือกหมวดหมู่บทความ";
    }

    if (!author || typeof author !== "string" || author.trim() === "") {
      errors.author = "กรุณาระบุชื่อผู้เขียน";
    }

    if (!content || typeof content !== "string" || content.trim().length < 20) {
      errors.content = "เนื้อหาบทความต้องมีความยาวอย่างน้อย 20 ตัวอักษร";
    }

    // หากพบข้อผิดพลาดฝั่ง Server ส่ง HTTP 400 พร้อมข้อความแจ้งเตือน
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้องตามเงื่อนไข", details: errors },
        { status: 400 }
      );
    }

    // 3. Task W.4: เรียกใช้ Model เพื่อบันทึกข้อมูล
    const newPost = addPost({
      title: title.trim(),
      category: category.trim(),
      author: author.trim(),
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
