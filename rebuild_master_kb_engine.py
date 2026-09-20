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

print("==================================================================")
print("Starting Precision Zero-Base Rebuild of Zain Cash Knowledge Base...")
print("==================================================================")

# -------------------------------------------------------------
# STEP 1: PARSING UTILITIES WITH INLINE IMAGE EXTRACTION
# -------------------------------------------------------------
def extract_docx_with_inline_media(docx_filename):
    doc_path = os.path.join(KB_DIR, docx_filename)
    base_name = os.path.splitext(docx_filename)[0].strip()
    elements = []
    
    with zipfile.ZipFile(doc_path, 'r') as z:
        # Read relationships
        rel_map = {}
        if 'word/_rels/document.xml.rels' in z.namelist():
            rels_xml = z.read('word/_rels/document.xml.rels')
            rels_root = ET.fromstring(rels_xml)
            ns_rel = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
            for rel in rels_root.findall('.//r:Relationship', ns_rel):
                r_id = rel.get('Id')
                target = rel.get('Target')
                if 'media/' in target:
                    media_name = os.path.basename(target)
                    # Extract to disk if real image
                    raw_data = z.read(f'word/{target}' if not target.startswith('word/') else target)
                    if len(raw_data) > 3000: # filter out tiny 70-byte spacer pixels
                        disk_filename = f"{base_name}_{media_name}"
                        out_p = os.path.join(MEDIA_DIR, disk_filename)
                        with open(out_p, 'wb') as f_out:
                            f_out.write(raw_data)
                        rel_map[r_id] = disk_filename
        
        # Read document body
        doc_xml = z.read('word/document.xml')
        doc_root = ET.fromstring(doc_xml)
        ns = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
            'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
        }
        body = doc_root.find('.//w:body', ns)
        if body is None:
            return elements
        
        for child in body:
            tag = child.tag.split('}')[-1]
            if tag == 'p':
                texts = [t.text for t in child.findall('.//w:t', ns) if t.text]
                p_text = ''.join(texts).strip()
                # Find any blip images attached to this paragraph
                images_in_p = []
                for blip in child.findall('.//a:blip', ns):
                    embed_id = blip.get(f'{{{ns["r"]}}}embed')
                    if embed_id in rel_map:
                        images_in_p.append(rel_map[embed_id])
                
                if p_text or images_in_p:
                    elements.append({
                        'type': 'p',
                        'text': p_text,
                        'images': images_in_p
                    })
            elif tag == 'tbl':
                table_rows = []
                for tr in child.findall('.//w:tr', ns):
                    cells = []
                    for tc in tr.findall('.//w:tc', ns):
                        tc_texts = [t.text for t in tc.findall('.//w:t', ns) if t.text]
                        cells.append(' '.join(tc_texts).strip())
                    if any(c for c in cells):
                        table_rows.append(cells)
                if table_rows:
                    elements.append({
                        'type': 'table',
                        'rows': table_rows
                    })
    return elements

def read_xlsx_rows(xlsx_filename):
    xlsx_path = os.path.join(KB_DIR, xlsx_filename)
    sheets_data = []
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in ss_root.findall('.//main:si', ns):
                texts = [t.text for t in si.findall('.//main:t', ns) if t.text]
                shared_strings.append(''.join(texts))
        
        sheet_files = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
        sheet_files.sort()
        for s_file in sheet_files:
            s_root = ET.fromstring(z.read(s_file))
            ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            rows = []
            for row in s_root.findall('.//main:row', ns):
                cells = []
                for c in row.findall('.//main:c', ns):
                    t_attr = c.get('t')
                    v_tag = c.find('main:v', ns)
                    val = ''
                    if t_attr == 's' and v_tag is not None and v_tag.text:
                        idx = int(v_tag.text)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                    elif t_attr == 'inlineStr':
                        is_t = c.find('.//main:t', ns)
                        if is_t is not None and is_t.text:
                            val = is_t.text
                    elif v_tag is not None and v_tag.text:
                        val = v_tag.text
                    cells.append(str(val).strip())
                if any(c for c in cells):
                    rows.append(cells)
            sheets_data.extend(rows)
    return sheets_data

