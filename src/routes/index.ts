import { Express } from "express";
import user from './user'
import admin from './admin'
import category from './categoryMovie'
import movie from './movie'

export default function router(app: Express) {
    app.use('/user', user)
    app.use('/admin', admin)
    app.use('/category', category)
    app.use('/movie', movie)
} 