import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public'


def test_every_primary_math_topic_has_an_experiment_plugin():
    source = (ROOT / 'content' / 'catalog.js').read_text()
    data = json.loads(source.split('=', 1)[1].split(';', 1)[0])['primary']
    names = []
    for plugin in sorted((ROOT / 'plugins' / 'primary').glob('experiment-*.js')):
        text = plugin.read_text()
        match = re.search(r"name:'([^']+)'", text) or re.search(r"\[\s*'[^']*'\s*,\s*'([^']+)'", text)
        assert match, plugin.name
        names.append(match.group(1))
    assert len(names) == len(set(names)) == 43
    missing = [(node, topic[0], topic[5]) for node, topics in data.items() for topic in topics if topic[5] not in names]
    assert not missing


def test_each_primary_page_loads_all_plugins_before_primary_script():
    for name in ('primary.html', 'primary-experiments.html'):
        html = (ROOT / name).read_text()
        for i in range(43):
            assert f'plugins/primary/experiment-{i:02}.js' in html
        assert html.index('plugins/primary/experiment-42.js') < html.index('src="primary.js"')


def test_summary_copy_resolves_standalone_prompt_elements():
    source = (ROOT / 'primary.js').read_text()
    assert "PLAB_SYNC_LEVEL_SECTIONS('primary')" in source
    assert "const area=document.getElementById('summaryPromptText')" in source
    assert "detail.querySelector('#summaryPromptText')" not in source
    assert "createSummaryPrompt(x)" in source


def test_linked_experiment_uses_standalone_lab():
    source = (ROOT / 'primary.js').read_text()
    assert "new URL('primary-experiments.html',location.href)" in source
    assert "window.location.assign(url.href)" in source