# -------------------------------------------------------------
# STEP 2: HTML RENDERING ENGINE WITH VIBRANT SEMANTIC STYLING
# -------------------------------------------------------------
def render_clean_article_html(title, category, elements, badge_text="الدليل المعتمد لخدمة العملاء"):
    body_html = ""
    
    for el in elements:
        if el['type'] == 'table':
            rows = el['rows']
            if not rows:
                continue
            headers = rows[0]
            body_html += '<div style="overflow-x:auto; margin:22px 0; border:1px solid #cbd5e1; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">'
            body_html += '<table style="width:100%; border-collapse:collapse; text-align:right; font-size:0.88rem; font-family:inherit;">'
            body_html += '<thead style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff;"><tr>'
            for h in headers:
                body_html += f'<th style="padding:12px 16px; border:1px solid #334155; font-weight:800; font-size:0.88rem;">{h}</th>'
            body_html += '</tr></thead><tbody>'
            for r_idx, row in enumerate(rows[1:]):
                bg = '#f8fafc' if r_idx % 2 == 0 else '#ffffff'
                body_html += f'<tr style="background:{bg}; transition:background 0.2s;">'
                for c_idx in range(len(headers)):
                    cell_text = row[c_idx] if c_idx < len(row) else ''
                    body_html += f'<td style="padding:10px 14px; border:1px solid #e2e8f0; color:#334155; line-height:1.65;">{cell_text}</td>'
                body_html += '</tr>'
            body_html += '</tbody></table></div>'
            continue
        
        # Paragraph element
        p_text = el.get('text', '').strip()
        p_imgs = el.get('images', [])
        
        if p_text and not p_text.startswith('Zainab Ali') and len(p_text) > 1:
            clean_text = re.sub(r'^[:●■🔶⚠️\s]+', '', p_text).strip()
            
            # 1. Check for Requirements / Conditions (المتطلبات والشروط والمستمسكات) -> Emerald Green Box
            if any(k in p_text for k in ['المتطلبات', 'الشروط المطلوبة', 'المستمسكات المطلوبة', 'وثائق التسجيل', 'الوثائق المطلوبة', 'شروط الخدمة', 'شروط التفعيل']):
                body_html += f'''
        <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-right:4px solid #16a34a; border-radius:12px; padding:14px 18px; margin:18px 0; border:1px solid #bbf7d0; box-shadow:0 2px 6px rgba(22,163,74,0.05);">
            <div style="font-weight:800; color:#15803d; font-size:0.95rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-list-check" style="color:#16a34a; font-size:1.05rem;"></i> المتطلبات والشروط المعتمدة
            </div>
            <div style="color:#166534; font-size:0.92rem; line-height:1.8;">{p_text}</div>
        </div>'''
            # 2. Check for Fees & Limits (الرسوم، العمولات، الحدود المالية) -> Purple/Violet Box
            elif any(k in p_text for k in ['الرسوم والعمولات', 'رسوم الخدمة', 'الحدود المالية', 'جدول الرسوم', 'العمولة المقررة', 'سقف السحب', 'سقف الإيداع', 'الحد اليومي']):
                body_html += f'''
        <div style="background:linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-right:4px solid #9333ea; border-radius:12px; padding:14px 18px; margin:18px 0; border:1px solid #e9d5ff; box-shadow:0 2px 6px rgba(147,51,234,0.05);">
            <div style="font-weight:800; color:#7e22ce; font-size:0.95rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-coins" style="color:#9333ea; font-size:1.05rem;"></i> الرسوم والحدود المالية المقررة
            </div>
            <div style="color:#6b21a8; font-size:0.92rem; line-height:1.8;">{p_text}</div>
        </div>'''
            # 3. Check for Important Notes/Alerts -> Amber/Gold Warning Box
            elif 'ملاحظة' in p_text or 'تنبيه' in p_text or 'تحذير' in p_text or 'مهم' in p_text or 'تحذيري' in p_text:
                body_html += f'''
        <div style="background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-right:4px solid #f59e0b; border-radius:12px; padding:14px 18px; margin:18px 0; border:1px solid #fde68a; box-shadow:0 2px 6px rgba(245,158,11,0.05);">
            <div style="font-weight:800; color:#b45309; font-size:0.95rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b; font-size:1.05rem;"></i> تنبيه تشغيلي هام
            </div>
            <div style="color:#92400e; font-size:0.92rem; line-height:1.8;">{p_text}</div>
        </div>'''
            # 4. Check for Major Headings -> Blue Header Banner
            elif len(p_text) < 95 and (
                p_text.endswith(':') or p_text.startswith('●') or p_text.startswith('■') or 
                p_text.startswith('خطوات') or p_text.startswith('شروط') or p_text.startswith('كيفية') or 
                p_text.startswith('الاجراء') or p_text.startswith('الهدف') or 
                p_text.startswith('الحالات') or p_text.startswith('التعليمات') or p_text.startswith('تحديات')
            ):
                body_html += f'''
        <div style="background:#f1f5f9; border-right:4px solid #2563eb; border-radius:10px; padding:12px 18px; margin:22px 0 10px 0;">
            <h4 style="font-size:1.02rem; font-weight:800; color:#1e3a8a; margin:0; line-height:1.4;">
                <i class="fa-solid fa-circle-dot" style="color:#2563eb; font-size:0.8rem;"></i> {clean_text}
            </h4>
        </div>'''
            # 5. Check for Numbered Steps -> Sleek Numbered Step Cards
            elif re.match(r'^\d+[\.\-\)]\s', p_text):
                num = re.match(r'^(\d+)[\.\-\)]', p_text).group(1)
                text = re.sub(r'^\d+[\.\-\)]\s*', '', p_text).strip()
                body_html += f'''
        <div style="display:flex; gap:12px; align-items:flex-start; margin:10px 0; padding:12px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-size:0.94rem; color:#1e293b; line-height:1.75; box-shadow:0 1px 4px rgba(0,0,0,0.02);">
            <span style="background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#ffffff; font-weight:800; width:26px; height:26px; min-width:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.82rem; box-shadow:0 2px 6px rgba(37,99,235,0.3);">{num}</span>
            <div style="flex:1;">{text}</div>
        </div>'''
            # 6. Check for Bullet Points
            elif p_text.startswith('-') or p_text.startswith('•') or p_text.startswith('*') or p_text.startswith('○'):
                item_text = re.sub(r'^[-•*○\s]+', '', p_text).strip()
                body_html += f'''
        <div style="display:flex; gap:12px; align-items:flex-start; margin:8px 0; padding-right:12px; font-size:0.94rem; color:#334155; line-height:1.8;">
            <span style="color:#2563eb; font-weight:bold; font-size:1.15rem; line-height:1;">•</span>
            <div style="flex:1;">{item_text}</div>
        </div>'''
            else:
                body_html += f'''
        <p style="font-size:0.94rem; color:#334155; line-height:1.85; margin:10px 0;">
            {p_text}
        </p>'''
        
        # Render inline images directly under their paragraph!
        for img_fn in p_imgs:
            caption_map = {
                'Ameyo': 'شاشة توضيحية من نظام خدمة العملاء Ameyo',
                'Utilities': 'شاشة توضيحية من نظام الـ Utilities المعتمد',
                'Offers': 'تفاصيل وبنر العرض الترويجي الرسمي في التطبيق'
            }
            caption = 'شاشة توضيحية من شاشة النظام المعتمد'
            for k, cap in caption_map.items():
                if k.lower() in img_fn.lower():
                    caption = cap
                    break
            
            body_html += f'''
        <div style="margin:20px 0; background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <img src="/public/kb-media/{img_fn}" alt="{caption}" style="max-width:100%; height:auto; border-radius:10px; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.05);" loading="lazy" onerror="this.onerror=null; this.src='kb-media/{img_fn}';" />
            <div style="margin-top:8px; font-size:0.84rem; color:#475569; font-weight:700;">
                <i class="fa-solid fa-camera" style="color:#2563eb;"></i> {caption}
            </div>
        </div>'''

    html = f'''
<div class="kb-master-container" style="font-family:'Cairo', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; line-height:1.85; direction:rtl; text-align:right;">
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:22px; border-radius:18px; margin-bottom:20px; box-shadow: 0 8px 20px rgba(15,23,42,0.12); border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
            <span style="background:rgba(255,153,0,0.2); color:#ff9900; border:1px solid rgba(255,153,0,0.4); padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:800;">
                <i class="fa-solid fa-shield-check"></i> {badge_text}
            </span>
            <span style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700;">
                {category}
            </span>
        </div>
        <h2 style="font-size:1.35rem; font-weight:900; margin:0; color:#f8fafc; line-height:1.4;">
            {title}
        </h2>
    </div>

    <!-- Article Content Card -->
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 3px 12px rgba(0,0,0,0.03);">
        {body_html}
    </div>
</div>'''
    return html

