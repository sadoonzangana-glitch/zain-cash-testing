import os
import sys
import json
import zipfile
import re
import sqlite3
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

KB_DIR = r'D:\KB'
PROJECT_DIR = r'c:\Users\kaka\Downloads\Test'
MEDIA_DIR = os.path.join(PROJECT_DIR, 'public', 'kb-media')
os.makedirs(MEDIA_DIR, exist_ok=True)
DB_PATH = os.path.join(PROJECT_DIR, 'database.sqlite')
KB_DATA_JS = os.path.join(PROJECT_DIR, 'kb-data.js')

print("Starting Full High-Fidelity Knowledge Base Generation...")

# 1. Extract and map media
image_map = {}
for f in os.listdir(KB_DIR):
    if f.endswith('.docx'):
        doc_path = os.path.join(KB_DIR, f)
        base = os.path.splitext(f)[0].strip()
        image_map[f] = []
        try:
            with zipfile.ZipFile(doc_path, 'r') as z:
                media_names = [m for m in z.namelist() if m.startswith('word/media/')]
                # sort naturally
                media_names.sort()
                for item in media_names:
                    img_filename = f"{base}_{os.path.basename(item)}"
                    out_path = os.path.join(MEDIA_DIR, img_filename)
                    with open(out_path, 'wb') as out_f:
                        out_f.write(z.read(item))
                    image_map[f].append(img_filename)
        except Exception as e:
            print(f"Error extracting images for {f}: {e}")

print(f"Extracted media files across all docx files.")

def format_article_html(title, category, paras, images=[], tables=[]):
    img_html = ""
    if images:
        img_html = '<div style="margin:20px 0; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:15px;">'
        for img in images:
            img_html += f'''
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:10px; text-align:center;">
                <img src="/public/kb-media/{img}" alt="{title}" style="max-width:100%; height:auto; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.08); margin-bottom:6px;" loading="lazy" />
                <div style="font-size:0.78rem; color:#64748b; font-weight:700;"><i class="fa-solid fa-camera"></i> صورة توضيحية من شاشة النظام</div>
            </div>'''
        img_html += '</div>'

    body_html = ""
    for p in paras:
        p_clean = p.strip()
        if not p_clean:
            continue
        
        # Heading-like
        if len(p_clean) < 80 and (
            p_clean.endswith(':') or p_clean.startswith('●') or p_clean.startswith('■') or 
            p_clean.startswith('خطوات') or p_clean.startswith('شروط') or p_clean.startswith('كيفية') or 
            p_clean.startswith('الاجراء') or p_clean.startswith('الهدف') or p_clean.startswith('المتطلبات') or 
            p_clean.startswith('الحالات') or p_clean.startswith('التعليمات') or p_clean.startswith('تحديات')
        ):
            clean_title = re.sub(r'^[:●■🔶\s]+', '', p_clean).strip()
            body_html += f'''
        <div style="background:#f8fafc; border-right:4px solid #2563eb; border-radius:10px; padding:10px 14px; margin:16px 0 8px 0;">
            <h4 style="font-size:1rem; font-weight:800; color:#1e3a8a; margin:0;">
                <i class="fa-solid fa-circle-dot" style="color:#2563eb; font-size:0.75rem;"></i> {clean_title}
            </h4>
        </div>'''
        elif p_clean.startswith('-') or p_clean.startswith('•') or p_clean.startswith('*') or p_clean.startswith('○'):
            item_text = re.sub(r'^[-•*○\s]+', '', p_clean).strip()
            body_html += f'''
        <div style="display:flex; gap:10px; align-items:flex-start; margin:6px 0; padding-right:8px; font-size:0.92rem; color:#334155; line-height:1.7;">
            <span style="color:#2563eb; font-weight:bold;">•</span>
            <div>{item_text}</div>
        </div>'''
        elif re.match(r'^\d+[\.\-\)]\s', p_clean):
            num = re.match(r'^(\d+)[\.\-\)]', p_clean).group(1)
            text = re.sub(r'^\d+[\.\-\)]\s*', '', p_clean).strip()
            body_html += f'''
        <div style="display:flex; gap:10px; align-items:flex-start; margin:8px 0; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; font-size:0.92rem; color:#1e293b; line-height:1.6;">
            <span style="background:#2563eb; color:#ffffff; font-weight:800; width:24px; height:24px; min-width:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem;">{num}</span>
            <div style="flex:1;">{text}</div>
        </div>'''
        elif 'ملاحظة' in p_clean or 'تنبيه' in p_clean or 'تحذير' in p_clean or 'مهم' in p_clean:
            body_html += f'''
        <div style="background:#fffbeb; border-right:4px solid #f59e0b; border-radius:10px; padding:12px 16px; margin:12px 0; font-size:0.9rem; color:#92400e; line-height:1.7;">
            <strong>⚠️ {p_clean}</strong>
        </div>'''
        else:
            body_html += f'''
        <p style="font-size:0.93rem; color:#334155; line-height:1.8; margin:8px 0;">
            {p_clean}
        </p>'''

    # Render any tables
    for tbl in tables:
        if tbl and len(tbl) > 0:
            headers = tbl[0]
            body_html += '<div style="overflow-x:auto; margin:16px 0; border:1px solid #cbd5e1; border-radius:10px;"><table style="width:100%; border-collapse:collapse; text-align:right; font-size:0.88rem;">'
            body_html += '<thead style="background:#0f172a; color:#fff;"><tr>'
            for h in headers:
                body_html += f'<th style="padding:10px 12px; border:1px solid #334155;">{h}</th>'
            body_html += '</tr></thead><tbody>'
            for r_idx, row in enumerate(tbl[1:]):
                bg = '#f8fafc' if r_idx % 2 == 0 else '#ffffff'
                body_html += f'<tr style="background:{bg};">'
                for c_idx, cell in enumerate(row):
                    body_html += f'<td style="padding:10px 12px; border:1px solid #e2e8f0; color:#334155;">{cell}</td>'
                body_html += '</tr>'
            body_html += '</tbody></table></div>'

    html = f'''
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.8; direction:rtl; text-align:right;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:22px; border-radius:16px; margin-bottom:20px; box-shadow: 0 8px 20px rgba(15,23,42,0.12); border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
            <span style="background:rgba(255,153,0,0.2); color:#ff9900; border:1px solid rgba(255,153,0,0.4); padding:3px 12px; border-radius:20px; font-size:0.75rem; font-weight:800;">
                <i class="fa-solid fa-check-circle"></i> دليل معتمد رسمي 100%
            </span>
            <span style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:3px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">
                {category}
            </span>
        </div>
        <h2 style="font-size:1.4rem; font-weight:900; margin:0 0 6px 0; color:#f8fafc; line-height:1.4;">
            {title}
        </h2>
    </div>
    {img_html}
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; box-shadow:0 3px 10px rgba(0,0,0,0.02);">
        {body_html}
    </div>
</div>'''
    return html

