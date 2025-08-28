class ReportsModule {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.storageKeyTransactions = 'finai_transactions';
        this.storageKeyBudgets = 'finai_budgets';
        this.charts = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.renderReports();
    }

    async loadData() {
        // Load transactions
        try {
            const storedTransactions = localStorage.getItem(this.storageKeyTransactions);
            if (storedTransactions) {
                this.transactions = JSON.parse(storedTransactions);
            } else {
                // Fallback data
                this.transactions = [
                    { id: 1, date: '2023-06-12', description: 'Grocery Store', category: 'Food & Dining', amount: -84.32, type: 'expense' },
                    { id: 2, date: '2023-06-11', description: 'Gas Station', category: 'Transportation', amount: -45.00, type: 'expense' },
                    { id: 3, date: '2023-06-10', description: 'Salary Deposit', category: 'Income', amount: 3200.00, type: 'income' },
                    { id: 4, date: '2023-06-09', description: 'Streaming Service', category: 'Entertainment', amount: -14.99, type: 'expense' },
                    { id: 5, date: '2023-06-08', description: 'Electric Bill', category: 'Utilities', amount: -124.50, type: 'expense' }
                ];
            }
        } catch (e) {
            console.error('Error loading transactions:', e);
            this.transactions = [];
        }

        // Load budgets
        try {
            const storedBudgets = localStorage.getItem(this.storageKeyBudgets);
            if (storedBudgets) {
                this.budgets = JSON.parse(storedBudgets);
            } else {
                // Fallback data
                this.budgets = [
                    { id: 1, name: 'Groceries', category: 'Food & Dining', limit: 400.00, period: 'monthly', spent: 215.67, color: '#4cc9f0' },
                    { id: 2, name: 'Transportation', category: 'Transportation', limit: 200.00, period: 'monthly', spent: 187.45, color: '#f72585' },
                    { id: 3, name: 'Entertainment', category: 'Entertainment', limit: 150.00, period: 'monthly', spent: 98.32, color: '#4361ee' },
                    { id: 4, name: 'Utilities', category: 'Utilities', limit: 300.00, period: 'monthly', spent: 275.80, color: '#3f37c9' }
                ];
            }
        } catch (e) {
            console.error('Error loading budgets:', e);
            this.budgets = [];
        }
    }

    bindEvents() {
        const periodFilter = document.getElementById('report-period');
        const categoryFilter = document.getElementById('report-category');

        if (periodFilter) {
            periodFilter.addEventListener('change', () => this.renderReports());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.renderReports());
        }
    }

    renderReports() {
        this.renderIncomeExpenseChart();
        this.renderCategoryChart();
        this.renderTrendChart();
        this.renderBudgetChart();
        this.renderSummary();
    }

    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    renderIncomeExpenseChart() {
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) return;

        const income = this.transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        this.destroyChart('incomeExpenseChart');

        this.charts.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: 'Amount ($)',
                    data: [income, expenses],
                    backgroundColor: [
                        'rgba(76, 201, 240, 0.7)',
                        'rgba(247, 37, 133, 0.7)'
                    ],
                    borderColor: [
                        'rgba(76, 201, 240, 1)',
                        'rgba(247, 37, 133, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        // Group expenses by category
        const categoryTotals = {};
        this.transactions
            .filter(t => t.amount < 0)
            .forEach(transaction => {
                const category = transaction.category;
                const amount = Math.abs(transaction.amount);
                
                if (categoryTotals[category]) {
                    categoryTotals[category] += amount;
                } else {
                    categoryTotals[category] = amount;
                }
            });

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);

        this.destroyChart('categoryChart');

        this.charts.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        '#4361ee',
                        '#3f37c9',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7',
                        '#3a0ca3'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    renderTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        // Group transactions by month
        const monthlyData = {};
        this.transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            
            if (!monthlyData[key]) {
                monthlyData[key] = { income: 0, expenses: 0 };
            }
            
            if (transaction.amount > 0) {
                monthlyData[key].income += transaction.amount;
            } else {
                monthlyData[key].expenses += Math.abs(transaction.amount);
            }
        });

        const months = Object.keys(monthlyData);
        const incomeData = months.map(month => monthlyData[month].income);
        const expenseData = months.map(month => monthlyData[month].expenses);

        this.destroyChart('trendChart');

        this.charts.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: 'rgba(76, 201, 240, 1)',
                        backgroundColor: 'rgba(76, 201, 240, 0.2)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: 'rgba(247, 37, 133, 1)',
                        backgroundColor: 'rgba(247, 37, 133, 0.2)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    renderBudgetChart() {
        const ctx = document.getElementById('budgetChart');
        if (!ctx) return;

        const budgetNames = this.budgets.map(b => b.name);
        const budgetLimits = this.budgets.map(b => b.limit);
        const budgetSpent = this.budgets.map(b => b.spent);

        this.destroyChart('budgetChart');

        this.charts.budgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: budgetNames,
                datasets: [
                    {
                        label: 'Budget Limit',
                        data: budgetLimits,
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Amount Spent',
                        data: budgetSpent,
                        backgroundColor: 'rgba(247, 37, 133, 0.7)',
                        borderColor: 'rgba(247, 37, 133, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    renderSummary() {
        // Summary is static in this example
        // In a real app, this would be calculated dynamically
    }

    updateReports() {
        this.loadData().then(() => {
            this.renderReports();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.reportsModule = new ReportsModule();
});