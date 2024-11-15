import express from "express";
import { authentication, deleteUser, getUser, newUser, updateUser } from "../Controllers/userController";
import { verifyAuthentication, verifyEditUser, verifyNewUser } from "../Middlewares/verifyUser";
import { verifyToken, verifyRole } from "../Middlewares/authorization";


const app = express()
app.use(express.json())

app.get(`/get`, getUser)
app.post(`/create/admin`, [verifyNewUser], newUser)
app.post(`/create/kasir`, [verifyToken, verifyRole([`ADMIN`]), verifyNewUser], newUser)
app.post(`/login`, verifyAuthentication, authentication)
app.put(`/update/:id`, [verifyToken, verifyRole([`ADMIN`]), verifyEditUser], updateUser)
app.delete(`/delete/:id`, [verifyToken, verifyRole([`ADMIN`])], deleteUser)

export default app