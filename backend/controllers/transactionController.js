// controllers/transactionController.js
const Transaction = require('../models/Transaction');

// Helper function to get month date range
const getMonthDateRange = (month) => {
  // Check if month is in "YYYY-MM" format
  const regex = /^(\d{4})-(\d{2})$/;
  const match = month.match(regex);
  let year, monthIndex;

  if (match) {
    // Extract year and month
    year = parseInt(match[1], 10);
    monthIndex = parseInt(match[2], 10) - 1; // Adjust because JS months are 0-indexed
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error('Invalid month');
    }
  } else if (!isNaN(month)) {
    // Handle numeric month (assume default year)
    monthIndex = parseInt(month, 10) - 1;
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error('Invalid month');
    }
    year = 2022; // or any default year you prefer
  } else {
    // Fallback to handling month name
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december'];
    monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
    if (monthIndex === -1) {
      throw new Error('Invalid month');
    }
    year = 2022; // default year for month names
  }
  
  // Start of the month
  const startDate = new Date(year, monthIndex, 1);
  // End of the month (last millisecond)
  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  
  return { startDate, endDate };
};



// Get transactions with search and pagination
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const month = req.query.month || 'march'; // Default to March

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get date range for the selected month
    const { startDate, endDate } = getMonthDateRange(month);

    // Build search query
    let query = {
      dateOfSale: { $gte: startDate, $lte: endDate }
    };

    // Add search criteria if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        // If the search term could be a number (price), add a price condition
        { price: isNaN(Number(search)) ? -1 : Number(search) }
      ];
    }

    // Get filtered transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTransactions,
  getMonthDateRange // Export for use in other controllers
};