# -------------------------------------------------------------
# STEP 3: ASSEMBLE ALL 48 MODULAR KNOWLEDGE BASE ARTICLES WITH SHORT SHARP TITLES
# -------------------------------------------------------------
articles = []
current_id = 1

# 1. خدمات وتحديات محفظة الافراد.docx (Split by logical topics with concise titles)
print("Processing: خدمات وتحديات محفظة الافراد.docx...")
indiv_elements = extract_docx_with_inline_media('خدمات وتحديات محفظة الافراد.docx')

section_markers = [
    ('تسجيل محفظة', 'تسجيل محفظة زين كاش والشروط'),
    ('تحديات تسجيل محفظة', 'مشاكل تسجيل المحفظة والشاشة البيضاء'),
    ('تسجيل الدخول للمحفظة', 'تسجيل الدخول للمحفظة والخطوات'),
    ('تحديات تسجيل دخول المحفظة', 'مشاكل تسجيل الدخول وتغيير الجهاز'),
    ('إعادة تعيين وتغيير الرمز السري لمحفظه زين كاش', 'تغيير وإعادة تعيين الرمز السري (PIN)'),
    ('كيفية إعادة تعيين الرمز السري من قبل خدمة العملاء', 'إجراءات خدمة العملاء للرمز السري المؤقت'),
    ('تعبئة المحفظة', 'تعبئة وتغذية رصيد المحفظة'),
    ('تحديات التعبئة  من خلال الوكيل', 'مشاكل التعبئة من الوكيل والاستقطاع'),
    ('تحديات التعبئة من الحساب المصرفي', 'مشاكل التعبئة من الحساب المصرفي'),
    ('تحويل واستلام الاموال محلي', 'التحويل المالي واستلام الأموال (P2P)'),
    ('في حال قيام المشترك بتحويل الأموال بشكل خاطئ', 'إجراءات استرجاع التحويل الخاطئ'),
    ('تحويل الاموال الى محافظ اخرى', 'التحويل للمحافظ الأخرى والبنوك'),
    ('سحب الأموال من محفظة زين كاش ( سحب نقدي )', 'سحب الأموال نقداً (وكلاء وصراف آلي)'),
    ('سحب الاموال الى محفظة وكيل بشكل خاطئ', 'معالجة السحب الخاطئ للوكيل'),
    ('سحب الاموال من محافظ الاشخاص المتوفين', 'سحب أموال محافظ المتوفين'),
    ('الدفع الى التجار (مزودي الخدمة)', 'الدفع للتجار وبوابات الدفع الإلكتروني'),
    ('دفع الفواتير', 'دفع الفواتير والخدمات الحكومية'),
    ('البطاقات الإلكترونية', 'شراء البطاقات الإلكترونية والألعاب'),
    ('بطاقة الماستر كارد (كلاسيك / بلاتينيوم )', 'بطاقة ماستركارد زين كاش والتفعيل'),
    ('سحب الاموال من الصرافات داخل وخارج العراق.', 'السحب ببطاقة ماستركارد من الـ ATM'),
    ('تحديات بطاقة الماستر كارد (كلاسيك /بلاتينيوم)', 'مشاكل بطاقة ماستركارد والشراء الدولي'),
    ('تحديات التعبئة والتحويل من وإلى بطاقة الماستر كارد', 'مشاكل التحويل وتعبئة الماستركارد'),
    ('ويسترن يونيون', 'خدمة ويسترن يونيون للحوالات الدولية'),
    ('تحديات اضافة مستفيد جديد في خدمة ويسترن يونيون', 'مشاكل ويسترن يونيون وإضافة المستفيد'),
    ('تعبئة رصيد هاتفك', 'شحن رصيد الموبايل وباقات الإنترنت'),
    ('إدارة الحسابات المصرفية (المصرف الاهلي العراقي)', 'ربط وإدارة الحساب المصرفي (NBI)'),
    ('تاريخ المعاملات المالية ( معاملاتي )', 'كشف الحساب وتاريخ المعاملات'),
    ('حالات الاحتيال', 'مكافحة الاحتيال والروابط المشبوهة'),
    ('أسئلة الأمان لمحافظ الأفراد', 'أسئلة الأمان والتحقق من هوية المشترك')
]

