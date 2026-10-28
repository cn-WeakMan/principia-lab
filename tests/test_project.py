import json, pathlib
from fastapi.testclient import TestClient
from backend.server import app, PUBLIC, connect
c=TestClient(app)
def test_public_pages():
 for path in ['/', '/primary.html','/junior.html','/senior.html','/primary-experiments.html','/content/nodes.js','/content/catalog.js']:
  assert c.get(path).status_code==200,path
def test_private_files():
 for path in ['/backend/server.py','/data/principia.db','/data/seed.db','/scripts/branches.json','/.env','/.venv/bin/python']:
  assert c.get(path).status_code==404,path
def test_integrity():
 assert c.get('/api/check').json()['issues']==[]
 nodes=c.get('/api/nodes').json();assert [len(nodes[k]) for k in ['primary','junior','senior']]==[29,23,30]
def test_reject_broken_link():
 n=c.get('/api/nodes').json()['primary'][0];n['level']='primary';n['links']=['missing-node-123'];assert c.put('/api/nodes',json=n).status_code==400
def test_guard_delete():
 assert c.delete('/api/nodes/primary/fraction').status_code==409
def test_catalog():
 assert c.get('/api/branches').status_code==200
 assert c.get('/api/experiments').status_code==200
 assert c.get('/api/edges').status_code==200
 assert len(c.get('/api/edges').json())>200
def test_cross_level():
 es=c.get('/api/edges').json();assert any(e['source_level']!=e['target_level'] for e in es)
def test_js_syntax():
 import subprocess
 for path in PUBLIC.glob('*.js'):
  assert subprocess.run(['node','--check',str(path)],capture_output=True).returncode==0,path

def test_xlsx_roundtrip():
 from backend.xlsxio import write_xlsx,read_xlsx
 rows={'nodes':[{'id':'abc','name':'中文 & <符号>','formula':'y=x^2'}],'edges':[{'source_id':'abc','target_id':'xyz'}]}
 assert read_xlsx(write_xlsx(rows))==rows
 r=c.get('/api/xlsx/export');assert r.status_code==200
 parsed=read_xlsx(r.content);assert set(parsed)=={'nodes','edges','branches','experiments'}
 assert len(parsed['nodes'])==82

def test_formula_safe():
 from backend.formulas import validate
 assert validate('a*x^2+sin(x)', ['a'])
 import pytest
 with pytest.raises((ValueError,SyntaxError)):validate('__import__("os")',[])
 with pytest.raises(ValueError):validate('a.__class__', ['a'])

def test_shared_renderer():
 shared=(PUBLIC/'shared.js').read_text()
 assert 'window.PLAB_GRAPH=' in shared and 'window.PLAB_FORMULA=' in shared
 for name in ('primary.js','app.js'):
  assert 'PLAB_GRAPH({' in (PUBLIC/name).read_text()
