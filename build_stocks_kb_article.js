const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const kbDataPath = path.join(__dirname, 'kb-data.js');

// 1. Comprehensive Master Guide HTML (Formatted with modern cards, badges, tables, and alerts)
const masterContentHtml = `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    
    <!-- Hero Header Banner -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:28px; border-radius:20px; margin-bottom:25px; box-shadow: 0 10px 25px rgba(15,23,42,0.15); border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
            <span style="background:rgba(255,153,0,0.2); color:#ff9900; border:1px solid rgba(255,153,0,0.4); padding:4px 14px; border-radius:20px; font-size:0.8rem; font-weight:800;">
                <i class="fa-solid fa-shield-halved"></i> الدليل الرسمي الشامل المعتمد 100%
            </span>
            <div style="display:flex; gap:8px;">
                <span style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">مرخصة من SEC</span>
                <span style="background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">حماية SIPC حتى $500k</span>
            </div>
        </div>
        <h1 style="font-size:1.65rem; font-weight:900; margin:0 0 10px 0; color:#f8fafc; line-height:1.4;">
            📈 دليل خدمة تداول الأسهم الأمريكية الشامل (Zain Cash US Stocks Guide)
        </h1>
        <p style="font-size:0.92rem; color:#cbd5e1; margin:0; line-height:1.6;">
            دليل تشغيلي ومعرفي متكامل يتضمن جميع المفاهيم، شروط التسجيل، خطوات الإيداع والسحب، تفاصيل قسم محفظتك، ضوابط الأوامر، التحليل المالي والمؤشرات، إعدادات الحساب، حماية المستثمر، وقاموس المصطلحات المعرب بالكامل.
        </p>

        <!-- Quick Navigation Index Bar -->
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.1); display:flex; flex-wrap:wrap; gap:8px;">
            <a href="#sec-1" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-compass" style="color:#ff9900;"></i> 1. المفاهيم والبورصة وكسور الأسهم</a>
            <a href="#sec-2" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-user-check" style="color:#38bdf8;"></i> 2. إنشاء الحساب، المتطلبات والاشتراكات</a>
            <a href="#sec-3" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-wallet" style="color:#4ade80;"></i> 3. الإيداع والسحب وسعر الصرف ومحفظتك</a>
            <a href="#sec-4" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-right-left" style="color:#f472b6;"></i> 4. شراء وبيع الأسهم وأنواع الأوامر</a>
            <a href="#sec-5" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-chart-pie" style="color:#fbbf24;"></i> 5. المؤشرات والأساسيات المالية والأرباح</a>
            <a href="#sec-6" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-gears" style="color:#a78bfa;"></i> 6. إعدادات الحساب وحماية المستثمر (SIPC)</a>
            <a href="#sec-7" style="background:rgba(255,255,255,0.1); color:#ffffff; text-decoration:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; transition:all 0.2s;"><i class="fa-solid fa-book-bookmark" style="color:#38bdf8;"></i> 7. قاموس المصطلحات الشامل</a>
            <a href="#sec-8" style="background:linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color:#ffffff; text-decoration:none; padding:6px 14px; border-radius:8px; font-size:0.78rem; font-weight:800; transition:all 0.2s; box-shadow:0 2px 8px rgba(79,70,229,0.3);"><i class="fa-solid fa-circle-info"></i> 8. معلومات عامة وحالات خاصة</a>
        </div>
    </div>

    <!-- ========================================================================= -->
    <!-- SECTION 1: INTRODUCTION & CORE CONCEPTS -->
    <!-- ========================================================================= -->
    <section id="sec-1" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #eff6ff; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#2563eb; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">1</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">خدمة التداول والمفاهيم الأساسية</h2>
        </div>

        <p style="font-size:0.95rem; color:#334155; line-height:1.8;">
            تتيح خدمة التداول لمشتركي زين كاش فتح حساب تداول وشراء وبيع الأسهم الأمريكية المدرجة في الأسواق المالية الأمريكية من خلال تطبيق زين كاش، وذلك بعد استيفاء متطلبات التسجيل والموافقة على الطلب.
        </p>
        <p style="font-size:0.95rem; color:#334155; line-height:1.8;">
            تتم هذه الخدمة عبر شركة وساطة أمريكية مرخّصة (<strong>Alpaca Securities LLC</strong>) وخاضعة لرقابة هيئة الأوراق المالية والبورصات الأمريكية (<strong>SEC</strong>)، وعضو في الهيئة التنظيمية للقطاع المالي (<strong>FINRA</strong>)، ومؤسسة حماية مستثمري الأوراق المالية (<strong>SIPC</strong>). كما تمكّن الخدمة العملاء من متابعة تداولاتهم، والاطلاع على أسعار الأسهم، وإدارة عمليات الإيداع والسحب بين محفظة زين كاش وحساب التداول بسهولة وأمان.
        </p>

        <!-- What is a stock -->
        <div style="background:#eff6ff; border-right:4px solid #2563eb; border-radius:12px; padding:18px; margin:20px 0;">
            <div style="display:flex; align-items:center; gap:8px; color:#1e40af; font-weight:800; font-size:1.05rem; margin-bottom:8px;">
                <i class="fa-solid fa-lightbulb" style="font-size:1.2rem;"></i> ما هو السهم (Stock / Share)؟
            </div>
            <p style="font-size:0.92rem; color:#1e3a8a; margin:0 0 10px 0; line-height:1.7;">
                السهم هو جزء من ملكية شركة. فعندما تشتري سهماً في شركة مدرجة في البورصة، فإنك تمتلك جزءاً صغيراً من تلك الشركة. ويتم شراء الأسهم عادةً لأحد سببين:
            </p>
            <ul style="margin:0 0 10px 0; padding-right:24px; color:#1e3a8a; font-size:0.92rem; line-height:1.7;">
                <li><strong>الاستفادة من ارتفاع قيمة السهم:</strong> مع مرور الوقت إذا حققت الشركة نمواً وأداءً جيداً.</li>
                <li><strong>الحصول على توزيعات الأرباح (Dividends):</strong> التي تقوم بعض الشركات بتوزيعها على المساهمين.</li>
            </ul>
            <p style="font-size:0.9rem; color:#1e3a8a; margin:0;">
                💡 <em>تمنح ملكية الأسهم العادية حاملها حقاً في التصويت على بعض قرارات الشركة المهمة في اجتماعات الجمعية العامة، بما يتناسب مع عدد الأسهم التي يمتلكها.</em>
            </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin:20px 0;">
            <!-- Stock Exchange -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-building-columns" style="color:#2563eb;"></i> ما هي البورصة (سوق الأسهم)؟
                </h4>
                <p style="font-size:0.88rem; color:#475569; margin:0 0 8px 0; line-height:1.6;">
                    البورصة هي السوق التي يتم من خلالها شراء وبيع الأسهم بين المستثمرين، وتضم الولايات المتحدة عدداً من البورصات، أبرزها:
                </p>
                <ul style="margin:0 0 10px 0; padding-right:20px; font-size:0.88rem; color:#1e293b;">
                    <li><strong>بورصة نيويورك (NYSE)</strong></li>
                    <li><strong>بورصة ناسداك (Nasdaq)</strong></li>
                </ul>
                <p style="font-size:0.85rem; color:#64748b; margin:0; line-height:1.6;">
                    تتغير أسعار الأسهم بشكل مستمر خلال ساعات التداول بناءً على العرض والطلب. فعندما يزداد الإقبال على شراء سهم معين قد يرتفع سعره، وعندما يزداد الإقبال على بيعه قد ينخفض سعره.
                </p>
            </div>

            <!-- Ticker Symbol -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-tag" style="color:#059669;"></i> رمز السهم (Ticker Symbol)
                </h4>
                <p style="font-size:0.88rem; color:#475569; margin:0 0 8px 0; line-height:1.6;">
                    لكل شركة مدرجة رمز تداول خاص بها يُستخدم للتعرف عليها في السوق، أمثلة:
                </p>
                <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:0.84rem; margin-bottom:10px;">
                    <span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:6px; font-weight:700;">Apple = AAPL</span>
                    <span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:6px; font-weight:700;">Microsoft = MSFT</span>
                    <span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:6px; font-weight:700;">Tesla = TSLA</span>
                    <span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:6px; font-weight:700;">Amazon = AMZN</span>
                </div>
                <p style="font-size:0.85rem; color:#059669; font-weight:700; margin:0;">
                    🔍 يمكنك البحث عن الشركة داخل التطبيق باستخدام اسم الشركة أو رمز السهم.
                </p>
            </div>
        </div>

        <!-- Fractional Shares -->
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:14px; padding:18px; margin:20px 0;">
            <h4 style="font-size:1.05rem; font-weight:800; color:#92400e; margin:0 0 8px 0;">
                <i class="fa-solid fa-pie-chart" style="color:#d97706;"></i> كسور الأسهم (Fractional Shares)
            </h4>
            <p style="font-size:0.92rem; color:#78350f; margin:0 0 10px 0; line-height:1.7;">
                تتيح بعض الشركات ميزة شراء جزء من السهم بدلاً من شراء سهم كامل.<br>
                <strong>مثال:</strong> إذا كان سعر سهم معين 200 دولار وأراد العميل تداول 50 دولاراً فقط، فيمكنه شراء <strong>0.25 سهم</strong>. تساعد هذه الميزة العملاء على البدء بالتداول بمبالغ أقل.
            </p>
            <div style="background:#fef3c7; border-right:4px solid #d97706; padding:12px 14px; border-radius:8px; font-size:0.88rem; color:#78350f; line-height:1.6;">
                <strong>⚠️ ملاحظة مهمة:</strong> لا تتيح جميع الأسهم إمكانية شراء كسور الأسهم. في حال كان السهم لا يدعم هذه الميزة، فلن تتمكن من شراء جزء من السهم، كما لن يكون خيار الشراء بالمبلغ متاحاً لهذا السهم. في هذه الحالة، يجب عليك إدخال عدد أسهم كامل لإتمام عملية الشراء.
            </div>
        </div>

        <!-- Roles Table -->
        <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-top:20px;">
            <i class="fa-solid fa-handshake" style="color:#2563eb;"></i> من يحتفظ بالأموال والأسهم؟ (توزيع الأدوار)
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:12px 16px; border:1px solid #334155; width:35%;">الطرف</th>
                    <th style="padding:12px 16px; border:1px solid #334155;">الدور والمسؤولية</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:12px 16px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>زين كاش (Zain Cash)</strong></td>
                    <td style="padding:12px 16px; border:1px solid #e2e8f0;">توفير التطبيق، دعم العملاء، وإدارة عمليات التحويل بين المحفظة وحساب التداول.</td>
                </tr>
                <tr>
                    <td style="padding:12px 16px; border:1px solid #e2e8f0; background:#ffffff;">
                        <strong>شركة Alpaca</strong><br>
                        <span style="font-size:0.8rem; color:#64748b;">شركة وساطة أمريكية مرخّصة وخاضعة لرقابة هيئة الأوراق المالية والبورصات الأمريكية (SEC)، وعضو في الهيئة التنظيمية للقطاع المالي (FINRA)، ومؤسسة حماية مستثمري الأوراق المالية (SIPC).</span>
                    </td>
                    <td style="padding:12px 16px; border:1px solid #e2e8f0;">فتح حساب التداول، تنفيذ أوامر التداول، والاحتفاظ بالأموال والأسهم.</td>
                </tr>
            </tbody>
        </table>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 2: ACCOUNT CREATION, ELIGIBILITY & SUBSCRIPTION -->
    <!-- ========================================================================= -->
    <section id="sec-2" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f0fdf4; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#16a34a; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">2</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">إنشاء حساب التداول، المتطلبات، وحالات الطلب والاشتراكات</h2>
        </div>

        <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-list-check" style="color:#16a34a;"></i> المتطلبات الأساسية
        </h4>
        <p style="font-size:0.88rem; color:#64748b; margin-bottom:8px;">قبل البدء بإنشاء حساب التداول، يجب التأكد من توفر الشروط التالية:</p>
        <ul style="margin:0 0 20px 0; padding-right:24px; font-size:0.92rem; color:#334155; line-height:1.8;">
            <li>امتلاك محفظة زين كاش للأفراد.</li>
            <li>أن يكون حساب زين كاش مفعلاً وموافقاً عليه.</li>
            <li>توفر بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً للتسجيل في خدمة التداول.</li>
        </ul>

        <!-- 6 Steps -->
        <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:12px;">
            <i class="fa-solid fa-route" style="color:#2563eb;"></i> خطوات تسجيل حساب التداول في تطبيق زين كاش
        </h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:12px; margin-bottom:22px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">1.</strong> الدخول إلى قسم "الأسهم" من القائمة السفلية في تطبيق زين كاش، ثم الضغط على ابدأ.
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">2.</strong> إدخال بريد إلكتروني شخصي فعال وغير مستخدم مسبقاً في خدمة التداول، ثم إدخال رمز التحقق (OTP) المرسل إلى البريد الإلكتروني.
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">3.</strong> تحديد المبلغ المتوقع للتداول ومصدر الأموال.
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">4.</strong> الإجابة على الأسئلة التنظيمية المطلوبة والإقرار والموافقة على نموذج (<strong>W-8BEN</strong> وهو إقرار ضريبي أمريكي يُثبت أن العميل من غير الأشخاص الأمريكيين لأغراض الضريبة الأمريكية) والشروط والأحكام الخاصة بالخدمة.
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">5.</strong> اختيار خطة الاشتراك وإتمام عملية الدفع، حيث يتم استقطاع رسوم الاشتراك من محفظة زين كاش.
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:0.88rem; line-height:1.6;">
                <strong style="color:#2563eb;">6.</strong> يتم إرسال الطلب للمراجعة والتحقق، ومن المتوقع تفعيل حساب التداول أو إشعارك بنتيجة الطلب خلال 24 ساعة.
            </div>
        </div>

        <!-- Registration Statuses -->
        <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:12px;">
            <i class="fa-solid fa-info-circle" style="color:#0284c7;"></i> حالات طلب التسجيل
        </h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:22px;">
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px;">
                <h5 style="color:#166534; font-weight:800; font-size:0.95rem; margin:0 0 6px 0;">
                    <i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> قبول الطلب (Approved)
                </h5>
                <p style="font-size:0.86rem; color:#14532d; margin:0; line-height:1.6;">
                    تم قبول طلبك بنجاح، وتم تفعيل حسابك في خدمة التداول مباشرة. يمكنك الآن البدء باستخدام الخدمة وتداول الأسهم عبر التطبيق.
                </p>
            </div>
            <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:12px; padding:16px;">
                <h5 style="color:#92400e; font-weight:800; font-size:0.95rem; margin:0 0 6px 0;">
                    <i class="fa-solid fa-clock-rotate-left" style="color:#d97706;"></i> قيد المراجعة (Pending)
                </h5>
                <p style="font-size:0.86rem; color:#78350f; margin:0; line-height:1.6;">
                    طلبك قيد المراجعة حالياً، وسيتم حجز مبلغ الاشتراك مؤقتاً لحين استكمال التحقق خلال مدة تصل إلى 24 ساعة. يمكنك متابعة حالة الطلب من قسم التداول، كما سيتم إشعارك عبر البريد الإلكتروني المسجل عند قبول الطلب.
                </p>
            </div>
            <div style="background:#fef2f2; border:1px solid #fecdd3; border-radius:12px; padding:16px;">
                <h5 style="color:#991b1b; font-weight:800; font-size:0.95rem; margin:0 0 6px 0;">
                    <i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i> رفض الطلب (Rejected)
                </h5>
                <p style="font-size:0.86rem; color:#7f1d1d; margin:0; line-height:1.6;">
                    في حال عدم استيفاء شروط الأهلية أو متطلبات التحقق، سيتم رفض الطلب وإشعارك بذلك، مع إعادة مبلغ الاشتراك إلى محفظة زين كاش الخاصة بك.
                </p>
            </div>
        </div>

        <!-- Ineligible Accounts -->
        <div style="background:#fef2f2; border-right:4px solid #dc2626; border-radius:14px; padding:18px; margin-bottom:20px;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#991b1b; margin:0 0 10px 0;">
                <i class="fa-solid fa-user-slash"></i> أنواع المحافظ غير المؤهلة للتسجيل في خدمة الأسهم
            </h4>
            <p style="font-size:0.88rem; color:#7f1d1d; margin-bottom:10px;">
                بعض الحالات لا تكون مؤهلة لفتح حساب تداولي بسبب المتطلبات والقيود التنظيمية، وتشمل ما يلي:
            </p>
            <ul style="margin:0 0 10px 0; padding-right:20px; font-size:0.88rem; color:#7f1d1d; line-height:1.8;">
                <li><strong>الأشخاص الأمريكيون:</strong> ويشمل ذلك من يحمل الجنسية الأمريكية، أو يمتلك TIN / SSN، أو يحمل البطاقة الخضراء (Green Card)، أو لديه رقم ضمان اجتماعي أمريكي (SSN) سواء كان مولوداً في الولايات المتحدة أو مقيماً فيها.</li>
                <li><strong>الأشخاص السياسيون (PEP):</strong> حيث قد يتم رفض الطلب أو إحالته للمراجعة وفقاً للسياسات والإجراءات التنظيمية المعتمدة.</li>
                <li><strong>الجنسيات غير المدرجة ضمن القائمة المعتمدة:</strong> لا يمكن لحاملي الجنسيات غير المدرجة ضمن القائمة المعتمدة فتح حساب تداولي. وتشمل القائمة الحالية: (إيران، أفغانستان، السودان، أوكرانيا، روسيا، ليبيا، اليمن، كوريا الشمالية، كوبا، ميانمار - بورما). كما قد تخضع هذه القائمة للتحديث وفقاً للمتطلبات والسياسات التنظيمية المعتمدة.</li>
                <li><strong>المحافظ المغلقة</strong> لأسباب تنظيمية أو قانونية.</li>
                <li><strong>أي طلب يتم رفضه</strong> من قبل فريق التسجيل أو فريق الامتثال وفقاً للمتطلبات التنظيمية المعتمدة.</li>
            </ul>
            <p style="font-size:0.85rem; color:#991b1b; font-weight:700; margin:0;">
                ⚠️ <em>ملاحظة: استيفاء متطلبات التسجيل لا يضمن بالضرورة قبول الطلب، حيث تخضع جميع الطلبات للمراجعة والتحقق وفق السياسات والإجراءات المعتمدة وسيتم الرفض أو القبول خلال 24 ساعة.</em>
            </p>
        </div>

        <!-- Subscription fees & Renewal -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
                <i class="fa-solid fa-credit-card" style="color:#d97706;"></i> رسوم الاشتراك وتجديد الحساب
            </h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:14px;">
                    <strong style="color:#0f172a; font-size:0.92rem;">قيمة الاشتراك والعمولات:</strong>
                    <ul style="margin:8px 0 0 0; padding-right:20px; font-size:0.86rem; color:#475569; line-height:1.7;">
                        <li><strong>قيمة الاشتراك:</strong> 5,000 دينار عراقي شهرياً مقابل لا توجد أي رسوم أو عمولات على عمليات التداول (الشراء والبيع) طوال مدة الاشتراك — أي <strong>تداول غير محدود بلا رسوم تداول</strong>.</li>
                        <li>حالياً يتوفر نوع اشتراك واحد فقط (الاشتراك الشهري).</li>
                        <li>يتم تجديد الاشتراك بعد 30 يوم ولن يتم تجديدها تلقائياً.</li>
                        <li><strong>عمولة إدارة الحساب السنوية:</strong> 10,000 دينار عراقي.</li>
                    </ul>
                </div>

                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:14px;">
                    <strong style="color:#0f172a; font-size:0.92rem;">ضوابط تجديد الاشتراك:</strong>
                    <ul style="margin:8px 0 0 0; padding-right:20px; font-size:0.86rem; color:#475569; line-height:1.7;">
                        <li><strong>عند انتهاء الاشتراك:</strong> تتقيد الصلاحيات (لا يمكن التداول: شراء الأسهم، الإيداع إلى حساب التداول)، ويمكن فقط (بيع الأسهم وسحب المبلغ المتوفر في القوة الشرائية إلى محفظة زين كاش).</li>
                        <li>يمكن تجديد الاشتراك شهرياً إذ تظهر كل شهر نافذة منبثقة لدفع رسوم الاشتراك الشهري البالغة 5,000 دينار من محفظة زين كاش لمواصلة الوصول إلى الخدمة.</li>
                        <li>يمكنك تفعيل الاشتراك أيضاً من خلال <strong>إعدادات - إدارة الاشتراك</strong>.</li>
                        <li>في حال عدم كفاية الرصيد عند التجديد، يُعتبر الاشتراك منتهياً وتُقيَّد صلاحيات التداول.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 3: HOME PAGE, DEPOSITS, WITHDRAWALS, FX & MY PORTFOLIO -->
    <!-- ========================================================================= -->
    <section id="sec-3" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #eff6ff; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#059669; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">3</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">الصفحة الرئيسية، الإيداع، السحب، سعر الصرف، وتفاصيل قسم محفظتك</h2>
        </div>

        <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:12px;">
            <i class="fa-solid fa-gauge" style="color:#059669;"></i> مقاييس الحساب في الصفحة الرئيسية
        </h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:20px;">
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:#2563eb; font-size:0.92rem; margin-bottom:4px;">النقد (Cash)</div>
                <p style="font-size:0.84rem; color:#475569; margin:0; line-height:1.6;">إجمالي الرصيد النقدي الموجود في حساب التداول، ويشمل الأموال المتاحة والأموال التي لا تزال قيد التسوية. لا يعني ذلك أن كامل هذا الرصيد قابل للسحب أو متاح للاستخدام، حيث قد يكون جزء منه محجوزًا لأوامر شراء مفتوحة أو غير قابل للسحب حتى اكتمال التسوية.</p>
            </div>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:#059669; font-size:0.92rem; margin-bottom:4px;">القيمة السوقية (Market Value)</div>
                <p style="font-size:0.84rem; color:#475569; margin:0; line-height:1.6;">القيمة الحالية لجميع الأسهم التي تمتلكها، ويتم احتسابها وفقًا لأسعار السوق الحالية، لذلك تتغير مع ارتفاع أو انخفاض أسعار الأسهم.</p>
            </div>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:#7c3aed; font-size:0.92rem; margin-bottom:4px;">صافي القيمة المحفظة (Net Asset Value)</div>
                <p style="font-size:0.84rem; color:#475569; margin:0; line-height:1.6;">إجمالي قيمة حساب التداول، ويشمل الرصيد النقدي بالإضافة إلى القيمة السوقية للأسهم، بعد احتساب أي التزامات أو عمليات قائمة.</p>
            </div>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:#d97706; font-size:0.92rem; margin-bottom:4px;">القوة الشرائية (Buying Power)</div>
                <p style="font-size:0.84rem; color:#475569; margin:0; line-height:1.6;">المبلغ المتاح لاستخدامه في شراء الأسهم. عند إرسال أمر شراء، يتم حجز قيمة الأمر مباشرة من القوة الشرائية، حتى وإن كان الأمر معلقًا أو كان السوق مغلقًا. وفي حال إلغاء الأمر أو انتهاء صلاحيته دون تنفيذ، يتم تحرير المبلغ وإعادته إلى القوة الشرائية.</p>
            </div>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:#0284c7; font-size:0.92rem; margin-bottom:4px;">الرصيد النقدي الحر المتاح للسحب</div>
                <p style="font-size:0.84rem; color:#475569; margin:0; line-height:1.6;">الجزء من الرصيد النقدي الذي أصبح متاحًا للسحب وإعادته إلى محفظة زين كاش، بعد استبعاد أي مبالغ محجوزة أو قيد التسوية أو مرتبطة بأوامر شراء مفتوحة.</p>
            </div>
        </div>

        <!-- Cash vs Withdrawable Clarification Box -->
        <div style="background:#fff7ed; border-right:4px solid #ea580c; border-radius:12px; padding:16px; margin-bottom:22px; font-size:0.9rem; color:#9a3412; line-height:1.7;">
            <strong>📌 ملاحظة الفرق بين النقد (Cash) والرصيد النقدي الحر المتاح للسحب:</strong><br>
            يختلف النقد (Cash) عن الرصيد النقدي الحر المتاح للسحب. فالنقد يمثل إجمالي الرصيد النقدي في حساب التداول، ويشمل المبالغ المتاحة بالإضافة إلى المبالغ التي لا تزال قيد التسوية أو المحجوزة. أما الرصيد النقدي الحر المتاح للسحب، فهو الجزء من هذا الرصيد الذي يمكن سحبه وإعادته إلى المحفظة بشكل فوري.<br>
            <div style="background:#ffffff; border:1px solid #fed7aa; border-radius:8px; padding:10px 14px; margin-top:8px;">
                <strong>💡 مثال توضيحي:</strong> لنفترض أن لديك 500 دولار في حساب التداول، ثم قمت ببيع أسهم بقيمة 100 دولار خلال اليوم، ليصبح النقد (Cash) في حسابك 600 دولار. لكن الرصيد النقدي الحر المتاح للسحب سيبقى 500 دولار فقط، لأن مبلغ 100 دولار الناتج عن البيع لا يزال قيد التسوية ولا يمكن سحبه إلا بعد اكتمال التسوية، حيث سيكون المبلغ كاملًا متاحًا للسحب، ويصبح الرصيد النقدي الحر المتاح للسحب 600 دولار.
            </div>
        </div>

        <!-- Deposit & Withdrawal Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:22px;">
            
            <!-- Deposits -->
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#166534; margin:0 0 10px 0;">
                    <i class="fa-solid fa-arrow-down-to-bracket"></i> الإيداع إلى حساب التداول
                </h4>
                <p style="font-size:0.85rem; color:#14532d; margin-bottom:8px;">يقوم المشترك بتحويل مبلغ من محفظة زين كاش إلى حساب التداول ليتمكن من شراء الأسهم باتباع الخطوات التالية:</p>
                <ol style="margin:0 0 12px 0; padding-right:20px; font-size:0.85rem; color:#14532d; line-height:1.7;">
                    <li>الدخول إلى خدمة التداول ثم اختيار <strong>الإيداع</strong> من القائمة الرئيسية.</li>
                    <li>إدخال مبلغ الإيداع المطلوب (الحد الأدنى للإيداع هو <strong>1 دولار أمريكي</strong>، والحد الأقصى الشهري للإيداع هو ما يعادل <strong>20,000,000 دينار عراقي</strong> بالدولار الأمريكي وفقًا لسعر الصرف المعتمد).</li>
                    <li>مراجعة تفاصيل العملية قبل التأكيد (مبلغ الإيداع، سعر الصرف المعتمد، الرسوم، والمبلغ النهائي المستقطع من المحفظة).</li>
                    <li>الموافقة على العملية.</li>
                    <li>يتم تنفيذ الإيداع وإضافة المبلغ إلى حساب التداول.</li>
                </ol>
                <div style="background:#dcfce7; color:#166534; font-weight:700; padding:6px 12px; border-radius:6px; font-size:0.84rem;">
                    💰 عمولة الإيداع: <strong>0.5%</strong> من المبلغ الكلي المراد تعبئته لحساب التداول.
                </div>
            </div>

            <!-- Withdrawals -->
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#1e40af; margin:0 0 10px 0;">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i> السحب من حساب التداول
                </h4>
                <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:8px;">يمكنك تحويل الأموال من حساب التداول إلى محفظة زين كاش باتباع الخطوات التالية:</p>
                <ol style="margin:0 0 12px 0; padding-right:20px; font-size:0.85rem; color:#1e3a8a; line-height:1.7;">
                    <li>ادخل إلى خدمة الأسهم، ثم اختر <strong>سحب</strong> من الصفحة الرئيسية.</li>
                    <li>أدخل مبلغ السحب المطلوب (الحد الأدنى للسحب هو <strong>1 دولار أمريكي</strong>. الحد الأقصى اليومي هو ما يعادل <strong>2,500,000 دينار عراقي</strong> بالدولار الأمريكي، والحد الأقصى الشهري هو ما يعادل <strong>20,000,000 دينار عراقي</strong> بالدولار الأمريكي).</li>
                    <li>راجع تفاصيل العملية (مبلغ السحب، سعر الصرف المعتمد، الرسوم، والمبلغ النهائي الذي سيصل إلى محفظة زين كاش).</li>
                    <li>وافق على العملية لتأكيدها.</li>
                    <li>سيتم تحويل المبلغ إلى محفظة زين كاش بعد إتمام عملية السحب.</li>
                </ol>
                <div style="background:#dbeafe; color:#1e40af; font-weight:700; padding:6px 12px; border-radius:6px; font-size:0.84rem; margin-bottom:8px;">
                    💰 عمولة السحب: <strong>0.5%</strong> من المبلغ الكلي المراد سحبه من حساب التداول.
                </div>
                <div style="font-size:0.8rem; color:#1e3a8a; line-height:1.5;">
                    ⚠️ <em>ملاحظة: لا يمكنك سحب قيمة الأسهم مباشرة، ويجب بيع الأسهم أولاً (خلال ساعات التداول الرسمية للسوق الأمريكي فقط) لتتحول إلى رصيد نقدي في حساب التداول، ثم يمكنك سحب هذا الرصيد إلى محفظة زين كاش.</em>
                </div>
            </div>
        </div>

        <!-- Exchange Rate -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px; margin-bottom:20px;">
            <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
                <i class="fa-solid fa-coins" style="color:#d97706;"></i> سعر الصرف (FX Rate)
            </h4>
            <ul style="margin:0; padding-right:20px; font-size:0.88rem; color:#475569; line-height:1.7;">
                <li>سيظهر لك سعر الصرف بشكل واضح قبل تأكيد عملية الإيداع أو السحب.</li>
                <li>سيتم تنفيذ العملية وفق سعر الصرف الظاهر على الشاشة عند تأكيد العملية.</li>
            </ul>
        </div>

        <!-- My Portfolio -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
                <i class="fa-solid fa-briefcase" style="color:#4f46e5;"></i> قسم "محفظتك" (My Portfolio)
            </h4>
            <p style="font-size:0.88rem; color:#475569; margin-bottom:10px;">يمكنك من خلال هذا القسم الاطلاع على الأسهم التي قمت بشرائها، حيث يتم عرضها مصنفة حسب الشركات، وتشمل:</p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>نوع الشركة:</strong> الشركة التي تم شراء السهم منها.
                </div>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>متوسط سعر الشراء:</strong> متوسط السعر الذي تم شراء السهم به.
                </div>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>مقدار الأسهم التي تمتلكها:</strong> عدد الأسهم أو الكسور التي تمتلكها في كل شركة.
                </div>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>القيمة السوقية:</strong> القيمة الحالية للأسهم بناءً على سعر السوق.
                </div>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>نسبة الربح أو الخسارة:</strong> نسبة التغير في قيمة التداول (ربح أو خسارة).
                </div>
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:0.84rem;">
                    <strong>مبلغ الربح أو الخسارة:</strong> القيمة المالية الفعلية للربح أو الخسارة.
                </div>
            </div>
        </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 4: BUYING & SELLING, ORDER TYPES, HOURS & ORDER STATUSES -->
    <!-- ========================================================================= -->
    <section id="sec-4" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #fdf4ff; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#c026d3; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">4</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">شراء وبيع الأسهم، أنواع الأوامر، حالات السوق، وإلغاء الأوامر ومراقبة الأداء</h2>
        </div>

        <!-- Available and Unallowed -->
        <div style="background:#fdf4ff; border:1px solid #f5d0fe; border-radius:12px; padding:16px; margin-bottom:20px;">
            <h4 style="font-size:0.98rem; font-weight:800; color:#86198f; margin:0 0 6px 0;">
                <i class="fa-solid fa-list-check"></i> الأسهم المتاحة وغير المتاحة ضمن خدمة الأسهم في تطبيق زين كاش
            </h4>
            <p style="font-size:0.88rem; color:#701a75; margin:0 0 6px 0;">
                تتيح الخدمة تداول الأسهم الأمريكية المدرجة في البورصات الأمريكية فقط.
            </p>
            <p style="font-size:0.85rem; color:#701a75; margin:0;">
                <strong>الغير متاح حالياً:</strong> الأسهم غير الأمريكية، العملات الرقمية (Cryptocurrencies)، صناديق المؤشرات (ETFs)، عقود الخيارات (Options)، التداول بالهامش (Margin Trading)، والبيع على المكشوف (Short Selling).
            </p>
        </div>

        <!-- Trading hours -->
        <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-clock" style="color:#c026d3;"></i> ساعات عمل السوق الأمريكي وساعات التداول بتوقيت بغداد
        </h4>
        <p style="font-size:0.88rem; color:#475569; margin-bottom:10px; line-height:1.7;">
            سوق الأسهم الأمريكي يفتح ويغلق وفق أوقات محددة بالتوقيت الشرقي للولايات المتحدة (ET). تبدأ جلسة التداول من الساعة <strong>9:30 صباحاً حتى 4:00 عصراً (ET)</strong> من الإثنين إلى الجمعة. ويكون السوق مغلقاً خلال عطلات نهاية الأسبوع والعطلات الرسمية الأمريكية المعتمدة. ونظراً لاعتماد الولايات المتحدة التوقيت الصيفي (Daylight Saving Time) وعدم اعتماده في العراق، تختلف ساعات التداول المقابلة بتوقيت بغداد خلال العام:
        </p>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155;">الفترة</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">وقت افتتاح السوق (بغداد)</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">وقت اغلاق السوق (بغداد)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>التوقيت الصيفي الأمريكي (منتصف آذار – أوائل تشرين الثاني تقريباً)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#16a34a; font-weight:700;">4:30 مساءً</td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#dc2626; font-weight:700;">11:00 مساءً</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>التوقيت الشتوي الأمريكي (تشرين الثاني – منتصف آذار تقريباً)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#16a34a; font-weight:700;">5:30 مساءً</td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#dc2626; font-weight:700;">12:00 منتصف الليل</td>
                </tr>
            </tbody>
        </table>

        <!-- Market Statuses in App -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-shop" style="color:#2563eb;"></i> حالات السوق داخل التطبيق
        </h4>
        <ul style="margin:0 0 14px 0; padding-right:20px; font-size:0.9rem; color:#334155; line-height:1.7;">
            <li><strong>السوق مفتوح (Open):</strong> تعني أن جلسة التداول الرسمية نشطة حالياً، ويمكن تنفيذ أوامر البيع والشراء وفقاً لظروف السوق.</li>
            <li><strong>السوق مغلق (US Market Closed):</strong> تعني أن السوق خارج ساعات التداول الرسمية، وتظهر عادةً شارة حمراء توضح أن السوق مغلق حالياً.</li>
        </ul>

        <!-- What happens when market is closed -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:22px;">
            <h5 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                <i class="fa-solid fa-moon" style="color:#475569;"></i> ماذا يحدث عندما يكون السوق مغلقاً؟
            </h5>
            <p style="font-size:0.86rem; color:#475569; margin:0 0 8px 0; line-height:1.6;">
                عند إغلاق السوق الأمريكي، تبقى بعض وظائف الخدمة متاحة بينما تتوقف عمليات التداول الفعلية حتى إعادة فتح السوق وكما يلي:
            </p>
            <ul style="margin:0; padding-right:20px; font-size:0.86rem; color:#334155; line-height:1.7;">
                <li>يتم عرض آخر سعر إغلاق متاح للسهم (Last Closing Price).</li>
                <li>لا تتغير الأسعار بشكل لحظي لعدم وجود تداول نشط.</li>
                <li>لا يتم تنفيذ أوامر البيع والشراء بشكل فوري.</li>
                <li>يمكنك إرسال أوامر البيع أو الشراء أثناء إغلاق السوق، حيث تبقى هذه الأوامر معلّقة (Pending) في قائمة الانتظار ولا تُنفَّذ فوراً، ثم تُنفَّذ تلقائياً عند إعادة فتح السوق في جلسة التداول التالية كصفقة اعتيادية. وطالما بقي الأمر في حالة "معلّق" ولم يُنفَّذ بعد، يمكنك إلغاؤه في أي وقت من خلال التطبيق، ويُعاد المبلغ المحجوز إلى النقد المتاح. وفي حال كان الأمر من نوع أمر السوق (Market)، فإنه يُنفَّذ بسعر السوق عند الفتح والذي قد يختلف عن آخر سعر إغلاق معروض؛ أما الأمر المحدد (Limit) فيُصبح فعّالاً عند الفتح ولا يُنفَّذ إلا عند بلوغ السعر المحدد أو أفضل منه.</li>
            </ul>
        </div>

        <!-- How to Buy & How to Sell Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:22px;">
            
            <!-- How to buy -->
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#166534; margin:0 0 10px 0;">
                    <i class="fa-solid fa-cart-shopping"></i> كيف يشتري العميل سهماً؟
                </h4>
                <ol style="margin:0 0 10px 0; padding-right:20px; font-size:0.85rem; color:#14532d; line-height:1.7;">
                    <li>يمكنك البحث عن السهم بالاسم أو الرمز من صفحة الاستكشاف أو قائمة المتابعة.</li>
                    <li>قم بفتح صفحة تفاصيل السهم واضغط <strong>شراء</strong>. إذا كان هذا السهم يدعم شراء الكسور، يمكنك شراء سهم كامل أو جزء من سهم (مثل 0.25 سهم).</li>
                    <li>اختر نوع الأمر: <strong>أمر السوق (Market)</strong> أو <strong>الأمر المحدد (Limit)</strong>.</li>
                    <li>أدخل الكمية (عدد الأسهم أو أجزاء من السهم)، وفي حال اختيار أمر Limit قم بإدخال السعر المطلوب أيضاً.</li>
                    <li>اختر نوع صلاحية الأمر (Day, FOK, GTC).</li>
                    <li>قم بمراجعة ملخص الطلب (رمز السهم، الكمية، التكلفة التقديرية، والرسوم إن وجدت).</li>
                    <li>قم بتأكيد العملية باستخدام المصادقة البيومترية (بصمة وجه) أو إدخال الرمز السري للمحفظة (PIN).</li>
                    <li>في حال توفر السهم، سيتم تنفيذ العملية واستقطاع المبلغ من حساب التداول مباشرة.</li>
                </ol>
            </div>

            <!-- How to sell -->
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px; padding:18px;">
                <h4 style="font-size:1rem; font-weight:800; color:#1e40af; margin:0 0 10px 0;">
                    <i class="fa-solid fa-hand-holding-dollar"></i> كيف يبيع العميل سهماً؟
                </h4>
                <ol style="margin:0 0 10px 0; padding-right:20px; font-size:0.85rem; color:#1e3a8a; line-height:1.7;">
                    <li>الدخول إلى قائمة "محفظتي" والبحث عن السهم المراد بيعه.</li>
                    <li>الضغط على السهم ثم اختيار <strong>بيع (Sell)</strong>.</li>
                    <li>تحديد نوع الأمر:
                        <ul style="margin:4px 0; padding-right:16px;">
                            <li><strong>أمر السوق (Market Order):</strong> يتم بيع الأسهم مباشرة بسعر السوق الحالي خلال ساعات فتح السوق، مع تحديد عدد الأسهم المراد بيعها (ويظهر عدد الأسهم المتاحة).</li>
                            <li><strong>الأمر المحدد (Limit Order):</strong> يتم تحديد الحد الأدنى للسعر الذي يرغب العميل بالبيع عنده، ثم تحديد الكمية (عدد الأسهم أو أجزاء من السهم حسب نوع التداول).</li>
                        </ul>
                    </li>
                    <li>تحديد مدة الأمر (Day, GTC, FOK).</li>
                    <li>تأكيد العملية باستخدام المصادقة البيومترية (بصمة الوجه) أو إدخال الرمز السري للمحفظة (PIN).</li>
                </ol>
            </div>
        </div>

        <!-- Buy Rejection Reasons -->
        <div style="background:#fef2f2; border:1px solid #fecdd3; border-radius:12px; padding:16px; margin-bottom:22px;">
            <h4 style="font-size:0.98rem; font-weight:800; color:#991b1b; margin:0 0 8px 0;">
                <i class="fa-solid fa-triangle-exclamation"></i> أسباب رفض طلب شراء الأسهم
            </h4>
            <ul style="margin:0; padding-right:20px; font-size:0.86rem; color:#7f1d1d; line-height:1.7;">
                <li><strong>عدم كفاية القوة الشرائية:</strong> يتم رفض الطلب عندما لا يكون لدى العميل رصيد كافٍ في حساب التداول لتغطية قيمة الصفقة والرسوم إن وجدت.</li>
                <li><strong>أوامر معلّقة تحجز الرصيد:</strong> قد يكون لدى العميل أوامر شراء سابقة (Pending) قامت بحجز جزء من الرصيد، مما يمنع تنفيذ طلب جديد.</li>
                <li><strong>خطأ في شروط الأمر:</strong> مثل إدخال كمية غير صحيحة، أو سعر غير منطقي في أمر Limit، أو مخالفة قواعد التنفيذ.</li>
                <li><strong>عدم توفر الكمية أو السعر في السوق:</strong> في بعض الحالات لا تتوفر كمية كافية بالسعر المطلوب لتنفيذ الأمر.</li>
                <li><strong>قيود على الحساب أو الخدمة:</strong> مثل انتهاء الاشتراك.</li>
            </ul>
        </div>

        <!-- Market vs Limit Order comparison -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:18px; margin-bottom:22px;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
                <i class="fa-solid fa-scale-balanced" style="color:#2563eb;"></i> الفرق بين أمر السوق (Market Order) والأمر المحدد (Limit Order) عند البيع أو الشراء
            </h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:14px;">
                    <strong style="color:#2563eb; font-size:0.92rem;">أمر السوق (Market Order)</strong>
                    <p style="font-size:0.85rem; color:#475569; margin:6px 0; line-height:1.6;">
                        يتم تنفيذ أمر الشراء أو البيع مباشرة بسعر السوق الحالي خلال ساعات فتح السوق، دون تحديد سعر مسبق. قد يختلف سعر التنفيذ الفعلي عن السعر الظاهر لحظة الطلب بسبب تغيرات السوق والعرض والطلب.
                    </p>
                    <div style="background:#eff6ff; padding:8px 12px; border-radius:6px; font-size:0.82rem; color:#1e40af;">
                        <strong>مثال:</strong> إذا أردت شراء سهم Apple بسعره الحالي، فسيتم تنفيذ الأمر مباشرة بسعر السوق المتاح وقت التنفيذ، حتى لو تغيّر السعر قليلًا بين لحظة تقديم الطلب ولحظة التنفيذ.
                    </div>
                </div>

                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:14px;">
                    <strong style="color:#059669; font-size:0.92rem;">الأمر المحدد (Limit Order)</strong>
                    <p style="font-size:0.85rem; color:#475569; margin:6px 0; line-height:1.6;">
                        يقوم العميل بتحديد سعر معين للشراء أو البيع، ولا يتم تنفيذ الأمر إلا عند الوصول إلى هذا السعر أو أفضل منه. يكون الهدف هو التحكم بالسعر وليس السرعة. عند اختيار هذا النوع من الأوامر، يتم حجز قيمة الطلب حتى يتم إلغاؤه، أو يتم تنفيذ الأمر بالكامل، أو تنتهي صلاحية الأمر.
                    </p>
                    <div style="background:#f0fdf4; padding:8px 12px; border-radius:6px; font-size:0.82rem; color:#166534;">
                        <strong>مثال:</strong> تحدد شراء Apple بسعر 190$ ← لا يتم التنفيذ إلا إذا وصل السعر إلى 190$ أو أقل.
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Durations & Order Statuses Tables -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-hourglass-half" style="color:#d97706;"></i> أنواع صلاحية الأوامر (Order Duration)
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:35%;">نوع الأمر</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">معناه وتفاصيله</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Day (صلاحية ليوم واحد)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">يعني أن الأمر يبقى فعالاً فقط خلال يوم التداول الحالي. إذا لم يتم تنفيذه بالكامل قبل إغلاق السوق، يتم إلغاؤه تلقائياً من النظام ولا ينتقل لليوم التالي.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>GTC (Good Till Cancelled)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">يعني أن الأمر يبقى فعالاً في النظام (أيام أو أسابيع) إلى أن يصل إلى السعر المطلوب أو حتى يقوم المشترك بإلغائه من خلال التطبيق، مع حجز قيمة الطلب إلى حين إلغائه أو تنفيذه.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>FOK (Fill or Kill)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">يعني أن الأمر يجب أن يتم تنفيذه بالكامل وبشكل فوري عند إرساله. إذا لم تتوفر الكمية كاملة أو لم يتحقق السعر المطلوب فوراً، يتم إلغاء الأمر مباشرة بدون تنفيذ أي جزء منه (لا يقبل جزء من السهم في حالات البيع أو الشراء).</td>
                </tr>
            </tbody>
        </table>

        <!-- Order Statuses -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-bars-progress" style="color:#0284c7;"></i> حالات الأمر لشراء الأسهم
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:30%;">الأمر</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">المعنى والتوضيح</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#fffbeb;"><strong style="color:#b45309;">(Pending) قيد الانتظار</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">تم إرسال الأمر إلى السوق، لكنه لا يزال قيد الانتظار. سيتم تنفيذه عند فتح السوق خلال ساعات التداول الرسمية أو عند استيفاء شروط التنفيذ المطلوبة (مثل السعر أو توفر الكمية).</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f0fdf4;"><strong style="color:#15803d;">(Executed) مُنفَّذ</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">تم تنفيذ الأمر بالكامل حسب الكمية المطلوبة من قبل العميل دون أي جزء متبقي.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#eff6ff;"><strong style="color:#1d4ed8;">(Partially Filled) مُنفَّذ جزئياً</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">تم تنفيذ جزء فقط من الأمر، بينما بقي جزء آخر قيد الانتظار أو لم يتوفر له تنفيذ في السوق.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong style="color:#475569;">(Cancelled) ملغى</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">تم إلغاء الأمر إما من قبل العميل أو من النظام قبل اكتمال تنفيذه، ولا يتم تنفيذه بعد الإلغاء.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#fef2f2;"><strong style="color:#b91c1c;">(Rejected) مرفوض</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">تم رفض الأمر من النظام بسبب سبب معين مثل عدم كفاية القوة الشرائية.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong style="color:#64748b;">(Expired) منتهي</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">انتهت مدة صلاحية الأمر (مثل أمر Day) دون أن يتم تنفيذه، لذلك تم إلغاؤه تلقائياً.</td>
                </tr>
            </tbody>
        </table>

        <!-- Canceling orders and Watchlist -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-ban" style="color:#dc2626;"></i> إلغاء الأوامر المفتوحة في خدمة الأسهم
                </h4>
                <p style="font-size:0.85rem; color:#475569; margin-bottom:8px;">يمكنك إلغاء الأوامر المفتوحة أو قيد التنفيذ الجزئي مباشرة من خلال تطبيق زين كاش:</p>
                <ol style="margin:0 0 8px 0; padding-right:20px; font-size:0.84rem; color:#334155; line-height:1.6;">
                    <li>ادخل إلى قسم معاملات داخل خدمة الأسهم واختر الأمر الذي ترغب بإلغائه.</li>
                    <li>اضغط على خيار <strong>إلغاء الأمر (Cancel Order)</strong>.</li>
                    <li>قم بتأكيد عملية الإلغاء من خلال رسالة التأكيد داخل التطبيق.</li>
                </ol>
                <p style="font-size:0.82rem; color:#64748b; margin:0;">
                    💡 <em>يمكنك إلغاء الأمر فقط إذا كان قيد الانتظار (Pending) أو منفّذ جزئياً (Partially Filled). إذا تم تنفيذ الأمر بالكامل فلا يمكن إلغاؤه.</em>
                </p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-star" style="color:#f59e0b;"></i> كيفية متابعة أداء الأسهم (المفضلة أو المشتراة)
                </h4>
                <p style="font-size:0.85rem; color:#475569; margin-bottom:8px;">يمكنك مراقبة أداء الأسهم (ارتفاع، انخفاض القيمة مباشر) من خلال إنشاء قائمة مراقبة للأسهم المتاحة:</p>
                <ol style="margin:0 0 8px 0; padding-right:20px; font-size:0.84rem; color:#334155; line-height:1.6;">
                    <li>اختر <strong>قائمة المتابعة</strong> من أعلى الشاشة ثم اضغط إضافة.</li>
                    <li>أدخل اسم قائمة المتابعة ثم اضغط إنشاء.</li>
                    <li>اذهب إلى "الاستكشاف" ثم حدد السهم المراد إضافته واضغط على علامة النجمة في الأعلى.</li>
                    <li>اختر القائمة التي تريد الإضافة إليها ثم اضغط حفظ.</li>
                </ol>
                <p style="font-size:0.82rem; color:#64748b; margin:0;">
                    💡 <em>يمكنك تعديل القائمة لاحقاً من خلال خيار إدارة قائمة المتابعة.</em>
                </p>
            </div>
        </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 5: FINANCIAL INDICATORS, FUNDAMENTALS & COMPANY DETAILS -->
    <!-- ========================================================================= -->
    <section id="sec-5" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #fffbeb; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#d97706; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">5</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">المؤشرات والأساسيات المالية، معلومات الشركة، الأرباح، وسجل المعاملات</h2>
        </div>

        <!-- Key Indicators Table -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-chart-simple" style="color:#d97706;"></i> المؤشرات الرئيسية
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:35%;">مقياس</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">المعنى</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>حجم التداول اليوم</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">عدد الأسهم المتداولة في اليوم؛ حجم أكبر يعني نشاطاً وسيولة أعلى على السهم.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>سعر الافتتاح</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">سعر السهم عند افتتاح السوق.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>السعر الأعلى، السعر الأدنى</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">أعلى سعر وصل إليه السهم في آخر جلسة، وأقل سعر وصل إليه السهم في الجلسة.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>سعر الإغلاق</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">السعر النهائي للسهم بعد إغلاق السوق.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>أعلى سعر خلال 52 أسبوع</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">أعلى سعر بلغه السهم خلال السنة الماضية؛ يعطي فكرة عن نطاق تذبذب السعر.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>أدنى سعر خلال 52 أسبوع</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">أدنى سعر بلغه السهم خلال السنة الماضية؛ يعطي فكرة عن نطاق تذبذب السعر.</td>
                </tr>
            </tbody>
        </table>

        <!-- Fundamentals Table -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-calculator" style="color:#2563eb;"></i> الأساسيات الرئيسية
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:35%;">المقياس</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">المعنى</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>EPS (Earnings Per Share)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">ربح الشركة المنسوب لكل سهم؛ كلما ارتفع دلّ على ربحية أكبر للشركة المالكة للسهم.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>عائد التوزيعات (Dividend Yield)</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة توزيعات الأرباح السنوية التقديرية مقارنةً بسعر السهم (إن كانت الشركة توزّع أرباحاً).</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>P/E (Price to Earnings) - نسبة السعر إلى الأرباح</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة السعر إلى الأرباح، وتقيس عدد المرات التي يدفعها المستثمر مقابل كل وحدة من أرباح الشركة. تُستخدم لتقييم ما إذا كان السهم مرتفع أو منخفض السعر مقارنة بأرباحه.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>P/B (Price to Book) - نسبة السعر إلى القيمة الدفترية</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة السعر إلى القيمة الدفترية، وتقارن سعر السهم بالقيمة الدفترية للشركة، وتساعد في تقييم ما إذا كان السهم يتداول بأعلى أو أقل من قيمة أصولها.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>P/S (Price to Sale) - نسبة السعر إلى المبيعات</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة السعر إلى المبيعات، وتقارن القيمة السوقية للشركة بإيراداتها السنوية، وتستخدم بشكل خاص لتقييم الشركات التي لا تحقق أرباحاً مستقرة.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>P/CF (Price to Cash Flow) - نسبة السعر إلى التدفق النقدي</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة السعر إلى التدفق النقدي، وتقيس قيمة السهم مقارنةً بالتدفقات النقدية التي تحققها الشركة، مما يساعد على تقييم قدرتها على توليد النقد.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>P/FCF (Price to Free Cash Flow) - نسبة السعر إلى التدفق النقدي الحر</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">نسبة السعر إلى التدفق النقدي الحر، وتقارن سعر السهم بالتدفق النقدي الحر المتبقي بعد النفقات التشغيلية، وتعد مؤشراً على القوة المالية للشركة.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>Market Cap - القيمة السوقية</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">القيمة الإجمالية للشركة في السوق، ويتم احتسابها بضرب <em>سعر السهم × إجمالي عدد الأسهم المصدرة</em>، وتستخدم لقياس حجم الشركة (صغيرة، متوسطة، أو كبيرة).</td>
                </tr>
            </tbody>
        </table>

        <!-- About Company Table -->
        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
            <i class="fa-solid fa-building" style="color:#059669;"></i> عن الشركة (Company Information)
        </h4>
        <table class="kb-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:35%;">الحقل</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">معناه</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Company Name</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">اسم الشركة المدرجة في سوق الأسهم.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>Ticker Symbol</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">رمز السهم المستخدم للتعرف على الشركة في البورصة (مثل: AAPL لشركة Apple).</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Primary Exchange</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">البورصة الرئيسية التي يتم فيها تداول السهم، مثل NYSE أو Nasdaq.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>Industry</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">القطاع أو النشاط الذي تعمل فيه الشركة، مثل التكنولوجيا، البنوك، الرعاية الصحية، الطاقة وغيرها.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Total Employees</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">إجمالي عدد موظفي الشركة، ويعطي مؤشراً على حجم الشركة.</td>
                </tr>
                <tr>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0; background:#ffffff;"><strong>Home Page URL</strong></td>
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">الموقع الإلكتروني الرسمي للشركة، والذي يمكن من خلاله الاطلاع على معلوماتها وأخبارها وتقاريرها المالية.</td>
                </tr>
            </tbody>
        </table>

        <!-- P&L, Transactions & Dividends -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
            
            <!-- Profit & Loss -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px;">
                <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-chart-line" style="color:#2563eb;"></i> الربح والخسارة (Profit & Loss)
                </h4>
                <ul style="margin:0; padding-right:20px; font-size:0.86rem; color:#334155; line-height:1.7;">
                    <li><strong>ربح/خسارة غير محققة (Unrealized P&L):</strong> هي الأرباح أو الخسائر الناتجة عن تغير سعر الأسهم التي ما زلت تملكها. تتغير هذه القيمة مع حركة السوق، ولا تتحول إلى نقد فعلي إلا عند بيع السهم.</li>
                    <li><strong>ربح/خسارة محققة (Realized P&L):</strong> هي الأرباح أو الخسائر الفعلية الناتجة بعد تنفيذ عملية بيع السهم.</li>
                </ul>
            </div>

            <!-- Transactions -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px;">
                <h4 style="font-size:0.98rem; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                    <i class="fa-solid fa-receipt" style="color:#059669;"></i> المعاملات داخل حساب التداول
                </h4>
                <p style="font-size:0.85rem; color:#475569; margin-bottom:6px;">يمكن الاطلاع على جميع الأنشطة (بيع، شراء) الأسهم من خلال قائمة المتابعة حيث سوف تظهر جميع المعاملات وكما أدناه:</p>
                <ul style="margin:0; padding-right:20px; font-size:0.85rem; color:#334155; line-height:1.7;">
                    <li><strong>الطلبات المفتوحة:</strong> هي الطلبات التي مازالت حالتها (قيد المراجعة / جديدة) التي لا تزال بانتظار التنفيذ (قيد الانتظار / جديد).</li>
                    <li><strong>سجل الطلبات:</strong> جميع الطلبات التي تمت بحساب التداول (بيع، شراء) المنفذة، الملغاة، المرفوضة والمنتهية الصلاحية.</li>
                    <li><strong>الأنشطة:</strong> جميع الأنشطة التي تمت بحساب التداول المالية وغير المالية.</li>
                </ul>
            </div>
        </div>

        <!-- Dividends -->
        <div style="background:#eff6ff; border-right:4px solid #2563eb; border-radius:12px; padding:16px; margin-top:20px; font-size:0.88rem; color:#1e3a8a; line-height:1.7;">
            <h4 style="font-size:0.98rem; font-weight:800; color:#1e40af; margin:0 0 8px 0;">
                <i class="fa-solid fa-gift"></i> توزيعات الأرباح (Dividends)
            </h4>
            <p style="margin:0 0 6px 0;">
                بعض الشركات تقوم بتوزيع جزء من أرباحها على المساهمين بشكل نقدي، وتُعرف هذه بـ <strong>توزيعات الأرباح</strong>. ليست جميع الشركات توزع أرباحاً. يتم عرض عائد التوزيعات (Dividend Yield) في صفحة تفاصيل السهم كنسبة تقديرية سنوية. إذا كانت النسبة أكبر من صفر، فهذا يعني أن الشركة قد توزع أرباحاً (وفق تاريخها السابق وليس ضماناً مستقبلياً).
            </p>
            <ul style="margin:0 0 6px 0; padding-right:20px;">
                <li><strong>متى يتم دفع هذه الأرباح؟</strong> تحدد الشركة موعد التوزيع (غالباً ربع سنوي). وعند الصرف يتم إضافة المبلغ تلقائياً إلى رصيد حساب التداول لدى شركة الوساطة.</li>
                <li><strong>أين تظهر هذه الأرباح؟</strong> تظهر في كشف الحساب كعملية باسم Dividend مع التاريخ والمبلغ.</li>
            </ul>
            <div style="background:#dbeafe; border-radius:6px; padding:8px 12px; margin-top:6px; font-size:0.84rem;">
                🏛️ <strong>ملاحظة ضريبية:</strong> قد يتم اقتطاع ضريبة أمريكية من توزيعات الأرباح حسب الأنظمة الضريبية ونموذج (W-8BEN) ويمكن الاطلاع على هذه الضرائب من خلال <strong>إعدادات التداول - مستند الضريبة</strong>.
            </div>
        </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 6: ACCOUNT SETTINGS & SIPC INVESTOR PROTECTION -->
    <!-- ========================================================================= -->
    <section id="sec-6" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f5f3ff; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#7c3aed; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">6</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">إعدادات حساب التداول، المستندات، وإغلاق الحساب وحماية المستثمر (SIPC)</h2>
        </div>

        <h4 style="font-size:1.02rem; font-weight:800; color:#0f172a; margin-bottom:12px;">
            <i class="fa-solid fa-sliders" style="color:#7c3aed;"></i> خيارات إعدادات حساب التداول
        </h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:22px;">
            
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h5 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
                    <i class="fa-solid fa-file-pdf" style="color:#dc2626;"></i> مستندات الحساب:
                </h5>
                <ul style="margin:0; padding-right:18px; font-size:0.85rem; color:#475569; line-height:1.7;">
                    <li><strong>كشف حساب الشهري:</strong> عرض تفاصيل جميع العمليات المالية والحركات داخل حساب التداول (إيداعات، سحوبات، صفقات) خلال شهر.</li>
                    <li><strong>كشف التداول اليومي:</strong> يمكنك من خلاله تحميل وتنزيل سجل جميع العمليات التي قمت بها بصيغة PDF.</li>
                    <li><strong>تفاصيل المستثمرين الخاصة بي:</strong> يعرض بيانات ومعلومات المستثمر المرتبطة بحساب التداول.</li>
                </ul>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h5 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
                    <i class="fa-solid fa-user-shield" style="color:#2563eb;"></i> جهة اتصال موثوقة (Trusted Contact):
                </h5>
                <p style="font-size:0.85rem; color:#475569; margin:0; line-height:1.6;">
                    <strong>إدارة جهة الاتصال الموثوقة:</strong> جهة يتم تحديدها للتواصل معها في الحالات المهمة أو الطارئة المتعلقة بالحساب، على أن يكون عمر جهة الاتصال الموثوقة <strong>18 سنة فأكثر</strong> (بدون أي صلاحية تداول).
                </p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h5 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
                    <i class="fa-solid fa-id-card-clip" style="color:#059669;"></i> إدارة الاشتراك:
                </h5>
                <p style="font-size:0.85rem; color:#475569; margin:0; line-height:1.6;">
                    يتيح لك تفعيل أو إيقاف أو تعديل اشتراكك في خدمة التداول ودفع رسوم التجديد الشهرية.
                </p>
            </div>

            <div style="background:#fef2f2; border:1px solid #fecdd3; border-radius:12px; padding:16px;">
                <h5 style="font-size:0.92rem; font-weight:800; color:#991b1b; margin:0 0 6px 0;">
                    <i class="fa-solid fa-user-xmark" style="color:#dc2626;"></i> إغلاق حساب التداول:
                </h5>
                <p style="font-size:0.84rem; color:#7f1d1d; margin:0; line-height:1.6;">
                    خيار يتيح لك طلب إغلاق حساب التداول بشكل نهائي وفق الإجراءات المعتمدة (بشرط ألا يكون هناك أي أموال داخل الحساب سواء كان نقد متاح، النقد، القيمة السوقية للأسهم). ولن تتمكن من استخدام الحساب أو الوصول إلى معلومات حسابك بشكل نهائي بعد إغلاقه، ويمكنك إعادة إنشاء حساب مرة أخرى باستخدام بريد إلكتروني جديد غير مستخدم مسبقاً، وتظهر حالة الحساب عند الدخول إلى خدمة الأسهم في حساب زين كاش بأنه "مغلق".
                </p>
            </div>
        </div>

        <!-- SIPC Protection Box -->
        <div style="background:#f0fdf4; border-right:4px solid #16a34a; border-radius:12px; padding:18px;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#166534; margin:0 0 8px 0;">
                <i class="fa-solid fa-shield-halved"></i> حماية المستثمر (SIPC)
            </h4>
            <p style="font-size:0.9rem; color:#14532d; margin:0 0 10px 0; line-height:1.7;">
                حسابك التداولي لدى شركة الوساطة مشمول بحماية مؤسسة حماية مستثمري الأوراق المالية (SIPC) حتى <strong>500,000 دولار أمريكي</strong>، منها حد أقصى <strong>250,000 دولار</strong> للنقد.
            </p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
                <div style="background:#ffffff; border:1px solid #bbf7d0; border-radius:8px; padding:12px; font-size:0.85rem; color:#166534;">
                    <strong>✅ تشمل الحماية:</strong> إفلاس أو تعثر شركة الوساطة، مع المساعدة في استرداد الأسهم والأموال الموجودة في الحساب ضمن حدود التغطية.
                </div>
                <div style="background:#ffffff; border:1px solid #bbf7d0; border-radius:8px; padding:12px; font-size:0.85rem; color:#991b1b;">
                    <strong>❌ لا تشمل الحماية:</strong> خسائر التداول الناتجة عن انخفاض أو ارتفاع أسعار الأسهم، حيث تُعد جزءاً من مخاطر التداول الطبيعية ولا يتم تعويضها.
                </div>
            </div>
        </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 7: FINANCIAL TERMS DICTIONARY (22 TERMS) -->
    <!-- ========================================================================= -->
    <section id="sec-7" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:24px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #f1f5f9; padding-bottom:12px; margin-bottom:18px;">
            <span style="background:#0f172a; color:#ffffff; font-weight:900; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center;">7</span>
            <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">قاموس المصطلحات المالي الشامل للتداول</h2>
        </div>

        <table class="kb-table" style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff; text-align:right;">
                    <th style="padding:10px 14px; border:1px solid #334155; width:25%;">المصطلح (عربي)</th>
                    <th style="padding:10px 14px; border:1px solid #334155; width:28%;">English</th>
                    <th style="padding:10px 14px; border:1px solid #334155;">التعريف المبسّط</th>
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
                    <td style="padding:10px 14px; border:1px solid #e2e8f0;">رمز مختصر للشركة (مثلاً أبل = AAPL).</td>
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

    <!-- ========================================================================= -->
    <!-- SECTION 8: GENERAL INFORMATION & EDGE CASES -->
    <!-- ========================================================================= -->
    <section id="sec-8" style="background:#ffffff; border:2px solid #4f46e5; border-radius:20px; padding:26px; margin-bottom:20px; box-shadow:0 8px 25px rgba(79,70,229,0.08); position:relative; overflow:hidden;">
        
        <div style="position:absolute; top:0; right:0; background:#4f46e5; color:#ffffff; padding:5px 20px; border-bottom-left-radius:14px; font-size:0.8rem; font-weight:800; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-circle-info"></i> معلومات عامة وحالات خاصة
        </div>

        <div style="display:flex; align-items:center; gap:12px; border-bottom:2px solid #e0e7ff; padding-bottom:14px; margin-bottom:20px; margin-top:10px;">
            <span style="background:linear-gradient(135deg, #4f46e5, #4338ca); color:#ffffff; font-weight:900; width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; box-shadow:0 3px 10px rgba(79,70,229,0.3);">8</span>
            <div>
                <h2 style="font-size:1.35rem; font-weight:900; color:#1e1b4b; margin:0;">معلومات عامة وحالات خاصة</h2>
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
`;