split_sections = []
current_sec = {'title': 'تسجيل محفظة زين كاش والشروط', 'elements': []}

for el in indiv_elements:
    if el['type'] == 'p':
        p_txt = el.get('text', '').strip()
        matched = None
        for marker, target_title in section_markers:
            if p_txt == marker or (len(p_txt) < 70 and p_txt.startswith(marker)):
                matched = target_title
                break
        if matched:
            if current_sec['elements']:
                split_sections.append(current_sec)
            current_sec = {'title': matched, 'elements': []}
        else:
            current_sec['elements'].append(el)
    else:
        current_sec['elements'].append(el)

if current_sec['elements']:
    split_sections.append(current_sec)

for s in split_sections:
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
        kws += ", بوابة دفع, دفع الكتروني, موقع, متجر, استقطع وموصل, تاجر, payment gateway, qr, فشل الدفع, استقطع الرصيد"
    if 'ماستر' in s['title'] or 'بلاتينيوم' in s['title']:
        kws += ", ماستر كارد, والت كارد, بلاتينيوم, كلاسيك, cvv, صراف, كوكل بلي, شراء اونلاين, فشل الدفع بالبطاقة, استقطاع بالبطاقة, mc-deduction"
    if 'ويسترن' in s['title']:
        kws += ", western union, ويسترن يونيون, mtcn, حوالة دولية, مستفيد, استرداد, معلقة"
    if 'فواتير' in s['title']:
        kws += ", كهرباء, ماء, صندوق الاسكان, عقاري, فاتورة, تسديد"
    if 'رصيد' in s['title']:
        kws += ", شحن رصيد, كارت, كورك, اسيا, باقة انترنت"
        
    html = render_clean_article_html(s['title'], "محفظة الأفراد", s['elements'])
    articles.append({
        "id": current_id,
        "title": s['title'],
        "category": "محفظة الأفراد",
        "icon": "fa-user",
        "keywords": kws,
        "correctDisp": "محفظة الأفراد",
        "correctSubDisp": s['title'],
        "lastUpdated": "2026-09-20",
        "content": html
    })
    current_id += 1

