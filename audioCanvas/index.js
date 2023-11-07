const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
const audioEle = document.getElementById('audio');

function initCanvas (){
    canvas.height = window.innerHeight/2 * devicePixelRatio;;
    canvas.width = window.innerWidth * devicePixelRatio;
    // const {width,height} = canvas;
    // ctx.beginPath();
    // ctx.fillRect(0,0,width,height)
}
initCanvas();




let isInit = false;
let dataArray;
/** @type {AnalyserNode} */
let analyser;
audioEle.onplay = ()=>{
    if(isInit){
        return 
    }
    // 创建音频上下文
    const audCtx = new AudioContext(); 

     //创建音频源节点
    const source = audCtx.createMediaElementSource(audioEle)

    //创建分析器
    analyser = audCtx.createAnalyser(); 

    // 默认2048 分析器节点 时域图  转换频率图 设置变换窗口大小 默认2048
    analyser.fftSize = 512;

    // 创建数组，用于接收分析器节点的分析数据,快速傅立叶变化 对称 图
    dataArray = new Uint8Array(analyser.frequencyBinCount); 

    // 音频源节点 连接 分析器
    source.connect(analyser)

     //分析器 连接 输出
    analyser.connect(audCtx.destination)

    // 分析器
    
    isInit = true;
}


//把分析的波形绘制到canvas上
function draw (){
 requestAnimationFrame(draw);

    // 清空画布
    const {width,height} = canvas;
    if(!isInit){
        return 
    }
    ctx.clearRect(0,0,width,height)

    // 让分析器节点分析出数据到数组
    analyser.getByteFrequencyData(dataArray)

    // 有一半是人耳没法听到的频率， 除2.5 降图谱拉大
    const len = dataArray.length / 2.5 ;
    ctx.fillStyle = "#78C5F7";
    const barWidth = width / len /2 ; //条的宽度; /2画出兑成
    for(let i =0;i<len;i++){
        const data = dataArray[i] // <256;
        const braHeight = data / 255 * height;
        const x = i*barWidth+ width /2;
        const x2 = width/2 - (i + 1)*barWidth
        const y = height - braHeight;
        ctx.fillRect(x,y,barWidth-2, braHeight)

        ctx.fillRect(x2,y,barWidth-2, braHeight)
    }
}
console.log(dataArray)

draw()