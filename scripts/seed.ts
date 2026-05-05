import { db, articles } from '../src/lib/db';

const seedData = [
  {
    line1: 'أرامكو تخفض إنتاجها 500 ألف برميل يومياً حتى نهاية العام.',
    line2: 'الثالث منذ 2024، رد على ضعف الطلب الصيني وتباطؤ النمو العالمي.',
    line3: 'أسعار النفط ترتفع، والسوق السعودي يتأثر إيجاباً على المدى القصير.',
    category: 'economy' as const,
    tags: ['أرامكو', 'النفط', 'الاقتصاد'],
    source: 'بيان رسمي',
    sourceTrust: 'official' as const,
    isBreaking: true,
    isFeatured: true,
    status: 'published' as const,
    publishedAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
  },
  {
    line1: 'الهلال يتأهل لنهائي دوري أبطال آسيا بعد فوزه على غريمه الياباني.',
    line2: 'أول وصول للنهائي منذ 2022، بقيادة المدرب الجديد ونجوم الصفقات الأخيرة.',
    line3: 'النهائي السبت في الرياض، وآمال جماهير الزعيم بلقب قاري جديد.',
    category: 'sport' as const,
    tags: ['الهلال', 'دوري_أبطال_آسيا', 'كرة_القدم'],
    source: 'الاتحاد الآسيوي',
    sourceTrust: 'official' as const,
    isFeatured: true,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 30),
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  },
  {
    line1: 'إطلاق مبادرة "صنع في السعودية" بتمويل 10 مليار ريال لدعم المصنعين المحليين.',
    line2: 'ضمن رؤية 2030، تستهدف رفع نسبة المنتج المحلي في القطاع الحكومي إلى 60٪.',
    line3: 'فرص استثمارية للشركات الناشئة، ومنافسة أكبر للموردين الأجانب.',
    category: 'local' as const,
    tags: ['رؤية_2030', 'الصناعة', 'الاستثمار'],
    source: 'وزارة الصناعة',
    sourceTrust: 'official' as const,
    isFeatured: true,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60),
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
  },
  {
    line1: 'OpenAI تطلق نموذج GPT-5 بقدرات استدلال متقدمة وتكلفة أقل بنسبة 40٪.',
    line2: 'أول إطلاق رئيسي منذ GPT-4o، وسط منافسة شرسة من Google و Anthropic.',
    line3: 'تأثير مباشر على شركات الذكاء الاصطناعي العربية والمطورين المحليين.',
    category: 'tech' as const,
    tags: ['OpenAI', 'الذكاء_الاصطناعي', 'GPT5'],
    source: 'OpenAI Blog',
    sourceTrust: 'partner' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  },
  {
    line1: 'انطلاق موسم الرياض 2026 بعروض عالمية وميزانية تتجاوز 4 مليار ريال.',
    line2: 'الإصدار الخامس بعد نجاح غير مسبوق العام الماضي، يستهدف 30 مليون زائر.',
    line3: 'تنشيط للقطاع السياحي ومضاعفة فرص العمل الموسمية في العاصمة.',
    category: 'culture' as const,
    tags: ['موسم_الرياض', 'الترفيه', 'السياحة'],
    source: 'الهيئة العامة للترفيه',
    sourceTrust: 'official' as const,
    isFeatured: true,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
    imageUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=800',
  },
  {
    line1: 'الفيدرالي الأمريكي يخفض الفائدة 25 نقطة أساس في اجتماع نوفمبر.',
    line2: 'الخفض الثاني هذا العام، استجابة لتراجع التضخم وضعف سوق العمل.',
    line3: 'انعكاس مباشر على ساما والريال، وفرص أفضل للمقترضين السعوديين.',
    category: 'world' as const,
    tags: ['الفيدرالي', 'الفائدة', 'الأسواق_العالمية'],
    source: 'رويترز',
    sourceTrust: 'agency' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 180),
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  },
  {
    line1: 'افتتاح خط المترو الأخضر في الرياض رسمياً بعد سنوات من الانتظار.',
    line2: 'يربط 15 محطة من شمال العاصمة لجنوبها، ويخدم مليون راكب يومياً.',
    line3: 'تخفيف كبير لزحمة المرور، وقفزة في جودة حياة سكان الرياض.',
    category: 'local' as const,
    tags: ['مترو_الرياض', 'النقل', 'العاصمة'],
    source: 'الهيئة الملكية لمدينة الرياض',
    sourceTrust: 'official' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 240),
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
  },
  {
    line1: 'Apple تكشف عن iPhone 17 Pro بشاشة قابلة للطي وكاميرا 200 ميجابكسل.',
    line2: 'أول هاتف قابل للطي من آبل بعد 5 سنوات من تطوير الفكرة سراً.',
    line3: 'منافسة أقوى لسامسونغ، وأسعار قد تتجاوز 8 آلاف ريال في السوق المحلي.',
    category: 'tech' as const,
    tags: ['آبل', 'iPhone', 'الهواتف_الذكية'],
    source: 'Apple Newsroom',
    sourceTrust: 'official' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 300),
    imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800',
  },
  {
    line1: 'مهرجان الجنادرية يعود بحلة جديدة ومشاركة 25 دولة عربية وعالمية.',
    line2: 'بعد توقف 4 سنوات، عودة مدروسة بمحتوى ثقافي وفعاليات حديثة.',
    line3: 'فرصة للأسر السعودية وانتعاش للحرفيين والصناعات اليدوية المحلية.',
    category: 'culture' as const,
    tags: ['الجنادرية', 'التراث', 'الثقافة'],
    source: 'وزارة الثقافة',
    sourceTrust: 'official' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 360),
    imageUrl: 'https://images.unsplash.com/photo-1587979931877-ee8b65a4500a?w=800',
  },
  {
    line1: 'النصر يضم نجماً برازيلياً جديداً بصفقة قياسية تتجاوز 80 مليون يورو.',
    line2: 'أكبر صفقة في تاريخ النادي، ضمن خطة استقطاب نجوم لمنافسة قوية.',
    line3: 'دفعة قوية لطموحات النصر، وتعزيز لجاذبية الدوري السعودي عالمياً.',
    category: 'sport' as const,
    tags: ['النصر', 'الانتقالات', 'الدوري_السعودي'],
    source: 'النادي الرسمي',
    sourceTrust: 'official' as const,
    isFeatured: false,
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 420),
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
  },
];

async function seed() {
  console.log('🌱 بدء البذر...');

  // مسح القديم (اختياري)
  // await db.delete(articles);

  for (const item of seedData) {
    await db.insert(articles).values(item);
    console.log(`✅ ${item.line1.slice(0, 50)}...`);
  }

  console.log(`\n✨ تم إدخال ${seedData.length} خبر بنجاح`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ خطأ:', err);
  process.exit(1);
});
