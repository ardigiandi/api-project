import { Router } from "express";
import { createProject } from "../controllers/projectsControllers.js";

const route = Router()

route.post('/', createProject)

export default route