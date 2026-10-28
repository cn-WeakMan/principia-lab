"""Principia Lab: localhost-first authenticated editorial API and isolated public site."""
from __future__ import annotations
import csv, io, json, os, re, secrets, shutil, sqlite3
from contextlib import contextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from backend.xlsxio import write_xlsx,read_xlsx
from backend.formulas import validate as validate_formula

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'public'
DATA=Path(os.environ.get('PLAB_DATA_DIR',str(ROOT/'data'))).resolve()
DATA.mkdir(parents=True,exist_ok=True)
DB=DATA/'principia.db'
SEED=ROOT/'data'/'seed.db'
if not DB.exists(): shutil.copyfile(SEED,DB)
TOKEN=os.environ.get('PLAB_ADMIN_TOKEN','')
app=FastAPI(title='Principia Lab',docs_url=None,redoc_url=None)
LEVELS=('primary','junior','senior')
GROUPS={'primary':('math','chinese','english','science','civics'),'junior':('math','physics','chemistry','biology','geography','history','computer','economics'),'senior':('math','physics','chemistry','biology','geography','history','computer','economics')}
@contextmanager
def connect():
 db=sqlite3.connect(DB,timeout=15);db.row_factory=sqlite3.Row;db.execute('PRAGMA foreign_keys=ON')
 try:
  yield db;db.commit()
 except Exception:
  db.rollback();raise
 finally:db.close()

def editor(request:Request):
 host=request.client.host if request.client else ''
 if host not in ('127.0.0.1','::1','testclient') and not TOKEN:raise HTTPException(403,'远程编辑必须配置 PLAB_ADMIN_TOKEN')
 if TOKEN and not secrets.compare_digest(request.headers.get('x-admin-token',''),TOKEN):raise HTTPException(401,'需要管理员令牌')
 if request.method in ('PUT','POST','PATCH','DELETE'):
  origin=request.headers.get('origin','')
  if origin and not re.fullmatch(r'https?://(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?',origin):raise HTTPException(403,'跨站修改被拒绝')

def snapshot(db):
 return {t:[dict(r) for r in db.execute('SELECT * FROM '+t)] for t in ('nodes','edges','branches','experiments')}
def revision(db,label):
 db.execute('INSERT INTO revisions(description,snapshot) VALUES (?,?)',(label,json.dumps(snapshot(db),ensure_ascii=False)))
def node_payload(db):
 result={level:[] for level in LEVELS}
 ed={}
 for e in db.execute('SELECT * FROM edges'):
  if e['source_level']==e['target_level']:ed.setdefault((e['source_level'],e['source_id']),set()).add(e['target_id']);ed.setdefault((e['target_level'],e['target_id']),set()).add(e['source_id'])
 for r in db.execute('SELECT * FROM nodes ORDER BY sort_index,id'):
  x=dict(r);result[x['level']].append({'id':x['id'],'name':x['name'],'group':x['group_name'],'formula':x['formula'] or '', 'description':x['description'] or '', 'limit':x['limitation'] or '', 'links':sorted(ed.get((x['level'],x['id']),set())-{x['id']}),'question':x['question'] or ''})
 return result

def catalog(db):
 branches={level:{} for level in LEVELS}
 for x in db.execute('SELECT * FROM branches ORDER BY position'):
  x=dict(x);vals=[x[k] for k in ('title','subtitle','explanation','formula','activity','experiment_name')]
  branches[x['level']].setdefault(x['node_id'],[]).append(vals if x['level']=='primary' else x['title'])
 return branches,[dict(x) for x in db.execute('SELECT * FROM edges')],[dict(x) for x in db.execute('SELECT * FROM experiments')]
def emit(name,var,data):
 payload=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
 (PUBLIC/'content'/name).write_text('/* Generated from published database */\nwindow.'+var+'='+payload+';\n',encoding='utf8')
def publish():
 with connect() as db:
  nodes=node_payload(db);branches,edges,exps=catalog(db)
 emit('nodes.js','PLAB_NODES',nodes)
 (PUBLIC/'content'/'catalog.js').write_text('/* Generated from published database */\n'+''.join('window.'+name+'='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('>','\\u003e')+';\n' for name,data in [('PLAB_BRANCHES',branches),('PLAB_EDGES',edges),('PLAB_EXPERIMENTS',exps)]),encoding='utf8')
 return {'ok':True,'nodes':sum(map(len,nodes.values())),'edges':len(edges),'experiments':len(exps)}
class Node(BaseModel):
 level:str;id:str=Field(min_length=1,max_length=80);name:str=Field(min_length=1,max_length=150);group:str;formula:str='';description:str='';limit:str='';links:list[str]=Field(default_factory=list);question:str=''
class Edge(BaseModel):
 source_level:str;source_id:str;target_level:str;target_id:str;relation:str='related';description:str=''
