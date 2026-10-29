from pathlib import Path
import subprocess
import json

PUBLIC=Path(__file__).resolve().parents[1] / 'public'

def test_all_entrypoints_load_plugin_system():
    for page in ('primary.html','primary-experiments.html','junior.html','senior.html','junior-lab.html','senior-lab.html'):
        text=(PUBLIC/page).read_text()
        assert 'experiment-plugins.js' in text
        assert text.index('experiment-plugins.js') < text.index('primary.js' if page.startswith('primary') else 'app.js')

def test_models_route_via_registry():
    assert "PLAB_EXPERIMENT_PLUGINS.list('primary')" in (PUBLIC/'primary.js').read_text()
    assert len(list((PUBLIC/'plugins'/'primary').glob('experiment-*.js'))) == 43
    assert 'PLAB_EXPERIMENT_PLUGINS.run' in (PUBLIC/'app.js').read_text()
    assert 'PLAB_EXPERIMENT_PLUGINS.run' in (PUBLIC/'shared.js').read_text()

def test_registry_is_executable_and_rejects_duplicates():
    code="""global.window={};require('./public/experiment-plugins.js');const p=window.PLAB_EXPERIMENT_PLUGINS;p.register({id:'test.demo',version:'1',level:'primary',name:'demo',run:({x})=>x*2});if(p.run('test.demo',{x:3})!==6)process.exit(1);try{p.register({id:'test.demo',version:'1',run:()=>{}});process.exit(2)}catch(e){if(!e.message.includes('Duplicate'))process.exit(3)}"""
    subprocess.run(['node','-e',code],cwd=PUBLIC.parent,check=True)

def test_reference_pages_separate_from_executable_models():
    text=(PUBLIC/'experiment-references.js').read_text().split('=',1)[1].rstrip('\n;')
    refs=json.loads(text)
    assert len(refs)==len(list((PUBLIC/'examples').glob('*.html')))
    assert all((PUBLIC/x['path']).exists() for x in refs)
