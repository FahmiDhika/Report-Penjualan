import express from "express";
import {
  deleteProduk,
  getAllProduk,
  newProduk,
  updateProduk,
} from "../Controllers/produkController";
import { verifyNewProduk, verifyEditProduk } from "../Middlewares/verifyProduk";
import { verifyToken, verifyRole } from "../Middlewares/authorization";

const app = express();
app.use(express.json());

app.get(`/search`, [verifyToken, verifyRole([`ADMIN`, `KASIR`])], getAllProduk);
app.post(
  `/add`,
  [verifyToken, verifyRole([`ADMIN`]), verifyNewProduk],
  newProduk
);
app.put(
  `/update/:id`,
  [verifyToken, verifyRole([`ADMIN`]), verifyEditProduk],
  updateProduk
);
app.delete(`/delete/:id`, [verifyToken, verifyRole([`ADMIN`])], deleteProduk);

export default app;

// verifyAuthentication(["CASHIER","MANAGER"])
