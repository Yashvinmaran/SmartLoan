// Handles actions for regular users, like applying for loans and viewing their dashboard.
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');

// Function for a user to apply for a loan (with basic CIBIL check)
exports.applyLoan = async (req, res) => {
    try {
        const { amount, duration } = req.body;
        const userId = req.userId; // Extracted from the JWT token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Basic CIBIL score check for eligibility (mock logic)
        if (!user.cibilScore || user.cibilScore < 650) {
            return res.status(400).json({ message: 'Your CIBIL score does not meet the eligibility criteria for a loan.' });
        }

        // Determine interest rate based on CIBIL score (example logic)
        let interestRate = 15; // Default
        if (user.cibilScore >= 750) {
            interestRate = 10;
        } else if (user.cibilScore >= 650) {
            interestRate = 12;
        }
        user.interestRate = interestRate; // Update user's interest rate for future loans
        await user.save();

        const newLoanApplication = new LoanApplication({
            userId,
            amount,
            duration,
            interestRate,
        });

        await newLoanApplication.save();

        res.status(201).json({ message: 'Loan application submitted successfully!' });

    } catch (error) {
        console.error('Error applying for loan:', error);
        res.status(500).json({ message: 'Failed to submit loan application. Please try again.' });
    }
};

// Function to get all loan applications for a specific user
exports.getUserLoanApplications = async (req, res) => {
    try {
        const userId = req.userId;

        const loanApplications = await LoanApplication.find({ userId }).populate('userId', 'name email'); // Populate user details

        res.status(200).json(loanApplications);

    } catch (error) {
        console.error('Error fetching user loan applications:', error);
        res.status(500).json({ message: 'Failed to fetch loan applications.' });
    }
};

// Function to get data for the user's dashboard
exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const loanApplications = await LoanApplication.find({ userId });
        const pendingApplications = loanApplications.filter(loan => loan.status === 'pending').length;
        const approvedApplications = loanApplications.filter(loan => loan.status === 'approved').length;
        const totalLoanAmount = loanApplications.reduce((sum, loan) => sum + loan.amount, 0);

        res.status(200).json({
            loanLimit: user.loanLimit,
            interestRate: user.interestRate,
            pendingApplications,
            approvedApplications,
            totalLoanAmount,
            // Add more dashboard data as needed
        });

    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data.' });
    }
};