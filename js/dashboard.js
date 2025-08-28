class DashboardModule {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderDashboard();
        this.initCharts();
    }

    async loadData() {
        // Load transactions
        const transactionsData = localStorage.getItem('finai_transactions');
        if (transactionsData) {
            try {
                this.transactions = JSON.parse(transactionsData);
            } catch (e) {
                console.error('Error parsing stored transactions:', e);
            }
        } else {
            this.transactions = [
                { id: 1, date: '2023-06-12', description: 'Grocery Store', category: 'Food & Dining', amount: -84.32, type: 'expense' },
                { id: 2, date: '2023-06-11', description: 'Gas Station', category: 'Transportation', amount: -45.00, type: 'expense' },
                { id: 3, date: '2023-06-10', description: 'Salary Deposit', category: 'Income', amount: 3200.00, type: 'income' },
                { id: 4, date: '2023-06-09', description: 'Streaming Service', category: 'Entertainment', amount: -14.99, type: 'expense' },
                { id: 5, date: '2023-06-08', description: 'Electric Bill', category: 'Utilities', amount: -124.50, type: 'expense' }
            ];
        }

        // Load budgets
        const budgetsData = localStorage.getItem('finai_budgets');
        if (budgetsData) {
            try {
                this.budgets = JSON.parse(budgetsData);
            } catch (e) {
                console.error('Error parsing stored budgets:', e);
            }
        } else {
            this.budgets = [
                { id: 1, name: 'Groceries', category: 'Food & Dining', limit: 400.00, period: 'monthly', spent: 215.67, color: '#4cc9f0' },
                { id: 2, name: 'Transportation', category: 'Transportation', limit: 200.00, period: 'monthly', spent: 187.45, color: '#f72585' },
                { id: 3, name: 'Entertainment', category: 'Entertainment', limit: 150.00, period: 'monthly', spent: 98.32, color: '#4361ee' },
                { id: 4, name: 'Utilities', category: 'Utilities', limit: 300.00, period: 'monthly', spent: 275.80, color: '#3f37c9' }
            ];
        }
    }

    initCharts() {
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            const chartLoading = document.getElementById('chart-loading');
            if (chartLoading) {
                chartLoading.style.display = 'none';
            }
        }, 500);
    }

    renderDashboard() {
        const stats = FinAIUtils.calculateStats(this.transactions);
        this.renderStats(stats);
        this.renderBudgetSummary();
        this.renderRecentTransactions();
    }

    renderStats(stats) {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid) return;

        const statsData = [
            {
                title: 'Total Income',
                value: FinAIUtils.formatCurrency(stats.income),
                change: '+12.4%',
                changeType: 'positive',
                icon: 'fa-arrow-down',
                class: 'income'
            },
            {
                title: 'Total Expenses',
                value: FinAIUtils.formatCurrency(stats.expenses),
                change: '+3.2%',
                changeType: 'negative',
                icon: 'fa-arrow-up',
                class: 'expense'
            },
            {
                title: 'Current Balance',
                value: FinAIUtils.formatCurrency(stats.balance),
                change: '+8.7%',
                changeType: 'positive',
                icon: 'fa-wallet',
                class: 'balance'
            },
            {
                title: 'Savings Rate',
                value: `${stats.savingsRate.toFixed(1)}%`,
                change: '+5.3%',
                changeType: 'positive',
                icon: 'fa-piggy-bank',
                class: 'savings'
            }
        ];

        statsGrid.innerHTML = statsData.map(stat => `
            <div class="stat-card ${stat.class}">
                <div class="stat-header">
                    <div class="stat-title">${stat.title}</div>
                    <div class="stat-icon">
                        <i class="fas ${stat.icon}"></i>
                    </div>
                </div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-change ${stat.changeType}">
                    <i class="fas fa-arrow-${stat.changeType === 'positive' ? 'up' : 'up'}"></i>
                    <span>${stat.change} from last month</span>
                </div>
            </div>
        `).join('');
    }

    renderBudgetSummary() {
        // Render budget summary on dashboard
    }

    renderRecentTransactions() {
        const transactionsList = document.getElementById('transactions-list');
        if (!transactionsList) return;

        // Show only the 5 most recent transactions
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        transactionsList.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon" style="background: ${this.getCategoryColor(transaction.category)}; color: white;">
                    <i class="fas ${this.getCategoryIcon(transaction.category)}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-name">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'income-amount' : 'expense-amount'}">
                    ${transaction.amount > 0 ? '+' : ''}${FinAIUtils.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-date">${FinAIUtils.formatDate(transaction.date)}</div>
            </div>
        `).join('');
    }

    getCategoryColor(category) {
        const colors = {
            'Food & Dining': 'rgba(76, 201, 240, 0.15)',
            'Transportation': 'rgba(247, 37, 133, 0.15)',
            'Income': 'rgba(67, 97, 238, 0.15)',
            'Entertainment': 'rgba(63, 55, 201, 0.15)',
            'Utilities': 'rgba(247, 37, 133, 0.15)'
        };
        return colors[category] || 'rgba(114, 9, 183, 0.15)';
    }

    getCategoryIcon(category) {
        const icons = {
            'Food & Dining': 'fa-shopping-cart',
            'Transportation': 'fa-car',
            'Income': 'fa-money-bill-wave',
            'Entertainment': 'fa-film',
            'Utilities': 'fa-home'
        };
        return icons[category] || 'fa-question';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardModule();
});