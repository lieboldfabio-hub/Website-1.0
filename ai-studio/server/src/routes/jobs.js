"use strict";

const express = require("express");
const jobManager = require("../services/jobManager");
const { requireAdminToken } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", requireAdminToken, (req, res) => {
  const job = jobManager.get(req.params.id);
  if (!job) return res.status(404).json({ error: "not-found", message: "Job unbekannt oder abgelaufen." });
  res.json(job);
});

module.exports = router;
