import { NextRequest, NextResponse } from 'next/server';
import { summarizeToThreeLines, suggestTags } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { text, hint } = await req.json();

  if (!text || typeof text !== 'string' || text.length < 20) {
    return NextResponse.json({ error: 'النص قصير جداً' }, { status: 400 });
  }

  const summary = await summarizeToThreeLines(text, hint);
  const tags = await suggestTags(summary);

  return NextResponse.json({ ...summary, tags });
}
