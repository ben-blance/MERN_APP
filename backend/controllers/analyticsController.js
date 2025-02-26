// controllers/analyticsController.js
const Transaction = require('../models/Transaction');
const { getMonthDateRange } = require('./transactionController');

// Get statistics for a month (total sales, sold items, unsold items)
const getStatistics = async (req, res) => {
  try {
    const month = req.query.month || 'march'; // Default to March
    
    // Get date range for the selected month
    const { startDate, endDate } = getMonthDateRange(month);
    
    // Build query for the month
    const query = {
      dateOfSale: { $gte: startDate, $lte: endDate }
    };
    
    // Get total sales
    const salesResult = await Transaction.aggregate([
      { $match: query },
      { $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          unsoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
        }
      }
    ]);
    
    // Format the result
    const result = salesResult.length > 0 ? {
      totalSales: parseFloat(salesResult[0].totalSales.toFixed(2)),
      soldItems: salesResult[0].soldItems,
      unsoldItems: salesResult[0].unsoldItems
    } : {
      totalSales: 0,
      soldItems: 0,
      unsoldItems: 0
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bar chart data - item count in price ranges
const getBarChartData = async (req, res) => {
  try {
    const month = req.query.month || 'march'; // Default to March
    
    // Get date range for the selected month
    const { startDate, endDate } = getMonthDateRange(month);
    
    // Define price ranges
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity }
    ];
    
    // Query base
    const baseQuery = {
      dateOfSale: { $gte: startDate, $lte: endDate }
    };
    
    // Get count for each price range
    const rangeResults = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...baseQuery,
          price: { $gte: min, $lte: max === Infinity ? 999999 : max }
        });
        
        return { range, count };
      })
    );
    
    res.json(rangeResults);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pie chart data - categories distribution
const getPieChartData = async (req, res) => {
  try {
    const month = req.query.month || 'march'; // Default to March
    
    // Get date range for the selected month
    const { startDate, endDate } = getMonthDateRange(month);
    
    // Build query for the month
    const query = {
      dateOfSale: { $gte: startDate, $lte: endDate }
    };
    
    // Get category distribution
    const categoryDistribution = await Transaction.aggregate([
      { $match: query },
      { $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);
    
    res.json(categoryDistribution);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Combined API - all data in one response
const getSummary = async (req, res) => {
  try {
    const month = req.query.month || 'march'; // Default to March
    
    // Get all data in parallel
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      // Get transactions (first page only)
      (async () => {
        const page = 1;
        const limit = 10;
        const { startDate, endDate } = getMonthDateRange(month);
        const query = {
          dateOfSale: { $gte: startDate, $lte: endDate }
        };
        
        const data = await Transaction.find(query)
          .sort({ dateOfSale: -1 })
          .limit(limit);
          
        const total = await Transaction.countDocuments(query);
        
        return {
          transactions: data,
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total
        };
      })(),
      
      // Get statistics
      (async () => {
        const { startDate, endDate } = getMonthDateRange(month);
        const query = {
          dateOfSale: { $gte: startDate, $lte: endDate }
        };
        
        const salesResult = await Transaction.aggregate([
          { $match: query },
          { $group: {
              _id: null,
              totalSales: { $sum: "$price" },
              soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
              unsoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
            }
          }
        ]);
        
        return salesResult.length > 0 ? {
          totalSales: parseFloat(salesResult[0].totalSales.toFixed(2)),
          soldItems: salesResult[0].soldItems,
          unsoldItems: salesResult[0].unsoldItems
        } : {
          totalSales: 0,
          soldItems: 0,
          unsoldItems: 0
        };
      })(),
      
      // Get bar chart data
      (async () => {
        const priceRanges = [
          { range: '0-100', min: 0, max: 100 },
          { range: '101-200', min: 101, max: 200 },
          { range: '201-300', min: 201, max: 300 },
          { range: '301-400', min: 301, max: 400 },
          { range: '401-500', min: 401, max: 500 },
          { range: '501-600', min: 501, max: 600 },
          { range: '601-700', min: 601, max: 700 },
          { range: '701-800', min: 701, max: 800 },
          { range: '801-900', min: 801, max: 900 },
          { range: '901-above', min: 901, max: Infinity }
        ];
        
        const { startDate, endDate } = getMonthDateRange(month);
        const baseQuery = {
          dateOfSale: { $gte: startDate, $lte: endDate }
        };
        
        const rangeResults = await Promise.all(
          priceRanges.map(async ({ range, min, max }) => {
            const count = await Transaction.countDocuments({
              ...baseQuery,
              price: { $gte: min, $lte: max === Infinity ? 999999 : max }
            });
            
            return { range, count };
          })
        );
        
        return rangeResults;
      })(),
      
      // Get pie chart data
      (async () => {
        const { startDate, endDate } = getMonthDateRange(month);
        const query = {
          dateOfSale: { $gte: startDate, $lte: endDate }
        };
        
        const categoryDistribution = await Transaction.aggregate([
          { $match: query },
          { $group: {
              _id: "$category",
              count: { $sum: 1 }
            }
          },
          { $project: {
              _id: 0,
              category: "$_id",
              count: 1
            }
          }
        ]);
        
        return categoryDistribution;
      })()
    ]);
    
    // Combine all data
    res.json({
      month,
      transactions,
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStatistics,
  getBarChartData,
  getPieChartData,
  getSummary
};