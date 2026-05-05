// طبقة AI تشتغل أوفلاين بـ mock لما USE_AI_MOCK=true

const USE_MOCK = process.env.USE_AI_MOCK === 'true' || !process.env.OPENAI_API_KEY;

export type ThreeLines = {
  line1: string; // الحدث
  line2: string; // السياق
  line3: string; // المعنى
};

export type AIDeepenResult = {
  paragraphs: string[];
};

// تلخيص خبر طويل لـ 3 أسطر
export async function summarizeToThreeLines(rawText: string, hint?: string): Promise<ThreeLines> {
  if (USE_MOCK) {
    return mockSummarize(rawText, hint);
  }

  const { OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `أنت محرر أخبار محترف في صحيفة "سطر". مهمتك تلخيص الخبر التالي في 3 أسطر فقط:
- السطر 1 (15-20 كلمة): الحدث - ماذا حدث، من، أين، متى
- السطر 2 (15-20 كلمة): السياق - لماذا الآن، خلفية، رابط بأحداث سابقة
- السطر 3 (10-15 كلمة): المعنى - التأثير، الدلالة، ماذا يعني للقارئ

أعد JSON فقط بهذا الشكل: {"line1":"...","line2":"...","line3":"..."}

الخبر:
${rawText}

${hint ? `\nملاحظة: ${hint}` : ''}`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  const content = res.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as ThreeLines;
}

// AI Deepen — توسيع الخبر لفقرتين
export async function deepenArticle(threeLines: ThreeLines): Promise<AIDeepenResult> {
  if (USE_MOCK) {
    return mockDeepen(threeLines);
  }

  const { OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `لديك خبر مختصر في 3 أسطر:
1. ${threeLines.line1}
2. ${threeLines.line2}
3. ${threeLines.line3}

اكتب فقرتين تشرحان الخبر بتوسع (كل فقرة 60-80 كلمة)، دون إضافة معلومات غير موجودة. أعد JSON: {"paragraphs":["...","..."]}`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });

  const content = res.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as AIDeepenResult;
}

// اقتراح هاشتاقات
export async function suggestTags(threeLines: ThreeLines): Promise<string[]> {
  if (USE_MOCK) {
    return mockTags(threeLines);
  }

  const { OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `استخرج 3 هاشتاقات عربية مناسبة لهذا الخبر (بدون #):
${threeLines.line1}
${threeLines.line2}
${threeLines.line3}

أعد JSON: {"tags":["...","...","..."]}`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  const data = JSON.parse(res.choices[0]?.message?.content || '{"tags":[]}');
  return data.tags || [];
}

// ============= MOCKS (للأوفلاين) =============

function mockSummarize(text: string, hint?: string): ThreeLines {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  const words = trimmed.split(' ');
  const head = words.slice(0, 18).join(' ');
  const mid = words.slice(18, 36).join(' ') || 'السياق يكشف خلفية الحدث وارتباطه بمسار سابق في القطاع نفسه.';
  const tail = words.slice(36, 50).join(' ') || 'الأثر يطال شريحة واسعة من القراء على المدى القريب.';

  return {
    line1: head + (head.endsWith('.') ? '' : '.'),
    line2: mid + (mid.endsWith('.') ? '' : '.'),
    line3: tail + (tail.endsWith('.') ? '' : '.'),
  };
}

function mockDeepen(t: ThreeLines): AIDeepenResult {
  return {
    paragraphs: [
      `${t.line1} ويأتي هذا التطور ضمن سلسلة من المؤشرات التي تابعها المراقبون خلال الأسابيع الأخيرة، وسط ترقب لردود فعل الأطراف المعنية وتحرك الأسواق المحلية والإقليمية للتعامل مع المستجدات الراهنة.`,
      `${t.line2} ${t.line3} ويرى مختصون أن الفترة المقبلة ستكشف الكثير عن مسارات التطبيق والتنفيذ، خاصة مع تشابك العوامل الاقتصادية والسياسية والاجتماعية المحيطة بالقرار.`,
    ],
  };
}

function mockTags(t: ThreeLines): string[] {
  // استخراج كلمات مهمة من السطر الأول
  const words = t.line1.split(/\s+/).filter(w => w.length > 3 && !['الذي', 'التي', 'هذا', 'هذه', 'ذلك', 'تلك'].includes(w));
  return words.slice(0, 3);
}

export const isOffline = () => USE_MOCK;
