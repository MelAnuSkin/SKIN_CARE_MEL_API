import { View } from "../Models/View_Mod.js";

// Record a new view
export const recordView = async (req, res) => {
  try {
    let viewDoc = await View.findOne();

    if (!viewDoc) {
      // First ever visit
      viewDoc = await View.create({ count: 1 });
    } else {
      // Add +1 for each visit
      viewDoc.count += 1;
      await viewDoc.save();
    }

    res.json({ message: "View recorded", totalViews: viewDoc.count });
  } catch (error) {
    console.error("View tracking error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total views
export const getViews = async (req, res) => {
  try {
    const viewDoc = await View.findOne();
    res.json({ totalViews: viewDoc ? viewDoc.count : 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
