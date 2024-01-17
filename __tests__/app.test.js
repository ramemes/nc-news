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
            expect(body).toMatchObject(
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
            expect(body.msg).toBe("article_id with value 333 does not exist in articles")
        }})
    })

    test("responds with 404 error code if invalid ID format given", () => {
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
            expect(body.articles.length).toBe(13)
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
        })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("returns an array of comments for the given article_id", () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments.length).toBe(11) 
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe("number")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.created_at).toBe("string")
                expect(typeof comment.author).toBe("string")
                expect(typeof comment.body).toBe("string")
                expect(comment.article_id).toBe(1)
            }) 
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
              
        })
    })
    test("returns 200 error if article has no comments and empty array", () => {
        return request(app).get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([])   
        })
    })

    test("returns 404 error if article_id doesnt exist", () => {
        return request(app).get('/api/articles/1337/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`article_id with value 1337 does not exist in articles`)   
        })
    })

    test("returns 400 error if incorrect format given", () => {
        return request(app).get('/api/articles/dasads/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid article id format")   
        })
    })


})

describe("POST /api/articles/:article_id/comments", () => {
    test("returns posted comment", () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            username: "lurker",
            body: "this is a comment"
        })
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({ 
                comment_id: 19,
                body: 'this is a comment',
                article_id: 1,
                author: 'lurker',
                votes: 0,
            })
        })
    })

    test("returns 404 error if article_id doesnt exist", () => {
        return request(app).post('/api/articles/123/comments')
        .send({
            username: "lurker",
            body: "this is a comment"
        })
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe(`article_id with value 123 does not exist in articles`)   

        })
    })

    test("returns 404 error if given username that doesnt exist", () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            username: "idontexist",
            body: "i want to exist"
        })
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe(`Key (author)=(idontexist) is not present in table \"users\".`)   

        })
    })
    test("returns 400 error if incorrect format given", () => {
        return request(app).post('/api/articles/dada2g/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid article id format")   
        })
    })

})