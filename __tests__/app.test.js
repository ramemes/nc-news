const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const endpointsFile = require('../endpoints.json')

beforeAll(() => seed(testData));
afterAll(() => {
   return db.end();
});

describe("general errors", () => {
    test("returns 404 for unknown url", () => {
        return request(app).get('/api/topcs')
        .expect(404)
    })
})

describe("GET/api/topics", () => {
    test("returns an array of treasures with the correct values", () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
            expect(body.topics.length).toBe(3)
        })
    })
})

describe("GET /api", () => {
    test("provide a description of all other endpoints available", () => {
        return request(app).get('/api')
        .expect(200)
        .then(({body}) => {
            expect(endpointsFile).toMatchObject(body.apiEndPoints)
        } )
    })
})