// List of KB articles:
// 1 Master comprehensive guide + 8 topic-specific articles
const kbList = [
    {
        id: 1,
        title: "الدليل الشامل المتكامل لخدمة تداول الأسهم الأمريكية عبر زين كاش",
        category: "الأسهم والتداول",
        icon: "fa-chart-line",
        keywords: "تداول, اسهم, أسهم, امريكية, بورصة, وساطة, البورصة, Alpaca, SIPC, SEC, شروط, تسجيل, ايداع, سحب, اوامر, بيع, شراء, ربح, خسارة, مصطلحات",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "تداول الأسهم الأمريكية",
        content: masterContentHtml
    }
];

// Write to db.json
let db = {};
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
    db = JSON.parse(clean);
} catch(e) {
    console.error("Could not read db.json", e);
}

db.knowledgeBase = kbList;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
console.log("Updated db.json with Master KB article.");

// Write to kb-data.js
const kbDataJsContent = `const EMBEDDED_KB_DATA = ${JSON.stringify(kbList, null, 2)};

if (typeof window !== 'undefined') {
    window.EMBEDDED_KB_DATA = EMBEDDED_KB_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMBEDDED_KB_DATA;
}
`;

fs.writeFileSync(kbDataPath, kbDataJsContent, 'utf8');
console.log("Updated kb-data.js successfully.");
