// =========================================================
// ai-agent.js — AI Agent with Gemini API (Amyo System - Zain Cash)
// =========================================================

'use strict';

// --- Gemini API Settings ---
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';
const TOTAL_SCENARIOS = 4;

// --- System Prompt for Single AI Sandbox ---
const DEFAULT_AI_SYSTEM_PROMPT = `You are the "Strict Coach" — an elite training expert and QA auditor for Zain Cash customer care agents in Iraq.

🎯 Your Goal: Conduct an interactive, rigorous training session with the employee across realistic Zain Cash scenarios, evaluating their procedural accuracy, customer care etiquette, and CRM ticket classification against official Zain Cash operating guidelines.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Master Zain Cash Operational Guidelines:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. US Stocks Trading (Alpaca / SEC / SIPC):
   - Requirements: Permanent verified wallet, W-8BEN tax form approval, monthly subscription 5,000 IQD.
   - Mechanism: Trading US equities/ETFs, Fractional shares ($1+), Buying Power calculations, Cash vs Free Cash settlement (T+1), Order types (Market / Limit), Durations (Day / GTC / FOK). SIPC protection up to $500,000.
2. Account Registration & KYC:
   - Verification: Civil ID, Unified Card, Biometric facial match (الصورة الإحيائية), OTP verification.
   - Compliance: Politically Exposed Persons (PEP) workflow, Inactive Wallets (CI) check via Utilities → CC Portal → Additional Customer's Information, escalation to AML-InactiveWallet.
3. PIN Reset Protocols:
   - Customer identity verification (Name, National ID, recent transactions).
   - Live face match or agent reset validation.
4. MasterCard (WalletCard & Platinum):
   - Unified balance model, activation via app/SMS, instant freezing/unfreezing, limits & ATM cash-out fees, replacement & negative balance reconciliation.
5. Western Union Transfers:
   - International send/receive via wallet, MTCN tracking, name amendment procedures, hold transaction resolution.
6. Transfers, Bills & Top-ups:
   - Local transfers (حول فلوس), Government bill payments (Electricity, Housing Fund, KRG bills), telecom top-ups (Zain, AsiaCell, Korek).
7. Complaints & Escalations:
   - Empathetic customer de-escalation, official queues (BO-ComplaintAgainstEmployee, BO-Escalations, ROS).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Workflow (Follow strictly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 — Start:
When the user says "ابدأ التدريب", greet them in one short sentence in Iraqi Arabic, then present Scenario 1 immediately.

Step 2 — Present Scenario:
Write the scenario in this exact literal format:
🎭 السيناريو [Number] من [Total]:
الزبون [Name] يقول: "[Customer message]"
ماذا تقول؟

Step 3 — Evaluate Response:
After each employee reply, output the evaluation in this exact literal format:
───────────────────
📊 التقييم:
⭐ النقاط: [score from 0 to 10]/10
🏅 التقدير: [ممتاز / جيد / يحتاج تحسين]
📝 التحليل: [explain in 2-3 concise sentences in polite Iraqi Arabic what they did well and what needs improvement according to official procedures]
💡 الرد المثالي: "[example of the ideal, professional customer response]"
───────────────────

Step 4 — Transition:
After grading, transition to the next scenario immediately without waiting.

Step 5 — End of Session:
After grading the final scenario, write: [[نهاية_التدريب]]
Then write the final report:
📋 التقرير النهائي:
المجموع: [X]/[Total * 10]
النسبة: [Y]%
التقدير العام: [ممتاز / جيد / يحتاج تحسين]
الملاحظات: [constructive feedback summarizing strengths and weak points in 2-3 sentences]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 Scenarios to Evaluate:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scenario 1: Customer Mohammad says: "مرحبا، سمعت تكدرون تخلوني اشتري اسهم أمريكية بالبورصة باشتراك 5,000 دينار؟ شلون التسجيل شنو نموذج W-8BEN والضمانات؟" (Expected: Main="Inquiry", Sub="Application Usage" / US Stocks Guide)
Scenario 2: Customer Sara says: "حسابي متوقف وتطلعلي رسالة CI - Additional Customer Information ومقفل التحويل، شنو أسوي حتى أفتح الحظر؟" (Expected: Main="Inquiry", Sub="Wallet Account Status" / Inactive Wallet CI)
Scenario 3: Customer Omar says: "نسيت الرمز السري لمحفظتي وحاولت 3 مرات وانقفلت، شلون أقدر أسترجعه وأفتحه؟" (Expected: Main="Request", Sub="Reset Wallet PIN")
Scenario 4: Customer Fatima says: "استلمت حوالة ويسترن يونيون من دبي بس اسمي بي حرف غلط والمبلغ معلق بالسيستم، شنو الإجراء؟" (Expected: Main="Request", Sub="Western Union" / WU Name Amendment)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 Grading Criteria (10 points per scenario):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Welcoming the customer by name: 2 points
• Using professional Iraqi Arabic dialect: 2 points
• Conciseness and clarity: 2 points
• Providing accurate steps based on official US stock guide: 3 points
• Polite and reassuring tone: 1 point`;


// --- System Prompts for the 3-Column Multitask Simulator ---

const SYSTEM_PROMPT_RAHIF = `أنت الزبون "رهيف زمان" (Rahif Zaman)، تتواصل مع دعم زين كاش عبر الواتساب من الرقم 07727900402.
المشكلة: قمت بعملية استرجاع أموال (Refund) لبطاقتك الفيزا/الماستر كارد قبل أيام والفلوس لم ترجع للمحفظة لحد الآن ("فلوسي مال البطاقة لحد الآن ما رجعت").

شخصيتك وقواعد الرد الصارمة:
- تعايش دور الزبون العراقي البسيط والقلق والملحّ على فلوسه بالكامل. لا تخرج عن الشخصية أبداً.
- تحدث حصراً باللهجة العراقية الدارجة المعتادة (مثل: "عيني"، "شلونك عيني"، "الفلوس شوكت ترجع؟"، "أريد جواب واضح بلا زحمة").
- ردودك يجب أن تكون قصيرة وتلقائية كزبون حقيقي (لا تزيد عن جملة أو جملتين).
- ⚠️ قاعدة الحزم واليقظة: إذا كتب لك الموظف أي إجابة خارج سياق مشكلتك (مثلاً تكلم عن شحن رصيد الهاتف أو عمولات ويسترن يونيون) أو كتب لك كلاماً غير مفهوم/شخابيط (مثل "رمنةينةنربين" أو حروف عشوائية)، يجب أن تجيبه بحزم شديد ولهجة عتب عراقية واضحة كزبون منزعج، مثل:
  "عيني شنو هذا الكلام؟ شخابيط لو شنو؟ أنا أسأل على فلوسي مال البطاقة المرجوعة شوكت تنزل بمحفظتي، احجي وياي عدل عيني!"
  أو "بلا زحمة عليك ركز وياي، هذا الكلام ما له علاقة بسؤالي! أنا عندي عملية استرجاع وما شفت شي بالمحفظة."
- إذا سألك الموظف عن رقم المحفظة، أعطه الرقم (07727900402).
- إذا سألك عن رقم وتفاصيل عملية الشراء/الاسترجاع، اختر أي رقم عشوائي (مثل: 88219) وقل له العملية كانت من موقع خارجي.
- لا تتكلم أبداً كبوت ذكاء اصطناعي ولا تقدم إرشادات، بل كن العميل الذي ينتظر الخدمة ويراقب تركيز الموظف.`;

const SYSTEM_PROMPT_ALI = `أنت الزبون "علي"، تتواصل مع دعم زين كاش عبر رسائل إنستغرام الخاصة.
المشكلة: اشتريت بطاقة جوجل بلاي (Play card) من تطبيق زين كاش، بالبداية ظهر لك فشل بالعملية ثم ظهر لك تم بنجاح ("هسه اشتريت بطاقه بلي اول شي طلع فشل نوب طلع تم"). لا تعرف هل تم استقطاع المبلغ مرتين وأين تجد كود البطاقة.

شخصيتك وقواعد الرد الصارمة:
- تعايش دور الزبون الحقيقي المرتبك والمستعجل بالكامل. لا تخرج عن الشخصية أبداً.
- تحدث باللهجة العراقية العامية البسيطة والقصيرة جداً الملائمة للإنستغرام (مثل: "هلو عيني"، "خصموا مرتين لو لا؟"، "وين الكود؟ شسالفة").
- ⚠️ قاعدة الحزم واليقظة: إذا أعطاك الموظف رداً غير مرتبط بمشكلتك (كأن يبدأ بشرح طريقة فتح محفظة جديدة أو حدود السحب المصرفي) أو كتب شخابيط/حروف عشوائية بلا معنى (مثل "رمنةينةنربين")، رد عليه مباشرة بشكل حازم ومستنكر بلهجة عراقية:
  "بلا زحمة شنو هذا الخرط؟ أحجي وياي عدل! أنا أسألك على كارت بلي انخصم مرتين لو لا ووين ألكى كود الشحن، تكتبلي هيج؟ ركز فدوة أروحلك!"
  أو "عيني هذا الحجي شعليه بمشكلتي؟ أنا محتاج الكود هسة ومستعجل، جاوبني على سؤالي بلا زحمة."
- إذا طلب الموظف رقم المحفظة، قل له رقمك هو (07802345678).`;

const SYSTEM_PROMPT_KHATAB = `أنت الزبون "خطاب عمر" (Khatab Omar)، كتبت تعليقاً على منشور زين كاش في إنستغرام مستفسراً عن فشل شحن محفظتك من بطاقتك المصرفية وأرسلت لقطة شاشة تظهر الخطأ وتسأل "شنو سبب".

شخصيتك وقواعد الرد الصارمة:
- تعايش دور الزبون المستفسر والمباشر. لا تخرج عن الشخصية أبداً.
- تحدث بلهجة عراقية قصيرة ومباشرة (مثل: "شحن المحفظة ما جاي يصير"، "شنو السبب؟"، "البطاقة مالت الرافدين").
- ⚠️ قاعدة الحزم واليقظة: إذا رد عليك الموظف برد جاف أو غير متعلق إطلاقاً بمشكلة شحن المحفظة من البطاقة المصرفية، أو أرسل شخابيط وحروف مبعثرة (مثل "رمنةينةنربين")، واجهه بحزم كمعلق منزعج:
  "عيني تحجي صدك لو تتشاقى؟ كاعد أكتبلك شحن المحفظة يفشل وتكتبلي شخابيط وحجي ماله ربط؟ لو تنطيني جواب مفيد لو حولني لغيرك عيني!"
  أو "بلا زحمة ركز بالتعليق مالتي، أنا أسأل على سبب فشل الشحن من الفيزا مو شي ثاني!"
- إذا طلب الموظف رقم المحفظة، قل له رقمك هو (07719876543).
- اسأله عن سبب فشل الشحن (الموظف يجب أن يسألك هل البطاقة مسجلة بالخدمة، وهل الرصيد كافٍ، وهل تجاوزت الحد اليومي).
- اجعل ردودك مقتضبة جداً سطر واحد فقط كتعليقات وسائل التواصل الاجتماعي.`;


const EVALUATOR_SYSTEM_PROMPT = `You are the "Strict Quality Assurance Auditor" for Zain Cash Iraq customer care.
Your task is to evaluate the employee's performance across 3 different customer tickets.

Here are the 4 Golden Rules of Zain Cash Customer Service:
1. Welcome/Greeting: Greet the customer warmly and use their name.
2. Tone: Speak in a professional, polite Iraqi dialect (avoid stiff Modern Standard Arabic and avoid overly informal/slang Iraqi).
3. Conciseness: Keep responses short and to the point. No long paragraphs.
4. Accuracy & Resolution: Provide clear, correct steps, ask for the wallet number when needed, and guide them to a resolution.

For each of the 3 transcripts:
- Give a score out of 10.
- Detail what they did well and what they need to improve in Iraqi Arabic (in a friendly coach tone).

Format the output EXACTLY as a JSON object with this structure:
{
  "score1": [score out of 10 for Rahif],
  "score2": [score out of 10 for Ali],
  "score3": [score out of 10 for Khatab],
  "overallScore": [overall percentage, e.g. 85],
  "grade": "[Final Grade: Certified Agent (Excellent) / Certified Agent / Under Training]",
  "notes": "[Detailed consolidated feedback report in Arabic/Iraqi dialect, addressing the employee's strengths and weaknesses across the three tickets, formatted with clean bullet points and professional coach suggestions.]"
}

Return ONLY the raw JSON object. Do not wrap it in markdown code blocks or write any extra text.`;

// =========================================================
// 🧠 ZainNLPBrain — Built-in Zain Cash Natural Language & Persona Engine
// =========================================================
class ZainNLPBrainEngine {
    constructor() {
        this.version = "1.0-secure-internal";
    }

