const express = require("express");
const router = express.Router();

const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");

const client = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, "../service-account.json"),
});

const propertyId = "548169716";

router.get("/", async (req, res) => {
  try {

    // ==========================
    // OVERVIEW
    // ==========================

    const [overview] = await client.runReport({
      property: `properties/${propertyId}`,

      dimensions: [
        {
          name: "date",
        },
      ],

      metrics: [
        {
          name: "activeUsers",
        },
        {
          name: "screenPageViews",
        },
      ],

      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
    });

    // ==========================
    // DEVICE ANALYTICS
    // ==========================

    const [devices] = await client.runReport({
      property: `properties/${propertyId}`,

      dimensions: [
        {
          name: "deviceCategory",
        },
      ],

      metrics: [
        {
          name: "activeUsers",
        },
      ],

      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
    });

    // ==========================
    // MOST VIEWED SECTIONS
    // ==========================

    const [sections] = await client.runReport({
      property: `properties/${propertyId}`,

      dimensions: [
        {
          name: "eventName",
        },
      ],

      metrics: [
        {
          name: "eventCount",
        },
      ],

      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],

      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: "Navigation",
          },
        },
      },

      orderBys: [
        {
          metric: {
            metricName: "eventCount",
          },
          desc: true,
        },
      ],

      limit: 5,
    });

    const activeUsers = overview.rows.reduce(
      (sum, row) => sum + Number(row.metricValues[0].value),
      0
    );

    const pageViews = overview.rows.reduce(
      (sum, row) => sum + Number(row.metricValues[1].value),
      0
    );

    res.json({
      activeUsers,
      pageViews,
      devices: devices.rows || [],
      sections: sections.rows || [],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
});

module.exports = router;