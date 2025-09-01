import Project from "../models/Projects.js";
import { formatJoiErrors } from "../utils/formatJoiErrors.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/projectsValidations.js";

export const createProject = async (req, res) => {
  const { error } = createProjectSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = formatJoiErrors(error);
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  //create
  try {
    const { title, description, dueDate, tags, priority } = req.body;
    const project = await Project.create({
      title,
      description,
      dueDate,
      tags,
      priority,
      owner: req.user._id,
      collabolators: [req.user._id],
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllProject = async (req, res) => {
  try {
    const project = await Project.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  const { error } = updateProjectSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const error = formatJoiErrors();
    return res.status(500).json({
      message: "Validation error",
      error,
    });
  }

  try {
    const { projectId, title, description, dueDate, tags, priority } = req.body;

    const project = await Project.findByIdAndUpdate(projectId, {
      title,
      description,
      dueDate,
      tags,
      priority,
    });

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  // kita mengambil id yg di ambil dari req.params
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    // sekarang kita cek apakah project itu milik si owner yg membuatnya
    if (project.owner.toString() !== req.user._id.toString()) {
      // kalo dia ownernya maka berhasil untuk menghapus project itu
    }

    // nah jika sudah diketahui ownernya tinggal di hapus jobsnya
    await project.deleteOne();
    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
};