class Branch(BaseModel):
 level:str;node_id:str;position:int=Field(ge=0);title:str;subtitle:str='';explanation:str='';formula:str='';activity:str='';experiment_name:str=''
class Experiment(BaseModel):
 id:str;level:str;name:str;description:str='';model_key:str='';chart_type:str='canvas';parameters_json:str='[]';metadata_json:str='{}';node_ids_json:str='[]';enabled:int=1

def valid_node(db,level,id):return db.execute('SELECT 1 FROM nodes WHERE level=? AND id=?',(level,id)).fetchone() is not None
@app.get('/api/nodes',dependencies=[Depends(editor)])
def nodes():
 with connect() as db:return node_payload(db)
@app.put('/api/nodes',dependencies=[Depends(editor)])
def save_node(node:Node):
 if node.level not in LEVELS or node.group not in GROUPS.get(node.level,()):raise HTTPException(400,'无效学段或学科')
 if not re.fullmatch('[A-Za-z0-9_-]+',node.id):raise HTTPException(400,'ID 格式错误')
 if node.id in node.links:raise HTTPException(400,'不允许关联自身')
 with connect() as db:
  for tid in node.links:
   if not re.fullmatch('[A-Za-z0-9_-]+',tid) or (tid!=node.id and not valid_node(db,node.level,tid)):raise HTTPException(400,f'关联节点不存在：{tid}')
  revision(db,'保存节点 '+node.level+'/'+node.id)
  old=db.execute('SELECT sort_index FROM nodes WHERE level=? AND id=?',(node.level,node.id)).fetchone()
  idx=old[0] if old else db.execute('SELECT COALESCE(MAX(sort_index),-1)+1 FROM nodes WHERE level=?',(node.level,)).fetchone()[0]
  db.execute('INSERT OR REPLACE INTO nodes VALUES (?,?,?,?,?,?,?,?,?,?)',(node.level,node.id,node.name,node.group,node.formula,node.description,node.limit,'[]',node.question,idx))
  db.execute("DELETE FROM edges WHERE source_level=? AND source_id=? AND target_level=? AND relation='related'",(node.level,node.id,node.level))
  for tid in sorted(set(node.links)):
   db.execute('INSERT OR IGNORE INTO edges VALUES (?,?,?,?,?,?)',(node.level,node.id,node.level,tid,'related',''))
 return {'ok':True,'draft':True}
@app.delete('/api/nodes/{level}/{id}',dependencies=[Depends(editor)])
def delete_node(level:str,id:str,force:bool=False):
 with connect() as db:
  incoming=[dict(e) for e in db.execute('SELECT * FROM edges WHERE (source_level=? AND source_id=?) OR (target_level=? AND target_id=?)',(level,id,level,id))]
  if incoming and not force:raise HTTPException(409,{'message':'有关联关系，请先删除关联或使用 force','edges':incoming})
  revision(db,'删除节点 '+level+'/'+id)
  db.execute('DELETE FROM edges WHERE (source_level=? AND source_id=?) OR (target_level=? AND target_id=?)',(level,id,level,id))
  db.execute('DELETE FROM branches WHERE level=? AND node_id=?',(level,id))
  db.execute('DELETE FROM nodes WHERE level=? AND id=?',(level,id))
 return {'ok':True,'draft':True}
@app.get('/api/edges',dependencies=[Depends(editor)])
def edges():
 with connect() as db:return [dict(x) for x in db.execute('SELECT * FROM edges')]
@app.put('/api/edges',dependencies=[Depends(editor)])
def save_edge(e:Edge):
 if e.source_level not in LEVELS or e.target_level not in LEVELS or not re.fullmatch(r'[a-z_]{2,40}',e.relation):raise HTTPException(400,'关系类型错误')
 with connect() as db:
  if not valid_node(db,e.source_level,e.source_id) or not valid_node(db,e.target_level,e.target_id):raise HTTPException(400,'端点不存在')
  if e.source_level==e.target_level and e.source_id==e.target_id:raise HTTPException(400,'不允许自环')
  revision(db,'编辑关联');db.execute('INSERT OR REPLACE INTO edges VALUES(?,?,?,?,?,?)',tuple(e.model_dump().values()))
 return {'ok':True,'draft':True}
@app.delete('/api/edges/{sl}/{sid}/{tl}/{tid}/{rel}',dependencies=[Depends(editor)])
def delete_edge(sl:str,sid:str,tl:str,tid:str,rel:str):
 with connect() as db:
  revision(db,'删除关联');db.execute('DELETE FROM edges WHERE source_level=? AND source_id=? AND target_level=? AND target_id=? AND relation=?',(sl,sid,tl,tid,rel))
 return {'ok':True}
