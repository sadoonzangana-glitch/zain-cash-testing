// =========================================================
// ai-agent.js — AI Agent with Gemini API (Amyo System - Zain Cash)
// =========================================================

'use strict';

// --- Gemini API Settings ---
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';
const TOTAL_SCENARIOS = 4;

// --- System Prompt for Single AI Sandbox ---
const DEFAULT_AI_SYSTEM_PROMPT = `You are the "Strict Coach" — a professional training expert for Zain Cash customer care agents in Iraq.

🎯 Your Goal: Conduct an interactive training session with the employee across 4 realistic Zain Cash scenarios, and grade their performance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Workflow (Follow strictly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 — Start:
When the user says "ابدأ التدريب", greet them in one short sentence, then present Scenario 1 immediately.

Step 2 — Present Scenario:
Write the scenario in this exact literal format:
🎭 السيناريو [Number] من 4:
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

Step 5 — End of Session:
After grading Scenario 4, write: [[نهاية_التدريب]]
Then write the final report:
📋 التقرير النهائي:
المجموع: [X]/40
النسبة: [Y]%
التقدير العام: [ممتاز / جيد / يحتاج تحسين]
الملاحظات: [general constructive feedback in 2 sentences]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 The 4 Scenarios (Use in order):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scenario 1: Customer Mohammad says: "تجمدت بطاقة الماستر تبعتي"
Scenario 2: Customer Hassan says: "أريد أحول 50 ألف دينار لأخوي بس رصيدي بس 30 ألف"
Scenario 3: Customer Fatima says: "أرسلت كاش من 3 أيام لرقم معين وما وصله لحد الآن"
Scenario 4: Customer Karim says: "ما أعرف كيف أشحن المحفظة، وضحلي"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 Grading Criteria (10 points per scenario):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Welcoming the customer by name: 2 points
• Using professional Iraqi Arabic dialect: 2 points
• Conciseness and clarity: 2 points
• Providing a clear resolution or helpful question: 3 points
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
            const requestBody = {
                systemInstruction: {
                    parts: [{ text: this.systemPrompt }]
                },
                contents: this.conversationHistory,
                generationConfig: {
                    temperature: 0.75,
                    maxOutputTokens: 2000,
                    topP: 0.9
                }
            };

            const response = await fetchWithRotation(requestBody);
            const data = await response.json();

            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('No response received from Gemini. Try again.');
            }

            const agentText = data.candidates[0].content.parts[0].text;

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
- تعايش دور الزبون العراقي البسيط والقلق والملحّ على مشكلته بالكامل.
- تحدث حصراً باللهجة العراقية الدارجة المعتادة (مثل: "عيني"، "شلونك عيني"، "بلا زحمة عليك").
- ردودك يجب أن تكون قصيرة وتلقائية كزبون حقيقي (لا تزيد عن جملة أو جملتين).
- ⚠️ قاعدة الحزم واليقظة: إذا كتب لك الموظف أي إجابة خارج سياق مشكلتك أو كتب لك كلاماً غير مفهوم/شخابيط (مثل "رمنةينةنربين")، يجب أن تجيبه بحزم شديد ولهجة عتب عراقية واضحة كزبون منزعج.
`;
                return {
                    id: idx + 1,
                    customerName: sc.customerName,
                    systemPrompt: systemPrompt,
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
                    systemPrompt: SYSTEM_PROMPT_RAHIF,
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer initiates WhatsApp chat." }] },
                        { role: 'model', parts: [{ text: "فلوسي مال البطاقة لحد الآن ما رجعت" }] }
                    ]
                },
                {
                    id: 2,
                    customerName: "علي",
                    systemPrompt: SYSTEM_PROMPT_ALI,
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer initiates Instagram DM." }] },
                        { role: 'model', parts: [{ text: "هسه اشتريت بطاقه بلي اول شي طلع فشل نوب طلع تم" }] }
                    ]
                },
                {
                    id: 3,
                    customerName: "Khatab Omar",
                    systemPrompt: SYSTEM_PROMPT_KHATAB,
                    history: [
                        { role: 'user', parts: [{ text: "System: Customer comments on Instagram post." }] },
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

        const requestBody = {
            systemInstruction: {
                parts: [{ text: chat.systemPrompt }]
            },
            contents: chat.history,
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 500,
                topP: 0.9
            }
        };

        const response = await fetchWithRotation(requestBody);
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!replyText) throw new Error("No response from Gemini");

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

        const response = await fetchWithRotation(requestBody);
        const data = await response.json();
        let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!replyText) throw new Error("No evaluation response received");

        replyText = replyText.trim();
        if (replyText.startsWith('```')) {
            replyText = replyText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        return JSON.parse(replyText);
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

    window.onAITabActivated = function () {
        if (agent) agent.loadSettings();
        if (agent && !agent.apiKey) {
            showNoKeyWarning();
        } else {
            hideNoKeyWarning();
        }
        loadAISessionsTable();
    };

    // ─────────────────────────────────────────────
    // UI Initialization
    // ─────────────────────────────────────────────
    const DISPOSITION_DATA = {
        "WU Inquiry": ["WU Inquiry"],
        "WU Issue": ["Send Money Issue", "Receive Money Issue", "Hold Transaction Issue", "Missing MTCN Issue", "Other Issues"],
        "MC/Visa Inquiry": ["MC/Visa Inquiry"],
        "MC/Visa Issue": ["Activation Issue", "Top-up or Transfer Issue", "PoS Payment Issue", "Cashout at ATM Issue", "eCommerce Issue", "Delivery or Order Issue", "Negative Balance Issue", "Change name Request", "Refund expired card issue", "Cash Back Issue", "Card SOA", "Reset PIN request", "Other", "Passport Issue"],
        "Wallet/Registration Inquiry": ["Wallet/Registration Inquiry"],
        "Wallet/App Issue": ["App Issue", "Registration Issue", "Login Issue", "No agents in my area Issue", "Agent's extra charges issues", "Agent's bad treatement/No e-money", "Trx Issue", "Customer mistake in trx", "Locked/Duplicated Wallets Issue", "Change MSISDN", "FinCrime Issue", "Wallet SOA", "Other issues"],
        "Digital Goods Issue": ["Purchaes issue", "Resend PIN issue", "Redeem Issue", "Other Issues"],
        "Bank Transfer Issue": ["Linking Issue", "Top-up Issue", "Cash back issue", "Other Issues"],
        "Cash-in by VISA/MC Issue": ["Cash-in/Card no working", "Deduction issue", "Other Issues"],
        "Merchant/Business Inquiry": ["Merchant/Business Inquiry"],
        "Merchant/Business Issue": ["Delay \\ Request status", "Deduction or missing trx", "Other Issues"],
        "Agent's Inquiry": ["Agent's Inquiry"],
        "Agent's Issue": ["Registration Issue/Delay", "Buying e-money Issue", "Trx Issue", "Commission Issue", "Locked agent's wallet", "App issue", "Fraud issue", "Other Issues"],
        "Other": ["Disconnect call", "Junk call", "Suggestion"],
        "Reset/Change PIN request": ["Reset/Change PIN request"]
    };

    function initAIAgentUI() {
        bindClick('ai-start-btn', handleStartSession);
        bindClick('ai-send-btn', handleSendMessage);
        bindClick('ai-restart-btn', handleRestart);
        bindClick('ai-restart-final-btn', handleRestart);

        const dispSelect = document.getElementById('ai-disp-select');
        const subDispSelect = document.getElementById('ai-sub-disp-select');

        if (dispSelect && subDispSelect) {
            dispSelect.innerHTML = '<option value="">الموضوع الرئيسي (Main)</option>';
            subDispSelect.innerHTML = '<option value="">الموضوع الفرعي (Sub)</option>';

            Object.keys(DISPOSITION_DATA).forEach(disp => {
                const opt = document.createElement('option');
                opt.value = disp;
                opt.textContent = disp;
                dispSelect.appendChild(opt);
            });

            dispSelect.addEventListener('change', () => {
                const val = dispSelect.value;
                subDispSelect.innerHTML = '<option value="">الموضوع الفرعي (Sub)</option>';
                if (val && DISPOSITION_DATA[val]) {
                    DISPOSITION_DATA[val].forEach(sub => {
                        const opt = document.createElement('option');
                        opt.value = sub;
                        opt.textContent = sub;
                        subDispSelect.appendChild(opt);
                    });
                }
            });
        }

        const inputEl = document.getElementById('ai-employee-input');
        if (inputEl) {
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
            inputEl.addEventListener('input', () => {
                inputEl.style.height = 'auto';
                inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
            });
        }

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
        const user = aiCurrentUser;
        if (!user) return;

        const resultData = {
            userId: user.id || '-',
            userName: user.name || '-',
            score: score,
            grade: grade
        };

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