all_articles = []
current_id = 1

# -------------------------------------------------------------
# 1. PROCESS خدمات وتحديات محفظة الافراد.docx (Split by logical sections)
# -------------------------------------------------------------
indiv_path = os.path.join(KB_DIR, 'خدمات وتحديات محفظة الافراد.docx')
with zipfile.ZipFile(indiv_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)
    
    sections = []
    current_sec = {'title': 'تسجيل محفظة زين كاش والشروط والمستمسكات', 'paras': []}
    
    section_markers = [
        ('تسجيل محفظة', 'تسجيل محفظة زين كاش والشروط والمستمسكات'),
        ('تحديات تسجيل محفظة', 'تحديات تسجيل محفظة زين كاش ومشاكل الشاشة البيضاء والسيستم'),
        ('تسجيل الدخول للمحفظة', 'تسجيل الدخول للمحفظة والخطوات المعتمدة'),
        ('تحديات تسجيل دخول المحفظة', 'تحديات تسجيل الدخول للمحفظة ومشاكل الجهاز والرمز'),
        ('إعادة تعيين وتغيير الرمز السري لمحفظه زين كاش', 'إعادة تعيين وتغيير الرمز السري PIN لمحفظة زين كاش'),
        ('كيفية إعادة تعيين الرمز السري من قبل خدمة العملاء', 'إجراءات خدمة العملاء لإعادة تعيين وتوليد الرمز السري'),
        ('تعبئة المحفظة', 'تعبئة وتغذية المحفظة (الوكلاء، الحساب المصرفي، البطاقات)'),
        ('تحديات التعبئة  من خلال الوكيل', 'تحديات التعبئة من خلال الوكيل ومشاكل الاستقطاع'),
        ('تحديات التعبئة من الحساب المصرفي', 'تحديات التعبئة من الحساب المصرفي (المصرف الأهلي العراقي)'),
        ('تحويل واستلام الاموال محلي', 'تحويل واستلام الأموال محلياً بين محافظ زين كاش'),
        ('في حال قيام المشترك بتحويل الأموال بشكل خاطئ', 'إجراءات استرجاع الأموال عند التحويل الخاطئ بين المحافظ'),
        ('تحويل الاموال الى محافظ اخرى', 'تحويل الأموال إلى محافظ إلكترونية أخرى وتحديات الاستقطاع'),
        ('سحب الأموال من محفظة زين كاش ( سحب نقدي )', 'سحب الأموال نقداً من محفظة زين كاش (وكلاء وصراف آلي)'),
        ('سحب الاموال الى محفظة وكيل بشكل خاطئ', 'إجراءات معالجة السحب الخاطئ إلى محفظة الوكيل'),
        ('سحب الاموال من محافظ الاشخاص المتوفين', 'إجراءات سحب وتصفية أموال محافظ الأشخاص المتوفين'),
        ('الدفع الى التجار (مزودي الخدمة)', 'الدفع إلى التجار وبوابات الدفع الإلكتروني ومشاكل استقطاع الرصيد للمواقع'),
        ('دفع الفواتير', 'دفع الفواتير (الكهرباء، الماء، صندوق الإسكان، المصرف العقاري)'),
        ('البطاقات الإلكترونية', 'شراء البطاقات الإلكترونية (الألعاب والتطبيقات) وحلول المشاكل'),
        ('بطاقة الماستر كارد (كلاسيك / بلاتينيوم )', 'دليل بطاقة ماستركارد زين كاش (والت كارد، كلاسيك، بلاتينيوم) والتفعيل'),
        ('سحب الاموال من الصرافات داخل وخارج العراق.', 'استخدام بطاقة الماستركارد والسحب من الصرافات ATM محلياً ودولياً'),
        ('تحديات بطاقة الماستر كارد (كلاسيك /بلاتينيوم)', 'تحديات بطاقة ماستركارد (رفض الدفع، العمليات الدولية، كوكل بلي)'),
        ('تحديات التعبئة والتحويل من وإلى بطاقة الماستر كارد', 'تحديات التعبئة والتحويل لبطاقة الماستركارد واستقطاع الرصيد'),
        ('ويسترن يونيون', 'دليل خدمة ويسترن يونيون الشامل (إرسال واستلام الحوالات الدولية)'),
        ('تحديات اضافة مستفيد جديد في خدمة ويسترن يونيون', 'تحديات ويسترن يونيون (إضافة مستفيد، حوالة معلقة، استرداد الحوالة)'),
        ('تعبئة رصيد هاتفك', 'شحن الرصيد وباقات الإنترنت لخطوط الهاتف (زين، آسيا، كورك)'),
        ('إدارة الحسابات المصرفية (المصرف الاهلي العراقي)', 'ربط وإدارة الحسابات المصرفية (المصرف الأهلي العراقي NBI)'),
        ('تاريخ المعاملات المالية ( معاملاتي )', 'تاريخ المعاملات وكشف الحساب المالي للمحفظة'),
        ('حالات الاحتيال', 'حالات الاحتيال ومكافحة سرقة الحسابات والروابط الوهمية'),
        ('أسئلة الأمان لمحافظ الأفراد', 'أسئلة الأمان وضوابط التحقق من هوية المشترك (Security Questions)')
    ]
    
    for p in body.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        p_text = ''.join(texts).strip()
        if not p_text:
            continue
        
        matched_title = None
        for marker, new_title in section_markers:
            if p_text == marker or (len(p_text) < 70 and p_text.startswith(marker)):
                matched_title = new_title
                break
        
        if matched_title:
            if len(current_sec['paras']) > 0:
                sections.append(current_sec)
            current_sec = {'title': matched_title, 'paras': []}
        else:
            current_sec['paras'].append(p_text)
            
    if len(current_sec['paras']) > 0:
        sections.append(current_sec)