@app.get('/api/branches',dependencies=[Depends(editor)])
def branches():
 with connect() as db:return [dict(x) for x in db.execute('SELECT * FROM branches ORDER BY level,node_id,position')]
@app.put('/api/branches',dependencies=[Depends(editor)])
def save_branch(v:Branch):
 with connect() as db:
  if not valid_node(db,v.level,v.node_id):raise HTTPException(400,'节点不存在')
  revision(db,'编辑二级目录');db.execute('INSERT OR REPLACE INTO branches VALUES(?,?,?,?,?,?,?,?,?)',tuple(v.model_dump().values()))
 return {'ok':True}
@app.get('/api/experiments',dependencies=[Depends(editor)])
def experiments():
 with connect() as db:return [dict(x) for x in db.execute('SELECT * FROM experiments')]
@app.put('/api/experiments',dependencies=[Depends(editor)])
def save_experiment(v:Experiment):
 if v.level not in LEVELS or not re.fullmatch('[A-Za-z0-9_-]+',v.id):raise HTTPException(400,'非法实验 ID')
 try:
  for raw in [v.parameters_json,v.metadata_json,v.node_ids_json]:json.loads(raw)
  meta=json.loads(v.metadata_json); params=json.loads(v.parameters_json)
  if meta.get('execution')=='formula':
   if not isinstance(params,list) or len(params)>12:raise ValueError('参数必须是数组且不超过12项')
   names=[]
   for item in params:
    if not isinstance(item,dict) or not re.fullmatch(r'[a-zA-Z][a-zA-Z0-9_]*',item.get('id','')):raise ValueError('参数 ID 非法')
    names.append(item['id'])
   validate_formula(meta.get('expression',''),names)
   if v.chart_type not in ('line','scatter','bar'):raise ValueError('不支持的图表类型')
 except (ValueError,SyntaxError,TypeError) as exc:raise HTTPException(400,'模型参数错误：'+str(exc))
 with connect() as db:
  revision(db,'编辑实验');db.execute('INSERT OR REPLACE INTO experiments VALUES(?,?,?,?,?,?,?,?,?,?)',tuple(v.model_dump().values()))
 return {'ok':True}
@app.get('/api/check',dependencies=[Depends(editor)])
def check():
 with connect() as db:
  ids={(x['level'],x['id']) for x in db.execute('SELECT level,id FROM nodes')};issues=[]
  for e in db.execute('SELECT * FROM edges'):
   if (e['source_level'],e['source_id']) not in ids or (e['target_level'],e['target_id']) not in ids:issues.append(dict(e))
  return {'counts':{l:sum(1 for k in ids if k[0]==l) for l in LEVELS},'issues':issues}
@app.post('/api/repair',dependencies=[Depends(editor)])
def repair():
 with connect() as db:
  revision(db,'修复悬空关系')
  changes=db.execute('DELETE FROM edges WHERE NOT EXISTS(SELECT 1 FROM nodes n WHERE n.level=edges.source_level AND n.id=edges.source_id) OR NOT EXISTS(SELECT 1 FROM nodes n WHERE n.level=edges.target_level AND n.id=edges.target_id)').rowcount
 return {'ok':True,'removed':changes}
@app.get('/api/revisions',dependencies=[Depends(editor)])
def revisions():
 with connect() as db:return [dict(x) for x in db.execute('SELECT id,created_at,description FROM revisions ORDER BY id DESC LIMIT 80')]
@app.post('/api/rollback/{revision_id}',dependencies=[Depends(editor)])
def rollback(revision_id:int):
 with connect() as db:
  row=db.execute('SELECT snapshot FROM revisions WHERE id=?',(revision_id,)).fetchone()
  if not row:raise HTTPException(404,'版本不存在')
  revision(db,'回滚前自动备份');data=json.loads(row['snapshot'])
  for table in ('edges','branches','experiments','nodes'):db.execute('DELETE FROM '+table)
  for table,records in data.items():
   for record in records:
    db.execute(f"INSERT INTO {table} ({','.join(record)}) VALUES ({','.join(['?']*len(record))})",tuple(record.values()))
 return {'ok':True}
@app.post('/api/publish',dependencies=[Depends(editor)])
def do_publish():
 with connect() as db:
  revision(db,'发布快照');shutil.copy2(DB,DATA/'backup-before-publish.db')
 return publish()
@app.get('/api/export/{table}',dependencies=[Depends(editor)])
def export_table(table:str):
 if table not in ('nodes','edges','branches','experiments'):raise HTTPException(400,'无效表')
 with connect() as db:records=[dict(r) for r in db.execute('SELECT * FROM '+table)]
 out=io.StringIO();writer=csv.DictWriter(out,fieldnames=list(records[0]) if records else ['id']);writer.writeheader();writer.writerows(records)
 return Response('\ufeff'+out.getvalue(),media_type='text/csv; charset=utf-8',headers={'Content-Disposition':f'attachment; filename="{table}.csv"'})
