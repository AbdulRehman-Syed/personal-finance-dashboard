class GoalsModule {
    constructor() {
        this.goals = [
            {
                id: 1,
                name: "Emergency Fund",
                target: 5000.00,
                current: 2350.00,
                deadline: "2024-12-31",
                category: "savings",
                description: "3-6 months of living expenses",
                status: "on-track"
            },
            {
                id: 2,
                name: "Vacation to Europe",
                target: 3500.00,
                current: 1200.00,
                deadline: "2024-06-15",
                category: "major-purchase",
                description: "Two-week trip to Italy and France",
                status: "on-track"
            },
            {
                id: 3,
                name: "Pay Off Credit Card",
                target: 2500.00,
                current: 2500.00,
                deadline: "2023-09-30",
                category: "debt",
                description: "High-interest credit card debt",
                status: "completed"
            }
        ];
        this.storageKey = 'finai_goals';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderGoals();
    }

    bindEvents() {
        const addGoalBtn = document.getElementById('add-goal-btn');
        const closeModalElements = document.querySelectorAll('.close-modal, .close-modal-btn');
        const goalForm = document.getElementById('goal-form');

        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => this.openModal());
        }

        closeModalElements.forEach(element => {
            element.addEventListener('click', () => this.closeModal());
        });

        if (goalForm) {
            goalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Close modal when clicking outside
        const modal = document.getElementById('goal-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('goal-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('goal-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('goal-form');
        if (form) {
            form.reset();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const validation = FormValidator.validateGoal({
            name: document.getElementById('goal-name'),
            target: document.getElementById('goal-target'),
            deadline: document.getElementById('goal-deadline'),
            category: document.getElementById('goal-category')
        });
        
        const errorContainer = document.getElementById('goal-form-errors');
        if (!errorContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'goal-form-errors';
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        FormValidator.displayErrors(validation.errors, 'goal-form-errors');
        
        if (validation.isValid) {
            const name = document.getElementById('goal-name').value;
            const target = parseFloat(document.getElementById('goal-target').value);
            const current = parseFloat(document.getElementById('goal-current').value) || 0;
            const deadline = document.getElementById('goal-deadline').value;
            const category = document.getElementById('goal-category').value;
            const description = document.getElementById('goal-description').value;
            
            const goal = {
                id: this.goals.length > 0 ? Math.max(...this.goals.map(g => g.id)) + 1 : 1,
                name,
                target,
                current,
                deadline,
                category,
                description,
                status: this.calculateGoalStatus(current, target, deadline)
            };
            
            this.goals.push(goal);
            this.renderGoals();
            this.closeModal();
            
            this.showSuccessMessage('Goal created successfully!');
        }
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const form = document.getElementById('goal-form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 3000);
        }
    }

    calculateGoalStatus(current, target, deadline) {
        const progress = current / target;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalDays = Math.ceil((deadlineDate.getTime() - new Date().setFullYear(new Date().getFullYear() - 1)) / (1000 * 3600 * 24));
        const requiredProgress = 1 - (daysLeft / totalDays);
        
        if (current >= target) return 'completed';
        if (progress >= requiredProgress) return 'on-track';
        return 'behind';
    }

    renderGoals() {
        const container = document.getElementById('goals-container');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = `
                <div class="empty-goals">
                    <i class="fas fa-bullseye"></i>
                    <h3>No Financial Goals Yet</h3>
                    <p>Set your first financial goal to start working toward financial freedom</p>
                    <button id="create-first-goal" class="btn btn-primary">
                        Create Your First Goal
                    </button>
                </div>
            `;
            
            document.getElementById('create-first-goal').addEventListener('click', () => {
                this.openModal();
            });
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            const deadlineDate = new Date(goal.deadline);
            const timeDiff = deadlineDate.getTime() - new Date().getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            return `
                <div class="goal-card">
                    <div class="goal-status ${goal.status}">
                        ${goal.status === 'completed' ? 'Completed' : 
                          goal.status === 'on-track' ? 'On Track' : 'Behind Schedule'}
                    </div>
                    <div class="goal-header">
                        <div>
                            <div class="goal-title">${goal.name}</div>
                            <div class="goal-category">${this.formatCategory(goal.category)}</div>
                        </div>
                    </div>
                    
                    <div class="goal-amounts">
                        <div class="goal-current">${FinAIUtils.formatCurrency(goal.current)}</div>
                        <div class="goal-target">of ${FinAIUtils.formatCurrency(goal.target)}</div>
                    </div>
                    
                    <div class="goal-progress-container">
                        <div class="goal-progress-label">
                            <span>${progress.toFixed(1)}% Complete</span>
                            <span>${daysLeft} days left</span>
                        </div>
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill ${goal.category}" 
                                 style="width: ${progress}%"></div>
                        </div>
                    </div>
                    
                    ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                    
                    <div class="goal-deadline">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Deadline: ${FinAIUtils.formatDate(goal.deadline)}</span>
                    </div>
                    
                    <div class="goal-actions">
                        <button class="btn-goal edit" data-id="${goal.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-goal contribute" data-id="${goal.id}">
                            <i class="fas fa-plus"></i> Contribute
                        </button>
                        <button class="btn-goal delete" data-id="${goal.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind events
        document.querySelectorAll('.btn-goal.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.editGoal(id);
            });
        });

        document.querySelectorAll('.btn-goal.contribute').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.contributeToGoal(id);
            });
        });

        document.querySelectorAll('.btn-goal.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteGoal(id);
            });
        });
    }

    formatCategory(category) {
        const categories = {
            'savings': 'Savings',
            'debt': 'Debt Repayment',
            'investment': 'Investment',
            'major-purchase': 'Major Purchase',
            'other': 'Other'
        };
        return categories[category] || category;
    }

    editGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            // In a real app, this would populate the form with goal data
            alert(`Edit goal: ${goal.name}`);
        }
    }

    contributeToGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            const amount = prompt(`How much would you like to contribute to "${goal.name}"?`, '0.00');
            if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
                goal.current += parseFloat(amount);
                goal.status = this.calculateGoalStatus(goal.current, goal.target, goal.deadline);
                this.renderGoals();
            }
        }
    }

    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(goal => goal.id !== id);
            this.renderGoals();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GoalsModule();
});