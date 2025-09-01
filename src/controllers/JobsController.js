import Jobs from "../models/Jobs.js";

export const getJobs = async (req, res) => {
  const { projectId } = req.params;
  try {
    const jobs = await Jobs.find({ project: projectId })
      .sort({ createdAt: -1 })
      .populate({
        path: "officer",
        select: "name email",
      });

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
