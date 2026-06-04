// Money Lending Page Component
import { setState } from '../app.js';

export function renderLendingPage(container, state) {
    if (!container) return;

    const currency = state.user.currency;
    
    // Tab filtering (or stacked grids)
    const lentDebts = state.debts.filter(d => d.type === 'lent');
    const borrowedDebts = state.debts.filter(d => d.type === 'borrowed');

    // Totals calculated dynamically from pending debts
    const totalLentPending = lentDebts.filter(d => d.status === 'pending').reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);
    const totalBorrowedPending = borrowedDebts.filter(d => d.status === 'pending').reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);

    // List splits
    const pendingDebts = state.debts.filter(d => d.status === 'pending');
    const paidDebts = state.debts.filter(d => d.status === 'paid');

    // Contacts list for selector dropdown
    const contactOptions = [
        'Rohan Sharma',
        'Sneha Patel',
        'Kabir Singh',
        'Pooja Roy',
        'Karan Johar',
        'Neha Gupta'
    ];

    // Format Pending Payments rows
    const pendingRowsHtml = pendingDebts.length === 0
        ? `<tr><td colspan="6" style="padding:2rem; text-align:center; color:hsl(var(--text-muted)); font-weight:500;">No pending payments.</td></tr>`
        : pendingDebts.map(d => {
            const isLent = d.type === 'lent';
            const progressPct = ((d.settledAmount / d.amount) * 100).toFixed(0);
            const isOverdue = new Date(d.dueDate) < new Date();

            return `
                <tr class="animate-fade-in" style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500;">
                    <td style="padding:0.75rem 0.5rem; font-weight:600;">${d.person}</td>
                    <td style="padding:0.75rem 0.5rem;">
                        <span class="status-badge ${isLent ? 'paid' : 'overdue'}" style="padding:2px 8px; font-size:0.7rem; background-color:${isLent ? 'hsl(var(--success-bg))' : 'hsl(var(--danger-bg))'}; color:${isLent ? 'hsl(var(--success))' : 'hsl(var(--danger))'};">
                            ${isLent ? 'Lent' : 'Borrowed'}
                        </span>
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-family:var(--font-heading); font-weight:700;">
                        ${currency}${d.amount.toLocaleString()}
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-size:0.8rem; max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${d.note || 'No note added'}">
                        ${d.note || '<span style="color:hsl(var(--text-muted)); font-style:italic;">No note</span>'}
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-size:0.8rem; color:${isOverdue ? 'hsl(var(--danger))' : 'hsl(var(--text-secondary))'}; font-weight:${isOverdue ? '700' : '500'};">
                        ${d.dueDate} ${isOverdue ? '(Overdue)' : ''}
                    </td>
                    <td style="padding:0.75rem 0.5rem; text-align:right;">
                        <div style="display:inline-flex; gap:0.35rem;">
                            <button class="btn btn-secondary btn-sm settle-partial-btn" data-id="${d.id}" style="padding:2px 8px; font-size:0.75rem;">
                                Settle Part
                            </button>
                            <button class="btn btn-primary btn-sm settle-full-btn" data-id="${d.id}" style="background-color:hsl(var(--warning)); border-color:hsl(var(--warning)); padding:2px 8px; font-size:0.75rem;">
                                Settle Full
                            </button>
                            <button class="btn-icon btn-sm delete-debt-btn" data-id="${d.id}">
                                <i data-lucide="trash-2" style="width:14px; height:14px; color:hsl(var(--danger));"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    // Format Payment History rows
    const historyRowsHtml = paidDebts.length === 0
        ? `<tr><td colspan="5" style="padding:2rem; text-align:center; color:hsl(var(--text-muted)); font-weight:500;">No payment history recorded.</td></tr>`
        : paidDebts.map(d => {
            const isLent = d.type === 'lent';
            return `
                <tr class="animate-fade-in" style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500; opacity:0.85;">
                    <td style="padding:0.75rem 0.5rem; color:hsl(var(--text-muted));">${d.date}</td>
                    <td style="padding:0.75rem 0.5rem; font-weight:600;">${d.person}</td>
                    <td style="padding:0.75rem 0.5rem;">
                        <span class="status-badge" style="padding:2px 8px; font-size:0.7rem; background-color:hsl(var(--surface-border)); color:hsl(var(--text-secondary));">
                            ${isLent ? 'Lent (Paid)' : 'Borrowed (Paid)'}
                        </span>
                    </td>
                    <td style="padding:0.75rem 0.5rem; font-size:0.8rem; color:hsl(var(--text-muted));">${d.note || '-'}</td>
                    <td style="padding:0.75rem 0.5rem; font-family:var(--font-heading); font-weight:700; color:hsl(var(--success)); text-anchor:middle;">
                        ${currency}${d.amount.toLocaleString()}
                    </td>
                    <td style="padding:0.75rem 0.5rem; text-align:right;">
                        <button class="btn-icon btn-sm delete-debt-btn" data-id="${d.id}">
                            <i data-lucide="trash-2" style="width:14px; height:14px; color:hsl(var(--danger));"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
            
            <!-- Page Header -->
            <div class="app-header">
                <div class="header-title-section">
                    <h1>Money Lending Manager</h1>
                    <p>Keep transparent tabs on loans and claims with friends, track pending balances and due dates</p>
                </div>
            </div>

            <!-- Financial metrics cards -->
            <div class="metrics-grid">
                <!-- Card 1: Money Lent -->
                <div class="card metric-card" style="border-left: 4px solid hsl(var(--success));">
                    <div class="metric-header">
                        <span class="metric-title">Money Lent</span>
                        <div class="metric-icon success">
                            <i data-lucide="landmark"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(var(--success));">
                        ${currency}${totalLentPending.toLocaleString()}
                    </span>
                    <span style="font-size: 0.8rem; color: hsl(var(--text-secondary)); font-weight: 500;">
                        Active receivables
                    </span>
                </div>

                <!-- Card 2: Money Borrowed -->
                <div class="card metric-card" style="border-left: 4px solid hsl(var(--danger));">
                    <div class="metric-header">
                        <span class="metric-title">Money Borrowed</span>
                        <div class="metric-icon danger">
                            <i data-lucide="hand-shake"></i>
                        </div>
                    </div>
                    <span class="metric-value" style="color: hsl(var(--danger));">
                        ${currency}${totalBorrowedPending.toLocaleString()}
                    </span>
                    <span style="font-size: 0.8rem; color: hsl(var(--text-secondary)); font-weight: 500;">
                        Active payables
                    </span>
                </div>
            </div>

            <!-- Grid Split: Ledgers vs Entry form -->
            <div class="grid-2-1">
                
                <!-- Left Column: Tables Stack -->
                <div style="display:flex; flex-direction:column; gap:2rem;">
                    
                    <!-- Table 1: Pending Payments -->
                    <div class="card" style="overflow-x:auto;">
                        <h3 class="card-title">Pending Payments</h3>
                        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; min-width:600px;">
                            <thead>
                                <tr style="border-bottom:1px solid hsl(var(--surface-border)); color:hsl(var(--text-secondary)); font-weight:600;">
                                    <th style="padding:0.75rem 0.5rem;">User</th>
                                    <th style="padding:0.75rem 0.5rem;">Direction</th>
                                    <th style="padding:0.75rem 0.5rem;">Amount</th>
                                    <th style="padding:0.75rem 0.5rem;">Note</th>
                                    <th style="padding:0.75rem 0.5rem;">Due Date</th>
                                    <th style="padding:0.75rem 0.5rem; text-align:right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingRowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- Table 2: Payment History -->
                    <div class="card" style="overflow-x:auto;">
                        <h3 class="card-title">Payment Settlement History</h3>
                        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; min-width:600px;">
                            <thead>
                                <tr style="border-bottom:1px solid hsl(var(--surface-border)); color:hsl(var(--text-secondary)); font-weight:600;">
                                    <th style="padding:0.75rem 0.5rem;">Settlement Date</th>
                                    <th style="padding:0.75rem 0.5rem;">User</th>
                                    <th style="padding:0.75rem 0.5rem;">Log Type</th>
                                    <th style="padding:0.75rem 0.5rem;">Note</th>
                                    <th style="padding:0.75rem 0.5rem;">Settled Amount</th>
                                    <th style="padding:0.75rem 0.5rem; text-align:right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historyRowsHtml}
                            </tbody>
                        </table>
                    </div>

                </div>

                <!-- Right Column: Record Loan Form -->
                <div class="card" style="height:fit-content;">
                    <h3 class="card-title">Record Loan Entry</h3>
                    <form id="lending-page-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1rem;">
                        <div class="form-group">
                            <label class="form-label" for="loan-p-person">Select User</label>
                            <select id="loan-p-person" class="form-input" required>
                                <option value="" disabled selected>Choose a contact...</option>
                                ${contactOptions.map(name => `<option value="${name}">${name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="loan-p-amount">Amount (${currency})</label>
                            <input type="number" id="loan-p-amount" class="form-input" placeholder="0" required min="1">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="loan-p-note">Note / Remarks</label>
                            <textarea id="loan-p-note" class="form-input" rows="2" placeholder="e.g. Shared Uber ride, dinner bill split"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="loan-p-type">Direction</label>
                            <select id="loan-p-type" class="form-input" required>
                                <option value="lent">Money Lent (Friend owes you)</option>
                                <option value="borrowed">Money Borrowed (You owe friend)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="loan-p-duedate">Due Date</label>
                            <input type="date" id="loan-p-duedate" class="form-input" required value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" style="background-color:hsl(var(--warning)); border-color:hsl(var(--warning)); margin-top:0.5rem;">
                            <i data-lucide="plus-circle"></i> Save Debt Log
                        </button>
                    </form>
                </div>

            </div>
        </div>
    `;

    // Debt Settle Partial
    const partialBtns = container.querySelectorAll('.settle-partial-btn');
    partialBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const debt = state.debts.find(d => d.id === id);
            const remaining = debt.amount - debt.settledAmount;

            const inputVal = prompt(`Enter repayment amount from ${debt.person} (Remaining: ₹${remaining.toLocaleString()}):`);
            if (inputVal === null) return;
            
            const settleAmt = parseFloat(inputVal);
            if (isNaN(settleAmt) || settleAmt <= 0) {
                alert('Please enter a valid amount.');
                return;
            }

            if (settleAmt > remaining) {
                alert(`Repayment exceeds the remaining debt amount of ₹${remaining.toLocaleString()}.`);
                return;
            }

            const updatedDebts = state.debts.map(d => {
                if (d.id === id) {
                    const newSettle = d.settledAmount + settleAmt;
                    const isFullyPaid = newSettle >= d.amount;
                    return {
                        ...d,
                        settledAmount: newSettle,
                        status: isFullyPaid ? 'paid' : 'pending'
                    };
                }
                return d;
            });

            const newNotif = {
                id: 'n-' + Math.random().toString(36).substr(2, 9),
                title: 'Partial Repayment Logged',
                message: `Logged ₹${settleAmt.toLocaleString()} payment from ${debt.person}.`,
                date: 'Just now',
                type: 'success',
                read: false
            };

            setState({ debts: updatedDebts, notifications: [newNotif, ...state.notifications] });
        };
    });

    // Debt Settle Full
    const fullBtns = container.querySelectorAll('.settle-full-btn');
    fullBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const debt = state.debts.find(d => d.id === id);

            if (confirm(`Mark debt with ${debt.person} as fully settled for ₹${(debt.amount - debt.settledAmount).toLocaleString()}?`)) {
                const updatedDebts = state.debts.map(d => {
                    if (d.id === id) {
                        return {
                            ...d,
                            settledAmount: d.amount,
                            status: 'paid'
                        };
                    }
                    return d;
                });

                const newNotif = {
                    id: 'n-' + Math.random().toString(36).substr(2, 9),
                    title: 'Debt Fully Settled',
                    message: `Debt log with ${debt.person} is now fully paid and closed.`,
                    date: 'Just now',
                    type: 'success',
                    read: false
                };

                setState({ debts: updatedDebts, notifications: [newNotif, ...state.notifications] });
            }
        };
    });

    // Delete actions
    const delBtns = container.querySelectorAll('.delete-debt-btn');
    delBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const targetDebt = state.debts.find(d => d.id === id);
            
            if (confirm(`Remove debt record for ${targetDebt.person}?`)) {
                const filteredDebts = state.debts.filter(d => d.id !== id);
                
                const deletedNotif = {
                    id: 'n-' + Math.random().toString(36).substr(2, 9),
                    title: 'Debt Record Dismissed',
                    message: `Removed debt record for ${targetDebt.person}.`,
                    date: 'Just now',
                    type: 'info',
                    read: false
                };
                
                setState({ 
                    debts: filteredDebts, 
                    notifications: [deletedNotif, ...state.notifications]
                });
            }
        };
    });

    // Form Submission
    const form = document.getElementById('lending-page-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const person = document.getElementById('loan-p-person').value;
        const amount = parseFloat(document.getElementById('loan-p-amount').value);
        const note = document.getElementById('loan-p-note').value;
        const type = document.getElementById('loan-p-type').value;
        const dueDate = document.getElementById('loan-p-duedate').value;

        const newDebt = {
            id: 'd-' + Math.random().toString(36).substr(2, 9),
            type,
            person,
            amount,
            settledAmount: 0,
            note,
            date: new Date().toISOString().split('T')[0],
            dueDate,
            status: 'pending'
        };

        const updatedDebts = [...state.debts, newDebt];
        
        const newNotif = {
            id: 'n-' + Math.random().toString(36).substr(2, 9),
            title: 'Debt Logged',
            message: `Recorded a new debt of ₹${amount.toLocaleString()} with ${person}.`,
            date: 'Just now',
            type: 'warning',
            read: false
        };

        setState({ 
            debts: updatedDebts, 
            notifications: [newNotif, ...state.notifications]
        });
    };
}
