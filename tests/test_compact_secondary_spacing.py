from pathlib import Path

CSS = (Path(__file__).resolve().parents[1] / "public" / "style.css").read_text(encoding="utf-8")


def test_compact_spacing_all_levels():
    for level in ("primary", "junior", "senior"):
        assert f'body[data-level="{level}"] .plab-learning-stack' in CSS
        assert f'body[data-level="{level}"] .plab-touch-scroll-zone' in CSS
        assert f'body[data-level="{level}"] .plab-node-section' in CSS
