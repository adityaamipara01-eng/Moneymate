// MoneyMate UI Application - Main Script

const supabaseUrl = "https://wyfnjkvvtewwiepzxtvs.supabase.co";

const supabaseKey = "sb_publishable_vAnsyhBsvS3yYVS5gZUDQg_dcBZPRoZ";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
import { renderSidebar } from './components/Sidebar.js';
import { renderLandingPage } from './pages/LandingPage.js';
import { renderLoginPage } from './pages/LoginPage.js';
import { renderSignupPage } from './pages/SignupPage.js';
import { renderDashboard } from './pages/Dashboard.js';
import { renderIncomePage } from './pages/IncomePage.js';
import { renderExpensePage } from './pages/ExpensePage.js';
import { renderLendingPage } from './pages/LendingPage.js';
import { renderNotificationsPage } from './pages/NotificationsPage.js';
import { renderReportsPage } from './pages/ReportsPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';

// Pre-populated high-quality dummy data
const initialDummyState = {
    theme: 'light',
    currentPage: 'landing',
    user: {
        name: 'Aditya Raj',
        email: 'aditya.raj@example.com',
        phoneNumber: '+91 98765 43210',
        avatar: '', // Fallback to initials
        currency: '₹',
        monthlyBudget: 45000,
        upiId: 'aditya@okaxis',
        upiQr: ''
    },
    transactions: [
        { id: 't1', type: 'income', name: 'Software Consultant Salary', amount: 75000, category: 'Salary', date: '2026-06-01' },
        { id: 't2', type: 'expense', name: 'Premium Apartment Rent', amount: 18000, category: 'Rent', date: '2026-06-02' },
        { id: 't3', type: 'expense', name: 'Organic Groceries', amount: 4200, category: 'Food', date: '2026-06-03' },
        { id: 't4', type: 'expense', name: 'Power & Gas Utility', amount: 3100, category: 'Utilities', date: '2026-06-01' },
        { id: 't5', type: 'income', name: 'Freelance Mobile App Design', amount: 15000, category: 'Freelance', date: '2026-05-28' },
        { id: 't6', type: 'expense', name: 'Fancy Bistro Dinner', amount: 2800, category: 'Food', date: '2026-05-30' },
        { id: 't7', type: 'expense', name: 'Nike Running Shoes', amount: 5500, category: 'Shopping', date: '2026-05-25' },
        { id: 't8', type: 'income', name: 'HDFC Stock Dividend', amount: 3500, category: 'Investments', date: '2026-05-15' },
        { id: 't9', type: 'expense', name: 'Netflix Premium Plan', amount: 649, category: 'Entertainment', date: '2026-05-22' },
        { id: 't10', type: 'expense', name: 'Uber Office Commute', amount: 1200, category: 'Travel', date: '2026-05-18' }
    ],
    debts: [
        { id: 'd1', type: 'lent', person: 'Rohan Sharma', amount: 10000, settledAmount: 6000, date: '2026-05-10', dueDate: '2026-06-15', status: 'pending' },
        { id: 'd2', type: 'borrowed', person: 'Sneha Patel', amount: 5000, settledAmount: 0, date: '2026-05-20', dueDate: '2026-06-10', status: 'pending' },
        { id: 'd3', type: 'lent', person: 'Kabir Singh', amount: 3000, settledAmount: 3000, date: '2026-04-05', dueDate: '2026-05-01', status: 'paid' }
    ],
    notifications: [
        { id: 'n1', title: 'New Debt Request', message: 'Rahul has requested a loan of ₹2,000 for groceries.', date: 'Just now', type: 'warning', read: false },
        { id: 'n2', title: 'Debt Repaid', message: 'Sneha Patel repaid the borrowed amount of ₹5,000.', date: '2 hours ago', type: 'success', read: false },
        { id: 'n3', title: 'Monthly Report Ready', message: 'Your financial summary for May is ready to view.', date: '1 day ago', type: 'info', read: true }
    ]
};

// Initialize state: check localStorage first
let state = { ...initialDummyState };

try {
    const savedState = localStorage.getItem('moneymate_state');
    if (savedState) {
        state = JSON.parse(savedState);
    }
} catch (e) {
    console.error('Failed to load state from localStorage', e);
}

// Set initial theme in DOM
document.documentElement.setAttribute('data-theme', state.theme);

// Expose state update API
export function getState() {
    return state;
}

export function setState(newState) {
    state = { ...state, ...newState };
    try {
        localStorage.setItem('moneymate_state', JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state to localStorage', e);
    }
    
    // Sync theme attributes in DOM
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Re-render
    renderApp();
}

// Main Render Function
export function renderApp() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Check if the current page requires standard dashboard navigation layout
    const requiresLayout = !['landing', 'login', 'signup'].includes(state.currentPage);

    if (requiresLayout) {
        // App Frame with Sidebar and Main Content
        appEl.innerHTML = `
            <div class="app-container">
                <!-- Mobile top bar header -->
                <div class="mobile-top-bar">
                    <div class="sidebar-brand">
                        <div class="sidebar-logo">
                            <i data-lucide="wallet"></i>
                        </div>
                        <span class="brand-name">MoneyMate</span>
                    </div>
                    <button class="menu-toggle-btn" id="menu-toggle-btn">
                        <i data-lucide="menu"></i>
                    </button>
                </div>
                
                <!-- Sidebar Component (Desktop and Mobile drawer) -->
                <aside class="app-sidebar" id="app-sidebar"></aside>
                
                <!-- Mobile sidebar backdrop overlay -->
                <div class="sidebar-overlay" id="sidebar-overlay"></div>
                
                <!-- Page container and dynamic content -->
                <main class="main-content" id="main-content-view"></main>
            </div>
        `;

        // Render sidebar
        renderSidebar(state);

        // Bind Mobile Navigation toggles
        const menuBtn = document.getElementById('menu-toggle-btn');
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (menuBtn && sidebar && overlay) {
            menuBtn.onclick = () => {
                sidebar.classList.toggle('sidebar-open');
                overlay.classList.toggle('active');
            };
            overlay.onclick = () => {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('active');
            };
        }

        // Render the correct page view inside main-content-view
        const pageContainer = document.getElementById('main-content-view');
        if (pageContainer) {
            switch (state.currentPage) {
                case 'dashboard':
                    renderDashboard(pageContainer, state);
                    break;
                case 'income':
                    renderIncomePage(pageContainer, state);
                    break;
                case 'expense':
                    renderExpensePage(pageContainer, state);
                    break;
                case 'lending':
                    renderLendingPage(pageContainer, state);
                    break;
                case 'notifications':
                    renderNotificationsPage(pageContainer, state);
                    break;
                case 'reports':
                    renderReportsPage(pageContainer, state);
                    break;
                case 'profile':
                    renderProfilePage(pageContainer, state);
                    break;
                default:
                    renderDashboard(pageContainer, state);
                    break;
            }
        }
    } else {
        // Landing, Login, Signup pages render in the full screen app division
        appEl.innerHTML = `<div id="full-screen-view" style="width:100%; min-height:100vh;"></div>`;
        const fsContainer = document.getElementById('full-screen-view');
        if (fsContainer) {
            switch (state.currentPage) {
                case 'landing':
                    renderLandingPage(fsContainer, state);
                    break;
                case 'login':
                    renderLoginPage(fsContainer, state);
                    break;
                case 'signup':
                    renderSignupPage(fsContainer, state);
                    break;
            }
        }
    }

    // Refresh lucide icons dynamically
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// Start application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
