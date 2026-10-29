from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def test_knowledge_page_and_route():
    server=(ROOT/'backend/server.py').read_text()
    page=(ROOT/'backend/all-knowledge.html').read_text()
    assert "@app.get('/knowledge/all'" in server
    assert "'/api/graph/all'" in page
    assert 'grid-template-rows:10vh 70vh 20vh' in page
    assert "item('知识点解释',node.description)" in page
    assert "item('适用范围',node.limitation)" in page
    assert "item('思考问题',node.question)" in page
    assert '知识点解释' in page

def test_database_fields():
    server=(ROOT/'backend/server.py').read_text()
    assert "'limitation':r['limitation'] or ''" in server
    assert "'question':r['question'] or ''" in server
