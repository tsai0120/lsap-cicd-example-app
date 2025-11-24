const request = require('supertest');
// 假設您的 Express app 實例是從 server.js 中匯出
const app = require('../server'); 

/**
 * Helper 函式：檢查字串是否為有效的 ISO 8601 日期時間格式
 * (例如: 2025-11-24T17:13:06.840Z)
 */
const isISO8601 = (str) => {
    // 簡單的正規表達式檢查格式
    // YYYY-MM-DDTHH:mm:ss.sssZ
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(str);
};

describe('GET /api/time', () => {
    it('應該回傳當前時間，並且是有效的 ISO 格式日期字串', async () => {
        // 使用 supertest 發送 GET 請求到 /api/time
        const response = await request(app).get('/api/time');

        // 1. 驗證 HTTP 狀態碼
        expect(response.statusCode).toBe(200);

        // 2. 驗證回應 body 中包含 'currentTime' 屬性
        expect(response.body).toHaveProperty('currentTime');

        const currentTimeString = response.body.currentTime;

        // 3. 驗證回傳的字串格式是否符合 ISO 8601
        expect(isISO8601(currentTimeString)).toBe(true);
    });
});
