import express from "express";
import { authentication, deleteAdmin, newAdmin, updateAdmin } from "../Controllers/adminController";
import { verifyAuthentication, verifyEditAdmin, verifyNewAdmin } from "../Middlewares/verifyAdmin";


const app = express()
app.use(express.json())

app.post(`/create`, [verifyNewAdmin], newAdmin)
app.post(`/login`,  verifyAuthentication, authentication)
app.put(`/update`, [verifyEditAdmin], updateAdmin)
app.delete(`/delete/:id`, deleteAdmin)

export default app