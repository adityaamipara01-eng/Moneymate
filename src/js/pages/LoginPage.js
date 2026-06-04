// Login Page Component
import { setState } from '../app.js';

export function renderLoginPage(container, state) {
    if (!container) return;

    container.innerHTML = `
        <div class="auth-page" style="min-height: 100vh; background: radial-gradient(circle at center, hsl(var(--primary-bg) / 0.2), transparent 60%), hsl(var(--background)); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
            <div class="card animate-fade-in" style="width: 100%; max-width: 420px; padding: 2.5rem; box-shadow: var(--shadow-lg), var(--shadow-glow); border-color: hsl(var(--surface-border) / 0.8);">
                
                <!-- Brand logo link back to Landing -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 2rem; text-align: center;">
                    <a href="#" id="auth-logo-link" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 38px; height: 38px; border-radius: var(--border-radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="./src/assets/logo.png" alt="Kharcha Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius-sm);">
                        </div>
                        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.35rem; letter-spacing: -0.5px;">Kharcha</span>
                    </a>
                    <h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 1rem;">Welcome Back</h2>
                    <p style="color: hsl(var(--text-secondary)); font-size: 0.85rem;">Login to review your financial logs</p>
                </div>

                <div id="login-error-msg" style="display: none; padding: 0.75rem; background-color: hsl(var(--danger-bg)); border: 1px solid hsl(var(--danger) / 0.2); color: hsl(var(--danger)); border-radius: var(--border-radius-sm); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; align-items: center; gap: 0.5rem;">
                    <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
                    <span id="error-text">Please check your email and password.</span>
                </div>

                <!-- Credentials Form -->
                <form id="login-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <div class="form-group">
                        <label class="form-label" for="login-email">Email Address</label>
                        <input type="email" id="login-email" class="form-input" placeholder="name@example.com" required>
                    </div>

                    <div class="form-group" style="position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <label class="form-label" for="login-password" style="margin-bottom: 0;">Password</label>
                            <a href="#" style="font-size: 0.75rem; color: hsl(var(--primary)); font-weight: 600;" id="forgot-pw-link">Forgot Password?</a>
                        </div>
                        <div style="position: relative; width: 100%;">
                            <input type="password" id="login-password" class="form-input" style="padding-right: 2.75rem;" placeholder="Enter password" required>
                            <button type="button" id="toggle-pw-visibility" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="padding: 0.95rem; font-size: 0.95rem; margin-top: 0.5rem;" id="login-submit-btn">
                        Sign In
                    </button>
                </form>

                <!-- Social Signins -->
                <div style="margin: 1.5rem 0; position: relative; text-align: center;">
                    <span style="font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; background-color: hsl(var(--surface)); padding: 0 10px; position: relative; z-index: 2;">
                        OR CONTINUE WITH
                    </span>
                    <hr style="position: absolute; top: 50%; left: 0; right: 0; border: 0; border-top: 1px solid hsl(var(--surface-border)); z-index: 1;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                    <button class="btn btn-secondary btn-block" style="padding: 0.75rem; font-size: 0.85rem; font-weight: 600;" id="demo-login-btn">
                        <i data-lucide="sparkles" style="color: hsl(var(--primary)); width: 16px; height: 16px;"></i>
                        Demo Login (Skip Authentication)
                    </button>
                </div>

                <!-- Signup Redirect Footer -->
                <div style="margin-top: 2rem; text-align: center; font-size: 0.85rem; color: hsl(var(--text-secondary)); font-weight: 500;">
                    Don't have an account? 
                    <a href="#" id="auth-signup-redirect" style="color: hsl(var(--primary)); font-weight: 700;">Sign Up</a>
                </div>

            </div>
        </div>
    `;

    // Event handlers
    document.getElementById('auth-logo-link').onclick = () => setState({ currentPage: 'landing' });
    document.getElementById('auth-signup-redirect').onclick = () => setState({ currentPage: 'signup' });
    
    // Toggle Password Visibility
    const togglePwBtn = document.getElementById('toggle-pw-visibility');
    const pwInput = document.getElementById('login-password');
    if (togglePwBtn && pwInput) {
        togglePwBtn.onclick = () => {
            const isPw = pwInput.type === 'password';
            pwInput.type = isPw ? 'text' : 'password';
            togglePwBtn.innerHTML = `<i data-lucide="${isPw ? 'eye-off' : 'eye'}" style="width: 18px; height: 18px;"></i>`;
            if (window.lucide) window.lucide.createIcons();
        };
    }

    // Forgot Password Mock
    document.getElementById('forgot-pw-link').onclick = (e) => {
        e.preventDefault();
        alert('Password recovery link sent! (Demo Simulation: Check console for code).');
        console.log('Recovery Code: MM-4392-RESET');
    };

    // Form Submit (Validation simulation)
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error-msg');
    const errorText = document.getElementById('error-text');

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = pwInput.value;

        // Clean UI
        errorMsg.style.display = 'none';

        if (!email.includes('@')) {
            errorText.innerText = 'Please enter a valid email address.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        if (password.length < 6) {
            errorText.innerText = 'Password must be at least 6 characters.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Check registered users in localStorage
        let registeredUsers = [];
        try {
            const saved = localStorage.getItem('kharcha_users');
            if (saved) registeredUsers = JSON.parse(saved);
        } catch(err) { /* ignore */ }

        const matchedUser = registeredUsers.find(u => u.email === email);

        if (!matchedUser) {
            errorText.innerHTML = 'No account found with this email. Please <a href="#" id="error-signup-link" style="color:hsl(var(--primary)); font-weight:700; text-decoration:underline;">Sign Up</a> first.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            // Bind the inline signup link
            setTimeout(() => {
                const signupLink = document.getElementById('error-signup-link');
                if (signupLink) signupLink.onclick = (ev) => { ev.preventDefault(); setState({ currentPage: 'signup' }); };
            }, 0);
            return;
        }

        if (matchedUser.password !== password) {
            errorText.innerText = 'Incorrect password. Please try again.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Successful login
        setState({
            currentPage: 'dashboard',
            isAuthenticated: true,
            user: {
                ...state.user,
                email: matchedUser.email,
                name: matchedUser.name
            }
        });
    };

    // Demo bypass
    document.getElementById('demo-login-btn').onclick = () => {
        setState({ 
            currentPage: 'dashboard',
            isAuthenticated: true,
            user: {
                ...state.user,
                email: 'demo@kharcha.com',
                name: 'Aditya Amipara'
            }
        });
    };
}
