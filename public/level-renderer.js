/* Shared vertical learning sections, preserving the old controls and renderer instances. */
window.PLAB_BUILD_SECTIONS=function(level){
 const root=document.querySelector('main[data-page-renderer="unified"]');if(!root)return;
 const isPrimary=level==='primary';
 const introduction=root.querySelector('.intro');
 const oldSection=isPrimary?root.querySelector('.primary-section'):null;
 // Remove obsolete primary overview badges; they are not part of the graph.
 if(isPrimary)root.querySelector('.primary-overview')?.remove();
 const toolbar=document.getElementById(isPrimary?'subjectFilters':'filters');
 const graph=document.querySelector(isPrimary?'.primary-graph':'.graph-main');
 const branch=document.getElementById(isPrimary?'primaryBranchSidebar':'branchSidebar');
 const detail=document.getElementById(isPrimary?'primaryDetail':'info');
 const experiment=document.getElementById(isPrimary?'primaryExperimentSection':'embeddedExperiment');
 const area=document.createElement('div');area.className='plab-learning-stack';
 // Dedicated gesture strip: touch scrolling without triggering graph nodes or controls.
 const instruction=document.createElement('p');instruction.className='plab-workflow-hint';instruction.textContent='先选择知识节点，再选择详细分支，最后生成对应的学习总结提示词。';area.append(instruction);
 const touchStrip=document.createElement('div');touchStrip.className='plab-touch-scroll-zone';touchStrip.setAttribute('aria-label','触屏滚动留白区域');touchStrip.setAttribute('title','在此上下滑动页面');area.append(touchStrip);
 const section=(title,klass)=>{const e=document.createElement('section');e.className='plab-learning-section '+klass;const h=document.createElement('h2');h.textContent=title;e.append(h);area.append(e);return e;};
 const graphSec=section('节点图','plab-node-section');
 // Retain the working subject filters and search; only remove the map display panel.
 if(toolbar)graphSec.append(toolbar);
 if(graph)graphSec.append(graph);
 if(introduction)introduction.remove();
 const branchSec=section('基础概念 ｜ 主题分支','plab-branch-section');
 const columns=document.createElement('div');columns.className='plab-branch-columns';branchSec.append(columns);
 // Concept information always on the left; detailed topic branches on the right.
 if(detail)columns.append(detail);if(branch)columns.append(branch);
 section('双向关联','plab-relations-section');
 if(experiment){const exp=section('关联实验 · 动手验证','plab-experiments-section');const tasks=document.createElement('div');tasks.className='plab-experiment-verification';exp.append(tasks);exp.append(experiment);}
 section('根据当前主题生成学习总结提示词','plab-prompt-section');
 const footer=root.querySelector('footer,.foot');if(footer)area.append(footer);
 root.append(area);
 if(oldSection)oldSection.remove();
 const staleLayout=root.querySelector('.layout');if(staleLayout && !staleLayout.children.length)staleLayout.remove();
};
window.PLAB_SYNC_LEVEL_SECTIONS=function(level){
 const root=document.querySelector('main[data-page-renderer="unified"]');if(!root)return;
 const branch=root.querySelector(level==='primary'?'#primaryBranchSidebar':'#branchSidebar');
 const info=root.querySelector(level==='primary'?'#primaryDetail':'#info');
 const relations=root.querySelector('.plab-relations-section');
 const prompt=root.querySelector('.plab-prompt-section');
 if(relations&&info){relations.querySelectorAll('.plab-relations-content').forEach(e=>e.remove());const box=document.createElement('div');box.className='plab-relations-content';info.querySelectorAll('.related').forEach(e=>box.append(e));relations.append(box);}
 const experiments=root.querySelector('.plab-experiment-verification');
 if(experiments&&branch){
   experiments.replaceChildren();
   const parts=branch.querySelectorAll('.plab-verification');
   parts.forEach(part=>experiments.append(part));
   if(!parts.length){const note=document.createElement('p');note.className='plab-verification-empty';note.textContent='选择节点并展开详细分支后，可在这里查看对应验证任务及关联实验。';experiments.append(note);}
 }
 if(prompt&&branch){prompt.querySelectorAll('.plab-prompt-content').forEach(e=>e.remove());const box=document.createElement('div');box.className='plab-prompt-content';const tool=branch.querySelector(level==='primary'?'.math-summary-tool':'.branch-prompt');if(tool)box.append(tool);else{const b=document.createElement('p');b.textContent='当前节点暂无详细数学分支。请选择数学知识点后生成提示词。';box.append(b);}prompt.append(box);}
};

