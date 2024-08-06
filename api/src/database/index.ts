import mongoose from "mongoose"
import { env } from "../env"

const connectUrl = env.CONNECT_URL_MONGODB

function connect() {
    if(!connectUrl) throw new Error('There is not a connect url.')
    mongoose.connect(connectUrl, { dbName: 'evotraining' })
    
    const db = mongoose.connection

    return db
}

const db = connect()

db.on('error', async () => {
    console.error.bind(console, '[X] An error occurred when connecting to the database')

    setTimeout(() => {
        process.exit(1)
    }, 500)
});

db.once('open', () => {
    console.log("[√] Database connected DB: " + db.db.databaseName)
})

