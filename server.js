// server.js
const app = require("./app");
const PORT = 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the server instance for testing
module.exports = server;

// --- 新增 /api/time 路由 ---
// 假設您的 Express 應用程式物件命名為 'app'
app.get('/api/time', (req, res) => {
    // 使用 new Date().toISOString() 取得當前時間的 ISO 8601 格式字串
    const currentTimeISO = new Date().toISOString();

    // 回傳 JSON 物件
    res.status(200).json({ currentTime: currentTimeISO });
});
// ---------------------------
