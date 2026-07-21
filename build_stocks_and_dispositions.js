const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const stocksKb = [
    {
        title: "مقدمة عن خدمة تداول الأسهم عبر زين كاش (ISX)",
        category: "الأسهم والتداول",
        icon: "fa-chart-line",
        content: `
            <div class="kb-article">
                <h3>دليل خدمة تداول الأسهم في سوق العراق للأوراق المالية (ISX)</h3>
                <p>تتيح خدمة الأسهم من <strong>زين كاش</strong> لجميع مستخدمي المحفظة إمكانية بيع وشراء أسهم الشركات المساهمة العراقية المدرجة في سوق العراق للأوراق المالية (ISX) مباشرة وبكل سهولة وأمان عبر تطبيق زين كاش بالتعاون مع شركات الوساطة المالية المعتمدة.</p>
                <div class="kb-callout">
                    <i class="fa-solid fa-lightbulb"></i>
                    <div>
                        <strong>ميزة التداول عبر زين كاش:</strong> 
                        يمكنك فتح حساب تداول مجاناً، متابعة أسعار الأسهم لحظياً، إدخال أوامر الشراء والبيع، واستلام أرباح الأسهم السنوية (Dividends) مباشرة في رصيد محفظتك.
                    </div>
                </div>
                <h4>الشركات والقطاعات المتاحة للتداول:</h4>
                <ul>
                    <li><strong>القطاع المصرفي:</strong> مصرف بغداد، مصرف الاستثمار، المصرف المتحد، المصرف الأهلي.</li>
                    <li><strong>قطاع الاتصالات:</strong> شركة خاتم الاتصالات / زين العراق (TZNI).</li>
                    <li><strong>القطاع الصناعي:</strong> بغداد للمشروبات الغازية، العراقية للسجاد، الكندي لللقاحات.</li>
                    <li><strong>قطاع الفنادق والخدمات:</strong> فندق المنصور، فندق بابل، الخدمات الزراعية.</li>
                </ul>
            </div>
        `
    },
    {
        title: "خطوات تفعيل حساب التداول وتوثيق المستمسكات",
        category: "الأسهم والتداول",
        icon: "fa-id-card",
        content: `
            <div class="kb-article">
                <h3>كيفية تفعيل حساب الأسهم من داخل التطبيق</h3>
                <p>لكي يتمكن المشترك من بدء تداول الأسهم، يجب تفعيل حساب التداول المالي وربطه بالمركز العراقي للإيداع (IDC):</p>
                <ol>
                    <li>فتح تطبيق زين كاش واختيار أيقونة <strong>"تداول الأسهم" (Shares Trading)</strong>.</li>
                    <li>الموافقة على الشروط والأحكام الخاصة بالتداول المالي ورسوم الوساطة.</li>
                    <li>تأكيد معلومات البطاقة الوطنية الموحدة أو الجواز مع الصورة الشخصية.</li>
                    <li>اختيار شركة الوساطة المعتمدة المفضلة من القائمة المتاحة.</li>
                    <li>يتم مراجعة الطلب وتفعيل الحساب خلال <strong>24 ساعة عمل</strong>، وسيصل رمز المركز العراقي للإيداع (IDC Number) عبر إشعار التطبيق ورسالة نصية.</li>
                </ol>
                <div class="kb-alert">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>تنبيه: يجب أن تكون محفظة زين كاش دائمية ومحدثة المستمسكات لإكمال التفعيل بنجاح.</span>
                </div>
            </div>
        `
    },
    {
        title: "طريقة تقديم وإدارة أوامر شراء وبيع الأسهم",
        category: "الأسهم والتداول",
        icon: "fa-arrow-trend-up",
        content: `
            <div class="kb-article">
                <h3>كيفية إدخال أمر شراء أو بيع أسهم</h3>
                <p>يمكن للمشترك تنفيذ العمليات المالية بكل سلاسة من خلال الخطوات التالية:</p>
                <h4>1. تقديم أمر شراء (Buy Order):</h4>
                <ul>
                    <li>من شاشة تداول الأسهم، اختر اسم الشركة أو رمز السهم (مثلاً: BBOB أو TZNI).</li>
                    <li>حدد <strong>عدد الأسهم</strong> المطلوب شراؤها.</li>
                    <li>حدد نوع الأمر: <strong>سعر السوق (Market Order)</strong> للتنفيذ الفوري بأفضل سعر، أو <strong>سعر محدد (Limit Order)</strong> للحد الأقصى الذي ترغب بدفعه.</li>
                    <li>يتم تجميد مبلغ الشراء + العمولة من رصيد المحفظة مؤقتاً لحين تنفيذ الأمر في جلسة التداول.</li>
                </ul>
                <h4>2. تقديم أمر بيع (Sell Order):</h4>
                <ul>
                    <li>اختر السهم من قائمة "محفظتي الاستثمارية".</li>
                    <li>حدد عدد الأسهم والمراد بيعها والحد الأدنى للسعر.</li>
                    <li>عند تنفيذ عملية البيع، يتم إضافة صافي مبلغ البيع (بعد خصم العمولة) مباشرة إلى رصيد محفظة زين كاش خلال جلسة التكافؤ.</li>
                </ul>
            </div>
        `
    },
    {
        title: "أوقات جلسات التداول والعمولات والرسوم المطبقة",
        category: "الأسهم والتداول",
        icon: "fa-clock",
        content: `
            <div class="kb-article">
                <h3>أوقات التداول وهيكلية العمولات</h3>
                <h4>أوقات جلسة التداول في سوق العراق (ISX):</h4>
                <ul>
                    <li><strong>الجلسة الإعدادية (Pre-Open):</strong> من الساعة 9:30 صباحاً حتى 10:00 صباحاً (لتقديم الأوامر فقط دون تنفيذ).</li>
                    <li><strong>جلسة التداول المباشر (Continuous Trading):</strong> من الساعة 10:00 صباحاً حتى 12:00 ظهراً (من الأحد إلى الخميس).</li>
                    <li>أي أمر يتم تقديمه بعد 12:00 ظهراً ينقل تلقائياً لجلسة التداول في يوم العمل التالي.</li>
                </ul>
                <h4>جدول العمولات والرسوم المطبقة:</h4>
                <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
                    <thead>
                        <tr style="background:#f1f5f9; text-align:right;">
                            <th style="padding:8px; border:1px solid #cbd5e1;">البيان</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">النسبة / الرسوم</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;">عمولة سوق العراق للأوراق المالية + الهيئة + المقاصة</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">0.003 (0.3% من قيمة الصفقة)</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;">عمولة شركة الوساطة المالية + زين كاش</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">0.0035 (0.35% من قيمة الصفقة)</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;">فتح حساب التداول وتوثيق الإيداع</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">مجانـــاً 100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    },
    {
        title: "توزيعات الأرباح السنوية (Dividends) وكشف حساب الأسهم",
        category: "الأسهم والتداول",
        icon: "fa-sack-dollar",
        content: `
            <div class="kb-article">
                <h3>استلام الأرباح وكشف التعاملات الاستثمارية</h3>
                <h4>1. استلام الأرباح السنوية (Dividends):</h4>
                <p>عند إقرار الهيئة العامة لأي شركة مدرجة توزيع أرباح سنوية على المساهمين، تقوم زين كاش بالتعاون مع مركز الإيداع بتحويل الأرباح المستحقة للمساهم <strong>مباشرة إلى محفظة زين كاش</strong> الخاصة به مع إرسال إشعار فوري وتفصيلي بالإيداع.</p>
                <h4>2. كشف حساب الأسهم والتقارير المالية:</h4>
                <p>يمكن للمستثمر في أي وقت الدخول إلى شاشة الأسهم -> <strong>"تقارير المحفظة"</strong> للحصول على:</p>
                <ul>
                    <li>كشف تفصيلي بجميع العمليات المنفذة والمعلقة.</li>
                    <li>تقييم لحظي لأرباح وخسائر المحفظة الاستثمارية (Profit / Loss).</li>
                    <li>تحميل كشف حساب رسمي معتمد بصيغة PDF.</li>
                </ul>
            </div>
        `
    }
];

const stocksSlides = [
    {
        id: 1,
        title: "مقدمة عن خدمة تداول الأسهم عبر زين كاش",
        desc: "تعرّف على كيفية تمكين المشتركين من تداول أسهم الشركات العراقية المدرجة في سوق العراق للأوراق المالية (ISX) عبر المحفظة.",
        bulletPoints: [
            "الخدمة تتم بالتعاون مع سوق العراق للأوراق المالية وشركات الوساطة المعتمدة.",
            "إمكانية البيع والشراء ومتابعة الأسعار لحظياً عبر التطبيق.",
            "إيداع الأرباح السنوية تلقائياً في حساب المحفظة."
        ],
        badgeText: "المفهوم الأساسي"
    },
    {
        id: 2,
        title: "متطلبات تفعيل حساب التداول",
        desc: "خطوات توثيق حساب الأسهم والحصول على رقم المركز العراقي للإيداع IDC.",
        bulletPoints: [
            "يشترط أن تكون المحفظة دائمية ومحدثة المستمسكات.",
            "تقديم طلب التفعيل من داخل التطبيق واختيار شركة الوساطة.",
            "تتم معالجة الطلب وتزويد المستثمر برقم IDC خلال 24 ساعة عمل."
        ],
        badgeText: "التفعيل والربط"
    },
    {
        id: 3,
        title: "آلية تنفيذ أوامر الشراء والبيع",
        desc: "كيفية تقديم الأوامر بأنواعها المختلفة وضوابط التنفيذ.",
        bulletPoints: [
            "أمر سعر السوق (Market Order): ينفذ فوراً بأفضل سعر متاح.",
            "أمر محدد السعر (Limit Order): ينفذ عند وصول السعر للحد المحدد.",
            "يتم تجميد مبلغ الشراء مؤقتاً لحين إتمام الصفقة في الجلسة."
        ],
        badgeText: "الأوامر والتنفيذ"
    },
    {
        id: 4,
        title: "جلسات التداول وهيكلية العمولات",
        desc: "أوقات التداول الرسمية والنسب المعتمدة للرسوم.",
        bulletPoints: [
            "الجلسة الإعدادية: 9:30 ص - 10:00 ص | التداول المباشر: 10:00 ص - 12:00 ظ.",
            "أيام التداول: من الأحد إلى الخميس.",
            "إجمالي العمولة: 0.65% فقط من إجمالي قيمة الصفقة (تتضمن الهيئة وسوق العراق والوسيط وزين كاش)."
        ],
        badgeText: "الأوقات والعمولات"
    },
    {
        id: 5,
        title: "إدارة الأرباح وكشف الحساب الاستثماري",
        desc: "طريقة متابعة أداء الأسهم واستلام توزيعات الأرباح السنوية.",
        bulletPoints: [
            "توزيعات الأرباح (Dividends) تحول أوتوماتيكياً لرصيد المحفظة.",
            "إمكانية تصدير كشف حساب استثماري بصيغة PDF.",
            "متابعة نسبة الربح والخسارة اللحظية لكل سهم."
        ],
        badgeText: "الأرباح والتقارير"
    }
];

const stocksScenarios = [
    {
        id: "sim-stocks-1",
        title: "استفسار عن طريقة شراء أسهم عبر زين كاش",
        type: "Chat Simulation",
        customerCode: "CUST-STK-01",
        customerName: "حسين علي مهدي",
        topic: "Shares Trading Purchase Inquiry",
        category: "Wallet / Application Inquiry",
        subDisposition: "How to Use the Wallet",
        chat: [
            { sender: "customer", text: "السلام عليكم، سمعت تكدرون تشترون أسهم شركات بشركتكم زين كاش؟ شلون الطريقة؟" },
            { sender: "agent", text: "وعليكم السلام ورحمة الله وبركاته، أهلاً بك أستاذ حسين! نعم بالضبط، يمكنك تداول أسهم الشركات العراقية المدرجة في سوق العراق للأوراق المالية (ISX) مباشرة من تطبيق زين كاش." },
            { sender: "customer", text: "شنو المتطلبات حتى ابدي اشتري؟" },
            { sender: "agent", text: "المتطلبات بسيطة جداً: يجب أن تكون محفظتك دائمية ومحدثة المستمسكات، ثم تفتح التطبيق وتختار 'تداول الأسهم' وتوافق على الشروط وتختار شركة الوساطة. يتم تفعيل حسابك خلال 24 ساعة وتستطيع الشراء فوراً." }
        ],
        evaluationCriteria: {
            correctCategory: "Wallet / Application Inquiry",
            correctSubDisposition: "How to Use the Wallet",
            keyCheckpoints: [
                "تأكيد توفر خدمة تداول الأسهم عبر سوق العراق للأوراق المالية ISX",
                "توضيح شرط أن تكون المحفظة دائمية",
                "شرح خطوات التفعيل اختيار شركة الوساطة"
            ]
        }
    },
    {
        id: "sim-stocks-2",
        title: "مشكلة خصم مبلغ أمر شراء أسهم معلق لم ينفذ",
        type: "Chat Simulation",
        customerCode: "CUST-STK-02",
        customerName: "سارة فاضل عباس",
        topic: "Failed / Pending Stock Purchase Transaction",
        category: "Wallet / Application Issue",
        subDisposition: "Failed Local Transaction - With Deduction",
        chat: [
            { sender: "customer", text: "مرحبا، قدمت أمر شراء أسهم بنك بغداد واستقطعوا المبلغ من المحفظة بس الأسهم ما نزلت بحسابي لحد الان!" },
            { sender: "agent", text: "أهلاً بكِ أستاذة سارة، يرجى الاطمئنان. عند تقديم أمر شراء أسهم يتم تجميد المبلغ مؤقتاً لحين انعقاد جلسة التداول الرسمية في سوق العراق (بين 10:00 صباحاً و 12:00 ظهراً)." },
            { sender: "customer", text: "يعني شوكت تنزل الأسهم بحسابي؟" },
            { sender: "agent", text: "عند مطابقة وسعر الشراء في الجلسة، سيتنفذ الأمر فوراً وتظهر الأسهم في محفظتك الاستثمارية، وفي حال عدم التمكن من الشراء بالسعر المحدد سيتم إلغاء التجميد وإعادة المبلغ بالكامل لمحفظتك بنهاية الجلسة." }
        ],
        evaluationCriteria: {
            correctCategory: "Wallet / Application Issue",
            correctSubDisposition: "Failed Local Transaction - With Deduction",
            keyCheckpoints: [
                "طمأنة الزبونة وبيان ميكانيكية تجميد المبلغ المؤقت",
                "توضيح أوقات جلسة التداول الرسمية في ISX",
                "تأكيد إعادة المبلغ للمحفظة في حال عدم تنفيذ الأمر"
            ]
        }
    },
    {
        id: "sim-stocks-3",
        title: "استفسار عن أوقات جلسة التداول والعمولات",
        type: "Chat Simulation",
        customerCode: "CUST-STK-03",
        customerName: "عمر خالد الجبوري",
        topic: "Stock Trading Hours & Commission Fees",
        category: "Wallet / Application Inquiry",
        subDisposition: "Wallet Limit / Fees Inquiry",
        chat: [
            { sender: "customer", text: "السلام عليكم، شنو أوقات جلسة التداول للأسهم؟ وكم النسبة والعمولة اللي تاخذوها عالصفقة؟" },
            { sender: "agent", text: "وعليكم السلام ورحمة الله أستاذ عمر. جلسة التداول الإعدادية تبدأ من 9:30 ص والتداول المباشر من 10:00 ص حتى 12:00 ظهراً من الأحد إلى الخميس." },
            { sender: "customer", text: "ممتاز، والعمولة شكد؟" },
            { sender: "agent", text: "إجمالي العمولة هو 0.65% فقط من قيمة صفقة البيع أو الشراء (تتضمن حصة هيئة الأوراق المالية وسوق العراق والوسيط وزين كاش)، وفتح الحساب وتحديث البيانات مجاني تماماً." }
        ],
        evaluationCriteria: {
            correctCategory: "Wallet / Application Inquiry",
            correctSubDisposition: "Wallet Limit / Fees Inquiry",
            keyCheckpoints: [
                "ذكر أوقات الجلسة من 10:00 ص إلى 12:00 ظهراً من الأحد للخميس",
                "توضيح نسبة العمولة الإجمالية 0.65%",
                "تأكيد مجانية فتح الحساب"
            ]
        }
    },
    {
        id: "sim-stocks-4",
        title: "استفسار عن طريقة استلام أرباح الأسهم السنوية",
        type: "Chat Simulation",
        customerCode: "CUST-STK-04",
        customerName: "زينب عبد الحسن",
        topic: "Stock Dividends Payout Inquiry",
        category: "Wallet / Application Inquiry",
        subDisposition: "How to Use the Wallet",
        chat: [
            { sender: "customer", text: "مرحبا، عندي أسهم بشركة الاتصالات وأقروا توزيع أرباح سنوية، شلون راح استلم أرباحي؟" },
            { sender: "agent", text: "أهلاً بكِ أستاذة زينب. مبارك أرباحكِ! يتم تحويل أرباح الأسهم المقررة من مركز الإيداع العراقي مباشرة إلى محفظة زين كاش الخاصة بكِ." },
            { sender: "customer", text: "تحتاج أروح لمكان لو تنزل تلقائياً؟" },
            { sender: "agent", text: "تنزل أوتوماتيكياً في رصيد المحفظة مع إرسال إشعار تفصيلي على هاتفكِ بالرسالة والمبلغ المودع بدون الحاجة لمراجعة أي فرع." }
        ],
        evaluationCriteria: {
            correctCategory: "Wallet / Application Inquiry",
            correctSubDisposition: "How to Use the Wallet",
            keyCheckpoints: [
                "تأكيد إيداع أرباح الأسهم السنوية تلقائياً في المحفظة",
                "إبلاغ الزبونة بإرسال إشعار وتفاصيل الإيداع",
                "تأكيد عدم الحاجة للمراجعة الميدانية"
            ]
        }
    },
    {
        id: "sim-stocks-5",
        title: "طلب إلغاء أمر بيع أسهم معلق",
        type: "Chat Simulation",
        customerCode: "CUST-STK-05",
        customerName: "مصطفى قاسم كمال",
        topic: "Cancel Pending Stock Sell Order Request",
        category: "Wallet / Application Inquiry",
        subDisposition: "How to Use the Wallet",
        chat: [
            { sender: "customer", text: "السلام عليكم، خليت أمر بيع أسهم قبل شوية وهسة هونت أريد ألغي الطلب شلون؟" },
            { sender: "agent", text: "وعليكم السلام أستاذ مصطفى. طالما أن جلسة التداول لم تنتهِ والأمر ما زال في حالة (معلق / Pending)، يمكنك إلغاؤه فوراً من داخل التطبيق." },
            { sender: "customer", text: "منين ألغيه بالضبط؟" },
            { sender: "agent", text: "ادخل لشاشة الأسهم -> ثم 'الأوامر المعلقة' -> واضغط على أمر البيع ثم اختر 'إلغاء الأمر'. سيتم تحرير الأسهم فوراً وعودتها إلى محفظتك الاستثمارية." }
        ],
        evaluationCriteria: {
            correctCategory: "Wallet / Application Inquiry",
            correctSubDisposition: "How to Use the Wallet",
            keyCheckpoints: [
                "تأكيد إمكانية إلغاء الأمر طالما أنه ما زال معلقاً لم ينفذ",
                "توضيح الخطوات من قائمة الأوامر المعلقة داخل التطبيق",
                "تأكيد عودة الأسهم للمحفظة الاستثمارية فور الإلغاء"
            ]
        }
    }
];

const stocksAiScenarios = [
    {
        id: "ai-sec-stocks-1",
        title: "تقييم التعامل مع طلب تداول أسهم واستفسار العمولات",
        topic: "Zain Cash Shares Trading & Commission Consultation",
        customerPersona: "زبون يرغب بتجربة شراء أسهم في بنك بغداد ومستثمر جديد يستفسر عن الضمانات والعمولات",
        initialMessage: "مرحبا، أريد أستثمر وأشتري أسهم مصرف بغداد عن طريق محفظتي زين كاش بس خايف من العمولات والشلون تضمنون فلوسي؟",
        evaluationCriteria: [
            "الشرح الواضح والموثوق لخدمة تداول الأسهم عبر سوق العراق للأوراق المالية (ISX)",
            "تأكيد أمان الخدمة ورقم مركز الإيداع العراقي IDC",
            "توضيح نسبة العمولة الإجمالية 0.65% بكل شفافية",
            "استخدام لغة خدمة زبناء احترافية ودقيقة"
        ]
    },
    {
        id: "ai-sec-stocks-2",
        title: "تقييم التعامل مع مشكلة تأخير إيداع أرباح أسهم سنوية",
        topic: "Delayed Stock Dividends Payout Escalation",
        customerPersona: "زبون منفعل بسبب عدم وصول أرباح أسهمه السنوية في شركة الاتصالات بعد الإعلان عنها",
        initialMessage: "مرحبا، شركة الاتصالات علنت توزيع أرباح من أسبوع ولحد هسة ما نزلت فلوس الأرباح بمحفظتي، وين الفلوس؟",
        evaluationCriteria: [
            "امتصاص غضب الزبون بأسلوب لبق واحترافي",
            "طلب تفاصيل رقم المحفظة والشركة المعنية والتحقق من القوائم المستلمة من مركز الإيداع",
            "توضيح جدول تحويل المبالغ من المركز وتحديد مدة المتابعة خلال 24-48 ساعة",
            "التصنيف الصحيح للتذكرة وإبلاغ الزبون فور المتابعة"
        ]
    }
];

// Comprehensive Dispositions & Sub-Dispositions Dataset provided by the user
const fullDispositions = [
  // 1. Wallet / Application Issue
  { category: "Wallet / Application Issue", subDisposition: "Wallet Registration Issue", description: "يستخدم عند مواجهة المشترك مشكله بتسجيل محفظة زين كاش جديدة (رفض مستمسكات ، عدم المقدرة على التسجيل .. الخ ) تأخير في استلام الرمز السري بعد تفعيل المحفظة", mostReasons: "في حال اشتكى المشترك من عدم تمكن تسجيل محفظة زين كاش" },
  { category: "Wallet / Application Issue", subDisposition: "PIN/OTP Issue", description: "يستخدم هذا التصنيف عند مواجهة مشكلة بالرمز السري او رمز التفعيل للمحفظة عدم استلام الرمز او تغير الرمز", mostReasons: "في حال اشتكى المشترك بخصوص الرمز السري او رمز التفعيل" },
  { category: "Wallet / Application Issue", subDisposition: "Login Issue & Notifications Issue", description: "يستخدم هذا التصنيف عند مواجهة صعوبة بتسجيل الدخول للمحفظة ظهور خلل تقني او اي صعوبة وعدم وصول الاشعارات لكافة العمليات بداخل تطبيق زين كاش", mostReasons: "في حال اشتكي المشترك بخصوص تسجيل الدخول والاشعارات" },
  { category: "Wallet / Application Issue", subDisposition: "Failed Local Transaction - With Deduction", description: "يستخدم هذا التصيف عند اجراء اي عملية وتم استقطاع مبالغ من المحفظة تحويل او تعبئة او سحب او استلام مبالغ من تاجر", mostReasons: "في حال اشتكى المشترك بخصوص اجراء عملية باستقطاع اموال" },
  { category: "Wallet / Application Issue", subDisposition: "Failed Local Transaction - Without Deduction", description: "يستخدم هذا التصنيف عند اجراء اي عملية للمحفظة وتفشل بدون استقطاع مبالغ تحويل او تعبئة او سحب او استلام مبالغ من تاجر", mostReasons: "في حال اشتكى المشترك بخصوص فشل اجراء عملية بدون استقطاع" },
  { category: "Wallet / Application Issue", subDisposition: "Statement of Account Issue", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة حول بحث عن عملية من خلال الفلترة او عدم ظهور العمليات او مواجهة خلل عند الاطلاع على كشف الحساب", mostReasons: "في حال اشتكى المشترك عن عمليات تم اجراءها من خلال المحفظة او طلب كشف حساب للمحفظة" },
  { category: "Wallet / Application Issue", subDisposition: "Complaint Against Agent/Mercahant", description: "يستخدم هذا التصنيف في حال المشترك يقدم شكوى بخصوص وكيل او تاجر بسبب طلب عمولة اضافة او اسلوب التعامل او عدم استخدام الخدمة", mostReasons: "في حال اشتكى المشترك على وكيل او تاجر" },
  { category: "Wallet / Application Issue", subDisposition: "Wallet Termination/Change MSISDN Issue", description: "يستخدم هذا التصنيف وجود طلب تغيير رقم المحفظة وتجاوز المدة المحددة او طلب الغاء المحفظة وتجاوز المدة المحددة او في حال خلل بالتقديم طلب التغيير او في حال مواجهة المشترك يواجه مشكلة بسبب رفض الطلب", mostReasons: "في حال اشتكى المشترك بخصوص بخصوص طلب تغير رقم المحفظة او الغاء المحفظة" },
  { category: "Wallet / Application Issue", subDisposition: "Other Technical Issue", description: "عندما يواجه المشترك مشكلة تقنية في المحفظة أو التطبيق، ولا تندرج ضمن أي من التصنيفات الأخرى الموجودة ضمن Wallet / Application Issue.", mostReasons: "مشكلة تقنية أخرى" },
  { category: "Wallet / Application Issue", subDisposition: "Wallet / Application Incident", description: "يستخدم هذا التصنيف عند حدوث خلل بالمحفظة بخدمة معينة كتوقف صيانة او حدوث خلل معين بخدمة", mostReasons: "في حال اشتكى المشترك بخصوص توقف خدمة معينة، وتم الابلاغ عن وجود صيانة عامة على الخدمة" },

  // 2. Wallet / Application Inquiry
  { category: "Wallet / Application Inquiry", subDisposition: "Wallet Limit / Fees Inquiry", description: "عندما يستفسر المشترك عن حدود السحب أو الإيداع أو التحويل أو عن العمولات والرسوم المطبقة على خدمات زين كاش.", mostReasons: "استفسار عن حدود المحفظة أو الرسوم" },
  { category: "Wallet / Application Inquiry", subDisposition: "Statement of Account Inquiry", description: "عندما يستفسر المشترك عن كشف الحساب أو محتوياته.", mostReasons: "استفسار عن كشف الحساب" },
  { category: "Wallet / Application Inquiry", subDisposition: "Update Wallet Type / Docs Request", description: "عندما يطلب المشترك تحديث نوع المحفظة أو تحديث أو إضافة المستمسكات المطلوبة.", mostReasons: "طلب تحديث نوع المحفظة أو المستمسكات" },
  { category: "Wallet / Application Inquiry", subDisposition: "Wrong Transfer Inquiry", description: "عندما يستفسر المشترك عن تحويل تم إرساله بالخطأ أو عن الإجراءات المتعلقة به.", mostReasons: "استفسار عن تحويل خاطئ" },
  { category: "Wallet / Application Inquiry", subDisposition: "Nearest Shop / Agent Inquiry", description: "عندما يستفسر المشترك عن أقرب وكيل أو منفذ أو متجر تابع لزين كاش.", mostReasons: "استفسار عن أقرب وكيل أو متجر" },
  { category: "Wallet / Application Inquiry", subDisposition: "Cash Disbursement Inquiry", description: "عندما يستفسر المشترك عن خدمة استلام الرواتب، مثل آلية استلام الراتب أو شروط الخدمة أو أي معلومات تتعلق بها.", mostReasons: "استفسار عن استلام الرواتب" },
  { category: "Wallet / Application Inquiry", subDisposition: "Wallet Registration Inquiry", description: "يستخدم هذا التصنيف عند وجود استفسار من المشترك بخصوص محفظة زين كاش انشاء او وقت التسجيل المستمسكات المطلوبة … الخ", mostReasons: "اي استفسار يخص محفظة زين كاش" },
  { category: "Wallet / Application Inquiry", subDisposition: "PIN/OTP Inquiry/Request", description: "يستخدم هذا التصنيف عند استفسار المشترك كيفية الحصول على الرمز السري او رمز التفعيل او الحصول على رمز سري جديد او تغير الرمز السري من داخل التطبيق", mostReasons: "في حال استفسر المشترك بخصوص الرمز السري او رمز التفعيل" },
  { category: "Wallet / Application Inquiry", subDisposition: "How to Use the Wallet", description: "يستخدم هذا التصنيف في حال المشترك يستفسر عن خدمة معينة او طريقة معينة خاصة بالمحفظة كيفية الاستخدام كيف يتم التحويل او السحب كيف اعرف رصيدي", mostReasons: "في حال استفسر المشترك بخصوص كيف يستخدم خدمة معينة او طريقة" },
  { category: "Wallet / Application Inquiry", subDisposition: "Locked/CI Wallet Inquiry", description: "يستخدم هذا التصنيف في حال المشترك يستفسر عن محفظة معلقة او مغلقة حسب تعليمات وضوابط الشركة او في حال معلقة من قبل قسم التوعية او استفسار سبب التعليق", mostReasons: "في حال استفسار المشترك عن حالة محفظة معلقة او مغلقة" },
  { category: "Wallet / Application Inquiry", subDisposition: "Wallet Termination/Change MSISDN Inquiry/Request", description: "يستخدم هذا التصنيف في حال المشترك يستفسر عن كيفية طلب الغاء المحفظة او طلب تغير رقم المحفظة او في حال يستفسر عن وجود طلب تغير او الغاء مقدم", mostReasons: "في حال استفسار المشترك بخصوص طلب الغاء المحفظة او طلب تغير رقم المحفظة" },

  // 3. Report Fraud or Scam Issue
  { category: "Report Fraud or Scam Issue", subDisposition: "Disputed Card Transaction", description: "في حال تعرض المشترك لعملية نصب و احتيال من خلال بطاقة الماستر كارد، أو إذا كان لديه طلب يتعلق بحالة احتيال مرتبطة بالبطاقة", mostReasons: "في حال اشتكى المشترك بخصوص عملية نصب أو احتيال تتعلق ببطاقة الماستر كارد." },
  { category: "Report Fraud or Scam Issue", subDisposition: "Disputed Wallet Transaction", description: "في حال تعرض المشترك لعملية نصب و احتيال من خلال محفظة زين كاش، أو كان لديه طلب يتعلق بحالة احتيال مرتبطة بالمحفظة،", mostReasons: "في حال اشتكى المشترك بخصوص عملية نصب أو احتيال تتعلق بالمحفظة." },
  { category: "Report Fraud or Scam Issue", subDisposition: "Other Security Concern", description: "يُستخدم هذا التصنيف في حال تقديم المشترك شكوى تتعلق بأي مشكلة أحتيالية اخرى غير مذكورة في التصنيفات المحددة.", mostReasons: "في حال لدى المشترك اي شكوى بخصوص مشاكل الاحتيال غير مذكورة بالتصنيفات" },

  // 4. Report Fraud or Scam Inquiry
  { category: "Report Fraud or Scam Inquiry", subDisposition: "Fraud or Scam Inquiry", description: "في حال استفسار المشترك بخصوص أي عملية احتيالية أو بخصوص موقع غير تابع لزين كاش ويرغب بالتأكد من صحة الموقع", mostReasons: "اي استفسار يخص عمليات النصب والاحتيال" },

  // 5. Card Issues
  { category: "Card Issues", subDisposition: "Card Order/Delivery Issue", description: "يستخدم عند مواجهة المشترك مشكلة في طلب بطاقة الماستر كارد أو توصيل البطاقة", mostReasons: "عند تواصل المشترك بسبب عدم استلام البطاقة بعد الطلب أو وجود خطأ في عملية التوصيل" },
  { category: "Card Issues", subDisposition: "Activation Issue", description: "يستخدم عند مواجهة المشترك مشكلة في تفعيل بطاقة الماستر كارد أو تفعيل بطاقة فيزا الافتراضية", mostReasons: "عدم قدرة المشترك على تفعيل البطاقة أو ظهور خطأ أثناء التفعيل" },
  { category: "Card Issues", subDisposition: "Top-up or Transfer Issue", description: "يستخدم عند مواجهة المشترك مشكلة في تعبئة البطاقات أو استرجاع الرصيد من البطاقات إلى المحفظة", mostReasons: "فشل عملية تعبئة البطاقة أو تحويل الرصيد من البطاقة الى المحفظة" },
  { category: "Card Issues", subDisposition: "Failed Card Transaction - With Deduction", description: "يستخدم عند مواجهة المشترك مشكلة في اجراء عملية مالية استقطاع باستخدام البطاقات (دفع ، شراء ، سحب أموال)", mostReasons: "فشل أي عملية دفع ،شراء باستخدام البطاقة / سحب من الصراف الالي ATM أو نقاط البيع POS" },
  { category: "Card Issues", subDisposition: "Failed Card Transaction - Without Deduction", description: "يستخدم عند مواجهة المشترك مشكلة في اجراء عملية مالية بدون استقطاع باستخدام البطاقات (دفع ، شراء ، سحب أموال)", mostReasons: "فشل أي عملية دفع ،شراء باستخدام البطاقة / سحب من الصراف الالي ATM أو نقاط البيع POS" },
  { category: "Card Issues", subDisposition: "International Transactions Issue", description: "يستخدم عند مواجهة المشترك مشكلة في تفعيل التعاملات الدولية للبطاقات أو رفع جواز السفر", mostReasons: "عند وجود مشكلة في تفعيل أو تنفيذ المعاملات الدولية للبطاقة" },
  { category: "Card Issues", subDisposition: "Expired/Canceled Card Refund Issue", description: "يستخدم عند مواجهة المشترك مشكلة في استرجاع الأموال من البطاقة الملغاة أو المنتهية الصلاحية الى المحفظة", mostReasons: "عند طلب المشترك استرجاع رصيد من بطاقة منتهية الصلاحية أو ملغاة" },
  { category: "Card Issues", subDisposition: "Hold Card Issue", description: "يستخدم عند مواجهة المشترك مشكلة في بطاقة ماستر كارد وكانت حالة البطاقة معلقة", mostReasons: "عند تواصل المشترك بسبب تعليق البطاقة لأي سبب (أمني، شكوى، إلخ)" },
  { category: "Card Issues", subDisposition: "Card Statement Issue", description: "مشكلة في كشف التعاملات المالية لبطاقة الماستر كارد/ فيزا افتراضية", mostReasons: "عند طلب المشترك كشفاً عن المعاملات المالية أو وجود خطأ في كشف الحساب" },
  { category: "Card Issues", subDisposition: "Cards Incident", description: "يستخدم في حال وجود صيانة على بطاقة الماستر كارد/فيزا افتراضية أو مشكلة عامة", mostReasons: "لأي مشكلة عامة أو انقطاع خدمة أو صيانة تؤثر على المستخدمين" },

  // 6. Card Inquiries
  { category: "Card Inquiries", subDisposition: "Card Order / Delivery Inquiry", description: "عندما يستفسر المشترك عن حالة طلب البطاقة أو موعد وآلية توصيلها، دون وجود مشكلة في الطلب أو التوصيل.", mostReasons: "استفسار عن طلب أو توصيل البطاقة" },
  { category: "Card Inquiries", subDisposition: "Card Statement Request", description: "عندما يطلب المشترك إصدار كشف حساب لبطاقة Mastercard، سواء للفترة الكاملة أو لفترة زمنية محددة.", mostReasons: "طلب إصدار كشف حساب البطاقة" },
  { category: "Card Inquiries", subDisposition: "How to Use the Cards", description: "يُستخدم هذا التصنيف عند وجود استفسار من المشترك حول كيفية استخدام البطاقات (تفعيل، تعبئة، تحويل، عمولات، رسوم)", mostReasons: "عند سؤال المشترك عن طريقة استخدام البطاقة أو الرسوم والعمولات" },
  { category: "Card Inquiries", subDisposition: "Reset PIN Request", description: "يُستخدم هذا التصنيف عند طلب المشترك إعادة إرسال الرمز السري (PIN) الخاص بالبطاقة", mostReasons: "عند طلب المشترك إعادة تعيين أو استرجاع الرمز السري للبطاقة (PIN)" },

  // 7. Western Union Issue
  { category: "Western Union Issue", subDisposition: "WU Send Money Issue", description: "يُستخدم عند مواجهة المشترك مشكلة في إرسال الأموال عبر خدمة ويسترن يونيون (WU)", mostReasons: "عند تواصل المشترك بسبب فشل إرسال الأموال أو ظهور خطأ أثناء العملية" },
  { category: "Western Union Issue", subDisposition: "WU Unauthorized Transaction", description: "يستخدم عند مواجهة المشترك مشكلة بالتحويل او الاستلام ويتم تعليق المبلغ Hold Balance", mostReasons: "Hold Balance عند التحويل أو الاستلام" },
  { category: "Western Union Issue", subDisposition: "WU Receive Money Issue", description: "يُستخدم عند مواجهة المشترك مشكلة في استلام حوالة عبر ويسترن يونيون", mostReasons: "عند تواصل المشترك بسبب تأخير أو فشل في استلام الحوالة من تطبيق زين كاش ويسترن يونيون" },
  { category: "Western Union Issue", subDisposition: "Hold Transfer Issue", description: "يُستخدم عند مواجهة المشترك مشكلة في إرسال حوالة عبر ويسترن يونيون تم تعليقها أو إيقافها من الخدمة", mostReasons: "عند تواصل المشترك بسبب حوالة تم تعليقها" },
  { category: "Western Union Issue", subDisposition: "Add / Edit Beneficiary Issue", description: "يُستخدم عند مواجهة المشترك مشكلة في إضافة مستفيد جديد أو تعديل اسم مستفيد موجود", mostReasons: "عند تواصل المشترك بسبب ظهور خطأ عند محاولة إضافة مستفيد أو تعديله" },
  { category: "Western Union Issue", subDisposition: "Western Union Incident", description: "يُستخدم عند وجود بلاغ من المشترك حول توقف خدمة ويسترن يونيون في التطبيق أو صيانة", mostReasons: "عند تواصل المشترك بسبب عدم ظهور خدمة ويسترن يونيون في التطبيق أو ظهور رسالة صيانة" },

  // 8. Western Union Inquiry
  { category: "Western Union Inquiry", subDisposition: "How to Use WU", description: "يُستخدم عند استفسار المشترك عن كيفية استخدام خدمة ويسترن يونيون وشروط خطوات الإرسال والاستلام", mostReasons: "عند تواصل المشترك للاستفسار عن طريقة إرسال حوالة، أو استلامها، أو شروط والحدود" },
  { category: "Western Union Inquiry", subDisposition: "WU Limit/Fee Inquiry", description: "يُستخدم عند استفسار المشترك عن حدود التحويل والرسوم المترتبة على استخدام خدمة ويسترن يونيون", mostReasons: "عند تواصل المشترك لمعرفة الحد الأقصى للتحويل أو الاستفسار عن قيمة العمولة والرسوم" },
  { category: "Western Union Inquiry", subDisposition: "Refund a WU Transfer", description: "يُستخدم عند استفسار المشترك عن إمكانية أو طريقة استرداد حوالة تم إرسالها عبر ويسترن يونيون", mostReasons: "عند تواصل المشترك لمعرفة إذا يمكنه استرداد الحوالة وكيفية ذلك" },

  // 9. Digital Goods Issue
  { category: "Digital Goods Issue", subDisposition: "Egoods Failed Transaction - Without Deduction", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة بخصوص فشل شراء البطاقات الالكترونية وظهور خطا ما بدون استقطاع رصيد", mostReasons: "فشل شراء البطاقات الإلكترونية بدون استقطاع رصيد" },
  { category: "Digital Goods Issue", subDisposition: "Egoods Failed Transaction - With Deduction", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة بخصوص شراء بطاقات الالكترونية واستقطاع مبلغ وايضا في حال تم تعليق المبلغ Hold Balance", mostReasons: "فشل شراء البطاقات الإلكترونية مع استقطاع المبلغ وتعليق Hold Balance" },
  { category: "Digital Goods Issue", subDisposition: "Card PIN Receiving Issue", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة باستلام الرمز السري للبطاقة عند اعادة ارسالها للمشترك", mostReasons: "مشكلة في استلام الرمز السري للبطاقة بعد إعادة الإرسال" },
  { category: "Digital Goods Issue", subDisposition: "Unavailability of Certain Card", description: "يستخدم عند مواجهة المشترك مشكلة بخصوص شراء بطاقة معينة ولا توجد او تظهر البطاقة غير متوفرة نفاذ الكمية", mostReasons: "البطاقة غير متوفرة / نفاد الكمية" },
  { category: "Digital Goods Issue", subDisposition: "Redeem Issue", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة بتعبئة البطاقات الالكترونية الرقم السري للبطاقة غير صالح او اي اجراء فشل يظهر بالتعبئة", mostReasons: "الرقم السري غير صالح / البطاقة منتهية الصلاحية / فشل التعبئة / البطاقة غير مدعومة" },
  { category: "Digital Goods Issue", subDisposition: "Card Already Redeemed", description: "يستخدم هذا التصنيف عند مواجهة المشترك مشكلة بتعبئة البطاقات الالكترونية البطاقة مستخدمة او الرمز السري مستخدمة او تم استخدامه", mostReasons: "البطاقة مستخدمة بالفعل" },
  { category: "Digital Goods Issue", subDisposition: "Digital Goods Incident", description: "يستخدم هذا التصنيف عند مواجهة المشترك توقف معين او اجراء صيانة على البطاقات الالكترونية", mostReasons: "توقف أو صيانة خدمة البطاقات الإلكترونية" },

  // 10. Digital Goods Inquiry
  { category: "Digital Goods Inquiry", subDisposition: "How to Use Digital Cards", description: "يستخدم هذا التصنيف عن اي استفسار يخص البطاقات الالكترونية كيفية الشراء او كيفية التعبئة واي استفسار يخص البطاقات الالكترونية", mostReasons: "استفسار حول البطاقات الإلكترونية" },
  { category: "Digital Goods Inquiry", subDisposition: "Card PIN Resend Request", description: "يستخدم هذا التصنيف حول اعادة ارسال الرمز السري للبطاقة", mostReasons: "إعادة إرسال الرمز السري للبطاقة" },

  // 11. Cash-In by VISA/MC (HC) Issue
  { category: "Cash-In by VISA/MC (HC) Issue", subDisposition: "HC Failed Transaction - With Deduction", description: "يستخدم هذا التصنيف بخصوص اي عملية تعبئة بواسطة فيزا او ماستر ويتم استقطاع المبلغ من البطاقة", mostReasons: "فشل عملية تعبئة من البطاقة مع استقطاع المبلغ" },
  { category: "Cash-In by VISA/MC (HC) Issue", subDisposition: "HC Failed Transaction - Without Deduction", description: "يستخدم هذا التصنيف بخصوص اي عملية تعبئة بواسطة فيزا او ماستر بدون استقطاع رصيد وتفشل بسبب المصرف المصدر للبطاقة او اي رفض", mostReasons: "فشل عملية تعبئة من البطاقة بدون استقطاع رصيد" },
  { category: "Cash-In by VISA/MC (HC) Issue", subDisposition: "HC Incident", description: "يستخدم هذا التصنيف بخصوص توقف او اجراء اعمال صيانة على خدمة التعبئة بواسطة فيزا او ماستر", mostReasons: "انقطاع أو صيانة خدمة التعبئة من البطاقة" },

  // 12. Cash-In by VISA/MC (HC) Inquiry
  { category: "Cash-In by VISA/MC (HC) Inquiry", subDisposition: "How to Cashin by VISA/MC Inquiry", description: "يستخدم هذا التصنيف بخصوص اي استفسار يخص خطوات تعبئة بواسطة فيزا او ماستر", mostReasons: "اي استفسار يخص التعبئة بواسطة الفيزا او الماستر" },

  // 13. GOV Bill Payment Issue
  { category: "GOV Bill Payment Issue", subDisposition: "Failed Bill Payment - With Deduction", description: "يُستخدم هذا التصنيف عند شكوى المشترك من فشل العملية مع خصم المبلغ من المحفظة", mostReasons: "المشترك أبلغ أن العملية فشلت ولكن المبلغ تم استقطاعه" },
  { category: "GOV Bill Payment Issue", subDisposition: "Failed Bill Payment - Without Deduction", description: "يُستخدم هذا التصنيف عند شكوى المشترك من فشل عملية دفع فاتورة حكومية دون خصم المبلغ", mostReasons: "المشترك أبلغ عن فشل عملية دفع الفاتورة الحكومية دون خصم المبلغ من الرصيد." },
  { category: "GOV Bill Payment Issue", subDisposition: "Bill Payment Incident", description: "يستخدم هذا التصنيف عند شكوى المشترك بتوقف خدمة دفع الفواتير الحكومية او توقف معين بالخدمة او عدم ظهور الاجراء", mostReasons: "المشترك يبلغ بتوقف او خلل بدفع للفواتير الحكومية" },

  // 14. GOV Bill Payment Inquiry
  { category: "GOV Bill Payment Inquiry", subDisposition: "How to Use (GOV Bill Payment)", description: "يُستخدم هذا التصنيف عند استفسار المشترك عن كيفية استخدام أو الوصول إلى خدمة دفع الفواتير الحكومية عبر التطبيق", mostReasons: "المشترك سأل عن الخطوات اللازمة لإتمام عملية دفع فاتورة حكومية باستخدام المحفظة." },

  // 15. NBI Issue
  { category: "NBI Issue", subDisposition: "NBI Linking Issue", description: "يُستخدم هذا التصنيف عند تقديم المشترك شكوى بخصوص فشل أو صعوبة في ربط المحفظة مع الحساب المصرفي.", mostReasons: "المشترك قدّم شكوى تفيد بعدم تمكنه من ربط المحفظة مع حسابه البنكي بنجاح." },
  { category: "NBI Issue", subDisposition: "NBI Top-Up Issue", description: "يُستخدم هذا التصنيف عند تقديم المشترك شكوى بخصوص عملية تعبئة فاشلة، أو تأخرت، أو تم خصم المبلغ دون أن ينعكس في المحفظة.", mostReasons: "المشترك قدّم شكوى تفيد بخصم مبلغ التعبئة من حسابه دون إضافته إلى المحفظة." },
  { category: "NBI Issue", subDisposition: "NBI Incident", description: "يُستخدم هذا التصنيف عند تقديم المشترك شكوى بخصوص توقف او اجراء اعمال صيانة على خدمة التعبئة بواسطة الحساب المصرفي .", mostReasons: "المشترك قدم شكوى بخصوص توقف او اجراء اعمال صيانة بالتعبئة" },

  // 16. NBI Inquiry
  { category: "NBI Inquiry", subDisposition: "How to Use NBI", description: "يُستخدم هذا التصنيف عند استفسار المشترك عن كيفية استخدام خدمة تعبئة الرصيد عبر(NBI) لإضافة رصيد إلى المحفظة.", mostReasons: "المشترك سأل عن طريقة تعبئة رصيد المحفظة باستخدام الحساب المصرفي (الاهلي العراقي)" },

  // 17. Merchant Payment Issue
  { category: "Merchant Payment Issue", subDisposition: "Failed Merchant Payment - With Deduction", description: "يُستخدم هذا التصنيف عند إبلاغ المشترك عن عملية دفع تمت إلى أحد التجار وتم فيها استقطاع المبلغ من الحساب، ولكن العملية ولم يستلم التاجر المبلغ.", mostReasons: "تم استقطاع المبلغ من رصيد المشترك لكن عملية الدفع للتاجر لم تكتمل بنجاح." },
  { category: "Merchant Payment Issue", subDisposition: "Failed Merchant Payment - Without Deduction", description: "يُستخدم هذا التصنيف عند إبلاغ المشترك عن فشل عملية الدفع إلى أحد التجار، دون حدوث أي استقطاع من الرصيد، وغالباً ما تكون العملية غير مكتملة أو مرفوضة من قبل التاجر", mostReasons: "عملية الدفع إلى التاجر فشلت ولم يتم استقطاع أي مبلغ من رصيد المشترك." },
  { category: "Merchant Payment Issue", subDisposition: "Merchant Payment Incident", description: "يُستخدم هذا التصنيف عند شكوى المشترك من توقف خدمة دفع التاجر أو حدوث خلل معين في الخدمة مثل عدم ظهور الإجراء", mostReasons: "توقف أو خلل في خدمة دفع التاجر." },

  // 18. Merchant Payment Inquiry
  { category: "Merchant Payment Inquiry", subDisposition: "How to Use Merchant Payment", description: "يُستخدم هذا التصنيف عند تواصل المشترك للاستفسار عن خطوات أو طريقة استخدام خدمة دفع التاجر، مثل كيفية إجراء الدفع أو اختيار التاجر أو تأكيد العملية.", mostReasons: "استفسار المشترك عن طريقة استخدام خدمة دفع التاجر." },

  // 19. Zain IQ Top-Up Issue
  { category: "Zain IQ Top-Up Issue", subDisposition: "Zain IQ Failed Topup - With Deduction", description: "يستخدم هذا التصنيف في حال واجه المشترك مشكلة بتعبئة خطوط زين العراق وتم استقطاع رصيد من المحفظة ولم يصل في حال كانت خطوط فاتورة او دفع مسبق", mostReasons: "فشل عملية تعبئة مع استقطاع رصيد" },
  { category: "Zain IQ Top-Up Issue", subDisposition: "Zain IQ Failed Topup - Without Deduction", description: "يستخدم هذا التصنيف في حال واجه المشترك مشكلة بتعبئة خطوط زين العراق دون استقطاع رصيد في حال كانت خطوط فاتورة او دفع مسبق", mostReasons: "فشل عملية تعبئة بدون استقطاع رصيد" },
  { category: "Zain IQ Top-Up Issue", subDisposition: "Zain IQ Incident", description: "يستخدم هذا التصنيف في حال وجود خلل او توقف معين صيانة مؤقتة في خدمة تعبئة خط زين العراق في حال كانت خطوط فاتورة او دفع مسبق", mostReasons: "انقطاع أو صيانة مؤقتة في خدمة التعبئة" },

  // 20. Zain IQ Topup Inquiry
  { category: "Zain IQ Topup Inquiry", subDisposition: "How to Recharge Zain IQ Line", description: "يستخدم هذا التصنيف في حال اي استفسار يخص كيفية او خطوات تعبئة خطوط زين العراق في حال كانت خطوط فاتورة او دفع مسبق", mostReasons: "اي استفسار يخص خدمة تعبئة خط زين" },

  // 21. Junk
  { category: "Junk", subDisposition: "Junk", description: "عندما يكون التواصل أو الطلب لا علاقة له إطلاقاً بمحفظة زين كاش أو خدماتها (مثل رسائل عشوائية، اختبار، إزعاج، أو محتوى غير مفهوم/غير ذي صلة)، ولا يندرج ضمن أي تصنيف آخر من التصنيفات الموجودة.", mostReasons: "استفسار غير متعلق بالخدمة" },

  // 22. Agent Issue
  { category: "Agent Issue", subDisposition: "PIN/OTP Issue", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش مشكلة في الرمز السري أو رمز التفعيل لمحفظة الوكالة، مثل عدم استلام الرمز أو تغيير الرمز", mostReasons: "في حال اشتكى الوكيل بخصوص الرمز السري أو رمز التفعيل لمحفظة الوكالة." },
  { category: "Agent Issue", subDisposition: "Login & Notifications Issue", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش صعوبة في تسجيل الدخول إلى محفظة الوكالة أو ظهور خطأ أثناء المحاولة، أو عند عدم وصول الإشعارات الخاصة بالعمليات داخل تطبيق زين كاش للوكيل.", mostReasons: "في حال اشتكى الوكيل بخصوص تسجيل الدخول أو الإشعارات في محفظة الوكالة." },
  { category: "Agent Issue", subDisposition: "Wallet Status Issue", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش مشكلة في حالة محفظة الوكالة، مثل أن تكون المحفظة مقفلة، أو موقوفة، أو غير مفعّلة، أو عند ظهور رسالة تُفيد بأن المحفظة غير صالحة للاستخدام.", mostReasons: "في حال اشتكى الوكيل من أن محفظة الوكالة مقفلة أو غير مفعّلة أو لا يمكن استخدامها." },
  { category: "Agent Issue", subDisposition: "Wallet Funds Issue", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش مشكلة في رصيد محفظة الوكالة، مثل عدم تطابق الرصيد، أو عدم ظهور المبلغ الصحيح، أو عدم استلام الأموال بعد عملية إيداع أو سحب.", mostReasons: "في حال اشتكى الوكيل بخصوص الرصيد في محفظة الوكالة أو عدم استلام/ظهور المبلغ بشكل صحيح." },
  { category: "Agent Issue", subDisposition: "Failed Transaction - With Deduction", description: "يُستخدم هذا التصنيف عندما يبلغ وكيل زين كاش عن فشل عملية مالية من محفظة الوكالة مع خصم المبلغ من الرصيد، مثل فشل إرسال الأموال، أو فشل عملية السحب أو الدفع، مع أن المبلغ قد تم خصمه.", mostReasons: "في حال اشتكى الوكيل من عملية فاشلة تم فيها خصم المبلغ من محفظة الوكالة." },
  { category: "Agent Issue", subDisposition: "Failed Transaction - Without Deduction", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش فشلًا في تنفيذ عملية مالية من محفظة الوكالة، ولكن من دون خصم أي مبلغ من الرصيد، مثل فشل عملية إرسال، سحب، أو دفع لم تكتمل ولم يُخصم منها مبلغ.", mostReasons: "في حال اشتكى الوكيل من فشل تنفيذ العملية في محفظة الوكالة من دون أن يتم خصم المبلغ." },
  { category: "Agent Issue", subDisposition: "Application Issue", description: "يُستخدم هذا التصنيف عندما يواجه وكيل زين كاش مشكلة عامة في تطبيق زين كاش الخاص بالوكلاء، مثل ظهور أخطاء تقنية، أو بطء في الأداء، أو عدم عمل بعض الخصائص بشكل صحيح.", mostReasons: "في حال اشتكى الوكيل من عطل أو خطأ في تطبيق زين كاش الخاص بمحفظة الوكالة." },
  { category: "Agent Issue", subDisposition: "Complaint Against Field Team", description: "يُستخدم هذا التصنيف عندما يقدم وكيل زين كاش شكوى تتعلق بأحد أفراد الفريق الميداني، مثل سوء التعامل، أو التأخير في الزيارة، أو عدم الالتزام بالإجراءات الميدانية.", mostReasons: "في حال اشتكى الوكيل من تصرف أو تعامل غير مناسب من قبل الفريق الميداني." },
  { category: "Agent Issue", subDisposition: "Statement of Account Issue/Request", description: "يُستخدم هذا التصنيف عندما يطلب وكيل زين كاش كشف حساب لمحفظة الوكالة أو يواجه مشكلة في استلامه أو في عرض تفاصيل العمليات ضمن الكشف، مثل وجود خطأ في الحركات", mostReasons: "في حال طلب الوكيل كشف حساب لمحفظة الوكالة أو اشتكى من وجود خطأ أو مشكلة في الكشف." },
  { category: "Agent Issue", subDisposition: "Report Fraud or Scam Issue", description: "يُستخدم هذا التصنيف عندما يبلغ وكيل زين كاش عن حالة احتيال أو محاولة نصب تتعلق بمحفظة الوكالة، مثل تلقي مكالمة مشبوهة، أو رسالة تطلب معلومات حساسة، أو عملية احتيالية تمت على حسابه.", mostReasons: "في حال أبلغ الوكيل عن عملية احتيال أو محاولة نصب تتعلق بمحفظة الوكالة." },
  { category: "Agent Issue", subDisposition: "Agent Incident", description: "يُستخدم هذا التصنيف عندما تتوقف إحدى خدمات زين كاش الخاصة بالوكلاء بسبب أعمال صيانة أو خلل تقني عام، مثل توقف المعاملات، أو عدم توفر خدمة معينة لجميع الوكلاء.", mostReasons: "في حال واجه الوكلاء توقفاً عاماً في خدمة معينة نتيجة الصيانة أو خلل تقني من جانب النظام." },

  // 23. Agent Inquiry
  { category: "Agent Inquiry", subDisposition: "PIN/OTP Inquiry/Request", description: "يُستخدم هذا التصنيف عندما يقوم وكيل زين كاش بالاستفسار أو طلب المساعدة بخصوص الرمز السري أو رمز التفعيل لمحفظة الوكالة، مثل كيفية تغيير الرمز أو طلب إعادة إرساله.", mostReasons: "في حال استفسر الوكيل عن الرمز السري أو رمز التفعيل أو طلب إعادة إرساله لمحفظة الوكالة." },
  { category: "Agent Inquiry", subDisposition: "How to Use the Agent Wallet", description: "يُستخدم هذا التصنيف عندما يستفسر وكيل زين كاش عن طريقة استخدام محفظة الوكالة، مثل كيفية إجراء المعاملات، أو تحويل الأموال، أو إدارة الرصيد، أو أي استفسار يتعلق بآلية عمل المحفظة.", mostReasons: "في حال استفسر الوكيل عن كيفية استخدام محفظة الوكالة أو تنفيذ عمليات معينة داخلها." },
  { category: "Agent Inquiry", subDisposition: "Wallet Status Inquiry", description: "يُستخدم هذا التصنيف عندما يستفسر وكيل زين كاش عن حالة محفظة الوكالة، مثل ما إذا كانت مفعّلة، أو مقفلة، أو موقوفة، أو عن سبب عدم تمكنه من استخدامها او استفسار يخص طلب تسجيل.", mostReasons: "في حال استفسر الوكيل عن حالة محفظة الوكالة أو سبب توقفها أو عدم تفعيلها." },
  { category: "Agent Inquiry", subDisposition: "Report Fraud or Scam Inquiry", description: "يُستخدم هذا التصنيف عندما يقوم وكيل زين كاش بالاستفسار عن آلية التبليغ عن الاحتيال أو النصب، مثل طريقة تقديم بلاغ، أو الخطوات المطلوبة عند التعرض لمحاولة احتيال تخص محفظة الوكالة.", mostReasons: "في حال استفسر الوكيل عن كيفية الإبلاغ عن عملية احتيال أو محاولة نصب تتعلق بمحفظة الوكالة." }
];

async function runUpdate() {
    let db = {};
    try {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
        db = JSON.parse(clean);
    } catch(e) {
        console.error("Could not read db.json", e);
    }

    db.knowledgeBase = stocksKb;
    db.slides = stocksSlides;
    db.scenarios = stocksScenarios;
    db.aiScenarios = stocksAiScenarios;
    db.dispositions = fullDispositions;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
    console.log("Successfully updated db.json with Shares KB, Slides, Exam Scenarios & Full Dispositions!");
}

runUpdate();