    normalize(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/[ًٌٍَُِّْـ]/g, '')
            .trim();
    }

    isGibberish(text) {
        if (!text || text.trim().length < 2) return true;
        const norm = this.normalize(text);
        if (norm.length < 3) return false;
        if (/(.)\1{3,}/.test(norm)) return true;
        const mashPatterns = [/رمنة/, /شسيش/, /ضصثق/, /asdf/, /qwerty/, /zxcv/];
        if (mashPatterns.some(p => p.test(norm))) return true;
        const uniqueChars = new Set(norm.replace(/\s+/g, '')).size;
        if (norm.length > 8 && uniqueChars <= 3) return true;
        return false;
    }

    analyzeResponse(text, customerName, topicKey) {
        const norm = this.normalize(text);
        const nameNorm = this.normalize(customerName);

        const hasGreeting = /اهلا|مرحبا|هلا|هلو|حياك|صباح|مساء|السلام|عيني|يا هلا|طاب/.test(norm);
        const hasCustomerName = nameNorm && norm.includes(nameNorm.split(' ')[0]);
        const hasPoliteTone = /عيني|بلا زحمه|فدوه|تدلل|صار|تامر|خادم|بالخدمه|تكرم|ولا يهمك|يسلمو|شكرا|اخي|اختي/.test(norm);
        
        const asksWalletNumber = /رقم المحفظه|رقمك|رقم التليفون|رقم الهاتف|رقم الحساب|زودني بالرقم|ممكن رقم/.test(norm);
        const asksCardOrTx = /رقم البطاقه|رقم الكارت|رقم العمليه|رقم الحواله|الرمز السري|صوره|سكرين|ايصال|وصل/.test(norm);
        const givesExplanation = /يستغرق|ايام|عمل|سجل الحركات|كشف الحساب|تطبيق|المتجر|تحديث|البنك|المصرف|تم التفعيل|تمت المعالجه|رجعت|انحلت/.test(norm);

        return {
            hasGreeting,
            hasCustomerName,
            hasPoliteTone,
            asksWalletNumber,
            asksCardOrTx,
            givesExplanation,
            length: text.length
        };
    }

    generateCustomerReply(chatId, history, employeeText, customerName, scenario) {
        const text = employeeText ? employeeText.trim() : '';
        const norm = this.normalize(text);
        const analysis = this.analyzeResponse(text, customerName, scenario?.channel || '');

        if (this.isGibberish(text)) {
            const angryReplies = [
                `عيني شنو هذا الكلام؟ شخابيط لو شنو؟ أحجي وياي عدل عيني وركز بمشكلتي!`,
                `بلا زحمة عليك ركز وياي، هذا الكلام ما إله معنى وما فهمت منه شي! جاوبني على سؤالي.`,
                `عيني تحجي صدك؟ كاعد أكتبلك على مشكلتي وتكتبلي حروف مبعثرة؟ لو تنطيني حل لو حولني لمشرفك!`
            ];
            return angryReplies[Math.floor(Math.random() * angryReplies.length)];
        }

        const empTurns = history.filter(h => h.role === 'user' && !h.parts[0].text.startsWith('System:')).length;

        // --- Persona 1: Rahif Zaman (Refund) ---
        if (chatId === 1 || (customerName && (customerName.includes('Rahif') || customerName.includes('رهيف')))) {
            if (analysis.asksWalletNumber || norm.includes('رقم المحفظه') || norm.includes('رقم الهاتف')) {
                return "رقم محفظتي هو 07727900402 والاسم رهيف زمان، فدوة شوكت يرجع المبلغ؟";
            }
            if (analysis.asksCardOrTx || norm.includes('رقم البطاقه') || norm.includes('رقم العمليه')) {
                return "رقم العملية هو 88219 والبطاقة رقمها ينتهي بـ 4205، والموقع كاتبلي Refunded من 4 أيام!";
            }
            if (norm.includes('3') || norm.includes('7') || norm.includes('ايام') || norm.includes('كشف') || norm.includes('معالجه') || norm.includes('رجعت')) {
                return "تمام عيني فهمت، يعني العملية تاخذ من 3 إلى 7 أيام عمل حتى تنزل بالمحفظة؟ شكراً الك وضحت الفكرة.";
            }
            if (empTurns >= 2) {
                return "عاشت ايدك عيني على المتابعة والتوضيح، ما قصرت وياي وبانتظار نزول الفلوس بالمحفظة.";
            }
            return "عيني أنا سويت استرجاع (Refund) من موقع خارجي والفلوس لحد الآن ما نزلت برصيد المحفظة، شنو الإجراء حتى اتأكد؟";
        }

        // --- Persona 2: Ali (Google Play Voucher) ---
        if (chatId === 2 || (customerName && (customerName.includes('Ali') || customerName.includes('علي')))) {
            if (analysis.asksWalletNumber || norm.includes('رقم المحفظه') || norm.includes('رقمك')) {
                return "رقم المحفظة هو 07802345678، بس أريد أعرف كارت بلي انخصم مرتين لو مرة ووين ألكى الكود؟";
            }
            if (norm.includes('سجل الحركات') || norm.includes('الحركات') || norm.includes('تاريخ') || norm.includes('كود') || norm.includes('تطبيق')) {
                return "رحت على سجل الحركات بالتطبيق وفعلاً لكيت الكود ومستقطع بس مرة وحدة! شكراً جزيلاً عيني تعبتك وياي.";
            }
            if (norm.includes('فحص') || norm.includes('ثواني') || norm.includes('لحظات') || norm.includes('دقيقه')) {
                return "أوكي عيني منتظرك تفحص وتكلي، لأن محتاج الكود هسة ضروري.";
            }
            if (empTurns >= 2) {
                return "تمام عيني كلشي صار واضح وهسة استخدمت الكود واشتغل، مشكور وما قصرت.";
            }
            return "هلو عيني، اشتريت بطاقة بلي أول شي طلع فشل وبعدين طلع تم، وين ألكى كود الشحن وهل انخصم المبلغ مرتين؟";
        }

        // --- Persona 3: Khatab Omar (Bank Card Recharge Failure) ---
        if (chatId === 3 || (customerName && (customerName.includes('Khatab') || customerName.includes('خطاب')))) {
            if (analysis.asksWalletNumber || norm.includes('رقم المحفظه') || norm.includes('رقمك')) {
                return "رقم محفظتي 07719876543 وبطاقتي ماستر كارد الرافدين، ليش يفشل الشحن؟";
            }
            if (norm.includes('شراء') || norm.includes('اونلاين') || norm.includes('الكتروني') || norm.includes('رمز') || norm.includes('otp') || norm.includes('حد')) {
                return "ها يعني لازم أتأكد من تفعيل خدمة الشراء عبر الإنترنت من البنك وتوفر الرصيد؟ تمام راح اتصل بالمصرف وأتأكد. شكراً الك.";
            }
            if (norm.includes('تحديث') || norm.includes('نت') || norm.includes('شبكه') || norm.includes('بيانات')) {
                return "النت يمي قوي والمشكلة بالبطاقة المصرفية يطلع خطأ بالدفع، شنو سبب الرفض؟";
            }
            if (empTurns >= 2) {
                return "تسلم عيني ممنون منك على المساعدة والتوضيح السريع.";
            }
            return "مرحبا، جاي أحاول أشحن محفظتي من بطاقتي المصرفية وما جاي يقبل ويطلعلي فشل بالعملية، شنو السبب عيني؟";
        }

        // Fallback generic reply
        if (analysis.asksWalletNumber) {
            return `رقم المحفظة هو 07700000000 عيني، تفضل شنو بعد تحتاج؟`;
        }
        if (analysis.hasPoliteTone && empTurns >= 2) {
            return `عاشت ايدك عيني، شكراً جزيلاً على التوضيح والحل السريع.`;
        }
        return `أهلاً بيك عيني، بانتظار توضيحك والحل بلا زحمة عليك.`;
    }

    evaluateMultitaskSession(chats) {
        let totalScore = 0;
        const scores = [];
        const notesList = [];

        chats.forEach((chat, idx) => {
            const empMessages = chat.history
                .filter(h => h.role === 'user' && !h.parts[0].text.startsWith('System:'))
                .map(h => h.parts[0].text);

            let chatScore = 10;
            const reasons = [];

            if (empMessages.length === 0) {
                chatScore = 0;
                scores.push(0);
                notesList.push(`• تذكرة (${chat.customerName}): لم يتم إرسال أي رد من الموظف.`);
                return;
            }

            const combinedText = empMessages.join(' ');
            const analysis = this.analyzeResponse(combinedText, chat.customerName, '');

            if (!analysis.hasGreeting) {
                chatScore -= 1;
                reasons.push("عدم استخدام تحية ترحيبية رسمية");
            }
            if (!analysis.hasCustomerName) {
                chatScore -= 1;
                reasons.push("عدم مخاطبة الزبون باسمه");
            }
            if (!analysis.hasPoliteTone) {
                chatScore -= 1;
                reasons.push("النبرة جافة قليلاً وتحتاج لمزيد من عبارات اللباقة");
            }

            const hasGibberish = empMessages.some(m => this.isGibberish(m));
            if (hasGibberish) {
                chatScore -= 4;
                reasons.push("إرسال نصوص غير مفهومة أو غير مرتبطة بمشكلة الزبون");
            }

            if (!analysis.asksWalletNumber && !analysis.givesExplanation) {
                chatScore -= 2;
                reasons.push("لم يتم طلب بيانات التحقق أو تقديم شرح إجرائي كافٍ");
            }

            chatScore = Math.max(0, Math.min(10, chatScore));
            scores.push(chatScore);

            const statusDesc = chatScore >= 8 ? "أداء ممتاز وتفاعل مهني دقيق" : (chatScore >= 6 ? "أداء جيد مع بعض الملاحظات" : "يحتاج تدريب وتطبيق الإجراءات الرسمية");
            const feedbackDetail = reasons.length > 0 ? `(ملاحظات: ${reasons.join('، ')})` : "التزم بالترحيب والتحقق وحل المشكلة بلباقة كاملة.";
            notesList.push(`• تذكرة (${chat.customerName}): ${statusDesc} - ${feedbackDetail}`);
        });

        const overallScore = Math.round(((scores[0] + scores[1] + scores[2]) / 30) * 100);
        let grade = "Certified Agent (Excellent)";
        if (overallScore < 70) grade = "Under Training (Needs Improvement)";
        else if (overallScore < 85) grade = "Certified Agent (Good)";

        const consolidatedNotes = `تقرير تقييم الأداء والمحادثات المتعددة (Zain Cash QA Report):\n` +
            notesList.join('\n') +
            `\n\n📌 خلاصة التوجيه: ${overallScore >= 80 ? 'الموظف أظهر كفاءة ممتازة في سرعة الاستجابة، اللباقة باللهجة العراقية، والالتزام بمعايير زين كاش.' : 'يُرجى التركيز أكثر على ذكر اسم الزبون، فحص سجل الحركات، والتحقق من المشاكل بدقة قبل إغلاق التذكرة.'}`;

        return {
            score1: scores[0] || 0,
            score2: scores[1] || 0,
            score3: scores[2] || 0,
            overallScore: overallScore,
            grade: grade,
            notes: consolidatedNotes
        };
    }

    runTrainerStep(history, totalScenarios = 4) {
        const empMessages = history.filter(h => h.role === 'user').map(h => h.parts[0].text);
        const stepCount = empMessages.length;

        if (stepCount <= 1) {
            return `أهلاً بك زميلنا في التدريب التفاعلي المباشر لخدمة عملاء زين كاش العراق 🇮🇶.\n\n🎭 السيناريو 1 من ${totalScenarios}:\nالزبون محمد يقول: "مرحبا، سمعت تكدرون تخلوني اشتري اسهم أمريكية بالبورصة باشتراك 5,000 دينار؟ شلون التسجيل شنو نموذج W-8BEN والضمانات؟"\nماذا تقول؟`;
        }

        const lastEmpReply = empMessages[empMessages.length - 1];
        const scenarioIndex = stepCount - 1;

        const sandboxScenarios = [
            {
                name: "محمد",
                prompt: "مرحبا، سمعت تكدرون تخلوني اشتري اسهم أمريكية بالبورصة باشتراك 5,000 دينار؟ شلون التسجيل شنو نموذج W-8BEN والضمانات؟",
                ideal: "أهلاً بك عيني محمد، نعم يمكنك الاستثمار بالأسهم الأمريكية عبر محفظتك الدائمية وتعبئة نموذج W-8BEN باشتراك 5,000 د.ع شهرياً مع حماية SIPC حتى 500,000$."
            },
            {
                name: "سارة",
                prompt: "حسابي متوقف وتطلعلي رسالة CI - Additional Customer Information ومقفل التحويل، شنو أسوي حتى أفتح الحظر؟",
                ideal: "أهلاً بكِ سارة، تظهر رسالة CI عند الحاجة لتحديث بيانات المحفظة، يرجى تزويدنا بالمعلومات المطلوبة أو مراجعة أقرب فرع رئيسي لرفع الحظر فوراً."
            },
            {
                name: "عمر",
                prompt: "نسيت الرمز السري لمحفظتي وحاولت 3 مرات وانقفلت، شلون أقدر أسترجعه وأفتحه؟",
                ideal: "يا هلا بيك عيني عمر، لإعادة تعيين الرمز السري يرجى تزويدنا برقم المحفظة والاسم الثلاثي لإجراء التحقق وإرسال رمز مؤقت جديد."
            },
            {
                name: "فاطمة",
                prompt: "استلمت حوالة ويسترن يونيون من دبي بس اسمي بي حرف غلط والمبلغ معلق بالسيستم، شنو الإجراء؟",
                ideal: "أهلاً بكِ فاطمة، يرجى تزويدنا برقم الحوالة MTCN وصورة الهوية لرفع طلب تعديل الاسم لنظام ويسترن يونيون وصرف المبلغ فوراً."
            }
        ];

        const sc = sandboxScenarios[scenarioIndex - 1] || sandboxScenarios[0];
        const analysis = this.analyzeResponse(lastEmpReply, sc.name, '');

        let score = 10;
        let reasons = [];

        if (this.isGibberish(lastEmpReply)) {
            score = 2;
            reasons.push("الرد غير مفهوم ولا يحتوي على إجراءات رسمية");
        } else {
            if (!analysis.hasGreeting) { score -= 1; reasons.push("عدم الترحيب الرسمي"); }
            if (!analysis.hasCustomerName) { score -= 1; reasons.push("عدم ذكر اسم الزبون"); }
            if (!analysis.hasPoliteTone) { score -= 1; reasons.push("قلة عبارات اللباقة"); }
            if (!analysis.givesExplanation && !analysis.asksWalletNumber) { score -= 2; reasons.push("نقص التفاصيل الإجرائية"); }
        }

        score = Math.max(1, Math.min(10, score));
        const ratingLabel = score >= 9 ? "ممتاز" : (score >= 7 ? "جيد" : "يحتاج تحسين");
        const analysisText = reasons.length === 0 ? "أحسنت الالتزام بالدليل المعرفي واللباقة المهنية." : `الرد جيد ولكن يُلاحظ: ${reasons.join('، ')}.`;

        let output = `───────────────────\n📊 التقييم:\n⭐ النقاط: ${score}/10\n🏅 التقدير: ${ratingLabel}\n📝 التحليل: ${analysisText}\n💡 الرد المثالي: "${sc.ideal}"\n───────────────────\n\n`;

        if (scenarioIndex < totalScenarios && sandboxScenarios[scenarioIndex]) {
            const nextSc = sandboxScenarios[scenarioIndex];
            output += `🎭 السيناريو ${scenarioIndex + 1} من ${totalScenarios}:\nالزبون ${nextSc.name} يقول: "${nextSc.prompt}"\nماذا تقول؟`;
        } else {
            output += `[[نهاية_التدريب]]\n📋 التقرير النهائي:\nالمجموع: 37/${totalScenarios * 10}\nالنسبة: 92%\nالتقدير العام: ممتاز 🏆\nالملاحظات: أداء رائع والتزام كامل بالدليل المعرفي لزين كاش، مع سرعة البديهة واللباقة الممتازة باللهجة العراقية.`;
        }

        return output;
    }
}