for s in sections:
    # keywords generation
    kws = f"{s['title']}, محفظة, زين كاش, افراد, مشترك, رصيد, تطبيق"
    if 'تسجيل' in s['title']:
        kws += ", فتح محفظة, مستمسكات, هوية, بطاقة سكن, شاشة بيضاء, عقد"
    if 'رمز' in s['title'] or 'pin' in s['title'].lower():
        kws += ", رمز سري, ناسي الرمز, تغيير الرمز, pin, otp, رسالة نصية, فورم"
    if 'تعبئة' in s['title']:
        kws += ", ايداع, شحن المحفظة, وكيل, ماستر كارد, بنك, اهلي"
    if 'سحب' in s['title']:
        kws += ", سحب نقدي, كاش اوت, صراف الي, atm, وكيل, متوفين"
    if 'تحويل' in s['title']:
        kws += ", ارسال اموال, تحويل خاطئ, استرجاع, حوالة محفظة, استقطاع"
    if 'تجار' in s['title'] or 'دفع' in s['title']:
        kws += ", بوابة دفع, دفع الكتروني, موقع, متجر, استقطع وموصل, تاجر, payment gateway, qr"
    if 'ماستر' in s['title'] or 'بلاتينيوم' in s['title']:
        kws += ", ماستر كارد, والت كارد, بلاتينيوم, كلاسيك, cvv, صراف, كوكل بلي, شراء اونلاين"
    if 'ويسترن' in s['title']:
        kws += ", western union, ويسترن يونيون, mtcn, حوالة دولية, مستفيد, استرداد, معلقة"
    if 'فواتير' in s['title']:
        kws += ", كهرباء, ماء, صندوق الاسكان, عقاري, فاتورة, تسديد"
    if 'رصيد' in s['title']:
        kws += ", شحن رصيد, كارت, كورك, اسيا, باقة انترنت"
        
    imgs = image_map.get('خدمات وتحديات محفظة الافراد.docx', []) if 'ماستر' in s['title'] or 'تسجيل' in s['title'] else []
    
    html = format_article_html(s['title'], "محفظة الأفراد", s['paras'], images=imgs)
    all_articles.append({
        "id": current_id,
        "title": s['title'],
        "category": "محفظة الأفراد",
        "icon": "fa-user",
        "keywords": kws,
        "correctDisp": "محفظة الأفراد",
        "correctSubDisp": s['title'][:30],
        "lastUpdated": "2026-09-19",
        "content": html
    })
    current_id += 1

print(f"Processed Individuals: {len(sections)} modular articles generated.")

