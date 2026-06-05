// Dashboard Page Component
import { setState } from '../app.js';
import { renderDonutChart, renderLineChart } from '../components/Charts.js';

export function renderDashboard(container, state) {
    if (!container) return;

    // Calculate dynamic metrics from state
    const currency = state.user.currency;
    
    // Inflow & Outflow calculations
    const incomes = state.transactions.filter(t => t.type === 'income');
    const expenses = state.transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = totalIncome - totalExpense;
    
    // Lending balance (Owed to user vs Owed by user)
    const activeLent = state.debts.filter(d => d.type === 'lent' && d.status === 'pending');
    const activeBorrowed = state.debts.filter(d => d.type === 'borrowed' && d.status === 'pending');
    
    const moneyLent = activeLent.reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);
    const moneyBorrowed = activeBorrowed.reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);
    
    // Recent Transactions (sorted by date descending)
    const recentTransactions = [...state.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Group expenses by category for Donut chart
    const expenseCategories = {
        Food: { value: 0, color: '#f87171' },
        Rent: { value: 0, color: '#6366f1' },
        Shopping: { value: 0, color: '#fbbf24' },
        Utilities: { value: 0, color: '#38bdf8' },
        Entertainment: { value: 0, color: '#c084fc' },
        Travel: { value: 0, color: '#34d399' },
        Others: { value: 0, color: '#94a3b8' }
    };

    expenses.forEach(e => {
        const cat = e.category || 'Others';
        if (expenseCategories[cat]) {
            expenseCategories[cat].value += e.amount;
        } else {
            expenseCategories['Others'].value += e.amount;
        }
    });

    const donutData = Object.keys(expenseCategories).map(cat => ({
        label: cat,
        value: expenseCategories[cat].value,
        color: expenseCategories[cat].color
    }));

    // Date formatting greeting
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
            
            <!-- Page Header -->
            <div class="app-header">
                <div class="header-title-section">
                    <h1>Dashboard Overview</h1>
                    <p>${dateStr} • Kharcha System Diagnostics</p>
                </div>
                <div class="header-actions">
                    <button class="btn-icon" style="position:relative;" id="header-notif-btn">
                        <i data-lucide="bell"></i>
                        ${state.notifications.filter(n => !n.read).length > 0 ? `<span style="position:absolute; top:-4px; right:-4px; width:10px; height:10px; border-radius:50%; background-color:hsl(var(--danger));"></span>` : ''}
                    </button>
                    <button class="btn btn-secondary btn-sm" id="header-profile-btn" style="display:flex; align-items:center; gap:0.5rem;">
                        <i data-lucide="user" style="width:16px; height:16px;"></i>
                        Account Settings
                    </button>
                </div>
            </div>

            <!-- Professional Summary Metrics Grid (5 Cards) -->
            <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                
                <!-- Card 1: Current Balance -->
                <div class="card metric-card">
                    <div class="metric-header">
                        <span class="metric-title">Current Balance</span>
                        <div class="metric-icon primary">
                            <i data-lucide="wallet"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(${currentBalance >= 0 ? 'var(--text-primary)' : 'var(--danger)'}); font-size:1.6rem;">
                        ${currency}${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span class="metric-trend ${currentBalance >= 0 ? 'trend-up' : 'trend-down'}">
                        Net cash reserve
                    </span>
                </div>

                <!-- Card 2: Total Income -->
                <div class="card metric-card">
                    <div class="metric-header">
                        <span class="metric-title">Total Income</span>
                        <div class="metric-icon success">
                            <i data-lucide="arrow-down-circle"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(var(--success)); font-size:1.6rem;">
                        ${currency}${totalIncome.toLocaleString()}
                    </span>
                    <span class="metric-trend trend-up">
                        Total cash inflow
                    </span>
                </div>

                <!-- Card 3: Total Expense -->
                <div class="card metric-card">
                    <div class="metric-header">
                        <span class="metric-title">Total Expense</span>
                        <div class="metric-icon danger">
                            <i data-lucide="arrow-up-circle"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(var(--danger)); font-size:1.6rem;">
                        ${currency}${totalExpense.toLocaleString()}
                    </span>
                    <span class="metric-trend trend-down">
                        Total cash outflow
                    </span>
                </div>

                <!-- Card 4: Money Lent -->
                <div class="card metric-card">
                    <div class="metric-header">
                        <span class="metric-title">Money Lent</span>
                        <div class="metric-icon warning">
                            <i data-lucide="landmark"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(var(--warning)); font-size:1.6rem;">
                        ${currency}${moneyLent.toLocaleString()}
                    </span>
                    <span class="metric-trend" style="color:hsl(var(--text-muted)); font-weight:600;">
                        To be collected
                    </span>
                </div>

                <!-- Card 5: Money Borrowed -->
                <div class="card metric-card">
                    <div class="metric-header">
                        <span class="metric-title">Money Borrowed</span>
                        <div class="metric-icon info" style="background-color:hsl(var(--danger-bg)); color:hsl(var(--danger));">
                            <i data-lucide="hand-shake"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: #f43f5e; font-size:1.6rem;">
                        ${currency}${moneyBorrowed.toLocaleString()}
                    </span>
                    <span class="metric-trend" style="color:hsl(var(--text-muted)); font-weight:600;">
                        To be paid back
                    </span>
                </div>
            </div>

            <!-- Charts Section (Income vs Expense & Monthly Spending) -->
            <div class="grid-2-1">
                <!-- Line Chart: Income vs Expense -->
                <div class="card">
                    <h3 class="card-title">Income vs Expense Chart</h3>
                    <div id="dashboard-line-chart-container" style="min-height:220px; display:flex; align-items:center; justify-content:center;"></div>
                </div>
                
                <!-- Donut Chart: Monthly Spending (By Category) -->
                <div class="card">
                    <h3 class="card-title">Monthly Spending</h3>
                    <div id="dashboard-donut-chart-container" style="min-height:220px; display:flex; align-items:center;"></div>
                </div>
            </div>

            <!-- Detailed Grid: Transactions Table & Quick Actions -->
            <div class="grid-2-1">
                <!-- Recent Transactions Table -->
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; overflow-x:auto;">
                    <div>
                        <div class="card-title">
                            Recent Transactions
                            <button class="btn btn-secondary btn-sm" id="view-all-transactions-btn">See All Ledger</button>
                        </div>
                        
                        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; min-width:480px;">
                            <thead>
                                <tr style="border-bottom:1px solid hsl(var(--surface-border)); color:hsl(var(--text-secondary)); font-weight:600;">
                                    <th style="padding:0.75rem 0.5rem;">Date</th>
                                    <th style="padding:0.75rem 0.5rem;">Description</th>
                                    <th style="padding:0.75rem 0.5rem;">Category</th>
                                    <th style="padding:0.75rem 0.5rem;">Type</th>
                                    <th style="padding:0.75rem 0.5rem; text-align:right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentTransactions.map(t => {
                                    const isInc = t.type === 'income';
                                    return `
                                        <tr style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500;">
                                            <td style="padding:0.75rem 0.5rem; color:hsl(var(--text-muted)); font-size:0.8rem;">${t.date}</td>
                                            <td style="padding:0.75rem 0.5rem; font-weight:600;">${t.name}</td>
                                            <td style="padding:0.75rem 0.5rem; color:hsl(var(--text-secondary));">${t.category}</td>
                                            <td style="padding:0.75rem 0.5rem;">
                                                <span class="status-badge ${isInc ? 'paid' : 'overdue'}" style="padding:2px 6px; font-size:0.7rem;">
                                                    ${isInc ? 'Inflow' : 'Outflow'}
                                                </span>
                                            </td>
                                            <td style="padding:0.75rem 0.5rem; text-align:right; font-family:var(--font-heading); font-weight:700; color:hsl(var(${isInc ? '--success' : '--danger'}));">
                                                ${isInc ? '+' : '-'}${currency}${t.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Quick actions and lending info -->
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    <!-- Quick Actions Card -->
                    <div class="card">
                        <h3 class="card-title">Quick Actions</h3>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                            <button class="btn btn-secondary" id="dash-add-income-btn" style="border-color:hsl(var(--success) / 0.3); background-color:hsl(var(--success-bg)/0.2); color:hsl(var(--success));">
                                <i data-lucide="plus-circle"></i> Add Income
                            </button>
                            <button class="btn btn-secondary" id="dash-add-expense-btn" style="border-color:hsl(var(--danger) / 0.3); background-color:hsl(var(--danger-bg)/0.2); color:hsl(var(--danger));">
                                <i data-lucide="minus-circle"></i> Add Expense
                            </button>
                        </div>
                        <button class="btn btn-primary btn-block" id="dash-record-loan-btn" style="margin-top:0.75rem; background-color:hsl(var(--warning)); border-color:hsl(var(--warning));">
                            <i data-lucide="hand-coins"></i> Record Money Loan
                        </button>
                    </div>

                    <!-- Short tips widget -->
                    <div class="card" style="background: linear-gradient(135deg, hsl(var(--surface)), hsl(var(--surface-hover))); border-color:hsl(var(--primary) / 0.15);">
                        <h4 style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                            <i data-lucide="lightbulb" style="color:hsl(var(--warning));"></i>
                            Financial Tip
                        </h4>
                        <p style="font-size:0.8rem; color:hsl(var(--text-secondary)); line-height:1.5;">
                            Keep track of social balances! Settling loans with friends immediately prevents debt accumulation. Try recording a new loan above.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Dynamic Modals Mount -->
            <div class="modal-backdrop" id="dashboard-modal-container">
                <div class="modal-container" id="dashboard-modal-content"></div>
            </div>
            
        </div>
    `;

    // Render SVG Charts
    const donutContainer = document.getElementById('dashboard-donut-chart-container');
    renderDonutChart(donutContainer, donutData);

    const lineContainer = document.getElementById('dashboard-line-chart-container');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [
        { label: 'Income', data: [0, 0, 0, 0, 0, totalIncome], color: 'hsl(var(--success))' },
        { label: 'Expense', data: [0, 0, 0, 0, 0, totalExpense], color: 'hsl(var(--danger))' }
    ];
    renderLineChart(lineContainer, months, datasets);

    // Navigations
    document.getElementById('header-notif-btn').onclick = () => setState({ currentPage: 'notifications' });
    document.getElementById('header-profile-btn').onclick = () => setState({ currentPage: 'profile' });
    document.getElementById('view-all-transactions-btn').onclick = () => setState({ currentPage: 'expense' });

    // Modal controllers
    const modalBackdrop = document.getElementById('dashboard-modal-container');
    const modalContent = document.getElementById('dashboard-modal-content');

    const showModal = (htmlContent) => {
        modalContent.innerHTML = htmlContent;
        modalBackdrop.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
        
        const closeBtn = modalContent.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modalBackdrop.classList.remove('active');
            };
        }
        
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.remove('active');
            }
        };
    };

    // Add Income Modal
    document.getElementById('dash-add-income-btn').onclick = () => {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">Record Income</h3>
                <span class="modal-close"><i data-lucide="x"></i></span>
            </div>
            <form id="income-modal-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="form-group">
                    <label class="form-label" for="inc-name">Source / Title</label>
                    <input type="text" id="inc-name" class="form-input" placeholder="e.g. Salary, Stock Dividends" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="inc-amount">Amount (${currency})</label>
                        <input type="number" id="inc-amount" class="form-input" placeholder="0.00" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="inc-cat">Category</label>
                        <select id="inc-cat" class="form-input" required>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investments">Investments</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="inc-date">Date</label>
                    <input type="date" id="inc-date" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <button type="submit" class="btn btn-success btn-block" style="padding:0.95rem;">
                    Add Income
                </button>
            </form>
        `;
        showModal(modalHtml);

        const form = document.getElementById('income-modal-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('inc-name').value;
            const amount = parseFloat(document.getElementById('inc-amount').value);
            const category = document.getElementById('inc-cat').value;
            const date = document.getElementById('inc-date').value;

            const newTx = {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                type: 'income',
                name,
                amount,
                category,
                date
            };

            const newNotif = {
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'Income Logged',
                message: `Recorded ₹${amount.toLocaleString()} from "${name}".`,
                date: 'Just now',
                type: 'success',
                read: false
            };

            modalBackdrop.classList.remove('active');
            setState({ 
                transactions: [newTx, ...state.transactions], 
                notifications: [newNotif, ...state.notifications] 
            });
        };
    };

    // Add Expense Modal
    document.getElementById('dash-add-expense-btn').onclick = () => {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">Record Expense</h3>
                <span class="modal-close"><i data-lucide="x"></i></span>
            </div>
            <form id="expense-modal-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="form-group">
                    <label class="form-label" for="exp-name">Merchant / Item Description</label>
                    <input type="text" id="exp-name" class="form-input" placeholder="e.g. Starbucks Coffee, Office Rent" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="exp-amount">Amount (${currency})</label>
                        <input type="number" id="exp-amount" class="form-input" placeholder="0.00" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="exp-cat">Category</label>
                        <select id="exp-cat" class="form-input" required>
                            <option value="Food">Food</option>
                            <option value="Rent">Rent</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Travel">Travel</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="exp-date">Date</label>
                    <input type="date" id="exp-date" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <button type="submit" class="btn btn-danger btn-block" style="padding:0.95rem;">
                    Add Expense
                </button>
            </form>
        `;
        showModal(modalHtml);

        const form = document.getElementById('expense-modal-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('exp-name').value;
            const amount = parseFloat(document.getElementById('exp-amount').value);
            const category = document.getElementById('exp-cat').value;
            const date = document.getElementById('exp-date').value;

            const newTx = {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                type: 'expense',
                name,
                amount,
                category,
                date
            };

            const updatedTxs = [newTx, ...state.transactions];
            const updatedNotifs = [...state.notifications];
            const currentSpent = updatedTxs.filter(t => t.type === 'expense' && t.date.startsWith('2026-06')).reduce((sum, t) => sum + t.amount, 0);

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
                    title: 'Expense Logged',
                    message: `Logged expense of ₹${amount.toLocaleString()} for "${name}".`,
                    date: 'Just now',
                    type: 'info',
                    read: false
                });
            }

            modalBackdrop.classList.remove('active');
            setState({ 
                transactions: updatedTxs, 
                notifications: updatedNotifs 
            });
        };
    };

    // Record Money Loan Modal
    document.getElementById('dash-record-loan-btn').onclick = () => {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">Record Social Loan</h3>
                <span class="modal-close"><i data-lucide="x"></i></span>
            </div>
            <form id="loan-modal-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="form-group">
                    <label class="form-label" for="loan-person">Friend's Name</label>
                    <input type="text" id="loan-person" class="form-input" placeholder="e.g. Rohan Sharma" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="loan-amount">Amount (${currency})</label>
                        <input type="number" id="loan-amount" class="form-input" placeholder="0.00" required min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loan-type">Loan Direction</label>
                        <select id="loan-type" class="form-input" required>
                            <option value="lent">Lent (Friend owes me)</option>
                            <option value="borrowed">Borrowed (I owe friend)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="loan-duedate">Due Date</label>
                    <input type="date" id="loan-duedate" class="form-input" required value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="background-color:hsl(var(--warning)); border-color:hsl(var(--warning)); padding:0.95rem;">
                    Record Loan
                </button>
            </form>
        `;
        showModal(modalHtml);

        const form = document.getElementById('loan-modal-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const person = document.getElementById('loan-person').value;
            const amount = parseFloat(document.getElementById('loan-amount').value);
            const type = document.getElementById('loan-type').value;
            const dueDate = document.getElementById('loan-duedate').value;

            const newDebt = {
                id: 'd-' + Math.random().toString(36).substr(2, 9),
                type,
                person,
                amount,
                settledAmount: 0,
                date: new Date().toISOString().split('T')[0],
                dueDate,
                status: 'pending'
            };

            const newNotif = {
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'New Debt Logged',
                message: `Recorded a debt of ₹${amount.toLocaleString()} with ${person}.`,
                date: 'Just now',
                type: 'warning',
                read: false
            };

            modalBackdrop.classList.remove('active');
            setState({ 
                debts: [...state.debts, newDebt], 
                notifications: [newNotif, ...state.notifications] 
            });
        };
    };
}
