
import Party from "../models/party.model.js";
import cloudinary from "../utils/cloudinary.js";

// Create Party
export const createParty = async (req, res) => {
  try {
    const { name, leader } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Party symbol image is required" });
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "party_symbols" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        const party = new Party({
          name,
          leader,
          symbol: result.secure_url, // Cloudinary image URL
        });

        await party.save();
        return res.status(201).json(party);
      }
    );

    uploadResult.end(file.buffer); // Pipe buffer to cloudinary

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get All Parties
export const getAllParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Party
export const updateParty = async (req, res) => {
  try {
    const updated = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Party
export const deleteParty = async (req, res) => {
  try {
    await Party.findByIdAndDelete(req.params.id);
    res.json({ message: 'Party deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
