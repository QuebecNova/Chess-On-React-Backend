import request from 'supertest'
import { app } from '../../app'

beforeEach(async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201)
})

it('returns 200 on successful signin', async () => {
    return request(app)
        .post('/api/v1/users/signin')
        .send({
            email: 'test@example.com',
            password: 'password',
        })
        .expect(200)
})

it('returns 400 with invalid email', async () => {
    return request(app)
        .post('/api/v1/users/signin')
        .send({
            email: 'test1@example.com',
            password: 'password',
        })
        .expect(400)
})

it('returns 400 with invalid password', async () => {
    return request(app)
        .post('/api/v1/users/signin')
        .send({
            email: 'test@example.com',
            password: '1',
        })
        .expect(400)
})

it('returns 400 with missing email and password', async () => {
    await request(app)
        .post('/api/v1/users/signin')
        .send({ email: 'test@example.com' })
        .expect(400)

    await request(app)
        .post('/api/v1/users/signin')
        .send({ password: 'password' })
        .expect(400)
})

it('sets a cookie after signin', async () => {
    const response = await request(app)
        .post('/api/v1/users/signin')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})
