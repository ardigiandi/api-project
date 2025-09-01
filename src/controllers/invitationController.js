import Invitation from "../models/Invitation.js";
import Project from "../models/Projects.js";
import User from "../models/User.js";
import { sendInvitationValidationsSchema } from "../validations/invitationValidations.js";

export const sendInvitation = async (req, res) => {
  const { email, projectId } = req.body;

  const { error } = sendInvitationValidationsSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = formatJoiErrors(error);
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  try {
    // 1. cek usernya ada atau tidak
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2. cek projectnya ada atau tidak
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // 3. invitationnya udah dikirim belum dan belum di confirm
    const existingInvitation = await Invitation.findOne({
      sender: req.user._id,
      receiver: user._id,
      project: project._id,
    });

    if (existingInvitation) {
      return res.status(400).json({
        message: "Invitation already sent",
      });
    }

    // 4. cek apakah sudah jadi collaborator atau belum
    const isCollaborator = project.collaborators.includes(user._id);
    if (isCollaborator) {
      return res.status(400).json({
        message: "User already a collaborator",
      });
    }

    // 5. buat invitation baru
    const invitation = await Invitation.create({
      sender: req.user._id,
      receiver: user._id,
      project: project._id,
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSentInvitations = async (req, res) => {
  const { project: projectId } = req.params;
  try {
    const invitation = await Invitation.find({
      project: projectId,
    }).populate({
      path: "receiver",
      select: "name email",
    });

    res.status(200).json({
      message: "Invitations fetched successfully",
      invitation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const cancelInvitations = async (req, res) => {
  const { invitationId } = req.params;
  try {
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }
    await invitation.deleteOne();
    res.status(200).json({
      message: "Invitation canceled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const myInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      receiver: req.user._id,
    }).populate([
      {
        path: "sender",
        select: "name email -_id",
      },
      {
        path: "project",
        select: "title description dueDate -_id",
      },
    ]);

    res.status(200).json({
      message: "Invitations fetched successfully",
      invitations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const confirmInvitation = async (req, res) => {
  const { invitationId, status } = req.body; // ambil status dari body

  try {
    const user = req.user._id;
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    const project = await Project.findById(invitation.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.collaborators.includes(user)) {
      return res.status(400).json({
        message: "User already a collaborator",
      });
    }

    if (status === "accepted") {
      project.collaborators.push(user);
      await project.save();
      await invitation.deleteOne();

      return res.status(200).json({
        message: "Invitation accepted successfully",
        status: "success",
      });
    } else if (status === "rejected") {
      await invitation.deleteOne();

      return res.status(200).json({
        message: "Invitation rejected successfully",
        status: "success",
      });
    } else {
      return res.status(400).json({
        message: "Invalid status value",
        status: "error",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: "error",
    });
  }
};
