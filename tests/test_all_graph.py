from pathlib import Path

def test_all_graph_routes():
 s=Path('backend/server.py').read_text()
 assert "@app.get('/api/graph/all'" in s
 assert "@app.get('/graph/all'" in s
 assert "SELECT * FROM nodes ORDER BY" in s
 assert "SELECT * FROM edges" in s

def test_graph_page():
 s=Path('backend/all-graph.html').read_text()
 assert '/api/graph/all' in s
 assert '学科' in s and 'sort_index' in s
 assert 'select(n.key' in s