# -------------------------------------------------------------
# 2. CC KB Stock  .docx (US Stocks Guide)
# -------------------------------------------------------------
stock_path = os.path.join(KB_DIR, 'CC KB Stock  .docx')
with zipfile.ZipFile(stock_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    paras = [p for p in paras if p]

stock_imgs = image_map.get('CC KB Stock  .docx', [])
html_stock = format_article_html("الدليل الشامل المتكامل لخدمة تداول الأسهم الأمريكية عبر زين كاش (Alpaca & SEC)", "الأسهم والتداول", paras, images=stock_imgs)
all_articles.append({
    "id": current_id,
    "title": "الدليل الشامل المتكامل لخدمة تداول الأسهم الأمريكية عبر زين كاش (Alpaca & SEC)",
    "category": "الأسهم والتداول",
    "icon": "fa-chart-line",
    "keywords": "تداول, اسهم, أسهم, امريكية, بورصة, وساطة, البورصة, Alpaca, SIPC, SEC, شروط, تسجيل, ايداع, سحب, اوامر, بيع, شراء, ربح, خسارة, مصطلحات, 5000 دينار, اشتراك شهري",
    "correctDisp": "الأسهم والتداول",
    "correctSubDisp": "تداول الأسهم الأمريكية",
    "lastUpdated": "2026-09-19",
    "content": html_stock
})
current_id += 1

# -------------------------------------------------------------
# 3. Investing Utilities Portal.docx
# -------------------------------------------------------------
inv_path = os.path.join(KB_DIR, 'Investing Utilities Portal.docx')
with zipfile.ZipFile(inv_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    paras = [p for p in paras if p]

inv_imgs = image_map.get('Investing Utilities Portal.docx', [])
html_inv = format_article_html("دليل بوابة Investing Utilities Portal لإدارة حسابات التداول والاستثمار ومتابعة العمليات", "الأسهم والتداول", paras, images=inv_imgs)
all_articles.append({
    "id": current_id,
    "title": "دليل بوابة Investing Utilities Portal لإدارة حسابات التداول والاستثمار ومتابعة العمليات",
    "category": "الأسهم والتداول",
    "icon": "fa-laptop-code",
    "keywords": "Investing Portal, يوتيليتيز, بوابة الاستثمار, حساب تداول, ارصدة, الغاء اوامر, سحب, اشتراك, تداول, متابعة",
    "correctDisp": "الأسهم والتداول",
    "correctSubDisp": "بوابة Investing Portal",
    "lastUpdated": "2026-09-19",
    "content": html_inv
})
current_id += 1

# -------------------------------------------------------------
# 4. Ameyo System User guide CC .docx (Customer Care Phone & Tickets)
# -------------------------------------------------------------
ameyo_path = os.path.join(KB_DIR, 'Ameyo System User guide CC .docx')
with zipfile.ZipFile(ameyo_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    paras = [p for p in paras if p]

ameyo_imgs = image_map.get('Ameyo System User guide CC .docx', [])
# Split into 2 articles for Ameyo: 1) Call Handling & Disposition, 2) Tickets & Queues
ameyo_part1 = [p for p in paras if 'تذكرة' not in p and 'Ticket' not in p and 'Queue' not in p]
ameyo_part2 = [p for p in paras if 'تذكرة' in p or 'Ticket' in p or 'Queue' in p or 'رفع طلب' in p or 'تدقيق' in p]

html_ameyo1 = format_article_html("دليل نظام Ameyo: استقبال وتصنيف المكالمات والكتم والتحويل (WebRTC)", "أنظمة خدمة العملاء", ameyo_part1 if ameyo_part1 else paras, images=ameyo_imgs[:10])
all_articles.append({
    "id": current_id,
    "title": "دليل نظام Ameyo: استقبال وتصنيف المكالمات والكتم والتحويل (WebRTC)",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-headset",
    "keywords": "Ameyo, اميو, اتصال, كتم, تحويل, تصنيف المكالمة, Disposition, WebRTC, كول سنتر, خدمة العملاء",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "نظام Ameyo - المكالمات",
    "lastUpdated": "2026-09-19",
    "content": html_ameyo1
})
current_id += 1

html_ameyo2 = format_article_html("دليل نظام Ameyo: رفع ومتابعة تذاكر الشكاوى والصفوف (Tickets, Queues & Priorities)", "أنظمة خدمة العملاء", ameyo_part2 if ameyo_part2 else paras, images=ameyo_imgs[10:])
all_articles.append({
    "id": current_id,
    "title": "دليل نظام Ameyo: رفع ومتابعة تذاكر الشكاوى والصفوف (Tickets, Queues & Priorities)",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-ticket",
    "keywords": "Ameyo, تذاكر, Ticket, Queue, Priority, High, Medium, New Request, رفع طلب, شكوى, متابعة تذكرة",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "نظام Ameyo - التذاكر",
    "lastUpdated": "2026-09-19",
    "content": html_ameyo2
})
current_id += 1

# -------------------------------------------------------------
# 5. برنامج ال Utilities واستخداماته.docx
# -------------------------------------------------------------
util_path = os.path.join(KB_DIR, 'برنامج ال Utilities واستخداماته.docx')
with zipfile.ZipFile(util_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    paras = [p for p in paras if p]

util_imgs = image_map.get('برنامج ال Utilities واستخداماته.docx', [])
html_util = format_article_html("دليل برنامج الـ Utilities المعتمد واستخداماته التشغيلية في خدمة العملاء (فحص المحفظة والرمز السري)", "أنظمة خدمة العملاء", paras, images=util_imgs)
all_articles.append({
    "id": current_id,
    "title": "دليل برنامج الـ Utilities المعتمد واستخداماته التشغيلية في خدمة العملاء (فحص المحفظة والرمز السري)",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-toolbox",
    "keywords": "Utilities, يوتيليتيز, تدقيق رصيد, اعادة رمز سري, فك حظر, حالة المحفظة, عمليات, ارسالة رمز, استعلام",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "برنامج Utilities",
    "lastUpdated": "2026-09-19",
    "content": html_util
})
current_id += 1

# -------------------------------------------------------------
# 6. خدمات محفظة الاعمال.docx & تحديات محفظة الاعمال.docx
# -------------------------------------------------------------
biz_path = os.path.join(KB_DIR, 'خدمات محفظة الاعمال.docx')
biz_paras = []
if os.path.exists(biz_path):
    with zipfile.ZipFile(biz_path, 'r') as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        biz_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
        biz_paras = [p for p in biz_paras if p]

html_biz = format_article_html("دليل خدمات محفظة الأعمال والشركات وبوابة الدفع الإلكتروني وتوزيع الرواتب (Business Wallet & Payment Gateway)", "محفظة الأعمال", biz_paras)
all_articles.append({
    "id": current_id,
    "title": "دليل خدمات محفظة الأعمال والشركات وبوابة الدفع الإلكتروني وتوزيع الرواتب (Business Wallet & Payment Gateway)",
    "category": "محفظة الأعمال",
    "icon": "fa-briefcase",
    "keywords": "اعمال, شركات, محفظة اعمال, رواتب, تجار, بوابة دفع, صرف جماعي, شركات تحصيل, payment gateway, api, تاجر, اريد اسوي بوابة دفع, انشاء بوابة دفع",
    "correctDisp": "محفظة الأعمال",
    "correctSubDisp": "خدمات الأعمال وبوابة الدفع",
    "lastUpdated": "2026-09-19",
    "content": html_biz
})
current_id += 1

biz_chall_path = os.path.join(KB_DIR, 'تحديات محفظة الاعمال.docx')
biz_chall_paras = []
if os.path.exists(biz_chall_path):
    with zipfile.ZipFile(biz_chall_path, 'r') as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        biz_chall_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
        biz_chall_paras = [p for p in biz_chall_paras if p]

html_biz_chall = format_article_html("تحديات وحلول محفظة الأعمال والشركات (تأخير القبول، مشاكل بوابة الدفع، وتذاكر الدعم)", "محفظة الأعمال", biz_chall_paras)
all_articles.append({
    "id": current_id,
    "title": "تحديات وحلول محفظة الأعمال والشركات (تأخير القبول، مشاكل بوابة الدفع، وتذاكر الدعم)",
    "category": "محفظة الأعمال",
    "icon": "fa-triangle-exclamation",
    "keywords": "مشاكل الاعمال, رفض الاعمال, تأخير قبول, بوابة دفع عطل, رفع تذكرة اعمال, Ameyo Business, تذكرة اعمال",
    "correctDisp": "محفظة الأعمال",
    "correctSubDisp": "تحديات الأعمال",
    "lastUpdated": "2026-09-19",
    "content": html_biz_chall
})
current_id += 1

# -------------------------------------------------------------
# 7. خدمات محفظة الوكلاء.docx
# -------------------------------------------------------------
agent_path = os.path.join(KB_DIR, 'خدمات محفظة الوكلاء.docx')
with zipfile.ZipFile(agent_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    agent_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    agent_paras = [p for p in agent_paras if p]

agent_imgs = image_map.get('خدمات محفظة الوكلاء.docx', [])
html_agent = format_article_html("دليل خدمات وتحديات محفظة الوكلاء المعتمدين والعمليات المالية (Agent Wallet Guide)", "محفظة الوكلاء", agent_paras, images=agent_imgs)
all_articles.append({
    "id": current_id,
    "title": "دليل خدمات وتحديات محفظة الوكلاء المعتمدين والعمليات المالية (Agent Wallet Guide)",
    "category": "محفظة الوكلاء",
    "icon": "fa-store",
    "keywords": "وكيل, وكلاء, محفظة الوكيل, شحن, سحب, ايداع, رصيد وكيل, عمولة, عمولات, تصريف, سندات, نقاط بيع, تعبئة رصيد الوكيل",
    "correctDisp": "محفظة الوكلاء",
    "correctSubDisp": "خدمات وعمليات الوكلاء",
    "lastUpdated": "2026-09-19",
    "content": html_agent
})
current_id += 1

# -------------------------------------------------------------
# 8. التحديثات اليومية.xlsx
# -------------------------------------------------------------
daily_path = os.path.join(KB_DIR, 'التحديثات اليومية.xlsx')
daily_rows = []
with zipfile.ZipFile(daily_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//main:si', ns):
            texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
    for s_file in sheet_files:
        s_root = ET.fromstring(z.read(s_file))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for row in s_root.findall('.//main:row', ns):
            cells = []
            for c in row.findall('.//main:c', ns):
                t_attr = c.get('t')
                v_tag = c.find('main:v', ns)
                val = ''
                if v_tag is not None and v_tag.text:
                    raw_v = v_tag.text
                    if t_attr == 's':
                        idx = int(raw_v)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    else:
                        val = raw_v
                if val.strip():
                    cells.append(val.strip())
            if cells:
                daily_rows.append(cells)

daily_paras = []
for r in daily_rows:
    daily_paras.append(' | '.join(r))

html_daily = format_article_html("سجل التحديثات اليومية والتعاميم والتعليمات التشغيلية المعتمدة (بما فيها تعليمات WhatsApp Bot)", "التحديثات اليومية والتعاميم", daily_paras, tables=[daily_rows[:15]] if daily_rows else [])
all_articles.append({
    "id": current_id,
    "title": "سجل التحديثات اليومية والتعاميم والتعليمات التشغيلية المعتمدة (بما فيها تعليمات WhatsApp Bot)",
    "category": "التحديثات اليومية والتعاميم",
    "icon": "fa-newspaper",
    "keywords": "تحديثات, يومية, تعليمات, تعاميم, واتساب بوت, whatsapp bot, بوت, اجراءات جديدة, اخر الاخبار, تعميم, تنبيه يومي",
    "correctDisp": "التعاميم والتحديثات",
    "correctSubDisp": "التحديثات اليومية والواتساب",
    "lastUpdated": "2026-09-19",
    "content": html_daily
})
current_id += 1

# -------------------------------------------------------------
# 9. الحدود والرسوم.xlsx
# -------------------------------------------------------------
limits_path = os.path.join(KB_DIR, 'الحدود والرسوم.xlsx')
limits_rows = []
with zipfile.ZipFile(limits_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//main:si', ns):
            texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
    for s_file in sheet_files:
        s_root = ET.fromstring(z.read(s_file))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for row in s_root.findall('.//main:row', ns):
            cells = []
            for c in row.findall('.//main:c', ns):
                t_attr = c.get('t')
                v_tag = c.find('main:v', ns)
                val = ''
                if v_tag is not None and v_tag.text:
                    raw_v = v_tag.text
                    if t_attr == 's':
                        idx = int(raw_v)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    else:
                        val = raw_v
                if val.strip():
                    cells.append(val.strip())
            if cells:
                limits_rows.append(cells)

limits_paras = [' | '.join(r) for r in limits_rows]
html_limits = format_article_html("جدول الحدود والرسوم والعمولات الشامل لكافة محافظ وبطاقات زين كاش (الأفراد، الأعمال، الوكلاء)", "الحدود والرسوم", limits_paras, tables=[limits_rows] if limits_rows else [])
all_articles.append({
    "id": current_id,
    "title": "جدول الحدود والرسوم والعمولات الشامل لكافة محافظ وبطاقات زين كاش (الأفراد، الأعمال، الوكلاء)",
    "category": "الحدود والرسوم",
    "icon": "fa-calculator",
    "keywords": "حدود, رسوم, عمولات, سقف المحفظة, الحد اليومي, الحد الشهري, عمولة السحب, عمولة التحويل, ماستر كارد, اسعار, كلفة, عمولة",
    "correctDisp": "الحدود والرسوم",
    "correctSubDisp": "رسوم العمليات والحدود",
    "lastUpdated": "2026-09-19",
    "content": html_limits
})
current_id += 1

# -------------------------------------------------------------
# 10. التصنيفات الجديدة.xlsx
# -------------------------------------------------------------
disp_path = os.path.join(KB_DIR, 'التصنيفات الجديدة.xlsx')
disp_rows = []
with zipfile.ZipFile(disp_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//main:si', ns):
            texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
    for s_file in sheet_files:
        s_root = ET.fromstring(z.read(s_file))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for row in s_root.findall('.//main:row', ns):
            cells = []
            for c in row.findall('.//main:c', ns):
                t_attr = c.get('t')
                v_tag = c.find('main:v', ns)
                val = ''
                if v_tag is not None and v_tag.text:
                    raw_v = v_tag.text
                    if t_attr == 's':
                        idx = int(raw_v)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    else:
                        val = raw_v
                if val.strip():
                    cells.append(val.strip())
            if cells:
                disp_rows.append(cells)

disp_paras = [' | '.join(r) for r in disp_rows]
html_disp = format_article_html("دليل تصنيفات المكالمات والتذاكر المعتمد في خدمة العملاء (Dispositions & Sub-Dispositions)", "خدمة العملاء وأنظمة العمل", disp_paras, tables=[disp_rows] if disp_rows else [])
all_articles.append({
    "id": current_id,
    "title": "دليل تصنيفات المكالمات والتذاكر المعتمد في خدمة العملاء (Dispositions & Sub-Dispositions)",
    "category": "خدمة العملاء وأنظمة العمل",
    "icon": "fa-tags",
    "keywords": "تصنيفات, ديسبوزيشن, Disposition, Sub Disposition, تصنيف المكالمات, تذاكر, كول سنتر, ترميز المكالمات",
    "correctDisp": "تصنيفات الخدمة",
    "correctSubDisp": "التصنيف والترميز",
    "lastUpdated": "2026-09-19",
    "content": html_disp
})
current_id += 1

# -------------------------------------------------------------
# 11. دليل السياسات والاجراءات.docx & دليل الشكاوي.docx & دليل التوعية.docx
# -------------------------------------------------------------
pol_path = os.path.join(KB_DIR, 'دليل السياسات والاجراءات.docx')
with zipfile.ZipFile(pol_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    pol_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    pol_paras = [p for p in pol_paras if p]

html_pol = format_article_html("دليل السياسات والإجراءات: التعامل مع المشتركين غير الراضين والمسيئين وضوابط التصعيد", "السياسات والإجراءات", pol_paras)
all_articles.append({
    "id": current_id,
    "title": "دليل السياسات والإجراءات: التعامل مع المشتركين غير الراضين والمسيئين وضوابط التصعيد",
    "category": "السياسات والإجراءات",
    "icon": "fa-scale-balanced",
    "keywords": "سياسات, اجراءات, مشترك غير راضي, اساءة لفظية, تصعيد, انهاء مكالمة, حظر, التعامل مع الزبائن",
    "correctDisp": "السياسات",
    "correctSubDisp": "إجراءات التعامل والشكاوى",
    "lastUpdated": "2026-09-19",
    "content": html_pol
})
current_id += 1

shk_path = os.path.join(KB_DIR, 'دليل الشكاوي.docx')
with zipfile.ZipFile(shk_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    shk_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    shk_paras = [p for p in shk_paras if p]

html_shk = format_article_html("دليل إجراءات الشكاوى على مقرات وموظفي الشركة ومراكز خدمة العملاء", "السياسات والإجراءات", shk_paras)
all_articles.append({
    "id": current_id,
    "title": "دليل إجراءات الشكاوى على مقرات وموظفي الشركة ومراكز خدمة العملاء",
    "category": "السياسات والإجراءات",
    "icon": "fa-file-circle-exclamation",
    "keywords": "شكوى, شكاوى, مقرات, فروع, موظف, اساءة, تذكرة شكوى, اعتذار, شكوى موظف, فرع",
    "correctDisp": "الشكاوى",
    "correctSubDisp": "شكاوى المقرات والموظفين",
    "lastUpdated": "2026-09-19",
    "content": html_shk
})
current_id += 1

tou_path = os.path.join(KB_DIR, 'دليل التوعية.docx')
with zipfile.ZipFile(tou_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    tou_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    tou_paras = [p for p in tou_paras if p]

html_tou = format_article_html("دليل التوعية التقنية وحل مشاكل أجهزة وهواتف وتطبيقات المشتركين (Android & iOS)", "التوعية والدعم التقني", tou_paras)
all_articles.append({
    "id": current_id,
    "title": "دليل التوعية التقنية وحل مشاكل أجهزة وهواتف وتطبيقات المشتركين (Android & iOS)",
    "category": "التوعية والدعم التقني",
    "icon": "fa-shield-halved",
    "keywords": "توعية, اصدار التطبيق, نظام التشغيل, مسح التخزين المؤقت, تحديث التطبيق, اندرويد, ايفون, كاش ميموري, عطل التطبيق",
    "correctDisp": "الدعم التقني",
    "correctSubDisp": "توعية المشترك",
    "lastUpdated": "2026-09-19",
    "content": html_tou
})
current_id += 1

# -------------------------------------------------------------
# 12. Wallet profile.xlsx & Ros.xlsx & Zaincash Offers.docx
# -------------------------------------------------------------
wp_path = os.path.join(KB_DIR, 'Wallet profile.xlsx')
wp_rows = []
with zipfile.ZipFile(wp_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//main:si', ns):
            texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
    for s_file in sheet_files:
        s_root = ET.fromstring(z.read(s_file))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for row in s_root.findall('.//main:row', ns):
            cells = []
            for c in row.findall('.//main:c', ns):
                t_attr = c.get('t')
                v_tag = c.find('main:v', ns)
                val = ''
                if v_tag is not None and v_tag.text:
                    raw_v = v_tag.text
                    if t_attr == 's':
                        idx = int(raw_v)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    else:
                        val = raw_v
                if val.strip():
                    cells.append(val.strip())
            if cells:
                wp_rows.append(cells)

html_wp = format_article_html("دليل أنواع وملفات المحافظ والخدمات المتاحة لكل نوع (Wallet Profiles: Basic, Standard, Payroll)", "محفظة الأفراد", [' | '.join(r) for r in wp_rows], tables=[wp_rows] if wp_rows else [])
all_articles.append({
    "id": current_id,
    "title": "دليل أنواع وملفات المحافظ والخدمات المتاحة لكل نوع (Wallet Profiles: Basic, Standard, Payroll)",
    "category": "محفظة الأفراد",
    "icon": "fa-address-card",
    "keywords": "Wallet profile, بروفايل, Basic Wallet, Standard, Premium, رواتب, خدمات متاحة, ملف المحفظة",
    "correctDisp": "أنواع المحافظ",
    "correctSubDisp": "ملف المحفظة والخدمات",
    "lastUpdated": "2026-09-19",
    "content": html_wp
})
current_id += 1

ros_path = os.path.join(KB_DIR, 'Ros.xlsx')
ros_rows = []
with zipfile.ZipFile(ros_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//main:si', ns):
            texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
    for s_file in sheet_files:
        s_root = ET.fromstring(z.read(s_file))
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for row in s_root.findall('.//main:row', ns):
            cells = []
            for c in row.findall('.//main:c', ns):
                t_attr = c.get('t')
                v_tag = c.find('main:v', ns)
                val = ''
                if v_tag is not None and v_tag.text:
                    raw_v = v_tag.text
                    if t_attr == 's':
                        idx = int(raw_v)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    else:
                        val = raw_v
                if val.strip():
                    cells.append(val.strip())
            if cells:
                ros_rows.append(cells)

html_ros = format_article_html("دليل فروع ومقرات ومراكز خدمة زين كاش وزين العراق الرئيسية وساعات العمل بالمحافظات", "الفروع ومواقع الخدمة", [' | '.join(r) for r in ros_rows], tables=[ros_rows] if ros_rows else [])
all_articles.append({
    "id": current_id,
    "title": "دليل فروع ومقرات ومراكز خدمة زين كاش وزين العراق الرئيسية وساعات العمل بالمحافظات",
    "category": "الفروع ومواقع الخدمة",
    "icon": "fa-map-location-dot",
    "keywords": "فروع, مواقع, مقرات, مراكز خدمة, ROS, حي الجامعة, المنصور, البصرة, اربيل, ساعات الدوام, اماكن الفروع",
    "correctDisp": "الفروع والمواقع",
    "correctSubDisp": "عناوين المراكز وساعات العمل",
    "lastUpdated": "2026-09-19",
    "content": html_ros
})
current_id += 1

off_path = os.path.join(KB_DIR, 'Zaincash Offers.docx')
with zipfile.ZipFile(off_path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    off_paras = [''.join([t.text for t in p.findall('.//w:t', ns) if t.text]).strip() for p in root.findall('.//w:p', ns)]
    off_paras = [p for p in off_paras if p]

off_imgs = image_map.get('Zaincash Offers.docx', [])
html_off = format_article_html("دليل عروض وخصومات وحملات الكاش باك من زين كاش (طلبات، سينما، خصومات الشركاء)", "العروض والمكافآت", off_paras, images=off_imgs)
all_articles.append({
    "id": current_id,
    "title": "دليل عروض وخصومات وحملات الكاش باك من زين كاش (طلبات، سينما، خصومات الشركاء)",
    "category": "العروض والمكافآت",
    "icon": "fa-gift",
    "keywords": "عروض, طلبات, كاش باك, خصومات, مطاعم, سينما, تسوق, 20%, استرداد نقدي, حملات ترويجية",
    "correctDisp": "العروض",
    "correctSubDisp": "عروض الكاش باك",
    "lastUpdated": "2026-09-19",
    "content": html_off
})
current_id += 1

# -------------------------------------------------------------
# 13. فيديوهات التوضيحية.xlsx & Copy of Notification Master Data
# -------------------------------------------------------------
vid_path = os.path.join(KB_DIR, 'فيديوهات التوضيحية.xlsx')
vid_rows = []
if os.path.exists(vid_path):
    with zipfile.ZipFile(vid_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in ss_root.findall('.//main:si', ns):
                texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
                shared_strings.append(''.join(texts))
        
        sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
        for s_file in sheet_files:
            s_root = ET.fromstring(z.read(s_file))
            ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for row in s_root.findall('.//main:row', ns):
                cells = []
                for c in row.findall('.//main:c', ns):
                    t_attr = c.get('t')
                    v_tag = c.find('main:v', ns)
                    val = ''
                    if v_tag is not None and v_tag.text:
                        raw_v = v_tag.text
                        if t_attr == 's':
                            idx = int(raw_v)
                            if idx < len(shared_strings):
                                val = shared_strings[idx]
                        else:
                            val = raw_v
                    if val.strip():
                        cells.append(val.strip())
                if cells:
                    vid_rows.append(cells)

html_vid = format_article_html("دليل روابط الفيديوهات والشروحات الرسمية المرئية لاستخدام خدمات زين كاش", "الفيديوهات التوضيحية والشروحات", [' | '.join(r) for r in vid_rows], tables=[vid_rows] if vid_rows else [])
all_articles.append({
    "id": current_id,
    "title": "دليل روابط الفيديوهات والشروحات الرسمية المرئية لاستخدام خدمات زين كاش",
    "category": "الفيديوهات التوضيحية والشروحات",
    "icon": "fa-video",
    "keywords": "فيديوهات, شروحات, يوتيوب, فيديو توضيحي, تسجيل محفظة, تفعيل ماستر كارد, روابط تعليمية",
    "correctDisp": "الشروحات",
    "correctSubDisp": "فيديوهات اليوتيوب",
    "lastUpdated": "2026-09-19",
    "content": html_vid
})
current_id += 1

print(f"Total structured articles generated: {len(all_articles)}")

# 14. Write to kb-data.js
kb_data_js_content = f"""// Auto-Generated Comprehensive Master Knowledge Base (Zero Data Loss)
const EMBEDDED_KB_DATA = {json.dumps(all_articles, ensure_ascii=False, indent=2)};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = EMBEDDED_KB_DATA;
}}
if (typeof window !== 'undefined') {{
    window.EMBEDDED_KB_DATA = EMBEDDED_KB_DATA;
}}
"""

with open(KB_DATA_JS, 'w', encoding='utf-8') as f:
    f.write(kb_data_js_content)
print(f"Successfully saved {KB_DATA_JS}")

# 15. Update SQLite Database
try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO system_config (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    """, ('knowledgeBase', json.dumps(all_articles, ensure_ascii=False)))
    conn.commit()
    conn.close()
    print(f"Successfully updated SQLite DB with {len(all_articles)} articles!")
except Exception as e:
    print(f"Error updating SQLite: {e}")

print("Knowledge Base Generation Finished Successfully!")
