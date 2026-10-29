from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/"public"
def test_unified_sections_for_all_levels():
    renderer=(ROOT/"level-renderer.js").read_text()
    for name in ["section('节点图'","section('基础概念 ｜ 主题分支'","section('双向关联'","section('关联实验 · 动手验证'","section('根据当前主题生成学习总结提示词'"]:
        assert name in renderer
    for level in ("primary", "junior", "senior"):
        html=(ROOT/f"{level}.html").read_text()
        assert 'src="level-renderer.js"' in html
        assert html.index('src="level-renderer.js"') < html.index('src="'+('primary' if level=='primary' else 'app')+'.js"')
def test_prompt_generation_on_both_renderers():
    primary=(ROOT/"primary.js").read_text()
    secondary=(ROOT/"app.js").read_text()
    assert "createSummaryPrompt(x)" in primary
    assert "makeBranchPrompt(x)" in secondary
    assert "PLAB_SYNC_LEVEL_SECTIONS('primary')" in primary
    assert "PLAB_SYNC_LEVEL_SECTIONS(level)" in secondary


def test_no_separate_knowledge_map_panel():
    renderer=(ROOT/"level-renderer.js").read_text()
    assert "plab-map-section" not in renderer
    assert "section('01 · 知识地图'" not in renderer
    assert "if(toolbar)graphSec.append(toolbar)" in renderer


def test_verification_centralized_and_instructions():
    renderer=(ROOT/'level-renderer.js').read_text()
    assert 'plab-workflow-hint' in renderer
    assert '先选择知识节点，再选择详细分支' in renderer
    assert "branch.querySelectorAll('.plab-verification')" in renderer
    assert 'plab-experiment-verification' in renderer
    assert 'class="plab-verification"' in (ROOT/'primary.js').read_text()
    assert 'branch-topic-detail plab-verification' in (ROOT/'app.js').read_text()
