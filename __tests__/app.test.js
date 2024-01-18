const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const endpointsFile = require('../endpoints.json')
const toBeSorted = require("jest-sorted");
const { type } = require('os');


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
                expect(topic).toMatchObject(
                    {
                        slug: expect.any(String),
                        description: expect.any(String)
                    }
                )
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

            expect(body.msg).toBe("invalid format")
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
            expect(body.msg).toBe("invalid format")   
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
        .send({
            username: "lurker",
            body: "this is a comment"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid format")   
        })
    })

    test("returns 400 error if missing body in request body", () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            username: "lurker"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("request body is missing parameters")   
        })
    })
    test("returns 400 error if missing username in request body", () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            body: "lurker"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("request body is missing parameters")   
        })
    })
    test("returns 400 error if missing fields in request body", () => {
        return request(app).post('/api/articles/1/comments')
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("request body is missing parameters")   
        })
    })

    test("ignores extra properties in request body", () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            username: "lurker",
            body: "this is a comment",
            unnecessary: 'property'
        })
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({ 
                comment_id: 24,
                body: 'this is a comment',
                article_id: 1,
                author: 'lurker',
                votes: 0,
            })   
        })
    })
})


describe("PATCH /api/articles/:article_id", () => {
    test("returns updated article", () => {
        return request(app).patch('/api/articles/1')
        .send({
            inc_votes: 22
        })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject(
                {
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    votes: 122,
                    body: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String)
                }
            )
        })
    })   
    test("returns updated article for negative votes (decrement)", () => {
        return request(app).patch('/api/articles/2')
        .send({
            inc_votes: -15
        })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject(
                {
                    title: "Sony Vaio; or, The Laptop",
                    article_id: 2,
                    votes: -15,
                    body: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String)
                }
            )
        })
    })   
    test("returns 404 error if article_id doesn't exist", () => {
        return request(app).patch('/api/articles/234')
        .send({
            inc_votes: 55
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("article_id with value 234 does not exist in articles")
        })

    })  
    test("returns 400 error if format is incorrect", () => {
        return request(app).patch('/api/articles/29rk3')
        .send({
            inc_votes: 22
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid format")
        })
    })
    test("returns 400 error if missing inc_votes in request body", () => {
        return request(app).patch('/api/articles/2')
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("request body is missing parameters")   
        })
    })
    test("returns 400 error if inc_votes given wrong data type", () => {
        return request(app).patch('/api/articles/2')
        .send({
            inc_votes: 'hi'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid format")   
        })
    })
    test("returns updated article ignoring extra request body parameters", () => {
        return request(app).patch('/api/articles/3')
        .send({
            inc_votes: -15,
            dec_votes: 232
        })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject(
                {
                    title: "Eight pug gifs that remind me of mitch",
                    article_id: 3,
                    votes: -15,
                    body: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String)
                }
            )
        })
    }) 
})  


describe("DELETE /api/comments/:comment_id", () => {
    test("responds with status 204 and no content" , () => {
        return request(app).delete('/api/comments/1')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
        })
    })
    test("returns 404 error if comment_id doesnt exist", () => {
        return request(app).delete('/api/comments/1203')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`comment_id with value 1203 does not exist in comments`)   

        })
    })
    test("returns 400 error for incorrect format given", () => {
        return request(app).delete('/api/comments/awdas')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid format")   

        })
    })

})

describe("GET /api/users", () => {
    test("responds with an array of all users" , () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject(
                    {
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    }
                )
            })
        })
    })
})

