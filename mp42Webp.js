const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
function generateWebPFromVideo(inputVideoPath, outputWebPPath) {
    console.log('Start');

    // 使用 FFmpeg 将视频转换为 WebP 动画
    const command = `ffmpeg -threads 2 -i ${inputVideoPath} -c:v libwebp -loop 0 -compression_level 6 -vf "scale=360:-1" -q 50 ${outputWebPPath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
        } else {
            console.log('Done');
        }
    });
}

function convertVideosInFolder(inputFolder, outputFolder) {
    // 确保输出文件夹存在，如果不存在则创建
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    // 获取输入文件夹中的所有MP4文件
    const inputFiles = fs.readdirSync(inputFolder).filter(file => file.endsWith('.mp4'));

    // 遍历每个文件并进行转换
    inputFiles.forEach(inputFile => {
        const inputFilePath = path.join(inputFolder, inputFile);
        const outputFileName = path.basename(inputFile, path.extname(inputFile)) + '.webp';
        const outputFilePath = path.join(outputFolder, outputFileName);

        console.log(`Converting ${inputFile} to ${outputFileName}`);

        // 使用之前的函数进行转换
        generateWebPFromVideo(inputFilePath, outputFilePath);
    });
}

// 指定输入视频文件和输出WebP图片的路径
const inputVideoPath = 'mp4';
const outputWebPPath = 'webp';

// 生成WebP动画
convertVideosInFolder(inputVideoPath, outputWebPPath);
