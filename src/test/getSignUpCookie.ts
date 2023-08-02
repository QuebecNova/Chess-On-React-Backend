import { app } from '../app'
import request from 'supertest'

export const getSignUpCookie = async () => {
    const email = 'test@example.com'
    const password = 'password'

    const response = await request(app)
        .post('/api/v1/users/signup')
        .send({ email, password })
        .expect(201)

    return response.get('Set-Cookie')
}