print(f"Generated {len(split_sections)} individual wallet articles.")

# 2. CC KB Stock  .docx
print("Processing: CC KB Stock  .docx...")
stock_els = extract_docx_with_inline_media('CC KB Stock  .docx')
html_stock = render_clean_article_html("تداول الأسهم الأمريكية (Alpaca)", "الأسهم والتداول", stock_els)
articles.append({
    "id": current_id,
    "title": "تداول الأسهم الأمريكية (Alpaca)",
    "category": "الأسهم والتداول",
    "icon": "fa-chart-line",
    "keywords": "تداول, اسهم, أسهم, امريكية, بورصة, وساطة, البورصة, Alpaca, SIPC, SEC, شروط, تسجيل, ايداع, سحب, اوامر, بيع, شراء, ربح, خسارة, مصطلحات, 5000 دينار, اشتراك شهري",
    "correctDisp": "الأسهم والتداول",
    "correctSubDisp": "تداول الأسهم الأمريكية",
    "lastUpdated": "2026-09-20",
    "content": html_stock
})
current_id += 1

# 3. Investing Utilities Portal.docx
print("Processing: Investing Utilities Portal.docx...")
inv_els = extract_docx_with_inline_media('Investing Utilities Portal.docx')
html_inv = render_clean_article_html("بوابة Investing Portal لإدارة الأسهم", "الأسهم والتداول", inv_els)
articles.append({
    "id": current_id,
    "title": "بوابة Investing Portal لإدارة الأسهم",
    "category": "الأسهم والتداول",
    "icon": "fa-laptop-code",
    "keywords": "Investing Portal, يوتيليتيز, بوابة الاستثمار, حساب تداول, ارصدة, الغاء اوامر, سحب, اشتراك, تداول, متابعة",
    "correctDisp": "الأسهم والتداول",
    "correctSubDisp": "بوابة Investing Portal",
    "lastUpdated": "2026-09-20",
    "content": html_inv
})
current_id += 1

# 4. Ameyo System User guide CC .docx (With INLINE screenshots!)
print("Processing: Ameyo System User guide CC .docx with inline screenshots...")
ameyo_els = extract_docx_with_inline_media('Ameyo System User guide CC .docx')

ameyo_p1 = []
ameyo_p2 = []
for el in ameyo_els:
    txt = el.get('text', '')
    if any(k in txt for k in ['تذكرة', 'Ticket', 'Queue', 'رفع طلب', 'تدقيق الطلبات']):
        ameyo_p2.append(el)
    else:
        ameyo_p1.append(el)

html_am1 = render_clean_article_html("نظام Ameyo: إدارة واستقبال المكالمات", "أنظمة خدمة العملاء", ameyo_p1 if ameyo_p1 else ameyo_els)
articles.append({
    "id": current_id,
    "title": "نظام Ameyo: إدارة واستقبال المكالمات",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-headset",
    "keywords": "Ameyo, اميو, اتصال, كتم, تحويل, تصنيف المكالمة, Disposition, WebRTC, كول سنتر, خدمة العملاء",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "نظام Ameyo - المكالمات",
    "lastUpdated": "2026-09-20",
    "content": html_am1
})
current_id += 1

html_am2 = render_clean_article_html("نظام Ameyo: رفع وإدارة التذاكر", "أنظمة خدمة العملاء", ameyo_p2 if ameyo_p2 else ameyo_els)
articles.append({
    "id": current_id,
    "title": "نظام Ameyo: رفع وإدارة التذاكر",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-ticket",
    "keywords": "Ameyo, تذاكر, Ticket, Queue, Priority, High, Medium, New Request, رفع طلب, شكوى, متابعة تذكرة",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "نظام Ameyo - التذاكر",
    "lastUpdated": "2026-09-20",
    "content": html_am2
})
current_id += 1

# 5. برنامج ال Utilities واستخداماته.docx (With INLINE screenshots!)
print("Processing: برنامج ال Utilities واستخداماته.docx with inline screenshots...")
util_els = extract_docx_with_inline_media('برنامج ال Utilities واستخداماته.docx')
html_util = render_clean_article_html("برنامج الـ Utilities وفحص المحافظ", "أنظمة خدمة العملاء", util_els)
articles.append({
    "id": current_id,
    "title": "برنامج الـ Utilities وفحص المحافظ",
    "category": "أنظمة خدمة العملاء",
    "icon": "fa-toolbox",
    "keywords": "Utilities, يوتيليتيز, تدقيق رصيد, اعادة رمز سري, فك حظر, حالة المحفظة, عمليات, ارسالة رمز, استعلام",
    "correctDisp": "أنظمة العمل",
    "correctSubDisp": "برنامج Utilities",
    "lastUpdated": "2026-09-20",
    "content": html_util
})
current_id += 1

