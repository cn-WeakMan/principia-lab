from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/"public"
def test_all_labs_load_live_summary():
    for page in ("primary-experiments.html","junior-lab.html","senior-lab.html"):
        html=(ROOT/page).read_text()
        assert 'src="lab-session.js"' in html
        assert html.index('src="lab-session.js"') > html.index('src="level-renderer.js"')
def test_summary_based_on_actual_result_and_inputs():
    script=(ROOT/"lab-session.js").read_text()
    for term in ('primaryResult','readout','primaryControls','controls','MutationObserver','【当前输入参数】','【模型计算结果】'):
        assert term in script
def test_no_numbered_section_titles():
    renderer=(ROOT/"level-renderer.js").read_text()
    for index in ('01 ·','02 ·','03 ·','04 ·','05 ·'):
        assert f"section('{index}" not in renderer
