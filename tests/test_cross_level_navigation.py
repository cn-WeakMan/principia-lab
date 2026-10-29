from pathlib import Path
import shutil
import sqlite3

from fastapi.testclient import TestClient


def test_home_graph_preview_and_cross_level_picker():
    home = Path('public/index.html').read_text()
    admin = Path('backend/admin.html').read_text()
    assert 'src="/graph/all?embed=1"' in home
    assert 'href="/knowledge/all"' in home
    assert 'id="crossDialog"' in admin
    assert "request('/api/edges'" in admin
    assert 'crossSelected' in admin


def test_cross_level_edge_roundtrip(tmp_path, monkeypatch):
    import backend.core.storage as storage
    import backend.server as server
    db_path = tmp_path / 'principia.db'
    shutil.copyfile(storage.DB, db_path)
    monkeypatch.setattr(storage, 'DB', db_path)
    # Existing storage.connect resolves its module global DB at call time.
    with sqlite3.connect(db_path) as db:
        a = db.execute("SELECT level,id FROM nodes WHERE level='primary' LIMIT 1").fetchone()
        b = db.execute("SELECT level,id FROM nodes WHERE level='senior' LIMIT 1").fetchone()
    assert a and b
    client = TestClient(server.app)
    relation = dict(source_level=a[0], source_id=a[1], target_level=b[0], target_id=b[1], relation='related', description='跨学段测试')
    # The suite's default environment has no administrator token.
    response = client.put('/api/edges', json=relation)
    assert response.status_code == 200, response.text
    graph = client.get('/api/graph/all')
    assert graph.status_code == 200
    assert any(e['source'] == f'{a[0]}:{a[1]}' and e['target'] == f'{b[0]}:{b[1]}' for e in graph.json()['edges'])
    assert client.delete('/api/edges/'+'/'.join((a[0],a[1],b[0],b[1],'related'))).status_code == 200
    graph2 = client.get('/api/graph/all').json()
    assert not any(e['source'] == f'{a[0]}:{a[1]}' and e['target'] == f'{b[0]}:{b[1]}' and e['description'] == '跨学段测试' for e in graph2['edges'])
