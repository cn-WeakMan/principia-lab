from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def test_associated_experiment_opens_standalone_lab():
    source=(ROOT/'public/primary.js').read_text()
    assert "e.target.closest('[data-math-experiment]')" in source
    assert "new URL('primary-experiments.html',location.href)" in source
    assert "url.searchParams.set('experiment',experiments[i].name)" in source
    assert "window.location.assign(url.href)" in source
    assert "mode=i;setup();document.getElementById('primaryExperimentSection')" not in source
    lab=(ROOT/'public/primary-experiments.html').read_text()
    assert 'src="primary.js"' in lab
    assert 'data-primary-lab="yes"' in lab
    assert "q.get('experiment')" in source