@app.post('/api/import/{table}',dependencies=[Depends(editor)])
async def import_table(table:str,request:Request):
 if table not in ('branches','experiments'):raise HTTPException(400,'批量导入仅支持 branches、experiments；节点请用逐条校验接口')
 content=(await request.body()).decode('utf-8-sig');records=list(csv.DictReader(io.StringIO(content)))
 if len(records)>5000:raise HTTPException(400,'批次过大')
 with connect() as db:
  revision(db,'批量导入 '+table)
  for item in records:
   fields=([k for k in ('level','node_id','position','title','subtitle','explanation','formula','activity','experiment_name') if k in item] if table=='branches' else [k for k in ('id','level','name','description','model_key','chart_type','parameters_json','metadata_json','node_ids_json','enabled') if k in item]);db.execute(f"INSERT OR REPLACE INTO {table} ({','.join(fields)}) VALUES ({','.join(['?']*len(fields))})",[item[k] for k in fields])
 return {'ok':True,'imported':len(records)}

TABLE_FIELDS={
 'nodes':('level','id','name','group_name','formula','description','limitation','links_json','question','sort_index'),
 'edges':('source_level','source_id','target_level','target_id','relation','description'),
 'branches':('level','node_id','position','title','subtitle','explanation','formula','activity','experiment_name'),
 'experiments':('id','level','name','description','model_key','chart_type','parameters_json','metadata_json','node_ids_json','enabled')
}
@app.get('/api/xlsx/export',dependencies=[Depends(editor)])
def export_xlsx():
 with connect() as db:tables={table:[dict(x) for x in db.execute('SELECT * FROM '+table)] for table in TABLE_FIELDS}
 return Response(write_xlsx(tables),media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',headers={'Content-Disposition':'attachment; filename="principia-content.xlsx"'})
@app.post('/api/xlsx/import',dependencies=[Depends(editor)])
async def import_xlsx(request:Request):
 import zipfile
 try:
  data=await request.body();tables=read_xlsx(data)
  if not tables or any(t not in TABLE_FIELDS for t in tables):raise ValueError('工作表名称不正确')
  count=sum(len(rows) for rows in tables.values())
  if count>5000:raise ValueError('最多一次导入5000行')
  with connect() as db:
   # Validate a complete candidate graph first; no partial writes.
   candidates={t:[dict(x) for x in db.execute('SELECT * FROM '+t)] for t in TABLE_FIELDS}
   for table,rows in tables.items():
    pk={'nodes':('level','id'),'edges':('source_level','source_id','target_level','target_id','relation'),'branches':('level','node_id','position'),'experiments':('id',)}[table]
    if any(not set(pk).issubset(r) or not set(r).issubset(TABLE_FIELDS[table]) for r in rows):raise ValueError(table+' 列名或主键不正确')
    indexed={tuple(str(x.get(k,'')) for k in pk):x for x in candidates[table]}
    for r in rows:indexed[tuple(str(r[k]) for k in pk)]=dict(r)
    candidates[table]=list(indexed.values())
   ids={(r['level'],r['id']) for r in candidates['nodes']}
   for r in candidates['nodes']:
    if r['level'] not in LEVELS or r['group_name'] not in GROUPS[r['level']]:raise ValueError('节点学段或学科无效')
   for r in candidates['edges']:
    if (r['source_level'],r['source_id']) not in ids or (r['target_level'],r['target_id']) not in ids:raise ValueError('存在悬空关联')
   for r in candidates['branches']:
    if (r['level'],r['node_id']) not in ids:raise ValueError('目录引用不存在的节点')
   for r in candidates['experiments']:
    v=Experiment(**r);meta=json.loads(v.metadata_json);params=json.loads(v.parameters_json)
    if meta.get('execution')=='formula':validate_formula(meta.get('expression',''),[x['id'] for x in params])
   revision(db,'导入 Excel')
   for table,rows in tables.items():
    cols=TABLE_FIELDS[table]
    for row in rows:
     record={k:row[k] for k in cols if k in row}
     db.execute(f"INSERT OR REPLACE INTO {table} ({','.join(record)}) VALUES ({','.join('?' for _ in record)})",list(record.values()))
  return {'ok':True,'imported':count,'tables':list(tables),'draft':True}
 except (ValueError,KeyError,TypeError,sqlite3.Error,zipfile.BadZipFile) as exc:raise HTTPException(400,str(exc))

@app.get('/admin',response_class=HTMLResponse)
def admin():return (ROOT/'backend'/'admin.html').read_text(encoding='utf8')
app.mount('/',StaticFiles(directory=PUBLIC,html=True),name='public')
if not (PUBLIC/'content'/'catalog.js').exists():publish()
