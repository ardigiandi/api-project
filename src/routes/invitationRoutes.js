import { Router } from "express";
import {
  cancelInvitations,
  confirmInvitation,
  getSentInvitations,
  myInvitations,
  sendInvitation,
} from "../controllers/invitationController.js";

const route = Router();

route.post("/send", sendInvitation);
route.get("/:projectId/get-sent-invitation", getSentInvitations);
route.delete("/:invitationId/cancel-invitation", cancelInvitations);
route.get("/my-invitations", myInvitations);
route.post('/confirm', confirmInvitation)

export default route;
