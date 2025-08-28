class FinAICharts {
    constructor() {
        this.transactions = [];
        this.categoryChart = null;
        this.storageKey = 'finai_transactions';
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderCharts();
    }

    async loadData() {
        // Try to load from localStorage first
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            try {
                this.transactions = JSON.parse(storedData);
                return;
            } catch (e) {
                console.error('Error parsing stored transactions:', e);
            }
        }

        // If no localStorage data, use fallback data
        this.transactions = [
            { id: 1, date: '2023-06-12', description: 'Grocery Store', category: 'Food & Dining', amount: -84.32, type: 'expense' },
            { id: 2, date: '2023-06-11', description: 'Gas Station', category: 'Transportation', amount: -45.00, type: 'expense' },
            { id: 3, date: '2023-06-10', description: 'Salary Deposit', category: 'Income', amount: 3200.00, type: 'income' },
            { id: 4, date: '2023-06-09', description: 'Streaming Service', category: 'Entertainment', amount: -14.99, type: 'expense' },
            { id: 5, date: '2023-06-08', description: 'Electric Bill', category: 'Utilities', amount: -124.50, type: 'expense' }
        ];
    }

    renderCharts() {
        this.renderSpendingByCategoryChart();
    }

    renderSpendingByCategoryChart() {
        const ctx = document.getElementById('spendingChart');
        if (!ctx) return;

        // Filter expenses and group by category
        const expenses = this.transactions.filter(t => t.amount < 0);
        const categoryTotals = {};

        expenses.forEach(transaction => {
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

        // Destroy existing chart if it exists
        if (this.categoryChart) {
            this.categoryChart.destroy();
            this.categoryChart = null;
        }

        // Add this to ensure canvas is clean
        if (Chart.getChart(ctx)) {
            Chart.getChart(ctx).destroy();
        }

        // Create new chart - FIXED THE SYNTAX ERRORS HERE
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: { // Added the missing 'data' property
                labels: categories,
                datasets: [{
                    data: amounts, // Added the missing 'data' property
                    backgroundColor: [
                        '#4361ee',
                        '#3f37c9',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7',
                        '#3a0ca3',
                        '#4895ef',
                        '#4cc9f0'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: $${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });

        // Hide loading indicator
        setTimeout(() => {
            const chartLoading = document.getElementById('chart-loading');
            if (chartLoading) {
                chartLoading.style.display = 'none';
            }
        }, 500);
    }

    updateCharts() {
        this.loadData().then(() => {
            this.renderCharts();
        });
    }

    destroy() {
        if (this.categoryChart) {
            this.categoryChart.destroy();
            this.categoryChart = null;
        }
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if instance already exists and destroy it
    if (window.finAICharts) {
        window.finAICharts.destroy();
    }
    
    window.finAICharts = new FinAICharts();
});