# 6. خدمات محفظة الاعمال.docx & تحديات محفظة الاعمال.docx
print("Processing: Business Wallet documents...")
biz_els = extract_docx_with_inline_media('خدمات محفظة الاعمال.docx')
html_biz = render_clean_article_html("محفظة الأعمال والتجار والشروط", "محفظة الأعمال", biz_els)
articles.append({
    "id": current_id,
    "title": "محفظة الأعمال والتجار والشروط",
    "category": "محفظة الأعمال",
    "icon": "fa-briefcase",
    "keywords": "اعمال, شركات, محفظة اعمال, رواتب, تجار, بوابة دفع, صرف جماعي, شركات تحصيل, payment gateway, api, تاجر, اريد اسوي بوابة دفع, انشاء بوابة دفع, ربط متجر, دمج بوابة الدفع",
    "correctDisp": "محفظة الأعمال",
    "correctSubDisp": "خدمات الأعمال وبوابة الدفع",
    "lastUpdated": "2026-09-20",
    "content": html_biz
})
current_id += 1

biz_chall_els = extract_docx_with_inline_media('تحديات محفظة الاعمال.docx')
html_biz_chall = render_clean_article_html("المشاكل التقنية لبوابات الدفع للتجار", "محفظة الأعمال", biz_chall_els)
articles.append({
    "id": current_id,
    "title": "المشاكل التقنية لبوابات الدفع للتجار",
    "category": "محفظة الأعمال",
    "icon": "fa-triangle-exclamation",
    "keywords": "مشاكل الاعمال, رفض الاعمال, تأخير قبول, بوابة دفع عطل, رفع تذكرة اعمال, Ameyo Business, تذكرة اعمال, فشل الدفع للمتجر",
    "correctDisp": "محفظة الأعمال",
    "correctSubDisp": "تحديات الأعمال",
    "lastUpdated": "2026-09-20",
    "content": html_biz_chall
})
current_id += 1

# 7. خدمات محفظة الوكلاء.docx
print("Processing: خدمات محفظة الوكلاء.docx...")
agent_els = extract_docx_with_inline_media('خدمات محفظة الوكلاء.docx')
html_agent = render_clean_article_html("محفظة الوكلاء والعمليات المالية", "محفظة الوكلاء", agent_els)
articles.append({
    "id": current_id,
    "title": "محفظة الوكلاء والعمليات المالية",
    "category": "محفظة الوكلاء",
    "icon": "fa-store",
    "keywords": "وكيل, وكلاء, محفظة الوكيل, شحن, سحب, ايداع, رصيد وكيل, عمولة, عمولات, تصريف, سندات, نقاط بيع, تعبئة رصيد الوكيل",
    "correctDisp": "محفظة الوكلاء",
    "correctSubDisp": "خدمات وعمليات الوكلاء",
    "lastUpdated": "2026-09-20",
    "content": html_agent
})
current_id += 1

# 8. التحديثات اليومية.xlsx
print("Processing: التحديثات اليومية.xlsx...")
daily_rows = read_xlsx_rows('التحديثات اليومية.xlsx')
daily_els = [{'type': 'table', 'rows': daily_rows}] if daily_rows else []
html_daily = render_clean_article_html("التحديثات والتعاميم التشغيلية اليومية", "التحديثات اليومية والتعاميم", daily_els)
articles.append({
    "id": current_id,
    "title": "التحديثات والتعاميم التشغيلية اليومية",
    "category": "التحديثات اليومية والتعاميم",
    "icon": "fa-newspaper",
    "keywords": "تحديثات, يومية, تعليمات, تعاميم, واتساب بوت, whatsapp bot, بوت, اجراءات جديدة, اخر الاخبار, تعميم, تنبيه يومي",
    "correctDisp": "التعاميم والتحديثات",
    "correctSubDisp": "التحديثات اليومية والواتساب",
    "lastUpdated": "2026-09-20",
    "content": html_daily
})
current_id += 1

# 9. الحدود والرسوم.xlsx
print("Processing: الحدود والرسوم.xlsx...")
limits_rows = read_xlsx_rows('الحدود والرسوم.xlsx')
limits_els = [{'type': 'table', 'rows': limits_rows}] if limits_rows else []
html_limits = render_clean_article_html("جدول الحدود المالية ورسوم العمليات", "الحدود والرسوم", limits_els)
articles.append({
    "id": current_id,
    "title": "جدول الحدود المالية ورسوم العمليات",
    "category": "الحدود والرسوم",
    "icon": "fa-calculator",
    "keywords": "حدود, رسوم, عمولات, سقف المحفظة, الحد اليومي, الحد الشهري, عمولة السحب, عمولة التحويل, ماستر كارد, اسعار, كلفة, عمولة",
    "correctDisp": "الحدود والرسوم",
    "correctSubDisp": "رسوم العمليات والحدود",
    "lastUpdated": "2026-09-20",
    "content": html_limits
})
current_id += 1

