// Reports Page Component
import { setState } from '../app.js';
import { renderDonutChart, renderLineChart, renderProgressBar } from '../components/Charts.js';

export function renderReportsPage(container, state) {
    if (!container) return;

    const currency = state.user.currency;
    const incomes = state.transactions.filter(t => t.type === 'income');
    const expenses = state.transactions.filter(t => t.type === 'expense');

    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpense;

    const debts = state.debts || [];
    const totalLentPending = debts.filter(d => d.type === 'lent' && d.status === 'pending').reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);
    const totalBorrowedPending = debts.filter(d => d.type === 'borrowed' && d.status === 'pending').reduce((sum, d) => sum + (d.amount - d.settledAmount), 0);
    
    // Savings Ratio (e.g. 100 * (savings / income))
    const savingsRatio = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Group expenses by category
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

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
            
            <!-- Page Header -->
            <div class="app-header">
                <div class="header-title-section">
                    <h1>Financial Reports</h1>
                    <p>Unlock deeper insights, saving ratios, and historical spending comparisons</p>
                </div>
                <div style="display:flex; gap:0.75rem;">
                    <button class="btn btn-secondary btn-sm" id="preview-report-btn">
                        <i data-lucide="eye"></i> Preview Report
                    </button>
                    <button class="btn btn-primary btn-sm" id="export-pdf-btn">
                        <i data-lucide="download"></i> Download PDF
                    </button>
                </div>
            </div>

            <!-- Savings ratio widget -->
            <div class="grid-2">
                <div class="card" style="display:flex; flex-direction:column; gap:1.25rem;">
                    <h3 class="card-title">Savings Rate Analyzer</h3>
                    <div style="display:flex; justify-content:space-between; align-items:baseline;">
                        <span style="font-family:var(--font-heading); font-size:2.5rem; font-weight:800; color:hsl(var(--success));">
                            ${savingsRatio.toFixed(1)}%
                        </span>
                        <span style="font-size:0.85rem; color:hsl(var(--text-secondary)); font-weight:500;">
                            Saved ${currency}${netSavings.toLocaleString()} this month
                        </span>
                    </div>
                    <div id="savings-rate-bar"></div>
                    <p style="font-size:0.8rem; color:hsl(var(--text-muted)); font-weight:500;">
                        💡 A savings rate above 20% is recommended. You are currently saving ${savingsRatio.toFixed(0)}% of your monthly cash inflows.
                    </p>
                </div>

                <div style="display:flex; flex-direction:column; gap:1.25rem;">
                    <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                        <h3 class="card-title">Summary Ledger</h3>
                        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;">
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid hsl(var(--surface-border)); padding-bottom:0.5rem;">
                                <span style="color:hsl(var(--text-secondary)); font-weight:500;">Income Summary</span>
                                <span style="font-weight:700; color:hsl(var(--success));">+${currency}${totalIncome.toLocaleString()}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid hsl(var(--surface-border)); padding-bottom:0.5rem; padding-top:0.25rem;">
                                <span style="color:hsl(var(--text-secondary)); font-weight:500;">Expense Summary</span>
                                <span style="font-weight:700; color:hsl(var(--danger));">-${currency}${totalExpense.toLocaleString()}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding-top:0.5rem;">
                                <span style="font-weight:600;">Savings Summary</span>
                                <span style="font-weight:800; color:hsl(var(--primary));">${currency}${netSavings.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                        <h3 class="card-title">Debt Summary</h3>
                        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;">
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid hsl(var(--surface-border)); padding-bottom:0.5rem;">
                                <span style="color:hsl(var(--text-secondary)); font-weight:500;">Money Lent</span>
                                <span style="font-weight:700; color:hsl(var(--success));">${currency}${totalLentPending.toLocaleString()}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding-top:0.25rem;">
                                <span style="color:hsl(var(--text-secondary)); font-weight:500;">Money Borrowed</span>
                                <span style="font-weight:700; color:hsl(var(--danger));">${currency}${totalBorrowedPending.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid-2-1">
                <!-- Line Chart -->
                <div class="card">
                    <h3 class="card-title">Historical Cash Inflow vs Outflow</h3>
                    <div id="reports-line-chart-container" style="min-height:240px; display:flex; align-items:center;"></div>
                </div>

                <!-- Donut Chart -->
                <div class="card">
                    <h3 class="card-title">Categorized Expenditures</h3>
                    <div id="reports-donut-chart-container" style="min-height:240px; display:flex; align-items:center;"></div>
                </div>
            </div>

            <!-- Detailed category breakdown ledger -->
            <div class="card">
                <h3 class="card-title">Category Utilization Metrics</h3>
                <div style="width:100%; overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
                        <thead>
                            <tr style="border-bottom:1px solid hsl(var(--surface-border)); color:hsl(var(--text-secondary)); font-weight:600;">
                                <th style="padding:0.75rem;">Category</th>
                                <th style="padding:0.75rem;">Spent Amount</th>
                                <th style="padding:0.75rem;">Ratio %</th>
                                <th style="padding:0.75rem; text-align:right;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.keys(expenseCategories).map(catName => {
                                const amount = expenseCategories[catName].value;
                                const ratio = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                                const dotColor = expenseCategories[catName].color;
                                
                                return `
                                    <tr style="border-bottom:1px solid hsl(var(--surface-border)/0.5); font-weight:500;">
                                        <td style="padding:0.75rem; display:flex; align-items:center; gap:0.5rem;">
                                            <span style="width:8px; height:8px; border-radius:50%; background-color:${dotColor};"></span>
                                            ${catName}
                                        </td>
                                        <td style="padding:0.75rem; font-family:var(--font-heading); font-weight:700;">
                                            ${currency}${amount.toLocaleString()}
                                        </td>
                                        <td style="padding:0.75rem; color:hsl(var(--text-secondary));">
                                            ${ratio.toFixed(1)}%
                                        </td>
                                        <td style="padding:0.75rem; text-align:right;">
                                            ${ratio > 40 ? `<span class="status-badge overdue">High</span>` : (ratio > 15 ? `<span class="status-badge pending">Medium</span>` : `<span class="status-badge paid">Low</span>`)}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    `;

    // Render Savings Rate Bar
    const rateBar = document.getElementById('savings-rate-bar');
    const displayRatio = Math.max(Math.min(savingsRatio, 100), 0);
    renderProgressBar(rateBar, displayRatio, savingsRatio >= 20 ? 'success' : 'warning', 'Savings Margin');

    // Render SVG line chart
    const lineContainer = document.getElementById('reports-line-chart-container');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [
        { label: 'Inflows', data: [65000, 58000, 72000, 68000, 88000, totalIncome], color: 'hsl(var(--success))' },
        { label: 'Outflows', data: [32000, 44000, 39000, 41000, 37000, totalExpense], color: 'hsl(var(--danger))' }
    ];
    renderLineChart(lineContainer, months, datasets);

    // Render SVG donut chart
    const donutContainer = document.getElementById('reports-donut-chart-container');
    renderDonutChart(donutContainer, donutData);

    // Action handlers
    document.getElementById('preview-report-btn').onclick = () => {
        alert('Previewing Monthly Report...\n(Opens a modal or print preview window)');
    };

    document.getElementById('export-pdf-btn').onclick = () => {
        alert('PDF Generation Starting...\nPackaging charts & vector graphics. Report compiled successfully!');
    };
}
