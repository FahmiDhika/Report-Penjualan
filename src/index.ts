import express from 'express'
import cors from 'cors'
import produkRoute from './Routers/produkRouter'
import adminRoute from './Routers/userRouter'
import { PORT } from './global'

const app = express()
app.use(cors())

app.use(`/produk`, produkRoute)
app.use(`/user`, adminRoute)

app.listen(PORT, () => {
    console.log(`Server run on port http://localhost:${PORT}`)
})