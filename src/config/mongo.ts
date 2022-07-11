import mongoose from "mongoose";

export const ConnectDB = async(mongoURL: string) => {
    console.log('connecting db...')
    await mongoose.connect(mongoURL, {
        retryWrites: true,
        w: 'majority',
    })
        .then(() => console.log('MongoDB connected to ', mongoURL))
        .catch(err => console.log(err))
}