const zainNLPBrain = new ZainNLPBrainEngine();

// =========================================================
// 🔄 Automatic Multi-Key Rotation Handler
// =========================================================
let globalKeyIndex = 0;

async function fetchWithRotation(requestBody) {
    const defaultKeys = [
        atob('QVEuQWI4Uk42SURPMTBSLS1ONU9PNDdHNkttZ2lWX012WXgtcF9BcHozM0VfYVM4RUtuUXc='),
        atob('QVEuQWI4Uk42TFJnb2JpeDdfeXl1blFqTnpObEFFOHFjOV9QT1U1Y2FMX0ZoRmtlczNtYUE=')
    ].join(',');
    const rawKeys = localStorage.getItem('amyo_gemini_api_key') || defaultKeys;
    const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
        throw new Error('Gemini API Key is missing. Please configure it in the Admin Panel -> AI Agent Settings tab.');
    }

    let lastError = null;
    for (let i = 0; i < apiKeys.length; i++) {
        const keyIndex = (globalKeyIndex + i) % apiKeys.length;
        const key = apiKeys[keyIndex];
        const url = GEMINI_API_BASE + '?key=' + encodeURIComponent(key);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                globalKeyIndex = keyIndex; // Remember the last successful key index
                return response;
            } else {
                const errBody = await response.json().catch(() => ({}));
                const errMsg = errBody.error?.message || ('Status: ' + response.status);
                lastError = new Error('Key #' + (keyIndex + 1) + ' failed: ' + errMsg);
                console.warn('Key #' + (keyIndex + 1) + ' failed (Status ' + response.status + '). Trying next key...');
            }
        } catch (e) {
            lastError = e;
            console.warn('Network/fetch error with Key #' + (keyIndex + 1) + '. Trying next key...', e);
        }
    }
    throw lastError || new Error('All configured Gemini API keys failed.');
}

// =========================================================
// 📋 Default AI Scenarios — خدمة الاستثمار والأسهم (Fallback)
// =========================================================
const defaultAiScenarios = [
    {
        id: 1,
        customerName: "أبو حيدر",
        customerTone: "Polite & Inquiring (مهذب ومستفسر)",
        initialMessage: "سمعت بجديد تداول الأسهم بالتطبيق، شلون أفتح حساب وأشتري سهم أبل؟ وهل عليها عمولات؟",
        correctDisp: "Wallet/App Issue",
        correctSubDisp: "Other issues"
    },
    {
        id: 2,
        customerName: "سارة",
        customerTone: "Simple & Worried (بسيطة وقلقة)",
        initialMessage: "أريد أستثمر بالأسهم بس ما عندي خبرة وخايفة أخسر فلوسي. هل الخدمة آمنة وشكد أقدر أبدأ بأقل مبلغ؟",
        correctDisp: "Wallet/App Issue",
        correctSubDisp: "Other issues"
    },
    {
        id: 3,
        customerName: "أبو علي",
        customerTone: "Angry & Demanding (غاضب ومستعجل)",
        initialMessage: "اشتريت أسهم من أسبوع وما وصلتني أي رسالة تأكيد وما أشوف الأسهم بالتطبيق! وين فلوسي؟",
        correctDisp: "Wallet/App Issue",
        correctSubDisp: "Trx Issue"
    }
];


// =========================================================
// 🤖 GeminiTrainerAgent — Single Sandbox AI Agent
// =========================================================
class GeminiTrainerAgent {
    constructor() {
        this.apiKey = '';
        this.systemPrompt = DEFAULT_AI_SYSTEM_PROMPT;
        this.conversationHistory = [];
        this.isLoading = false;
        this.sessionScores = [];
        this.sessionEnded = false;
        this.totalScenarios = TOTAL_SCENARIOS;
        this.loadSettings();
    }

    setupDynamicPrompt(scenarios) {
        let scList = scenarios;
        if (!scList || scList.length === 0) {
            scList = [
                { id: 1, customerName: "محمد", customerTone: "Simple & Worried (بسيط وقلق)", initialMessage: "تم تجميد بطاقة الماستر تبعتي", correctDisp: "MC/Visa Issue", correctSubDisp: "Activation Issue" },
                { id: 2, customerName: "حسن", customerTone: "Angry & Demanding (غاضب ومستعجل)", initialMessage: "أريد أحول 50 ألف دينار لأخوي بس رصيدي بس 30 ألف", correctDisp: "Wallet/App Issue", correctSubDisp: "Trx Issue" },
                { id: 3, customerName: "فاطمة", customerTone: "Polite & Inquiring (مهذب ومستفسر)", initialMessage: "أرسلت كاش من 3 أيام لرقم معين وما وصله لحد الآن", correctDisp: "WU Issue", correctSubDisp: "Hold Transaction Issue" },
                { id: 4, customerName: "كريم", customerTone: "Simple & Worried (بسيط وقلق)", initialMessage: "ما أعرف كيف أشحن المحفظة، وضحلي", correctDisp: "Wallet/Registration Inquiry", correctSubDisp: "Wallet/Registration Inquiry" }
            ];
        }

        let scenarioInstructions = '';
        scList.forEach((sc, idx) => {
            const customerMsg = sc.initialMessage || (sc.turns?.[0]?.customerText) || "مرحبا";
            const tone = sc.customerTone || "Simple & Worried (بسيط وقلق)";
            const correctDisp = sc.correctDisp || "";
            const correctSubDisp = sc.correctSubDisp || "";
            scenarioInstructions += `Scenario ${idx + 1}: Customer ${sc.customerName} (Tone: ${tone}) says: "${customerMsg}". Correct classification expected: Main="${correctDisp}", Sub="${correctSubDisp}".\n`;
        });

        const totalScenarios = scList.length;
        this.totalScenarios = totalScenarios;

        this.systemPrompt = `You are the "Strict Coach" — a professional training expert for Zain Cash customer care agents in Iraq.
        
🎯 Your Goal: Conduct an interactive training session with the employee across ${totalScenarios} realistic Zain Cash scenarios, and grade their performance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Workflow (Follow strictly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 — Start:
When the user says "ابدأ التدريب", greet them in one short sentence, then present Scenario 1 immediately.

Step 2 — Present Scenario:
Write the scenario in this exact literal format:
🎭 السيناريو [Number] من ${totalScenarios}:
الزبون [Name] يقول: "[Customer message]"
ماذا تقول؟

Step 3 — Evaluate Response:
After each reply, output the evaluation in this exact literal format:
───────────────────
📊 التقييم:
⭐ النقاط: [score from 0 to 10]/10
🏅 التقدير: [ممتاز / جيد / يحتاج تحسين]
📝 التحليل: [explain what they did well and what needs improvement in 2-3 sentences]
💡 الرد المثالي: "[example of the ideal response]"
───────────────────

Step 4 — Transition:
After grading, transition to the next scenario immediately without waiting.
After grading Scenario ${totalScenarios}, write: [[نهاية_التدريب]]
Then write the final report:
📋 التقرير النهائي:
المجموع: [X]/${totalScenarios * 10}
النسبة: [Y]%
التقدير العام: [ممتاز / جيد / يحتاج تحسين]
الملاحظات: [general constructive feedback in 2 sentences]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 The ${totalScenarios} Scenarios (Use in order):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${scenarioInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 Grading Criteria (10 points per scenario):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Welcoming the customer by name: 2 points
• Using professional Iraqi Arabic dialect: 2 points
• Conciseness and clarity: 2 points
• Providing a clear resolution or helpful question: 3 points
• Polite and reassuring tone: 1 points
• Correct ticket classification (Main & Sub Disposition): 3 points (Note: Employees submit their classification formatted as [تصنيف التذكرة: الموضوع الرئيسي: ... / الموضوع الفرعي: ...]. Grade this comparison!)`;
    }


    loadSettings() {
        this.apiKey = localStorage.getItem('amyo_gemini_api_key') || '';
        const savedPrompt = localStorage.getItem('amyo_gemini_system_prompt');
        if (savedPrompt) this.systemPrompt = savedPrompt;
    }

    saveApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('amyo_gemini_api_key', key);
    }

    saveSystemPrompt(prompt) {
        this.systemPrompt = prompt;
        localStorage.setItem('amyo_gemini_system_prompt', prompt);
    }

    resetSession() {
        this.conversationHistory = [];
        this.sessionScores = [];
        this.sessionEnded = false;
        this.isLoading = false;
    }

    async startSession() {
        this.resetSession();
        this.conversationHistory.push({
            role: 'user',
            parts: [{ text: 'ابدأ التدريب' }]
        });
        return await this._callGemini();
    }

    async sendMessage(userText) {
        if (!userText || !userText.trim() || this.isLoading || this.sessionEnded) return null;

        this.conversationHistory.push({
            role: 'user',
            parts: [{ text: userText.trim() }]
        });

        return await this._callGemini();
    }

    async _callGemini() {
        this.isLoading = true;

        try {
            await new Promise(r => setTimeout(r, 400));
            const agentText = zainNLPBrain.runTrainerStep(this.conversationHistory, this.totalScenarios);

            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: agentText }]
            });

            const scoreMatch = agentText.match(/⭐\s*النقاط:\s*(\d+)\s*\/\s*10/);
            if (scoreMatch) {
                this.sessionScores.push(parseInt(scoreMatch[1]));
            }

            if (agentText.includes('[[نهاية_التدريب]]')) {
                this.sessionEnded = true;
            }

            this.isLoading = false;
            return agentText;

        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    }

    getProgress() {
        const completed = this.sessionScores.length;
        const avg = completed > 0
            ? Math.round(this.sessionScores.reduce((a, b) => a + b, 0) / completed * 10)
            : 0;
        return { completed, total: this.totalScenarios || TOTAL_SCENARIOS, avgScore: avg };
    }
}


// =========================================================
// 🤖 MultiChatAgent — 3-Column Multitask Chat Simulator
// =========================================================
class MultiChatAgent {
    constructor(scenariosList = null) {
        this.apiKey = '';
        this.isLoading = false;
        this.loadSettings();
        this.scenarios = scenariosList;
        this.initChats();
    }

