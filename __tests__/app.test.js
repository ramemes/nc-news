const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const endpointsFile = require('../endpoints.json')
const toBeSorted = require("jest-sorted")


beforeAll(() => seed(testData));
afterAll(() => {
   return db.end();
});

describe("general errors", () => {
    test("returns 404 for unknown url", () => {
        return request(app).get('/api/topcs')
        .expect(404)
    })
    test("returns 404 for unknown url", () => {
        return request(app).get('/api/artcls')
        .expect(404)
    })
})
 
describe("GET/api/topics", () => {
    test("returns an array of topics  with the correct values", () => {
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
        .then(({ body }) => {
            expect(endpointsFile).toMatchObject(body.apiEndPoints)
        } )
    })
})

describe("GET /api/articles/:article_id", () => {
    test("responds with correct article object", () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {{
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
        .then(({ body }) => {{
            expect(body.msg).toBe("article with ID: 333 does not exist")
        }})
    })

    test("responds with error code if invalid ID format given", () => {
        return request(app).get('/api/articles/one')
        .expect(400)
        .then(({ body }) => {{

            expect(body.msg).toBe("invalid article id format")
        }})
    })
})

describe("GET/api/articles", () => {
    test("returns an array of topics  with the correct values", () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            body.articles.forEach((article) => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("number")
            })
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
            expect(body.articles.length).toBe(13)
        })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("returns an array of comments for the given article_id", () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe("number")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.created_at).toBe("string")
                expect(typeof comment.author).toBe("string")
                expect(typeof comment.body).toBe("string")
                expect(typeof comment.article_id).toBe("number")
            }) 
            expect(body.comments.length).toBe(11)   
        })
    })
    test("returns correct error if article_id doesnt exist", () => {
        return request(app).get('/api/articles/1223/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`article with ID: 1223 does not exist`)   
        })
    })

    test("returns correct error if incorrect format given", () => {
        return request(app).get('/api/articles/dasads/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid article id format")   
        })
    })

})