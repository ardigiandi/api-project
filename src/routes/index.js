import { Router } from "express";
import authentioncationRoutes from "./authenticationRoutes.js";
import TagsRoutes from "./tagsRoutes.js";
import ProjectRoutes from "./projectRoutes.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import { verifyToken } from "../middleware/verifyToken.js";

const route = Router();

// http://localhost:3000/api/auth/
route.use("/auth", authentioncationRoutes);
route.use("/tag", TagsRoutes);
route.use("/projects", verifyToken, ProjectRoutes);

export default route;
