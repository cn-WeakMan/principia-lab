/* Shared rendering safety and knowledge navigation */
window.PLAB_ESCAPE=function(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));};
window.PLAB_EDGES=window.PLAB_EDGES||[];
window.PLAB_CROSS_LINKS=function(level,id){return window.PLAB_EDGES.filter(e=>(e.source_level===level&&e.source_id===id)||(e.target_level===level&&e.target_id===id)).filter(e=>e.source_level!==e.target_level).map(e=>{const from=e.source_level===level&&e.source_id===id;return {level:from?e.target_level:e.source_level,id:from?e.target_id:e.source_id,relation:e.relation}})};

/* One shared, keyboard-accessible knowledge graph renderer for all levels. */
window.PLAB_GRAPH=function({svg,items,selected,level,colors,choose,groups}){
 const NS='http://www.w3.org/2000/svg';svg.replaceChildren();svg.setAttribute('viewBox','0 0 880 600');
 const create=(type,attrs,text)=>{const n=document.createElementNS(NS,type);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n};
 const byId=new Map(items.map(x=>[x.id,x])), edges=window.PLAB_EDGES||[];
 const adjacent=(a,b)=>a.links?.includes(b.id)||b.links?.includes(a.id)||edges.some(e=>e.source_level===level&&e.target_level===level&&((e.source_id===a.id&&e.target_id===b.id)||(e.source_id===b.id&&e.target_id===a.id)));
 // Subject-column layout: each subject owns one vertical lane, ordered by the
 // configured subject order. Positions are deterministic even after filtering.
 const subjectOf=n=>n.group||n.subject||'other';
 const configured=Object.keys(groups||{});
 const present=[...new Set(items.map(subjectOf))];
 const subjects=[...configured.filter(key=>present.includes(key)),...present.filter(key=>!configured.includes(key)).sort()];
 const laneWidth=152, rowHeight=84, top=104, left=80;
 const width=Math.max(880,subjects.length*laneWidth+32);
 const countBySubject=new Map(subjects.map(key=>[key,0]));
 const maxRows=Math.max(1,...subjects.map(key=>items.filter(n=>subjectOf(n)===key).length));
 const height=Math.max(600,top+maxRows*rowHeight+55);
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
 svg.setAttribute('width',String(width));
 svg.setAttribute('height',String(height));
 svg.style.width=`${width}px`;
 svg.style.height=`${height}px`;
 svg.style.maxWidth='none';
 svg.style.display='block';
 const parent=svg.parentElement;
 if(parent){parent.style.overflow='auto';parent.style.maxHeight='650px';parent.style.maxWidth='100%';}
 const coords=items.map(n=>{
  const subject=subjectOf(n);
  const column=subjects.indexOf(subject);
  const row=countBySubject.get(subject)||0;
  countBySubject.set(subject,row+1);
  return {n,x:left+column*laneWidth,y:top+row*rowHeight};
 });
 // Draw subject headings without interfering with keyboard/clickable nodes.
 subjects.forEach((subject,index)=>{
  const label=groups?.[subject];
  const title=Array.isArray(label)?label[0]:(typeof label==='string'?label:subject);
  const x=left+index*laneWidth;
  svg.appendChild(create('text',{x,y:42,'text-anchor':'middle',fill:colors[subject]||'#9eb7c8','font-size':17,'font-weight':700},title));
  svg.appendChild(create('line',{x1:x-62,y1:58,x2:x+62,y2:58,stroke:colors[subject]||'#668095','stroke-width':2,opacity:.6}));
 });
 const links=[];coords.forEach((a,i)=>coords.slice(i+1).forEach(b=>{if(adjacent(a.n,b.n))links.push([a,b])}));
 for(const [a,b] of links)svg.appendChild(create('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'edge'+(a.n.id===selected||b.n.id===selected?' highlight hi':'')}));
 for(const a of coords){const n=a.n,active=n.id===selected,near=byId.has(selected)&&adjacent(n,byId.get(selected)),g=create('g',{transform:`translate(${a.x},${a.y})`,class:'node '+(active?'selected active':near?'linked':'dim muted'),role:'button',tabindex:'0','aria-label':n.name});g.appendChild(create('circle',{r:active?33:29,fill:colors[n.group]||'#497a8a',class:'c_'+n.group}));const parts=n.name.length>7?[n.name.slice(0,7),n.name.slice(7,14)]:[n.name];parts.forEach((v,i)=>g.appendChild(create('text',{x:0,y:(i-(parts.length-1)/2)*12+4,'text-anchor':'middle'},v)));g.onclick=()=>choose(n.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(n.id)}};svg.appendChild(g)}
};
window.PLAB_GRAPH_CONTROLS=function({container,all,level,getSelected,rerender}){
 let depth='all';const panel=document.createElement('div');panel.className='plab-depth';panel.innerHTML='<label>关联层级 <select aria-label="关联层级"><option value="all">全部节点</option><option value="1">直接相邻</option><option value="2">两层关联</option><option value="3">三层关联</option></select></label>';container.appendChild(panel);panel.querySelector('select').onchange=e=>{depth=e.target.value;rerender()};
 return nodes=>{if(depth==='all')return nodes;const ids=new Set([getSelected()]);for(let k=0;k<Number(depth);k++){for(const edge of window.PLAB_EDGES||[]){if(edge.source_level!==level||edge.target_level!==level)continue;if(ids.has(edge.source_id))ids.add(edge.target_id);if(ids.has(edge.target_id))ids.add(edge.source_id)}}return nodes.filter(x=>ids.has(x.id))}
};
/* Restricted recursive descent arithmetic parser: no eval, Function, property access or JavaScript execution. */
window.PLAB_FORMULA=function(expression,variables){
 const tokens=String(expression).match(/(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+*/,%^-]/g)||[];
 if(tokens.join('')!==String(expression).replace(/\s+/g,''))throw Error('公式含不支持的字符');
 let i=0;const functions={abs:Math.abs,min:Math.min,max:Math.max,sqrt:Math.sqrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,log:Math.log,exp:Math.exp,pow:Math.pow,floor:Math.floor,ceil:Math.ceil};
 function atom(){const t=tokens[i++];if(t==='('){const v=add();if(tokens[i++]!==')')throw Error('括号不匹配');return v}if(t==='+'||t==='-'){const v=atom();return t==='-'?-v:v}if(!t)throw Error('公式不完整');if(/^\d|^\./.test(t))return Number(t);if(tokens[i]==='('){if(!Object.hasOwn(functions,t))throw Error('不支持的函数');i++;const args=[];if(tokens[i]!==')'){do{args.push(add());if(tokens[i]!==',')break;i++}while(true)}if(tokens[i++]!==')')throw Error('函数括号错误');return functions[t](...args)}if(t==='pi')return Math.PI;if(t==='e')return Math.E;if(!Object.hasOwn(variables,t))throw Error('未知变量 '+t);return Number(variables[t])}
 function power(){let v=atom();if(tokens[i]==='^'){i++;v=Math.pow(v,power())}return v}
 function mul(){let v=power();while(['*','/','%'].includes(tokens[i])){const op=tokens[i++],b=power();v=op==='*'?v*b:op==='/'?v/b:v%b}return v}
 function add(){let v=mul();while(['+','-'].includes(tokens[i])){const op=tokens[i++],b=mul();v=op==='+'?v+b:v-b}return v}
 const v=add();if(i!==tokens.length||!Number.isFinite(v))throw Error('公式计算无效');return v
};
window.PLAB_CONFIG_LABS=function(level,host){
 const experiments=(window.PLAB_EXPERIMENTS||[]).filter(e=>e.level===level&&e.enabled&&JSON.parse(e.metadata_json||'{}').execution==='formula');if(!experiments.length)return;
 const section=document.createElement('section');section.className='panel plab-config-labs';section.innerHTML='<h2>后台配置的数学模型实验</h2><label>选择实验 <select id="configLabSelect"></select></label><div id="configLabControls"></div><canvas width="780" height="320" id="configLabChart" style="max-width:100%;background:#0c1a27;border-radius:9px"></canvas><p id="configLabResult" role="status"></p>';host.appendChild(section);
 for(const e of experiments){const meta=JSON.parse(e.metadata_json);const id=`${level}.configured.${e.id}`;if(!PLAB_EXPERIMENT_PLUGINS.list().some(p=>p.id===id))PLAB_EXPERIMENT_PLUGINS.register({id,version:String(meta.version||'1.0.0'),level,name:e.name,kind:'formula',run:({x,parameters})=>PLAB_FORMULA(meta.expression,{...parameters,x})})}
 const pick=section.querySelector('select');for(const e of experiments)pick.add(new Option(e.name,e.id));const controls=section.querySelector('#configLabControls'),canvas=section.querySelector('canvas'),result=section.querySelector('#configLabResult');
 function setup(){const e=experiments.find(x=>x.id===pick.value),params=JSON.parse(e.parameters_json),meta=JSON.parse(e.metadata_json);controls.replaceChildren();for(const p of params){const label=document.createElement('label');label.style.cssText='display:inline-flex;gap:7px;align-items:center;margin:9px';label.textContent=p.label||p.id;const input=document.createElement('input');input.type='number';input.step=p.step||'any';input.min=p.min??-100;input.max=p.max??100;input.value=p.value??1;input.dataset.variable=p.id;input.oninput=draw;label.appendChild(input);controls.appendChild(label)}draw()}
 function draw(){const e=experiments.find(x=>x.id===pick.value),meta=JSON.parse(e.metadata_json),values={};controls.querySelectorAll('input').forEach(x=>values[x.dataset.variable]=Number(x.value));const range=meta.domain||[-10,10],points=[];try{for(let i=0;i<121;i++){const x=Number(range[0])+(Number(range[1])-Number(range[0]))*i/120,y=PLAB_EXPERIMENT_PLUGINS.run(`${level}.configured.${e.id}`,{x,parameters:values});if(Number.isFinite(y)&&Math.abs(y)<1e8)points.push([x,y])}if(!points.length)throw Error('无有效计算值');const ys=points.map(p=>p[1]),low=Math.min(...ys),high=Math.max(...ys),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#39576a';ctx.beginPath();ctx.moveTo(24,15);ctx.lineTo(24,h-25);ctx.lineTo(w-12,h-25);ctx.stroke();ctx.strokeStyle='#4bd6be';ctx.fillStyle='#4bd6be';ctx.lineWidth=2;ctx.beginPath();points.forEach(([x,y],i)=>{const px=30+i/120*(w-50),py=h-30-(y-low)/(high-low||1)*(h-55);if(e.chart_type==='scatter'){ctx.fillRect(px-2,py-2,4,4)}else if(e.chart_type==='bar'){if(i%8===0)ctx.fillRect(px-3,py,6,h-30-py)}else{i?ctx.lineTo(px,py):ctx.moveTo(px,py)}});if(e.chart_type==='line')ctx.stroke();result.textContent=`${e.description} ｜ y = ${meta.expression} ｜ 范围 ${low.toFixed(3)}～${high.toFixed(3)}。${meta.limit||''}`}catch(err){result.textContent='计算错误：'+err.message}}
 pick.onchange=setup;setup()
};
