class FinAIDashboard {
    static navigateTo(page) {
        const pages = {
            'dashboard': 'index.html',
            'transactions': 'transactions.html',
            'budgets': 'budgets.html',
            'reports': 'reports.html',
            'goals': 'goals.html'
        };
        
        if (pages[page]) {
            window.location.href = pages[page];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});