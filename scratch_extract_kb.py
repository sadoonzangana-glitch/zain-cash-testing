# -*- coding: utf-8 -*-
import os, sys, zipfile, json, re
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

KB_DIR = r"D:\KB"
OUTPUT_JSON = r"c:\Users\kaka\Downloads\Test\data_kb_extracted.json"

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find all text nodes
            paragraphs = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                p_text = ''.join(texts).strip()
                if p_text:
                    paragraphs.append(p_text)
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error extracting docx: {e}"

def extract_xlsx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            # Read shared strings if present
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
                for si in ss_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                    texts = [t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text]
                    shared_strings.append(''.join(texts))
            
            # Read sheets
            sheet_rows = []
            for name in z.namelist():
                if name.startswith('xl/worksheets/sheet') and name.endswith('.xml'):
                    s_tree = ET.fromstring(z.read(name))
                    for row in s_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                        row_vals = []
                        for c in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                            t = c.get('t')
                            if v is not None and v.text:
                                val = v.text
                                if t == 's' and int(val) < len(shared_strings):
                                    val = shared_strings[int(val)]
                                row_vals.append(val)
                        if row_vals:
                            sheet_rows.append(' | '.join(row_vals))
            return '\n'.join(sheet_rows)
    except Exception as e:
        return f"Error extracting xlsx: {e}"

extracted_data = []

for filename in os.listdir(KB_DIR):
    full_path = os.path.join(KB_DIR, filename)
    if os.path.isfile(full_path):
        ext = os.path.splitext(filename)[1].lower()
        title = os.path.splitext(filename)[0].strip()
        print(f"Processing: {filename} ({ext})")
        
        content = ""
        if ext == '.docx':
            content = extract_docx(full_path)
        elif ext == '.xlsx':
            content = extract_xlsx(full_path)
        elif ext == '.pdf':
            content = f"PDF Document: {title}"
        
        if content:
            extracted_data.append({
                "filename": filename,
                "title": title,
                "extension": ext,
                "char_count": len(content),
                "preview": content[:300],
                "full_content": content
            })

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, ensure_ascii=False, indent=2)

print(f"\nExtracted {len(extracted_data)} files successfully to {OUTPUT_JSON}")
