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
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
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
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            }) 
              
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

describe("GET /api/articles (topic query)", () => {
    test("responds with articles filtered by given topic query", () => {
        return request(app).get('/api/articles/?topic=cats')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(1)
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'cats',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })

    test("ignores invalid query keys", () => {
        return request(app).get('/api/articles/?topic=mitch&hungry=true')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(12)
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'mitch',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test("responds with 200 empty response if no articles under topic", () => {
        return request(app).get('/api/articles/?topic=paper')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toEqual([])
        })
    })
    test("responds with 404 if topic doesnt exist", () => {
        return request(app).get('/api/articles/?topic=dogs')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`slug with value dogs does not exist in topics`)
        })
    })
})


describe("GET /api/articles/:article_id (comment_count)", () => {
    test("responds with correct article object", () => {
        return request(app).get('/api/articles/5')
        .expect(200)
        .then(({ body }) => {{
            expect(body).toMatchObject(
                {
                    article: {
                        article_id: 5,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: 2       
                    }
                  }
            )
        }})
    })
})


describe("GET /api/articles (sorting queries)", () => {
    test("responds with articles sorted by chosen column default descending", () => {
        return request(app).get('/api/articles/?sort_by=title')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title', {descending: true})
        })
    })

    test("responds with articles sorted by chosen column ascending", () => {
        return request(app).get('/api/articles/?sort_by=title&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title')
        })
    })

    test("returns 400 error if given sort query", () => {
        return request(app).get('/api/articles/?sort_by=2fds&order=asc')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid sort query')
        })
    })

    test("returns 400 error if given order query", () => {
        return request(app).get('/api/articles/?sort_by=title&order=23w')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid order query')
        })
    })
})

describe("GET /api/users/:username", () => {
    test("returns user from given username", () => {
        return request(app).get('/api/users/icellusedkars')
        .expect(200)
        .then(({body}) => {
            expect(body.user).toMatchObject(
                {
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                }
            )
        })
    })
    test("returns 404 if username doesnt exist", () => {
        return request(app).get('/api/users/ramemes')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('username with value ramemes does not exist in users')
        })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    test("returns updated comment", () => {
        return request(app).patch('/api/comments/2')
        .expect(200)  
        .send({inc_votes: 4})
        .then(({body}) => {
            expect(body.comment).toMatchObject(
                {
                    body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                    votes: 18,
                    author: "butter_bridge",
                    article_id: 1                
                }
            )
        })
    })

    test("returns 404 if comment doesnt exist", () => {
        return request(app).patch('/api/comments/221')
        .expect(404)  
        .send({inc_votes: 4})
        .then(({body}) => {
            expect(body.msg).toBe('comment_id with value 221 does not exist in comments')
            
        })
    })
    test("returns 400 if given incorrect format", () => {
        return request(app).patch('/api/comments/1wf32')
        .expect(400)  
        .send({inc_votes: 4})
        .then(({body}) => {
            expect(body.msg).toBe('invalid format')
        })
    })
    test("ignores irrelevant properties", () => {
        return request(app).patch('/api/comments/3')
        .send({hack_database: 4, inc_votes: 42})
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toMatchObject(
                {
                    body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                    votes: 142,
                    author: "icellusedkars",
                    article_id: 1,
                  }
            )
        })
    })
    
    test("returns 400 if missing inc_votes", () => {
        return request(app).patch('/api/comments/2')
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("request body is missing parameters")   
        })
    })


    test("returns 400 error if inc_votes given wrong data type", () => {
        return request(app).patch('/api/comments/2')
        .send({
            inc_votes: 'hi'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid format")   
        })
    })
})