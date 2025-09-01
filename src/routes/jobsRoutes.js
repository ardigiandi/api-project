import { Router } from "express";
import { getJobs } from "../controllers/JobsController.js";

const route = Router()

route.get('/:projectId/get-jobs', getJobs)

export default route