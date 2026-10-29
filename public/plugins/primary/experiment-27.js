/* Primary experiment 28, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','资源循环利用','重复使用纸张','比较双面使用与单面使用的纸张需求。',[['需要印的页数',2,100,40,2]],p=>[`单面需要 ${p[0]} 张；双面至少需要 ${Math.ceil(p[0]/2)} 张；节约 ${p[0]-Math.ceil(p[0]/2)} 张`,p[0]-Math.ceil(p[0]/2),100],'假设纸张大小和打印内容一致；并非所有材料都适合双面打印。',['water','ratio','reasoning'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.27',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
