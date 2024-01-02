const { exec } = require('child_process');
const path = require('path');

function convertImagesToWebP() {
    const inputPattern = path.join(__dirname, 'xxx', 'xxxxx_%05d.png'); // 输入图片模式
    const outputGifPath = 'xxx.webp'; // 输出动图路径

    const command = `ffmpeg -framerate 60 -i ${inputPattern} -loop 0 -y ${outputGifPath}`;

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

convertImagesToWebP();
