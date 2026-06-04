// Profile Page Component
import { setState } from '../app.js';

export function renderProfilePage(container, state) {
    if (!container) return;

    const user = state.user;
    const userInitials = user.name.split(' ').map(n => n[0]).join('');

    const pushEnabled = state.pushEnabled !== false;
    const emailEnabled = state.emailEnabled !== false;

    // Temporary storage for QR Code
    let loadedQrBase64 = user.upiQr || '';
    let loadedAvatarBase64 = user.avatar || '';

    container.innerHTML = `
        <div class="animate-fade-in" style="display:flex; flex-direction:column; gap:2rem; width:100%; max-width:850px; margin:0 auto;">
            
            <!-- Page Header -->
            <div class="app-header" style="margin-bottom:0;">
                <div class="header-title-section">
                    <h1>Profile & Settings</h1>
                    <p>Customize your profile card, configure payment details, and set app parameters</p>
                </div>
            </div>

            <!-- Premium Profile Card Design -->
            <div class="card" style="background: linear-gradient(135deg, hsl(var(--surface)), hsl(var(--surface-hover))); border-color: hsl(var(--surface-border)); box-shadow: var(--shadow-lg), var(--shadow-glow); padding: 2rem; position: relative;">
                
                <div style="display:flex; gap:2rem; align-items:center; flex-wrap:wrap; position:relative; z-index:2;">
                    
                    <!-- Profile Photo with interactive Upload overlay -->
                    <div style="position:relative; width:96px; height:96px; border-radius:50%; flex-shrink:0;" id="avatar-hover-area">
                        <div class="profile-avatar" style="width:100%; height:100%; font-size:2.2rem; border-width:3px; border-color:hsl(var(--primary)); overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center;">
                            ${user.avatar ? `<img src="${user.avatar}" alt="Avatar" id="card-avatar-preview" style="width:100%; height:100%; object-fit:cover;">` : `<span id="card-avatar-initials">${userInitials}</span>`}
                        </div>
                        <!-- Absolute hidden input & click button wrapper -->
                        <label for="prof-avatar-file-input" style="position:absolute; bottom:-4px; right:-4px; width:32px; height:32px; border-radius:50%; background-color:hsl(var(--primary)); color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:var(--shadow-md); border:2px solid hsl(var(--surface));">
                            <i data-lucide="camera" style="width:14px; height:14px;"></i>
                        </label>
                        <input type="file" id="prof-avatar-file-input" accept="image/*" style="display:none;">
                    </div>

                    <!-- Personal Meta Description -->
                    <div style="flex:1; min-width:220px; display:flex; flex-direction:column; gap:0.5rem;">
                        <div>
                            <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
                                <h2 style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:hsl(var(--text-primary));">${user.name}</h2>
                                <span style="font-size:0.7rem; font-weight:700; color:hsl(var(--success)); background-color:hsl(var(--success-bg)); padding:2px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
                                    Premium User
                                </span>
                            </div>
                            <p style="font-size:0.85rem; color:hsl(var(--text-secondary)); font-weight:500;">Personal Finance Administrator</p>
                        </div>
                        
                        <div style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem; color:hsl(var(--text-secondary));">
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <i data-lucide="mail" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                                <span>${user.email}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <i data-lucide="phone" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                                <span>${user.phoneNumber || 'Not provided'}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <i data-lucide="credit-card" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                                <span>UPI ID: <span style="font-weight:600; color:hsl(var(--text-primary));">${user.upiId || 'Not set'}</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- QR Code Quick Preview Widget on Card -->
                    <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:0.5rem; flex-shrink:0;">
                        <div style="width:96px; height:96px; border:1px solid hsl(var(--surface-border)); border-radius:var(--border-radius-sm); background-color:hsl(var(--background)); display:flex; align-items:center; justify-content:center; overflow:hidden; padding:0.25rem;">
                            ${user.upiQr ? `
                                <img src="${user.upiQr}" alt="QR" style="width:100%; height:100%; object-fit:contain;">
                            ` : `
                                <div style="display:flex; flex-direction:column; align-items:center; color:hsl(var(--text-muted));">
                                    <i data-lucide="qr-code" style="width:24px; height:24px; opacity:0.3;"></i>
                                    <span style="font-size:0.6rem;">No QR Code</span>
                                </div>
                            `}
                        </div>
                        <span style="font-size:0.7rem; color:hsl(var(--text-muted)); font-weight:600; text-transform:uppercase;">Pay QR Code</span>
                    </div>
                </div>

                <!-- Background vector layout decoration -->
                <div style="position:absolute; right:0; top:0; width:150px; height:100%; background:linear-gradient(90deg, transparent, hsl(var(--primary-bg)/0.03)); pointer-events:none;"></div>
            </div>

            <!-- Configuration Forms stacked in one column -->
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
                
                <!-- Card 1: Account Information -->
                <div class="card">
                    <h3 class="card-title">Personal Information Settings</h3>
                    <form id="profile-info-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="prof-name">Full Name</label>
                                <input type="text" id="prof-name" class="form-input" value="${user.name}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prof-email">Email Address</label>
                                <input type="email" id="prof-email" class="form-input" value="${user.email}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="prof-phone">Phone Number</label>
                            <input type="text" id="prof-phone" class="form-input" value="${user.phoneNumber || ''}" placeholder="e.g. +91 98765 43210" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:fit-content; align-self:flex-end;">
                            Save Personal Details
                        </button>
                    </form>
                </div>

                <!-- Card 2: UPI VPA & QR upload -->
                <div class="card">
                    <h3 class="card-title">UPI ID & QR Code Upload</h3>
                    <form id="profile-upi-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                        <div class="form-group">
                            <label class="form-label" for="prof-upi-id">Default UPI VPA ID</label>
                            <input type="text" id="prof-upi-id" class="form-input" value="${user.upiId || ''}" placeholder="e.g. yourname@okaxis" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Scan & Pay QR Code Image</label>
                            <div style="display:flex; align-items:flex-start; gap:1.5rem; flex-wrap:wrap;">
                                <div style="display:flex; flex-direction:column; gap:0.5rem; flex:1; min-width:200px;">
                                    <input type="file" id="prof-upi-qr-input" class="form-input" accept="image/*" style="font-size:0.85rem; padding:0.5rem; cursor:pointer;">
                                    <p style="font-size:0.75rem; color:hsl(var(--text-muted)); line-height:1.4;">
                                        Select and upload your payment QR code screenshot. This QR is saved locally on your device and will be displayed in the card above.
                                    </p>
                                </div>
                                
                                <div id="upi-qr-preview-container" style="width:160px; height:160px; border:2px dashed hsl(var(--surface-border)); border-radius:var(--border-radius-sm); display:flex; align-items:center; justify-content:center; overflow:hidden; background-color:hsl(var(--background) / 0.5);">
                                    ${user.upiQr ? `
                                        <img src="${user.upiQr}" alt="UPI QR Code" style="width:100%; height:100%; object-fit:contain; padding:0.5rem;">
                                    ` : `
                                        <div style="text-align:center; color:hsl(var(--text-muted)); font-size:0.75rem; padding:1rem; display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
                                            <i data-lucide="qr-code" style="width:36px; height:36px; opacity:0.5;"></i>
                                            <span>No QR code uploaded</span>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width:fit-content; align-self:flex-end;">
                            Save UPI Payment Settings
                        </button>
                    </form>
                </div>

                <!-- Card 3: Preferences -->
                <div class="card">
                    <h3 class="card-title">System Preferences</h3>
                    <form id="profile-prefs-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:1.25rem;">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="prof-currency">Default Currency</label>
                                <select id="prof-currency" class="form-input" required>
                                    <option value="₹" ${user.currency === '₹' ? 'selected' : ''}>Indian Rupee (INR ₹)</option>
                                    <option value="$" ${user.currency === '$' ? 'selected' : ''}>US Dollar (USD $)</option>
                                    <option value="€" ${user.currency === '€' ? 'selected' : ''}>Euro (EUR €)</option>
                                    <option value="£" ${user.currency === '£' ? 'selected' : ''}>British Pound (GBP £)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="prof-budget">Monthly Budget Limit</label>
                                <input type="number" id="prof-budget" class="form-input" value="${user.monthlyBudget}" required min="1000">
                            </div>
                        </div>

                        <!-- System alerts settings check -->
                        <div class="form-group" style="border-top:1px solid hsl(var(--surface-border)); padding-top:1.25rem;">
                            <label class="form-label" style="margin-bottom:0.75rem;">System Notifications</label>
                            
                            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                                <input type="checkbox" id="prof-push" style="cursor:pointer;" ${pushEnabled ? 'checked' : ''}>
                                <label for="prof-push" style="font-size:0.85rem; color:hsl(var(--text-secondary)); cursor:pointer; font-weight:500;">
                                    Enable Budget Limit and Overdue Lending Push Alerts
                                </label>
                            </div>

                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <input type="checkbox" id="prof-email-notif" style="cursor:pointer;" ${emailEnabled ? 'checked' : ''}>
                                <label for="prof-email-notif" style="font-size:0.85rem; color:hsl(var(--text-secondary)); cursor:pointer; font-weight:500;">
                                    Send Weekly PDF Analytics digest to my inbox
                                </label>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width:fit-content; align-self:flex-end;">
                            Save System Preferences
                        </button>
                    </form>
                </div>

            </div>

        </div>
    `;

    // Logout click bind
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm('Log out from MoneyMate? Your local data is preserved.')) {
                setState({ currentPage: 'landing' });
            }
        };
    }

    // Avatar upload handler
    const avatarInput = document.getElementById('prof-avatar-file-input');
    if (avatarInput) {
        avatarInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    loadedAvatarBase64 = event.target.result;
                    
                    // Update state immediately to sync layout and sidebar avatar!
                    const updatedUser = {
                        ...state.user,
                        avatar: loadedAvatarBase64
                    };
                    
                    const newNotif = {
                        id: 'n-' + Math.random().toString(36).substr(2, 9),
                        title: 'Profile Picture Updated',
                        message: 'Successfully changed your profile avatar photo.',
                        date: 'Just now',
                        type: 'success',
                        read: false
                    };

                    setState({ user: updatedUser, notifications: [newNotif, ...state.notifications] });
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // QR Image load handler
    const qrInput = document.getElementById('prof-upi-qr-input');
    const qrPreview = document.getElementById('upi-qr-preview-container');

    if (qrInput) {
        qrInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    loadedQrBase64 = event.target.result;
                    if (qrPreview) {
                        qrPreview.innerHTML = `
                            <img src="${loadedQrBase64}" alt="UPI QR Code" style="width:100%; height:100%; object-fit:contain; padding:0.5rem;">
                        `;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Save Personal Info
    const infoForm = document.getElementById('profile-info-form');
    infoForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('prof-name').value.trim();
        const email = document.getElementById('prof-email').value.trim();
        const phone = document.getElementById('prof-phone').value.trim();

        if (name.length < 2 || !email.includes('@') || phone.length < 5) {
            alert('Please check your inputs.');
            return;
        }

        const updatedUser = {
            ...state.user,
            name,
            email,
            phoneNumber: phone
        };

        const newNotif = {
            id: 'n-' + Math.random().toString(36).substr(2, 9),
            title: 'Account Information Saved',
            message: 'Your personal details were saved successfully.',
            date: 'Just now',
            type: 'success',
            read: false
        };

        alert('Account details updated successfully!');
        setState({ user: updatedUser, notifications: [newNotif, ...state.notifications] });
    };

    // Save UPI settings
    const upiForm = document.getElementById('profile-upi-form');
    upiForm.onsubmit = (e) => {
        e.preventDefault();
        const upiId = document.getElementById('prof-upi-id').value.trim();

        const updatedUser = {
            ...state.user,
            upiId,
            upiQr: loadedQrBase64
        };

        const newNotif = {
            id: 'n-' + Math.random().toString(36).substr(2, 9),
            title: 'UPI Settings Saved',
            message: `Updated payment variables: UPI VPA set to "${upiId}".`,
            date: 'Just now',
            type: 'success',
            read: false
        };

        alert('UPI Information updated successfully!');
        setState({ user: updatedUser, notifications: [newNotif, ...state.notifications] });
    };

    // Save Preferences
    const prefsForm = document.getElementById('profile-prefs-form');
    prefsForm.onsubmit = (e) => {
        e.preventDefault();
        const currency = document.getElementById('prof-currency').value;
        const budget = parseInt(document.getElementById('prof-budget').value);
        const push = document.getElementById('prof-push').checked;
        const emailN = document.getElementById('prof-email-notif').checked;

        if (isNaN(budget) || budget < 1000) {
            alert('Budget limit must be at least 1,000.');
            return;
        }

        const updatedUser = {
            ...state.user,
            currency,
            monthlyBudget: budget
        };

        const newNotif = {
            id: 'n-' + Math.random().toString(36).substr(2, 9),
            title: 'Preferences Updated',
            message: `Preferences saved: Currency set to "${currency}", monthly budget limit: ₹${budget.toLocaleString()}.`,
            date: 'Just now',
            type: 'success',
            read: false
        };

        alert('System preferences updated successfully!');
        setState({ 
            user: updatedUser, 
            pushEnabled: push,
            emailEnabled: emailN,
            notifications: [newNotif, ...state.notifications] 
        });
    };
}
