const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * 将PNG序列帧转换为WebP动图
 * @param {Object} options - 转换选项
 * @returns {Promise} 转换结果的Promise
 */
async function convertImagesToWebP(options = {}) {
    // 默认参数配置
    const {
        inputDir = 'frames',           // 输入目录
        outputDir = 'output',          // 输出目录
        frameRates = [12, 16, 20, 24], // 帧率数组
        qualities = [60, 65, 70, 75],  // 质量参数数组
        maxCount = 5,                  // 处理组数
        prefix = 'animation'           // 输出文件前缀
    } = options;

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // 处理每组转换
    for (let i = 1; i <= maxCount; i++) {
        try {
            const inputPattern = path.join(__dirname, `${prefix}${i}`, '*.png');
            const outputWebP = path.join(outputDir, `${prefix}${i}.webp`);

            // 获取当前组的参数
            const frameRate = frameRates[i - 1] || 24;  // 默认24fps
            const quality = qualities[i - 1] || 75;     // 默认质量75

            // 构建ffmpeg命令
            const command = `ffmpeg -i ${inputPattern} \
                -vf "fps=${frameRate}" \    // 设置帧率
                -loop 0 \                   // 永久循环
                -compression_level 4 \      // 压缩级别
                -q:v ${quality} \           // 质量参数
                -preset picture \           // 图片优化预设
                -lossless 0 \              // 有损压缩
                -y ${outputWebP}`;         // 输出文件

            console.log(`开始处理第 ${i} 组图片序列`);
            console.log(`参数配置: 帧率=${frameRate}fps, 质量=${quality}`);

            // 执行转换
            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`转换错误 (组 ${i}): ${error.message}`);
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        console.warn(`警告信息 (组 ${i}): ${stderr}`);
                    }
                    console.log(`成功转换组 ${i}`);
                    resolve(stdout);
                });
            });

        } catch (err) {
            console.error(`处理组 ${i} 时发生错误:`, err);
        }
    }
}

// 转换配置
const conversionOptions = {
    inputDir: 'frames',                    // 输入目录
    outputDir: 'output',                   // 输出目录
    frameRates: [12, 16, 20, 24, 30],     // 不同组的帧率配置
    qualities: [65, 70, 75, 80, 85],      // 不同组的质量配置
    maxCount: 5,                          // 处理组数
    prefix: 'xxxxx'                       // 文件前缀
};

// 执行转换
convertImagesToWebP(conversionOptions).catch(console.error);
