import os
import sys
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

path = r'D:\KB\خدمات وتحديات محفظة الافراد.docx'
with zipfile.ZipFile(path, 'r') as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)
    
    sections = []
    current_sec = {'title': 'المقدمة', 'paras': []}
    
    keywords = [
        'تسجيل محفظة', 'تحديات تسجيل', 'تسجيل الدخول', 'تحديات تسجيل الدخول',
        'إعادة تعيين وتغيير الرمز السري', 'كيفية إعادة تعيين الرمز السري',
        'تعديل معلومات المحفظة', 'إلغاء المحفظة', 'إيقاف المحفظة',
        'تعبئة المحفظة', 'تحديات التعبئة', 'سحب الاموال', 'سحب الأموال', 'تحديات سحب الاموال',
        'تحويل واستلام الاموال محلي', 'تحويل الاموال الى محافظ اخرى', 'في حال قيام المشترك بتحويل الأموال بشكل خاطئ',
        'بطاقة الماستر كارد', 'تحديات بطاقة الماستر كارد', 'نظام الحساب الموحد لبطاقات Wallet Card',
        'ويسترن يونيون', 'تحديات ويسترن يونيون', 'تحديات اضافة مستفيد جديد',
        'الدفع الى التجار', 'دفع الفواتير', 'تعبئة رصيد', 'البطاقات الإلكترونية',
        'إدارة الحسابات المصرفية', 'تاريخ المعاملات المالية', 'أسئلة الأمان لمحافظ الأفراد', 'حالات الاحتيال'
    ]
    
    for p in body.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        p_text = ''.join(texts).strip()
        if not p_text:
            continue
        
        is_heading = False
        for kw in keywords:
            if p_text == kw or (len(p_text) < 70 and p_text.startswith(kw)):
                is_heading = True
                break
        
        if is_heading:
            if len(current_sec['paras']) > 0:
                sections.append(current_sec)
            current_sec = {'title': p_text, 'paras': []}
        else:
            current_sec['paras'].append(p_text)
    
    if len(current_sec['paras']) > 0:
        sections.append(current_sec)

print(f'Total sections identified: {len(sections)}')
for i, s in enumerate(sections):
    print(f'[{i+1}] {s["title"]} (paras: {len(s["paras"])})')
