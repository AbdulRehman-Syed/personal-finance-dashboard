class FinAIUtils {
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    static getProgressClass(percentage) {
        if (percentage < 70) return 'good';
        if (percentage < 100) return 'warning';
        return 'danger';
    }

    static getRandomColor() {
        const colors = ['#4cc9f0', '#f72585', '#4361ee', '#3f37c9', '#7209b7', '#3a0ca3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static calculateStats(transactions) {
        const income = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expenses = transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
        const balance = income - expenses;
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
        
        return { income, expenses, balance, savingsRate };
    }
}

// Make it available globally
window.FinAIUtils = FinAIUtils;