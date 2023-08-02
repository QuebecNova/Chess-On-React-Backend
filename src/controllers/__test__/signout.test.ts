import request from 'supertest'
import { app } from '../../app'

beforeEach(async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201)
})

it('returns 200 on successful signout', async () => {
    return request(app).get('/api/v1/users/signout').send().expect(200)
})

it('removes a cookie after signout', async () => {
    const response = await request(app)
        .get('/api/v1/users/signout')
        .send()
        .expect(200)

    expect(response.get('Set-Cookie')[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    )
})
