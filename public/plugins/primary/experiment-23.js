/* Primary experiment 24, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','重复测量误差','同一张桌子量三次','模拟三次读数并求平均。',[['第一次(cm)',90,110,100,1],['第二次(cm)',90,110,102,1],['第三次(cm)',90,110,99,1]],p=>[`三次读数：${p.join('、')} cm；平均 ${(p.reduce((a,b)=>a+b,0)/3).toFixed(2)} cm；极差 ${Math.max(...p)-Math.min(...p)} cm`,p.reduce((a,b)=>a+b,0)/3,110],'平均数不能消除系统性误差，离散程度也不是测量准确度。',['measurement','statistics','evidence'],'dual'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.23',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
