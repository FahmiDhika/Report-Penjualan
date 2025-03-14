import express from "express";
import { createTransaksi, deleteTransaksi, getTransaksiHistory, updateTransaksi } from "../Controllers/transactionController";
import { verifyAddTransaksi, verifyEditStatus } from "../Middlewares/transactionValidation";
import { verifyToken, verifyRole } from "../Middlewares/authorization";

const app = express()
app.use(express.json())

app.get(`/history`, [verifyToken, verifyRole(["ADMIN"])], getTransaksiHistory)
app.post(`/new`, [verifyToken, verifyRole(["KASIR"]), verifyAddTransaksi], createTransaksi)
app.put(`/update/:id`, [verifyToken, verifyRole(["ADMIN"]), verifyEditStatus], updateTransaksi)
app.delete(`/delete/:id`, [verifyToken, verifyRole(["ADMIN"])], deleteTransaksi)

export default app