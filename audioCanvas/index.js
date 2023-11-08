const canvas = document.getElementById('canvas');
/** @type {HTMLCanvasElement} */
const canvas2 = document.getElementById('canvas2');

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

/** @type {CanvasRenderingContext2D} */
const ctx2 = canvas2.getContext('2d')
const audioEle = document.getElementById('audio');

function initCanvas (){
    canvas.height = window.innerHeight/2 * devicePixelRatio;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas2.height = window.innerHeight/2 * devicePixelRatio;
    canvas2.width = window.innerWidth * devicePixelRatio;
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
        ctx.save();
        ctx.fillStyle = "red";
        // if(data !== 0){
        //     ctx.fillRect(x, y -50, barWidth-2, 5)
        //     ctx.fillRect(x2, y -50, barWidth-2, 5)
        // }
        ctx.restore();
    }
    dataArray && drawCircle(dataArray)
}

draw()

const drawCircle = (dataArray)=>{
    const {width,height} = canvas2;
        ctx2.save();

    ctx2.clearRect(0,0,width,height)
     

    const centerX = width / 2;
    const centerY = height / 2;
    ctx2.translate(centerX, centerY);

    const radius = height / 5;
    ctx2.strokeStyle="#78C5F7";
    ctx2.beginPath();
    
    ctx2.arc(0, 0, height / 5, 0, 2 * Math.PI)
    ctx2.stroke();
    //--- 
    ctx2.fillStyle = "#78C5F7";

    const len = dataArray.length / 2.5 ;
    const arcWidth = 2 * Math.PI *  radius;
    const barWidth = arcWidth / len /2 ; //条的宽度; /2画出兑成
    for(let i =0;i<len;i++){
        // ctx2.save();
        const data = dataArray[i] // <256;

        const angleDegrees = 360/(len-1) ;

        const angleRadians = degreesToRadians(angleDegrees);

       
        const x =  0// radius * Math.cos(angleRadians);

        const y =   radius// * Math.sin(angleRadians);

        // console.log(x,y)
        const braHeight = data / 255 *(centerY  -  radius) ;

        ctx2.fillRect(x, y, barWidth-2, braHeight );
        ctx2.rotate(angleRadians);
        // ctx2.restore();
    }
    ctx2.restore();

}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// drawCircle(dataArray)