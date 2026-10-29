/* Primary experiment 09, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','长度单位换算','厘米和米的桥梁','改变厘米数，观察相同长度的不同表达。',[['长度(cm)',0,300,125,5]],p=>[`${p[0]} cm = ${(p[0]/100).toFixed(2)} m = ${p[0]*10} mm`,p[0],300],'这里只换算长度；面积、体积的换算因子不同。',['measurement','number','comparison'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.8',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
