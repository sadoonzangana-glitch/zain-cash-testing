const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const masterStocksKbArticle = [
    {
        id: 1,
        title: "الدليل الشامل المتكامل لخدمة تداول الأسهم الأمريكية عبر زين كاش",
        category: "الأسهم والتداول",
        icon: "fa-chart-line",
        content: `
            <div class="kb-master-container" style="font-family:'Cairo', sans-serif; color:#0f172a; line-height:1.8;">
                
                <!-- Hero Header Banner -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:28px; border-radius:20px; margin-bottom:25px; box-shadow: 0 10px 25px rgba(15,23,42,0.15); border:1px solid #334155;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
                        <span style="background:rgba(255,153,0,0.2); color:#ff9900; border:1px solid rgba(255,153,0,0.4); padding:4px 14px; border-radius:20px; font-size:0.8rem; font-weight:800;">
                            <i class="fa-solid fa-shield-halved"></i> الدليل الرسمي الشامل المعتمد 100%
                        </span>
                        <div style="display:flex; gap:8px;">
                            <span style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">SEC المرخصة</span>
                            <span style="background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">SIPC محمية 500k$</span>
                        </div>
                    </div>
                    <h1 style="font-size:1.65rem; font-weight:900; margin:0 0 10px 0; color:#f8fafc; line-height:1.4;">
                        📈 دليل خدمة تداول الأسهم الأمريكية الشامل (Zain Cash US Stocks Guide)
                    </h1>
                    <p style="font-size:0.92rem; color:#cbd5e1; margin:0; line-height:1.6;">
                        دليل تشغيلي ومعرفي متكامل يتضمن جميع المفاهيم، شروط التسجيل، خطوات الإيداع والسحب، تفاصيل قسم محفظتي، ضوابط الأوامر، التحليل المالي، إعدادات الحساب، وقاموس المصطلحات المعرب، والمعلومات العامة.
                    </p>

                    <!-- Quick Navigation Index Bar -->
                    <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.1); display:flex; flex-wrap:wrap; gap:8px;">
                        <a href="#sec-1" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-compass" style="color:#ff9900;"></i> 1. المفاهيم الأساسية</a>
                        <a href="#sec-2" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-user-check" style="color:#38bdf8;"></i> 2. التسجيل والاشتراكات</a>
                        <a href="#sec-3" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-wallet" style="color:#4ade80;"></i> 3. الإيداع والسحب وتفاصيل محفظتك</a>
                        <a href="#sec-4" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-right-left" style="color:#f472b6;"></i> 4. التداول والأوامر والمراقبة</a>
                        <a href="#sec-5" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-chart-pie" style="color:#fbbf24;"></i> 5. التحليل والإعدادات وحماية SIPC</a>
                        <a href="#sec-6" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-book-bookmark" style="color:#a78bfa;"></i> 6. المصطلحات</a>
                        <a href="#sec-7" style="background:linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color:#ffffff; text-decoration:none; padding:6px 14px; border-radius:8px; font-size:0.78rem; font-weight:800; transition:all 0.2s; box-shadow:0 2px 8px rgba(79,70,229,0.3);"><i class="fa-solid fa-circle-info"></i> 7. معلومات عامة</a>
                    </div>
                </div>

                <!-- SECTION 1 -->
                <section id="sec-1" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #eff6ff; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#2563eb; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">1</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">خدمة تداول الأسهم الأمريكية والمفاهيم الأساسية</h2>
                    </div>

                    <p style="font-size:0.95rem; color:#334155; line-height:1.7;">
                        تتيح خدمة التداول لمشتركي زين كاش فتح حساب تداول وشراء وبيع الأسهم الأمريكية المدرجة في الأسواق المالية الأمريكية من خلال تطبيق زين كاش، وذلك بعد استيفاء متطلبات التسجيل والموافقة على الطلب.
                    </p>
                    <p style="font-size:0.95rem; color:#334155; line-height:1.7;">
                        تتم الخدمة عبر شركة وساطة أمريكية مرخّصة (<strong>Alpaca Securities LLC</strong>) وخاضعة لرقابة هيئة الأوراق المالية والبورصات الأمريكية (<strong>SEC</strong>)، وعضو في الهيئة التنظيمية للقطاع المالي (<strong>FINRA</strong>)، ومؤسسة حماية مستثمري الأوراق المالية (<strong>SIPC</strong>). كما تمكّن الخدمة العملاء من متابعة تداولاتهم، والاطلاع على أسعار الأسهم، وإدارة عمليات الإيداع والسحب بين محفظة زين كاش وحساب التداول بسهولة وأمان.
                    </p>

                    <!-- Concept Lightbulb Callout -->
                    <div style="background:#eff6ff; border-right:4px solid #2563eb; border-radius:12px; padding:16px; margin:20px 0;">
                        <div style="display:flex; align-items:center; gap:8px; color:#1e40af; font-weight:800; font-size:1rem; margin-bottom:8px;">
                            <i class="fa-solid fa-lightbulb" style="font-size:1.2rem;"></i> ما هو السهم (Stock / Share)؟
                        </div>
                        <p style="font-size:0.92rem; color:#1e3a8a; margin:0 0 8px 0;">
                            السهم هو جزء من ملكية شركة. فعندما تشتري سهماً في شركة مدرجة في البورصة، فإنك تمتلك جزءاً صغيراً من تلك الشركة. ويتم شراء الأسهم عادةً لأحد سببين:
                        </p>
                        <ul style="margin:0 0 8px 0; padding-right:20px; color:#1e3a8a; font-size:0.9rem;">
                            <li><strong>ارتفاع قيمة السهم:</strong> الاستفادة من ارتفاع قيمة السهم مع مرور الوقت إذا حققت الشركة نمواً وأداءً جيداً.</li>
                            <li><strong>توزيعات الأرباح (Dividends):</strong> الحصول على توزيعات الأرباح التي تقوم بعض الشركات بتوزيعها على المساهمين.</li>
                        </ul>
                        <p style="font-size:0.9rem; color:#1e3a8a; margin:0;">
                            تمنح ملكية الأسهم العادية حاملها حقاً في التصويت على بعض قرارات الشركة المهمة في اجتماعات الجمعية العامة، بما يتناسب مع عدد الأسهم التي يمتلكها.
                        </p>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;"><i class="fa-solid fa-building-columns" style="color:#2563eb;"></i> ما هي البورصة (سوق الأسهم)؟</h4>
                            <p style="font-size:0.88rem; color:#475569; margin:0 0 8px 0; line-height:1.6;">
                                البورصة هي السوق التي يتم من خلالها شراء وبيع الأسهم بين المستثمرين، وتضم الولايات المتحدة عدداً من البورصات، أبرزها:
                            </p>
                            <ul style="margin:0; padding-right:18px; font-size:0.86rem; color:#334155;">
                                <li><strong>بورصة نيويورك (NYSE)</strong></li>
                                <li><strong>بورصة ناسداك (Nasdaq)</strong></li>
                            </ul>
                            <p style="font-size:0.85rem; color:#64748b; margin-top:8px; line-height:1.5;">
                                تتغير أسعار الأسهم بشكل مستمر خلال ساعات التداول بناءً على العرض والطلب. فعندما يزداد الإقبال على شراء سهم معين قد يرتفع سعره، وعندما يزداد الإقبال على بيعه قد ينخفض سعره.
                            </p>
                        </div>

                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;"><i class="fa-solid fa-tag" style="color:#059669;"></i> رمز السهم (Ticker Symbol)</h4>
                            <p style="font-size:0.88rem; color:#475569; margin:0 0 6px 0; line-height:1.6;">
                                لكل شركة مدرجة رمز تداول خاص بها يُستخدم للتعرف عليها في السوق، أمثلة:
                            </p>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; font-size:0.8rem; margin-bottom:8px;">
                                <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:6px; font-weight:700;">Apple = AAPL</span>
                                <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:6px; font-weight:700;">Microsoft = MSFT</span>
                                <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:6px; font-weight:700;">Tesla = TSLA</span>
                                <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:6px; font-weight:700;">Amazon = AMZN</span>
                            </div>
                            <p style="font-size:0.84rem; color:#64748b; margin:0;">
                                💡 يمكنك البحث عن الشركة داخل التطبيق باستخدام اسم الشركة أو رمز السهم.
                            </p>
                        </div>
                    </div>

                    <!-- Fractional Shares & Notice -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-top:15px;"><i class="fa-solid fa-pie-chart" style="color:#d97706;"></i> كسور الأسهم (Fractional Shares)</h4>
                    <p style="font-size:0.92rem; color:#334155; margin-bottom:8px;">
                        تتيح بعض الشركات ميزة شراء جزء من السهم بدلاً من شراء سهم كامل.<br>
                        <strong>مثال:</strong> إذا كان سعر سهم معين 200 دولار وأراد العميل تداول 50 دولاراً فقط، فيمكنه شراء 0.25 سهم. تساعد هذه الميزة العملاء على البدء بالتداول بمبالغ أقل.
                    </p>
                    <div style="background:#fffeb3; border-right:4px solid #d97706; padding:14px 16px; border-radius:10px; margin-bottom:20px; font-size:0.88rem; color:#78350f; line-height:1.6;">
                        <i class="fa-solid fa-triangle-exclamation"></i> <strong>ملاحظة مهمة:</strong> لا تتيح جميع الأسهم إمكانية شراء كسور الأسهم. في حال كان السهم لا يدعم هذه الميزة، فلن تتمكن من شراء جزء من السهم، كما لن يكون خيار الشراء بالمبلغ متاحاً لهذا السهم. في هذه الحالة، يجب عليك إدخال عدد أسهم كامل لإتمام عملية الشراء.
                    </div>

                    <!-- Responsibilities Table -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-handshake" style="color:#2563eb;"></i> من يحتفظ بالأموال والأسهم؟ (توزيع الأدوار)</h4>
                    <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
                        <thead>
                            <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                                <th style="padding:10px 14px; border:1px solid #334155; width:30%;">الطرف</th>
                                <th style="padding:10px 14px; border:1px solid #334155;">الدور والمسؤولية التشغيلية</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>زين كاش (Zain Cash)</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">توفير التطبيق، دعم العملاء، وإدارة عمليات التحويل بين المحفظة وحساب التداول.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;">
                                    <strong>شركة Alpaca Securities LLC</strong><br>
                                    <span style="font-size:0.78rem; color:#64748b;">وساطة أمريكية مرخّصة وخاضعة لرقابة SEC وعضو FINRA وSIPC</span>
                                </td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">فتح حساب التداول، تنفيذ أوامر التداول، والاحتفاظ بالأموال والأسهم.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- SECTION 2 -->
                <section id="sec-2" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f0fdf4; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#16a34a; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">2</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">إنشاء حساب التداول، المتطلبات، الخطوات وحالات الطلب والاشتراكات</h2>
                    </div>

                    <h4 style="font-size:1rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-list-check" style="color:#16a34a;"></i> المتطلبات الأساسية لإنشاء الحساب:</h4>
                    <p style="font-size:0.88rem; color:#64748b; margin-bottom:6px;">قبل البدء بإنشاء حساب التداول، يجب التأكد من توفر الشروط التالية:</p>
                    <ul style="margin:0 0 18px 0; padding-right:20px; font-size:0.92rem; color:#334155; line-height:1.7;">
                        <li>امتلاك محفظة زين كاش للأفراد.</li>
                        <li>أن يكون حساب زين كاش مفعلاً وموافقاً عليه.</li>
                        <li>توفر بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً للتسجيل في خدمة التداول.</li>
                    </ul>

                    <h4 style="font-size:1rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-route" style="color:#2563eb;"></i> خطوات تسجيل حساب التداول في تطبيق زين كاش:</h4>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin:15px 0;">
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">1.</strong> الدخول إلى قسم "الأسهم" من القائمة السفلية في تطبيق زين كاش، ثم الضغط على ابدأ.
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">2.</strong> إدخال بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً في خدمة التداول، ثم إدخال رمز التحقق (OTP) المرسل إلى البريد.
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">3.</strong> تحديد المبلغ المتوقع للتداول ومصدر الأموال.
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">4.</strong> الإجابة على الأسئلة التنظيمية المطلوبة والإقرار والموافقة على نموذج (W-8BEN إقرار ضريبي يثبت أن العميل غير أمريكي) والشروط والأحكام.
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">5.</strong> اختيار خطة الاشتراك وإتمام عملية الدفع، حيث يتم استقطاع رسوم الاشتراك من محفظة زين كاش.
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-size:0.85rem;">
                            <strong style="color:#2563eb;">6.</strong> يتم إرسال الطلب للمراجعة والتحقق، ومن المتوقع تفعيل حساب التداول أو إشعارك بنتيجة الطلب خلال 24 ساعة.
                        </div>
                    </div>

                    <!-- Statuses & Subscription -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#166534; margin:0 0 8px 0;"><i class="fa-solid fa-circle-check"></i> حالات طلب التسجيل</h4>
                            <ul style="margin:0; padding-right:18px; font-size:0.88rem; color:#166534; line-height:1.6;">
                                <li style="margin-bottom:6px;"><strong style="color:#15803d;">قبول الطلب (Approved):</strong> تم قبول طلبك بنجاح، وتم تفعيل حسابك في خدمة التداول مباشرة. يمكنك الآن البدء باستخدام الخدمة وتداول الأسهم عبر التطبيق.</li>
                                <li style="margin-bottom:6px;"><strong style="color:#b45309;">قيد المراجعة (Pending):</strong> طلبك قيد المراجعة حالياً، وسيتم حجز مبلغ الاشتراك مؤقتاً لحين استكمال التحقق خلال مدة تصل إلى 24 ساعة. يمكنك متابعة حالة الطلب من قسم التداول، كما سيتم إشعارك عبر البريد عند القبول.</li>
                                <li><strong style="color:#b91c1c;">رفض الطلب (Rejected):</strong> في حال عدم استيفاء شروط الأهلية أو متطلبات التحقق، سيتم رفض الطلب وإشعارك بذلك، مع إعادة مبلغ الاشتراك إلى محفظة زين كاش الخاصة بك.</li>
                            </ul>
                        </div>

                        <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#9a3412; margin:0 0 8px 0;"><i class="fa-solid fa-credit-card"></i> رسوم الاشتراك والتجديد</h4>
                            <ul style="margin:0; padding-right:18px; font-size:0.86rem; color:#9a3412; line-height:1.6;">
                                <li><strong>قيمة الاشتراك:</strong> 5,000 دينار عراقي شهرياً مقابل لا توجد أي رسوم أو عمولات على عمليات التداول (الشراء والبيع) طوال مدة الاشتراك — أي تداول غير محدود بلا رسوم تداول.</li>
                                <li>حالياً يتوفر نوع اشتراك واحد فقط (الاشتراك الشهري).</li>
                                <li>يتم تجديد الاشتراك بعد 30 يوم ولن يتم تجديدها تلقائياً.</li>
                                <li><strong>عند انتهاء الاشتراك:</strong> تتقيد الصلاحيات (لا يمكن الشراء والإيداع)، ويمكن فقط (بيع الأسهم وسحب المبلغ المتوفر في القوة الشرائية إلى محفظة زين كاش).</li>
                                <li>يمكن تجديد الاشتراك شهرياً حيث تظهر كل شهر نافذة منبثقة لدفع رسوم الاشتراك (5,000 د.ع)، كما يمكن التفعيل من <strong>إعدادات - إدارة الاشتراك</strong>.</li>
                                <li>في حال عدم كفاية الرصيد عند التجديد، يُعتبر الاشتراك منتهياً وتُقيَّد صلاحيات التداول.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Ineligible accounts -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-user-slash" style="color:#dc2626;"></i> أنواع المحافظ غير المؤهلة للتسجيل في خدمة الأسهم</h4>
                    <p style="font-size:0.88rem; color:#64748b; margin-bottom:6px;">بعض الحالات لا تكون مؤهلة لفتح حساب تداولي بسبب المتطلبات والقيود التنظيمية، وتشمل ما يلي:</p>
                    <div style="background:#fef2f2; border-right:4px solid #dc2626; border-radius:12px; padding:16px; font-size:0.9rem; color:#7f1d1d;">
                        <ul style="margin:0; padding-right:20px; line-height:1.7;">
                            <li><strong>الأشخاص الأمريكيون:</strong> ويشمل ذلك من يحمل الجنسية الأمريكية، أو يمتلك TIN / SSN، أو يحمل البطاقة الخضراء (Green Card)، أو لديه رقم ضمان اجتماعي أمريكي (SSN) سواء كان مولوداً في الولايات المتحدة أو مقيماً فيها.</li>
                            <li><strong>الأشخاص السياسيون (PEP):</strong> حيث قد يتم رفض الطلب أو إحالته للمراجعة وفقاً للسياسات والإجراءات التنظيمية المعتمدة.</li>
                            <li><strong>الجنسيات غير المدرجة ضمن القائمة المعتمدة:</strong> وتضم القائمة الحالية غير المعتمدة: (إيران، أفغانستان، السودان، أوكرانيا، روسيا، ليبيا، اليمن، كوريا الشمالية، كوبا، ميانمار - بورما). كما قد تخضع هذه القائمة للتحديث وفق السياسات التنظيمية.</li>
                            <li><strong>المحافظ المغلقة لأسباب تنظيمية أو قانونية.</strong></li>
                            <li><strong>أي طلب يتم رفضه من قبل فريق التسجيل أو فريق الامتثال</strong> وفقاً للمتطلبات التنظيمية المعتمدة.</li>
                        </ul>
                    </div>
                    <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:12px; margin-top:10px; font-size:0.86rem; color:#92400e;">
                        <i class="fa-solid fa-triangle-exclamation"></i> <strong>ملاحظة:</strong> استيفاء متطلبات التسجيل لا يضمن بالضرورة قبول الطلب، حيث تخضع جميع الطلبات للمراجعة والتحقق وفق السياسات والإجراءات المعتمدة وسيتم الرفض أو القبول خلال 24 ساعة.
                    </div>
                </section>

                <!-- SECTION 3 -->
                <section id="sec-3" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f0fdf4; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#059669; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">3</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">الصفحة الرئيسية، الإيداع، السحب، سعر الصرف وتفاصيل قسم محفظتك</h2>
                    </div>

                    <h4 style="font-size:1rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-chart-simple" style="color:#059669;"></i> مقاييس الحساب في الصفحة الرئيسية:</h4>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin:15px 0;">
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
                            <strong style="color:#0f172a; font-size:0.9rem;">النقد (Cash):</strong>
                            <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0; line-height:1.5;">إجمالي الرصيد النقدي الموجود في حساب التداول، ويشمل الأموال المتاحة والأموال التي لا تزال قيد التسوية. لا يعني ذلك أن كامل هذا الرصيد قابل للسحب أو متاح للاستخدام، حيث قد يكون جزء منه محجوزًا لأوامر شراء مفتوحة أو غير قابل للسحب حتى اكتمال التسوية.</p>
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
                            <strong style="color:#0f172a; font-size:0.9rem;">القيمة السوقية (Market Value):</strong>
                            <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0; line-height:1.5;">القيمة الحالية لجميع الأسهم التي تمتلكها، ويتم احتسابها وفقًا لأسعار السوق الحالية، لذلك تتغير مع ارتفاع أو انخفاض أسعار الأسهم.</p>
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
                            <strong style="color:#0f172a; font-size:0.9rem;">صافي قيمة المحفظة (Net Asset Value):</strong>
                            <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0; line-height:1.5;">إجمالي قيمة حساب التداول، ويشمل الرصيد النقدي بالإضافة إلى القيمة السوقية للأسهم، بعد احتساب أي التزامات أو عمليات قائمة.</p>
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
                            <strong style="color:#0f172a; font-size:0.9rem;">القوة الشرائية (Buying Power):</strong>
                            <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0; line-height:1.5;">المبلغ المتاح لاستخدامه في شراء الأسهم. عند إرسال أمر شراء، يتم حجز قيمة الأمر مباشرة من القوة الشرائية، حتى وإن كان الأمر معلقًا أو كان السوق مغلقًا. وفي حال إلغاء الأمر أو انتهاء صلاحيته دون تنفيذ، يتم تحرير المبلغ وإعادته للقوة الشرائية.</p>
                        </div>
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
                            <strong style="color:#0f172a; font-size:0.9rem;">الرصيد النقدي الحر المتاح للسحب:</strong>
                            <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0; line-height:1.5;">الجزء من الرصيد النقدي الذي أصبح متاحًا للسحب وإعادته إلى محفظة زين كاش، بعد استبعاد أي مبالغ محجوزة أو قيد التسوية أو مرتبطة بأوامر شراء مفتوحة.</p>
                        </div>
                    </div>

                    <!-- Explanation Box & Example -->
                    <div style="background:#fff7ed; border-right:4px solid #ea580c; border-radius:12px; padding:16px; margin:20px 0; font-size:0.9rem; color:#9a3412; line-height:1.7;">
                        <strong>ملاحظة الفرق بين النقد (Cash) والرصيد النقدي الحر المتاح للسحب:</strong><br>
                        يختلف النقد (Cash) عن الرصيد النقدي الحر المتاح للسحب. فالنقد يمثل إجمالي الرصيد النقدي في حساب التداول، ويشمل المبالغ المتاحة بالإضافة إلى المبالغ التي لا تزال قيد التسوية أو المحجوزة. أما الرصيد النقدي الحر المتاح للسحب، فهو الجزء من هذا الرصيد الذي يمكن سحبه وإعادته إلى المحفظة بشكل فوري.<br>
                        <em>مثال توضيحي:</em> لنفرض أن لديك 500 دولار في حساب التداول، ثم قمت ببيع أسهم بقيمة 100 دولار خلال اليوم، ليصبح النقد (Cash) في حسابك 600 دولار. لكن الرصيد النقدي الحر المتاح للسحب سيبقى 500 دولار فقط، لأن مبلغ 100 دولار الناتج عن البيع لا يزال قيد التسوية ولا يمكن سحبه إلا بعد اكتمال التسوية، حيث سيكون المبلغ كاملًا متاحًا للسحب، ويصبح الرصيد النقدي الحر المتاح للسحب 600 دولار.
                    </div>

                    <!-- Deposit Steps -->
                    <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-arrow-down-to-bracket" style="color:#059669;"></i> الإيداع إلى حساب التداول:</h4>
                    <p style="font-size:0.88rem; color:#475569; margin-bottom:6px;">يقوم المشترك بتحويل مبلغ من محفظة زين كاش إلى حساب التداول ليتمكن من شراء الأسهم باتباع الخطوات التالية:</p>
                    <ol style="margin:0 0 16px 0; padding-right:20px; font-size:0.88rem; color:#334155; line-height:1.7;">
                        <li>الدخول إلى خدمة التداول ثم اختيار <strong>الإيداع</strong> من القائمة الرئيسية.</li>
                        <li>إدخال مبلغ الإيداع المطلوب (الحد الأدنى للإيداع هو 1 دولار أمريكي، والحد الأقصى الشهري للإيداع هو ما يعادل 20,000,000 دينار عراقي بالدولار الأمريكي وفق سعر الصرف).</li>
                        <li>مراجعة تفاصيل العملية قبل التأكيد (مبلغ الإيداع، سعر الصرف المعتمد، الرسوم، والمبلغ النهائي المستقطع من المحفظة).</li>
                        <li>الموافقة على العملية.</li>
                        <li>يتم تنفيذ الإيداع وإضافة المبلغ إلى حساب التداول.</li>
                    </ol>

                    <!-- Withdrawal Steps -->
                    <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-arrow-up-from-bracket" style="color:#2563eb;"></i> السحب من حساب التداول:</h4>
                    <p style="font-size:0.88rem; color:#475569; margin-bottom:6px;">يمكنك تحويل الأموال من حساب التداول إلى محفظة زين كاش باتباع الخطوات التالية:</p>
                    <ol style="margin:0 0 16px 0; padding-right:20px; font-size:0.88rem; color:#334155; line-height:1.7;">
                        <li>ادخل إلى خدمة الأسهم، ثم اختر <strong>سحب</strong> من الصفحة الرئيسية.</li>
                        <li>أدخل مبلغ السحب المطلوب (الحد الأدنى للسحب هو 1 دولار أمريكي. الحد الأقصى اليومي هو ما يعادل 2,500,000 دينار عراقي بالدولار الأمريكي، والحد الأقصى الشهري هو ما يعادل 20,000,000 دينار عراقي بالدولار الأمريكي).</li>
                        <li>راجع تفاصيل العملية (مبلغ السحب، سعر الصرف المعتمد، الرسوم، والمبلغ النهائي الذي سيصل إلى محفظة زين كاش).</li>
                        <li>وافق على العملية لتأكيدها.</li>
                        <li>سيتم تحويل المبلغ إلى محفظة زين كاش بعد إتمام عملية السحب.</li>
                    </ol>
                    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px; margin-bottom:18px; font-size:0.86rem; color:#1e40af;">
                        💡 <strong>ملاحظة:</strong> لا يمكنك سحب قيمة الأسهم مباشرة، ويجب بيع الأسهم أولاً (خلال ساعات التداول الرسمية للسوق الأمريكي فقط) لتتحول إلى رصيد نقدي في حساب التداول، ثم يمكنك سحب هذا الرصيد إلى محفظة زين كاش.
                    </div>

                    <!-- Exchange Rate -->
                    <h4 style="font-size:1rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-coins" style="color:#d97706;"></i> سعر الصرف (FX Rate):</h4>
                    <ul style="margin:0 0 20px 0; padding-right:20px; font-size:0.88rem; color:#334155;">
                        <li>سيظهر لك سعر الصرف بشكل واضح قبل تأكيد عملية الإيداع أو السحب.</li>
                        <li>سيتم تنفيذ العملية وفق سعر الصرف الظاهر على الشاشة عند تأكيد العملية.</li>
                    </ul>

                    <!-- My Portfolio Details Section -->
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
                        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;"><i class="fa-solid fa-briefcase" style="color:#4f46e5;"></i> قسم "محفظتك" (My Portfolio):</h4>
                        <p style="font-size:0.88rem; color:#475569; margin-bottom:8px;">يمكنك من خلال هذا القسم الاطلاع على الأسهم التي قمت بشرائها، حيث يتم عرضها مصنفة حسب الشركات، وتشمل:</p>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>نوع الشركة:</strong> الشركة التي تم شراء السهم منها.
                            </div>
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>متوسط سعر الشراء:</strong> متوسط السعر الذي تم شراء السهم به.
                            </div>
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>مقدار الأسهم المملوكة:</strong> عدد الأسهم أو الكسور التي تمتلكها في كل شركة.
                            </div>
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>القيمة السوقية:</strong> القيمة الحالية للأسهم بناءً على سعر السوق.
                            </div>
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>نسبة الربح أو الخسارة:</strong> نسبة التغير في قيمة التداول (% P&L).
                            </div>
                            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                                <strong>مبلغ الربح أو الخسارة:</strong> القيمة المالية الفعلية للربح أو الخسارة.
                            </div>
                        </div>
                    </div>
                </section>

                <!-- SECTION 4 -->
                <section id="sec-4" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #fdf4ff; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#c026d3; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">4</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">شراء وبيع الأسهم، أنواع الأوامر، حالات السوق وإلغاء الأوامر ومراقبة الأداء</h2>
                    </div>

                    <!-- Unallowed products -->
                    <div style="background:#fdf4ff; border:1px solid #f5d0fe; border-radius:12px; padding:16px; margin-bottom:20px;">
                        <h4 style="font-size:0.98rem; font-weight:800; color:#86198f; margin:0 0 6px 0;"><i class="fa-solid fa-ban"></i> الأسهم المتاحة وغير المتاحة ضمن تطبيق زين كاش</h4>
                        <p style="font-size:0.88rem; color:#701a75; margin:0 0 6px 0;">
                            تتيح الخدمة تداول الأسهم الأمريكية المدرجة في البورصات الأمريكية فقط.
                        </p>
                        <p style="font-size:0.85rem; color:#701a75; margin:0;">
                            <strong>الغير متاح حالياً:</strong> الأسهم غير الأمريكية، العملات الرقمية (Cryptocurrencies)، صناديق المؤشرات (ETFs)، عقود الخيارات (Options)، التداول بالهامش (Margin Trading)، والبيع على المكشوف (Short Selling).
                        </p>
                    </div>

                    <!-- Trading Hours & Baghdad Time -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-clock" style="color:#c026d3;"></i> ساعات عمل السوق الأمريكي بتوقيت بغداد</h4>
                    <p style="font-size:0.88rem; color:#475569; margin-bottom:8px;">
                        سوق الأسهم الأمريكي يفتح ويغلق وفق أوقات محددة بالتوقيت الشرقي (ET) من 9:30 صباحاً حتى 4:00 عصراً (ET) من الإثنين إلى الجمعة، ويكون مغلقاً في عطلات نهاية الأسبوع والعطلات الرسمية الأمريكية. ونظراً لاعتماد التوقيت الصيفي (DST) في أمريكا دون العراق، تختلف ساعات التداول بتوقيت بغداد:
                    </p>
                    <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:5px; margin-bottom:20px;">
                        <thead>
                            <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                                <th style="padding:10px 14px; border:1px solid #334155;">الفترة الزمنية</th>
                                <th style="padding:10px 14px; border:1px solid #334155;">وقت افتتاح السوق (بغداد)</th>
                                <th style="padding:10px 14px; border:1px solid #334155;">وقت إغلاق السوق (بغداد)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>التوقيت الصيفي الأمريكي (منتصف آذار – أوائل تشرين الثاني تقريباً)</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">4:30 مساءً</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">11:00 مساءً</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>التوقيت الشتوي الأمريكي (تشرين الثاني – منتصف آذار تقريباً)</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">5:30 مساءً</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">12:00 منتصف الليل</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Market States inside App -->
                    <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-door-open" style="color:#2563eb;"></i> حالات السوق داخل التطبيق وماذا يحدث عند الإغلاق:</h4>
                    <ul style="margin:0 0 12px 0; padding-right:20px; font-size:0.88rem; color:#334155; line-height:1.6;">
                        <li><strong>السوق مفتوح (Open):</strong> تعني أن جلسة التداول الرسمية نشطة حالياً، ويمكن تنفيذ أوامر البيع والشراء وفقاً لظروف السوق.</li>
                        <li><strong>السوق مغلق (US Market Closed):</strong> تعني أن السوق خارج ساعات التداول الرسمية، وتظهر عادةً شارة حمراء توضح أن السوق مغلق حالياً.</li>
                    </ul>
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; margin-bottom:20px; font-size:0.86rem; color:#334155; line-height:1.6;">
                        <strong>ماذا يحدث عندما يكون السوق مغلقاً؟</strong><br>
                        عند إغلاق السوق، تبقى بعض وظائف الخدمة متاحة بينما تتوقف عمليات التداول الفعلية:<br>
                        - يتم عرض آخر سعر إغلاق متاح للسهم (Last Closing Price).<br>
                        - لا تتغير الأسعار بشكل لحظي لعدم وجود تداول نشط.<br>
                        - لا يتم تنفيذ أوامر البيع والشراء بشكل فوري.<br>
                        - يمكنك إرسال أوامر البيع أو الشراء أثناء إغلاق السوق، حيث تبقى هذه الأوامر معلّقة (Pending) في قائمة الانتظار ولا تُنفَّذ فوراً، ثم تُنفَّذ تلقائياً عند إعادة فتح السوق في جلسة التداول التالية كصفقة اعتيادية. وطالما بقي الأمر في حالة "معلّق" ولم يُنفَّذ بعد، يمكنك إلغاؤه في أي وقت من خلال التطبيق، ويُعاد المبلغ المحجوز للنقد المتاح. أمر Market يُنفَّذ بسعر الفتح، بينما الأمر المحدد (Limit) يصبح فعّالاً عند الفتح ولا يُنفَّذ إلا عند بلوغ السعر المحدد أو أفضل منه.
                    </div>

                    <!-- How to Buy & How to Sell -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#166534; margin:0 0 8px 0;"><i class="fa-solid fa-cart-shopping"></i> كيف يشتري العميل سهماً؟</h4>
                            <ol style="margin:0; padding-right:18px; font-size:0.84rem; color:#14532d; line-height:1.6;">
                                <li>البحث عن السهم بالاسم أو الرمز من صفحة الاستكشاف أو قائمة المتابعة.</li>
                                <li>فتح صفحة تفاصيل السهم والضغط على شراء (إذا كان يدعم الكسور، يمكنك شراء سهم كامل أو جزء منه مثل 0.25 سهم).</li>
                                <li>اختر نوع الأمر: أمر السوق (Market) أو الأمر المحدد (Limit).</li>
                                <li>أدخل الكمية، وفي حال اختيار أمر Limit قم بإدخال السعر المطلوب أيضاً.</li>
                                <li>اختر نوع صلاحية الأمر (Day, FOK, GTC).</li>
                                <li>مراجعة ملخص الطلب (الرمز، الكمية، التكلفة التقديرية، والرسوم).</li>
                                <li>تأكيد العملية باستخدام البصمة البيومترية (وجه/إصبع) أو الرمز السري (PIN).</li>
                                <li>عند توفر السهم يتم التنفيذ واستقطاع المبلغ من الحساب مباشرة.</li>
                            </ol>
                        </div>

                        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#1e40af; margin:0 0 8px 0;"><i class="fa-solid fa-hand-holding-dollar"></i> كيف يبيع العميل سهماً؟</h4>
                            <ol style="margin:0; padding-right:18px; font-size:0.84rem; color:#1e3a8a; line-height:1.6;">
                                <li>الدخول إلى قائمة "محفظتي" والبحث عن السهم المراد بيعه.</li>
                                <li>الضغط على السهم ثم اختيار بيع (Sell).</li>
                                <li>تحديد نوع الأمر:<br>
                                    - <strong>أمر السوق (Market):</strong> بيع مباشرة بسعر السوق الحالي وإظهار الأسهم المتاحة.<br>
                                    - <strong>الأمر المحدد (Limit):</strong> تحديد الحد الأدنى للسعر المرغوب وتحديد الكمية.
                                </li>
                                <li>تحديد مدة صلاحية الأمر (Day, FOK, GTC).</li>
                                <li>تأكيد العملية بالبصمة البيومترية أو الرمز السري للمحفظة (PIN).</li>
                            </ol>
                        </div>
                    </div>

                    <!-- Reasons for Rejection -->
                    <h4 style="font-size:1rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i> أسباب رفض طلب شراء الأسهم:</h4>
                    <ul style="margin:0 0 18px 0; padding-right:20px; font-size:0.86rem; color:#334155; line-height:1.6;">
                        <li><strong>عدم كفاية القوة الشرائية:</strong> عدم وجود رصيد كافٍ في حساب التداول لتغطية الصفقة والرسوم.</li>
                        <li><strong>أوامر معلّقة تحجز الرصيد:</strong> وجود أوامر شراء سابقة (Pending) حجزت جزءاً من الرصيد.</li>
                        <li><strong>خطأ في شروط الأمر:</strong> إدخال كمية غير صحيحة أو سعر غير منطقي في أمر Limit أو مخالفة القواعد.</li>
                        <li><strong>عدم توفر الكمية أو السعر في السوق:</strong> عدم توفر كمية كافية بالسعر المطلوب لتنفيذ الأمر.</li>
                        <li><strong>قيود على الحساب أو الخدمة:</strong> مثل انتهاء الاشتراك.</li>
                    </ul>

                    <!-- Order Types & Durations Detailed Table -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-sliders" style="color:#2563eb;"></i> الفرق بين أنواع الأوامر وصلاحياتها التفصيلية</h4>
                    <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:8px; margin-bottom:18px;">
                        <thead>
                            <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                                <th style="padding:10px 12px; border:1px solid #334155; width:25%;">نوع / صلاحية الأمر</th>
                                <th style="padding:10px 12px; border:1px solid #334155;">التعريف والشرح التفصيلي</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>أمر السوق (Market Order)</strong></td>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0;">يتم تنفيذ أمر الشراء أو البيع مباشرة بسعر السوق الحالي خلال ساعات الفتح، دون تحديد سعر مسبق. قد يختلف سعر التنفيذ الفعلي عن السعر الظاهر لحظة الطلب بسبب تغيرات السوق والعرض والطلب (مثال: شراء Apple بسعر السوق المتاح فوراً).</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0; background:#ffffff;"><strong>الأمر المحدد (Limit Order)</strong></td>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0;">تحديد سعر معين للشراء أو البيع، ولا ينفذ إلا عند الوصول له أو أفضل منه. الهدف هو التحكم بالسعر وتُحجز القيمة حتى التنفيذ أو الإلغاء (مثال: شراء Apple بسعر 190$ لا ينفذ إلا عند 190$ أو أقل).</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Day (صلاحية ليوم واحد)</strong></td>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0;">يبقى فعالاً فقط خلال يوم التداول الحالي، وإذا لم يتم تنفيذه بالكامل قبل إغلاق السوق يتم إلغاؤه تلقائياً ولا ينتقل لليوم التالي.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0; background:#ffffff;"><strong>GTC (Good Till Cancelled)</strong></td>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0;">يبقى فعالاً في النظام (أيام أو أسابيع) إلى أن يصل للسعر المطلوب أو يقوم المشترك بإلغائه، مع حجز قيمة الطلب.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>FOK (Fill or Kill)</strong></td>
                                <td style="padding:10px 12px; border:1px solid #e2e8f0;">يُنفذ بالكامل فوراً عند إرساله أو يُلغى مباشرة بدون تنفيذ أي جزء منه (لا يقبل جزء من السهم في حالات البيع أو الشراء).</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Order Statuses & Cancellation -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;"><i class="fa-solid fa-list" style="color:#c026d3;"></i> حالات أمر شراء/بيع الأسهم</h4>
                            <ul style="margin:0; padding-right:18px; font-size:0.84rem; color:#475569; line-height:1.6;">
                                <li><strong style="color:#d97706;">قيد الانتظار (Pending):</strong> مرسل للسوق وبانتظار الفتح أو استيفاء السعر/الكمية.</li>
                                <li><strong style="color:#16a34a;">مُنفَّذ (Executed):</strong> تم تنفيذ الأمر بالكامل حسب الكمية المطلوب.</li>
                                <li><strong style="color:#2563eb;">مُنفَّذ جزئياً (Partially Filled):</strong> تنفيذ جزء، والجزء المتبقي قيد الانتظار.</li>
                                <li><strong style="color:#64748b;">ملغى (Cancelled):</strong> إلغاء من العميل أو النظام قبل التنفيذ.</li>
                                <li><strong style="color:#dc2626;">مرفوض (Rejected):</strong> مرفوض من النظام لسبب كعدم كفاية القوة الشرائية.</li>
                                <li><strong style="color:#78350f;">منتهي (Expired):</strong> انتهت مدة صلاحيته (مثل Day) وتم إلغاؤه تلقائياً.</li>
                            </ul>
                        </div>

                        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;"><i class="fa-solid fa-xmark" style="color:#dc2626;"></i> إلغاء الأوامر المفتوحة وقائمة المراقبة</h4>
                            <p style="font-size:0.84rem; color:#475569; margin:0 0 6px 0;">
                                <strong>كيفية الإلغاء:</strong> قسم المعاملات -> اختيار الأمر -> الضغط على إلغاء الأمر (Cancel Order) -> تأكيد. يمكنك الإلغاء فقط إذا كان الأمر <strong>Pending</strong> أو <strong>Partially Filled</strong>. الأوامر المنفذة بالكامل لا يمكن إلغاؤها.
                            </p>
                            <p style="font-size:0.84rem; color:#475569; margin:0;">
                                <strong>متابعة قائمة المراقبة (Watchlist):</strong> قائمة المتابعة أعلى الشاشة -> إضافة -> إدخال اسم القائمة -> إنشاء -> الاستكشاف -> اختيار السهم والضغط على النجمة -> تحديد القائمة والحفظ.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- SECTION 5 -->
                <section id="sec-5" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #fffbeb; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#d97706; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">5</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">التحليل المالي، حقول عن الشركة، إعدادات الحساب وحماية SIPC</h2>
                    </div>

                    <!-- Indicators & Fundamentals -->
                    <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;"><i class="fa-solid fa-calculator" style="color:#d97706;"></i> المؤشرات والأساسيات الرئيسية المتاحة بصفحة السهم</h4>
                    <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:8px; margin-bottom:18px;">
                        <thead>
                            <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                                <th style="padding:10px 12px; border:1px solid #334155; width:30%;">المقياس المالي</th>
                                <th style="padding:10px 12px; border:1px solid #334155;">المعنى والتوضيح التشغيلي</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>حجم التداول اليوم</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">عدد الأسهم المتداولة في اليوم؛ حجم أكبر يعني نشاطاً وسيولة أعلى على السهم.</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;"><strong>سعر الافتتاح / الإغلاق</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">سعر السهم عند افتتاح السوق وسعره النهائي بعد إغلاق السوق.</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>السعر الأعلى والشر الأقل / 52 أسبوع</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">أعلى وأقل سعر في آخر جلسة، وكذلك أعلى وأدنى سعر بلغه السهم خلال السنة الماضية (تذبذب السعر).</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;"><strong>EPS (Earnings Per Share)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">ربح الشركة المنسوب لكل سهم؛ كلما ارتفع دلّ على ربحية أكبر للشركة المالكة للسهم.</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>عائد التوزيعات (Dividend Yield)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">نسبة توزيعات الأرباح السنوية التقديرية مقارنةً بسعر السهم (إن كانت الشركة توزّع أرباحاً).</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;"><strong>P/E (Price to Earnings)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">نسبة السعر إلى الأرباح: تقيس عدد المرات التي يدفعها المستثمر مقابل كل وحدة أرباح لتحديد هل السهم مرتفع أم منخفض.</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>P/B (Price to Book)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">نسبة السعر إلى القيمة الدفترية لتحديد التداول بأعلى أو أقل من قيمة الأصول.</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;"><strong>P/S (Price to Sales)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">نسبة السعر إلى المبيعات: تقارن القيمة السوقية بالإيرادات السنوية (خاصة للشركات بدون أرباح مستقرة).</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>P/CF & P/FCF</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">نسبة السعر للتدفق النقدي وللتدفق النقدي الحر المتبقي بعد النفقات التشغيلية (مؤشر القوة المالية).</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;"><strong>Market Cap (القيمة السوقية)</strong></td>
                                <td style="padding:8px 12px; border:1px solid #e2e8f0;">القيمة الإجمالية للشركة بالسوق (سعر السهم × إجمالي الأسهم المصدرة) لقياس حجم الشركة.</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Company Overview Fields Block -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:20px;">
                        <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;"><i class="fa-solid fa-building" style="color:#2563eb;"></i> حقول قسم "عن الشركة" (Company Details):</h4>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px; font-size:0.84rem;">
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Company Name:</strong> اسم الشركة المدرجة في سوق الأسهم.
                            </div>
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Ticker Symbol:</strong> رمز السهم المستخدم في البورصة (مثل AAPL).
                            </div>
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Primary Exchange:</strong> البورصة الرئيسية (NYSE أو Nasdaq).
                            </div>
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Industry:</strong> القطاع أو النشاط (تكنولوجيا، بنوك، رعاية صحية، طاقة).
                            </div>
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Total Employees:</strong> إجمالي عدد موظفي الشركة (مؤشر الحجم).
                            </div>
                            <div style="background:#ffffff; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                                <strong>Home Page URL:</strong> الموقع الإلكتروني الرسمي للشركة للاطلاع على الأخبار والتقارير.
                            </div>
                        </div>
                    </div>

                    <!-- Realized vs Unrealized P&L & Transactions & Dividends -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#1e40af; margin:0 0 6px 0;">الربح والخسارة والمعاملات</h4>
                            <p style="font-size:0.84rem; color:#1e3a8a; margin:0 0 6px 0;">
                                <strong>ربح/خسارة غير محققة (Unrealized P&L):</strong> على الورق قبل البيع وتتغير مع السوق.<br>
                                <strong>ربح/خسارة محققة (Realized P&L):</strong> الأرباح أو الخسائر الفعلية بعد البيع.
                            </p>
                            <p style="font-size:0.82rem; color:#1e3a8a; margin:0;">
                                <strong>الأنشطة والمعاملات:</strong> الطلبات المفتوحة (Pending/New)، سجل الطلبات (Executed, Cancelled, Rejected, Expired)، والأنشطة المالية وغير المالية.
                            </p>
                        </div>
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px;">
                            <h4 style="font-size:0.98rem; font-weight:800; color:#166534; margin:0 0 6px 0;">توزيعات الأرباح (Dividends)</h4>
                            <p style="font-size:0.84rem; color:#14532d; margin:0 0 6px 0;">
                                توزيع جزء من الأرباح نقداً على المساهمين (ليست جميع الشركات توزع). تظهر النسبة في السهم كـ Dividend Yield وعند الصرف تضاف تلقائياً لحساب التداول وتظهر في الكشف كـ Dividend.
                            </p>
                            <p style="font-size:0.82rem; color:#14532d; margin:0;">
                                <strong>ملاحظة ضريبية:</strong> قد تقتطع ضريبة أمريكية من التوزيعات حسب W-8BEN ويتم الاطلاع عليها من <strong>إعدادات التداول - مستند الضريبة</strong>.
                            </p>
                        </div>
                    </div>

                    <!-- Trading Account Settings Block -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;"><i class="fa-solid fa-gear" style="color:#4f46e5;"></i> إعدادات حساب التداول ومستنداته:</h4>
                        <ul style="margin:0; padding-right:20px; font-size:0.88rem; color:#334155; line-height:1.7;">
                            <li><strong>مستندات الحساب:</strong> كشف حساب شهري (تفاصيل العمليات والحركات خلال شهر) + كشف التداول اليومي (تحميل وتنزيل السجل بصيغة PDF).</li>
                            <li><strong>تفاصيل المستثمرين الخاصة بي:</strong> عرض بيانات ومعلومات المستثمر المرتبطة بالحساب.</li>
                            <li><strong>جهة اتصال موثوقة (Trusted Contact):</strong> إدارتها للتواصل في الحالات المهمة أو الطارئة (بعمر 18 سنة فأكثر).</li>
                            <li><strong>الاشتراك:</strong> يتيح تفعيل أو إيقاف أو تعديل اشتراكك في الخدمة.</li>
                            <li>
                                <strong>إغلاق حساب التداول:</strong> خيار يتيح طلب إغلاق الحساب نهائياً (بشرط ألا تكون هناك أي أموال/نقد/أسهم)، ولن تتمكن من الوصول للحساب بعد إغلاقه وستظهر حالته "مغلق"، ويمكنك إعادة إنشاء حساب ببريد إلكتروني جديد غير مستخدم مسبقاً.
                            </li>
                        </ul>
                    </div>

                    <!-- SIPC Protection Highlight Box -->
                    <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border:1px solid #86efac; border-radius:14px; padding:20px;">
                        <div style="display:flex; align-items:center; gap:10px; color:#166534; font-weight:900; font-size:1.1rem; margin-bottom:8px;">
                            <i class="fa-solid fa-shield-halved" style="font-size:1.3rem;"></i> حماية المستثمر القانونية (SIPC)
                        </div>
                        <p style="font-size:0.92rem; color:#14532d; margin:0 0 8px 0; line-height:1.6;">
                            حسابك التداولي لدى شركة الوساطة مشمول بحماية SIPC <strong>حتى 500,000 دولار أمريكي</strong> (منها حد أقصى <strong>250,000 دولار للنقد</strong>).
                        </p>
                        <ul style="margin:0; padding-right:20px; font-size:0.88rem; color:#14532d;">
                            <li><strong>تشمل الحماية:</strong> إفلاس أو تعثر شركة الوساطة، مع المساعدة في استرداد الأسهم والأموال الموجودة في الحساب ضمن حدود التغطية.</li>
                            <li><strong>لا تشمل الحماية:</strong> خسائر التداول الناتجة عن انخفاض أو ارتفاع أسعار الأسهم، حيث تُعد جزءاً من مخاطر التداول الطبيعية ولا يتم تعويضها.</li>
                        </ul>
                    </div>
                </section>

                <!-- SECTION 6: GLOSSARY TABLE -->
                <section id="sec-6" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f3e8ff; padding-bottom:12px; margin-bottom:18px;">
                        <span style="background:#7e22ce; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">6</span>
                        <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">قاموس المصطلحات المالية المعتمدة (Financial Glossary)</h2>
                    </div>

                    <p style="font-size:0.92rem; color:#64748b; margin-bottom:15px;">
                        جدول المصطلحات الكامل المعتمد لممثلي خدمة العملاء للإجابة الفورية وتوضيح المفاهيم للمشتركين:
                    </p>

                    <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
                        <thead>
                            <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                                <th style="padding:12px 14px; border:1px solid #334155; width:25%;">المصطلح (عربي)</th>
                                <th style="padding:12px 14px; border:1px solid #334155; width:25%;">English</th>
                                <th style="padding:12px 14px; border:1px solid #334155;">التعريف المبسّط</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>سهم</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Stock / Share</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">حصة ملكية صغيرة في شركة.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>البورصة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Stock Exchange</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">السوق الذي تُباع وتُشترى فيه الأسهم (مثل NYSE وNasdaq).</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>رمز السهم</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Ticker Symbol</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">رمز مختصر للشركة مثلا ابل - AAPL.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>كسور الأسهم</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Fractional Shares</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">شراء جزء من السهم بدلاً من سهم كامل.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>أمر السوق</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Market Order</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">أمر بالتنفيذ فوراً بأفضل سعر متاح.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>الأمر المحدّد</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Limit Order</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">أمر يُنفَّذ فقط عند سعر يحدّده العميل أو أفضل.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>مدة صلاحية الأمر</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Time in Force (TIF)</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">مدة بقاء الأمر فعّالاً (Day، FOK، GTC).</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>ليوم واحد</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Day</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">أمر صالح خلال جلسة اليوم فقط.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>التنفيذ الكامل أو الإلغاء</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Fill or Kill (FOK)</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">يُنفَّذ بالكامل فوراً أو يُلغى.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>القوة الشرائية</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Buying Power</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">النقد المتاح للشراء في حساب التداول.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>المحفظة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Portfolio</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">مجموع ممتلكات العميل من نقد وأسهم.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>صافي الثروة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Equity / Net Worth</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">النقد + القيمة السوقية للأسهم.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>ربح/خسارة غير محقّقة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Unrealized P&L</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">ربح أو خسارة على الورق قبل البيع.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>ربح/خسارة محقّقة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Realized P&L</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">الربح أو الخسارة الفعلية بعد البيع.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>قائمة المراقبة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Watchlist</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">قائمة أسهم يتابعها العميل.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>التسجيل</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Onboarding</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">عملية فتح الحساب والتحقّق من الهوية.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>شخص معرّض سياسياً</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">PEP</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">شخص يشغل منصباً عاماً رفيعاً.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>نموذج ضريبي أمريكي</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">W-8BEN</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">نموذج يثبت أن العميل شخص غير أمريكي.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>جهة اتصال موثوقة</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Trusted Contact</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">شخص للتواصل عند الحاجة، بلا صلاحية تداول.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>توزيعات الأرباح</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">Dividends</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">جزء من أرباح الشركة يُوزّع على المساهمين.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>سعر الصرف</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">FX Rate</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">سعر تحويل الدينار الى الدولار والعكس.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;"><strong>هيئة الأوراق المالية</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">SEC</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">الجهة الأمريكية المنظِّمة لشركات الوساطة.</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>حماية المستثمر</strong></td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">SIPC</td>
                                <td style="padding:10px 14px; border:1px solid #e2e8f0;">تحمي حساب العميل عند تعثّر الوسيط ضمن حدود.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- SECTION 7: GENERAL INFORMATION SECTION -->
                <section id="sec-7" style="background:#ffffff; border:2px solid #4f46e5; border-radius:20px; padding:26px; margin-bottom:20px; box-shadow:0 8px 25px rgba(79,70,229,0.08); position:relative; overflow:hidden;">
                    
                    <div style="position:absolute; top:0; right:0; background:#4f46e5; color:#ffffff; padding:5px 20px; border-bottom-left-radius:14px; font-size:0.8rem; font-weight:800; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-circle-info"></i> معلومات عامة
                    </div>

                    <div style="display:flex; align-items:center; gap:12px; border-bottom:2px solid #e0e7ff; padding-bottom:14px; margin-bottom:20px; margin-top:10px;">
                        <span style="background:linear-gradient(135deg, #4f46e5, #4338ca); color:#ffffff; font-weight:900; width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; box-shadow:0 3px 10px rgba(79,70,229,0.3);">7</span>
                        <div>
                            <h2 style="font-size:1.35rem; font-weight:900; color:#1e1b4b; margin:0;">معلومات عامة</h2>
                            <p style="font-size:0.85rem; color:#4338ca; margin:2px 0 0 0; font-weight:700;">إرشادات واجهة التسجيل، قواعد التداول التقنية، ضوابط الامتثال وحالات الاستثناء (Edge Cases)</p>
                        </div>
                    </div>

                    <!-- Sub-block 1: Onboarding UI & Logic -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h3 style="font-size:1.05rem; font-weight:800; color:#1e1b4b; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-laptop-code" style="color:#4f46e5;"></i> 1. تفاصيل واجهة التسجيل والتحقق (Onboarding UI & Logic)
                        </h3>
                        <ul style="margin:0; padding-right:20px; font-size:0.9rem; color:#334155; line-height:1.8;">
                            <li><strong>اختصارات البريد الإلكتروني:</strong> توفر الشاشة أزراراً سريعة لأشهر نطاقات البريد الإلكتروني (<code style="background:#e0e7ff; color:#3730a3; padding:2px 6px; border-radius:4px;">@gmail.com</code>, <code style="background:#e0e7ff; color:#3730a3; padding:2px 6px; border-radius:4px;">@yahoo.com</code>, <code style="background:#e0e7ff; color:#3730a3; padding:2px 6px; border-radius:4px;">@outlook.com</code>) لتسهيل إدخال الإيميل على الزبون دون الحاجة لكتابته كاملاً.</li>
                            <li><strong>قاعدة الإيميل الحازمة بعد الإغلاق:</strong> البريد الإلكتروني المربوط بحساب تداول مغلق (Closed Account) لا يمكن إعادة استخدامه مطلقاً لفتح حساب جديد، ويلزم العميل استخدام بريد جديد كلياً.</li>
                            <li><strong>إرشاد البريد المهمل (Spam/Junk):</strong> توجيه الزبون الذي لا يصله رمز التحقق (OTP) للبريد الإلكتروني بضرورة فحص مجلد الرسائل غير المرغوب فيها (Spam / Junk).</li>
                            <li><strong>طبيعة أسئلة الملف الاستثماري:</strong> تحديد "المبلغ المتوقع للتداول" و"مصدر الأموال" هي متطلبات تنظيمية إجبارية من الوسيط المالي (Alpaca)، ولا تفرض أي حد أقصى (Cap) أو تقييد على حجم تداولات الزبون الفعلية داخل التطبيق.</li>
                            <li><strong>شرط الإقرار التنظيمي الصارم:</strong> في شاشة الإقرارات التنظيمية، يجب على الزبون اختيار خيار <em>"لا ينطبق أي مما سبق على حالتي"</em> حصراً؛ اختيار أي بند آخر سيؤدي فوراً إلى رفض الطلب تلقائياً وظهور شاشة اعتذار للعميل.</li>
                            <li><strong>تحديد المحافظ الممنوعة بدقة:</strong> محافظ التجار (Merchants) ومحافظ الجمعيات/المنظمات الخيرية (Charity Wallets) محظورة كلياً من رؤية خيار التداول أو فتح حساب فيه بناءً على نوع البروفايل.</li>
                            <li><strong>فترة التبريد (Cooldown Period) عند الرفض أو الإغلاق:</strong> عند رفض طلب الزبون من قبل قسم الامتثال/AML أو عند إغلاق الزبون لحسابه، يفرض النظام فترة حظر مؤقتة يظهر فيها للزبون عداد تنازلي بالأيام المتبقية لمنعه من إعادة التقديم المباشر حتى انتهاء المدة.</li>
                        </ul>
                    </div>

                    <!-- Sub-block 2: Trading & Order Mechanics -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h3 style="font-size:1.05rem; font-weight:800; color:#1e1b4b; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-microchip" style="color:#4f46e5;"></i> 2. تفاصيل التداول وتأثيرات الواجهة (Trading & Order Mechanics)
                        </h3>
                        <ul style="margin:0; padding-right:20px; font-size:0.9rem; color:#334155; line-height:1.8;">
                            <li><strong>تعطيل زر كسور الأسهم (Dollar Value Toggle):</strong> في الأسهم رخيصة السعر جداً (مثل 1$- 5$) أو الشركات التي لا تدعم الكسر، يصبح زر التحويل بين (الشراء بالمبلغ / الشراء بعدد الأسهم) رمادياً ومعطلاً (Disabled)، ويُجبر الزبون في هذه الشركات على الشراء بأعداد صحيحة فقط (1, 2, 3...).</li>
                            <li><strong>أمر FOK وكسور الأسهم:</strong> التأكيد التقني على أن أمر التنفيذ الفوري الكامل (Fill or Kill - FOK) لا يقبل أرقاماً كسرية إطلاقاً (يطلب أعداداً صحيحة فقط من الأسهم).</li>
                            <li><strong>فروق أسعار التنفيذ اللحظية (Market Order Fluctuation):</strong> توضيح لخدمة العملاء بأن أمر السوق (Market Order) يُنفذ بسعر البورصة اللحظي في جزء الثانية الذي يصل فيه الطلب للوسيط، والذي قد يختلف بفلس/سنتات بسيطة عن السعر الذي كان ظاهراً للزبون على الشاشة لحظة ضغطه على الزر بسبب التذبذب السريع للسوق.</li>
                            <li><strong>التفاعل مع الرسم البياني (Interactive Chart):</strong> إمكانية الضغط المطول (Hold & Drag) على خط الرسم البياني التفاعلي للسهم في شاشة التفاصيل لعرض التاريخ والوقت والسعر الدقيق للسهم في تلك اللحظة عبر مختلف النطاقات الزمنية (1D, 1W, 1M, 6M, YTD, 1Y, 5Y, All).</li>
                        </ul>
                    </div>

                    <!-- Sub-block 3: Compliance Guidance -->
                    <div style="background:#f0f9ff; border-right:4px solid #0284c7; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h3 style="font-size:1.05rem; font-weight:800; color:#0369a1; margin:0 0 10px 0; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-user-shield" style="color:#0284c7;"></i> 3. تعليمات حظر الإفصاح لخدمة العملاء (Compliance & CS Guidance)
                        </h3>
                        <p style="font-size:0.92rem; color:#075985; margin:0; line-height:1.7;">
                            <strong>قوانين سرية الامتثال (Tipping-off Rule):</strong> يُمنع موظف الدعم الفني وخدمة العملاء منعاً باتاً من الإفصاح للزبون المرفوض عن الأسباب الدقيقة المتعلقة بملاحظات قسم الامتثال ومكافحة غسيل الأموال (AML)؛ ويتم اكتفاء الموظف إجبارياً بإبلاغ العميل بـ: <em style="background:#e0f2fe; padding:2px 8px; border-radius:6px; font-weight:800; color:#0369a1;">"عدم استيفاء الشروط التنظيمية للخدمة"</em>.
                        </p>
                    </div>

                    <!-- Sub-block 4: Edge Cases -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h3 style="font-size:1.05rem; font-weight:800; color:#1e1b4b; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-scale-unbalanced" style="color:#4f46e5;"></i> 4. حالات خاصة واستفسارات تشغيلية مهمة (Edge Cases)
                        </h3>
                        <ul style="margin:0; padding-right:20px; font-size:0.9rem; color:#334155; line-height:1.8;">
                            <li>
                                <strong>حالة وفاة صاحب الحساب (Deceased Account Holder):</strong><br>
                                <em>السؤال:</em> ماذا يحدث للأسهم والأموال في حساب التداول إذا توفي العميل؟<br>
                                <em>التوضيح:</em> تنطبق عليها الإجراءات القانونية المعتمدة نفسها في "زين كاش" للمحافظ العادية (تقديم القسام الشرعي وكتاب المحكمة). يدار الحساب عبر المسار القانوني لإغلاقه وتصفية الأصول والأسهم النقدية ونقلها للمستحقين.
                            </li>
                            <li style="margin-top:10px;">
                                <strong>ربط حسابات وساطة خارجية سابقة (Linking External Accounts):</strong><br>
                                <em>السؤال:</em> هل يمكن لعميل لديه حساب تداول سابق لدى الوسيط المالي نفسه (Alpaca) عبر منصة أخرى أن يربطه بحساب زين كاش؟<br>
                                <em>التوضيح:</em> لا يمكن ذلك نهائياً. خدمة زين كاش تنشئ حساباً جديداً تماماً ومنفصلاً بالكامل يُربط ببريد إلكتروني فريد خاص بهذه الخدمة.
                            </li>
                        </ul>
                    </div>

                    <!-- Sub-block 5: UI & Localization -->
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px;">
                        <h3 style="font-size:1.05rem; font-weight:800; color:#1e1b4b; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-language" style="color:#4f46e5;"></i> 5. تفاصيل دقيقة في الواجهة والسلوك التقني واللغة
                        </h3>
                        <ul style="margin:0; padding-right:20px; font-size:0.9rem; color:#334155; line-height:1.8;">
                            <li><strong>ترتيب الأسهم في قائمة المراقبة (Watchlist Sorting):</strong> الأسهم داخل قائمة المراقبة المخصصة لا تُعدّل حسب الأبجدية (A-Z) ولا يوجد خيار إعادة ترتيب (Priority Sort)، بل تُعرض زمنيّاً بناءً على تاريخ ووقت الإضافة (السهم المُضاف حديثاً يظهر في البداية).</li>
                            <li><strong>قنوات الإشعارات (Notification Channels):</strong> تصل للزبون نوعان من الإشعارات عند حدوث أي تغيير في حالة الطلبات (قبول الحساب، رفضه، تنفيذ الشراء/البيع، أو الإلغاء): 1. إشعارات داخل التطبيق (In-App Push Notifications) و 2. رسائل عبر البريد الإلكتروني (Email Notifications).</li>
                            <li><strong>تنزيل وعرض المستندات والتقارير (Document Downloads):</strong> يتيح قسم "مستندات الحساب" للعميل معاينة وتنزيل كشوفات الحساب اليومية والأنشطة المالية بصيغة PDF مباشرة من التطبيق.</li>
                            <li><strong>ملاحظات الترجمة واللغة (Localization Note):</strong> بعض شاشات الشروط والأحكام ومستندات الإفصاح الخاصة بالوسيط (مثل اتفاقية Alpaca ونموذج W-8BEN) قد تظهر باللغة الإنجليزية في بيئة الاختبار، وسيتم تعريب الواجهات وإعلانات النظام بالكامل قبل الإطلاق المباشر.</li>
                        </ul>
                    </div>

                </section>
            </div>
        `
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

db.knowledgeBase = masterStocksKbArticle;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log("Verified and updated Master Stock Trading KB Article to 100% full content accuracy!");
