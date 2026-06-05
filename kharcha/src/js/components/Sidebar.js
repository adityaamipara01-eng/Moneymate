// Sidebar Component
import { setState } from '../app.js';

export function renderSidebar(state) {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    const unreadNotifications = state.notifications.filter(n => !n.read).length;

    // Define navigation items
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'income', label: 'Income', icon: 'arrow-down-circle' },
        { id: 'expense', label: 'Expense', icon: 'arrow-up-circle' },
        { id: 'lending', label: 'Money Lending', icon: 'hand-coins' },
        { id: 'reports', label: 'Reports', icon: 'trending-up' },
        { id: 'notifications', label: 'Notifications', icon: 'bell', badge: unreadNotifications },
        { id: 'profile', label: 'Profile', icon: 'user' }
    ];

    // Generate menu HTML
    const menuHtml = menuItems.map(item => {
        const isActive = state.currentPage === item.id;
        const badgeHtml = item.badge && item.badge > 0 ? `<span class="badge">${item.badge}</span>` : '';
        return `
            <li class="sidebar-menu-item">
                <a href="#" class="sidebar-link ${isActive ? 'active' : ''}" data-page="${item.id}">
                    <i data-lucide="${item.icon}"></i>
                    <span>${item.label}</span>
                    ${badgeHtml}
                </a>
            </li>
        `;
    }).join('');

    const userInitials = state.user.name.split(' ').map(n => n[0]).join('');

    sidebarEl.innerHTML = `
        <!-- Sidebar Brand -->
        <div class="sidebar-brand">
            <div class="sidebar-logo" style="overflow:hidden;">
                <img src="./src/assets/logo.png" alt="Kharcha Logo" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            </div>
            <span class="brand-name">Kharcha</span>
        </div>

        <!-- Sidebar Navigation Menu -->
        <ul class="sidebar-menu">
            ${menuHtml}
        </ul>

        <!-- Sidebar Footer Actions -->
        <div class="sidebar-footer">
            <!-- Theme Toggle Button -->
            <button class="theme-toggle-btn" id="theme-toggle-btn">
                <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}"></i>
                <span>${state.theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>

            <!-- User profile widget -->
            <div class="sidebar-profile" id="sidebar-profile-widget">
                <div class="profile-avatar">
                    ${state.user.avatar ? `<img src="${state.user.avatar}" alt="Avatar">` : userInitials}
                </div>
                <div class="profile-info">
                    <span class="profile-name">${state.user.name}</span>
                    <span class="profile-role">Premium Member</span>
                </div>
            </div>
        </div>
    `;

    // Add navigation click event handlers
    const navLinks = sidebarEl.querySelectorAll('.sidebar-link');
    navLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            setState({ currentPage: targetPage });
            
            // Close mobile drawer if active
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebarEl.classList.contains('sidebar-open') && overlay) {
                sidebarEl.classList.remove('sidebar-open');
                overlay.classList.remove('active');
            }
        };
    });

    // Theme Toggle Handler
    const themeBtn = sidebarEl.querySelector('#theme-toggle-btn');
    if (themeBtn) {
        themeBtn.onclick = () => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            setState({ theme: newTheme });
        };
    }

    // Profile Widget Click Handler
    const profileWidget = sidebarEl.querySelector('#sidebar-profile-widget');
    if (profileWidget) {
        profileWidget.onclick = () => {
            setState({ currentPage: 'profile' });
        };
    }
}
