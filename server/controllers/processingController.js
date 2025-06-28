const Processing = require("../models/Processing");
const Storage = require("../models/Storage");

// @desc Create a processing log
exports.createProcessing = async (req, res) => {
  try {
    const { date, manufacturingUnit, inputs, output, team, notes } = req.body;

    // Validate manufacturing unit exists and is of type 'unit'
    const unit = await Storage.findById(manufacturingUnit);
    if (!unit) {
      return res.status(404).json({ message: "Manufacturing unit not found" });
    }
    if (unit.type !== "unit") {
      return res.status(400).json({ message: "Processing can only be done in manufacturing units" });
    }

    const processing = new Processing({
      date,
      manufacturingUnit,
      inputs,
      output,
      team,
      notes,
      createdBy: req.user._id,
    });

    await processing.save();
    res.status(201).json(processing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all processing logs
exports.getAllProcessing = async (req, res) => {
  try {
    const processing = await Processing.find()
      .populate("manufacturingUnit", "name")
      .populate("createdBy", "name")
      .sort({ date: -1 });
    res.json(processing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get one by ID
exports.getProcessingById = async (req, res) => {
  try {
    const processing = await Processing.findById(req.params.id)
      .populate("manufacturingUnit", "name")
      .populate("createdBy", "name");

    if (!processing) {
      return res.status(404).json({ message: "Processing record not found" });
    }

    res.json(processing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update
exports.updateProcessing = async (req, res) => {
  try {
    const { date, manufacturingUnit, inputs, output, team, notes } = req.body;

    const processing = await Processing.findById(req.params.id);
    if (!processing) {
      return res.status(404).json({ message: "Processing record not found" });
    }

    // Update fields
    processing.date = date || processing.date;
    processing.manufacturingUnit =
      manufacturingUnit || processing.manufacturingUnit;
    processing.inputs = inputs || processing.inputs;
    processing.output = output || processing.output;
    processing.team = team || processing.team;
    processing.notes = notes || processing.notes;

    await processing.save();
    res.json(processing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete
exports.deleteProcessing = async (req, res) => {
  try {
    const processing = await Processing.findById(req.params.id);
    if (!processing) {
      return res.status(404).json({ message: "Processing record not found" });
    }

    await processing.remove();
    res.json({ message: "Processing record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