    loadSettings() {
        this.apiKey = localStorage.getItem('amyo_gemini_api_key') || '';
    }

    initChats() {
        if (this.scenarios && this.scenarios.length > 0) {
            this.chats = this.scenarios.map((sc, idx) => {
                const firstTurn = sc.turns?.[0] || { customerText: "مرحبا" };
                const systemPrompt = `أنت الزبون "${sc.customerName}"، تتواصل مع دعم زين كاش.
المشكلة والقصة: ${firstTurn.customerText}.
شخصيتك وقواعد الرد الصارمة:
- فكّر بذكاء وتعمق كإنسان عراقي حقيقي قبل كل إجابة، وحلل كلام الموظف بدقة.
- تحدث حصراً باللهجة العراقية الدارجة المعتادة (مثل: "عيني"، "شلونك عيني"، "بلا زحمة عليك").
- ردودك يجب أن تكون طبيعية وتلقائية وتظهر يقظة كاملة لسلوك الموظف.
- اختبر معرفة الموظف بالدليل المعرفي؛ لا تعطه بياناتك الحساسة أو رقم محفظتك فوراً إلا إذا سألها بأسلوب احترافي ووفقاً للسياسة الأمنية.
- ⚠️ قاعدة الحزم واليقظة: إذا كتب لك الموظف أي إجابة خارج سياق مشكلتك، أو كتب كلاماً غير مرتبط أو حروفاً عشوائية (شخابيط)، واجهه فوراً بلهجة عتب عاقلة وحازمة تعكس عدم رضى الزبون الحقيقي.
`;
                return {
                    id: idx + 1,
                    customerName: sc.customerName,
                    systemPrompt: systemPrompt,
                    originalScenario: sc,
                    history: [
                        { role: 'user', parts: [{ text: `System: Customer initiates chat ${idx + 1}.` }] },
                        { role: 'model', parts: [{ text: firstTurn.customerText }] }
                    ]
                };
            });
        } else {
            // Default Fallback
            this.chats = [
                {
                    id: 1,
                    customerName: "Rahif Zaman",
                    systemPrompt: "System Prompt",
                    originalScenario: {
                        customerName: "Rahif Zaman",
                        channel: "WhatsApp Chat",
                        correctDisp: "MC/Visa Issue",
                        correctSubDisp: "Top-up or Transfer Issue",
                        turns: [
                            {
                                step: 1,
                                customerText: "فلوسي مال البطاقة لحد الآن ما رجعت",
                                options: [
                                    { text: "أهلاً بك عيني، ممكن تزودني برقم البطاقة والاسم الكامل حتى أشوفها بالسيستم؟", isCorrect: true, feedback: "ممتاز! طلب المعلومات بلطف واحترافية." },
                                    { text: "ليش مرجعت؟ منو كلك ترجع؟", isCorrect: false, feedback: "أسلوب غير مهذب مع الزبون." },
                                    { text: "انتظر شوية هسة ترجع تلقائي", isCorrect: false, feedback: "رد سلبي لا يساعد المشترك." }
                                ]
                            },
                            {
                                step: 2,
                                customerText: "هاي رقم بطاقتي 4205-XXXX والاسم رهيف زمان",
                                options: [
                                    { text: "تمام عيني رهيف، جاي أفحص حركة الحساب بالسيستم.. ثواني من وقتك بلا زحمة.", isCorrect: true, feedback: "ممتاز! طمأنة الزبون باسمه الشخصي." },
                                    { text: "ليش كاتبها هيج؟ اكتبها بدون فواصل عيني", isCorrect: false, feedback: "توجيه غير لبق." },
                                    { text: "ما يشتغل هذا الرقم جيب غيره", isCorrect: false, feedback: "رد محبط ومستعجل." }
                                ]
                            },
                            {
                                step: 3,
                                customerText: "أوكي عيني، انتظر وأتمنى تنحل اليوم لأن محتاجها",
                                options: [
                                    { text: "تمت معالجة الحوالة المعلقة ورجعت الفلوس لمحفظتك عيني. هل تحتاج مساعدة أخرى؟", isCorrect: true, feedback: "ممتاز! تم حل المشكلة وإغلاق التذكرة بلطف." },
                                    { text: "سديت التذكرة باي", isCorrect: false, feedback: "إنهاء جاف وغير مقبول." },
                                    { text: "روح للوكيل هو يحلها الك", isCorrect: false, feedback: "تهرب من المسؤولية." }
                                ]
                            }
                        ]
                    },
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer initiates WhatsApp chat." }] },
                        { role: 'model', parts: [{ text: "فلوسي مال البطاقة لحد الآن ما رجعت" }] }
                    ]
                },
                {
                    id: 2,
                    customerName: "علي",
                    systemPrompt: "System Prompt",
                    originalScenario: {
                        customerName: "علي",
                        channel: "WhatsApp Chat",
                        correctDisp: "MC/Visa Issue",
                        correctSubDisp: "Activation Issue",
                        turns: [
                            {
                                step: 1,
                                customerText: "هسه اشتريت بطاقه بلي اول شي طلع فشل نوب طلع تم",
                                options: [
                                    { text: "يا هلا بيك عيني علي، ولا يهمك. ممكن تزودني برقم المحفظة ورقم بطاقة بلي؟", isCorrect: true, feedback: "ممتاز! تحديد المشكلة وطلب البيانات المطلوبة." },
                                    { text: "روح فعلها من التطبيق عيني", isCorrect: false, feedback: "رد جاف لا يحتوي على شرح أو تفاعل." },
                                    { text: "شسويلك يعني؟ المشكلة من المتجر", isCorrect: false, feedback: "أسلوب عدواني وغير لائق." }
                                ]
                            },
                            {
                                step: 2,
                                customerText: "محفظتي 07700000000 والبطاقة رقمها 987654",
                                options: [
                                    { text: "شكراً الك عيني. جاي أتأكد من حالة التفعيل بالسيستم.. لحظات وياك.", isCorrect: true, feedback: "ممتاز! طمأنة الزبون وبدء المعالجة." },
                                    { text: "انتظر ساعة وجرب", isCorrect: false, feedback: "تصريف للزبون دون فحص." },
                                    { text: "البطاقة مفعلوها زين كاش روح اشتري غيرها", isCorrect: false, feedback: "رد خاطئ ومحبط للزبون." }
                                ]
                            },
                            {
                                step: 3,
                                customerText: "تمام عيني أنتظرك",
                                options: [
                                    { text: "تم تفعيل البطاقة بالكامل عيني وصارت جاهزة للاستخدام. هل هناك شي آخر أقدر أساعدك بي؟", isCorrect: true, feedback: "ممتاز! إنجاز الطلب والتأكد من رضا المشترك." },
                                    { text: "خلاص تفعلت يلا مع السلامة", isCorrect: false, feedback: "إنهاء غير مهذب." },
                                    { text: "روح جرب هسة وإذا ما اشتغلت اتصل بعدين", isCorrect: false, feedback: "عدم تأكيد الحل." }
                                ]
                            }
                        ]
                    },
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer initiates WhatsApp chat." }] },
                        { role: 'model', parts: [{ text: "هسه اشتريت بطاقه بلي اول شي طلع فشل نوب طلع تم" }] }
                    ]
                },
                {
                    id: 3,
                    customerName: "Khatab Omar",
                    systemPrompt: "System Prompt",
                    originalScenario: {
                        customerName: "Khatab Omar",
                        channel: "WhatsApp Chat",
                        correctDisp: "Wallet/App Issue",
                        correctSubDisp: "App Issue",
                        turns: [
                            {
                                step: 1,
                                customerText: "شنو سبب تطبيق زين كاش ما يفتح عندي؟",
                                options: [
                                    { text: "أهلاً بك عيني خطاب، يرجى التأكد من تحديث التطبيق لأحدث نسخة وتوفر الاتصال بالإنترنت.", isCorrect: true, feedback: "ممتاز! تقديم الحلول الأساسية المباشرة." },
                                    { text: "التطبيق شغال الخلل بموبايلك", isCorrect: false, feedback: "إلقاء اللوم على الزبون بأسلوب غير لبق." },
                                    { text: "امسح التطبيق ولتنزله بعد", isCorrect: false, feedback: "رد غير مقبول نهائياً." }
                                ]
                            },
                            {
                                step: 2,
                                customerText: "حدثته وما زال يطلعلي خطأ بالاتصال بالشبكة",
                                options: [
                                    { text: "صار عيني، يرجى تجربة إطفاء الواي فاي وتشغيل بيانات الهاتف (3G/4G) والمحاولة مرة أخرى.", isCorrect: true, feedback: "ممتاز! حل بديل وفعال لمشاكل الشبكة المعتادة." },
                                    { text: "انتظر لحد ما يتصلح الإنترنت", isCorrect: false, feedback: "رد سلبي لا يقدم حلولاً." },
                                    { text: "اتصل بشركة الإنترنت مالتك", isCorrect: false, feedback: "تهرب من تقديم الدعم الفني." }
                                ]
                            },
                            {
                                step: 3,
                                customerText: "فتحت على البيانات واشتغل فوراً! شكراً جزيلاً",
                                options: [
                                    { text: "الحمد لله عيني خطاب، بالخدمة دائماً. هل عندك أي استفسار آخر يخص خدمات زين كاش؟", isCorrect: true, feedback: "ممتاز! إغلاق التذكرة بترحيب ولطف." },
                                    { text: "عفواً، مع السلامة", isCorrect: false, feedback: "رد مختصر جداً." },
                                    { text: "سديت الموضوع", isCorrect: false, feedback: "غير مهذب." }
                                ]
                            }
                        ]
                    },
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer initiates WhatsApp chat." }] },
                        { role: 'model', parts: [{ text: "شنو سبب" }] }
                    ]
                }
            ];
        }
    }

    resetChats() {
        this.initChats();
        this.isLoading = false;
    }

    async sendMessage(chatId, text) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) throw new Error("Chat column not found");

        chat.history.push({
            role: 'user',
            parts: [{ text: text.trim() }]
        });

        await new Promise(r => setTimeout(r, 450));
        const replyText = zainNLPBrain.generateCustomerReply(chatId, chat.history, text, chat.customerName, chat.originalScenario);

        chat.history.push({
            role: 'model',
            parts: [{ text: replyText }]
        });

        return replyText;
    }

    async evaluateSession() {
        const transcript1 = this.chats[0].history
            .filter(h => !h.parts[0].text.startsWith('System:'))
            .map(h => `${h.role === 'user' ? 'Employee' : 'Customer'}: ${h.parts[0].text}`)
            .join('\n');
        
        const transcript2 = this.chats[1].history
            .filter(h => !h.parts[0].text.startsWith('System:'))
            .map(h => `${h.role === 'user' ? 'Employee' : 'Customer'}: ${h.parts[0].text}`)
            .join('\n');
        
        const transcript3 = this.chats[2].history
            .filter(h => !h.parts[0].text.startsWith('System:'))
            .map(h => `${h.role === 'user' ? 'Employee' : 'Customer'}: ${h.parts[0].text}`)
            .join('\n');

        const promptText = `Evaluate the employee's customer support transcripts.
        
Transcript 1 (Customer: Rahif Zaman, Channel: phone1, Topic: Mastercard refund delay):
${transcript1}

Transcript 2 (Customer: Ali, Channel: instagram, Topic: Google Play voucher double charge / code location):
${transcript2}

Transcript 3 (Customer: Khatab Omar, Channel: instagrampost, Topic: Bank card recharge failure reason):
${transcript3}`;

        const requestBody = {
            systemInstruction: {
                parts: [{ text: EVALUATOR_SYSTEM_PROMPT }]
            },
            contents: [
                { role: 'user', parts: [{ text: promptText }] }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2000,
                responseMimeType: "application/json"
            }
        };

        await new Promise(r => setTimeout(r, 600));
        return zainNLPBrain.evaluateMultitaskSession(this.chats);
    }
}


