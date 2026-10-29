/* Primary experiment 04, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const experiment={name:'科学测量',title:'植物生长记录',description:'调整每天平均生长量，观察一个简化的线性增长模型。真实植物不会永远匀速生长。',params:[['每天生长(mm)',0,12,4,1],['天数',1,7,5,1]],calc:p=>({text:`起始高度 30 mm + ${p[0]} mm/天 × ${p[1]} 天 = ${30+p[0]*p[1]} mm`,limit:'假设每天增长相同，忽略日照、水分、温度与个体差异；仅用于数量关系入门。',links:['growth','comparison','statistics','observation']}),draw:(ctx,W,H,p)=>{const max=30+p[0]*p[1];axes(ctx,W,H);ctx.beginPath();for(let i=0;i<=p[1];i++){const x=45+i*(W-80)/p[1],y=H-45-(30+p[0]*i)/115*(H-100);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#70e1b6';ctx.lineWidth=4;ctx.stroke();label(ctx,`${max} mm`,W-95,48)}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.3',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
