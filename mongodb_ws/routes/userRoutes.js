const express = require("express");
const User = require("../model/user");
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const {
      skip = 0,
      limit = 10,
      selectionKeys,
      searchKeys,
      sortKey = "name",
      sortOrder = 1,
    } = req.query;

    // Create the search condition
    let searchCondition = {};
    if (searchKeys && searchKeys.length > 0 && req.query.searchValue) {
      const regex = new RegExp(req.query.searchValue, "i"); // Case-insensitive search
      searchCondition = {
        $or: searchKeys.split(",").map((key) => ({
          [key]: { $regex: regex },
        })),
      };
    }
    // Define field selection for the query
    const fieldsToSelect = selectionKeys
      ? selectionKeys.split(",").join(" ")
      : "";
    // Execute the query
    const users = await User.find(searchCondition)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select(fieldsToSelect)
      .sort({ [sortKey]: sortOrder });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

module.exports = router;