/* Single main-page renderer for all three educational levels. */
(function(){'use strict';
const descriptions={primary:'从数与运算、图形和数量关系出发，连接语文、英语、科学、道德与法治。',junior:'从一次函数、二次函数、方程和坐标开始，探索跨学科数学关系。',senior:'以导数、指数函数、周期函数、概率和向量为主线，探索数学建模。'};
window.PLAB_RENDER_LEVEL=function(level,options={}){
 const target=document.getElementById('app');if(!target)throw Error('Missing main mount');
 const junior=level==='junior';
 const groups=options.groups||{},palette=options.palette||{};
 const inner=level==='primary'?PRIMARY_BODY:SECONDARY_BODY(junior,groups,palette);
 target.innerHTML=`<main class="${level==='primary'?'primary-app':'app'}" data-page-renderer="unified" data-education-level="${level}">${window.PLAB_PAGE_HEADER(level)}${inner}</main>`;
 document.body.dataset.level=level;
 window.PLAB_BUILD_SECTIONS(level);
 return target.firstElementChild;
};
const PRIMARY_BODY=`<p class="intro">从数与运算、图形和数量关系出发，连接语文、英语、科学、道德与法治。点击节点认识概念、观察跨学科联系，再通过实验验证规律。</p><span id="nodeCount" hidden></span><section class="primary-section"><div class="section-head"><div><span class="tag">01 / 节点图</span><h2>一个概念，可以连接多少门学科？</h2></div><p>选择节点或关联标签，探索它在不同学科中的意义。</p></div><div class="primary-toolbar" id="subjectFilters"></div><div class="primary-columns"><aside class="primary-panel primary-branch-side" id="primaryBranchSidebar"><h3>二级目录</h3></aside><div class="primary-panel primary-graph"><input class="search" id="primarySearch" placeholder="搜索概念、知识点或关键词"/><div class="primary-net"><svg aria-label="可点击的跨学科概念网络" id="primaryNetwork" role="img" viewbox="0 0 880 600"></svg></div><div class="primary-legend" id="primaryLegend"></div><p class="primary-note">点击后会高亮直接关联的节点；图幅固定，不使用缩放操作，触屏、Safari、Edge 均可点选。</p></div><article aria-live="polite" class="primary-panel detail" id="primaryDetail"></article></div></section><section class="primary-section" id="primaryExperimentSection"><div class="section-head"><div><span class="tag">02 / 动手验证</span><h2>用小实验把五门学科连起来</h2></div><p>更改变量、检查结果，并思考模型什么时候不适用。</p></div><div class="experiment-tabs" id="primaryExperiments"></div><div class="primary-panel experiment-layout"><div><canvas aria-label="实验结果图表" height="360" id="primaryCanvas" width="660"></canvas></div><div class="experiment-side"><h3 id="experimentTitle"></h3><p id="experimentDesc"></p><div id="primaryControls"></div><div class="primary-result" id="primaryResult"></div><p class="primary-note" id="primaryLimit"></p><div class="experiment-links" id="experimentLinks"></div></div></div></section><footer class="primary-footer">Principia Lab · 教学演示模型，科学结论与道德判断应分别依据证据和规范讨论。离线可用，无第三方依赖。</footer>`;
const SECONDARY_BODY=(junior,groups,palette)=>`<p class="intro">${junior?'从一次函数、二次函数、方程和坐标开始；线性代数仅作为坐标、向量和方程组的直观启蒙，不引入矩阵理论。':'以导数、指数函数、周期函数、概率和向量为主线；积分、梯度下降等标为拓展内容。'} 点击节点查看概念、数学关系及双向关联，点击相邻节点继续探索。</p><div class="toolbar" id="filters"></div><div class="layout"><aside class="panel branch-side" id="branchSidebar"><h2>二级目录</h2></aside><section class="panel graph-main"><h2>双向知识网络 <span class="small" id="count"></span></h2><input id="search" class="search" placeholder="搜索概念 / 学科" aria-label="搜索概念"><div class="network"><svg id="network" viewBox="0 0 800 520" role="img" aria-label="可点击的知识概念关联图"></svg></div><div class="legend">${Object.entries(groups).map(([id,label])=>`<span><i class="dot" style="background:${palette[id]}"></i>${label}</span>`).join('')}</div><p class="small">固定图幅 · 不缩放 · 点击节点高亮直接关联 · 不使用悬浮依赖交互</p></section><aside class="panel info" id="info" aria-live="polite"></aside></div><section class="panel experiment" id="embeddedExperiment"><h2>交互式数学实验</h2><p class="muted" id="expIntro"></p><div class="experiment-wrap"><canvas id="chart" class="chart"></canvas><div><div id="controls" class="controls"></div><p id="readout" class="callout"></p><p class="small" id="assumptions"></p><div class="related"><button id="switchMode" style="background:#1c3044;color:white;border:1px solid #38516a;border-radius:18px;padding:7px 14px">切换实验</button></div></div></div></section><div class="foot">教学模型均标注适用条件；关联表示有共同数学结构，不自动代表因果。内容由后台数据库统一管理。本站为独立可运行分级示范，不含此前项目 ZIP 的原文件合并。</div>`;
})();

