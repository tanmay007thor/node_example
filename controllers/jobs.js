const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const getAllJobs = async (req, res) => {
  const jobs = await Job.find().sort("createdAt");
  res.status(StatusCodes.ACCEPTED).json({ "total Jobs": jobs.length, jobs });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No Job Will Created With Id ${jobId}`);
  }
  res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Jobs Found Sucessfully !", job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.send(job);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty !");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No Job Will Created With Id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ message: "Jobs Updated", job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No Job Will Created With Id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({message : 'Job Deleted Successfully !' , job})
};
module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
