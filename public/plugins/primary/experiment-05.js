/* Primary experiment 06, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const experiment={name:'规则与证据',title:'节水记录与证据',description:'调节每次节水量与每天次数，估算7天节水量；练习分清数据事实与价值建议。',params:[['每次节水(L)',0,3,1,0.5],['每天次数',1,8,3,1]],calc:p=>({text:`${p[0]} L/次 × ${p[1]} 次/天 × 7 天 = ${(p[0]*p[1]*7).toFixed(1)} L / 周`,limit:'假设每次节水量一致，每天次数固定，且不影响必要的清洁与卫生。',links:['water','ratio','reasoning','evidence']}),draw:(ctx,W,H,p)=>{const total=p[0]*p[1]*7;bar(ctx,W,H,total,170,'一周节水 '+total.toFixed(1)+' L')}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.5',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
