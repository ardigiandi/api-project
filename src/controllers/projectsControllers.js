import Project from "../models/Projects.js";
import { formatJoiErrors } from "../utils/formatJoiErrors.js";
import { createProjectSchema } from "../validations/projectsValidations.js";

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
