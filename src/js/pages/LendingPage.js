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
                    <td style="padding:0.75rem 0.5rem; font-weight:600;">
                        <a href="#" class="view-qr-link" data-id="${d.id}" style="color:hsl(var(--primary)); text-decoration:underline; font-weight:700; cursor:pointer;" title="Click to view UPI QR Code">
                            ${d.person}
                        </a>
                    </td>
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
                                ${isLent ? 'Received Part' : 'Pay Part'}
                            </button>
                            <button class="btn btn-primary btn-sm settle-full-btn" data-id="${d.id}" style="background-color:hsl(var(--warning)); border-color:hsl(var(--warning)); padding:2px 8px; font-size:0.75rem;">
                                ${isLent ? 'Received Full' : 'Pay Full'}
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
                            <label class="form-label" for="loan-p-person">Friend's Name</label>
                            <input type="text" id="loan-p-person" class="form-input" placeholder="e.g. Rohan Sharma" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="loan-p-upi">Friend's UPI ID (Optional)</label>
                            <input type="text" id="loan-p-upi" class="form-input" placeholder="e.g. rohan@okaxis">
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
                                <option value="lent">Money Lent (Friend owes me / Give to friend)</option>
                                <option value="borrowed">Money Borrowed (I owe friend / Take from friend)</option>
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
            
            <!-- Dynamic Modals Mount -->
            <div class="modal-backdrop" id="lending-modal-container">
                <div class="modal-container" id="lending-modal-content" style="max-width:380px; padding:2rem; text-align:center;"></div>
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

            const actionText = debt.type === 'lent' ? 'received from' : 'paid to';
            const inputVal = prompt(`Enter repayment amount ${actionText} ${debt.person} (Remaining: ₹${remaining.toLocaleString()}):`);
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
                title: debt.type === 'lent' ? 'Partial Repayment Received' : 'Partial Repayment Paid',
                message: `Logged ₹${settleAmt.toLocaleString()} payment ${debt.type === 'lent' ? 'from' : 'to'} ${debt.person}.`,
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
            const actionVerb = debt.type === 'lent' ? 'received from' : 'paid to';

            if (confirm(`Mark debt with ${debt.person} as fully settled for ₹${(debt.amount - debt.settledAmount).toLocaleString()} ${actionVerb} them?`)) {
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
                    message: `Debt log with ${debt.person} is now fully ${debt.type === 'lent' ? 'collected' : 'paid back'} and closed.`,
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
        const person = document.getElementById('loan-p-person').value.trim();
        const upiId = document.getElementById('loan-p-upi').value.trim();
        const amount = parseFloat(document.getElementById('loan-p-amount').value);
        const note = document.getElementById('loan-p-note').value;
        const type = document.getElementById('loan-p-type').value;
        const dueDate = document.getElementById('loan-p-duedate').value;

        const newDebt = {
            id: 'd-' + Math.random().toString(36).substr(2, 9),
            type,
            person,
            upiId,
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

    // QR Code Modal View Action
    const qrLinks = container.querySelectorAll('.view-qr-link');
    const modalBackdrop = document.getElementById('lending-modal-container');
    const modalContent = document.getElementById('lending-modal-content');

    const showQrModal = (debt) => {
        const remaining = debt.amount - debt.settledAmount;
        const upiPayUrl = debt.upiId 
            ? `upi://pay?pa=${encodeURIComponent(debt.upiId)}&pn=${encodeURIComponent(debt.person)}&am=${remaining}&cu=INR`
            : '';
        const qrUrl = upiPayUrl
            ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayUrl)}&color=0f172a`
            : '';

        let contentHtml = `
            <div class="modal-header" style="margin-bottom:1rem;">
                <h3 class="modal-title">UPI Payment QR</h3>
                <span class="modal-close"><i data-lucide="x"></i></span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:1.25rem; margin-top:0.5rem;">
                <div style="text-align:center;">
                    <div style="font-size:1.15rem; font-weight:700; color:hsl(var(--text-primary));">${debt.person}</div>
                    <div style="font-size:0.85rem; color:hsl(var(--text-secondary)); margin-top:0.25rem;">
                        ${debt.type === 'lent' ? 'Payment due to you' : 'Amount to pay back'}
                    </div>
                    <div style="font-family:var(--font-heading); font-size:1.75rem; font-weight:800; color:hsl(var(--primary)); margin-top:0.5rem;">
                        ${currency}${remaining.toLocaleString()}
                    </div>
                </div>
        `;

        if (debt.upiId) {
            contentHtml += `
                <!-- QR Code View -->
                <div style="background-color:white; padding:1rem; border-radius:var(--border-radius-sm); border:1px solid hsl(var(--surface-border)); display:flex; justify-content:center; align-items:center; box-shadow:var(--shadow-sm); width:240px; height:240px;">
                    <img src="${qrUrl}" alt="UPI Payment QR Code" style="width:100%; height:100%; object-fit:contain;">
                </div>
                <div style="text-align:center; font-size:0.85rem; width:100%;">
                    <div style="font-weight:600; color:hsl(var(--text-secondary));">UPI ID:</div>
                    <div style="font-family:monospace; font-size:0.9rem; font-weight:700; color:hsl(var(--text-primary)); background-color:hsl(var(--background)); padding:0.4rem 0.75rem; border-radius:6px; margin-top:0.25rem; display:inline-block; border:1px solid hsl(var(--surface-border)/0.5);">
                        ${debt.upiId}
                    </div>
                </div>
                <p style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:500; max-width:280px; line-height:1.4;">
                    Scan using BHIM, Google Pay, PhonePe, Paytm, or any other UPI app to make a direct payment of ${currency}${remaining.toLocaleString()} to ${debt.person}.
                </p>
            `;
        } else {
            contentHtml += `
                <!-- Input field to generate QR dynamically -->
                <div style="text-align:left; width:100%; display:flex; flex-direction:column; gap:0.75rem; background-color:hsl(var(--background)/0.5); padding:1.25rem; border-radius:var(--border-radius-sm); border:1px solid hsl(var(--surface-border)/0.8);">
                    <p style="font-size:0.8rem; color:hsl(var(--text-secondary)); line-height:1.4; font-weight:500; margin:0;">
                        No UPI ID is registered for <strong>${debt.person}</strong>. Enter their UPI VPA below to generate a scannable payment QR code:
                    </p>
                    <div class="form-group" style="margin:0;">
                        <label class="form-label" for="modal-upi-id" style="font-size:0.75rem;">UPI ID / VPA</label>
                        <input type="text" id="modal-upi-id" class="form-input" placeholder="e.g. rohan@okaxis" style="padding:0.5rem 0.75rem; font-size:0.85rem;">
                    </div>
                    <button id="modal-save-upi-btn" class="btn btn-primary btn-block" style="padding:0.6rem; font-size:0.85rem; font-weight:600; background-color:hsl(var(--success)); border-color:hsl(var(--success));">
                        Generate & Save QR
                    </button>
                </div>
            `;
        }

        contentHtml += `
            </div>
        `;

        modalContent.innerHTML = contentHtml;
        modalBackdrop.classList.add('active');
        if (window.lucide) window.lucide.createIcons();

        // Close logic
        const closeBtn = modalContent.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => modalBackdrop.classList.remove('active');
        }
        
        modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
        };

        // Save UPI ID from inside modal
        const saveUpiBtn = document.getElementById('modal-save-upi-btn');
        if (saveUpiBtn) {
            saveUpiBtn.onclick = () => {
                const upiInput = document.getElementById('modal-upi-id');
                const newUpiVal = upiInput.value.trim();
                if (!newUpiVal || !newUpiVal.includes('@')) {
                    alert('Please enter a valid UPI ID (e.g. name@okaxis).');
                    return;
                }

                // Update the state
                const updatedDebts = state.debts.map(d => {
                    if (d.id === debt.id) {
                        return { ...d, upiId: newUpiVal };
                    }
                    return d;
                });

                setState({ debts: updatedDebts });
                
                // Immediately refresh and show the new QR code in the active modal!
                const freshDebt = { ...debt, upiId: newUpiVal };
                showQrModal(freshDebt);
            };
        }
    };

    qrLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-id');
            const debt = state.debts.find(d => d.id === id);
            showQrModal(debt);
        };
    });
}
