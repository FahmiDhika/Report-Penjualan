import express from "express";
import {
  authentication,
  deleteUser,
  getUser,
  newUser,
  updateUser,
} from "../Controllers/userController";
import {
  verifyAuthentication,
  verifyEditUser,
  verifyNewUser,
} from "../Middlewares/verifyUser";
import { verifyToken, verifyRole } from "../Middlewares/authorization";
import uploadFile from "../Middlewares/userUpload";

const app = express();
app.use(express.json());

app.get(`/get`, [verifyToken, verifyRole(["ADMIN"])], getUser);
app.post(
  `/create`,
  [
    verifyToken,
    verifyRole([`ADMIN`]),
    uploadFile.single("profile_picture"),
    verifyNewUser,
  ],
  newUser
);
app.post(`/login`, verifyAuthentication, authentication);
app.put(
  `/update/:id`,
  [
    verifyToken,
    verifyRole([`ADMIN`]),
    uploadFile.single("profile_picture"),
    verifyEditUser,
  ],
  updateUser
);
app.delete(`/delete/:id`, [verifyToken, verifyRole([`ADMIN`])], deleteUser);

export default app;
