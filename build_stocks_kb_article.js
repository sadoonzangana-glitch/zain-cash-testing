const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const fullUSStocksKb = [
    {
        title: "1. دليل خدمة تداول الأسهم الأمريكية والمفاهيم الأساسية",
        category: "الأسهم والتداول",
        icon: "fa-chart-line",
        content: `
            <div class="kb-article">
                <h3>خدمة تداول الأسهم الأمريكية عبر تطبيق زين كاش</h3>
                <p>تتيح خدمة التداول لمشتركي زين كاش فتح حساب تداولي وشراء وبيع الأسهم الأمريكية المدرجة في الأسواق المالية الأمريكية من خلال تطبيق زين كاش، وذلك بعد استيفاء متطلبات التسجيل والموافقة على الطلب.</p>
                <p>تتم الخدمة عبر شركة وساطة أمريكية مرخّصة (<strong>Alpaca Securities LLC</strong>) وخاضعة لرقابة هيئة الأوراق المالية والبورصات الأمريكية (<strong>SEC</strong>)، وعضو في الهيئة التنظيمية للقطاع المالي (<strong>FINRA</strong>)، ومؤسسة حماية مستثمري الأوراق المالية (<strong>SIPC</strong>). كما تمكّن الخدمة العملاء من متابعة تداولاتهم، والاطلاع على أسعار الأسهم، وإدارة عمليات الإيداع والسحب بين محفظة زين كاش وحساب التداول بسهولة وأمان.</p>
                
                <div class="kb-callout" style="background:#eff6ff; border-right:4px solid #2563eb; padding:15px; border-radius:10px; margin:15px 0;">
                    <i class="fa-solid fa-lightbulb" style="color:#2563eb; font-size:1.2rem;"></i>
                    <div>
                        <strong>ما هو السهم (Stock / Share)؟</strong><br>
                        السهم هو جزء من ملكية شركة. فعندما تشتري سهماً في شركة مدرجة في البورصة، فإنك تمتلك جزءاً صغيراً من تلك الشركة. ويتم شراء الأسهم عادةً لأحد سببين:
                        <ul style="margin-top:5px; margin-bottom:0;">
                            <li>الاستفادة من ارتفاع قيمة السهم مع مرور الوقت إذا حققت الشركة نمواً وأداءً جيداً.</li>
                            <li>الحصول على توزيعات الأرباح (Dividends) التي تقوم بعض الشركات بتوزيعها على المساهمين.</li>
                        </ul>
                        <p style="margin-top:5px; margin-bottom:0;">تمنح ملكية الأسهم العادية حاملها حقاً في التصويت على بعض قرارات الشركة المهمة في اجتماعات الجمعية العامة، بما يتناسب مع عدد الأسهم التي يمتلكها.</p>
                    </div>
                </div>

                <h4>ما هي البورصة (سوق الأسهم)؟</h4>
                <p>البورصة هي السوق التي يتم من خلالها شراء وبيع الأسهم بين المستثمرين، وتضم الولايات المتحدة عدداً من البورصات، أبرزها:</p>
                <ul>
                    <li><strong>بورصة نيويورك (NYSE)</strong></li>
                    <li><strong>بورصة ناسداك (Nasdaq)</strong></li>
                </ul>
                <p>تتغير أسعار الأسهم بشكل مستمر خلال ساعات التداول بناءً على العرض والطلب. فعندما يزداد الإقبال على شراء سهم معين قد يرتفع سعره، وعندما يزداد الإقبال على بيعه قد ينخفض سعره.</p>

                <h4>رمز السهم (Ticker Symbol)</h4>
                <p>لكل شركة مدرجة رمز تداول خاص بها يُستخدم للتعرف عليها في السوق. أمثلة:</p>
                <ul>
                    <li>Apple = <strong>AAPL</strong></li>
                    <li>Microsoft = <strong>MSFT</strong></li>
                    <li>Tesla = <strong>TSLA</strong></li>
                    <li>Amazon = <strong>AMZN</strong></li>
                </ul>
                <p>يمكنك البحث عن الشركة داخل التطبيق باستخدام اسم الشركة أو رمز السهم.</p>

                <h4>كسور الأسهم (Fractional Shares)</h4>
                <p>تتيح بعض الشركات ميزة شراء جزء من السهم بدلاً من شراء سهم كامل.</p>
                <p><strong>مثال:</strong> إذا كان سعر سهم معين 200 دولار وأراد العميل تداول 50 دولاراً فقط، فيمكنه شراء 0.25 سهم. تساعد هذه الميزة العملاء على البدء بالتداول بمبالغ أقل.</p>
                <div class="kb-alert" style="background:#fffeb3; border-right:4px solid #eab308; padding:12px; border-radius:8px;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span><strong>ملاحظة مهمة:</strong> لا تتيح جميع الأسهم إمكانية شراء كسور الأسهم. في حال كان السهم لا يدعم هذه الميزة، فلن تتمكن من شراء جزء من السهم، كما لن يكون خيار الشراء بالمبلغ متاحاً لهذا السهم. في هذه الحالة، يجب عليك إدخال عدد أسهم كامل لإتمام عملية الشراء.</span>
                </div>

                <h4 style="margin-top:20px;">من يحتفظ بالأموال والأسهم؟</h4>
                <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
                    <thead>
                        <tr style="background:#f1f5f9; text-align:right;">
                            <th style="padding:10px; border:1px solid #cbd5e1;">الطرف</th>
                            <th style="padding:10px; border:1px solid #cbd5e1;">الدور والمفهوم</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding:10px; border:1px solid #cbd5e1;"><strong>زين كاش</strong></td>
                            <td style="padding:10px; border:1px solid #cbd5e1;">توفير التطبيق، دعم العملاء، وإدارة عمليات التحويل بين المحفظة وحساب التداول.</td>
                        </tr>
                        <tr>
                            <td style="padding:10px; border:1px solid #cbd5e1;"><strong>شركة Alpaca Securities LLC</strong></td>
                            <td style="padding:10px; border:1px solid #cbd5e1;">شركة وساطة أمريكية مرخّصة وخاضعة لرقابة SEC، وعضو في FINRA وSIPC. تتولى فتح حساب التداول، تنفيذ أوامر التداول، والاحتفاظ بالأموال والأسهم.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    },
    {
        title: "2. إنشاء حساب التداول، حالات الطلب، رسوم الاشتراك والمحافظ غير المؤهلة",
        category: "الأسهم والتداول",
        icon: "fa-user-check",
        content: `
            <div class="kb-article">
                <h3>خطوات التسجيل، شروط الأهلية والاشتراكات</h3>
                
                <h4>المتطلبات الأساسية</h4>
                <p>قبل البدء بإنشاء حساب التداول، يجب التأكد من توفر الشروط التالية:</p>
                <ol>
                    <li>امتلاك محفظة زين كاش للأفراد.</li>
                    <li>أن يكون حساب زين كاش مفعلاً وموافقاً عليه.</li>
                    <li>توفر بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً للتسجيل في خدمة التداول.</li>
                </ol>

                <h4>خطوات تسجيل حساب التداول في تطبيق زين كاش</h4>
                <ol>
                    <li>الدخول إلى قسم <strong>"الأسهم"</strong> من القائمة السفلية في تطبيق زين كاش، ثم الضغط على <strong>ابدأ</strong>.</li>
                    <li>إدخال بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً في خدمة التداول، ثم إدخال رمز التحقق (OTP) المرسل إلى البريد الإلكتروني.</li>
                    <li>تحديد المبلغ المتوقع للتداول ومصدر الأموال.</li>
                    <li>الإجابة على الأسئلة التنظيمية المطلوبة والإقرار والموافقة على نموذج (<strong>W-8BEN</strong> وهو إقرار ضريبي أمريكي يُثبت أن العميل من غير الأشخاص الأمريكيين لأغراض الضريبة الأمريكية) والشروط والأحكام الخاصة بالخدمة.</li>
                    <li>اختيار خطة الاشتراك وإتمام عملية الدفع، حيث يتم استقطاع رسوم الاشتراك من محفظة زين كاش.</li>
                    <li>يتم إرسال الطلب للمراجعة والتحقق، ومن المتوقع تفعيل حساب التداول أو إشعارك بنتيجة الطلب خلال <strong>24 ساعة</strong>.</li>
                </ol>

                <h4>حالات طلب التسجيل</h4>
                <ul>
                    <li><span style="color:#16a34a; font-weight:700;">قبول الطلب (Approved):</span> تم قبول طلبك بنجاح، وتم تفعيل حسابك في خدمة التداول مباشرة. يمكنك الآن البدء باستخدام الخدمة وتداول الأسهم عبر التطبيق.</li>
                    <li><span style="color:#eab308; font-weight:700;">قيد المراجعة (Pending):</span> طلبك قيد المراجعة حالياً، وسيتم حجز مبلغ الاشتراك مؤقتاً لحين استكمال التحقق خلال مدة تصل إلى 24 ساعة. يمكنك متابعة حالة الطلب من قسم التداول، كما سيتم إشعارك عبر البريد الإلكتروني المسجل عند قبول الطلب.</li>
                    <li><span style="color:#dc2626; font-weight:700;">رفض الطلب (Rejected):</span> في حال عدم استيفاء شروط الأهلية أو متطلبات التحقق، سيتم رفض الطلب وإشعارك بذلك، مع إعادة مبلغ الاشتراك إلى محفظة زين كاش الخاصة بك.</li>
                </ul>

                <h4>رسوم الاشتراك وتجديد الاشتراك</h4>
                <div class="kb-callout" style="background:#f0fdf4; border-right:4px solid #16a34a; padding:15px; border-radius:10px; margin:15px 0;">
                    <i class="fa-solid fa-circle-check" style="color:#16a34a; font-size:1.2rem;"></i>
                    <div>
                        <strong>قيمة الاشتراك: 5,000 دينار عراقي شهرياً</strong><br>
                        مقابل ذلك <strong>لا توجد أي رسوم أو عمولات على عمليات التداول (الشراء والبيع)</strong> طوال مدة الاشتراك — أي تداول غير محدود بلا رسوم تداول.
                    </div>
                </div>
                <ul>
                    <li>حالياً يتوفر نوع اشتراك واحد فقط (الاشتراك الشهري).</li>
                    <li>يتم تجديد الاشتراك بعد 30 يوم ولا يتم تجديده تلقائياً.</li>
                    <li><strong>عند انتهاء الاشتراك:</strong> تتقيد صلاحيات التداول (لا يمكن شراء الأسهم أو الإيداع لحساب التداول)، ولكن يمكن فقط (بيع الأسهم وسحب المبلغ المتوفر في القوة الشرائية إلى محفظة زين كاش).</li>
                    <li>يمكن تجديد الاشتراك شهرياً عبر النافذة المنبثقة بدفع 5,000 دينار، أو من خلال <em>إعدادات -> إدارة الاشتراك</em>.</li>
                    <li>في حال عدم كفاية الرصيد عند التجديد، يُعتبر الاشتراك منتهياً وتُقيَّد صلاحيات التداول.</li>
                </ul>

                <h4>أنواع المحافظ غير المؤهلة للتسجيل في خدمة الأسهم</h4>
                <p>بعض الحالات لا تكون مؤهلة لفتح حساب تداولي بسبب المتطلبات والقيود التنظيمية، وتشمل ما يلي:</p>
                <ul>
                    <li><strong>الأشخاص الأمريكيون (US Persons):</strong> ويشمل ذلك من يحمل الجنسية الأمريكية، أو يمتلك TIN / SSN، أو يحمل البطاقة الخضراء (Green Card)، أو لديه رقم ضمان اجتماعي أمريكي (SSN) سواء كان مولوداً في الولايات المتحدة أو مقيماً فيها.</li>
                    <li><strong>الأشخاص السياسيون (PEP):</strong> حيث قد يتم رفض الطلب أو إحالته للمراجعة وفقاً للسياسات والإجراءات التنظيمية المعتمدة.</li>
                    <li><strong>الجنسيات غير المدرجة ضمن القائمة المعتمدة:</strong> لا يمكن لحاملي الجنسيات التالية فتح حساب تداولي حالياً: (إيران، أفغانستان، السودان، أوكرانيا، روسيا، ليبيا، اليمن، كوريا الشمالية، كوبا، ميانمار / بورما).</li>
                    <li><strong>المحافظ المغلقة:</strong> لأسباب تنظيمية أو قانونية.</li>
                    <li>أي طلب يتم رفضه من قبل فريق التسجيل أو فريق الامتثال وفقاً للمتطلبات التنظيمية المعتمدة.</li>
                </ul>
            </div>
        `
    },
    {
        title: "3. مقاييس حساب التداول، الإيداع، السحب وسعر الصرف",
        category: "الأسهم والتداول",
        icon: "fa-wallet",
        content: `
            <div class="kb-article">
                <h3>الصفحة الرئيسية لمقاييس الحساب، الإيداع والسحب</h3>
                
                <h4>مقاييس الحساب في الصفحة الرئيسية</h4>
                <ul>
                    <li><strong>النقد (Cash):</strong> إجمالي الرصيد النقدي الموجود في حساب التداول، ويشمل الأموال المتاحة والأموال التي لا تزال قيد التسوية. لا يعني ذلك أن كامل هذا الرصيد قابل للسحب أو متاح للاستخدام، حيث قد يكون جزء منه محجوزًا لأوامر شراء مفتوحة أو غير قابل للسحب حتى اكتمال التسوية.</li>
                    <li><strong>القيمة السوقية (Market Value):</strong> القيمة الحالية لجميع الأسهم التي تمتلكها، ويتم احتسابها وفقًا لأسعار السوق الحالية، لذلك تتغير مع ارتفاع أو انخفاض أسعار الأسهم.</li>
                    <li><strong>صافي قيمة المحفظة (Net Asset Value - NAV):</strong> إجمالي قيمة حساب التداول، ويشمل الرصيد النقدي بالإضافة إلى القيمة السوقية للأسهم، بعد احتساب أي التزامات أو عمليات قائمة.</li>
                    <li><strong>القوة الشرائية (Buying Power):</strong> المبلغ المتاح لاستخدامه في شراء الأسهم. عند إرسال أمر شراء، يتم حجز قيمة الأمر مباشرة من القوة الشرائية، حتى وإن كان الأمر معلقًا أو كان السوق مغلقًا. وفي حال إلغاء الأمر أو انتهاء صلاحيته دون تنفيذ، يتم تحرير المبلغ وإعادته إلى القوة الشرائية.</li>
                    <li><strong>الرصيد النقدي الحر المتاح للسحب:</strong> الجزء من الرصيد النقدي الذي أصبح متاحًا للسحب وإعادته إلى محفظة زين كاش، بعد استبعاد أي مبالغ محجوزة أو قيد التسوية أو مرتبطة بأوامر شراء مفتوحة.</li>
                </ul>

                <div class="kb-callout" style="background:#fff7ed; border-right:4px solid #f97316; padding:15px; border-radius:10px; margin:15px 0;">
                    <i class="fa-solid fa-scale-balanced" style="color:#f97316; font-size:1.2rem;"></i>
                    <div>
                        <strong>الفرق بين النقد (Cash) والرصيد الحر المتاح للسحب:</strong><br>
                        النقد يمثل إجمالي الرصيد النقدي في حساب التداول (بما في ذلك المبالغ قيد التسوية). أما الرصيد الحر المتاح للسحب، فهو الجزء الذي يمكن سحبه وإعادته للمحفظة فوراً.<br>
                        <em>مثال توضيحي:</em> لنفترض أن لديك 500 دولار في حساب التداول، ثم قمت ببيع أسهم بقيمة 100 دولار خلال اليوم، ليصبح النقد (Cash) في حسابك 600 دولار. لكن الرصيد النقدي الحر المتاح للسحب سيبقى 500 دولار فقط، لأن مبلغ 100 دولار الناتج عن البيع لا يزال قيد التسوية ولا يمكن سحبه إلا بعد اكتمال التسوية، حيث يصبح المبلغ كاملاً (600 دولار) متاحاً للسحب.
                    </div>
                </div>

                <h4>الإيداع إلى حساب التداول</h4>
                <ol>
                    <li>الدخول إلى خدمة التداول ثم اختيار <strong>الإيداع</strong> من القائمة الرئيسية.</li>
                    <li>إدخال مبلغ الإيداع المطلوب (الحد الأدنى للإيداع هو <strong>1 دولار أمريكي</strong>، والحد الأقصى الشهري للإيداع هو ما يعادل <strong>20,000,000 دينار عراقي</strong> بالدولار الأمريكي، وفقًا لسعر الصرف المعتمد).</li>
                    <li>مراجعة تفاصيل العملية (مبلغ الإيداع، سعر الصرف المعتمد، الرسوم، والمبلغ النهائي المستقطع من المحفظة).</li>
                    <li>الموافقة على العملية وتأكيد الإيداع.</li>
                </ol>

                <h4>السحب من حساب التداول</h4>
                <ol>
                    <li>ادخل إلى خدمة الأسهم، ثم اختر <strong>سحب</strong> من الصفحة الرئيسية.</li>
                    <li>أدخل مبلغ السحب المطلوب (الحد الأدنى للسحب هو <strong>1 دولار أمريكي</strong>، والحد الأقصى الشهري للسحب هو ما يعادل <strong>20,000,000 دينار عراقي</strong> بالدولار الأمريكي).</li>
                    <li>راجع تفاصيل العملية واضغط موافقة ليتم تحويل المبلغ إلى محفظة زين كاش.</li>
                </ol>
                <p><strong>ملاحظة مهمة:</strong> لا يمكنك سحب قيمة الأسهم مباشرة، ويجب بيع الأسهم أولاً (خلال ساعات التداول الرسمية للسوق الأمريكي فقط) لتتحول إلى رصيد نقدي في حساب التداول، ثم يمكنك سحب هذا الرصيد إلى محفظة زين كاش.</p>
                <p><strong>سعر الصرف:</strong> سيظهر لك سعر الصرف بشكل واضح قبل تأكيد عملية الإيداع أو السحب، ويتم التنفيذ وفق سعر الصرف الظاهر على الشاشة وقت التأكيد.</p>
            </div>
        `
    },
    {
        title: "4. شراء وبيع الأسهم، أنواع الأوامر، الصلاحيات وحالات التنفيذ",
        category: "الأسهم والتداول",
        icon: "fa-right-left",
        content: `
            <div class="kb-article">
                <h3>ضوابط التداول، الأوامر وشروط التنفيذ</h3>
                
                <h4>الأسهم المتاحة وغير المتاحة</h4>
                <p>تتيح الخدمة تداول الأسهم الأمريكية المدرجة في البورصات الأمريكية فقط.</p>
                <p><strong>الغير متاح حالياً:</strong> الأسهم غير الأمريكية، العملات الرقمية (Cryptocurrencies)، صناديق المؤشرات (ETFs)، عقود الخيارات (Options)، التداول بالهامش (Margin Trading)، والبيع على المكشوف (Short Selling).</p>

                <h4>ساعات عمل السوق الأمريكي بتوقيت بغداد</h4>
                <p>تبدأ جلسة التداول الرسمية من الساعة 9:30 صباحاً حتى 4:00 عصراً بالتوقيت الشرقي للولايات المتحدة (ET) من الإثنين إلى الجمعة.</p>
                <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
                    <thead>
                        <tr style="background:#f1f5f9; text-align:right;">
                            <th style="padding:8px; border:1px solid #cbd5e1;">الفترة</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">وقت الافتتاح (بغداد)</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">وقت الإغلاق (بغداد)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;">التوقيت الصيفي الأمريكي (منتصف آذار – أوائل تشرين الثاني)</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">4:30 مساءً</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">11:00 مساءً</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;">التوقيت الشتوي الأمريكي (تشرين الثاني – منتصف آذار)</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">5:30 مساءً</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">12:00 منتصف الليل</td>
                        </tr>
                    </tbody>
                </table>

                <h4>حالات السوق داخل التطبيق</h4>
                <ul>
                    <li><strong>السوق مفتوح (Open):</strong> جلسة التداول الرسمية نشطة حالياً ويمكن تنفيذ أوامر البيع والشراء فوراً.</li>
                    <li><strong>السوق مغلق (US Market Closed):</strong> السوق خارج ساعات التداول وتظهر شارة حمراء. تبقى الأوامر المرسلة معلّقة (Pending) حتى إعادة فتح السوق في الجلسة التالية، ويمكن إلغاؤها في أي وقت طالما هي معلقة.</li>
                </ul>

                <h4>كيف يشتري العميل سهماً؟</h4>
                <ol>
                    <li>البحث عن السهم بالاسم أو الرمز من صفحة الاستكشاف أو قائمة المراقبة.</li>
                    <li>فتح صفحة تفاصيل السهم والضغط على <strong>شراء</strong> (مع تحديد سهم كامل أو كسور).</li>
                    <li>اختيار نوع الأمر: <strong>أمر السوق (Market)</strong> أو <strong>الأمر المحدد (Limit)</strong>.</li>
                    <li>إدخال الكمية والسعر (إذا كان Limit) واختيار صلاحية الأمر (Day, GTC, FOK).</li>
                    <li>مراجعة الملخص وتأكيد العملية بالبصمة البيومترية أو الرمز السري (PIN).</li>
                </ol>

                <h4>أسباب رفض طلب شراء الأسهم</h4>
                <ul>
                    <li>عدم كفاية القوة الشرائية.</li>
                    <li>أوامر معلّقة (Pending) تحجز جزءاً من الرصيد.</li>
                    <li>خطأ في شروط الأمر (كمية غير صحيحة أو سعر غير منطقي).</li>
                    <li>عدم توفر الكمية أو السعر المطلوب في السوق.</li>
                    <li>قيود على الحساب مثل انتهاء الاشتراك.</li>
                </ul>

                <h4>الفرق بين أمر السوق (Market Order) والأمر المحدد (Limit Order)</h4>
                <ul>
                    <li><strong>أمر السوق (Market Order):</strong> ينفذ فوراً بسعر السوق الحالي وقت الطلب دون تحديد سعر مسبق.</li>
                    <li><strong>الأمر المحدد (Limit Order):</strong> يحدد العميل سعراً معيناً للشراء أو البيع، ولا ينفذ الأمر إلا عند الوصول لهذا السعر أو أفضل منه.</li>
                </ul>

                <h4>انواع صلاحية الأوامر (Order Duration - TIF)</h4>
                <ul>
                    <li><strong>Day (صلاحية ليوم واحد):</strong> يبقى فعالاً خلال يوم التداول الحالي ويُلغى تلقائياً عند الإغلاق إذا لم يُنفّذ.</li>
                    <li><strong>GTC (Good Till Cancelled):</strong> يبقى فعالاً في النظام (أيام أو أسابيع) حتى ينفذ أو يلغيه العميل.</li>
                    <li><strong>FOK (Fill or Kill):</strong> ينفذ بالكامل وفوراً بنفس اللحظة أو يلغى مباشرة بدون تنفيذ جزئي.</li>
                </ul>

                <h4>حالات الأمر وإلغاؤها</h4>
                <p>حالات الأمر: Pending (قيد الانتظار)، Executed (منفذ)، Partially Filled (منفذ جزئياً)، Cancelled (ملغى)، Rejected (مرفوض)، Expired (منتهي).</p>
                <p>يمكن إلغاء الأوامر المفتوحة طالما أنها في حالة <strong>Pending</strong> أو <strong>Partially Filled</strong> من قسم المعاملات -> إلغاء الأمر.</p>
            </div>
        `
    },
    {
        title: "5. متابعة الأداء، الأساسيات المالية، التوزيعات وإعدادات الحساب وحماية SIPC",
        category: "الأسهم والتداول",
        icon: "fa-chart-pie",
        content: `
            <div class="kb-article">
                <h3>التحليل المالي، الأرباح، الكشوفات وحماية المستثمر</h3>
                
                <h4>المؤشرات والأساسيات المالية</h4>
                <ul>
                    <li><strong>EPS (Earnings Per Share):</strong> ربح الشركة المنسوب لكل سهم؛ ارتفاعه يدل على ربحية الشركة.</li>
                    <li><strong>Dividend Yield:</strong> نسبة توزيعات الأرباح السنوية التقديرية مقارنة بسعر السهم.</li>
                    <li><strong>P/E (Price to Earnings):</strong> نسبة السعر إلى الأرباح؛ تقارن سعر السهم بأرباحه لتقييم تسعيره.</li>
                    <li><strong>P/B (Price to Book):</strong> نسبة السعر إلى القيمة الدفترية.</li>
                    <li><strong>P/S (Price to Sales):</strong> نسبة السعر إلى المبيعات والإيرادات.</li>
                    <li><strong>P/CF & P/FCF:</strong> نسبة السعر للتدفق النقدي والتدفق النقدي الحر.</li>
                    <li><strong>Market Cap:</strong> القيمة السوقية الإجمالية للشركة (سعر السهم × إجمالي الأسهم المصدرة).</li>
                </ul>

                <h4>الربح والخسارة (Profit & Loss)</h4>
                <ul>
                    <li><strong>ربح/خسارة غير محققة (Unrealized P&L):</strong> أرباح أو خسائر على الورق للأسهم التي تملكها حالياً وتتغير مع حركة السوق ولا تتحول لنقد إلا عند البيع.</li>
                    <li><strong>ربح/خسارة محققة (Realized P&L):</strong> الأرباح أو الخسائر الفعلية الناتجة بعد تنفيذ عملية بيع السهم.</li>
                </ul>

                <h4>توزيعات الأرباح (Dividends) والضرائب</h4>
                <p>تقوم بعض الشركات بتوزيع جزء من أرباحها نقداً. عند الصرف يتم إضافة المبلغ تلقائياً إلى رصيد حساب التداول وتظهر في كشف الحساب باسم Dividend.</p>
                <p><strong>ملاحظة ضريبية:</strong> قد يتم اقتطاع ضريبة أمريكية من توزيعات الأرباح بموجب نموذج W-8BEN ويمكن الاطلاع عليها من إعدادات التداول -> مستند الضريبة.</p>

                <h4>إعدادات حساب التداول وإغلاقه</h4>
                <ul>
                    <li><strong>المستندات:</strong> تحميل كشف الحساب الشهري واليومي بصيغة PDF.</li>
                    <li><strong>جهة اتصال موثوقة (Trusted Contact):</strong> شخص بعمر 18 سنة فأكثر للتواصل معه في الحالات الطارئة دون منح صلاحية تداول.</li>
                    <li><strong>إغلاق الحساب النهائي:</strong> خيار يتيح طلب إغلاق الحساب نهائياً بشرط عدم وجود أي أموال أو أسهم في الحساب، وسيظهر حالة الحساب أنه "مغلق".</li>
                </ul>

                <h4 style="margin-top:15px;">حماية المستثمر (SIPC)</h4>
                <div class="kb-callout" style="background:#f0fdf4; border-right:4px solid #16a34a; padding:15px; border-radius:10px;">
                    <i class="fa-solid fa-shield-halved" style="color:#16a34a; font-size:1.2rem;"></i>
                    <div>
                        حسابك التداولي لدى شركة الوساطة Alpaca مشمول بحماية SIPC <strong>حتى 500,000 دولار أمريكي</strong>، منها حد أقصى <strong>250,000 دولار للنقد</strong>.<br>
                        <em>تشمل الحماية:</em> إفلاس أو تعثر شركة الوساطة لاسترداد الأسهم والأموال.<br>
                        <em>لا تشمل الحماية:</em> خسائر التداول الناتجة عن انخفاض أو ارتفاع أسعار الأسهم في السوق.
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "6. قاموس المصطلحات المالية المعتمدة (Glossary)",
        category: "الأسهم والتداول",
        icon: "fa-book-bookmark",
        content: `
            <div class="kb-article">
                <h3>قاموس المصطلحات المعتمدة في خدمة تداول الأسهم</h3>
                <p>جدول توضيحي شامل يضم جميع المصطلحات باللغتين العربية والإنكليزية وتعاريفها المعتمدة:</p>
                
                <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:15px;">
                    <thead>
                        <tr style="background:#1e293b; color:#ffffff; text-align:right;">
                            <th style="padding:10px; border:1px solid #334155;">المصطلح (عربي)</th>
                            <th style="padding:10px; border:1px solid #334155;">English Term</th>
                            <th style="padding:10px; border:1px solid #334155;">التعريف المبسّط والمعتمد</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>سهم</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Stock / Share</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">حصة ملكية صغيرة في شركة مدرجة في البورصة.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>البورصة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Stock Exchange</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">السوق الذي تُباع وتُشترى فيه الأسهم (مثل NYSE وNasdaq).</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>رمز السهم</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Ticker Symbol</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">رمز مختصر للشركة في البورصة مثل أبل AAPL ومايكروسوفت MSFT.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>كسور الأسهم</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Fractional Shares</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">شراء جزء من السهم بدلاً من سهم كامل (مثلاً 0.25 سهم).</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>أمر السوق</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Market Order</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">أمر بالتنفيذ فوراً بأفضل سعر متاح وقت الطلب.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>الأمر المحدّد</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Limit Order</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">أمر يُنفَّذ فقط عند سعر يحدّده العميل أو أفضل منه.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>مدة صلاحية الأمر</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Time in Force (TIF)</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">مدة بقاء الأمر فعّالاً في النظام (Day, GTC, FOK).</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>ليوم واحد</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Day</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">أمر صالح خلال جلسة اليوم الحالي فقط ويُلتغى بالإغلاق.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>التنفيذ الكامل أو الإلغاء</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Fill or Kill (FOK)</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">يُنفَّذ بالكامل فوراً أو يُلغى مباشرة دون تنفيذ جزئي.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>القوة الشرائية</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Buying Power</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">النقد المتاح للشراء في حساب التداول.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>المحفظة الاستثمارية</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Portfolio</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">مجموع ممتلكات العميل من نقد وأسهم.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>صافي الثروة / المحفظة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Equity / Net Worth</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">النقد + القيمة السوقية الحالية للأسهم.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>ربح/خسارة غير محقّقة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Unrealized P&L</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">ربح أو خسارة على الورق قبل بيع الأسهم.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>ربح/خسارة محقّقة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Realized P&L</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">الربح أو الخسارة الفعلية الناتجة بعد بيع السهم.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>قائمة المراقبة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Watchlist</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">قائمة أسهم يتابع العميل أسعارها.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>التسجيل والربط</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Onboarding</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">عملية فتح الحساب والتحقّق من الهوية.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>شخص معرّض سياسياً</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">PEP</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">شخص يشغل منصباً عاماً رفيعاً قد يُرفض أو يراجع الطلب.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>نموذج ضريبي أمريكي</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">W-8BEN</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">نموذج يثبت أن العميل شخص غير أمريكي لأغراض الضريبة.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>جهة اتصال موثوقة</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Trusted Contact</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">شخص بعمر 18+ للتواصل عند الطوارئ بلا صلاحية تداول.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>توزيعات الأرباح</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">Dividends</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">جزء من أرباح الشركة يُوزّع نقداً على المساهمين.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>سعر الصرف</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">FX Rate</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">سعر تحويل الدينار العراقي إلى الدولار الأمريكي والعكس.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>هيئة الأوراق المالية الأمريكية</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">SEC</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">الجهة الأمريكية المُنظِّمة والراقبة لشركات الوساطة والبورصات.</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border:1px solid #cbd5e1;"><strong>مؤسسة حماية المستثمر</strong></td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">SIPC</td>
                            <td style="padding:8px; border:1px solid #cbd5e1;">تحمي حساب العميل عند تعثّر الوسيط حتى 500,000$ (250,000$ للنقد).</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    }
];

// Read db.json, update knowledgeBase to ONLY US stock trading articles, keep slides, scenarios, dispositions
let db = {};
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
    db = JSON.parse(clean);
} catch(e) {
    console.error("Could not read db.json", e);
}

db.knowledgeBase = fullUSStocksKb;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log("Successfully updated db.json with ONLY the new US Stock Trading Guide articles!");
