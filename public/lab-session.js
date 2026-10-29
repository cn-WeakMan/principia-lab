/* Standalone simulator: summarize the actual on-screen calculation, not a generic node prompt. */
(function(){
  'use strict';
  const primary=document.body.dataset.primaryLab==='yes';
  const secondary=document.body.dataset.lab==='yes';
  if(!primary&&!secondary)return;
  const boot=()=>{
    const source=document.getElementById(primary?'primaryResult':'readout');
    const controls=document.getElementById(primary?'primaryControls':'controls');
    const experiment=document.getElementById(primary?'primaryExperimentSection':'embeddedExperiment');
    if(!source||!controls||!experiment)return;
    const card=document.createElement('section');card.className='plab-session-summary';
    const heading=document.createElement('h2');heading.textContent='当前交互数据总结';
    const note=document.createElement('p');note.textContent='以下记录当前模型、输入值、计算结果及适用条件。改变参数或切换实验会自动更新。';
    const output=document.createElement('textarea');output.rows=9;output.readOnly=true;output.setAttribute('aria-label','当前模型交互数据总结');
    const copy=document.createElement('button');copy.type='button';copy.textContent='复制当前总结';
    const status=document.createElement('span');status.setAttribute('role','status');
    card.append(heading,note,output,copy,status);experiment.after(card);
    const update=()=>{
      const name=(document.getElementById(primary?'experimentTitle':'expIntro')?.textContent||'当前模型').trim();
      const inputs=[...controls.querySelectorAll('input')].map(el=>{
        const label=el.closest('.control')?.querySelector('label')?.textContent||el.closest('label')?.textContent||el.dataset.key||el.name||'参数';
        return `${label.trim()}：${el.value}`;
      });
      const result=source.textContent.trim();
      const limit=document.getElementById(primary?'primaryLimit':'assumptions')?.textContent.trim()||'未标注';
      output.value=`【实验模型】${name}\n【当前输入参数】\n${inputs.length?inputs.join('\n'):'无可调参数'}\n【模型计算结果】\n${result||'尚无计算输出'}\n【适用条件与限制】\n${limit}\n【说明】以上为当前页面实际计算状态的记录，参数改变后需要重新理解结果；它不是自动推导的科学结论。`;
    };
    let inUpdate=false;
    const observer=new MutationObserver(()=>{if(inUpdate)return;inUpdate=true;try{update()}finally{inUpdate=false}});
    observer.observe(source,{subtree:true,childList:true,characterData:true});
    const name=document.getElementById(primary?'experimentTitle':'expIntro');if(name)observer.observe(name,{subtree:true,childList:true,characterData:true});
    controls.addEventListener('input',()=>queueMicrotask(update));
    document.addEventListener('click',e=>{if(e.target.closest('[data-mode],#switchMode'))queueMicrotask(update)});
    copy.addEventListener('click',async()=>{try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(output.value);status.textContent='已复制';}else{output.focus();output.select();status.textContent='已选中文字，请按 Command+C 或 Ctrl+C';}}catch{output.focus();output.select();status.textContent='请选择文字后手动复制';}});
    update();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
