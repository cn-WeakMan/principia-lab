/* Primary experiment 02, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const experiment={name:'购物与倍数',title:'预算与购物计划',description:'调整笔的单价和数量，观察总价的变化，检查是否超出20元预算。',params:[['单价（元）',1,10,3,1],['数量（支）',1,10,4,1]],calc:p=>({text:`${p[0]} 元/支 × ${p[1]} 支 = ${p[0]*p[1]} 元；${p[0]*p[1]<=20?'预算内，还剩 '+(20-p[0]*p[1])+' 元':'超预算 '+(p[0]*p[1]-20)+' 元'}`,limit:'忽略折扣、运费和其他费用；预算20元。',links:['ratio','shopping','number','sentence']}),draw:(ctx,W,H,p)=>{const total=p[0]*p[1];bar(ctx,W,H,Math.min(total,100),100,'总价 '+total+' 元');bar(ctx,W,H,20,100,'预算 20 元',95)}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.1',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
