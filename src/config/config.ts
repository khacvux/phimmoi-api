import dotenv from 'dotenv'

dotenv.config();


const SERVER_PORT = process.env.SERVER_PORT || '8000'
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'phimmoi'
const NODE_ENV = process.env.NODE_ENV || 'development'

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_URL = process.env.MONGO_URL || ''

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY || ''
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || ''

const BUCKET_NAME = process.env.BUCKET_NAME || ''
const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY || ''
const BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY || ''

const REGION = process.env.REGION || ''



const MONGO = {
    url: MONGO_URL
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const JWT = {
    accesskey: JWT_ACCESS_KEY,
    refreshkey: JWT_REFRESH_KEY
}

const BUCKET = {
    name: BUCKET_NAME,
    accesskey: BUCKET_ACCESS_KEY,
    secretkey: BUCKET_SECRET_KEY
}


const config = {
    server: SERVER,
    mongo: MONGO,
    jwt: JWT,
    bucket: BUCKET,
    region: REGION,
}

export default config