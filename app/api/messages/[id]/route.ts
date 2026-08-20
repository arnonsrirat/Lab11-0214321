import { getMessageById } from '@/lib/messageService';
import { editMessage } from '@/lib/messageService';
import { removeMessage } from '@/lib/messageService';


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const message = await getMessageById(id);
    if (!message) {
        return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 });
    }
    return Response.json({ message });
}


export async function PATCH(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 const { id } = await params;
 const updates = await request.json();
 const updated = await editMessage(id, updates);
 if (!updated) {
 return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 });
 }
 return Response.json({ ok: true, item: updated });
}


export async function DELETE(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 const { id } = await params;
 const deleted = removeMessage(id);
 if (!deleted) {
 return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 });
 }
 return Response.json({ ok: true }, { status: 200 });
}