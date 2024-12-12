const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 将单个视频文件转换为 WebP 动图
 * @param {string} inputVideoPath - 输入视频文件路径
 * @param {string} outputWebPPath - 输出 WebP 文件路径
 * @param {Object} options - 转换选项
 * @returns {Promise} 转换结果的 Promise
 */
function generateWebPFromVideo(inputVideoPath, outputWebPPath, options = {}) {
    // 解构配置参数，设置默认值
    const {
        width = 360,          // 输出宽度，设为-1表示按比例缩放
        quality = 75,         // 质量参数(0-100)：越高质量越好，文件越大
        fps = 24,            // 每秒帧数：越高越流畅，文件越大
        compression = 4,     // 压缩级别(0-6)：越高压缩率越大，但处理更慢
        threads = 4          // CPU线程数：建议设置为CPU核心数
    } = options;

    console.log(`开始转换: ${path.basename(inputVideoPath)}`);

    // 构建 FFmpeg 命令
    const command = `ffmpeg -threads ${threads} -i "${inputVideoPath}" \
        -c:v libwebp \                   
        -vf "fps=${fps},scale=${width}:-1:flags=lanczos" \  
        -loop 0 \                        
        -compression_level ${compression} \ 
        -q:v ${quality} \                
        -lossless 0 \                     
        -preset picture \            
        -an \                         
        -y "${outputWebPPath}"`;

    // 返回 Promise 用于异步处理
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`转换错误: ${stderr}`);
                reject(error);
                return;
            }
            console.log(`成功转换: ${path.basename(outputWebPPath)}`);
            resolve(stdout);
        });
    });
}

/**
 * 批量转换文件夹中的视频文件
 * @param {string} inputFolder - 输入文件夹路径
 * @param {string} outputFolder - 输出文件夹路径
 * @param {Object} options - 转换选项
 */
async function convertVideosInFolder(inputFolder, outputFolder, options = {}) {
    // 确保输出文件夹存在
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    // 获取所有 MP4 文件
    const inputFiles = fs.readdirSync(inputFolder).filter(file => file.endsWith('.mp4'));

    // 遍历处理每个文件
    for (const inputFile of inputFiles) {
        try {
            const inputFilePath = path.join(inputFolder, inputFile);
            const outputFileName = path.basename(inputFile, path.extname(inputFile)) + '.webp';
            const outputFilePath = path.join(outputFolder, outputFileName);

            console.log(`\n开始处理 ${inputFile}`);
            await generateWebPFromVideo(inputFilePath, outputFilePath, options);
        } catch (err) {
            console.error(`处理 ${inputFile} 时发生错误:`, err);
        }
    }
}

// 定义输入输出路径
const inputVideoPath = './mp4';      // MP4文件所在文件夹
const outputWebPPath = './webp';     // WebP输出文件夹

// 转换参数配置
const conversionOptions = {
    width: 360,      // 输出宽度（像素）
    quality: 75,     // 质量参数（推荐65-80之间）
    fps: 24,         // 帧率（标准帧率，可根据需求调整）
    compression: 4,  // 压缩级别（推荐4-6之间）
    threads: 4       // CPU线程数（建议设置为CPU核心数）
};

// 执行批量转换
convertVideosInFolder(inputVideoPath, outputWebPPath, conversionOptions).catch(console.error);