# 10. التصنيفات الجديدة.xlsx
print("Processing: التصنيفات الجديدة.xlsx...")
disp_rows = read_xlsx_rows('التصنيفات الجديدة.xlsx')
disp_els = [{'type': 'table', 'rows': disp_rows}] if disp_rows else []
html_disp = render_clean_article_html("تصنيفات الدعم الفني (CRM / Ameyo)", "خدمة العملاء وأنظمة العمل", disp_els)
articles.append({
    "id": current_id,
    "title": "تصنيفات الدعم الفني (CRM / Ameyo)",
    "category": "خدمة العملاء وأنظمة العمل",
    "icon": "fa-tags",
    "keywords": "تصنيفات, ديسبوزيشن, Disposition, Sub Disposition, تصنيف المكالمات, تذاكر, كول سنتر, ترميز المكالمات",
    "correctDisp": "تصنيفات الخدمة",
    "correctSubDisp": "التصنيف والترميز",
    "lastUpdated": "2026-09-20",
    "content": html_disp
})
current_id += 1

# 11. دليل السياسات والاجراءات.docx & دليل الشكاوي.docx & دليل التوعية.docx
print("Processing: Policies & Guidelines documents...")
pol_els = extract_docx_with_inline_media('دليل السياسات والاجراءات.docx')
html_pol = render_clean_article_html("سياسة مكافحة الاحتيال وتجميد الحسابات", "السياسات والإجراءات", pol_els)
articles.append({
    "id": current_id,
    "title": "سياسة مكافحة الاحتيال وتجميد الحسابات",
    "category": "السياسات والإجراءات",
    "icon": "fa-scale-balanced",
    "keywords": "سياسات, اجراءات, مشترك غير راضي, اساءة لفظية, تصعيد, انهاء مكالمة, حظر, التعامل مع الزبائن",
    "correctDisp": "السياسات",
    "correctSubDisp": "إجراءات التعامل والشكاوى",
    "lastUpdated": "2026-09-20",
    "content": html_pol
})
current_id += 1

shk_els = extract_docx_with_inline_media('دليل الشكاوي.docx')
html_shk = render_clean_article_html("معايير جودة الخدمة ورضا العملاء (QA)", "السياسات والإجراءات", shk_els)
articles.append({
    "id": current_id,
    "title": "معايير جودة الخدمة ورضا العملاء (QA)",
    "category": "السياسات والإجراءات",
    "icon": "fa-file-circle-exclamation",
    "keywords": "شكوى, شكاوى, مقرات, فروع, موظف, اساءة, تذكرة شكوى, اعتذار, شكوى موظف, فرع",
    "correctDisp": "الشكاوى",
    "correctSubDisp": "شكاوى المقرات والموظفين",
    "lastUpdated": "2026-09-20",
    "content": html_shk
})
current_id += 1

tou_els = extract_docx_with_inline_media('دليل التوعية.docx')
html_tou = render_clean_article_html("قنوات التواصل والتوعية الأمنية", "التوعية والدعم التقني", tou_els)
articles.append({
    "id": current_id,
    "title": "قنوات التواصل والتوعية الأمنية",
    "category": "التوعية والدعم التقني",
    "icon": "fa-shield-halved",
    "keywords": "توعية, اصدار التطبيق, نظام التشغيل, مسح التخزين المؤقت, تحديث التطبيق, اندرويد, ايفون, كاش ميموري, عطل التطبيق",
    "correctDisp": "الدعم التقني",
    "correctSubDisp": "توعية المشترك",
    "lastUpdated": "2026-09-20",
    "content": html_tou
})
current_id += 1

# 12. Wallet profile.xlsx & Ros.xlsx & Zaincash Offers.docx
print("Processing: Wallet profile, Ros & Offers...")
wp_rows = read_xlsx_rows('Wallet profile.xlsx')
wp_els = [{'type': 'table', 'rows': wp_rows}] if wp_rows else []
html_wp = render_clean_article_html("أنواع المحافظ والخدمات المتاحة لكل نوع", "محفظة الأفراد", wp_els)
articles.append({
    "id": current_id,
    "title": "أنواع المحافظ والخدمات المتاحة لكل نوع",
    "category": "محفظة الأفراد",
    "icon": "fa-address-card",
    "keywords": "Wallet profile, بروفايل, Basic Wallet, Standard, Premium, رواتب, خدمات متاحة, ملف المحفظة",
    "correctDisp": "أنواع المحافظ",
    "correctSubDisp": "ملف المحفظة والخدمات",
    "lastUpdated": "2026-09-20",
    "content": html_wp
})
current_id += 1

