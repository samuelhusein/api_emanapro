const express = require("express");
const router = express.Router();
const Kpi = require("../models/Kpi");
const nodemailer = require("nodemailer");
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  useTLS: true
});


// Create KPI assessment due date
router.post("/period", async (req, res) => {
  try {
    const { kpi_period, kpi_duedate, kpi_startdate } = req.body;
    const result = await Kpi.createKpiAssessmentPeriod(kpi_period, kpi_duedate, kpi_startdate);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment period creation failed" });
    }
    pusher.trigger('manager-channel', 'broadcast-event', {
      message: `HRD has set Assessment Period ${kpi_period}` 
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/period", async (req, res) => {
  try {
    const result = await Kpi.getKpiPeriod();
    if (!result) {
      return res.status(404).json({ message: "KPI Period tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/running/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Kpi.getKpiRunning(userId);
    if (!result) {
      return res.status(404).json({ message: "KPI tidak ada yang berjalan" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create KPI assessment due date
router.post("/period/update", async (req, res) => {
  try {
    const kpi_period = req.body.kpi_period;
    // const result = await Kpi.createKpiAssessmentWithCheck(kpi_period);
    // if (!result) {
    //   return res
    //     .status(404)
    //     .json({ message: "KPI assessment period update failed" });
    // }
    // res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all KPI assessment rubric
router.get("/", async (req, res) => {
  try {
    const result = await Kpi.getKpiAssessmentData();
    if (!result) {
      return res.status(404).json({ message: "KPI assessment data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all KPI assessment for hrd
router.get("/kpi_team_member/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const result = await Kpi.getKpiAssessmentDataByMember(teamId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all open KPI Assessment for manager
router.get("/open/:manager_id", async (req, res) => {
  try {
    const manager_id = req.params.manager_id;
    const result = await Kpi.getKpiAssessmentOpebByMember(manager_id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all open KPI Assessment for manager on certain user and duedate
router.get("/open/:userId/:duedateId/list", async (req, res) => {
  try {
    const userId = req.params.userId;
    const duedateId = req.params.duedateId;
    const result = await Kpi.getKpiAssessmentOpebByMemberDetail(userId, duedateId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all Self Assessment Data For Employee
router.get("/employee/:userId/self_assessment/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Kpi.getKPISelfAssessmentData(userId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all Assessment Data For Employee
router.get("/employee/:userId/detail_assessment/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Kpi.getKPIDetailAssessmentData(userId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all open KPI Assessment for manager on certain user and duedate
router.get("/open/:userId/:duedateId/:category/list", async (req, res) => {
  try {
    const userId = req.params.userId;
    const duedateId = req.params.duedateId;
    const category = req.params.category;
    const result = await Kpi.getKpiAssessmentForm(userId, duedateId, category);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all open KPI Assessment for manager on certain user and duedate
router.get("/open/:userId/:duedateId/:category/form", async (req, res) => {
  try {
    const userId = req.params.userId;
    const duedateId = req.params.duedateId;
    const category = req.params.category;
    const result = await Kpi.getKpiAssessmentForm(userId, duedateId, category);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all open KPI Assessment for manager on certain user and duedate
router.post("/open/:userId/:duedateId/fill", async (req, res) => {
  try {
    const userId = req.params.userId;
    const duedateId = req.params.duedateId;
    const result = await Kpi.updateKpiAssessmentOpenByMemberDetail(userId, duedateId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment member data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/assessment/:assessmentId", async (req, res) => {
  try {
    const score = req.body.score;
    const uraian = req.body.uraian;
    const assessmentId = req.params.assessmentId;
    const result = await Kpi.kpiAssessmentScore(assessmentId, score, uraian);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Data KPI assessment tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/assessment/:assessmentId/kpi", async (req, res) => {
  try {
    const score = req.body.score;
    const description = req.body.description;
    const assessmentId = req.params.assessmentId;
    const result = await Kpi.kpiSelfAssessmentScore(assessmentId, score, description);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Data KPI assessment tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/assessment/:assessmentId/change_score", async (req, res) => {
  try {
    const score = req.body.score;
    const assessmentId = req.params.assessmentId;
    const result = await Kpi.kpiAssessmentChangeScore(assessmentId, score);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Data KPI assessment tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/assessment/:userId/detail", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Kpi.getKpiAssessmentDataByUser(userId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "KPI assessment user data tidak ada" });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;