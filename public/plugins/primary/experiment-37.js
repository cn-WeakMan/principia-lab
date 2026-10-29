/* Primary experiment 38, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','影子方向记录','一天里的影子','用假设的四个观测时段，比较影长和方向记录。',[['上午影长(cm)',10,100,60,5],['中午影长(cm)',10,100,25,5]],p=>[`上午影长 ${p[0]} cm，中午影长 ${p[1]} cm；差值 ${Math.abs(p[0]-p[1])} cm`,p[0],100,p[1]],'具体影长受季节、纬度、地面和太阳高度角影响；中午并非处处必然最短。',['shadows','measurement','observation'],'dual'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.37',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
