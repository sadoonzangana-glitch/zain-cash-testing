const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const extractedDataPath = path.join(__dirname, 'data_kb_extracted.json');
const kbDataJsPath = path.join(__dirname, 'kb-data.js');
const dbPath = path.join(__dirname, 'database.sqlite');

const extractedItems = JSON.parse(fs.readFileSync(extractedDataPath, 'utf8'));

// Map of category info & styling
const fileMetadata = {
    "CC KB Stock  .docx": {
        id: 1,
        title: "الدليل الشامل المتكامل لخدمة تداول الأسهم الأمريكية عبر زين كاش",
        category: "الأسهم والتداول",
        icon: "fa-chart-line",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "تداول الأسهم الأمريكية",
        keywords: "تداول, اسهم, أسهم, امريكية, بورصة, وساطة, البورصة, Alpaca, SIPC, SEC, شروط, تسجيل, ايداع, سحب, اوامر, بيع, شراء, ربح, خسارة, مصطلحات"
    },
    "خدمات وتحديات محفظة الافراد.docx": {
        id: 2,
        title: "دليل خدمات وتحديات محفظة الأفراد الشامل (التسجيل، العمليات، والمشاكل التقنية)",
        category: "محفظة الأفراد",
        icon: "fa-user",
        correctDisp: "محفظة الأفراد",
        correctSubDisp: "خدمات وتحديات الأفراد",
        keywords: "افراد, محفظة, تسجيل, مستمسكات, رقم سري, تعديل, اغلاق, رمز سري, سحب, ايداع, تحويل, ويسترن يونيون, ماستر كارد, والت كارد"
    },
    "خدمات محفظة الوكلاء.docx": {
        id: 3,
        title: "دليل خدمات وتحديات محفظة الوكلاء (Agent Wallet Guide)",
        category: "محفظة الوكلاء",
        icon: "fa-store",
        correctDisp: "محفظة الوكلاء",
        correctSubDisp: "خدمات الوكلاء",
        keywords: "وكيل, وكلاء, محفظة الوكيل, شحن, سحب, ايداع, رصيد وكيل, عمولة, عمولات, تصريف, سندات, نقاط بيع"
    },
    "خدمات محفظة الاعمال.docx": {
        id: 4,
        title: "دليل خدمات محفظة الأعمال والشركات (Business Wallet)",
        category: "محفظة الأعمال",
        icon: "fa-briefcase",
        correctDisp: "محفظة الأعمال",
        correctSubDisp: "خدمات الأعمال",
        keywords: "اعمال, شركات, محفظة اعمال, رواتب, تجار, بوابة دفع, صرف جماعي, شركات تحصيل"
    },
    "تحديات محفظة الاعمال.docx": {
        id: 5,
        title: "تحديات وحلول محفظة الأعمال والشركات (Business Troubleshooting)",
        category: "محفظة الأعمال",
        icon: "fa-triangle-exclamation",
        correctDisp: "محفظة الأعمال",
        correctSubDisp: "تحديات الأعمال",
        keywords: "مشاكل الاعمال, رفض الاعمال, تأخير قبول, بوابة دفع عطل, رفع تذكرة اعمال"
    },
    "التحديثات اليومية.xlsx": {
        id: 6,
        title: "سجل التحديثات اليومية والتعليمات التشغيلية لخدمة العملاء",
        category: "التحديثات اليومية والتعاميم",
        icon: "fa-newspaper",
        correctDisp: "التعاميم والتحديثات",
        correctSubDisp: "التحديثات اليومية",
        keywords: "تحديثات, يومية, تعليمات, تعاميم, واتساب بوت, بوت, اجراءات جديدة, اخر الاخبار"
    },
    "الحدود والرسوم.xlsx": {
        id: 7,
        title: "جدول الحدود والرسوم والعمولات الشامل لكافة محافظ وبطاقات زين كاش",
        category: "الحدود والرسوم",
        icon: "fa-calculator",
        correctDisp: "الحدود والرسوم",
        correctSubDisp: "رسوم العمليات والحدود",
        keywords: "حدود, رسوم, عمولات, سقف المحفظة, الحد اليومي, الحد الشهري, عمولة السحب, عمولة التحويل, ماستر كارد"
    },
    "التصنيفات الجديدة.xlsx": {
        id: 8,
        title: "دليل تصنيفات المكالمات والتذاكر المعتمد (Dispositions & Categories)",
        category: "خدمة العملاء وأنظمة العمل",
        icon: "fa-tags",
        correctDisp: "تصنيفات الخدمة",
        correctSubDisp: "التصنيف والترميز",
        keywords: "تصنيفات, ديسبوزيشن, Disposition, Sub Disposition, تصنيف المكالمات, تذاكر, كول سنتر"
    },
    "Ameyo System User guide CC .docx": {
        id: 9,
        title: "دليل استخدام نظام خدمة العملاء Ameyo (نظام الاتصال والتذاكر والتحويل)",
        category: "أنظمة خدمة العملاء",
        icon: "fa-headset",
        correctDisp: "خدمة العملاء",
        correctSubDisp: "نظام Ameyo",
        keywords: "Ameyo, اميو, اتصال, كتم, تحويل, تذاكر, Ticket, Queue, Priority, اتصال مباشر, تصنيف المكالمة"
    },
    "Investing Utilities Portal.docx": {
        id: 10,
        title: "دليل بوابة Investing Utilities Portal لإدارة حسابات التداول والاستثمار",
        category: "الأسهم والتداول",
        icon: "fa-laptop-code",
        correctDisp: "الأسهم والتداول",
        correctSubDisp: "بوابة Investing Portal",
        keywords: "Investing Portal, يوتيليتيز, بوابة الاستثمار, حساب تداول, ارصدة, الغاء اوامر, سحب, اشتراك"
    },
    "برنامج ال Utilities واستخداماته.docx": {
        id: 11,
        title: "دليل نظام الـ Utilities المعتمد واستخداماته التشغيلية في خدمة العملاء",
        category: "أنظمة خدمة العملاء",
        icon: "fa-toolbox",
        correctDisp: "خدمة العملاء",
        correctSubDisp: "نظام Utilities",
        keywords: "Utilities, يوتيليتيز, تدقيق رصيد, اعادة رمز سري, فك حظر, حالة المحفظة, عمليات"
    },
    "دليل السياسات والاجراءات.docx": {
        id: 12,
        title: "دليل السياسات والإجراءات والتعامل مع المشتركين غير الراضين والمسيئين",
        category: "السياسات والإجراءات",
        icon: "fa-scale-balanced",
        correctDisp: "السياسات",
        correctSubDisp: "إجراءات التعامل والشكاوى",
        keywords: "سياسات, اجراءات, مشترك غير راضي, اساءة لفظية, تصعيد, انهاء مكالمة, حظر"
    },
    "دليل الشكاوي.docx": {
        id: 13,
        title: "دليل إجراءات الشكاوى على مقرات وموظفي الشركة وخدمة العملاء",
        category: "السياسات والإجراءات",
        icon: "fa-file-circle-exclamation",
        correctDisp: "الشكاوى",
        correctSubDisp: "شكاوى المقرات والموظفين",
        keywords: "شكوى, شكاوى, مقرات, فروع, موظف, اساءة, تذكرة شكوى, اعتذار"
    },
    "دليل التوعية.docx": {
        id: 14,
        title: "دليل التوعية التقنية وحل مشاكل أجهزة وتطبيقات المشتركين",
        category: "التوعية والدعم التقني",
        icon: "fa-shield-halved",
        correctDisp: "الدعم التقني",
        correctSubDisp: "توعية المشترك",
        keywords: "توعية, اصدار التطبيق, نظام التشغيل, مسح التخزين المؤقت, تحديث التطبيق, اندرويد, ايفون"
    },
    "Wallet profile.xlsx": {
        id: 15,
        title: "دليل أنواع وملفات المحافظ والخدمات المتاحة لكل نوع (Wallet Profiles)",
        category: "محفظة الأفراد",
        icon: "fa-address-card",
        correctDisp: "أنواع المحافظ",
        correctSubDisp: "ملف المحفظة والخدمات",
        keywords: "Wallet profile, بروفايل, Basic Wallet, Standard, Premium, رواتب, خدمات متاحة"
    },
    "Ros.xlsx": {
        id: 16,
        title: "دليل فروع ومقرات ومراكز خدمة زين كاش وزين العراق الرئيسية وساعات العمل",
        category: "الفروع ومواقع الخدمة",
        icon: "fa-map-location-dot",
        correctDisp: "الفروع والمواقع",
        correctSubDisp: "عناوين المراكز وساعات العمل",
        keywords: "فروع, مواقع, مقرات, مراكز خدمة, ROS, حي الجامعة, المنصور, البصرة, اربيل, ساعات الدوام"
    },
    "Zaincash Offers.docx": {
        id: 17,
        title: "دليل عروض وخصومات وحملات الكاش باك من زين كاش",
        category: "العروض والمكافآت",
        icon: "fa-gift",
        correctDisp: "العروض",
        correctSubDisp: "عروض الكاش باك",
        keywords: "عروض, طلبات, كاش باك, خصومات, مطاعم, سينما, تسوق, 20%, استرداد نقدي"
    },
    "Copy of Notification Master Data & Reporting.xlsx": {
        id: 18,
        title: "دليل إشعارات المعاملات وقنوات التنبيه للمشتركين والوكلاء (Notifications Master)",
        category: "الأنظمة والتقارير",
        icon: "fa-bell",
        correctDisp: "الإشعارات",
        correctSubDisp: "قنوات التنبيه والإشعارات",
        keywords: "اشعارات, رسائل, SMS, App Notification, Hybrid, تنبيهات, احصائيات"
    },
    "فيديوهات التوضيحية.xlsx": {
        id: 19,
        title: "دليل روابط الفيديوهات التوضيحية وشروحات استخدام زين كاش",
        category: "الفيديوهات التوضيحية والشروحات",
        icon: "fa-video",
        correctDisp: "الشروحات",
        correctSubDisp: "فيديوهات اليوتيوب",
        keywords: "فيديوهات, شروحات, يوتيوب, فيديو توضيحي, تسجيل محفظة, تفعيل ماستر كارد"
    },
    "Project Select System.pdf": {
        id: 20,
        title: "دليل نظام Project Select System",
        category: "الأنظمة والتقارير",
        icon: "fa-project-diagram",
        correctDisp: "الأنظمة",
        correctSubDisp: "Project Select",
        keywords: "Project Select, مشاريع, نظام"
    }
};

