// Notifications Page Component
import { setState } from '../app.js';

export function renderNotificationsPage(container, state) {
    if (!container) return;

    const notifs = state.notifications;
    const unreadCount = notifs.filter(n => !n.read).length;

    // Generate notifications items list
    const notifsListHtml = notifs.length === 0
        ? `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:240px; color:hsl(var(--text-muted)); gap:0.5rem;">
                <i data-lucide="bell-off" style="width:48px; height:48px; opacity:0.5;"></i>
                <span>You have no notifications</span>
            </div>
        `
        : notifs.map(n => {
            const colors = {
                warning: { border: 'hsl(var(--warning))', bg: 'hsl(var(--warning-bg))', text: 'hsl(var(--warning))', icon: 'alert-triangle' },
                success: { border: 'hsl(var(--success))', bg: 'hsl(var(--success-bg))', text: 'hsl(var(--success))', icon: 'check-circle' },
                info: { border: 'hsl(var(--primary))', bg: 'hsl(var(--primary-bg))', text: 'hsl(var(--primary))', icon: 'info' }
            };
            
            const schema = colors[n.type] || colors.info;

            return `
                <div class="card animate-fade-in" style="margin-bottom:0.75rem; padding:1.25rem; display:flex; gap:1rem; align-items:flex-start; border-left: 4px solid ${schema.border}; background-color: ${n.read ? 'hsl(var(--surface))' : 'hsl(var(--surface-hover))'}; transition: all 0.2s ease;">
                    <div style="width:36px; height:36px; border-radius:50%; background-color:${schema.bg}; color:${schema.text}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="${schema.icon}" style="width:18px; height:18px;"></i>
                    </div>
                    
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
                            <h4 style="font-weight:700; font-size:0.95rem; color:${n.read ? 'hsl(var(--text-secondary))' : 'hsl(var(--text-primary))'};">
                                ${n.title}
                            </h4>
                            <span style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:500;">${n.date}</span>
                        </div>
                        <p style="font-size:0.85rem; color:hsl(var(--text-secondary)); margin-top:0.25rem; line-height:1.4;">
                            ${n.message}
                        </p>
                    </div>

                    <!-- Individual actions -->
                    <div style="display:flex; gap:0.35rem;">
                        ${!n.read ? `
                            <button class="btn-icon btn-sm mark-read-btn" data-id="${n.id}" title="Mark as read">
                                <i data-lucide="check" style="width:14px; height:14px; color:hsl(var(--success));"></i>
                            </button>
                        ` : ''}
                        <button class="btn-icon btn-sm dismiss-btn" data-id="${n.id}" title="Dismiss alert">
                            <i data-lucide="x" style="width:14px; height:14px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
            
            <!-- Page Header -->
            <div class="app-header">
                <div class="header-title-section">
                    <h1>Notifications</h1>
                    <p>Stay up to date on budgets, warnings, and transaction activities</p>
                </div>
                <div style="display:flex; gap:0.75rem;">
                    ${unreadCount > 0 ? `
                        <button class="btn btn-secondary btn-sm" id="mark-all-read-btn">
                            <i data-lucide="check-check"></i> Mark all as read
                        </button>
                    ` : ''}
                    ${notifs.length > 0 ? `
                        <button class="btn btn-danger btn-sm" style="background-color:hsl(var(--danger-bg)); border-color:hsl(var(--danger)/0.2); color:hsl(var(--danger));" id="clear-all-btn">
                            <i data-lucide="trash-2"></i> Clear All
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Notifications Feed Container -->
            <div style="max-width: 800px; margin: 0 auto; width:100%;">
                ${notifsListHtml}
            </div>

        </div>
    `;

    // Mark single as read
    const readBtns = container.querySelectorAll('.mark-read-btn');
    readBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
            setState({ notifications: updated });
        };
    });

    // Dismiss single notification
    const dismissBtns = container.querySelectorAll('.dismiss-btn');
    dismissBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const filtered = notifs.filter(n => n.id !== id);
            setState({ notifications: filtered });
        };
    });

    // Bulk actions
    const markAllBtn = document.getElementById('mark-all-read-btn');
    if (markAllBtn) {
        markAllBtn.onclick = () => {
            const updated = notifs.map(n => ({ ...n, read: true }));
            setState({ notifications: updated });
        };
    }

    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.onclick = () => {
            if (confirm('Clear all notifications? This cannot be undone.')) {
                setState({ notifications: [] });
            }
        };
    }
}
