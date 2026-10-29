/* Primary experiment 03, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const experiment={name:'英语天气日记',title:'七天的天气记录',description:'更改一周中晴天的天数，计算占比，学习 sunny、rainy 和图表统计。其余天数简化为 rainy。',params:[['晴天数',0,7,4,1]],calc:p=>({text:`Sunny: ${p[0]} days · Rainy: ${7-p[0]} days · 晴天占比 ${(100*p[0]/7).toFixed(1)}%`,limit:'两类天气只是教学分类，现实中还有阴天、多云等天气，不能用7天代表气候。',links:['statistics','weatherenglish','weather','evidence']}),draw:(ctx,W,H,p)=>{for(let i=0;i<7;i++){const x=35+i*(W-70)/7;ctx.fillStyle=i<p[0]?'#e6bd59':'#548eb6';ctx.fillRect(x,H-90,Math.max(22,(W-100)/9),-95);label(ctx,i<p[0]?'sunny':'rainy',x+22,H-55,12)}}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.2',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