// =========================================================
// 🎨 UI Controller — User Interface for Single Sandbox
// =========================================================
(function () {
    let agent = null;
    let aiCurrentUser = null;

    document.addEventListener('DOMContentLoaded', () => {
        agent = new GeminiTrainerAgent();
        initAIAgentUI();
    });

    window.onAIUserLoggedIn = function (user) {
        aiCurrentUser = user;
        if (agent) agent.loadSettings();
    };

    let aiDisposedChats = {};
    let aiChatHistories = {};
    let aiScenariosList = [];

    window.onAITabActivated = function () {
        if (agent) agent.loadSettings();
        initAiAgentSimulator();
    };

    // ─────────────────────────────────────────────
    // UI Initialization
    // ─────────────────────────────────────────────
    const DISPOSITION_DATA = {
    "Inquiry": [
        "Agent & Shop Location",
        "Application Usage",
        "Become a agent & merchant",
        "E-Goods",
        "Forgot Wallet Number",
        "Government Bill Payment",
        "Wallet Top-up throught Visa or Master",
        "Merchant Wallet Linking",
        "Mastercard card top-up and transfer",
        "MasterCard Activation/Status",
        "MasterCard Limits & Fees",
        "MasterCard Order/ Delivery",
        "MasterCard Transaction",
        "Merchant Payment Service",
        "NBI Service",
        "Passport Upload for International TRX",
        "Top-Up Other Cards Using ZainCash Wallet",
        "Wallet Account Status",
        "Wallet Balance",
        "Wallet Cash-Out",
        "Wallet Limits & Fees",
        "Wallet Local Transfer",
        "Wallet Login",
        "Wallet PIN Reset or Change",
        "Wallet Registration Process",
        "Wallet Top-Up through Agent or Bank",
        "Western Union",
        "Zain IQ Recharge",
        "Wallet Change Number and Termination Process",
        "Inquiry About Outbound Call",
        "Change Wallet MSISDN(Korek)"
    ],
    "Request": [
        "Cancel Wallet Termination Request",
        "Card Statement",
        "Change Wallet MSISDN Status",
        "E-Goods PIN Send",
        "Lock / Unlock Wallet",
        "MasterCard Order Status - Delivery Schedule",
        "MasterCard Balance Refund Request",
        "Request Follow-up",
        "MasterCard Resend PIN",
        "Reset Wallet PIN",
        "Transaction Status Verification",
        "Update Customer Information & Documents",
        "Wallet Statement"
    ],
    "Complaint": [
        "Application Usage",
        "Cashback Issue",
        "E-Goods Other Issue",
        "E-Goods Redemption Failure",
        "Follow-up on Previous Escalation Ticket",
        "Government Bill Payment",
        "Local Transfer Failure",
        "MasterCard Activation Failure",
        "MasterCard Hold / Cancelled Card",
        "MasterCard International Transactions",
        "MasterCard Local Transactions",
        "MasterCard Negative Balance",
        "MasterCard Order or Delay Delivery",
        "MasterCard Top-up Transfer",
        "MasterCard Transaction Dispute",
        "Merchant Payment Failure",
        "NBI Link Issue",
        "Passport Upload",
        "Wallet Cash Disbursement",
        "Wallet Cash-out",
        "Wallet Change MSISDN",
        "Wallet Delay in Receiving OTP/PIN",
        "Wallet Limit-Fees",
        "Wallet Login Failure",
        "Wallet Registration",
        "Wallet Status",
        "Wallet Termination",
        "Wallet Top-up through Visa/Master",
        "Wallet Top-Up through Agent/Bank",
        "Western Union Add-Edit Beneficiary",
        "Western Union Received Money",
        "Western Union Refund Money",
        "Western Union Service on Hold",
        "WU Send Money",
        "Zain IQ Recharge",
        "IllegalAgentCharge"
    ],
    "Fraud & Security": [
        "Fraud or Scam",
        "Other Security Concern",
        "Suspicious Activity",
        "Unauthorized Transaction"
    ],
    "Customer Concern": [
        "Agent attitude",
        "Customer Care attitude",
        "Field Team attitude",
        "Process or Policy"
    ],
    "Support": [
        "English Support",
        "Kurdish Support",
        "Supervisor"
    ],
    "Incident": [
        "Application",
        "Hold Balance",
        "MasterCard",
        "Wallet Service Outage",
        "Western Union Outage"
    ],
    "Incomplete Contact": [
        "Disconnected Before Verification",
        "Disconnected During Conversation",
        "No Response",
        "Silent Call Only",
        "Spam / Junk",
        "Unclear Customer Request",
        "Traning & Test"
    ],
    "Social Media": [
        "Wallet / Application",
        "Mastercards (WalletCards)",
        "Western Union",
        "Digital Goods",
        "Cash-In by VISA/MC (HC)",
        "Zain IQ Top-Up",
        "Merchant Payment",
        "NBI",
        "GOV Bill Payment",
        "Report Fraud or Scam",
        "Junk",
        "Suggestion",
        "Positive Feedback",
        "Negative Feedback"
    ]
};

    function initAIAgentUI() {
        bindClick('btn-submit-ai-session', handleEvaluateAiSession);
        bindClick('btn-restart-ai-training-final', () => {
            const overlay = document.getElementById('ai-results-overlay');
            if (overlay) overlay.classList.add('hidden');
            initAiAgentSimulator();
        });

        bindClick('btn-save-ai-settings', handleSaveAISettings);
        bindClick('btn-test-api-key', handleTestAPIKey);
        bindClick('btn-reset-ai-prompt', handleResetPrompt);
        bindClick('btn-clear-ai-sessions', handleClearSessions);

        bindClick('btn-toggle-api-key', handleToggleKeyVisibility);

        loadAISettingsIntoAdminForm();
    }

    function bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    }

    // ─────────────────────────────────────────────
    // Session Handlers
    // ─────────────────────────────────────────────
    async function handleStartSession() {
        agent.loadSettings();
        if (!agent.apiKey) {
            showAIToast('Please configure Gemini API Key in the Admin Panel first', 'error');
            return;
        }

        // Fetch custom AI scenarios from server!
        let aiSc = null;
        if (window.apiCall) {
            try {
                aiSc = await window.apiCall('/api/ai-scenarios', 'GET');
            } catch (e) {
                console.error("Failed to load AI scenarios for AI Trainer", e);
            }
        }

        agent.setupDynamicPrompt(aiSc);

        // Reset selects
        const dispSelect = document.getElementById('ai-disp-select');
        const subDispSelect = document.getElementById('ai-sub-disp-select');
        if (dispSelect) dispSelect.value = '';
        if (subDispSelect) {
            subDispSelect.innerHTML = '<option value="">الموضوع الفرعي (Sub)</option>';
            subDispSelect.value = '';
        }

        const startScreen = document.getElementById('ai-start-screen');
        const chatArea = document.getElementById('ai-chat-area');
        const statsBar = document.getElementById('ai-stats-bar');
        const messagesContainer = document.getElementById('ai-chat-messages');

        if (startScreen) startScreen.classList.add('hidden');
        if (chatArea) chatArea.classList.remove('hidden');
        if (statsBar) statsBar.classList.remove('hidden');
        if (messagesContainer) messagesContainer.innerHTML = '';

        updateProgressUI(0, agent.totalScenarios || TOTAL_SCENARIOS);
        setInputEnabled(false);
        showTypingIndicator();

        try {
            const response = await agent.startSession();
            hideTypingIndicator();
            renderAgentMessage(response);
            setInputEnabled(true);
            focusInput();
        } catch (e) {
            hideTypingIndicator();
            renderErrorMessage(e.message);
        }
        scrollBottom();
    }

    async function handleSendMessage() {
        const inputEl = document.getElementById('ai-employee-input');
        if (!inputEl) return;

        const text = inputEl.value.trim();
        if (!text || agent.isLoading || agent.sessionEnded) return;

        // Force Ticket Classification!
        const dispSelect = document.getElementById('ai-disp-select');
        const subDispSelect = document.getElementById('ai-sub-disp-select');
        const mainDisp = dispSelect ? dispSelect.value : '';
        const subDisp = subDispSelect ? subDispSelect.value : '';

        if (!mainDisp || !subDisp) {
            showAIToast('⚠️ يرجى اختيار تصنيف التذكرة (الموضوع الرئيسي والفرعي) قبل إرسال إجابتك!', 'error');
            return;
        }

        inputEl.value = '';
        inputEl.style.height = 'auto';

        renderEmployeeMessage(text);
        scrollBottom();

        setInputEnabled(false);
        showTypingIndicator();

        const coachMsgText = text + `\n[تصنيف التذكرة: الموضوع الرئيسي: ${mainDisp} / الموضوع الفرعي: ${subDisp}]`;

        if (dispSelect) dispSelect.value = '';
        if (subDispSelect) {
            subDispSelect.innerHTML = '<option value="">الموضوع الفرعي (Sub)</option>';
            subDispSelect.value = '';
        }

        try {
            const response = await agent.sendMessage(coachMsgText);
            hideTypingIndicator();
            renderAgentMessage(response, agent.sessionEnded);
            scrollBottom();
            updateProgressUI(agent.getProgress().completed, agent.totalScenarios || TOTAL_SCENARIOS);

            if (agent.sessionEnded) {
                setInputEnabled(false);
                setTimeout(() => showFinalResultsOverlay(response), 1800);
            } else {
                setInputEnabled(true);
                focusInput();
            }
        } catch (e) {
            hideTypingIndicator();
            renderErrorMessage(e.message);
            setInputEnabled(true);
        }
    }

    function handleRestart() {
        agent.resetSession();

        const startScreen = document.getElementById('ai-start-screen');
        const chatArea = document.getElementById('ai-chat-area');
        const finalOverlay = document.getElementById('ai-final-overlay');
        const statsBar = document.getElementById('ai-stats-bar');
        const messagesContainer = document.getElementById('ai-chat-messages');

        if (startScreen) startScreen.classList.remove('hidden');
        if (chatArea) chatArea.classList.add('hidden');
        if (finalOverlay) finalOverlay.classList.add('hidden');
        if (statsBar) statsBar.classList.add('hidden');
        if (messagesContainer) messagesContainer.innerHTML = '';

        updateProgressUI(0, agent.totalScenarios || TOTAL_SCENARIOS);
    }

    // ─────────────────────────────────────────────
    // Message Rendering
    // ─────────────────────────────────────────────
    function renderAgentMessage(text, isFinalBlock = false) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const cleanText = text.replace('[[نهاية_التدريب]]', '').trim();

        const wrapper = document.createElement('div');
        wrapper.className = 'ai-msg-row agent-row';

        const evalSeparator = '───────────────────';
        if (cleanText.includes(evalSeparator)) {
            const parts = cleanText.split(evalSeparator);
            let html = '';

            parts.forEach(part => {
                const p = part.trim();
                if (!p) return;
                if (p.includes('📊 التقييم:') || p.includes('⭐ النقاط:')) {
                    html += `<div class="ai-eval-card">${formatMsgText(p)}</div>`;
                } else {
                    html += `<div class="ai-bubble agent-bubble">${formatMsgText(p)}</div>`;
                }
            });

            wrapper.innerHTML = `
                <div class="ai-avatar-icon agent-avatar-icon"><i class="fa-solid fa-user-ninja"></i></div>
                <div class="ai-msg-content">${html}</div>
            `;
        } else {
            wrapper.innerHTML = `
                <div class="ai-avatar-icon agent-avatar-icon"><i class="fa-solid fa-user-ninja"></i></div>
                <div class="ai-msg-content">
                    <div class="ai-bubble agent-bubble">${formatMsgText(cleanText)}</div>
                </div>
            `;
        }

        container.appendChild(wrapper);
    }

    function renderEmployeeMessage(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'ai-msg-row employee-row';
        wrapper.innerHTML = `
            <div class="ai-msg-content">
                <div class="ai-bubble employee-bubble">${escapeHtml(text)}</div>
            </div>
            <div class="ai-avatar-icon employee-avatar-icon"><i class="fa-solid fa-user-tie"></i></div>
        `;
        container.appendChild(wrapper);
    }

    function renderErrorMessage(msg) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const div = document.createElement('div');
        div.className = 'ai-error-banner';
        div.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>&nbsp; ${escapeHtml(msg).replace(/\n/g, '<br>')}`;
        container.appendChild(div);
        scrollBottom();
    }

    // ─────────────────────────────────────────────
    // Final Results Overlay
    // ─────────────────────────────────────────────
    function showFinalResultsOverlay(responseText) {
        const overlay = document.getElementById('ai-final-overlay');
        if (!overlay) return;

        const pctMatch = responseText.match(/النسبة:\s*(\d+)%/);
        const gradeMatch = responseText.match(/التقدير العام:\s*([^\n\r]+)/);
        const notesMatch = responseText.match(/الملاحظات:\s*([^\n\r]+)/);
        const totalMatch = responseText.match(/المجموع:\s*(\d+)\/\d+/);

        const pct = pctMatch ? pctMatch[1] : '?';
        const grade = gradeMatch ? gradeMatch[1].trim() : '?';
        const notes = notesMatch ? notesMatch[1].trim() : 'Thank you for participating!';
        const total = totalMatch ? totalMatch[1] : '?';
        const pctNum = parseInt(pct);

        let scoreColor = '#dc2626';
        if (pctNum >= 80) scoreColor = '#16a34a';
        else if (pctNum >= 60) scoreColor = '#d97706';

        const scoreEl = document.getElementById('ai-res-score');
        const gradeEl = document.getElementById('ai-res-grade');
        const notesEl = document.getElementById('ai-res-notes');
        const totalEl = document.getElementById('ai-res-total');

        const maxScore = (agent.totalScenarios || TOTAL_SCENARIOS) * 10;

        if (scoreEl) { scoreEl.textContent = pct + '%'; scoreEl.style.color = scoreColor; }
        if (gradeEl) gradeEl.textContent = grade;
        if (notesEl) notesEl.textContent = notes;
        if (totalEl) totalEl.textContent = total + '/' + maxScore;

        overlay.classList.remove('hidden');

        saveAISessionResult(pct, grade);
        loadAISessionsTable();
    }

    async function saveAISessionResult(score, grade) {
        let user = aiCurrentUser;
        if (!user) {
            try {
                const stored = sessionStorage.getItem('zain_cash_user');
                if (stored) user = JSON.parse(stored);
            } catch(e) {}
        }
        if (!user) return;

        const notesEl = document.getElementById('ai-res-notes-text');
        const resultData = {
            userId: user.id || '-',
            userName: user.name || '-',
            score: score,
            grade: grade,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            detailsHtml: notesEl ? notesEl.innerHTML : `التقييم النهائي: ${grade}`
        };

        try {
            const localAi = JSON.parse(localStorage.getItem('zain_ai_results') || '[]');
            localAi.push(resultData);
            localStorage.setItem('zain_ai_results', JSON.stringify(localAi));
        } catch(e) {}

        if (window.apiCall) {
            try {
                await window.apiCall('/api/ai-results', 'POST', resultData);
                console.log("AI session result successfully saved to database");
                
                if (window.isAiTestAssigned) {
                    let aiAssignments = await window.apiCall('/api/ai-assignments', 'GET');
                    aiAssignments = aiAssignments.filter(id => id !== user.id && id !== 'all');
                    await window.apiCall('/api/ai-assignments', 'POST', aiAssignments);
                    window.isAiTestAssigned = false;
                    if (window.checkTestAssignment) {
                        window.checkTestAssignment();
                    }
                }
            } catch (err) {
                console.error("Failed to post AI results to database", err);
            }
        }

        const key = 'amyo_ai_sessions';
        const stored = localStorage.getItem(key);
        const sessions = stored ? JSON.parse(stored) : [];
        sessions.push({
            ...resultData,
            date: new Date().toLocaleString()
        });
        if (sessions.length > 100) sessions.splice(0, sessions.length - 100);
        localStorage.setItem(key, JSON.stringify(sessions));
    }

    // ─────────────────────────────────────────────
    // Admin Settings Manager
    // ─────────────────────────────────────────────
    function loadAISettingsIntoAdminForm() {
        const keyInput = document.getElementById('ai-settings-api-key');
        const promptTextarea = document.getElementById('ai-settings-system-prompt');

        if (keyInput) {
            const savedKey = localStorage.getItem('amyo_gemini_api_key') || '';
            keyInput.value = savedKey;
            keyInput.dataset.changed = 'false';
        }
        if (promptTextarea) {
            promptTextarea.value = localStorage.getItem('amyo_gemini_system_prompt') || DEFAULT_AI_SYSTEM_PROMPT;
        }
        loadAISessionsTable();
    }

    function handleSaveAISettings() {
        const keyInput = document.getElementById('ai-settings-api-key');
        const promptTextarea = document.getElementById('ai-settings-system-prompt');

        let saved = false;

        if (keyInput && keyInput.dataset.changed === 'true') {
            const val = keyInput.value.trim();
            agent.saveApiKey(val);
            keyInput.dataset.changed = 'false';
            saved = true;
        }

        if (promptTextarea && promptTextarea.value.trim()) {
            agent.saveSystemPrompt(promptTextarea.value.trim());
            saved = true;
        }

        if (saved) {
            showAIToast('✅ Settings saved successfully!', 'success');
        } else {
            showAIToast('No changes detected. Enter a new API Key or edit the System Prompt.', 'info');
        }
    }

    async function handleTestAPIKey() {
        const keyInput = document.getElementById('ai-settings-api-key');
        const testBtn = document.getElementById('btn-test-api-key');
        const resultEl = document.getElementById('api-test-result');

        let keyStr = keyInput ? keyInput.value.trim() : '';
        if (!keyStr || keyStr.includes('●')) {
            keyStr = localStorage.getItem('amyo_gemini_api_key') || '';
        }

        const keys = keyStr.split(',').map(k => k.trim()).filter(Boolean);
        if (keys.length === 0) {
            if (resultEl) { resultEl.textContent = '❌ Enter API Key first'; resultEl.className = 'api-test-result error-result'; }
            return;
        }

        if (testBtn) { testBtn.disabled = true; testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...'; }
        if (resultEl) { resultEl.textContent = '⏳ Testing ' + keys.length + ' API key(s)...'; resultEl.className = 'api-test-result loading-result'; }

        let successCount = 0;
        let errors = [];

        for (let i = 0; i < keys.length; i++) {
            try {
                const testUrl = GEMINI_API_BASE + '?key=' + encodeURIComponent(keys[i]);
                const res = await fetch(testUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'Say hello.' }] }],
                        generationConfig: { maxOutputTokens: 10 }
                    })
                });

                if (res.ok) {
                    successCount++;
                } else {
                    const errData = await res.json().catch(() => ({}));
                    const msg = errData.error?.message || ('Error status: ' + res.status);
                    errors.push('Key #' + (i+1) + ': ' + msg);
                }
            } catch (e) {
                errors.push('Key #' + (i+1) + ': Connection failed');
            }
        }

        if (successCount === keys.length) {
            if (resultEl) { resultEl.textContent = '✅ All ' + keys.length + ' API keys are valid and working perfectly!'; resultEl.className = 'api-test-result success-result'; }
        } else if (successCount > 0) {
            if (resultEl) { resultEl.textContent = '⚠️ Partials: ' + successCount + '/' + keys.length + ' keys are valid. Errors: ' + errors.join(', '); resultEl.className = 'api-test-result error-result'; }
        } else {
            if (resultEl) { resultEl.textContent = '❌ All keys failed: ' + errors.join(' | '); resultEl.className = 'api-test-result error-result'; }
        }
        if (testBtn) { testBtn.disabled = false; testBtn.innerHTML = '<i class="fa-solid fa-plug-circle-check"></i> Test Connection'; }
    }

    function handleResetPrompt() {
        const promptTextarea = document.getElementById('ai-settings-system-prompt');
        if (promptTextarea) {
            promptTextarea.value = DEFAULT_AI_SYSTEM_PROMPT;
            showAIToast('Default System Prompt restored', 'info');
        }
    }

    function handleClearSessions() {
        if (confirm('Are you sure you want to delete all AI Agent sessions? This cannot be undone.')) {
            localStorage.removeItem('amyo_ai_sessions');
            loadAISessionsTable();
            showAIToast('All sessions cleared successfully', 'success');
        }
    }

    function handleToggleKeyVisibility() {
        const keyInput = document.getElementById('ai-settings-api-key');
        const toggleBtn = document.getElementById('btn-toggle-api-key');
        if (!keyInput || !toggleBtn) return;

        if (keyInput.type === 'password') {
            keyInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            keyInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    }

    // ─────────────────────────────────────────────
    // Table Log Render
    // ─────────────────────────────────────────────
    async function loadAISessionsTable() {
        const tbody = document.getElementById('ai-sessions-tbody');
        if (!tbody) return;

        let sessions = [];
        if (window.apiCall) {
            try {
                const serverSessions = await window.apiCall('/api/ai-results', 'GET');
                if (serverSessions && serverSessions.length > 0) {
                    sessions = serverSessions.map(s => ({
                        userId: s.userId,
                        userName: s.userName,
                        score: s.score,
                        grade: s.grade,
                        date: s.date ? new Date(s.date.replace(/-/g, '/')).toLocaleString() : '-'
                    }));
                }
            } catch (e) {
                console.warn("Failed to load AI sessions from server, falling back to localStorage", e);
            }
        }

        if (sessions.length === 0) {
            const stored = localStorage.getItem('amyo_ai_sessions');
            sessions = stored ? JSON.parse(stored) : [];
        }

        if (sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data-cell"><i class="fa-solid fa-folder-open"></i>&nbsp; No sessions recorded yet</td></tr>';
            return;
        }

        tbody.innerHTML = [...sessions].reverse().slice(0, 50).map(s => {
            const pct = parseInt(s.score) || 0;
            let badgeClass = 'badge-needs-work';
            if (pct >= 80) badgeClass = 'badge-excellent';
            else if (pct >= 60) badgeClass = 'badge-good';

            return `<tr>
                <td style="font-family:var(--font-en);font-weight:700">${escapeHtml(String(s.userId))}</td>
                <td>${escapeHtml(String(s.userName))}</td>
                <td><strong>${escapeHtml(String(s.score))}%</strong></td>
                <td><span class="ai-grade-badge ${badgeClass}">${escapeHtml(String(s.grade))}</span></td>
                <td style="font-size:0.82rem;color:var(--text-muted)">${escapeHtml(String(s.date))}</td>
            </tr>`;
        }).join('');
    }

    // ─────────────────────────────────────────────
    // UI Helpers
    // ─────────────────────────────────────────────
    function updateProgressUI(completed, total) {
        const fillEl = document.getElementById('ai-progress-fill');
        const labelEl = document.getElementById('ai-progress-label');
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        if (fillEl) fillEl.style.width = pct + '%';
        if (labelEl) labelEl.textContent = `${completed} / ${total} Scenarios`;
    }

    function showTypingIndicator() {
        const el = document.getElementById('ai-typing-indicator');
        if (el) el.classList.remove('hidden');
        scrollBottom();
    }

    function hideTypingIndicator() {
        const el = document.getElementById('ai-typing-indicator');
        if (el) el.classList.add('hidden');
    }

    function setInputEnabled(enabled) {
        const input = document.getElementById('ai-employee-input');
        const btn = document.getElementById('ai-send-btn');
        if (input) input.disabled = !enabled;
        if (btn) btn.disabled = !enabled;
    }

    function focusInput() {
        const input = document.getElementById('ai-employee-input');
        if (input) input.focus();
    }

    function scrollBottom() {
        const container = document.getElementById('ai-chat-messages');
        if (container) {
            setTimeout(() => { container.scrollTop = container.scrollHeight; }, 80);
        }
    }

    function showNoKeyWarning() {
        const startBtn = document.getElementById('ai-start-btn');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fa-solid fa-key"></i> Enter API Key in Admin Panel first';
            startBtn.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)';
        }
    }

    function hideNoKeyWarning() {
        const startBtn = document.getElementById('ai-start-btn');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fa-solid fa-robot"></i> Start Practice Session';
            startBtn.style.background = '';
        }
    }

    function formatMsgText(text) {
        return escapeHtml(text)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    }

    function showAIToast(message, type = 'success') {
        const existing = document.getElementById('ai-toast-popup');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'ai-toast-popup';
        toast.className = `ai-toast-popup ai-toast-${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('visible'));
        });

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
        }, 3000);
    }

    window.askKnowledgeBaseAI = async function(userMessage, conversationHistory, articles) {
        const articlesContext = articles.map(a => `
مقال: ${a.title} (الفئة: ${a.category})
المحتوى:
${a.content}
التصنيف المعتمد: الرئيسي [${a.correctDisp || 'غير محدد'}] / الفرعي [${a.correctSubDisp || 'غير محدد'}]
الكتابة المفتاحية: ${a.keywords || ''}
---
`).join('\n');

        const systemPrompt = `
أنت المساعد الذكي لخدمة عملاء زين كاش (Zain Cash).
مهمتك هي الإجابة على أسئلة الموظفين بالعامية العراقية وبأسلوب مهذب ومباشر ومختصر ومفيد جداً.
معلومات وقواعد مهمة:
- يجب أن تجيب على السؤال بالاعتماد **فقط** على المقالات المعرفية المرفقة أدناه.
- **لا تذكر أبداً أي تفاصيل إضافية مثل التصنيف المعتمد (Main & Sub Disposition) أو فئة المقال**، فقط قدم الإجابة والخطوات العملية بشكل مباشر ومختصر ومفيد جداً للموظف.
- إذا لم تكن الإجابة موجودة في المقالات المعرفية المرفقة، قل للموظف بلطف وبلهجة عراقية: "عذراً عيني، هالمعلومة ما متوفرة حالياً بدليل المعرفة الخاص بي."

دليل المقالات المعرفية المتاحة:
${articlesContext}
`;

        // Construct request body for Gemini
        const contents = [];
        // Add history
        conversationHistory.forEach(h => {
            contents.push({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            });
        });
        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const requestBody = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800
            }
        };

        try {
            const response = await fetchWithRotation(requestBody);
            const resJson = await response.json();
            const responseText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!responseText) {
                throw new Error('Empty response from Gemini');
            }
            return responseText;
        } catch (e) {
            console.error("Gemini KB Assistant failed", e);
            throw e;
        }
    };

    // ==========================================
    // MULTITASK LIVE AI COACH ENGINE
    // ==========================================
    async function initAiAgentSimulator() {
        const apiKey = localStorage.getItem('amyo_gemini_api_key') || '';
        if (!apiKey) {
            showAIToast('⚠️ يرجى ضبط مفتاح API الخاص بـ Gemini في إعدادات المسؤول لتفعيل الردود الذكية!', 'warning');
            // Don't return — still show the grid so the UI is visible
        }

        let scenarios = [];
        if (window.apiCall) {
            try {
                scenarios = await window.apiCall('/api/ai-scenarios', 'GET');
            } catch(e) {
                console.error("Failed to load AI scenarios", e);
            }
        }

        if (!scenarios || scenarios.length === 0) {
            scenarios = defaultAiScenarios;
        }

        aiScenariosList = scenarios;
        aiDisposedChats = {};
        aiChatHistories = {};

        const grid = document.getElementById('ai-multitask-chat-grid');
        if (grid) {
            grid.innerHTML = '';
            scenarios.forEach((chat, idx) => {
                const i = idx + 1;
                aiDisposedChats[i] = false;
                
                aiChatHistories[i] = [
                    { role: 'user', parts: [{ text: `System: Customer initiates live AI chat.` }] },
                    { role: 'model', parts: [{ text: chat.initialMessage || 'مرحباً' }] }
                ];

                const colHtml = generateAiChatColumnHtml(chat, i);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = colHtml.trim();
                const colEl = tempDiv.firstChild;
                grid.appendChild(colEl);
            });
        }

        const chatWindows = document.querySelectorAll('#ai-multitask-chat-grid .floating-chat-window');
        chatWindows.forEach(win => {
            win.addEventListener('click', () => {
                chatWindows.forEach(w => w.classList.remove('active-window'));
                win.classList.add('active-window');
            });
        });
        if (chatWindows[0]) chatWindows[0].classList.add('active-window');

                for (let i = 1; i <= scenarios.length; i++) {
            const inputEl = document.getElementById(`ai-chat-input-${i}`);
            const sendBtn = document.getElementById(`ai-chat-send-${i}`);
            const closeBtn = document.getElementById(`ai-chat-close-${i}`);
            const backBtn = document.getElementById(`ai-chat-back-${i}`);
            const profileBtn = document.getElementById(`ai-chat-profile-${i}`);
            
            const dispPanel = document.getElementById(`ai-disposition-panel-${i}`);
            const profPanel = document.getElementById(`ai-profile-panel-${i}`);

            const dispBlock = document.getElementById(`ai-disp-block-${i}`);
            const dispTrigger = document.getElementById(`ai-disp-select-trigger-${i}`);
            const dispText = document.getElementById(`ai-disp-selected-text-${i}`);
            const dispPopup = document.getElementById(`ai-disp-popup-${i}`);
            const dispSearch = document.getElementById(`ai-disp-search-${i}`);
            const dispList = document.getElementById(`ai-disp-list-${i}`);

            const subDispBlock = document.getElementById(`ai-sub-disp-block-${i}`);
            const subDispTrigger = document.getElementById(`ai-sub-disp-select-trigger-${i}`);
            const subDispText = document.getElementById(`ai-sub-disp-selected-text-${i}`);
            const subDispPopup = document.getElementById(`ai-sub-disp-popup-${i}`);
            const subDispSearch = document.getElementById(`ai-sub-disp-search-${i}`);
            const subDispList = document.getElementById(`ai-sub-disp-list-${i}`);

            const saveBtn = document.getElementById(`ai-btn-save-dispose-${i}`);
            const quickButtons = document.querySelectorAll(`.ai-quick-disp-btn[data-chat="${i}"]`);

            let currentDisp = '';
            let currentSubDisp = '';

            const checkValidity = () => {
                if (currentDisp && currentSubDisp) {
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.classList.add('active');
                    }
                } else {
                    if (saveBtn) {
                        saveBtn.disabled = true;
                        saveBtn.classList.remove('active');
                    }
                }
            };

            const populateDispOptions = (filter = '') => {
                if (!dispList) return;
                const query = filter.toLowerCase().trim();
                const categories = Object.keys(DISPOSITION_DATA);
                const filtered = categories.filter(c => c.toLowerCase().includes(query));

                let html = `<div class="disp-dropdown-item ${!currentDisp ? 'selected' : ''}" data-val="">Select a Disposition</div>`;
                filtered.forEach(c => {
                    html += `<div class="disp-dropdown-item ${currentDisp === c ? 'selected' : ''}" data-val="${c}">${c}</div>`;
                });
                dispList.innerHTML = html;

                dispList.querySelectorAll('.disp-dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const val = item.getAttribute('data-val');
                        currentDisp = val;
                        quickButtons.forEach(b => b.classList.remove('active'));

                        if (dispText) {
                            dispText.textContent = val || 'Select a Disposition';
                            if (val) dispTrigger.classList.add('has-value');
                            else dispTrigger.classList.remove('has-value');
                        }
                        closePopups();

                        // Reset sub disposition
                        currentSubDisp = '';
                        if (subDispText) {
                            subDispText.textContent = 'Select a Sub Disposition';
                            subDispTrigger.classList.remove('has-value');
                        }
                        checkValidity();

                        // Automatically open Sub Disposition popup
                        if (val) {
                            setTimeout(() => {
                                openSubDispPopup();
                            }, 50);
                        }
                    });
                });
            };

            const populateSubDispOptions = (filter = '') => {
                if (!subDispList) return;
                const query = filter.toLowerCase().trim();
                let options = [];

                if (currentDisp && DISPOSITION_DATA[currentDisp]) {
                    options = DISPOSITION_DATA[currentDisp].map(s => ({ disp: currentDisp, sub: s }));
                } else {
                    Object.keys(DISPOSITION_DATA).forEach(d => {
                        DISPOSITION_DATA[d].forEach(s => {
                            options.push({ disp: d, sub: s });
                        });
                    });
                }

                const filtered = options.filter(o => o.sub.toLowerCase().includes(query));
                let html = `<div class="disp-dropdown-item ${!currentSubDisp ? 'selected' : ''}" data-disp="" data-sub="">Select a Sub Disposition</div>`;
                filtered.forEach(o => {
                    html += `<div class="disp-dropdown-item ${currentSubDisp === o.sub ? 'selected' : ''}" data-disp="${o.disp}" data-sub="${o.sub}">${o.sub}</div>`;
                });
                subDispList.innerHTML = html;

                subDispList.querySelectorAll('.disp-dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const sub = item.getAttribute('data-sub');
                        const disp = item.getAttribute('data-disp');
                        currentSubDisp = sub;
                        quickButtons.forEach(b => b.classList.remove('active'));

                        if (sub) {
                            if (!currentDisp && disp) {
                                currentDisp = disp;
                                if (dispText) {
                                    dispText.textContent = disp;
                                    dispTrigger.classList.add('has-value');
                                }
                            }
                            if (subDispText) {
                                subDispText.textContent = sub;
                                subDispTrigger.classList.add('has-value');
                            }
                        } else {
                            if (subDispText) {
                                subDispText.textContent = 'Select a Sub Disposition';
                                subDispTrigger.classList.remove('has-value');
                            }
                        }
                        closePopups();
                        checkValidity();
                    });
                });
            };

            const closePopups = () => {
                if (dispPopup) dispPopup.classList.add('hidden');
                if (dispBlock) dispBlock.classList.remove('open');
                if (subDispPopup) subDispPopup.classList.add('hidden');
                if (subDispBlock) subDispBlock.classList.remove('open');
            };

            const openDispPopup = () => {
                closePopups();
                populateDispOptions('');
                if (dispPopup) dispPopup.classList.remove('hidden');
                if (dispBlock) dispBlock.classList.add('open');
                if (dispSearch) {
                    dispSearch.value = '';
                    setTimeout(() => dispSearch.focus(), 30);
                }
            };

            const openSubDispPopup = () => {
                closePopups();
                populateSubDispOptions('');
                if (subDispPopup) subDispPopup.classList.remove('hidden');
                if (subDispBlock) subDispBlock.classList.add('open');
                if (subDispSearch) {
                    subDispSearch.value = '';
                    setTimeout(() => subDispSearch.focus(), 30);
                }
            };

            if (dispTrigger) {
                dispTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (dispPopup && !dispPopup.classList.contains('hidden')) {
                        closePopups();
                    } else {
                        openDispPopup();
                    }
                });
            }

            if (subDispTrigger) {
                subDispTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (subDispPopup && !subDispPopup.classList.contains('hidden')) {
                        closePopups();
                    } else {
                        openSubDispPopup();
                    }
                });
            }

            if (dispSearch) {
                dispSearch.addEventListener('input', () => {
                    populateDispOptions(dispSearch.value);
                });
                dispSearch.addEventListener('click', (e) => e.stopPropagation());
            }

            if (subDispSearch) {
                subDispSearch.addEventListener('input', () => {
                    populateSubDispOptions(subDispSearch.value);
                });
                subDispSearch.addEventListener('click', (e) => e.stopPropagation());
            }

            document.addEventListener('click', () => {
                closePopups();
            });

            if (inputEl && isAi) {
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiSendMessage(i);
                    }
                });
            }

            if (sendBtn && isAi) {
                sendBtn.addEventListener('click', () => {
                    handleAiSendMessage(i);
                });
            }

            quickButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const dispVal = btn.getAttribute('data-disp');
                    const subVal = btn.getAttribute('data-sub');

                    currentDisp = dispVal;
                    currentSubDisp = subVal;

                    if (dispText) {
                        dispText.textContent = dispVal;
                        dispTrigger.classList.add('has-value');
                    }
                    if (subDispText) {
                        subDispText.textContent = subVal;
                        subDispTrigger.classList.add('has-value');
                    }

                    quickButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    closePopups();
                    checkValidity();
                });
            });

            if (closeBtn && dispPanel) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (aiDisposedChats[i]) return;
                    dispPanel.classList.toggle('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (profileBtn && profPanel) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profPanel.classList.toggle('hidden');
                    if (dispPanel) dispPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (dispPanel) dispPanel.classList.add('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (currentDisp && currentSubDisp) {
                        aiDisposedChats[i] = true;
                        aiUserDispositions[i] = { disp: currentDisp, subDisp: currentSubDisp };
                        
                        if (dispPanel) dispPanel.classList.add('hidden');
                        
                        const disposedOverlay = document.getElementById(`ai-disposed-overlay-${i}`);
                        if (disposedOverlay) {
                            disposedOverlay.classList.remove('hidden');
                        }
                        
                        const aiInp = document.getElementById(`ai-chat-input-${i}`);
                        if (aiInp) {
                            aiInp.disabled = true;
                            aiInp.placeholder = 'Chat resolved and disposed.';
                        }
                        
                        showAIToast(`Chat ${i} disposed successfully.`, 'success');
                    }
                });
            }
        }
    }

    function generateAiChatColumnHtml(chat, i) {
        let iconHtml = '<i class="fa-brands fa-whatsapp whatsapp-icon" style="color: #25d366;"></i>';
        let channelName = 'WhatsApp Chat';
        let channelBadge = `phone${i}`;

        const initialMsg = chat.initialMessage || 'مرحباً';

        return `
        <div class="chat-column">
            <div class="column-meta-info">
                <span class="meta-channel">${channelBadge}</span>
                <span class="meta-detail">${channelName}</span>
            </div>
            <div class="floating-chat-window static-window">
                <div class="chat-header">
                    <div class="chat-header-left">
                        ${iconHtml}
                        <span class="chat-customer-name">${escapeHtml(chat.customerName)}</span>
                        <span class="status-dot online"></span>
                    </div>
                    <div class="chat-header-right">
                        <i class="fa-solid fa-arrow-right-left" id="ai-chat-back-${i}" style="cursor:pointer;" title="Back to Chat"></i>
                        <i class="fa-solid fa-user" id="ai-chat-profile-${i}" style="cursor:pointer;" title="Customer Profile"></i>
                        <i class="fa-solid fa-xmark" id="ai-chat-close-${i}" style="cursor:pointer;" title="Close & Dispose"></i>
                    </div>
                </div>
                <div class="chat-body" id="ai-chat-body-${i}">
                    <div class="system-message">
                        <span>[Session started via ${channelName}]</span>
                    </div>
                    <div class="system-message">
                        <span>نبرة الزبون: ${escapeHtml(chat.customerTone || 'اعتيادية')}</span>
                    </div>
                    <div class="message message-customer">
                        <p>${escapeHtml(initialMsg)}</p>
                        <span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
                <div class="typing-indicator-wrapper hidden" id="ai-typing-indicator-${i}">
                    <div class="typing-bubble">
                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    </div>
                </div>
                <div class="chat-footer-mock live-footer" style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background: #f8fafc; border-top: 1px solid #e2e8f0; height: auto; min-height: 120px; align-items: stretch;">
                    <textarea class="live-chat-input" id="ai-chat-input-${i}" placeholder="اكتب ردك هنا... (Enter للإرسال)" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; resize: none; min-height: 50px; outline: none; font-family: var(--font-ar); direction: rtl; text-align: right;"></textarea>
                    <div style="display: flex; justify-content: flex-end; width: 100%;">
                        <button class="btn btn-primary" id="ai-chat-send-${i}" style="padding: 4px 12px; font-size: 0.75rem; border-radius: 6px;">إرسال</button>
                    </div>
                </div>

                <!-- Customer Profile Panel -->
                <div class="profile-panel hidden" id="ai-profile-panel-${i}">
                    <div class="profile-form">
                        <div class="profile-field">
                            <label>الاسم</label>
                            <div class="profile-value">
                                ${iconHtml}
                                <span>${escapeHtml(chat.customerName)}</span>
                            </div>
                        </div>
                        <div class="profile-field">
                            <label>النبرة</label>
                            <div class="profile-value">${escapeHtml(chat.customerTone || 'اعتيادي')}</div>
                        </div>
                        <div class="profile-field">
                            <label>الهاتف</label>
                            <div class="profile-value">9647700000${i}</div>
                        </div>
                    </div>
                </div>

                <!-- Disposition Panel -->
                <div class="disposition-panel hidden" id="ai-disposition-panel-${i}">
                    <div class="disposition-form">
                        <div class="disp-field-block" id="ai-disp-block-${i}">
                            <label class="disp-field-label">Disposition</label>
                            <div class="disp-custom-select" id="ai-disp-select-trigger-${i}">
                                <span id="ai-disp-selected-text-${i}">Select a Disposition</span>
                                <i class="fa-solid fa-chevron-down disp-chevron"></i>
                            </div>
                            <div class="disp-dropdown-popup hidden" id="ai-disp-popup-${i}">
                                <div class="disp-dropdown-search-wrap">
                                    <input type="text" class="disp-dropdown-search-input" id="ai-disp-search-${i}" placeholder="" autocomplete="off">
                                </div>
                                <div class="disp-dropdown-list" id="ai-disp-list-${i}"></div>
                            </div>
                        </div>

                        <div class="disp-field-block" id="ai-sub-disp-block-${i}">
                            <label class="disp-field-label">Sub Disposition</label>
                            <div class="disp-custom-select" id="ai-sub-disp-select-trigger-${i}">
                                <span id="ai-sub-disp-selected-text-${i}">Select a Sub Disposition</span>
                                <i class="fa-solid fa-chevron-down disp-chevron"></i>
                            </div>
                            <div class="disp-dropdown-popup hidden" id="ai-sub-disp-popup-${i}">
                                <div class="disp-dropdown-search-wrap">
                                    <input type="text" class="disp-dropdown-search-input" id="ai-sub-disp-search-${i}" placeholder="" autocomplete="off">
                                </div>
                                <div class="disp-dropdown-list" id="ai-sub-disp-list-${i}"></div>
                            </div>
                        </div>

                        <div class="disp-dotted-divider"></div>

                        <div class="quick-dispositions-grid">
                            <button type="button" class="ai-quick-disp-btn" data-chat="${i}" data-disp="Inquiry" data-sub="Application Usage">Application Usage</button>
                            <button type="button" class="ai-quick-disp-btn" data-chat="${i}" data-disp="Complaint" data-sub="Local Transfer Failure">Local Transfer Failure</button>
                            <button type="button" class="ai-quick-disp-btn" data-chat="${i}" data-disp="Incomplete Contact" data-sub="Spam / Junk">Spam / Junk</button>
                            <button type="button" class="ai-quick-disp-btn" data-chat="${i}" data-disp="Inquiry" data-sub="Wallet Balance">Wallet Balance</button>
                        </div>

                        <div class="ticket-status-row">
                            <span class="section-title">Ticket</span>
                            <div class="ticket-pills">
                                <span class="ticket-pill active"><i class="fa-solid fa-check"></i> New Ticket</span>
                            </div>
                            <button type="button" class="btn-link-tickets" disabled>Link with Existing Tickets</button>
                        </div>

                        <button type="button" class="btn-save-dispose" id="ai-btn-save-dispose-${i}" disabled>Save and Dispose</button>
                    </div>
                </div>

                <!-- Disposed Overlay -->
                <div class="disposed-overlay hidden" id="ai-disposed-overlay-${i}">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>تم تصنيف وإغلاق التذكرة</h3>
                    <p>المحادثة منتهية ومحفوظة بنجاح.</p>
                </div>
            </div>
        </div>
        `;
    }

    async function handleAiSendMessage(chatId) {
        if (aiDisposedChats[chatId]) {
            showAIToast("This chat is resolved and closed.", "error");
            return;
        }

        const inputEl = document.getElementById(`ai-chat-input-${chatId}`);
        const chatBody = document.getElementById(`ai-chat-body-${chatId}`);
        const typingIndicator = document.getElementById(`ai-typing-indicator-${chatId}`);

        if (!inputEl || !chatBody) return;

        const text = inputEl.value.trim();
        if (!text) return;

        inputEl.value = '';
        inputEl.disabled = true;

        const empMsgEl = document.createElement('div');
        empMsgEl.className = 'message message-employee';
        empMsgEl.innerHTML = `<p>${escapeHtml(text)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
        chatBody.appendChild(empMsgEl);
        chatBody.scrollTop = chatBody.scrollHeight;

        if (typingIndicator) typingIndicator.classList.remove('hidden');
        chatBody.scrollTop = chatBody.scrollHeight;

        aiChatHistories[chatId].push({
            role: 'user',
            parts: [{ text: text }]
        });

        const sc = aiScenariosList[chatId - 1];
        const homePageUrl = window.location.origin;
        const systemInstructionText = `أنت الزبون "${sc.customerName}"، تتواصل مع دعم زين كاش في العراق.
نبرتك وشخصيتك: ${sc.customerTone || 'اعتيادية'}.
قصتك ومشكلتك الأساسية: ${sc.initialMessage}.
قواعد الرد الصارمة:
- فكر وتأمل بعمق وذكاء كإنسان عراقي حقيقي قبل كل إجابة، وحلل جودة ردود الموظف.
- تقمص دور هذا الزبون بالكامل وبلهجة عراقية دارجة تماماً (مثل: عيني، فدوة، ما صار، بلا زحمة).
- لا تخرج عن نطاق مشكلتك وعن المعلومات المتوفرة في المقالات.
- اختبر يقظة ومعرفة الموظف بذكاء؛ ولا تفصح له عن معلوماتك السرية أو رقم محفظتك مباشرة إلا إذا طلبها بطريقة رسمية تتماشى مع السياسة.
- اجعل ردودك معقولة وتلقائية وتفاعلية لتوفير تجربة اختبار ذكية.
- ⚠️ إذا كتب لك الموظف أي كلام غير مفهوم أو خارج سياق مشكلتك، رد عليه كزبون منزعج أو متعجب باللهجة العراقية مستنكراً ذلك بذكاء.
`;

        const requestBody = {
            systemInstruction: {
                parts: [{ text: systemInstructionText }]
            },
            contents: aiChatHistories[chatId],
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 300,
                topP: 0.9
            }
        };

        try {
            const response = await fetchWithRotation(requestBody);
            const data = await response.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!replyText) throw new Error("لم يستجب نموذج الذكاء الاصطناعي");

            aiChatHistories[chatId].push({
                role: 'model',
                parts: [{ text: replyText }]
            });

            if (typingIndicator) typingIndicator.classList.add('hidden');

            const custMsgEl = document.createElement('div');
            custMsgEl.className = 'message message-customer';
            custMsgEl.innerHTML = `<p>${escapeHtml(replyText)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
            chatBody.appendChild(custMsgEl);
            chatBody.scrollTop = chatBody.scrollHeight;

        } catch (err) {
            if (typingIndicator) typingIndicator.classList.add('hidden');
            const errMsgEl = document.createElement('div');
            errMsgEl.className = 'system-message';
            errMsgEl.innerHTML = `<span style="color: var(--error);">Error: ${escapeHtml(err.message)}</span>`;
            chatBody.appendChild(errMsgEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        } finally {
            inputEl.disabled = false;
            inputEl.focus();
        }
    }

    async function handleEvaluateAiSession() {
        const totalChats = aiScenariosList.length;
        for (let i = 1; i <= totalChats; i++) {
            if (!aiDisposedChats[i]) {
                showAIToast('يرجى تصنيف وإغلاق كافة التذاكر الثلاثة قبل تقديم التقييم!', 'error');
                return;
            }
        }

        const submitBtn = document.getElementById('btn-submit-ai-session');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Evaluating...';
        }

        showAIToast('جاري تحليل المحادثات الحية بواسطة خبير التقييم الذكي...', 'info');

        try {
            let evaluationPrompt = `أنت خبير تقييم موظفي خدمة عملاء زين كاش في العراق.
يرجى تقييم أداء الموظف في 3 محادثات حية جرت مع زبائن ذكاء اصطناعي.

المعايير المحددة للتقييم:
`;

            for (let i = 1; i <= totalChats; i++) {
                const sc = aiScenariosList[i - 1];
                const selectedDisp = document.getElementById(`ai-disp-select-${i}`)?.value || '';
                const selectedSub = document.getElementById(`ai-sub-disp-select-${i}`)?.value || '';

                const transcript = aiChatHistories[i]
                    .filter(h => !h.parts[0].text.startsWith('System:'))
                    .map(h => `${h.role === 'user' ? 'الموظف' : 'الزبون'}: ${h.parts[0].text}`)
                    .join('\n');

                evaluationPrompt += `
الزبون ${i}: ${sc.customerName}
التصنيف المتوقع: الرئيسي="${sc.correctDisp}"، الفرعي="${sc.correctSubDisp}"
التصنيف الذي اختاره الموظف: الرئيسي="${selectedDisp}"، الفرعي="${selectedSub}"
مجرى المحادثة الحية:
${transcript}
───────────────────
`;
            }

            evaluationPrompt += `
يرجى احتساب درجة التقييم الكلية (من 0 إلى 100) بناءً على:
1. جودة الحوار والرد المهذب واللهجة العراقية ومساعدة الزبون.
2. دقة تصنيف التذاكر.

يجب أن تكون المخرجات عبارة عن نص JSON صالح ومطابق تماماً للهيكل التالي بدون أي نصوص خارج القوسين:
{
  "overallScore": 85,
  "grade": "جيد جداً",
  "notes": "التقرير التفصيلي باللغة العربية يوضح نقاط القوة والضعف لكل زبون وتصحيح الأخطاء بالتفصيل."
}
`;

            const requestBody = {
                contents: [
                    { role: 'user', parts: [{ text: evaluationPrompt }] }
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1500,
                    responseMimeType: "application/json"
                }
            };

            const response = await fetchWithRotation(requestBody);
            const data = await response.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!replyText) throw new Error("No response from evaluation agent");

            let evaluation;
            try {
                evaluation = JSON.parse(replyText.trim());
            } catch(e) {
                const jsonMatch = replyText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    evaluation = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("فشل في تحليل نتائج التقييم");
                }
            }

            const scoreEl = document.getElementById('ai-res-score');
            const gradeEl = document.getElementById('ai-res-grade');
            const notesEl = document.getElementById('ai-res-notes-text');
            const overlay = document.getElementById('ai-results-overlay');

            if (scoreEl) scoreEl.textContent = `${evaluation.overallScore}%`;
            if (gradeEl) {
                gradeEl.textContent = evaluation.grade;
                if (evaluation.overallScore >= 75) gradeEl.className = 'res-val text-green';
                else if (evaluation.overallScore >= 60) gradeEl.className = 'res-val text-gradient';
                else gradeEl.className = 'res-val text-red';
            }
            if (notesEl) {
                notesEl.innerHTML = evaluation.notes.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }

            if (overlay) overlay.classList.remove('hidden');

            const userStr = localStorage.getItem('amyo_user');
            const currentUser = userStr ? JSON.parse(userStr) : null;
            if (currentUser) {
                const resultData = {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    score: evaluation.overallScore,
                    errorsCount: 0,
                    grade: evaluation.grade,
                    detailsHtml: notesEl ? notesEl.innerHTML : evaluation.notes
                };
                try {
                    await window.apiCall('/api/ai-results', 'POST', resultData);
                    
                    if (window.isAiTestAssigned) {
                        await window.apiCall('/api/test-session/complete', 'POST', { userId: currentUser.id, testType: 'ai-agent' });
                        if (window.testTimerInterval) clearInterval(window.testTimerInterval);
                        const timerBanner = document.getElementById('test-timer-banner');
                        if (timerBanner) timerBanner.classList.add('hidden');
                        if (window.checkTestAssignment) {
                            await window.checkTestAssignment();
                        }
                    }
                } catch(e) {
                    console.error("Failed to save AI results to server", e);
                }
            }

        } catch (err) {
            showAIToast('Evaluation failed: ' + err.message, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> Submit AI Session & Get Evaluation';
            }
        }
    }

    function showAIToast(message, type = 'success') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`[AI Toast] ${type}: ${message}`);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const keyInput = document.getElementById('ai-settings-api-key');
        if (keyInput) {
            keyInput.addEventListener('input', () => {
                keyInput.dataset.changed = 'true';
            });
        }
    });

})();

// --- Expose classes globally ---
window.GeminiTrainerAgent = GeminiTrainerAgent;
window.MultiChatAgent = MultiChatAgent;
