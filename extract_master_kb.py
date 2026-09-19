import os
import sys
import json
import zipfile
import re
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

KB_DIR = r'D:\KB'
PROJECT_DIR = r'c:\Users\kaka\Downloads\Test'
MEDIA_DIR = os.path.join(PROJECT_DIR, 'public', 'kb-media')
os.makedirs(MEDIA_DIR, exist_ok=True)

# 1. Extract all images from docx files
image_map = {}
for f in os.listdir(KB_DIR):
    if f.endswith('.docx'):
        doc_path = os.path.join(KB_DIR, f)
        base = os.path.splitext(f)[0].strip()
        image_map[f] = []
        try:
            with zipfile.ZipFile(doc_path, 'r') as z:
                for item in z.namelist():
                    if item.startswith('word/media/'):
                        img_filename = f"{base}_{os.path.basename(item)}"
                        out_path = os.path.join(MEDIA_DIR, img_filename)
                        with open(out_path, 'wb') as out_f:
                            out_f.write(z.read(item))
                        image_map[f].append(img_filename)
        except Exception as e:
            print(f"Error extracting images for {f}: {e}")

print(f"Extracted images map: {len(image_map)} docx files processed.")

def read_docx_paragraphs_and_tables(doc_path):
    elements = []
    with zipfile.ZipFile(doc_path, 'r') as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # We iterate over all children in body in document order
        body = root.find('.//w:body', ns)
        if body is None:
            return elements
        
        for child in body:
            tag = child.tag.split('}')[-1]
            if tag == 'p':
                texts = [node.text for node in child.findall('.//w:t', ns) if node.text]
                p_text = ''.join(texts).strip()
                # check if there's drawing / image
                drawings = child.findall('.//w:drawing', ns)
                elements.append({'type': 'p', 'text': p_text, 'has_drawing': len(drawings) > 0})
            elif tag == 'tbl':
                rows = []
                for tr in child.findall('.//w:tr', ns):
                    cells = []
                    for tc in tr.findall('.//w:tc', ns):
                        tc_texts = [node.text for node in tc.findall('.//w:t', ns) if node.text]
                        cells.append(' '.join(tc_texts).strip())
                    if cells:
                        rows.append(cells)
                if rows:
                    elements.append({'type': 'table', 'rows': rows})
    return elements

def read_xlsx_content(xlsx_path):
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
                    rows.append(cells)
            if rows:
                sheets_data.append(rows)
    return sheets_data

print("Extraction utilities compiled successfully.")
