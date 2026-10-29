/* Primary experiment 12, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','乘法阵列','排队和座位','用行数和列数建立乘法模型。',[['行数',1,10,4,1],['每行人数',1,10,6,1]],p=>[`${p[0]} 行 × ${p[1]} 人/行 = ${p[0]*p[1]} 人`,p[0]*p[1],100],'假设每行人数相同，且没有空座位。',['number','ratio','rules'],'grid'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.11',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
