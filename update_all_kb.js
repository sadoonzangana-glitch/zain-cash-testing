const fs = require('fs');
const path = require('path');
const db = require('./database.js');

// Load current stocks article
const currentKb = require('./kb-data.js');
const stocksArticle = currentKb[0];

const fullKbArticles = [
  stocksArticle,
  {
    id: 2,
    title: "دليل بطاقات ماستر كارد وفيزا كارد زين كاش (الطلب، التفعيل، الاسترجاع، والرسوم)",
    category: "البطاقات والماستر كارد",
    icon: "fa-credit-card",
    keywords: "ماستر, ماستركارد, بطاقة, فيزا, mastercard, card, طلب, تفعيل, شراء, استرجاع, refund, الغاء, تجميد, رسوم, atm, سحب كاش, عمولة",
    correctDisp: "Request",
    correctSubDisp: "MasterCard / Visa Services",
    content: `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:20px;">
        <h2 style="margin:0 0 8px 0; color:#00B5E2;">💳 دليل بطاقات ماستر كارد زين كاش الشامل</h2>
        <p style="margin:0; font-size:0.9rem; color:#cbd5e1;">شرح خطوات طلب البطاقة، التفعيل، الشراء الدولي والمحلي، استرجاع الأموال (Refund)، والسحب من أجهزة الصراف الآلي (ATM).</p>
    </div>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">1. خطوات طلب بطاقة ماستر كارد جديدة</h3>
        <ol style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>فتح تطبيق زين كاش وتسجيل الدخول للمحفظة الدائمية الموثقة.</li>
            <li>الضغط على أيقونة <strong>(البطاقات)</strong> من الشاشة الرئيسية للتطبيق.</li>
            <li>اختيار <strong>(طلب بطاقة جديدة)</strong> وتحديد نوع البطاقة المطلوبة (ماستر كارد المحفظة أو فيزا كارد).</li>
            <li>اختيار طريقة الاستلام: إما عبر أقرب وكيل معتمد أو خدمة التوصيل المباشر إلى باب المنزل.</li>
            <li>تأكيد الطلب ودفع رسوم الإصدار من رصيد المحفظة.</li>
        </ol>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">2. تفعيل البطاقة واستخدام الرصيد الموحد</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li><strong>الرصيد الموحد:</strong> بطاقة ماستر كارد زين كاش مرتبطة مباشرة برصيد المحفظة، ولا تحتاج إلى شحن منفصل.</li>
            <li><strong>خطوات التفعيل:</strong> الدخول إلى قسم البطاقات في التطبيق -> اختيار البطاقة المستلمة -> الضغط على (تفعيل البطاقة) -> إدخال آخر 4 أرقام من البطاقة وتعيين الرمز السري الخاص بأجهزة الصراف (ATM PIN).</li>
            <li><strong>التحكم والأمان:</strong> يمكن تجميد البطاقة فوراً أو فك التجميد بضغطة زر واحدة من داخل التطبيق عند الحاجة.</li>
        </ul>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">3. عمليات استرجاع الأموال (Refund) والعمليات المعلقة</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>عند إلغاء عملية شراء من موقع إلكتروني أو متجر، تقوم بوابة الدفع بإرسال إشعار الاسترجاع (Refund).</li>
            <li><strong>مدة الاسترجاع القياسية:</strong> تستغرق عمليات الاسترجاع الدولية من <strong>7 إلى 14 يوم عمل مصرفي</strong> لتظهر في كشف حساب المحفظة تلقائياً.</li>
            <li>في حال عدم نزول المبلغ بعد مرور 14 يوم عمل، يتم رفع تذكرة مالية وتزويد الدعم برقم العملية (ARN - Acquirer Reference Number) وإيصال الإلغاء من المتجر.</li>
        </ul>
    </section>
</div>
`
  },
  {
    id: 3,
    title: "دليل خدمة ويسترن يونيون (Western Union) العالمية عبر زين كاش",
    category: "الحوالات والتحويل الدولي",
    icon: "fa-globe",
    keywords: "ويسترن, ويسترنيونيون, western union, حوالة, استلام, ارسال, خارجي, دولي, mtcn, تعديل اسم, تعليق, معلقة, دولار",
    correctDisp: "Request",
    correctSubDisp: "Western Union",
    content: `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:20px;">
        <h2 style="margin:0 0 8px 0; color:#ffcc00;">🌍 دليل ويسترن يونيون (Western Union) عبر زين كاش</h2>
        <p style="margin:0; font-size:0.9rem; color:#cbd5e1;">استلام وإرسال الحوالات المالية الدولية مباشرة من خلال تطبيق زين كاش بأعلى معايير الأمان والسرعة.</p>
    </div>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">1. خطوات استلام حوالة ويسترن يونيون في المحفظة</h3>
        <ol style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>الدخول إلى تطبيق زين كاش واختيار <strong>(ويسترن يونيون)</strong> من الواجهة الرئيسية.</li>
            <li>اختيار <strong>(استلام حوالة)</strong>.</li>
            <li>إدخال رقم تتبع الحوالة المكون من 10 أرقام (<strong>MTCN</strong> - Money Transfer Control Number).</li>
            <li>إدخال بلد الإرسال والمبلغ المتوقع واسم المرسل.</li>
            <li>الموافقة على التحويل، وسيتم إيداع المبلغ فوراً في رصيد المحفظة بالدينار العراقي وفق سعر الصرف الرسمي المعتمد.</li>
        </ol>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">2. تعديل الاسم ومعالجة الحوالات المعلقة (On Hold)</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li><strong>تطابق الاسم:</strong> يجب أن يطابق اسم المستلم في الحوالة الاسم المسجل في المحفظة الرسمية بنسبة 100%.</li>
            <li><strong>في حال وجود خطأ في اسم المستلم:</strong> يطلب من المرسل مراجعة الفرع أو التطبيق الذي أرسل منه لتعديل اسم المستلم (Name Amendment).</li>
            <li><strong>الحوالة المعلقة للمراجعة الأمنية:</strong> في حال تعليق الحوالة، يتطلب التواصل مع خدمة العملاء للتحقق من بيانات المرسل والمستلم والغرض من التحويل لفك التعليق.</li>
        </ul>
    </section>
</div>
`
  },
  {
    id: 4,
    title: "دليل إعادة تعيين الرمز السري وفك قفل المحفظة (PIN Reset)",
    category: "أمان الحساب والرمز السري",
    icon: "fa-key",
    keywords: "رمز سري, رمز, pin, نسيت, استرجاع, قفل, مقفولة, محاولات خاطئة, نسيان الرمز, تغيير الرمز, فتح المحفظة",
    correctDisp: "Request",
    correctSubDisp: "Reset Wallet PIN",
    content: `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:20px;">
        <h2 style="margin:0 0 8px 0; color:#38bdf8;">🔐 دليل إعادة تعيين الرمز السري وفك قفل المحفظة</h2>
        <p style="margin:0; font-size:0.9rem; color:#cbd5e1;">الإجراءات المعتمدة لإعادة ضبط الرمز السري عند نسيانه أو قفل المحفظة بسبب إدخال رمز خاطئ لـ 3 مرات متتالية.</p>
    </div>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">1. خطوات إعادة التعيين الذاتي عبر التطبيق</h3>
        <ol style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>في شاشة تسجيل الدخول بتطبيق زين كاش، اضغط على <strong>(هل نسيت الرمز السري؟)</strong>.</li>
            <li>إدخال رقم الهاتف المسجل به المحفظة.</li>
            <li>إدخال رمز التحقق (OTP) المرسل في رسالة نصية SMS.</li>
            <li>إجراء المطابقة الوجهية الحية (Live Facial Match) ومسح الوثيقة الرسمية.</li>
            <li>تعيين رمز سري جديد مكون من 4 أرقام وتأكيده.</li>
        </ol>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">2. إعادة التعيين عبر موظف خدمة العملاء</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>التحقق من هوية المتصل بالأسئلة الأمنية (الاسم الرباعي، رقم البطاقة الوطنية/هوية الأحوال، تاريخ الميلاد، آخر عملية مالية أجريت).</li>
            <li>بعد التأكد التام من تطابق البيانات، يقوم الموظف بإرسال رابط إعادة الضبط الآمن أو إعادة فتح المحفظة فورياً.</li>
        </ul>
    </section>
</div>
`
  },
  {
    id: 5,
    title: "دليل توثيق الحسابات وفك حظر المحافظ الموقوفة (CI - Customer Information)",
    category: "التوثيق وإدارة الحسابات",
    icon: "fa-id-card",
    keywords: "توثيق, حساب, هوية, حظر, موقوف, متوقف, ci, customer information, تفعيل, بطاقة وطنية, سكن, امتثال, kyc",
    correctDisp: "Inquiry",
    correctSubDisp: "Wallet Account Status",
    content: `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:20px;">
        <h2 style="margin:0 0 8px 0; color:#4ade80;">📋 دليل توثيق الحسابات وحالات المحافظ الموقوفة (CI)</h2>
        <p style="margin:0; font-size:0.9rem; color:#cbd5e1;">شرح متطلبات توثيق المحفظة الدائمية، وكيفية فك الحظر المؤقت عند ظهور رسالة CI (Customer Information).</p>
    </div>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">1. متطلبات توثيق المحفظة الدائمية (KYC)</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li><strong>الوثيقة الرسمية:</strong> البطاقة الوطنية الموحدة أو (هوية الأحوال المدنية + شهادة الجنسية).</li>
            <li><strong>إثبات السكن:</strong> بطاقة السكن أو تأييد سكن مصدق وحديث.</li>
            <li><strong>الصورة الشخصية الحية:</strong> التقاط صورة واضحة للوجه عبر كاميرا التطبيق.</li>
        </ul>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">2. معالجة حالة المحفظة الموقوفة (CI - Inactive Wallet)</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li><strong>سبب الإيقاف:</strong> تتوقف المحفظة مؤقتاً بسبب عدم إجراء أي حركة مالية لفترة طويلة أو انتهاء صلاحية الوثائق المسجلة.</li>
            <li><strong>إجراء الموظف بالسيستم:</strong> الدخول إلى <em>Utilities -> CC Portal -> Additional Customer's Information</em> للتحقق من سبب التوقف.</li>
            <li><strong>طريقة فك الحظر:</strong> توجيه المشترك لرفع المستمسكات المحدثة عبر التطبيق أو تصعيد التذكرة لفريق الامتثال (AML-InactiveWallet) للتفعيل خلال 24 ساعة.</li>
        </ul>
    </section>
</div>
`
  },
  {
    id: 6,
    title: "دليل التحويل المالي المحلي، شحن الرصيد وسداد الفواتير الحكومية",
    category: "الخدمات المالية والفواتير",
    icon: "fa-money-bill-transfer",
    keywords: "تحويل, حول فلوس, شحن رصيد, دفع فواتير, كهرباء, اسكان, صندوق الاسكان, كارتات, زين, اسياسيل, كورك, فاتورة",
    correctDisp: "Inquiry",
    correctSubDisp: "Application Usage",
    content: `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:20px;">
        <h2 style="margin:0 0 8px 0; color:#f472b6;">⚡ دليل التحويل المحلي ودفع الفواتير وشحن الرصيد</h2>
        <p style="margin:0; font-size:0.9rem; color:#cbd5e1;">الخطوات والرسوم لعمليات التحويل من محفظة إلى محفظة، دفع الفواتير الحكومية، وشحن خطوط الاتصال.</p>
    </div>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">1. تحويل الأموال المحلي (حول فلوس)</h3>
        <ol style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>اختيار <strong>(حول فلوس)</strong> من واجهة تطبيق زين كاش.</li>
            <li>إدخال رقم هاتف المستلم أو اختياره من جهات الاتصال.</li>
            <li>إدخال المبلغ المراد تحويله بالدينار العراقي.</li>
            <li>مراجعة اسم المستلم والرسوم وإدخال الرمز السري لتأكيد التحويل فوراً.</li>
        </ol>
    </section>

    <section style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin-bottom:18px;">
        <h3 style="color:#0c4f8a; font-size:1.15rem; font-weight:800; margin-top:0;">2. دفع الفواتير وشحن الرصيد</h3>
        <ul style="padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li><strong>شحن الرصيد:</strong> شراء بطاقات وتعبئة خطوط زين، آسياسيل، وكورك مباشرة بدون عمولة إضافية.</li>
            <li><strong>الفواتير الحكومية:</strong> تسديد فواتير الكهرباء، أقساط صندوق الإسكان العراقي، وفواتير ماء وكهرباء إقليم كردستان برقم الحساب أو القائمة.</li>
        </ul>
    </section>
</div>
`
  }
];

// Save to kb-data.js
const fileContent = `const EMBEDDED_KB_DATA = ${JSON.stringify(fullKbArticles, null, 2)};

if (typeof window !== 'undefined') {
    window.EMBEDDED_KB_DATA = EMBEDDED_KB_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMBEDDED_KB_DATA;
}
`;

fs.writeFileSync('c:/Users/kaka/Downloads/Test/kb-data.js', fileContent, 'utf8');
console.log('Saved kb-data.js with', fullKbArticles.length, 'articles.');

// Save to database.sqlite
db.setConfig('knowledgeBase', fullKbArticles);
console.log('Saved to SQLite knowledgeBase config.');

// Save to db.json
const dbJsonPath = 'c:/Users/kaka/Downloads/Test/db.json';
const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
dbJson.knowledgeBase = fullKbArticles;
fs.writeFileSync(dbJsonPath, JSON.stringify(dbJson, null, 2), 'utf8');
console.log('Saved to db.json.');
