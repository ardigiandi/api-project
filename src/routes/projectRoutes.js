import { Router } from "express";
import {
  createProject,
  deleteCollaborator,
  deleteProject,
  getAllProject,
  getProjectById,
  updateProject,
} from "../controllers/projectsControllers.js";

const route = Router();

route.post("/", createProject);
route.get("/", getAllProject);
route.put("/:projectId/update", updateProject);
route.delete("/:id/delete", deleteProject);
route.get("/:projectId", getProjectById);
route.delete('/:projectId/delete-collaborator', deleteCollaborator)

export default route;
