// Landing Page Component
import { setState } from '../app.js';

export function renderLandingPage(container, state) {
    if (!container) return;

    // Apply specific landing styling classes or inline styles
    container.innerHTML = `
        <div class="landing-page" style="min-height: 100vh; background: radial-gradient(circle at top right, hsl(var(--primary-bg) / 0.3), transparent 45%), radial-gradient(circle at bottom left, hsl(var(--success-bg) / 0.2), transparent 40%), hsl(var(--background)); transition: background-color 0.3s ease; padding: 2rem 1.5rem; display: flex; flex-direction: column;">
            
            <!-- Navbar Header -->
            <header style="max-width: 1200px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid hsl(var(--surface-border) / 0.5);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 42px; height: 42px; border-radius: var(--border-radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="./src/assets/logo.png" alt="Kharcha Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius-sm);">
                    </div>
                    <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Kharcha</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button class="btn btn-secondary btn-sm" id="landing-login-btn">Log In</button>
                    <button class="btn btn-primary btn-sm" id="landing-signup-btn">Sign Up</button>
                </div>
            </header>

            <!-- Hero Section -->
            <section style="max-width: 1200px; margin: 4rem auto; width: 100%; display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; align-items: center; flex: 1;" class="grid-2">
                <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: hsl(var(--primary)); letter-spacing: 2px; background-color: hsl(var(--primary-bg)); padding: 6px 12px; border-radius: 30px; width: fit-content;">
                        ⚡ Premium Personal Finance
                    </span>
                    <h1 style="font-size: 4rem; font-weight: 800; font-family: var(--font-heading); line-height: 1.1; letter-spacing: -1.5px; margin-top: 0.5rem;">
                        Take Command of Your <span style="background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-hover))); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Financial Future</span>
                    </h1>
                    <p style="font-size: 1.15rem; color: hsl(var(--text-secondary)); max-width: 520px; line-height: 1.6;">
                        Track income, control expenses, manage social debts, and view beautiful interactive analytics. Kharcha puts clarity back in your pocket.
                    </p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                        <button class="btn btn-primary" id="get-started-btn" style="padding: 1rem 2rem; font-size: 1.05rem; box-shadow: var(--shadow-glow);">
                            Launch Application
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <button class="btn btn-secondary" id="explore-pricing-btn" style="padding: 1rem 2rem; font-size: 1.05rem;">
                            View Pricing
                        </button>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 2rem; margin-top: 1.5rem; border-top: 1px solid hsl(var(--surface-border) / 0.5); padding-top: 2rem;">
                        <div>
                            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800;">100%</div>
                            <div style="font-size: 0.8rem; color: hsl(var(--text-muted)); font-weight: 600;">Data Encrypted</div>
                        </div>
                        <div>
                            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800;">₹500M+</div>
                            <div style="font-size: 0.8rem; color: hsl(var(--text-muted)); font-weight: 600;">Transactions Tracked</div>
                        </div>
                        <div>
                            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800;">4.9 ★</div>
                            <div style="font-size: 0.8rem; color: hsl(var(--text-muted)); font-weight: 600;">User Rating</div>
                        </div>
                    </div>
                </div>

                <!-- Animated Dashboard Preview -->
                <div class="card animate-fade-in" style="padding: 1.5rem; background: linear-gradient(135deg, hsl(var(--surface)), hsl(var(--surface-hover))); border-color: hsl(var(--surface-border) / 0.7); box-shadow: var(--shadow-lg), var(--shadow-glow); display: flex; flex-direction: column; gap: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444;"></span>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #eab308;"></span>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #22c55e;"></span>
                        </div>
                        <span style="font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; background-color: hsl(var(--surface-border)); padding: 2px 8px; border-radius: 20px;">
                            live_dashboard_mockup.json
                        </span>
                    </div>
                    
                    <div style="border-radius: var(--border-radius-sm); border: 1px solid hsl(var(--surface-border)); padding: 1rem; background-color: hsl(var(--background) / 0.5); display: flex; flex-direction: column; gap: 0.75rem;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: hsl(var(--text-secondary)); font-weight: 700; letter-spacing: 0.5px;">Net Worth</span>
                        <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: hsl(var(--success));">₹69,851.00</div>
                        <div style="display:flex; justify-content:space-between; gap:1rem; border-top:1px solid hsl(var(--surface-border)); padding-top:0.75rem; margin-top:0.25rem;">
                            <div>
                                <span style="font-size:0.65rem; color:hsl(var(--text-muted)); font-weight:600; display:block;">INFLOWS</span>
                                <span style="font-weight:700; color:hsl(var(--success)); font-size:0.9rem;">+ ₹93,500.00</span>
                            </div>
                            <div>
                                <span style="font-size:0.65rem; color:hsl(var(--text-muted)); font-weight:600; display:block;">OUTFLOWS</span>
                                <span style="font-weight:700; color:hsl(var(--danger)); font-size:0.9rem;">- ₹23,649.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="height: 120px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.5rem; padding: 0.5rem 0.25rem;">
                        <!-- Custom Mock Columns -->
                        <div style="flex:1; height: 40%; background: linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-hover))); border-radius: 4px; display:flex; justify-content:center; position:relative;"><span style="position:absolute; top:-18px; font-size:8px; font-weight:600;">Jan</span></div>
                        <div style="flex:1; height: 55%; background: linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-hover))); border-radius: 4px; display:flex; justify-content:center; position:relative;"><span style="position:absolute; top:-18px; font-size:8px; font-weight:600;">Feb</span></div>
                        <div style="flex:1; height: 35%; background: linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-hover))); border-radius: 4px; display:flex; justify-content:center; position:relative;"><span style="position:absolute; top:-18px; font-size:8px; font-weight:600;">Mar</span></div>
                        <div style="flex:1; height: 75%; background: linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-hover))); border-radius: 4px; display:flex; justify-content:center; position:relative;"><span style="position:absolute; top:-18px; font-size:8px; font-weight:600;">Apr</span></div>
                        <div style="flex:1; height: 95%; background: linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-hover))); border-radius: 4px; display:flex; justify-content:center; position:relative;"><span style="position:absolute; top:-18px; font-size:8px; font-weight:600;">May</span></div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; background-color: hsl(var(--primary-bg)); border-radius: var(--border-radius-sm); border: 1px solid hsl(var(--primary) / 0.15); font-size: 0.8rem; color: hsl(var(--text-primary)); font-weight: 500;">
                        <span style="display:flex; align-items:center; gap:0.5rem;">
                            <i data-lucide="sparkles" style="width:14px; height:14px; color:hsl(var(--primary));"></i>
                            Spending limit warning details
                        </span>
                        <span style="color: hsl(var(--primary)); font-weight:700;">Alert</span>
                    </div>
                </div>
            </section>

            <!-- Feature Showcase -->
            <section style="max-width: 1200px; margin: 2rem auto 4rem; width: 100%;">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading);">Designed For Next-Gen Wealth Builders</h2>
                    <p style="color: hsl(var(--text-secondary)); font-size: 1.05rem; margin-top: 0.5rem;">Simplicity is the ultimate sophistication. Everything you need, minus the clutter.</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
                    <div class="card" style="padding: 1.75rem; border-color: hsl(var(--surface-border) / 0.5);">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background-color: hsl(var(--success-bg)); color: hsl(var(--success)); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                            <i data-lucide="arrow-down-circle"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Smart Incomes</h3>
                        <p style="color: hsl(var(--text-secondary)); font-size: 0.9rem; line-height: 1.5;">Categorize income and see active growth trends over custom ranges automatically.</p>
                    </div>

                    <div class="card" style="padding: 1.75rem; border-color: hsl(var(--surface-border) / 0.5);">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background-color: hsl(var(--danger-bg)); color: hsl(var(--danger)); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                            <i data-lucide="arrow-up-circle"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Expense Budgets</h3>
                        <p style="color: hsl(var(--text-secondary)); font-size: 0.9rem; line-height: 1.5;">Define targets, analyze categories, and receive notifications before overspending.</p>
                    </div>

                    <div class="card" style="padding: 1.75rem; border-color: hsl(var(--surface-border) / 0.5);">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background-color: hsl(var(--warning-bg)); color: hsl(var(--warning)); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                            <i data-lucide="hand-coins"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Lending Tracker</h3>
                        <p style="color: hsl(var(--text-secondary)); font-size: 0.9rem; line-height: 1.5;">Keep clean logs of money lent or borrowed from friends with active due reminders.</p>
                    </div>

                    <div class="card" style="padding: 1.75rem; border-color: hsl(var(--surface-border) / 0.5);">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background-color: hsl(var(--primary-bg)); color: hsl(var(--primary)); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                            <i data-lucide="trending-up"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Advanced Reports</h3>
                        <p style="color: hsl(var(--text-secondary)); font-size: 0.9rem; line-height: 1.5;">Generate high-fidelity SVG graphics to understand cash flows and export records instantly.</p>
                    </div>
                </div>
            </section>

            <!-- Pricing Tiers Section -->
            <section id="pricing-section" style="max-width: 1000px; margin: 2rem auto 5rem; width: 100%;">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading);">Choose Your Plan</h2>
                    <p style="color: hsl(var(--text-secondary)); font-size: 1.05rem; margin-top: 0.5rem;">Start completely free and unlock premium insights when you are ready.</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;" class="grid-3">
                    <!-- Free Tier -->
                    <div class="card" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; border-color: hsl(var(--surface-border));">
                        <div>
                            <h3 style="font-size: 1.4rem; font-weight: 700;">Basic</h3>
                            <p style="color: hsl(var(--text-muted)); font-size: 0.85rem; margin-top: 0.25rem;">For simple finance logs</p>
                        </div>
                        <div>
                            <span style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800;">₹0</span>
                            <span style="color: hsl(var(--text-muted)); font-size: 0.9rem;">/ month</span>
                        </div>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; border-top: 1px solid hsl(var(--surface-border)); padding-top: 1.25rem; flex: 1;">
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Basic Expense Logging</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Single Account support</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> CSV Static Exporter</li>
                            <li style="display:flex; align-items:center; gap:0.5rem; opacity: 0.4;"><i data-lucide="x" style="width:16px; height:16px; color:hsl(var(--danger));"></i> Interactive Custom SVG Charts</li>
                            <li style="display:flex; align-items:center; gap:0.5rem; opacity: 0.4;"><i data-lucide="x" style="width:16px; height:16px; color:hsl(var(--danger));"></i> Lending Due Notifications</li>
                        </ul>
                        <button class="btn btn-secondary btn-block" style="margin-top: auto;" id="select-free-btn">Get Started</button>
                    </div>

                    <!-- Pro Tier (Highlighted) -->
                    <div class="card" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; border-color: hsl(var(--primary)); box-shadow: var(--shadow-glow); background: linear-gradient(135deg, hsl(var(--surface)), hsl(var(--surface-hover))); transform: scale(1.05); position: relative; overflow: visible;">
                        <span style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-hover))); color: white; padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            POPULAR CHOICE
                        </span>
                        <div>
                            <h3 style="font-size: 1.4rem; font-weight: 700;">Pro Professional</h3>
                            <p style="color: hsl(var(--text-muted)); font-size: 0.85rem; margin-top: 0.25rem;">Complete automation for individuals</p>
                        </div>
                        <div>
                            <span style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800;">₹299</span>
                            <span style="color: hsl(var(--text-muted)); font-size: 0.9rem;">/ month</span>
                        </div>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; border-top: 1px solid hsl(var(--surface-border)); padding-top: 1.25rem; flex: 1;">
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Unlimited Incomes & Expenses</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Multiple Account Currencies</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Interactive Custom SVG Charts</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Lending Tracker & Due Alerts</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Sync state in Local Storage</li>
                        </ul>
                        <button class="btn btn-primary btn-block" style="margin-top: auto;" id="select-pro-btn">Start Free Trial</button>
                    </div>

                    <!-- Business Tier -->
                    <div class="card" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; border-color: hsl(var(--surface-border));">
                        <div>
                            <h3 style="font-size: 1.4rem; font-weight: 700;">Business</h3>
                            <p style="color: hsl(var(--text-muted)); font-size: 0.85rem; margin-top: 0.25rem;">For teams & families</p>
                        </div>
                        <div>
                            <span style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800;">₹999</span>
                            <span style="color: hsl(var(--text-muted)); font-size: 0.9rem;">/ month</span>
                        </div>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; border-top: 1px solid hsl(var(--surface-border)); padding-top: 1.25rem; flex: 1;">
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Everything in Pro level</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Up to 5 family/team members</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Dedicated Advisor support</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Advanced AI Budget insights</li>
                            <li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check" style="width:16px; height:16px; color:hsl(var(--success));"></i> Automated PDF exports</li>
                        </ul>
                        <button class="btn btn-secondary btn-block" style="margin-top: auto;" id="select-biz-btn">Contact Sales</button>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            <section style="max-width: 1000px; margin: 0 auto 5rem; width: 100%;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                    <div style="display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem; background-color:hsl(var(--surface) / 0.5); border:1px solid hsl(var(--surface-border) / 0.5); border-radius: var(--border-radius-md);">
                        <p style="font-style:italic; font-size:0.95rem; color:hsl(var(--text-secondary));">"The money lending feature is an absolute life-saver. No more writing down who owes what on napkins or awkward WhatsApp chats!"</p>
                        <div style="display:flex; align-items:center; gap:0.75rem; margin-top:1.25rem;">
                        <div style="width:36px; height:36px; border-radius:50%; background-color:hsl(var(--primary)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">AA</div>
                        <div>
                            <h4 style="font-size:0.85rem; font-weight:600;">Aditya Amipara</h4>
                            <span style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:500;">Freelance Developer</span>
                        </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem; background-color:hsl(var(--surface) / 0.5); border:1px solid hsl(var(--surface-border) / 0.5); border-radius: var(--border-radius-md);">
                        <p style="font-style:italic; font-size:0.95rem; color:hsl(var(--text-secondary));">"The custom SVG graphs load instantly, even on weak connections, and dark mode transitions are incredibly smooth. Stunning interface design."</p>
                        <div style="display:flex; align-items:center; gap:0.75rem; margin-top:1.25rem;">
                            <div style="width:36px; height:36px; border-radius:50%; background-color:hsl(var(--success)); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">AA</div>
                            <div>
                                <h4 style="font-size:0.85rem; font-weight:600;">Aditya Amipara</h4>
                                <span style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:500;">Product Designer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer style="max-width: 1200px; margin: auto auto 0; width: 100%; text-align: center; border-top: 1px solid hsl(var(--surface-border) / 0.5); padding: 2rem 0; font-size: 0.85rem; color: hsl(var(--text-muted)); font-weight: 500;">
                <p>&copy; 2026 Kharcha. Designed with premium HSL glassmorphism aesthetics. All Rights Reserved.</p>
            </footer>
        </div>
    `;

    // Button event binds
    document.getElementById('landing-login-btn').onclick = () => setState({ currentPage: 'login' });
    document.getElementById('landing-signup-btn').onclick = () => setState({ currentPage: 'signup' });
    document.getElementById('get-started-btn').onclick = () => setState({ currentPage: 'dashboard' });
    
    document.getElementById('select-free-btn').onclick = () => setState({ currentPage: 'signup' });
    document.getElementById('select-pro-btn').onclick = () => setState({ currentPage: 'signup' });
    document.getElementById('select-biz-btn').onclick = () => setState({ currentPage: 'signup' });

    document.getElementById('explore-pricing-btn').onclick = (e) => {
        e.preventDefault();
        document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' });
    };
}
