/* eslint-disable no-async-promise-executor */

function importSparkMD5(): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js";
    script.onload = () => {
      // @ts-ignore
      resolve(window.SparkMD5 as ISafeAny);
    };
    script.onerror = () => {
      reject(new Error("加载spark-md5失败"));
    };
    document.head.appendChild(script);
  });
}

/**
 * 获取文件的MD5值
 * @param file 文件对象
 * @returns Promise<string> MD5值
 */
export const calcFileMD5 = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("开始计算文件MD5:", file.name);
      console.log("文件大小:", (file.size / 1024 / 1024).toFixed(2) + "MB");

      const startTime = Date.now();
      const SparkMD5 = await importSparkMD5();
      const spark = new SparkMD5.ArrayBuffer();
      const chunkSize = 2 * 1024 * 1024; // 2MB chunks
      const chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;

      const readNextChunk = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          spark.append(e.target?.result);
          currentChunk++;

          if (currentChunk < chunks) {
            readNextChunk();
          } else {
            const md5 = spark.end();
            const endTime = Date.now();
            console.log("MD5计算完成,耗时:", ((endTime - startTime) / 1000).toFixed(2) + "秒");
            resolve(md5);
          }
        };

        fileReader.onerror = () => {
          reject(new Error("文件读取失败"));
        };

        const chunk = file.slice(start, end);
        fileReader.readAsArrayBuffer(chunk);
      };

      readNextChunk();
    } catch (err) {
      reject(err);
    }
  });
};
