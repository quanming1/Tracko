// 接收二进制数据处理
self.onmessage = function (e) {
    if (e.data.action === 'process') {
        console.log("接受到了文件", performance.now() - e.data.timestamp + 'ms');

        // // 模拟数据处理（此处可替换为实际业务逻辑）
        // const uint8Array = new Uint8Array(arrayBuffer);
        // const hash = Array.from(uint8Array)
        //     .slice(0, 16)  // 取前16字节作为示例
        //     .map(b => b.toString(16).padStart(2, '0'))
        //     .join('');

        // console.log(`Worker 接收数据大小：${(arrayBuffer.byteLength / 1024).toFixed(2)}KB`);
        // console.log(`传输+处理总耗时：${(performance.now() - receiveTime).toFixed(2)}ms`);

        // 返回处理结果
        self.postMessage({
            status: 'success',
        });
    }
};