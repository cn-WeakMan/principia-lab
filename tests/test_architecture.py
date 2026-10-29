"""Architecture regression tests; all mutating tests use temporary state."""
import json
import sqlite3
import shutil
from fastapi.testclient import TestClient
from backend.core import storage
from backend.core.publishing import javascript_assignment, write_catalog
from backend.plugin_system.registry import PluginRegistry
from backend.plugin_system.builtins import UniformMotion
from backend import server


def test_registry_contract():
    r = PluginRegistry()
    r.register(UniformMotion())
    assert r.metadata() == [{'id': 'physics.uniform_motion', 'version': '1.0.0'}]
    assert r.get('physics.uniform_motion').calculate({'v0': 2, 'a': 1, 't': 5}) == {
        'displacement': 22.5, 'velocity': 7}
    import pytest
    with pytest.raises(ValueError):
        r.register(UniformMotion())
    with pytest.raises(ValueError):
        r.get('physics.uniform_motion').calculate({'v0': float('nan'), 'a': 1, 't': 1})


def test_js_publish_escaping_and_snapshot(tmp_path):
    content = {'bad': '</script>\u2028&'}
    js = javascript_assignment('TEST', content)
    assert '</script>' not in js and '\u2028' not in js and '&' not in js
    write_catalog(tmp_path, content, {}, [], [])
    assert (tmp_path / 'content' / 'nodes.js').is_file()
    assert (tmp_path / 'content' / 'catalog.js').is_file()


def test_publish_backup_is_consistent_and_keeps_original_data(tmp_path, monkeypatch):
    temp_db = tmp_path / 'principia.db'
    shutil.copyfile(storage.DB, temp_db)
    monkeypatch.setattr(storage, 'DB', temp_db)
    monkeypatch.setattr(server, 'DATA', tmp_path)
    temp_public = tmp_path / 'public'
    monkeypatch.setattr(server, 'PUBLIC', temp_public)
    with TestClient(server.app) as c:
        assert c.get('/api/plugins').status_code == 200
        response = c.post('/api/publish')
        assert response.status_code == 200, response.text
        assert response.json()['nodes'] == 82
    backup = tmp_path / 'backup-before-publish.db'
    assert backup.is_file()
    with sqlite3.connect(backup) as db:
        assert db.execute('select count(*) from nodes').fetchone()[0] == 82
        assert db.execute('select count(*) from revisions').fetchone()[0] >= 1
    with sqlite3.connect(storage.ROOT / 'data' / 'principia.db') as db:
        assert db.execute('select count(*) from nodes').fetchone()[0] == 82