function formatContentToHtml(rawText, title, category) {
    // Break into clean paragraphs / sections
    const cleanLines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let html = `
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:18px; margin-bottom:22px; box-shadow: 0 8px 20px rgba(15,23,42,0.12); border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
            <span style="background:rgba(255,153,0,0.2); color:#ff9900; border:1px solid rgba(255,153,0,0.4); padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:800;">
                <i class="fa-solid fa-check-circle"></i> وثيقة رسمية معتمدة من ملفات الشركة المحدثة
            </span>
            <span style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">
                ${category}
            </span>
        </div>
        <h1 style="font-size:1.5rem; font-weight:900; margin:0 0 8px 0; color:#f8fafc; line-height:1.4;">
            ${title}
        </h1>
        <p style="font-size:0.88rem; color:#cbd5e1; margin:0; line-height:1.6;">
            محتوى تفصيلي مستخرج ومحدث بالكامل من قاعدة معرفة زين كاش لخدمة العملاء والعمليات.
        </p>
    </div>

    <!-- Body Content -->
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:22px; box-shadow:0 3px 12px rgba(0,0,0,0.03);">
`;

    let insideTable = false;
    let tableRows = [];

    for (let i = 0; i < cleanLines.length; i++) {
        let line = cleanLines[i];

        // Check if table row with |
        if (line.includes('|')) {
            const cols = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
            if (cols.length >= 2) {
                if (!insideTable) {
                    insideTable = true;
                    tableRows = [];
                }
                tableRows.push(cols);
                continue;
            }
        }

        // If we were in table and hit non-table line, render table
        if (insideTable) {
            html += renderTableHtml(tableRows);
            insideTable = false;
            tableRows = [];
        }

        // Check if line looks like a major header
        if (line.length < 80 && (line.endsWith(':') || line.startsWith('●') || line.startsWith('■') || line.startsWith('خطوات') || line.startsWith('شروط') || line.startsWith('كيفية') || line.startsWith('الاجراء') || line.startsWith('الهدف') || line.startsWith('المتطلبات') || line.startsWith('🔶'))) {
            html += `
        <div style="background:#f8fafc; border-right:4px solid #2563eb; border-radius:10px; padding:12px 16px; margin:18px 0 10px 0;">
            <h3 style="font-size:1.05rem; font-weight:800; color:#1e3a8a; margin:0;">
                <i class="fa-solid fa-circle-dot" style="color:#2563eb; font-size:0.8rem;"></i> ${line.replace(/^[:●■🔶\s]+/, '').trim()}
            </h3>
        </div>`;
        } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('○')) {
            html += `
        <div style="display:flex; gap:10px; align-items:flex-start; margin:6px 0; padding-right:8px; font-size:0.92rem; color:#334155; line-height:1.7;">
            <span style="color:#2563eb; font-weight:bold;">•</span>
            <div>${line.replace(/^[-•*○\s]+/, '').trim()}</div>
        </div>`;
        } else if (/^\d+[\.\-\)]\s/.test(line)) {
            const num = line.match(/^(\d+)[\.\-\)]/)[1];
            const text = line.replace(/^\d+[\.\-\)]\s*/, '').trim();
            html += `
        <div style="display:flex; gap:10px; align-items:flex-start; margin:8px 0; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; font-size:0.92rem; color:#1e293b; line-height:1.6;">
            <span style="background:#2563eb; color:#ffffff; font-weight:800; width:24px; height:24px; min-width:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem;">${num}</span>
            <div style="flex:1;">${text}</div>
        </div>`;
        } else {
            html += `
        <p style="font-size:0.93rem; color:#334155; line-height:1.8; margin:10px 0;">
            ${line}
        </p>`;
        }
    }

    if (insideTable) {
        html += renderTableHtml(tableRows);
    }

    html += `
    </div>
</div>
`;
    return html;
}

