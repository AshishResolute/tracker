import {describe,it,expect } from '@jest/globals'
import {app} from '../routes/app.js'

import request from 'supertest'

describe(`GET /health`,()=>{
    it(`Should return 200 if server is running`,async()=>{
        const res = await request(app).get('/health')

        expect(res.status).toBe(200)
    })
})