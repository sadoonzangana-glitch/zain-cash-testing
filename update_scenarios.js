const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const usStockScenarios = [
    {
        id: 1,
        title: "رفض طلب التسجيل لخدمة الأسهم والالتزام بعدم الإفصاح (Tipping-off)",
        customerName: "حسين علي مهدي",
        customerPhone: "07701234501",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "تداول الأسهم الأمريكية",
        turns: [
            {
                step: 1,
                customerText: "مرحبا، قدمت ع التداول وانرفض طلبي واستقطعوا 5,000 دينار من محفظتي! ليش رفضتوني وما انطيتوني السبب؟ واريد فلوسي ترجع لزين كاش!",
                options: [
                    {
                        text: "وعليكم السلام ورحمة الله وبركاته، أهلاً بك أستاذ حسين في زين كاش! نعتذر منك جداً، يرجى الاطمئنان التام، يسعدني جداً مساعدتك والتحقق من حالة طلبك ورسم الاشتراك فوراً.",
                        isCorrect: true,
                        categoryScores: { greeting: 5, probing: 15, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "ممتاز! رحبت بالزبون بأسلوب احترافي واستوضحت المشكلة بطريقة ممتازة وطمأنت الزبون."
                    },
                    {
                        text: "أهلاً، ليش انرفض الطلب؟ أرسل إيميلك ورقم المحفظة ونشوف السيستم.",
                        isCorrect: false,
                        categoryScores: { greeting: 2, probing: 5, accuracy: 0, compliance: 0, tone: 2 },
                        feedback: "ضعيف! الرد مختصر وينقصه الترحيب الرسمي وطمأنة الزبون."
                    },
                    {
                        text: "زين كاش ما تنطي أسباب الرفض، والفلوس راح تضيع عليك.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "سيء جداً! إعطاء معلومة خاطئة وأسلوب غير احترافي يسبب الهلع للعميل."
                    },
                    {
                        text: "شنو اسمك الكامل حتى نشيك السيستم مباشرة؟",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 5, accuracy: 0, compliance: 0, tone: 1 },
                        feedback: "خاطئ! الرد مباشر وبدون أي تحية أو ترحيب بزبون زين كاش."
                    }
                ]
            },
            {
                step: 2,
                customerText: "تمام، هذا بريدي المربوط (hussein@gmail.com). ليش انرفض الطلب وين الفلوس؟",
                options: [
                    {
                        text: "شكراً لتعاونك أستاذ حسين. بالتدقيق يتبين أن الطلب مرفوض لعدم استيفاء الشروط التنظيمية للخدمة، وأود إعلامك أن مبلغ الاشتراك (5,000 د.ع) تم إعادة إيداعه تلقائياً وبشكل كامل إلى حساب محفظتك.",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 35, compliance: 0, tone: 0 },
                        feedback: "إجابة دقيقة 100%! تم إبلاغ الزبون بعبارة الامتثال المعتمدة وتأكيد استرجاع مبلغ الاشتراك."
                    },
                    {
                        text: "الطلب مرفوض لأنك أمريكي أو في قائمة غسيل الأموال والامتثال، والفلوس راح ترجع بعد شهر.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "خطأ فادح! اتّهام الزبون ومخالفة صريحة لقواعد سرية الامتثال (Tipping-off Rule)."
                    },
                    {
                        text: "ما أعرف ليش انرفض، الفلوس ما ترجع للأسف لأنها رسوم فحص.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "خطأ! إعطاء معلومة غير دقيقة، ورسوم الاشتراك تُعاد بالكامل عند الرفض."
                    },
                    {
                        text: "لازم تقدم من جديد بنفس البريد فوراً وتدفع 5,000 ثانية.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "خطأ! الإيميل المربوط بحساب مرفوض/مغلق لا يمكن إعادة استخدامه مطلقاً."
                    }
                ]
            },
            {
                step: 3,
                customerText: "شنو السبب الدقيق من قسم الامتثال ومكافحة غسيل الأموال؟ انطوني السبب بالتفصيل!",
                options: [
                    {
                        text: "أقدّر حرصك أستاذ حسين، ولكن وفق الإجراءات والتعليمات التنظيمية والسياسات المعتمدة، نلتزم بعدم الإفصاح عن التفاصيل الدقيقة لملاحظات الامتثال، وتكتفي الخدمة بإعلام العميل بـ 'عدم استيفاء الشروط التنظيمية للخدمة'. يمكنك التقديم مجدداً ببريد جديد بعد انتهاء فترة التبريد.",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 35, tone: 5 },
                        feedback: "رائع جداً! التزام كامل بـ Tipping-off Rule وأسلوب لبق ومحترف يوضح فترة التبريد والبريد الجديد."
                    },
                    {
                        text: "الامتثال قالوا أنت متهم بغسيل أموال ولهذا السبب رفضناك وما نكدر نساعدك!",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "مخالفة خطيرة لسياسة الامتثال والخصوصية! يمنع الإفصاح عن ملاحظات الامتثال للزبون."
                    },
                    {
                        text: "ما راح نجاوبك، هذا شي خاص بالشركة وما الك حق تسأل.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "أسلوب جاف جداً ومسيء لخدمة العملاء."
                    },
                    {
                        text: "رح اتصل بمدير الامتثال وانطيك رقم تلفونه الشخصي تفاهم وياه.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "خطأ! إفصاح غير مصرح به عن بيانات موظفي الامتثال."
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "الفرق بين النقد (Cash) والرصيد المتاح للسحب وتدفق التسوية",
        customerName: "سارة فاضل عباس",
        customerPhone: "07809876501",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "تداول الأسهم الأمريكية",
        turns: [
            {
                step: 1,
                customerText: "مرحبا، قمت ببيع أسهم بشركة أبل بقيمة 100$ وظهر النقد بالحساب 600$، بس لمن ردت أسحب للمحفظة طلع المتاح للسحب فقط 500$! وين الـ 100$ الباقية ولعد ليش ما اقدر أسحبها؟",
                options: [
                    {
                        text: "أهلاً وسهلاً بكِ أستاذة سارة! يسعدنا تواصلك مع خدمة عملاء زين كاش. يرجى الاطمئنان، سأوضح لكِ فوراً سبب ظهور هذا الفرق بين النقد الكلي والرصيد المتاح للسحب.",
                        isCorrect: true,
                        categoryScores: { greeting: 5, probing: 15, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "ممتاز! تحية رسمية راقية واستيضاح وتطمين سريع للزبونة."
                    },
                    {
                        text: "مرحبا سارة، هذه مشكلة تقنية بالسيستم والتطبيق معلق.",
                        isCorrect: false,
                        categoryScores: { greeting: 2, probing: 5, accuracy: 0, compliance: 0, tone: 2 },
                        feedback: "تخمين خاطئ وإعطاء انطباع غير صحيح عن النظام."
                    },
                    {
                        text: "الشركة استقطعت 100$ عمولة بيع وتداول.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة! عمولة التداول 0% طوال مدة الاشتراك."
                    },
                    {
                        text: "روحي لقسم الإعدادات وسوي سحب جديد من هناك.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 1 },
                        feedback: "توجيه خاطئ لا يحل استفسار الزبونة."
                    }
                ]
            },
            {
                step: 2,
                customerText: "شنو الفرق بين النقد والرصيد المتاح للسحب؟ شوكت اقدر أسحب المبلغ بالكامل؟",
                options: [
                    {
                        text: "النقد (Cash) يمثل إجمالي الرصيد بما فيه مبالغ البيع الناتجة اليوم والتي تكون قيد التسوية المالية (Settlement). أما الرصيد المتاح للسحب فهو المبلغ الجاهز فوراً. المبلغ الناتج عن البيع (100$) ستكتمل تسويته تلقائياً وتصبح قادرة على السحب بالكامل (600$) فوراً إلى محفظتك.",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 35, compliance: 0, tone: 0 },
                        feedback: "شرح دقيق 100%! توضيح الفرق بين Cash والـ Available for Withdrawal وآلية التسوية."
                    },
                    {
                        text: "ما كو فرق، بس التطبيق بيه تعليق ولازم تنتظرين أسبوع كامل.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة وغير دقيقة."
                    },
                    {
                        text: "زين كاش تأخذ وقت 10 أيام حتى تدفع لك مبالغ البيع.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة، التسوية تكتمل تلقائياً خلال دورة التداول."
                    },
                    {
                        text: "لا يمكنك سحب أي مبلغ بعد البيع إطلاقاً.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة وتسبب ذعر الزبونة."
                    }
                ]
            },
            {
                step: 3,
                customerText: "شكراً جزيلاً للتوضيح! وهل أقدر أشتري أسهم ثانية بالـ 100$ وهي قيد التسوية؟",
                options: [
                    {
                        text: "عفواً أستاذة سارة، بخدمتك دائماً! نعم بالتأكيد، القوة الشرائية (Buying Power) تتيح لكِ إعادة استخدام المبالغ في شراء أسهم جديدة مباشرة، بينما يلزم استكمال التسوية فقط للسحب النقدي إلى محفظة زين كاش. أتمنى لكِ تداولاً موفقاً!",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 35, tone: 5 },
                        feedback: "ممتاز جداً! إجابة صحيحة توضح ميزة القوة الشرائية (Buying Power) بأسلوب راقٍ."
                    },
                    {
                        text: "لا ما تقدرين تصرفين أي سنت لحد ما تخلص التسوية.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة غير دقيقة، يمكن الشراء بالقوة الشرائية مباشرة."
                    },
                    {
                        text: "اشتري أي شي وبدون أي ضوابط أو قيود.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "إجابة عامة تفتقر للتوضيح التنظيمي."
                    },
                    {
                        text: "سدي الشات ورجعي بعدين تفصلي عن الموضوع.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "أسلوب جاف وغير مقبول في خدمة العملاء."
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "استفسار عن أمر Fill or Kill (FOK) وكسور الأسهم (Fractional Shares)",
        customerName: "عمر خالد الجبوري",
        customerPhone: "07501234567",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "تداول الأسهم الأمريكية",
        turns: [
            {
                step: 1,
                customerText: "السلام عليكم، حبيت أشتري 0.5 سهم من شركة تسلا واخترت نوع الأمر (Fill or Kill - FOK) بس النظام رفض الطلب ويلغي مباشرة، شنو السبب؟",
                options: [
                    {
                        text: "وعليكم السلام ورحمة الله وبركاته، أهلاً بك أستاذ عمر! يسعدني جداً إجابتك وتوضيح السبب التقني الخاص بأمر FOK وكسور الأسهم.",
                        isCorrect: true,
                        categoryScores: { greeting: 5, probing: 15, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "ممتاز! ترحيب إسلامي واحترافي واستيضاح رائع لطلب الزبون."
                    },
                    {
                        text: "أهلاً، شركة تسلا محظورة بالتطبيق وما تقدر تشتري منها.",
                        isCorrect: false,
                        categoryScores: { greeting: 2, probing: 5, accuracy: 0, compliance: 0, tone: 2 },
                        feedback: "معلومة خاطئة! شركة تسلا متاحة للتداول."
                    },
                    {
                        text: "أمر FOK عاطل حالياً وبيه عطل بالسيستم.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "تخمين خاطئ عن عمل النظام."
                    },
                    {
                        text: "محفظتك ما بيها رصيد كافي للشراء.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 5, accuracy: 0, compliance: 0, tone: 1 },
                        feedback: "تخمين خاطئ بدون مراجعة تفاصيل الأمر."
                    }
                ]
            },
            {
                step: 2,
                customerText: "ليش رفض النظام وشلون اقدر أشتري كسر السهم بنجاح؟",
                options: [
                    {
                        text: "حسب الضوابط التقنية لشركة الوساطة والبورصة، فإن أمر التنفيذ الفوري الكامل (Fill or Kill - FOK) لا يقبل كسور الأسهم إطلاقاً ويطلب أعداداً صحيحة فقط. لشراء كسور الأسهم (مثل 0.5 سهم)، يرجى اختيار نوع الصلاحية (Day) أو (GTC) وتأكيد الأمر بنجاح.",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 35, compliance: 0, tone: 0 },
                        feedback: "إجابة دقيقة 100%! تتماشى مع القواعد التقنية لـ FOK وكسور الأسهم."
                    },
                    {
                        text: "أمر FOK مخصص فقط للعملات الرقمية والبتكوين.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة، التداول لا يدعم العملات الرقمية."
                    },
                    {
                        text: "زين كاش ما تدعم كسور الأسهم نهائياً.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة! كسور الأسهم متاحة في زين كاش."
                    },
                    {
                        text: "انتظر لليوم الثاني وجرب نفس الأمر FOK.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "توجيه خاطئ، لأن أمر FOK سيتكرر رفضه مع الكسر."
                    }
                ]
            },
            {
                step: 3,
                customerText: "واضح جداً! واقدر أشتري بـ 50$ بمبلغ محدد بدل عدد الأسهم؟",
                options: [
                    {
                        text: "بالتأكيد أستاذ عمر، يمكنك اختيار الشراء بالمبلغ، ما دامت الشركة تدعم خيار التداول الكسري وتحويل الزر ليكون فاعلاً. في حال كان السهم لا يدعم الكسر، سيظهر الزر رمادياً ويستوجب الشراء بأعداد صحيحة. أتمنى لك يوماً سعيداً!",
                        isCorrect: true,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 35, tone: 5 },
                        feedback: "ممتاز جداً! شرح وافٍ لزر Dollar Value Toggle وضوابط الكسر."
                    },
                    {
                        text: "لا يمكنك التداول بالمبلغ إطلاقاً في أي شركة.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة."
                    },
                    {
                        text: "أي سهم تقدر تشتري منه كسر حتى لو كان معطل.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "معلومة خاطئة، بعض الأسهم لا تدعم الكسر."
                    },
                    {
                        text: "شكراً مع السلامة.",
                        isCorrect: false,
                        categoryScores: { greeting: 0, probing: 0, accuracy: 0, compliance: 0, tone: 0 },
                        feedback: "إنهاء مفاجئ وغير لائق للمحادثة."
                    }
                ]
            }
        ]
    }
];

let db = {};
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
    db = JSON.parse(clean);
} catch(e) {
    console.error("Could not read db.json", e);
}

db.scenarios = usStockScenarios;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log("Successfully updated db.json with 3 US Stock Trading Chat Simulation scenarios!");
