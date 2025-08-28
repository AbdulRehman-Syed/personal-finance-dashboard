class AIFinancialEngine {
    constructor() {
        this.transactions = [
            { id: 1, date: '2023-06-12', description: 'Grocery Store', category: 'Food & Dining', amount: -84.32, type: 'expense' },
            { id: 2, date: '2023-06-11', description: 'Gas Station', category: 'Transportation', amount: -45.00, type: 'expense' },
            { id: 3, date: '2023-06-10', description: 'Salary Deposit', category: 'Income', amount: 3200.00, type: 'income' },
            { id: 4, date: '2023-06-09', description: 'Streaming Service', category: 'Entertainment', amount: -14.99, type: 'expense' },
            { id: 5, date: '2023-06-08', description: 'Electric Bill', category: 'Utilities', amount: -124.50, type: 'expense' }
        ];
        this.budgets = [
            { id: 1, name: 'Groceries', category: 'Food & Dining', limit: 400.00, period: 'monthly', spent: 215.67, color: '#4cc9f0' },
            { id: 2, name: 'Transportation', category: 'Transportation', limit: 200.00, period: 'monthly', spent: 187.45, color: '#f72585' },
            { id: 3, name: 'Entertainment', category: 'Entertainment', limit: 150.00, period: 'monthly', spent: 98.32, color: '#4361ee' },
            { id: 4, name: 'Utilities', category: 'Utilities', limit: 300.00, period: 'monthly', spent: 275.80, color: '#3f37c9' }
        ];
        this.insights = [];
        this.init();
    }

    init() {
        this.generateInsights();
        this.startInsightRotation();
    }

    generateInsights() {
        this.insights = [];
        
        // Generate spending pattern insights
        this.generateSpendingInsights();
        
        // Generate budget insights
        this.generateBudgetInsights();
        
        // Generate savings insights
        this.generateSavingsInsights();
        
        // Generate category-specific insights
        this.generateCategoryInsights();
        
        // If no insights generated, add default ones
        if (this.insights.length === 0) {
            this.insights = [
                "Start tracking your expenses to receive personalized insights.",
                "Create budgets for your spending categories to gain better control.",
                "Set savings goals to automatically get recommendations on how to achieve them."
            ];
        }
    }

    generateSpendingInsights() {
        // Calculate spending by category
        const categorySpending = {};
        const expenses = this.transactions.filter(t => t.amount < 0);
        
        expenses.forEach(transaction => {
            const category = transaction.category;
            const amount = Math.abs(transaction.amount);
            
            if (categorySpending[category]) {
                categorySpending[category] += amount;
            } else {
                categorySpending[category] = amount;
            }
        });
        
        // Find highest spending category
        let highestCategory = '';
        let highestAmount = 0;
        
        for (const [category, amount] of Object.entries(categorySpending)) {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestCategory = category;
            }
        }
        
        // Generate insight if significant spending in a category
        if (highestCategory && highestAmount > 100) {
            this.insights.push(`Your highest spending category is <strong>${highestCategory}</strong> with <strong>${FinAIUtils.formatCurrency(highestAmount)}</strong> this month. Consider reviewing this category for potential savings.`);
        }
        
        // Check for recurring expenses
        this.checkRecurringExpenses();
    }

    checkRecurringExpenses() {
        // Group transactions by description
        const transactionGroups = {};
        
        this.transactions.forEach(transaction => {
            if (transaction.description && transaction.amount < 0) {
                if (!transactionGroups[transaction.description]) {
                    transactionGroups[transaction.description] = [];
                }
                transactionGroups[transaction.description].push(transaction);
            }
        });
        
        // Find recurring subscriptions/services
        for (const [description, transactions] of Object.entries(transactionGroups)) {
            if (transactions.length >= 3) { // At least 3 occurrences
                const amounts = transactions.map(t => Math.abs(t.amount));
                const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
                
                this.insights.push(`You've paid <strong>${description}</strong> ${transactions.length} times this month, averaging <strong>${FinAIUtils.formatCurrency(avgAmount)}</strong> per payment. Review if this subscription is still necessary.`);
            }
        }
    }

    generateBudgetInsights() {
        this.budgets.forEach(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            
            if (percentage > 100) {
                const overAmount = budget.spent - budget.limit;
                this.insights.push(`You've exceeded your <strong>${budget.name}</strong> budget by <strong>${FinAIUtils.formatCurrency(overAmount)}</strong>. Consider adjusting your spending in this category.`);
            } else if (percentage > 80) {
                const remaining = budget.limit - budget.spent;
                this.insights.push(`You're close to your <strong>${budget.name}</strong> budget limit. You have <strong>${FinAIUtils.formatCurrency(remaining)}</strong> remaining.`);
            } else if (percentage < 20) {
                this.insights.push(`You're significantly under budget for <strong>${budget.name}</strong>. Consider reallocating some funds to other priorities.`);
            }
        });
    }

    generateSavingsInsights() {
        const stats = FinAIUtils.calculateStats(this.transactions);
        
        if (stats.savingsRate < 10) {
            const potentialSavings = stats.income * 0.1; // 10% of income
            this.insights.push(`Your savings rate is <strong>${stats.savingsRate.toFixed(1)}%</strong>. Aim to save at least <strong>10%</strong> of your income. You could save an additional <strong>${FinAIUtils.formatCurrency(potentialSavings)}</strong> monthly.`);
        } else if (stats.savingsRate > 20) {
            this.insights.push(`Great job! Your savings rate of <strong>${stats.savingsRate.toFixed(1)}%</strong> is above average. Keep up the good work!`);
        }
    }

    generateCategoryInsights() {
        // Food & Dining insights
        const diningExpenses = this.transactions
            .filter(t => t.category === 'Food & Dining' && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
        if (diningExpenses > 200) {
            const potentialSavings = diningExpenses * 0.2; // 20% potential savings
            this.insights.push(`Your dining expenses of <strong>${FinAIUtils.formatCurrency(diningExpenses)}</strong> are high. Cooking at home more often could save you <strong>${FinAIUtils.formatCurrency(potentialSavings)}</strong> monthly.`);
        }
        
        // Transportation insights
        const transportExpenses = this.transactions
            .filter(t => t.category === 'Transportation' && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
        if (transportExpenses > 150) {
            this.insights.push(`Your transportation costs of <strong>${FinAIUtils.formatCurrency(transportExpenses)}</strong> are significant. Consider carpooling or public transport to reduce expenses.`);
        }
    }

    startInsightRotation() {
        const insightElement = document.getElementById('ai-insight-content');
        if (!insightElement || this.insights.length === 0) return;
        
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % this.insights.length;
            insightElement.innerHTML = `<p>${this.insights[currentIndex]}</p>`;
            insightElement.style.opacity = 0;
            setTimeout(() => {
                insightElement.style.opacity = 1;
            }, 100);
        }, 8000);
    }

    getInsights() {
        return this.insights;
    }

    refreshInsights() {
        this.generateInsights();
    }
}

// Initialize AI engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiEngine = new AIFinancialEngine();
});