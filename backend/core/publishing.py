"""Atomic publication of browser-readable content snapshots."""
from __future__ import annotations
import json
import os
import tempfile
from pathlib import Path


def javascript_assignment(name: str, value) -> str:
    # Escaping also protects script embedding and JS source line separators.
    data = json.dumps(value, ensure_ascii=False, separators=(',', ':'))
    for old, new in (('&', '\\u0026'), ('<', '\\u003c'), ('>', '\\u003e'),
                     ('\u2028', '\\u2028'), ('\u2029', '\\u2029')):
        data = data.replace(old, new)
    return f'window.{name}={data};\n'


def atomic_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile('w', encoding='utf-8', dir=path.parent,
                                         prefix=f'.{path.name}.', suffix='.tmp',
                                         delete=False) as out:
            temp_name = out.name
            out.write(content)
            out.flush()
            os.fsync(out.fileno())
        os.replace(temp_name, path)
    finally:
        if temp_name and os.path.exists(temp_name):
            os.unlink(temp_name)


def write_catalog(public: Path, nodes, branches, edges, experiments):
    content = public / 'content'
    atomic_write(content / 'nodes.js',
                 '/* Generated from published database */\n' + javascript_assignment('PLAB_NODES', nodes))
    atomic_write(content / 'catalog.js',
                 '/* Generated from published database */\n' + ''.join([
                     javascript_assignment('PLAB_BRANCHES', branches),
                     javascript_assignment('PLAB_EDGES', edges),
                     javascript_assignment('PLAB_EXPERIMENTS', experiments)]))
