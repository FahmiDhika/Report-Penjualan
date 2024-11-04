import express from "express";
import { deleteProduk, getAllProduk, newProduk, updateProduk,} from "../Controllers/produkController";
import { verifyNewProduk, verifyEditProduk } from "../Middlewares/verifyProduk";
import { verifyToken } from "../Middlewares/authorization";

const app = express();
app.use(express.json());

app.get(`/search`, [verifyToken, verif(["CASHIER","MANAGER"])], getAllProduk);
app.post(`/add`, [verifyToken, verifyNewProduk], newProduk);
app.put(`/update/:id`, [verifyToken], [verifyEditProduk], updateProduk);
app.delete(`/delete/:id`, [verifyToken], deleteProduk);

export default app;
