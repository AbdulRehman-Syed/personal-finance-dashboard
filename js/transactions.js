class TransactionsModule {
    constructor() {
        this.transactions = [
            { id: 1, date: '2023-06-12', description: 'Grocery Store', category: 'Food & Dining', amount: -84.32, type: 'expense' },
            { id: 2, date: '2023-06-11', description: 'Gas Station', category: 'Transportation', amount: -45.00, type: 'expense' },
            { id: 3, date: '2023-06-10', description: 'Salary Deposit', category: 'Income', amount: 3200.00, type: 'income' },
            { id: 4, date: '2023-06-09', description: 'Streaming Service', category: 'Entertainment', amount: -14.99, type: 'expense' },
            { id: 5, date: '2023-06-08', description: 'Electric Bill', category: 'Utilities', amount: -124.50, type: 'expense' }
        ];
        this.storageKey = 'finai_transactions';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTransactions();
    }

    bindEvents() {
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        const closeModalElements = document.querySelectorAll('.close-modal, .close-modal-btn');
        const transactionForm = document.getElementById('transaction-form');

        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => this.openModal());
        }

        closeModalElements.forEach(element => {
            element.addEventListener('click', () => this.closeModal());
        });

        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('transaction-form');
        if (form) {
            form.reset();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const validation = FormValidator.validateTransaction({
            date: document.getElementById('transaction-date'),
            description: document.getElementById('transaction-description'),
            category: document.getElementById('transaction-category'),
            amount: document.getElementById('transaction-amount')
        });
        
        const errorContainer = document.getElementById('transaction-form-errors');
        if (!errorContainer) {
            // Create error container if it doesn't exist
            const errorDiv = document.createElement('div');
            errorDiv.id = 'transaction-form-errors';
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        FormValidator.displayErrors(validation.errors, 'transaction-form-errors');
        
        if (validation.isValid) {
            const date = document.getElementById('transaction-date').value;
            const description = document.getElementById('transaction-description').value;
            const category = document.getElementById('transaction-category').value;
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            const type = document.querySelector('input[name="transaction-type"]:checked').value;
            
            const transaction = {
                id: this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
                date,
                description,
                category,
                amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
                type
            };
            
            this.transactions.unshift(transaction);
            this.renderTransactions();
            this.closeModal();
            
            // Show success message
            this.showSuccessMessage('Transaction added successfully!');
        }
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const form = document.getElementById('transaction-form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 3000);
        }
    }

    renderTransactions() {
        const tableBody = document.getElementById('transactions-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td>${FinAIUtils.formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="transaction-amount ${transaction.amount > 0 ? 'income' : 'expense'}">
                    ${transaction.amount > 0 ? '+' : ''}${FinAIUtils.formatCurrency(transaction.amount)}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit-btn" data-id="${transaction.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete-btn" data-id="${transaction.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind edit and delete events
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.editTransaction(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteTransaction(id);
            });
        });
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            // In a real app, this would populate the form with transaction data
            alert(`Edit transaction: ${transaction.description}`);
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(transaction => transaction.id !== id);
            this.renderTransactions();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TransactionsModule();
});