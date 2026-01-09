import request from 'supertest';
import app from '../src/app.js'; // seu Express app

describe('Teste básico do servidor', () => {
    it('Deve responder na rota raiz /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Blog escolar');
    });
});

