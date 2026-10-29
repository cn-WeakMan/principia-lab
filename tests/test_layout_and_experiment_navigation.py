from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]/"public"

def test_concept_on_left_branch_on_right():
    text=(ROOT/"level-renderer.js").read_text()
    assert "基础概念 ｜ 主题分支" in text
    assert text.index("columns.append(detail)") < text.index("columns.append(branch)")

def test_simulator_links_keep_concept_and_validate_modes():
    source=(ROOT/"app.js").read_text()
    assert "&concept=${encodeURIComponent(selected)}" in source
    assert "targetMode>=modes.length" in source
    assert (ROOT/"junior-lab.html").is_file()
    assert (ROOT/"senior-lab.html").is_file()

def test_primary_experiment_link_targets_exact_name():
    source=(ROOT/"primary.js").read_text()
    assert 'primary-experiments.html?experiment=${encodeURIComponent(matchingExperiment.name)}' in source
    assert (ROOT/"primary-experiments.html").is_file()

def test_all_secondary_topic_examples_exist():
    app=(ROOT/"app.js").read_text()
    for level in ("junior","senior"):
        ids=re.findall(r'"([a-z][a-z0-9]+)": \[',app.split('},senior:')[0] if level=="junior" else app.split('},senior:')[-1])
        for concept_id in ids:
            assert (ROOT/"examples"/f"{level}-{concept_id}.html").exists(),(level,concept_id)
