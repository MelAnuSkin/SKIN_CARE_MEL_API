import { Visitor } from "../Models/Visitor_Mod.js";
import { View } from "../Models/View_Mod.js";

export const recordUniqueView = async (req, res) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Check if this IP has visited in the last 24 hours
    const lastVisit = await Visitor.findOne({ ip: ipAddress })
      .sort({ visitedAt: -1 });

    if (!lastVisit || Date.now() - lastVisit.visitedAt.getTime() > 24 * 60 * 60 * 1000) {
      // Save IP
      await Visitor.create({ ip: ipAddress });

      // Increment total views
      let viewRecord = await View.findOne();
      if (!viewRecord) {
        viewRecord = await View.create({ count: 1 });
      } else {
        viewRecord.count += 1;
        await viewRecord.save();
      }
    }

    res.json({ message: "View recorded (unique for 24h)" });
  } catch (error) {
    console.error("View record error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getViewCount = async (req, res) => {
  try {
    const viewRecord = await View.findOne();
    res.json({ count: viewRecord?.count || 0 });
  } catch (error) {
    console.error("Get view count error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

