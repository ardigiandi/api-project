import { Router } from "express";
import { createProject, deleteProject, getAllProject, updateProject } from "../controllers/projectsControllers.js";

const route = Router()

route.post('/', createProject)
route.get('/', getAllProject)
route.put('/:projectId/update', updateProject)
route.delete('/:id/delete', deleteProject)


export default route