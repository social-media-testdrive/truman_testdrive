const request = require('supertest');

const { MongoMemoryServer } = require('mongodb-memory-server');

(async() => {
    const mongoServer = await MongoMemoryServer.create();
    const mockMongoDBUri = await mongoServer.getUri();
    process.env.MONGODB_URI = mockMongoDBUri;

    /* eslint-disable global-require */
    const app = require('../app');
    /* eslint-enable global-require */

    describe('GET /', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/')
                .expect(200, done);
        });
    });

    describe('GET /login', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/login')
                .expect(200, done);
        });
    });

    describe('GET /signup', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/signup')
                .expect(200, done);
        });
    });

    describe('GET /api', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/api')
                .expect(200, done);
        });
    });

    describe('GET /contact', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/contact')
                .expect(200, done);
        });
    });

    describe('GET /random-url', () => {
        it('should return 404', (done) => {
            request(app)
                .get('/reset')
                .expect(404, done);
        });
    });
})();