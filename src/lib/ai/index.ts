// طبقة AI متعددة المحركات
// الأولوية: Ollama (محلي) → OpenAI (سحابي) → Mock (احتياطي)

type Engine = 'ollama' | 'openai' | 'mock';

function pickEngine(): Engine {
  const forced = process.env.AI_ENGINE as Engine | undefined;
  if (forced && ['ollama', 'openai', 'mock'].includes(forced)) return forced;

  if (process.env.USE_AI_MOCK === 'true') return 'mock';
  if (process.env.OLLAMA_URL || process.env.OLLAMA_MODEL) return 'ollama';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'mock';
}

const ENGINE = pickEngine();
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:14b';

export type ThreeLines = {
  line1: string;
  line2: string;
  line3: string;
};

export type AIDeepenResult = {
  paragraphs: string[];
};

// ============= المنطق العام =============

export async function summarizeToThreeLines(rawText: string, hint?: string): Promise<ThreeLines> {
  const prompt = `أنت محرر أخبار محترف في صحيفة "سطر". لخّص الخبر التالي في 3 أسطر فقط:
- السطر 1 (15-20 كلمة): الحدث - ماذا حدث، من، أين، متى
- السطر 2 (15-20 كلمة): السياق - لماذا الآن، خلفية، رابط بأحداث سابقة
- السطر 3 (10-15 كلمة): المعنى - التأثير، الدلالة، ماذا يعني للقارئ

أعد JSON فقط بهذا الشكل (بدون أي شرح): {"line1":"...","line2":"...","line3":"..."}

الخبر:
${rawText}${hint ? `\n\nملاحظة: ${hint}` : ''}`;

  if (ENGINE === 'mock') return mockSummarize(rawText);
  if (ENGINE === 'ollama') return await ollamaJSON<ThreeLines>(prompt);
  return await openaiJSON<ThreeLines>(prompt);
}

export async function deepenArticle(t: ThreeLines): Promise<AIDeepenResult> {
  const prompt = `لديك خبر مختصر في 3 أسطر:
1. ${t.line1}
2. ${t.line2}
3. ${t.line3}

اكتب فقرتين تشرحان الخبر بتوسع (كل فقرة 60-80 كلمة)، دون إضافة معلومات غير موجودة في الأسطر الثلاثة.
أعد JSON فقط: {"paragraphs":["...","..."]}`;

  if (ENGINE === 'mock') return mockDeepen(t);
  if (ENGINE === 'ollama') return await ollamaJSON<AIDeepenResult>(prompt);
  return await openaiJSON<AIDeepenResult>(prompt);
}

export async function suggestTags(t: ThreeLines): Promise<string[]> {
  const prompt = `استخرج 3 هاشتاقات عربية مناسبة لهذا الخبر (بدون رمز #):
${t.line1}
${t.line2}
${t.line3}

أعد JSON فقط: {"tags":["...","...","..."]}`;

  if (ENGINE === 'mock') return mockTags(t);

  try {
    const data = ENGINE === 'ollama'
      ? await ollamaJSON<{ tags: string[] }>(prompt)
      : await openaiJSON<{ tags: string[] }>(prompt);
    return data.tags || [];
  } catch {
    return mockTags(t);
  }
}

// ============= Ollama Engine =============

async function ollamaJSON<T>(prompt: string): Promise<T> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      format: 'json',
      stream: false,
      options: {
        temperature: 0.4,
        num_predict: 800,
      },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();

  // Ollama يرجع {response: "..."} والـ response هو JSON string
  const content = data.response || '';
  return JSON.parse(content) as T;
}

// ============= OpenAI Engine =============

async function openaiJSON<T>(prompt: string): Promise<T> {
  const { OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const res = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  const content = res.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as T;
}

// ============= Mock Engine =============

function mockSummarize(text: string): ThreeLines {
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
  const stopwords = ['الذي', 'التي', 'هذا', 'هذه', 'ذلك', 'تلك', 'على', 'عن', 'إلى', 'مع', 'من', 'في'];
  const words = t.line1.split(/\s+/).filter(w => w.length > 3 && !stopwords.includes(w));
  return words.slice(0, 3);
}

// ============= Utilities =============

export const isOffline = () => ENGINE === 'mock' || ENGINE === 'ollama';
export const currentEngine = () => ENGINE;
export const currentModel = () => {
  if (ENGINE === 'ollama') return OLLAMA_MODEL;
  if (ENGINE === 'openai') return process.env.OPENAI_MODEL || 'gpt-4o';
  return 'mock';
};
