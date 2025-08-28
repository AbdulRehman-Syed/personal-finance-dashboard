class FormValidator {
    static validateTransaction(form) {
        const errors = [];
        
        const date = form.date.value;
        const description = form.description.value.trim();
        const category = form.category.value;
        const amount = parseFloat(form.amount.value);
        
        if (!date) {
            errors.push('Date is required');
        }
        
        if (!description) {
            errors.push('Description is required');
        } else if (description.length < 3) {
            errors.push('Description must be at least 3 characters');
        }
        
        if (!category) {
            errors.push('Category is required');
        }
        
        if (isNaN(amount) || amount <= 0) {
            errors.push('Amount must be a positive number');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateBudget(form) {
        const errors = [];
        
        const name = form.name.value.trim();
        const category = form.category.value;
        const limit = parseFloat(form.limit.value);
        const period = form.period.value;
        
        if (!name) {
            errors.push('Budget name is required');
        } else if (name.length < 3) {
            errors.push('Budget name must be at least 3 characters');
        }
        
        if (!category) {
            errors.push('Category is required');
        }
        
        if (isNaN(limit) || limit <= 0) {
            errors.push('Budget limit must be a positive number');
        }
        
        if (!period) {
            errors.push('Period is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateGoal(form) {
        const errors = [];
        
        const name = form.name.value.trim();
        const target = parseFloat(form.target.value);
        const deadline = form.deadline.value;
        const category = form.category.value;
        
        if (!name) {
            errors.push('Goal name is required');
        } else if (name.length < 3) {
            errors.push('Goal name must be at least 3 characters');
        }
        
        if (isNaN(target) || target <= 0) {
            errors.push('Target amount must be a positive number');
        }
        
        if (!deadline) {
            errors.push('Deadline is required');
        } else {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            if (deadlineDate < today) {
                errors.push('Deadline must be in the future');
            }
        }
        
        if (!category) {
            errors.push('Category is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static displayErrors(errors, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (errors.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = `
            <div class="error-messages">
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        container.style.display = 'block';
    }
    
    static clearErrors(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }
    
    static addInputValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }
}

// Make it available globally
window.FormValidator = FormValidator;