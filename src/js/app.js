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

const supabaseUrl = "https://wyfnjkvvtewwiepzxtvs.supabase.co";

const supabaseKey = "sb_publishable_vAnsyhBsvS3yYVS5gZUDQg_dcBZPRoZ";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
window.supabaseClient = supabaseClient;
// Save Profile Data to Supabase
async function saveProfileToSupabase(user) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .upsert([
            {
                full_name: user.name,
                phone: user.phoneNumber,
                upi_id: user.upiId,
                profile_photo: user.avatar,
                qr_code_url: user.upiQr,
                email: user.email
            }
        ])
        .select();

    if (error) {
        console.error('Profile Save Error:', error);
    } else {
        console.log('Profile Saved:', data);
    }
}
async function saveNotificationToSupabase(notification) {
    const { data, error } = await supabaseClient
        .from('notifications')
        .insert([
            {
                user_id: state.user.email, // or actual user UUID
                title: notification.title,
                message: notification.message,
                is_read: notification.read || false
            }
        ]);

    if (error) {
        console.error('Notification Save Error:', error);
    } else {
        console.log('Notification Saved');
    }
}

async function saveTransactionToSupabase(transaction) {
    const { data, error } = await supabaseClient
        .from('transactions')
        .insert([
            {
                user_id: state.user.email,
                type: transaction.type,
                category: transaction.category,
                description: transaction.name,
                amount: transaction.amount,
                transaction_date: transaction.date
            }
        ]);

    if (error) {
        console.error('Transaction Save Error:', error);
    } else {
        console.log('Transaction Saved');
    }
}
async function testSupabase() {
    const { data, error } = await supabaseClient
        .from('transactions')
        .select('*')
        .limit(1);

    console.log('Supabase Test:', data);
    console.log('Supabase Error:', error);
}

testSupabase();

