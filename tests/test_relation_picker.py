from pathlib import Path

def test_admin_relation_picker_ui():
    html = (Path(__file__).resolve().parents[1] / 'backend/admin.html').read_text()
    for marker in ['id="chooseLinks"','id="linkPicker"','id="pickerSearch"','id="pickerSubject"','id="pickerApply"','pickerCandidates()', 'pickerSelected=new Set(parsedLinkIds())']:
        assert marker in html
    assert "$('f-links').value=[...pickerSelected].filter(id=>allowed.has(id)).join(',')" in html
    assert 'n.id!==own' in html