function renderTableHtml(rows) {
    if (!rows || rows.length === 0) return '';
    let out = `
    <div style="overflow-x:auto; margin:18px 0; border:1px solid #cbd5e1; border-radius:12px;">
        <table style="width:100%; border-collapse:collapse; text-align:right; font-size:0.88rem;">
            <thead>
                <tr style="background:#0f172a; color:#ffffff;">
`;
    const headers = rows[0];
    headers.forEach(h => {
        out += `                    <th style="padding:10px 14px; border:1px solid #334155; font-weight:700;">${h}</th>\n`;
    });
    out += `                </tr>
            </thead>
            <tbody>\n`;

    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const bg = r % 2 === 0 ? '#f8fafc' : '#ffffff';
        out += `                <tr style="background:${bg};">\n`;
        for (let c = 0; c < headers.length; c++) {
            const cell = row[c] || '';
            out += `                    <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#334155; line-height:1.5;">${cell}</td>\n`;
        }
        out += `                </tr>\n`;
    }

    out += `            </tbody>
        </table>
    </div>\n`;
    return out;
}

// Generate articles list
const articles = [];

extractedItems.forEach((item) => {
    const meta = fileMetadata[item.filename];
    if (!meta) return;

    // Use full rich html if stock guide, or format the raw extracted text cleanly
    let finalHtml = '';
    if (meta.id === 1 && item.full_content.length > 5000) {
        finalHtml = formatContentToHtml(item.full_content, meta.title, meta.category);
    } else {
        finalHtml = formatContentToHtml(item.full_content, meta.title, meta.category);
    }

    articles.push({
        id: meta.id,
        title: meta.title,
        category: meta.category,
        icon: meta.icon,
        keywords: meta.keywords,
        correctDisp: meta.correctDisp,
        correctSubDisp: meta.correctSubDisp,
        lastUpdated: new Date().toISOString().split('T')[0],
        content: finalHtml
    });
});

// Sort by ID
articles.sort((a, b) => a.id - b.id);

console.log(`Generated ${articles.length} Knowledge Base Articles!`);

// 1. Write to kb-data.js
const kbDataJsContent = `// Auto-generated Knowledge Base Data from D:\\KB Master Documents
const EMBEDDED_KB_DATA = ${JSON.stringify(articles, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMBEDDED_KB_DATA;
}
if (typeof window !== 'undefined') {
    window.EMBEDDED_KB_DATA = EMBEDDED_KB_DATA;
}
`;

fs.writeFileSync(kbDataJsPath, kbDataJsContent, 'utf8');
console.log(`Successfully wrote ${kbDataJsPath}`);

// 2. Update SQLite Database
try {
    const db = new Database(dbPath);
    const stmt = db.prepare(`
        INSERT INTO system_config (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    stmt.run('knowledgeBase', JSON.stringify(articles));
    console.log(`Successfully updated SQLite system_config for 'knowledgeBase' with ${articles.length} articles!`);
    db.close();
} catch (e) {
    console.error('Error updating SQLite DB:', e);
}
