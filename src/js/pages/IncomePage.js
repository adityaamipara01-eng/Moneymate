// Income Page Component
import { setState } from '../app.js';
import { deleteTransaction } from '../app.js';

export function renderIncomePage(container, state) {
    if (!container) return;

    const currency = state.user.currency;
    const incomes = state.transactions.filter(t => t.type === 'income');

    // Calculate category aggregates
    const categoryTotals = {
        Salary: 0,
        Freelance: 0,
        Investments: 0,
        Others: 0
    };

    incomes.forEach(inc => {
        const cat = inc.category || 'Others';
        if (categoryTotals[cat] !== undefined) {
            categoryTotals[cat] += inc.amount;
        } else {
            categoryTotals['Others'] += inc.amount;
        }
    });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Filter settings
    let selectedFilter = state.incomeFilter || 'All';

    const filteredIncomes = selectedFilter === 'All' 
        ? incomes 
        : incomes.filter(inc => inc.category === selectedFilter);

    // Format table body HTML
    const incomesTableRows = filteredIncomes.length === 0 
        ? `<tr><td colspan="5" style="padding:2rem; text-align:center; color:hsl(var(--text-muted)); font-weight:500;">No income logs found.</td></tr>`
        : filteredIncomes.map(inc => {
            return `
                <tr class="animate-fade-in" style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500;">
                    <td style="padding:0.75rem 0.5rem; color:hsl(var(--text-secondary)); font-size:0.8rem;">${inc.date}</td>
                    <td style="padding:0.75rem 0.5rem; font-weight:600;">${inc.name}</td>
                    <td style="padding:0.75rem 0.5rem;">
                        <span class="status-badge paid" style="padding:2px 8px; font-size:0.7rem;">
                            ${inc.category}
                        </span>
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-family:var(--font-heading); font-weight:700; color:hsl(var(--success));">
                        +${currency}${inc.amount.toLocaleString()}
                    </td>
                    <td style="padding:0.75rem 0.5rem; text-align:right;">
                        <div style="display:inline-flex; gap:0.5rem;">
                            <button class="btn-icon btn-sm edit-income-btn" data-id="${inc.id}" title="Edit Income">
                                <i data-lucide="edit-3" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                            </button>
                            <button class="btn-icon btn-sm delete-income-btn" data-id="${inc.id}" title="Delete Income">
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
                    <h1>Income Streams</h1>
                    <p>Log your salary, freelance earnings, investments dividends, and monitor cash inflows</p>
                </div>
                <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:hsl(var(--success)); background-color:hsl(var(--success-bg)); padding:0.5rem 1rem; border-radius:var(--border-radius-sm);">
                    Total: ${currency}${totalIncome.toLocaleString()}
                </div>
            </div>

            <!-- Category Summary cards -->
            <div class="metrics-grid">
                <div class="card" style="padding:1.25rem; border-left: 4px solid #34d399;">
                    <div style="font-size:0.75rem; color:hsl(var(--text-secondary)); font-weight:600; text-transform:uppercase;">Salary</div>
                    <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; margin-top:0.25rem;">${currency}${categoryTotals.Salary.toLocaleString()}</div>
                </div>
                <div class="card" style="padding:1.25rem; border-left: 4px solid #60a5fa;">
                    <div style="font-size:0.75rem; color:hsl(var(--text-secondary)); font-weight:600; text-transform:uppercase;">Freelance</div>
                    <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; margin-top:0.25rem;">${currency}${categoryTotals.Freelance.toLocaleString()}</div>
                </div>
                <div class="card" style="padding:1.25rem; border-left: 4px solid #fbbf24;">
                    <div style="font-size:0.75rem; color:hsl(var(--text-secondary)); font-weight:600; text-transform:uppercase;">Investments</div>
                    <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; margin-top:0.25rem;">${currency}${categoryTotals.Investments.toLocaleString()}</div>
                </div>
                <div class="card" style="padding:1.25rem; border-left: 4px solid #a78bfa;">
                    <div style="font-size:0.75rem; color:hsl(var(--text-secondary)); font-weight:600; text-transform:uppercase;">Others</div>
                    <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; margin-top:0.25rem;">${currency}${categoryTotals.Others.toLocaleString()}</div>
                </div>
            </div>

            <!-- Layout: Table vs Form -->
            <div class="grid-2-1">
                
                <!-- Left: Incomes Table -->
                <div class="card" style="display:flex; flex-direction:column; gap:1.25rem; overflow-x:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                        <h3 class="card-title" style="margin-bottom:0;">Income History Table</h3>
                        
                        <!-- Filter Chips -->
                        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                            ${['All', 'Salary', 'Freelance', 'Investments', 'Others'].map(filterName => {
                                const isSel = filterName === selectedFilter;
                                return `
                                    <button class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}" class="filter-chip" data-filter="${filterName}" style="padding:0.35rem 0.75rem; font-size:0.75rem;">
                                        ${filterName}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Responsive Table -->
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; min-width:500px;">
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
                            ${incomesTableRows}
                        </tbody>
                    </table>
                </div>

                <!-- Right: Form card -->
                <div class="card" id="income-form-card">
                    <h3 class="card-title" id="income-form-title">Record New Income</h3>
                    <form id="income-page-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1rem;">
                        <div class="form-group">
                            <label class="form-label" for="inc-p-name">Description / Source</label>
                            <input type="text" id="inc-p-name" class="form-input" placeholder="e.g. Consultancy Project" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="inc-p-amount">Amount (${currency})</label>
                            <input type="number" id="inc-p-amount" class="form-input" placeholder="0" required min="1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="inc-p-cat">Category</label>
                            <select id="inc-p-cat" class="form-input" required>
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Investments">Investments</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="inc-p-date">Date</label>
                            <input type="date" id="inc-p-date" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div style="display:flex; gap:0.5rem; width:100%; margin-top:0.5rem;" id="form-actions-wrapper">
                            <button type="submit" class="btn btn-success btn-block" id="income-submit-btn">
                                <i data-lucide="plus-circle"></i> Save Transaction
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    `;

    // Filter Chips Click Handling
    const chips = container.querySelectorAll('[data-filter]');
    chips.forEach(chip => {
        chip.onclick = () => {
            
            const filterVal = chip.getAttribute('data-filter');
            setState({ incomeFilter: filterVal });
            
        };
    });

    // Save/Update Form Handler
    const form = document.getElementById('income-page-form');
    const formTitle = document.getElementById('income-form-title');
    const submitBtn = document.getElementById('income-submit-btn');
    const actionsWrapper = document.getElementById('form-actions-wrapper');

    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('inc-p-name').value;
        const amount = parseFloat(document.getElementById('inc-p-amount').value);
        const category = document.getElementById('inc-p-cat').value;
        const date = document.getElementById('inc-p-date').value;

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
            notifTitle = 'Income Updated';
            notifMsg = `Updated income "${name}" values to ₹${amount.toLocaleString()}.`;
        } else {
            // Add Mode
            const newTx = {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                type: 'income',
                name,
                amount,
                category,
                date
            };
            updatedTxs = [newTx, ...state.transactions];
            notifTitle = 'Income Logged';
            notifMsg = `Added income of ₹${amount.toLocaleString()} from "${name}".`;
        }

        const newNotif = {
            id: 'n-' + Math.random().toString(36).substr(2, 9),
            title: notifTitle,
            message: notifMsg,
            date: 'Just now',
            type: 'success',
            read: false
        };

        // Reset editing attribute
        form.removeAttribute('data-editing-id');

        setState({ 
            transactions: updatedTxs, 
            notifications: [newNotif, ...state.notifications]
        });
    };

    // Edit action listeners
    const editBtns = container.querySelectorAll('.edit-income-btn');
    editBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const inc = state.transactions.find(t => t.id === id);

            // Populate form
            document.getElementById('inc-p-name').value = inc.name;
            document.getElementById('inc-p-amount').value = inc.amount;
            document.getElementById('inc-p-cat').value = inc.category;
            document.getElementById('inc-p-date').value = inc.date;

            // Set Form to edit mode
            form.setAttribute('data-editing-id', id);
            formTitle.innerText = 'Edit Income Log';
            
            // Render Cancel button if not already there
            if (!document.getElementById('cancel-edit-btn')) {
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'btn btn-secondary';
                cancelBtn.id = 'cancel-edit-btn';
                cancelBtn.innerText = 'Cancel';
                cancelBtn.onclick = () => {
                    form.reset();
                    form.removeAttribute('data-editing-id');
                    formTitle.innerText = 'Record New Income';
                    submitBtn.innerHTML = `<i data-lucide="plus-circle"></i> Save Transaction`;
                    cancelBtn.remove();
                    if (window.lucide) window.lucide.createIcons();
                };
                actionsWrapper.appendChild(cancelBtn);
            }

            submitBtn.innerHTML = `<i data-lucide="check-circle"></i> Update Income`;
            if (window.lucide) window.lucide.createIcons();

            // Scroll form card into view smoothly
            document.getElementById('income-form-card').scrollIntoView({ behavior: 'smooth' });
        };
    });

    // Delete actions
    const delBtns = container.querySelectorAll('.delete-income-btn');
    delBtns.forEach(btn => {
       const delBtns = container.querySelectorAll('.delete-income-btn');

delBtns.forEach(btn => {

    btn.onclick = async () => {

        const id = btn.getAttribute('data-id');

        const targetTx =
            state.transactions.find(t => t.id === id);

        if (confirm(`Delete income "${targetTx.name}"?`)) {

            await deleteTransaction(id);

            const deletedNotif = {
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'Income Deleted',
                message: `Removed income log "${targetTx.name}".`,
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
)}
