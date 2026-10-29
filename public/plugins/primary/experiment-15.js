/* Primary experiment 16, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','英语比较级','Which tree is taller?','调整两棵树的高度并练习比较句。',[['Tree A(cm)',10,90,40,5],['Tree B(cm)',10,90,60,5]],p=>[`Tree A is ${p[0]===p[1]?'as tall as':p[0]>p[1]?'taller than':'shorter than'} Tree B. 高度差 ${Math.abs(p[0]-p[1])} cm`,p[0],90,p[1]],'比较同一单位和同一时刻测量的高度。',['comparison','growth','measurement'],'dual'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.15',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
