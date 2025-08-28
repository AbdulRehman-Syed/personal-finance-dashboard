class BudgetsModule {
    constructor() {
        this.budgets = [
            { id: 1, name: 'Groceries', category: 'Food & Dining', limit: 400.00, period: 'monthly', spent: 215.67, color: '#4cc9f0' },
            { id: 2, name: 'Transportation', category: 'Transportation', limit: 200.00, period: 'monthly', spent: 187.45, color: '#f72585' },
            { id: 3, name: 'Entertainment', category: 'Entertainment', limit: 150.00, period: 'monthly', spent: 98.32, color: '#4361ee' },
            { id: 4, name: 'Utilities', category: 'Utilities', limit: 300.00, period: 'monthly', spent: 275.80, color: '#3f37c9' }
        ];
        this.storageKey = 'finai_budgets';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderBudgets();
    }

    bindEvents() {
        const addBudgetBtn = document.getElementById('add-budget-btn');
        const closeModalElements = document.querySelectorAll('.close-modal, .close-modal-btn');
        const budgetForm = document.getElementById('budget-form');

        if (addBudgetBtn) {
            addBudgetBtn.addEventListener('click', () => this.openModal());
        }

        closeModalElements.forEach(element => {
            element.addEventListener('click', () => this.closeModal());
        });

        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const modal = document.getElementById('budget-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('budget-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('budget-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('budget-form');
        if (form) {
            form.reset();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const validation = FormValidator.validateBudget({
            name: document.getElementById('budget-name'),
            category: document.getElementById('budget-category'),
            limit: document.getElementById('budget-amount'),
            period: document.getElementById('budget-period')
        });
        
        const errorContainer = document.getElementById('budget-form-errors');
        if (!errorContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'budget-form-errors';
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        FormValidator.displayErrors(validation.errors, 'budget-form-errors');
        
        if (validation.isValid) {
            const name = document.getElementById('budget-name').value;
            const category = document.getElementById('budget-category').value;
            const limit = parseFloat(document.getElementById('budget-amount').value);
            const period = document.getElementById('budget-period').value;
            
            const budget = {
                id: this.budgets.length > 0 ? Math.max(...this.budgets.map(b => b.id)) + 1 : 1,
                name,
                category,
                limit,
                period,
                spent: 0,
                color: FinAIUtils.getRandomColor()
            };
            
            this.budgets.push(budget);
            this.renderBudgets();
            this.closeModal();
            
            this.showSuccessMessage('Budget created successfully!');
        }
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const form = document.getElementById('budget-form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 3000);
        }
    }

    renderBudgets() {
        const container = document.getElementById('budgets-container');
        if (!container) return;

        if (this.budgets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet" style="font-size: 3rem; margin-bottom: 20px; color: var(--gray);"></i>
                    <h3>No Budgets Yet</h3>
                    <p>Create your first budget to start tracking your spending</p>
                    <button id="create-first-budget" class="btn btn-primary" style="margin-top: 20px;">
                        Create Budget
                    </button>
                </div>
            `;
            
            document.getElementById('create-first-budget').addEventListener('click', () => {
                this.openModal();
            });
            return;
        }

        container.innerHTML = this.budgets.map(budget => {
            const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
            const remaining = budget.limit - budget.spent;
            const isOver = budget.spent > budget.limit;
            
            return `
                <div class="budget-card">
                    <div class="budget-header">
                        <div>
                            <div class="budget-title">${budget.name}</div>
                            <div class="budget-category">${budget.category}</div>
                        </div>
                        <div class="budget-amount">${FinAIUtils.formatCurrency(budget.limit)}</div>
                    </div>
                    
                    <div class="budget-progress-container">
                        <div class="budget-progress-label">
                            <span>Spent: ${FinAIUtils.formatCurrency(budget.spent)}</span>
                            <span>${isOver ? 'Over by' : 'Remaining'}: ${FinAIUtils.formatCurrency(Math.abs(remaining))}</span>
                        </div>
                        <div class="budget-progress-bar">
                            <div class="budget-progress-fill progress-${FinAIUtils.getProgressClass(percentage)}" 
                                 style="width: ${Math.min(100, percentage)}%; background: ${budget.color};"></div>
                        </div>
                    </div>
                    
                    <div class="budget-stats">
                        <div class="budget-stat">
                            <div class="budget-stat-value">${percentage.toFixed(1)}%</div>
                            <div class="budget-stat-label">Used</div>
                        </div>
                        <div class="budget-stat">
                            <div class="budget-stat-value">${FinAIUtils.formatCurrency(remaining)}</div>
                            <div class="budget-stat-label">${isOver ? 'Over' : 'Left'}</div>
                        </div>
                    </div>
                    
                    <div class="budget-actions">
                        <button class="btn-budget edit" data-id="${budget.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-budget delete" data-id="${budget.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.btn-budget.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.editBudget(id);
            });
        });

        document.querySelectorAll('.btn-budget.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteBudget(id);
            });
        });
    }

    editBudget(id) {
        const budget = this.budgets.find(b => b.id === id);
        if (budget) {
            // In a real app, this would populate the form with budget data
            alert(`Edit budget: ${budget.name}`);
        }
    }

    deleteBudget(id) {
        if (confirm('Are you sure you want to delete this budget?')) {
            this.budgets = this.budgets.filter(budget => budget.id !== id);
            this.renderBudgets();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BudgetsModule();
});