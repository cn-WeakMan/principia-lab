from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]

def test_subject_columns_and_vertical_order():
    js = r'''
    global.window = {};
    const make=(tag)=>({tag,attributes:{},children:[],style:{},setAttribute(k,v){this.attributes[k]=String(v)},appendChild(c){this.children.push(c)},replaceChildren(){this.children=[]},set textContent(v){this.text=v}});
    global.document={createElementNS:(_ns,tag)=>make(tag)};
    require('./public/shared.js');
    const wrapper={style:{}};const svg=make('svg');svg.parentElement=wrapper;
    const items=[{id:'a',name:'甲',group:'math',links:['b']},{id:'x',name:'物甲',group:'physics',links:[]},{id:'b',name:'乙',group:'math',links:[]},{id:'y',name:'物乙',group:'physics',links:[]}];
    window.PLAB_GRAPH({svg,items,selected:'a',level:'junior',colors:{math:'#777',physics:'#999'},choose:()=>{},groups:{math:'数学',physics:'物理'}});
    const nodes=svg.children.filter(x=>x.tag==='g');
    if(nodes.length!==4)throw Error('Missing nodes');
    const xy=nodes.map(x=>x.attributes.transform.match(/translate\((\d+),(\d+)\)/).slice(1).map(Number));
    if(xy[0][0]!==xy[2][0]||xy[1][0]!==xy[3][0]||xy[0][0]===xy[1][0])throw Error('Not grouped into columns');
    if(!(xy[2][1]>xy[0][1]&&xy[3][1]>xy[1][1]))throw Error('Not vertically ordered');
    if(wrapper.style.overflow!=='auto')throw Error('Missing overflow for long columns');
    '''
    subprocess.run(['node','-e',js],cwd=ROOT,check=True)