// Pre-populated high-quality dummy data
const initialDummyState = {
    theme: 'light',
    currentPage: 'login',
    isAuthenticated: false,
    user: {
        name: 'New User',
        email: '',
        phoneNumber: '',
        avatar: '', // Fallback to initials
        currency: '₹',
        monthlyBudget: 0,
        upiId: '',
        upiQr: ''
    },
    transactions: [],
    debts: [],
    notifications: []
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

// Enforce starting at login page if not authenticated
if (!state.isAuthenticated) {
    state.currentPage = 'login';
}

// Set initial theme in DOM
document.documentElement.setAttribute('data-theme', state.theme);

// Fullscreen Wallet Loader UI
function ensureLoader() {
    let loader = document.getElementById('process-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'process-loader';
        loader.className = 'process-loader-overlay';
        loader.innerHTML = `
            <div class="loader-logo-container">
                <img src="./src/assets/logo.png" alt="Kharcha Wallet Logo">
            </div>
            <div class="loader-text">Loading Kharcha...</div>
        `;
        document.body.appendChild(loader);
    }
    return loader;
}

export function showPageLoader(callback, text = 'Loading Kharcha...') {
    const loader = ensureLoader();
    const textEl = loader.querySelector('.loader-text');
    if (textEl) textEl.innerText = text;
 
    loader.classList.add('active');
 
    setTimeout(() => {
        if (callback) callback();
 
        setTimeout(() => {
            loader.classList.remove('active');
        }, 200);
    }, 600);
}

// Expose state update API
export function getState() {
    return state;
}

export function setState(newState) {
  const hasNewNotification =
    newState.notifications &&
    newState.notifications.length !== state.notifications.length;

    const pageChanged = newState.currentPage && newState.currentPage !== state.currentPage;
    const hasNewTransaction = newState.transactions && newState.transactions.length !== state.transactions.length;
    const hasUpdatedTransaction = newState.transactions && newState.transactions.length === state.transactions.length && JSON.stringify(newState.transactions) !== JSON.stringify(state.transactions);
    const hasNewDebt = newState.debts && newState.debts.length !== state.debts.length;
    const hasUpdatedDebt = newState.debts && newState.debts.length === state.debts.length && JSON.stringify(newState.debts) !== JSON.stringify(state.debts);
    const profileUpdated = newState.user && JSON.stringify(newState.user) !== JSON.stringify(state.user);

    state = { ...state, ...newState };
    try {
        localStorage.setItem('moneymate_state', JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state to localStorage', e);
    }
 
    // Sync theme attributes in DOM
    document.documentElement.setAttribute('data-theme', state.theme);
 
    if (pageChanged) {
        let loadingText = 'Processing...';
        if (newState.currentPage === 'dashboard') loadingText = 'Opening Dashboard...';
        else if (newState.currentPage === 'login') loadingText = 'Opening Login...';
        else if (newState.currentPage === 'signup') loadingText = 'Opening Signup...';
        else if (newState.currentPage === 'reports') loadingText = 'Compiling Financial Reports...';
        else if (newState.currentPage === 'profile') loadingText = 'Loading Settings...';
        else if (newState.currentPage === 'income') loadingText = 'Loading Income Stream...';
        else if (newState.currentPage === 'expense') loadingText = 'Loading Expense Stream...';
        else if (newState.currentPage === 'lending') loadingText = 'Loading Debts & Lending...';
        else if (newState.currentPage === 'notifications') loadingText = 'Opening Notifications...';
        else if (newState.currentPage === 'landing') loadingText = 'Opening Home Page...';
 
        showPageLoader(() => {
            renderApp();
        }, loadingText);
    } else if (hasNewTransaction) {
      const latestTransaction =
    state.transactions[state.transactions.length - 1];

if (latestTransaction) {
    saveTransactionToSupabase(latestTransaction);
}
        showPageLoader(() => {
            renderApp();
        }, 'Saving Transaction...');
    } else if (hasUpdatedTransaction) {
        showPageLoader(() => {
            renderApp();
        }, 'Updating Transaction...');
    } else if (hasNewDebt || hasUpdatedDebt) {
    showPageLoader(() => {
        renderApp();
    }, 'Processing Debts...');
}  else if (profileUpdated) {
    saveProfileToSupabase(state.user);

    showPageLoader(() => {
        renderApp();
    }, 'Saving Profile Changes...');
} else if (hasNewNotification) {

    const latestNotification = state.notifications[0];

    if (latestNotification) {
        saveNotificationToSupabase(latestNotification);
    }

    showPageLoader(() => {
        renderApp();
    }, 'Saving Notification...');
} else {
    renderApp();
}
}
export function logout() {
    showPageLoader(() => {
        state = {
            ...initialDummyState,
            currentPage: 'login'
        };
        try {
            localStorage.setItem('moneymate_state', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state to localStorage', e);
        }
 
        // Sync theme attributes in DOM
        document.documentElement.setAttribute('data-theme', state.theme);
 
        // Re-render
        renderApp();
    }, 'Logging out safely...');
}

// Main Render Function
export function renderApp() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Check if the current page requires standard dashboard navigation layout
    let requiresLayout = !['landing', 'login', 'signup'].includes(state.currentPage);

    // Auth redirection check
    if (requiresLayout && !state.isAuthenticated) {
        state.currentPage = 'login';
        try {
            localStorage.setItem('moneymate_state', JSON.stringify(state));
        } catch (e) {}
        requiresLayout = false;
    } else if (['login', 'signup'].includes(state.currentPage) && state.isAuthenticated) {
        state.currentPage = 'dashboard';
        try {
            localStorage.setItem('moneymate_state', JSON.stringify(state));
        } catch (e) {}
        requiresLayout = true;
    }

    if (requiresLayout) {
        // App Frame with Sidebar and Main Content
        appEl.innerHTML = `
            <div class="app-container">
                <!-- Mobile top bar header -->
                <div class="mobile-top-bar">
                    <div class="sidebar-brand">
                        <div class="sidebar-logo" style="overflow:hidden;">
                            <img src="./src/assets/logo.png" alt="Kharcha Logo" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                        </div>
                        <span class="brand-name">Kharcha</span>
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
    showPageLoader(() => {
        renderApp();
    }, 'Launching Wallet...');
});
