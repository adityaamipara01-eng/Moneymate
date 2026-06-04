// Signup Page Component
import { setState } from '../app.js';

export function renderSignupPage(container, state) {
    if (!container) return;

    container.innerHTML = `
        <div class="auth-page" style="min-height: 100vh; background: radial-gradient(circle at center, hsl(var(--primary-bg) / 0.2), transparent 60%), hsl(var(--background)); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
            <div class="card animate-fade-in" style="width: 100%; max-width: 440px; padding: 2.5rem; box-shadow: var(--shadow-lg), var(--shadow-glow); border-color: hsl(var(--surface-border) / 0.8);">
                
                <!-- Brand Logo Header -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 2rem; text-align: center;">
                    <a href="#" id="signup-logo-link" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 38px; height: 38px; border-radius: var(--border-radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="./src/assets/logo.png" alt="Kharcha Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius-sm);">
                        </div>
                        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.35rem; letter-spacing: -0.5px;">Kharcha</span>
                    </a>
                    <h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 1rem;">Create Account</h2>
                    <p style="color: hsl(var(--text-secondary)); font-size: 0.85rem;">Sign up for smart personal finance tracking</p>
                </div>

                <div id="signup-error-msg" style="display: none; padding: 0.75rem; background-color: hsl(var(--danger-bg)); border: 1px solid hsl(var(--danger) / 0.2); color: hsl(var(--danger)); border-radius: var(--border-radius-sm); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; align-items: center; gap: 0.5rem;">
                    <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
                    <span id="signup-error-text">Please review your fields.</span>
                </div>

                <!-- Signup Form -->
                <form id="signup-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <div class="form-group">
                        <label class="form-label" for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" class="form-input" placeholder="Aditya Raj" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="signup-email">Email Address</label>
                        <input type="email" id="signup-email" class="form-input" placeholder="name@example.com" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="signup-password">Password</label>
                        <input type="password" id="signup-password" class="form-input" placeholder="Create strong password" required>
                        <div id="password-strength" style="font-size: 0.75rem; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; color: hsl(var(--text-muted)); font-weight: 500;">
                            Strength: <span id="strength-label" style="font-weight: 700;">Weak</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="signup-confirm">Confirm Password</label>
                        <input type="password" id="signup-confirm" class="form-input" placeholder="Repeat your password" required>
                    </div>

                    <!-- Terms agreement simulated check -->
                    <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin: 0.25rem 0;">
                        <input type="checkbox" id="signup-agree" required style="margin-top: 0.25rem; cursor: pointer;">
                        <label for="signup-agree" style="font-size: 0.8rem; color: hsl(var(--text-secondary)); font-weight: 500; cursor: pointer; user-select: none;">
                            I agree to the <a href="#" style="color: hsl(var(--primary)); font-weight:600;">Terms of Service</a> and <a href="#" style="color: hsl(var(--primary)); font-weight:600;">Privacy Policy</a>.
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="padding: 0.95rem; font-size: 0.95rem; margin-top: 0.25rem;" id="signup-submit-btn">
                        Get Started Free
                    </button>
                </form>

                <!-- Login Redirect Footer -->
                <div style="margin-top: 2rem; text-align: center; font-size: 0.85rem; color: hsl(var(--text-secondary)); font-weight: 500;">
                    Already have an account? 
                    <a href="#" id="auth-login-redirect" style="color: hsl(var(--primary)); font-weight: 700;">Sign In</a>
                </div>

            </div>
        </div>
    `;

    // Event binders
    document.getElementById('signup-logo-link').onclick = () => setState({ currentPage: 'landing' });
    document.getElementById('auth-login-redirect').onclick = () => setState({ currentPage: 'login' });

    // Dynamic password strength meter simulation
    const pwInput = document.getElementById('signup-password');
    const strengthLabel = document.getElementById('strength-label');
    
    if (pwInput && strengthLabel) {
        pwInput.oninput = () => {
            const val = pwInput.value;
            if (val.length === 0) {
                strengthLabel.innerText = 'Weak';
                strengthLabel.style.color = 'hsl(var(--text-muted))';
            } else if (val.length < 6) {
                strengthLabel.innerText = 'Weak (Too Short)';
                strengthLabel.style.color = 'hsl(var(--danger))';
            } else if (val.length < 10) {
                strengthLabel.innerText = 'Medium';
                strengthLabel.style.color = 'hsl(var(--warning))';
            } else {
                strengthLabel.innerText = 'Strong';
                strengthLabel.style.color = 'hsl(var(--success))';
            }
        };
    }

    // Submit Action Validation
    const signupForm = document.getElementById('signup-form');
    const errorMsg = document.getElementById('signup-error-msg');
    const errorText = document.getElementById('signup-error-text');

    signupForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = pwInput.value;
        const confirm = document.getElementById('signup-confirm').value;
        const agree = document.getElementById('signup-agree').checked;

        errorMsg.style.display = 'none';

        if (name.length < 2) {
            errorText.innerText = 'Please enter your full name.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

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

        if (password !== confirm) {
            errorText.innerText = 'Passwords do not match.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        if (!agree) {
            errorText.innerText = 'You must agree to the Terms and Conditions.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Check if email already registered
        let registeredUsers = [];
        try {
            const saved = localStorage.getItem('kharcha_users');
            if (saved) registeredUsers = JSON.parse(saved);
        } catch(err) { /* ignore */ }

        const existingUser = registeredUsers.find(u => u.email === email);
        if (existingUser) {
            errorText.innerHTML = 'An account with this email already exists. Please <a href="#" id="error-login-link" style="color:hsl(var(--primary)); font-weight:700; text-decoration:underline;">Sign In</a> instead.';
            errorMsg.style.display = 'flex';
            if (window.lucide) window.lucide.createIcons();
            setTimeout(() => {
                const loginLink = document.getElementById('error-login-link');
                if (loginLink) loginLink.onclick = (ev) => { ev.preventDefault(); setState({ currentPage: 'login' }); };
            }, 0);
            return;
        }

        // Save new user to registered users list
        registeredUsers.push({ name, email, password });
        try {
            localStorage.setItem('kharcha_users', JSON.stringify(registeredUsers));
        } catch(err) { /* ignore */ }

        // Successfully registered user — go to dashboard
        setState({
            currentPage: 'dashboard',
            isAuthenticated: true,
            user: {
                ...state.user,
                name: name,
                email: email
            }
        });
    };
}
