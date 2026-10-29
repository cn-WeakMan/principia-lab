"""Small, dependency-free XLSX tabular reader/writer. No formulas or macros evaluated."""
import io, re, zipfile, xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REL='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
MAX_BYTES=8_000_000

def col(n):
 s=''
 while n:n,r=divmod(n-1,26);s=chr(65+r)+s
 return s

def write_xlsx(tables):
 f=io.BytesIO()
 with zipfile.ZipFile(f,'w',zipfile.ZIP_DEFLATED) as z:
  sheets=[];rels=[];types=[]
  for i,(name,records) in enumerate(tables.items(),1):
   headers=list(records[0]) if records else []
   rows=[headers]+[[str(row.get(k,'') if row.get(k,'') is not None else '') for k in headers] for row in records]
   xml=['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetData>']
   for ri,row in enumerate(rows,1):
    xml.append(f'<row r="{ri}">')
    for ci,v in enumerate(row,1):xml.append(f'<c r="{col(ci)}{ri}" t="inlineStr"><is><t xml:space="preserve">{escape(str(v))}</t></is></c>')
    xml.append('</row>')
   xml.append('</sheetData></worksheet>');z.writestr(f'xl/worksheets/sheet{i}.xml',''.join(xml))
   sheets.append(f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>')
   rels.append(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>')
   types.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
  z.writestr('xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+''.join(sheets)+'</sheets></workbook>')
  z.writestr('xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+''.join(rels)+'</Relationships>')
  z.writestr('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+''.join(types)+'</Types>')
  z.writestr('_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')
 return f.getvalue()

def read_xlsx(content):
 if len(content)>MAX_BYTES:raise ValueError('文件超过8MB')
 out={}
 with zipfile.ZipFile(io.BytesIO(content)) as z:
  if sum(x.file_size for x in z.infolist())>MAX_BYTES*5:raise ValueError('解压后数据过大')
  shared=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   root=ET.fromstring(z.read('xl/sharedStrings.xml'))
   shared=[''.join(x.itertext()) for x in root.findall(NS+'si')]
  wb=ET.fromstring(z.read('xl/workbook.xml'))
  relations={}
  relpath='xl/_rels/workbook.xml.rels'
  if relpath in z.namelist():
   for r in ET.fromstring(z.read(relpath)):relations[r.attrib.get('Id')]=r.attrib.get('Target','')
  for sh in wb.findall('.//'+NS+'sheet'):
   rid=sh.attrib.get(REL+'id'); target=relations.get(rid,'')
   path=target.lstrip('/') if target.startswith('/') else 'xl/'+target
   if '..' in path.split('/'):raise ValueError('非法工作表路径')
   if path not in z.namelist():continue
   root=ET.fromstring(z.read(path));matrix=[]
   for r in root.findall('.//'+NS+'sheetData/'+NS+'row'):
    cells={}
    for c in r.findall(NS+'c'):
     m=re.match('[A-Z]+',c.attrib.get('r',''))
     if not m:continue
     n=0
     for letter in m.group():n=n*26+ord(letter)-64
     v=c.find(NS+'v'); inline=c.find(NS+'is')
     value=''.join(inline.itertext()) if inline is not None else (v.text or '' if v is not None else '')
     if c.attrib.get('t')=='s':value=shared[int(value)]
     cells[n-1]=value
    if cells:matrix.append([cells.get(i,'') for i in range(max(cells)+1)])
   if not matrix:out[sh.attrib['name']]=[];continue
   keys=matrix[0];out[sh.attrib['name']]=[dict(zip(keys,[*row,*(['']*max(0,len(keys)-len(row)))])) for row in matrix[1:] if any(str(x).strip() for x in row)]
 return out
