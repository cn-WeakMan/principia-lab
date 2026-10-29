/* Primary experiment 36, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','语文阅读速度','阅读计划与估算','调整文章字数与每分钟阅读字数，估算阅读时长。',[['篇幅(字)',100,1500,600,100],['阅读速度(字/分)',50,300,150,25]],p=>[`估计阅读时间 ${(p[0]/p[1]).toFixed(1)} 分钟`,p[0]/p[1],30],'阅读速度随文本难度和理解要求变化；读得快不等于理解得好。',['ratio','sentence','evidence'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.35',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
