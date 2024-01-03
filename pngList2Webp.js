const { exec } = require('child_process');
const path = require('path');

function convertImagesToWebP() {
    let qualityArr = [20, 30, 40, 50, 60, 75]
    // let qualityArr = [20]
    let frameList = [12, 16, 20, 24]
    for (let i = 1; i <= 5; i++) {
        const inputPattern = path.join(__dirname, `xxxxx${i}ys`, '*.png'); // 输入图片模式
        const outputGifPath = `xxxx${i}ys.webp`; // 输出动图路径
        let frame = frameList[i - 1]
        let quality = qualityArr[i - 1]
        const command = `ffmpeg -i ${inputPattern} -vf \"fps=${frame}\"  -loop 0 -qscale ${quality} -y ${outputGifPath}`;
        console.log(command)
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ffmpeg: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`ffmpeg stderr: ${stderr}`);
                return;
            }

            console.log('Conversion complete:', stdout);
        });
    }

}

convertImagesToWebP();
