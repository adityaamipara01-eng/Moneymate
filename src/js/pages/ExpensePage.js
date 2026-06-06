// Expense Page Component
import {
    setState,
    deleteTransaction
} from '../app.js';
import { renderProgressBar } from '../components/Charts.js';

export function renderExpensePage(container, state) {
    if (!container) return;

    const currency = state.user.currency;
    const expenses = state.transactions.filter(t => t.type === 'expense');

    // Calculate category aggregates
    const categoryTotals = {
        Food: 0,
        Rent: 0,
        Shopping: 0,
        Utilities: 0,
        Entertainment: 0,
        Travel: 0,
        Others: 0
    };

    expenses.forEach(exp => {
        const cat = exp.category || 'Others';
        if (categoryTotals[cat] !== undefined) {
            categoryTotals[cat] += exp.amount;
        } else {
            categoryTotals['Others'] += exp.amount;
        }
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate budget percentage
    const budgetLimit = state.user.monthlyBudget;
    const budgetPct = (totalExpense / budgetLimit) * 100;
    
    // Choose status color for budget
    let budgetColorClass = 'success';
    if (budgetPct >= 90) {
        budgetColorClass = 'danger';
    } else if (budgetPct >= 70) {
        budgetColorClass = 'warning';
    }

    // Filter settings
    let selectedFilter = state.expenseFilter || 'All';

    const filteredExpenses = selectedFilter === 'All' 
        ? expenses 
        : expenses.filter(exp => exp.category === selectedFilter);

    // Format table rows HTML
    const expensesTableRows = filteredExpenses.length === 0 
        ? `<tr><td colspan="5" style="padding:2rem; text-align:center; color:hsl(var(--text-muted)); font-weight:500;">No expense logs found.</td></tr>`
        : filteredExpenses.map(exp => {
            return `
                <tr class="animate-fade-in" style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500;">
                    <td style="padding:0.75rem 0.5rem; color:hsl(var(--text-muted)); font-size:0.8rem;">${exp.date}</td>
                    <td style="padding:0.75rem 0.5rem; font-weight:600;">${exp.name}</td>
                    <td style="padding:0.75rem 0.5rem;">
                        <span class="status-badge overdue" style="padding:2px 8px; font-size:0.7rem; background-color:hsl(var(--danger-bg)); color:hsl(var(--danger));">
                            ${exp.category}
                        </span>
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-family:var(--font-heading); font-weight:700; color:hsl(var(--danger));">
                        -${currency}${exp.amount.toLocaleString()}
                    </td>
                    <td style="padding:0.75rem 0.5rem; text-align:right;">
                        <div style="display:inline-flex; gap:0.5rem;">
                            <button class="btn-icon btn-sm edit-expense-btn" data-id="${exp.id}" title="Edit Expense">
                                <i data-lucide="edit-3" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                            </button>
                            <button class="btn-icon btn-sm delete-expense-btn" data-id="${exp.id}" title="Delete Expense">
                                <i data-lucide="trash-2" style="width:14px; height:14px; color:hsl(var(--danger));"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
            
            <!-- Page Header -->
            <div class="app-header">
                <div class="header-title-section">
                    <h1>Expense Management</h1>
                    <p>Track your payouts, categorize expenses, and monitor budget utilization metrics</p>
                </div>
                <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:hsl(var(--danger)); background-color:hsl(var(--danger-bg)); padding:0.5rem 1rem; border-radius:var(--border-radius-sm);">
                    Total spent: ${currency}${totalExpense.toLocaleString()}
                </div>
            </div>

            <!-- Budget Alert widget -->
            <div class="card" id="budget-progress-container" style="display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i data-lucide="info" style="color:hsl(var(--primary));"></i>
                        <span style="font-weight:600;">Monthly Budget Progress</span>
                    </div>
                    <span style="font-size:0.85rem; color:hsl(var(--text-secondary)); font-weight:500;">
                        Spent ${currency}${totalExpense.toLocaleString()} of ${currency}${budgetLimit.toLocaleString()} limit
                    </span>
                </div>
                <div id="expense-budget-meter"></div>
            </div>

            <!-- Category Summary cards -->
            <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
                ${Object.keys(categoryTotals).map(catName => {
                    const colors = {
                        Food: '#f87171',
                        Rent: '#6366f1',
                        Shopping: '#fbbf24',
                        Utilities: '#38bdf8',
                        Entertainment: '#c084fc',
                        Travel: '#34d399',
                        Others: '#94a3b8'
                    };
                    return `
                        <div class="card" style="padding:1rem; border-top: 3px solid ${colors[catName] || '#fff'}; display:flex; flex-direction:column; gap:0.25rem;">
                            <span style="font-size:0.7rem; font-weight:700; color:hsl(var(--text-secondary)); text-transform:uppercase;">${catName}</span>
                            <span style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700;">${currency}${categoryTotals[catName].toLocaleString()}</span>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Layout: Table vs Form -->
            <div class="grid-2-1">
                
                <!-- Left: Expenses History Table -->
                <div class="card" style="display:flex; flex-direction:column; gap:1.25rem; overflow-x:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                        <h3 class="card-title" style="margin-bottom:0;">Expense History</h3>
                        
                        <!-- Filter Chips -->
                        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                            ${['All', 'Food', 'Rent', 'Shopping', 'Utilities', 'Entertainment', 'Travel', 'Others'].map(filterName => {
                                const isSel = filterName === selectedFilter;
                                return `
                                    <button class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}" class="filter-chip" data-filter="${filterName}" style="padding:0.35rem 0.6rem; font-size:0.75rem;">
                                        ${filterName}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Responsive Table -->
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; min-width:520px;">
                        <thead>
                            <tr style="border-bottom:1px solid hsl(var(--surface-border)); color:hsl(var(--text-secondary)); font-weight:600;">
                                <th style="padding:0.75rem 0.5rem;">Date</th>
                                <th style="padding:0.75rem 0.5rem;">Description</th>
                                <th style="padding:0.75rem 0.5rem;">Category</th>
                                <th style="padding:0.75rem 0.5rem;">Amount</th>
                                <th style="padding:0.75rem 0.5rem; text-align:right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expensesTableRows}
                        </tbody>
                    </table>
                </div>

                <!-- Right: Form card -->
                <div class="card" id="expense-form-card">
                    <h3 class="card-title" id="expense-form-title">Record New Expense</h3>
                    <form id="expense-page-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1rem;">
                        <div class="form-group">
                            <label class="form-label" for="exp-p-name">Description / Item</label>
                            <input type="text" id="exp-p-name" class="form-input" placeholder="e.g. Electric Power Bill" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="exp-p-amount">Amount (${currency})</label>
                            <input type="number" id="exp-p-amount" class="form-input" placeholder="0" required min="1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="exp-p-cat">Category</label>
                            <select id="exp-p-cat" class="form-input" required>
                                <option value="Food">Food</option>
                                <option value="Rent">Rent</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Travel">Travel</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="exp-p-date">Date</label>
                            <input type="date" id="exp-p-date" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div style="display:flex; gap:0.5rem; width:100%; margin-top:0.5rem;" id="form-actions-wrapper">
                            <button type="submit" class="btn btn-danger btn-block" id="expense-submit-btn">
                                <i data-lucide="minus-circle"></i> Save Transaction
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    `;

    // Render budget progress meter
    const meterContainer = document.getElementById('expense-budget-meter');
    renderProgressBar(meterContainer, budgetPct, budgetColorClass, 'Budget Utilization');

    // Filter Chips Click Handling
    const chips = container.querySelectorAll('[data-filter]');
    chips.forEach(chip => {
        chip.onclick = () => {
            const filterVal = chip.getAttribute('data-filter');
            setState({ expenseFilter: filterVal });
        };
    });

    // Save/Update Form Handler
    const form = document.getElementById('expense-page-form');
    const formTitle = document.getElementById('expense-form-title');
    const submitBtn = document.getElementById('expense-submit-btn');
    const actionsWrapper = document.getElementById('form-actions-wrapper');

    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('exp-p-name').value;
        const amount = parseFloat(document.getElementById('exp-p-amount').value);
        const category = document.getElementById('exp-p-cat').value;
        const date = document.getElementById('exp-p-date').value;

        // Check if editing or adding
        const editingId = form.getAttribute('data-editing-id');

        let updatedTxs;
        let notifTitle = '';
        let notifMsg = '';

        if (editingId) {
            // Edit Mode
            updatedTxs = state.transactions.map(t => {
                if (t.id === editingId) {
                    return { ...t, name, amount, category, date };
                }
                return t;
            });
            notifTitle = 'Expense Updated';
            notifMsg = `Updated expense "${name}" values to ₹${amount.toLocaleString()}.`;
        } else {
            // Add Mode
            const newTx = {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                type: 'expense',
                name,
                amount,
                category,
                date
            };
            updatedTxs = [newTx, ...state.transactions];
            notifTitle = 'Expense Logged';
            notifMsg = `Logged expense of ₹${amount.toLocaleString()} for "${name}".`;
        }

        // Budget warning check
        const currentSpent = updatedTxs.filter(t => t.type === 'expense' && t.date.startsWith('2026-06')).reduce((sum, t) => sum + t.amount, 0);
        const updatedNotifs = [...state.notifications];

        if (currentSpent > state.user.monthlyBudget && currentSpent - amount <= state.user.monthlyBudget) {
            updatedNotifs.unshift({
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'Overbudget Alert',
                message: `Spent ₹${currentSpent.toLocaleString()} exceeding your ₹${state.user.monthlyBudget.toLocaleString()} limit.`,
                date: 'Just now',
                type: 'warning',
                read: false
            });
        } else {
            updatedNotifs.unshift({
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: notifTitle,
                message: notifMsg,
                date: 'Just now',
                type: 'info',
                read: false
            });
        }

        // Reset editing attribute
        form.removeAttribute('data-editing-id');

        setState({ 
            transactions: updatedTxs, 
            notifications: updatedNotifs
        });
    };

    // Edit action listeners
    const editBtns = container.querySelectorAll('.edit-income-btn, .edit-expense-btn');
    editBtns.forEach(btn => {
         btn.onclick = async () => {
            const id = btn.getAttribute('data-id');
            const exp = state.transactions.find(t => t.id === id);

            // Populate form
            document.getElementById('exp-p-name').value = exp.name;
            document.getElementById('exp-p-amount').value = exp.amount;
            document.getElementById('exp-p-cat').value = exp.category;
            document.getElementById('exp-p-date').value = exp.date;

            // Set Form to edit mode
            form.setAttribute('data-editing-id', id);
            formTitle.innerText = 'Edit Expense Log';
            
            // Render Cancel button if not already there
            if (!document.getElementById('cancel-edit-btn')) {
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'btn btn-secondary';
                cancelBtn.id = 'cancel-edit-btn';
                cancelBtn.innerText = 'Cancel';
                cancelBtn.onclick = async () => {
                    form.reset();
                    form.removeAttribute('data-editing-id');
                    formTitle.innerText = 'Record New Expense';
                    submitBtn.innerHTML = `<i data-lucide="minus-circle"></i> Save Transaction`;
                    cancelBtn.remove();
                    if (window.lucide) window.lucide.createIcons();
                };
                actionsWrapper.appendChild(cancelBtn);
            }

            submitBtn.innerHTML = `<i data-lucide="check-circle"></i> Update Expense`;
            submitBtn.className = 'btn btn-primary btn-block'; // Temporary indigo color for updates
            if (window.lucide) window.lucide.createIcons();

            // Scroll form card into view smoothly
            document.getElementById('expense-form-card').scrollIntoView({ behavior: 'smooth' });
        };
    });

    // Delete actions
    const delBtns = container.querySelectorAll('.delete-expense-btn');

delBtns.forEach(btn => {
    btn.onclick = async () => {
        const id = btn.getAttribute('data-id');
        const targetTx = state.transactions.find(t => t.id === id);

        if (confirm(`Delete expense log "${targetTx.name}"?`)) {

            await deleteTransaction(id);

            const deletedNotif = {
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'Expense Deleted',
                message: `Removed expense log "${targetTx.name}" of ₹${targetTx.amount.toLocaleString()}.`,
                date: 'Just now',
                type: 'info',
                read: false
            };

            setState({
                notifications: [
                    deletedNotif,
                    ...state.notifications
                ]
            });
        }
    };
});
}
