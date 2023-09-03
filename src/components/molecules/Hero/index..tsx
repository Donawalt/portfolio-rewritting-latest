

import React from 'react';
import Style from './style.module.scss';
const NoiseCanvas = () => {
    React.useEffect(()=>{
        const noise = () => {
          let canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D;
      
          let wWidth: number, wHeight: number;
      
          let noiseData: any[] = [];
          let frame = 0;
      
          let loopTimeout: number | undefined;
      
          // Create Noise
          const createNoise = () => {
            const idata = ctx.createImageData(wWidth, wHeight);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;
      
            for (let i = 0; i < len; i++) {
              if (Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
              }
            }
      
            noiseData.push(idata);
          };
      
          // Play Noise
          const paintNoise = () => {
            if (frame === 9) {
              frame = 0;
            } else {
              frame++;
            }
      
            ctx.putImageData(noiseData[frame], 0, 0);
          };
      
          // Loop
          const loop = () => {
            paintNoise();
      
            loopTimeout = window.setTimeout(() => {
              window.requestAnimationFrame(loop);
            }, 1000 / 25);
          };
      
          // Setup
          const setup = () => {
            wWidth = window.innerWidth;
            wHeight = window.innerHeight;
            
            if(canvas){
              canvas.width = wWidth;
              canvas.height = wHeight;
            }
      
            for (let i = 0; i < 10; i++) {
              createNoise();
            }
      
            loop();
          };
      
          // Reset
          let resizeThrottle: number | undefined;
          const reset = () => {
            window.addEventListener(
              "resize",
              () => {
                window.clearTimeout(resizeThrottle);
      
                resizeThrottle = window.setTimeout(() => {
                  window.clearTimeout(loopTimeout);
                  setup();
                }, 200);
              },
              false
            );
          };
      
          // Init
          const init = (() => {
            canvas = document.getElementById("noise") as HTMLCanvasElement;
            ctx = canvas.getContext("2d")!;
      
            setup();
          });
    
          init();
        };
      
        noise();
      }, [])
    return (<canvas className={Style.noise} id="noise"></canvas>)
}

export default NoiseCanvas;