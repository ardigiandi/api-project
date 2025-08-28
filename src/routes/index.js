import { Router } from "express";
import authentioncationRoutes from './authenticationRoutes.js'

const route = Router();

// http://localhost:3000/api/auth/
route.use('/auth', authentioncationRoutes)

export default route;
