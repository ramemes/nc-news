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
    test("returns an array of topics with the correct values", () => {
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

describe("GET /api/articles/:article_id", () => {
    test("responds with correct article object", () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({body}) => {{
            expect(body).toEqual(
                {
                    article: {
                      article_id: 1,
                      title: 'Living in the shadow of a great man',
                      topic: 'mitch',
                      author: 'butter_bridge',
                      body: 'I find this existence challenging',
                      created_at: '2020-07-09T20:11:00.000Z',
                      votes: 100,
                      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }
                  }
            )
        }})
    })
    test("responds with 404 if id doesnt exist", () => {
        return request(app).get('/api/articles/333')
        .expect(404)
        .then(({body}) => {{
            expect(body.msg).toBe("article with ID: 333 does not exist")
        }})
    })

    test("responds with error code if invalid ID format given", () => {
        return request(app).get('/api/articles/one')
        .expect(400)
        .then(({body}) => {{

            expect(body.msg).toBe("invalid article id format")
        }})
    })
})