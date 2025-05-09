const Lot = require("../models/Lot");

exports.getLotsByFacility = async (req, res) => {
  try {
    const { facility } = req.query;
    if (!facility)
      return res.status(400).json({ error: "Facility ID required" });

    const lots = await Lot.find({ facility_id: facility });
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