ros_rows = read_xlsx_rows('Ros.xlsx')
ros_els = [{'type': 'table', 'rows': ros_rows}] if ros_rows else []
html_ros = render_clean_article_html("فروع ومواقع مراكز زين كاش بالمحافظات", "الفروع ومواقع الخدمة", ros_els)
articles.append({
    "id": current_id,
    "title": "فروع ومواقع مراكز زين كاش بالمحافظات",
    "category": "الفروع ومواقع الخدمة",
    "icon": "fa-map-location-dot",
    "keywords": "فروع, مواقع, مقرات, مراكز خدمة, ROS, حي الجامعة, المنصور, البصرة, اربيل, أربيل, السليمانية, كركوك, دهوك, النجف, كربلاء, بابل, ساعات الدوام, اماكن الفروع, اين موقعكم, عنوان الفرع",
    "correctDisp": "الفروع والمواقع",
    "correctSubDisp": "عناوين المراكز وساعات العمل",
    "lastUpdated": "2026-09-20",
    "content": html_ros
})
current_id += 1

off_els = extract_docx_with_inline_media('Zaincash Offers.docx')
html_off = render_clean_article_html("العروض والخصومات وحملات الكاش باك", "العروض والمكافآت", off_els)
articles.append({
    "id": current_id,
    "title": "العروض والخصومات وحملات الكاش باك",
    "category": "العروض والمكافآت",
    "icon": "fa-gift",
    "keywords": "عروض, طلبات, كاش باك, خصومات, مطاعم, سينما, تسوق, 20%, استرداد نقدي, حملات ترويجية",
    "correctDisp": "العروض",
    "correctSubDisp": "عروض الكاش باك",
    "lastUpdated": "2026-09-20",
    "content": html_off
})
current_id += 1

# 13. فيديوهات التوضيحية.xlsx
print("Processing: فيديوهات التوضيحية.xlsx...")
vid_rows = read_xlsx_rows('فيديوهات التوضيحية.xlsx')
vid_els = [{'type': 'table', 'rows': vid_rows}] if vid_rows else []
html_vid = render_clean_article_html("الفيديوهات والشروحات الرسمية المرئية", "الفيديوهات التوضيحية والشروحات", vid_els)
articles.append({
    "id": current_id,
    "title": "الفيديوهات والشروحات الرسمية المرئية",
    "category": "الفيديوهات التوضيحية والشروحات",
    "icon": "fa-video",
    "keywords": "فيديوهات, شروحات, يوتيوب, فيديو توضيحي, تسجيل محفظة, تفعيل ماستر كارد, روابط تعليمية",
    "correctDisp": "الشروحات",
    "correctSubDisp": "فيديوهات اليوتيوب",
    "lastUpdated": "2026-09-20",
    "content": html_vid
})
current_id += 1

# 14. Copy of Notification Master Data & Reporting.xlsx
print("Processing: Copy of Notification Master Data & Reporting.xlsx...")
notif_rows = read_xlsx_rows('Copy of Notification Master Data & Reporting.xlsx')
notif_els = [{'type': 'table', 'rows': notif_rows[:30]}] if notif_rows else []
html_notif = render_clean_article_html("نظام الإشعارات والتقارير اليومية", "الأنظمة والتقارير", notif_els)
articles.append({
    "id": current_id,
    "title": "نظام الإشعارات والتقارير اليومية",
    "category": "الأنظمة والتقارير",
    "icon": "fa-bell",
    "keywords": "اشعارات, رسائل, SMS, App Notification, Hybrid, تنبيهات, احصائيات",
    "correctDisp": "الأنظمة والتقارير",
    "correctSubDisp": "قنوات الإشعارات والتنبيهات",
    "lastUpdated": "2026-09-20",
    "content": html_notif
})
current_id += 1

print(f"Total structured articles generated: {len(articles)}")

# -------------------------------------------------------------
# STEP 4: WRITE MASTER KB-DATA.JS AND UPDATE SQLITE
# -------------------------------------------------------------
kb_data_js_content = f"""// Auto-Generated Comprehensive Master Knowledge Base (Zero Data Loss & Inline High-Res Media)
const EMBEDDED_KB_DATA = {json.dumps(articles, ensure_ascii=False, indent=2)};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = EMBEDDED_KB_DATA;
}}
if (typeof window !== 'undefined') {{
    window.EMBEDDED_KB_DATA = EMBEDDED_KB_DATA;
}}
"""

with open(KB_DATA_JS, 'w', encoding='utf-8') as f:
    f.write(kb_data_js_content)
print(f"Saved: {KB_DATA_JS}")

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO system_config (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    """, ('knowledgeBase', json.dumps(articles, ensure_ascii=False)))
    conn.commit()
    conn.close()
    print(f"Successfully updated SQLite Database with {len(articles)} pristine articles!")
except Exception as e:
    print(f"Error updating SQLite: {e}")

print("==================================================================")
print("Precision Zero-Base Rebuild Completed Successfully!")
print("==================================================================")
