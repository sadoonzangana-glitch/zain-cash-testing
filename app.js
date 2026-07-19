// Zain Cash Customer Care Training Application Logic (Amyo Style)

document.addEventListener('DOMContentLoaded', () => {
    // API base URL
    const API_BASE = window.location.origin.startsWith('http') ? window.location.origin : '';
    
    async function apiCall(endpoint, method = 'GET', data = null) {
        if (!API_BASE) {
            return handleOfflineApi(endpoint, method, data);
        }
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            const response = await fetch(`${API_BASE}${endpoint}`, options);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP error ${response.status}`);
            }
            return await response.json();
        } catch (e) {
            console.warn(`API call ${endpoint} failed, falling back to local simulation:`, e);
            return handleOfflineApi(endpoint, method, data);
        }
    }
    window.apiCall = apiCall;
    
    function handleOfflineApi(endpoint, method, data) {
        if (endpoint === '/api/login' && method === 'POST') {
            const zc = data.username.trim().toUpperCase();
            if (zc === 'ZC000' || zc === 'AMR NASR') {
                return Promise.resolve({ id: 'ZC000', name: 'Amr Nasr (Offline)', role: 'Admin' });
            } else if (zc.startsWith('ZC') && zc.length > 2) {
                return Promise.resolve({ id: zc, name: `موظف افتراضي (${zc})`, role: 'Inbound' });
            } else {
                return Promise.reject(new Error("Employee code not registered (Enter ZC000)"));
            }
        }
        if (endpoint === '/api/scenarios') {
            if (method === 'GET') {
                const stored = localStorage.getItem('zain_cash_scenarios');
                return Promise.resolve(stored ? JSON.parse(stored) : null);
            }
            if (method === 'POST') {
                localStorage.setItem('zain_cash_scenarios', JSON.stringify(data));
                return Promise.resolve({ success: true });
            }
        }
        if (endpoint === '/api/slides') {
            if (method === 'GET') {
                const stored = localStorage.getItem('zain_cash_slides');
                return Promise.resolve(stored ? JSON.parse(stored) : null);
            }
            if (method === 'POST') {
                localStorage.setItem('zain_cash_slides', JSON.stringify(data));
                return Promise.resolve({ success: true });
            }
        }
        if (endpoint === '/api/assignments') {
            if (method === 'GET') {
                const stored = localStorage.getItem('offline_assignments');
                return Promise.resolve(stored ? JSON.parse(stored) : []);
            }
            if (method === 'POST') {
                localStorage.setItem('offline_assignments', JSON.stringify(data));
                return Promise.resolve({ success: true });
            }
        }
        if (endpoint === '/api/results') {
            if (method === 'GET') {
                const stored = localStorage.getItem('offline_results');
                return Promise.resolve(stored ? JSON.parse(stored) : []);
            }
            if (method === 'POST') {
                const stored = localStorage.getItem('offline_results');
                const results = stored ? JSON.parse(stored) : [];
                const newRes = { ...data, date: new Date().toISOString().replace('T', ' ').substring(0, 19) };
                results.push(newRes);
                localStorage.setItem('offline_results', JSON.stringify(results));
                return Promise.resolve({ success: true });
            }
        }
        if (endpoint === '/api/users' && method === 'GET') {
            return Promise.resolve([
                { id: 'ZC262', name: 'Sadoon Muhsin', role: 'Inbound', email: 'sadoon.mohsoun@zaincash.iq' },
                { id: 'ZC000', name: 'Amr Nasr', role: 'Admin' },
                { id: 'ZC700', name: 'Kadhim Mohammed Safi', role: 'Inbound', email: 'kadhim.mohammed@zaincash.iq' },
                { id: 'ZC476', name: 'Mustafa Khudhaier Abbas', role: 'Inbound', email: 'mustafa.khudher@zaincash.iq' },
                { id: 'ZC552', name: 'Aso Sarbest Nathmi', role: 'Inbound', email: 'aso.sarbast@zaincash.iq' },
                { id: 'ZC733', name: 'Tara faris fouad', role: 'Inbound', email: 'tara.faris@zaincash.iq' },
                { id: 'ZC580', name: 'Hayman Omed Mohammed', role: 'Inbound', email: 'hemn.omed@zaincash.iq' },
                { id: 'ZC624', name: 'Ruqaya Nadhim', role: 'Inbound', email: 'ruqaya.nadhum@zaincash.iq' },
                { id: 'ZC739', name: 'Ahmed Khalil Fatah', role: 'Inbound', email: 'ahmed.fatah@zaincash.iq' },
                { id: 'ZC737', name: 'Dheyaa Mohammed Khudhair', role: 'Inbound', email: 'dhyaa.mohammed@zaincash.iq' },
                { id: 'ZC639', name: 'Mustafa Abdulsahib Najim', role: 'Inbound', email: 'mustafa.abdulsahib@zaincash.iq' },
                { id: 'ZC500', name: 'Omar Fadhil Sleman', role: 'Inbound', email: 'omar.fadhil@zaincash.iq' },
                { id: 'ZC291', name: 'Ali Mohammed Ameen', role: 'Inbound', email: 'ali.ameen@zaincash.iq' },
                { id: 'ZC672', name: 'Mustafa Ahmed Khadir', role: 'Inbound', email: 'mustafa.ahmed@zaincash.iq' },
                { id: 'ZC627', name: 'Abdullah Loay', role: 'Inbound', email: 'abdullah.loay@zaincash.iq' },
                { id: 'ZC735', name: 'MOHAMMED RAGHEED HAMID', role: 'Inbound', email: 'mohammed.raghed@zaincash.iq' },
                { id: 'ZC743', name: 'Ali Shakir Eand', role: 'Inbound', email: 'ali.shakir@zaincash.iq' },
                { id: 'ZC311', name: 'Ahmed AbdulRazaq Hameed', role: 'Inbound', email: 'ahmed.abdulrazaq@zaincash.iq' },
                { id: 'ZC703', name: 'Houthaifa Waleed Razuki', role: 'Inbound', email: 'houthaifa.waleed@zaincash.iq' },
                { id: 'ZC657', name: 'Maytham Ali Mohammed', role: 'Inbound', email: 'maytham.ali@zaincash.iq' },
                { id: 'ZC738', name: 'Hazem Emad Hamdi', role: 'Inbound', email: 'hazem.emad@zaincash.iq' },
                { id: 'ZC655', name: 'Muhammad Zaman', role: 'Inbound', email: 'mohammed.zaman@zaincash.iq' },
                { id: 'ZC683', name: 'Ali Ryadh Hadi', role: 'Inbound', email: 'ali.riyadh@zaincash.iq' },
                { id: 'ZC681', name: 'Alaa Hussein Ali', role: 'Inbound', email: 'alaa.hussein@zaincash.iq' },
                { id: 'ZC740', name: 'Ali Wisam Abdulsattar', role: 'Inbound', email: 'ali.wisam@zaincash.iq' },
                { id: 'ZC332', name: 'Monier Yasir Monier', role: 'Inbound', email: 'monier.yasir@zaincash.iq' },
                { id: 'ZC579', name: 'Ahmed Haitham Kadhim', role: 'Inbound', email: 'ahmad.haitham@zaincash.iq' },
                { id: 'ZC416', name: 'Nooralhuda Ali Hamza', role: 'Inbound', email: 'nooralhuda.ali@zaincash.iq' },
                { id: 'ZC676', name: 'Hamza Dhiaa Mubder', role: 'Inbound', email: 'hamza.dhiaa@zaincash.iq' },
                { id: 'ZC741', name: 'Montzer Muneer Taha', role: 'Inbound', email: 'montadhar.monier@zaincash.iq' },
                { id: 'ZC501', name: 'Hussein Mohammed Ibrahim', role: 'Inbound', email: 'hussein.mohammed@zaincash.iq' },
                { id: 'ZC578', name: 'Maryam Thaer Talib', role: 'Inbound', email: 'maryam.thaer@zaincash.iq' },
                { id: 'ZC577', name: 'Hasan Ammar sabir', role: 'Inbound', email: 'hasan.ammar@zaincash.iq' },
                { id: 'ZC194', name: 'Haneen Ahmed Zaki', role: 'Inbound', email: 'haneen.ahmed@zaincash.iq' },
                { id: 'ZC673', name: 'Forqan Zuhaer Mohamed', role: 'Inbound', email: 'forqan.zuhaer@zaincash.iq' },
                { id: 'ZC706', name: 'Mustafa laith sophi', role: 'Inbound', email: 'mustafa.laith@zaincash.iq' },
                { id: 'ZC532', name: 'Maryam Tariq Jassam', role: 'Inbound', email: 'maryam.tariq@zaincash.iq' },
                { id: 'ZC744', name: 'Abdullah Faris Barghash', role: 'Inbound', email: 'abdullah.faris@zaincash.iq' },
                { id: 'ZC489', name: 'Sarah Ahmed Abd', role: 'Inbound', email: 'sarah.ahmed@zaincash.iq' },
                { id: 'ZC485', name: 'Ahmed Saad Abdulhadi', role: 'Inbound', email: 'ahmad.saad@zaincash.iq' },
                { id: 'ZC366', name: 'Sajjad Mahdi', role: 'Inbound', email: 'sajad.mahdi@zaincash.iq' },
                { id: 'ZC434', name: 'Aya Ali Hussien', role: 'Inbound', email: 'aya.ali@zaincash.iq' },
                { id: 'ZC224', name: 'Ali Sabeh Jassim', role: 'Inbound', email: 'ali.sabeeh@zaincash.iq' },
                { id: 'ZC473', name: 'Zainab Saad faeq', role: 'Inbound', email: 'zainab.saad@zaincash.iq' },
                { id: 'ZC742', name: 'Rahma Dored Jumaa', role: 'Inbound', email: 'rahma.duraid@zaincash.iq' },
                { id: 'ZC625', name: 'Ahmed Mohammed Khalil', role: 'Inbound', email: 'ahmed.khalil@zaincash.iq' },
                { id: 'ZC609', name: 'Ali Mohammed Sallal', role: 'Inbound', email: 'ali.mohammed@zaincash.iq' },
                { id: 'ZC363', name: 'Mohammed Asaad', role: 'Inbound', email: 'mohammed.asaad@zaincash.iq' },
                { id: 'ZC582', name: 'Maryam Ahmed Younis', role: 'Inbound', email: 'maryam.younis@zaincash.iq' },
                { id: 'ZC471', name: 'Dalia Salah Tayah', role: 'Inbound', email: 'dalia.salah@zaincash.iq' },
                { id: 'ZC480', name: 'Abdullah Abdulrahman Wahib', role: 'Inbound', email: 'abdullah.abdalrhman@zaincash.iq' },
                { id: 'ZC702', name: 'Abdullah Majid Hameed.', role: 'Inbound', email: 'abdullah.majid@zaincash.iq' },
                { id: 'ZC646', name: 'Yassir Khalil Qahtan', role: 'Inbound', email: 'yassir.khalil@zaincash.iq' },
                { id: 'ZC315', name: 'Mustafa Muwafaq Mohammedali', role: 'Inbound', email: 'mustafa.muwafaq@zaincash.iq' },
                { id: 'ZC576', name: 'Zaid Ahmed abbas', role: 'Inbound', email: 'zaid.ahmed@zaincash.iq' },
                { id: 'ZC755', name: 'Ibrahim Khalil Samir', role: 'Inbound', email: 'ibrahim.khalil@zaincash.iq' },
                { id: 'ZC565', name: 'Mohammed Waleed Mohammed', role: 'Inbound', email: 'mohammed.waleed@zaincash.iq' },
                { id: 'ZC734', name: 'Ali Abbas Rahman', role: 'Inbound', email: 'ali.abbas@zaincash.iq' },
                { id: 'ZC643', name: 'Mohammedalbaqir Haider Hussein', role: 'Inbound', email: 'mohammed.albaqer@zaincash.iq' },
                { id: 'ZC758', name: 'Nabaa Ali Mohhamed', role: 'Inbound', email: 'nabaa.ali@zaincash.iq' },
                { id: 'ZC470', name: 'Yaqeen Abdulkhdhur Hasan', role: 'Inbound', email: 'yakeen.abdulkhudhur@zaincash.iq' },
                { id: 'ZC482', name: 'Zainab Haider Jaffar', role: 'Inbound', email: 'zainab.haider@zaincash.iq' },
                { id: 'ZC272', name: 'Hasan Reyad Jabbar', role: 'Inbound', email: 'hassan.reyad@zaincash.iq' },
                { id: 'ZC757', name: 'Amna Dheyaa Hasan', role: 'Inbound', email: 'amna.dheyaa@zaincash.iq' },
                { id: 'ZC745', name: 'Abdul Razaq Haitham Mohsen', role: 'Inbound', email: 'abdulrazaq.haitham@zaincash.iq' },
                { id: 'ZC481', name: 'Yusor Raied Ismail', role: 'Inbound', email: 'yusor.raed@zaincash.iq' },
                { id: 'ZC699', name: 'Ameen saad nasef', role: 'Inbound', email: 'ameen.saad@zaincash.iq' }
            ]);
        }
        if (endpoint === '/api/smtp') {
            if (method === 'GET') {
                const storedSmtp = localStorage.getItem('offline_smtp_settings');
                return Promise.resolve(storedSmtp ? JSON.parse(storedSmtp) : {
                    server: "",
                    port: 587,
                    enableSsl: true,
                    username: "",
                    password: ""
                });
            }
            if (method === 'POST') {
                localStorage.setItem('offline_smtp_settings', JSON.stringify(data));
                return Promise.resolve({ success: true });
            }
        }
        if (endpoint === '/api/users/update-email' && method === 'POST') {
            const { id, email } = data;
            const user = allUsers.find(u => u.id === id);
            if (user) user.email = email;
            return Promise.resolve({ success: true });
        }
        if (endpoint === '/api/send-invite' && method === 'POST') {
            const { userId, email } = data;
            const user = allUsers.find(u => u.id === userId);
            
            if (user) user.email = email;
            
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            const simulatedLink = `${cleanUrl}?login=${userId}`;
            
            const storedSmtp = localStorage.getItem('offline_smtp_settings');
            const smtp = storedSmtp ? JSON.parse(storedSmtp) : null;
            
            if (smtp && smtp.server && smtp.username) {
                return Promise.resolve({
                    success: true,
                    sent: false,
                    simulated: true,
                    link: simulatedLink,
                    error: "Running in offline mode (browser). Email simulation fallback."
                });
            } else {
                return Promise.resolve({
                    success: true,
                    sent: false,
                    simulated: true,
                    link: simulatedLink
                });
            }
        }
        return Promise.resolve(null);
    }

    // ==========================================
    // AMYO TAB SYSTEM NAVIGATION
    // ==========================================
    const tabButtons = document.querySelectorAll('.amy-nav-btn');
    const tabPanes = document.querySelectorAll('.amy-tab-pane');

    function switchTab(tabId) {
        if (currentUser && currentUser.role !== 'Admin') {
            if (isTestAssigned && !isAiTestAssigned && tabId !== 'tab-simulator') {
                showToast('⚠️ يرجى إكمال اختبار محاكي الدردشة أولاً!', 'error');
                return;
            }
            if (isAiTestAssigned && !isTestAssigned && tabId !== 'tab-ai-agent') {
                showToast('⚠️ يرجى إكمال اختبار الأيجنت الذكي أولاً!', 'error');
                return;
            }
            if (isTestAssigned && isAiTestAssigned && tabId !== 'tab-simulator' && tabId !== 'tab-ai-agent') {
                showToast('⚠️ يرجى إكمال الاختبارات النشطة أولاً!', 'error');
                return;
            }
        }

        // Deactivate all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Activate matching button
        const targetBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-amy-tab') === tabId);
        if (targetBtn) {
            targetBtn.classList.remove('hidden'); // make sure it's visible
            targetBtn.classList.add('active');
        }

        // Activate matching pane
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Tab-specific trigger logic
        if (tabId === 'tab-simulator') {
            initSimulator();
        } else if (tabId === 'tab-admin') {
            openAdminPanel();
        } else if (tabId === 'tab-ai-agent') {
            if (typeof window.onAITabActivated === 'function') {
                window.onAITabActivated();
            }
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-amy-tab');
            switchTab(tabId);
        });
    });


    // ==========================================
    // PRESENTATION SLIDES CONTROLLER (TAB 1)
    // ==========================================
    let currentSlide = 1;
    let totalSlides = 6;
    let slidesData = [];

    let slides = [];
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    const currentSlideNumSpan = document.getElementById('current-slide-num');
    const totalSlidesNumSpan = document.getElementById('total-slides-num');
    const progressBarFill = document.getElementById('progress-bar-fill');

    async function loadSlidesData() {
        try {
            const serverSlides = await apiCall('/api/slides', 'GET');
            if (serverSlides && serverSlides.length > 0) {
                slidesData = serverSlides;
            } else {
                slidesData = [...DEFAULT_SLIDES_DATA];
            }
        } catch (e) {
            console.warn("Failed to fetch slides from server, checking localStorage...", e);
            const stored = localStorage.getItem('zain_cash_slides');
            if (stored) {
                try {
                    slidesData = JSON.parse(stored);
                } catch (err) {
                    slidesData = [...DEFAULT_SLIDES_DATA];
                }
            } else {
                slidesData = [...DEFAULT_SLIDES_DATA];
            }
        }
        totalSlides = slidesData.length;
        if (totalSlidesNumSpan) {
            totalSlidesNumSpan.textContent = totalSlides;
        }
        renderDynamicSlides();
    }

    function renderDynamicSlides() {
        const container = document.getElementById('dynamic-slides-container');
        if (!container) return;

        container.innerHTML = '';
        slidesData.forEach(slide => {
            const sec = document.createElement('section');
            sec.className = `slide ${slide.id === currentSlide ? 'active' : ''}`;
            sec.id = `slide-${slide.id}`;
            sec.dataset.slideIndex = slide.id;

            let html = '';
            if (slide.type === 'welcome') {
                html = `
                    <div class="slide-content welcome-slide">
                        <div class="icon-glow-wrapper warning-glow">
                            <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
                        </div>
                        <h1 class="welcome-title text-gradient">${slide.title}</h1>
                        <p class="welcome-desc">${slide.subtitle}</p>
                        <div class="warning-box">
                            <div class="warning-title">
                                <i class="fa-solid fa-circle-exclamation"></i> ${slide.warningTitle || "Strict Zain Cash Policy:"}
                            </div>
                            <p>${slide.content}</p>
                        </div>
                        <button class="btn btn-primary start-training-btn">
                            <span>Start Training Path</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                `;
            } else if (slide.type === 'comparison') {
                html = `
                    <div class="slide-content">
                        <div class="slide-header">
                            <span class="rule-badge">${slide.badge}</span>
                            <h2 class="slide-title">${slide.title}</h2>
                        </div>
                        <p class="slide-subtitle">${slide.subtitle}</p>
                        <div class="comparison-container">
                            <div class="comparison-card card-wrong">
                                <div class="card-status status-wrong">
                                    <i class="fa-solid fa-xmark-circle"></i> ${slide.wrongTitle || 'Unaccepted'}
                                </div>
                                ${(slide.wrongExamples || []).map(ex => `
                                    <div class="example-bubble">
                                        <p class="bubble-desc">${ex.label || ''}</p>
                                        <p class="bubble-text">${ex.text || ''}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="comparison-card card-right">
                                <div class="card-status status-right">
                                    <i class="fa-solid fa-check-circle"></i> ${slide.rightTitle || 'Accepted'}
                                </div>
                                ${(slide.rightExamples || []).map(ex => `
                                    <div class="example-bubble">
                                        <p class="bubble-desc">${ex.label || ''}</p>
                                        <p class="bubble-text">${ex.text || ''}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="pro-tip-box" style="margin-top: 15px;">
                            <i class="fa-solid fa-lightbulb"></i>
                            <span>${slide.tip || ''}</span>
                        </div>
                    </div>
                `;
            } else if (slide.type === 'comparison_context') {
                html = `
                    <div class="slide-content">
                        <div class="slide-header">
                            <span class="rule-badge">${slide.badge}</span>
                            <h2 class="slide-title">${slide.title}</h2>
                        </div>
                        <p class="slide-subtitle">${slide.subtitle}</p>
                        <div class="comparison-container">
                            <div class="comparison-card card-wrong">
                                <div class="card-status status-wrong">
                                    <i class="fa-solid fa-xmark-circle"></i> ${slide.wrongTitle || 'Unaccepted'}
                                </div>
                                <div class="example-context">${slide.context || ''}</div>
                                <div class="example-bubble">
                                    <p class="bubble-text">${slide.wrongText || ''}</p>
                                </div>
                                <p class="critique-text">${slide.wrongCritique || ''}</p>
                            </div>
                            <div class="comparison-card card-right">
                                <div class="card-status status-right">
                                    <i class="fa-solid fa-check-circle"></i> ${slide.rightTitle || 'Accepted'}
                                </div>
                                <div class="example-context">${slide.context || ''}</div>
                                <div class="example-bubble">
                                    <p class="bubble-text">${slide.rightText || ''}</p>
                                </div>
                                <p class="critique-text">${slide.rightCritique || ''}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else if (slide.type === 'steps') {
                html = `
                    <div class="slide-content">
                        <div class="slide-header">
                            <span class="rule-badge">${slide.badge}</span>
                            <h2 class="slide-title">${slide.title}</h2>
                        </div>
                        <p class="slide-subtitle">${slide.subtitle}</p>
                        <div class="split-rules-grid">
                            ${(slide.steps || []).map(st => `
                                <div class="interactive-step-card">
                                    <div class="step-num">${st.num}</div>
                                    <h4>${st.title || ''}</h4>
                                    <p>${st.desc || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="comparison-container mini-margin">
                            <div class="comparison-card card-right full-width">
                                <div class="card-status status-right">
                                    <i class="fa-solid fa-circle-check"></i> ${slide.rightTitle || 'Example'}
                                </div>
                                <div class="example-context">${slide.context || ''}</div>
                                <div class="example-bubble">
                                    <p class="bubble-text">${slide.rightText || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (slide.type === 'table') {
                html = `
                    <div class="slide-content">
                        <div class="slide-header">
                            <span class="rule-badge text-glow-rainbow">${slide.badge}</span>
                            <h2 class="slide-title">${slide.title}</h2>
                        </div>
                        <p class="slide-subtitle">${slide.subtitle}</p>
                        <div class="comparison-table-wrapper">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        ${(slide.headers || []).map((h, i) => `
                                            <th class="${i===1 ? 'table-bot-header' : i===2 ? 'table-human-header' : ''}">${h}</th>
                                        `).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(slide.rows || []).map(row => `
                                        <tr>
                                            <td><strong>${row[0]}</strong></td>
                                            <td>${row[1]}</td>
                                            <td class="cell-highlight">${row[2]}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="next-step-prompt" style="text-align: center; margin-top:20px;">
                            <p>Are you ready to test your skills? We have prepared an interactive multitask simulator to evaluate your compliance with these strict guidelines.</p>
                            <button class="btn btn-rainbow start-sim-btn" style="margin-top: 10px;">
                                <i class="fa-solid fa-gamepad"></i>
                                <span>Enter Chat Simulator</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            sec.innerHTML = html;
            container.appendChild(sec);
        });

        // Re-select slides node list
        slides = document.querySelectorAll('.slide');

        // Re-attach slides inner buttons event listeners
        const startTrainingBtn = document.querySelector('.start-training-btn');
        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', () => {
                currentSlide = 2;
                updateSlide();
            });
        }

        const startSimBtn = document.querySelector('.start-sim-btn');
        if (startSimBtn) {
            startSimBtn.addEventListener('click', () => {
                const navBtnSim = document.getElementById('nav-btn-simulator');
                if (navBtnSim) navBtnSim.style.display = ''; // Reveal simulator tab
                switchTab('tab-simulator');
            });
        }

        updateSlide();
    }

    function updateSlide() {
        slides.forEach(slide => {
            const index = parseInt(slide.getAttribute('data-slide-index'));
            if (index === currentSlide) {
                slide.classList.add('active');
                slide.classList.remove('prev-slide-out');
            } else if (index < currentSlide) {
                slide.classList.remove('active');
                slide.classList.add('prev-slide-out');
            } else {
                slide.classList.remove('active');
                slide.classList.remove('prev-slide-out');
            }
        });

        if (prevBtn) prevBtn.disabled = currentSlide === 1;
        
        if (nextBtn) {
            if (currentSlide === totalSlides) {
                nextBtn.style.visibility = 'hidden';
            } else {
                nextBtn.style.visibility = 'visible';
                nextBtn.disabled = false;
            }
        }

        if (currentSlideNumSpan) currentSlideNumSpan.textContent = currentSlide;
        if (progressBarFill) {
            const percentage = (currentSlide / totalSlides) * 100;
            progressBarFill.style.width = `${percentage}%`;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlide();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlide();
            }
        });
    }

    // Support keyboard arrows navigation inside slides
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') {
            return;
        }
        const slidesTab = document.getElementById('tab-slides');
        if (!slidesTab || !slidesTab.classList.contains('active')) {
            return;
        }
        
        if (e.key === 'ArrowLeft') {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlide();
            }
        } else if (e.key === 'ArrowRight') {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlide();
            }
        }
    });


    // ==========================================
    // CHAT SIMULATOR ENGINE (TAB 2)
    // ==========================================
    let scenarios = [];
    async function loadScenariosFromStorage() {
        try {
            const serverScenarios = await apiCall('/api/scenarios', 'GET');
            if (serverScenarios && serverScenarios.length > 0) {
                scenarios = serverScenarios;
            } else {
                scenarios = [...SCENARIOS_DATA];
            }
        } catch (e) {
            console.warn("Failed to fetch scenarios from server, checking localStorage...", e);
            const stored = localStorage.getItem('zain_cash_scenarios');
            if (stored) {
                try {
                    scenarios = JSON.parse(stored);
                } catch (err) {
                    scenarios = [...SCENARIOS_DATA];
                }
            } else {
                scenarios = [...SCENARIOS_DATA];
            }
        }
        
        // Reload simulator if active
        const simPane = document.getElementById('tab-simulator');
        if (simPane && simPane.classList.contains('active') && simulatorInitialized) {
            loadScenario();
        }
    }

    // Multitask Simulator Engine
    let multiChatAgent = null;
    let simulatorInitialized = false;
    let disposedChats = { 1: false, 2: false, 3: false };

    // Toast helper for app.js
    function showToast(message, type = 'success') {
        const existing = document.getElementById('app-toast-popup');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'app-toast-popup';
        toast.className = `ai-toast-popup ai-toast-${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('visible'));
        });

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
        }, 3000);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    }

    function generateChatColumnHtml(chat, i) {
        let iconHtml = '<i class="fa-brands fa-whatsapp whatsapp-icon" style="color: #25d366;"></i>';
        let channelName = 'WhatsApp Chat';
        let channelBadge = `phone${i}`;

        if (chat.customerName.includes('علي') || chat.id === 2) {
            iconHtml = '<i class="fa-brands fa-instagram instagram-icon" style="color: #e1306c;"></i>';
            channelName = 'Instagram DM';
            channelBadge = 'instagram';
        } else if (chat.id === 3) {
            iconHtml = '<i class="fa-brands fa-instagram instagram-icon" style="color: #e1306c;"></i>';
            channelName = 'Instagram Post';
            channelBadge = 'instagrampost';
        }

        const initialMsg = chat.history && chat.history[1] ? chat.history[1].parts[0].text : 'مرحباً';

        return `
        <div class="chat-column">
            <div class="column-meta-info">
                <span class="meta-channel">${channelBadge}</span>
                <span class="meta-detail">${channelName}</span>
            </div>
            <div class="floating-chat-window static-window">
                <div class="chat-header">
                    <div class="chat-header-left">
                        ${iconHtml}
                        <span class="chat-customer-name">${escapeHtml(chat.customerName)}</span>
                        <span class="status-dot online"></span>
                    </div>
                    <div class="chat-header-right">
                        <i class="fa-solid fa-arrow-right-left" id="chat-back-${i}" style="cursor:pointer;" title="Back to Chat"></i>
                        <i class="fa-solid fa-user" id="chat-profile-${i}" style="cursor:pointer;" title="Customer Profile"></i>
                        <i class="fa-solid fa-xmark" id="chat-close-${i}" style="cursor:pointer;" title="Close & Dispose"></i>
                    </div>
                </div>
                <div class="chat-body" id="chat-body-${i}">
                    <div class="system-message">
                        <span>[Session started via ${channelName}]</span>
                    </div>
                    <div class="message message-customer">
                        <p>${escapeHtml(initialMsg)}</p>
                        <span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
                <div class="typing-indicator-wrapper hidden" id="typing-indicator-${i}">
                    <div class="typing-bubble">
                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    </div>
                </div>
                <div class="chat-footer-mock live-footer">
                    <i class="fa-solid fa-paperclip"></i>
                    <textarea class="live-chat-input" id="chat-input-${i}" placeholder="Type your reply here... (Enter to Send)"></textarea>
                    <i class="fa-regular fa-smile chat-smiley-btn" id="chat-smiley-${i}" style="cursor:pointer;" title="Insert Emoji"></i>
                    <button class="btn-send-mock live-send-btn" id="chat-send-${i}">Send</button>
                </div>

                <!-- Emoji Picker Panel -->
                <div class="emoji-picker hidden" id="emoji-picker-${i}">
                    <span class="emoji-item">😊</span>
                    <span class="emoji-item">😂</span>
                    <span class="emoji-item">👍</span>
                    <span class="emoji-item">🌹</span>
                    <span class="emoji-item">🙏</span>
                    <span class="emoji-item">❤️</span>
                    <span class="emoji-item">👋</span>
                    <span class="emoji-item">✨</span>
                    <span class="emoji-item">🔥</span>
                    <span class="emoji-item">🙌</span>
                </div>

                <!-- Customer Profile Panel -->
                <div class="profile-panel hidden" id="profile-panel-${i}">
                    <div class="profile-form">
                        <div class="profile-field">
                            <label>Name</label>
                            <div class="profile-value">
                                ${iconHtml}
                                <span>${escapeHtml(chat.customerName)}</span>
                            </div>
                        </div>
                        <div class="profile-field">
                            <label>Email</label>
                            <div class="profile-value">-</div>
                        </div>
                        <div class="profile-field">
                            <label>Phone</label>
                            <div class="profile-value">9647700000${i}</div>
                        </div>
                        <div class="profile-actions">
                            <button type="button" class="btn-create-new"><i class="fa-solid fa-plus"></i> Create New</button>
                        </div>
                    </div>
                </div>

                <!-- Disposition Panel -->
                <div class="disposition-panel hidden" id="disposition-panel-${i}">
                    <div class="disposition-form">
                        <div class="form-group">
                            <label>Disposition</label>
                            <select class="disposition-select" id="disp-select-${i}">
                                <option value="">Select a Disposition</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Sub Disposition</label>
                            <select class="sub-disposition-select" id="sub-disp-select-${i}">
                                <option value="">Select a Sub Disposition</option>
                            </select>
                        </div>
                        <div class="quick-dispositions-grid">
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="MC/Visa Issue" data-sub="Top-up or Transfer Issue">Refund Delay</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="MC/Visa Issue" data-sub="Reset PIN request">Reset PIN request</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="MC/Visa Inquiry" data-sub="MC/Visa Inquiry">Card Inquiry</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="Other" data-sub="Junk call">Junk call</button>
                        </div>
                        <div class="ticket-status-row">
                            <span class="section-title">Ticket</span>
                            <div class="ticket-pills">
                                <span class="ticket-pill active"><i class="fa-solid fa-check"></i> New Ticket</span>
                            </div>
                            <button type="button" class="btn-link-tickets" disabled>Link with Existing Tickets</button>
                        </div>
                        <button type="button" class="btn-save-dispose" id="btn-save-dispose-${i}" disabled>Save and Dispose</button>
                    </div>
                </div>

                <!-- Disposed Overlay -->
                <div class="disposed-overlay hidden" id="disposed-overlay-${i}">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>Ticket Disposed & Closed</h3>
                    <p>This conversation has been classified and resolved.</p>
                </div>
            </div>
        </div>
        `;
    }

    async function initSimulator() {
        if (simulatorInitialized) return;

        let scenarios = null;
        try {
            scenarios = await apiCall('/api/scenarios', 'GET');
        } catch (e) {
            console.error("Failed to load scenarios, falling back to defaults", e);
        }

        multiChatAgent = new window.MultiChatAgent(scenarios);
        multiChatAgent.loadSettings();

        disposedChats = {};
        
        const grid = document.getElementById('multitask-chat-grid');
        if (grid) {
            grid.innerHTML = '';
            multiChatAgent.chats.forEach(chat => {
                const i = chat.id;
                disposedChats[i] = false;
                
                const colHtml = generateChatColumnHtml(chat, i);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = colHtml.trim();
                const colEl = tempDiv.firstChild;
                grid.appendChild(colEl);
            });
        }

        const chatWindows = document.querySelectorAll('.multitask-chat-grid .floating-chat-window');
        chatWindows.forEach(win => {
            win.addEventListener('click', () => {
                chatWindows.forEach(w => w.classList.remove('active-window'));
                win.classList.add('active-window');
            });
        });
        if (chatWindows[0]) chatWindows[0].classList.add('active-window');

        const numChats = multiChatAgent.chats.length;

        for (let i = 1; i <= numChats; i++) {
            const inputEl = document.getElementById(`chat-input-${i}`);
            const sendBtn = document.getElementById(`chat-send-${i}`);

            if (inputEl) {
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSimulatorSendMessage(i);
                    }
                });
            }

            if (sendBtn) {
                sendBtn.addEventListener('click', () => {
                    handleSimulatorSendMessage(i);
                });
            }
        }

        const DISPOSITION_DATA = {
            "WU Inquiry": ["WU Inquiry"],
            "WU Issue": ["Send Money Issue", "Receive Money Issue", "Hold Transaction Issue", "Missing MTCN Issue", "Other Issues"],
            "MC/Visa Inquiry": ["MC/Visa Inquiry"],
            "MC/Visa Issue": ["Activation Issue", "Top-up or Transfer Issue", "PoS Payment Issue", "Cashout at ATM Issue", "eCommerce Issue", "Delivery or Order Issue", "Negative Balance Issue", "Change name Request", "Refund expired card issue", "Cash Back Issue", "Card SOA", "Reset PIN request", "Other", "Passport Issue"],
            "Wallet/Registration Inquiry": ["Wallet/Registration Inquiry"],
            "Wallet/App Issue": ["App Issue", "Registration Issue", "Login Issue", "No agents in my area Issue", "Agent's extra charges issues", "Agent's bad treatement/No e-money", "Trx Issue", "Customer mistake in trx", "Locked/Duplicated Wallets Issue", "Change MSISDN", "FinCrime Issue", "Wallet SOA", "Other issues"],
            "Digital Goods Issue": ["Purchaes issue", "Resend PIN issue", "Redeem Issue", "Other Issues"],
            "Bank Transfer Issue": ["Linking Issue", "Top-up Issue", "Cash back issue", "Other Issues"],
            "Cash-in by VISA/MC Issue": ["Cash-in/Card no working", "Deduction issue", "Other Issues"],
            "Merchant/Business Inquiry": ["Merchant/Business Inquiry"],
            "Merchant/Business Issue": ["Delay \\ Request status", "Deduction or missing trx", "Other Issues"],
            "Agent's Inquiry": ["Agent's Inquiry"],
            "Agent's Issue": ["Registration Issue/Delay", "Buying e-money Issue", "Trx Issue", "Commission Issue", "Locked agent's wallet", "App issue", "Fraud issue", "Other Issues"],
            "Other": ["Disconnect call", "Junk call", "Suggestion"],
            "Reset/Change PIN request": ["Reset/Change PIN request"]
        };

        for (let i = 1; i <= numChats; i++) {
            const closeBtn = document.getElementById(`chat-close-${i}`);
            const backBtn = document.getElementById(`chat-back-${i}`);
            const profileBtn = document.getElementById(`chat-profile-${i}`);
            const dispPanel = document.getElementById(`disposition-panel-${i}`);
            const profPanel = document.getElementById(`profile-panel-${i}`);
            const selectDisp = document.getElementById(`disp-select-${i}`);
            const selectSub = document.getElementById(`sub-disp-select-${i}`);
            const saveBtn = document.getElementById(`btn-save-dispose-${i}`);

            if (selectDisp) {
                selectDisp.innerHTML = '<option value="">Select a Disposition</option>';
                Object.keys(DISPOSITION_DATA).forEach(disp => {
                    const opt = document.createElement('option');
                    opt.value = disp;
                    opt.textContent = disp;
                    selectDisp.appendChild(opt);
                });
            }

            const populateSubDispositions = (dispVal) => {
                if (!selectSub) return;
                selectSub.innerHTML = '<option value="">Select a Sub Disposition</option>';
                if (dispVal && DISPOSITION_DATA[dispVal]) {
                    DISPOSITION_DATA[dispVal].forEach(sub => {
                        const opt = document.createElement('option');
                        opt.value = sub;
                        opt.textContent = sub;
                        selectSub.appendChild(opt);
                    });
                }
            };

            if (closeBtn && dispPanel) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (disposedChats[i]) return;
                    dispPanel.classList.toggle('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                });
            }

            if (profileBtn && profPanel) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profPanel.classList.toggle('hidden');
                    if (dispPanel) dispPanel.classList.add('hidden');
                });
            }

            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (dispPanel) dispPanel.classList.add('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                });
            }

            const checkFormValidity = () => {
                if (selectDisp && selectSub && selectDisp.value && selectSub.value) {
                    saveBtn.disabled = false;
                    saveBtn.classList.add('active');
                } else {
                    saveBtn.disabled = true;
                    saveBtn.classList.remove('active');
                }
            };

            if (selectDisp) {
                selectDisp.addEventListener('change', () => {
                    populateSubDispositions(selectDisp.value);
                    checkFormValidity();
                });
            }
            if (selectSub) {
                selectSub.addEventListener('change', checkFormValidity);
            }

            const quickButtons = document.querySelectorAll(`.quick-disp-btn[data-chat="${i}"]`);
            quickButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const dispVal = btn.getAttribute('data-disp');
                    const subVal = btn.getAttribute('data-sub');

                    if (selectDisp) {
                        selectDisp.value = dispVal;
                        populateSubDispositions(dispVal);
                    }
                    if (selectSub) selectSub.value = subVal;

                    quickButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    checkFormValidity();
                });
            });

            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    if (selectDisp.value && selectSub.value) {
                        disposedChats[i] = true;
                        dispPanel.classList.add('hidden');
                        
                        const disposedOverlay = document.getElementById(`disposed-overlay-${i}`);
                        if (disposedOverlay) {
                            disposedOverlay.classList.remove('hidden');
                        }
                        showToast(`Chat ${i} disposed successfully.`, 'success');
                    }
                });
            }

            const smileyBtn = document.getElementById(`chat-smiley-${i}`);
            const picker = document.getElementById(`emoji-picker-${i}`);
            const inputEl = document.getElementById(`chat-input-${i}`);

            if (smileyBtn && picker && inputEl) {
                smileyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    for (let j = 1; j <= numChats; j++) {
                        const otherPicker = document.getElementById(`emoji-picker-${j}`);
                        if (otherPicker) {
                            if (j === i) {
                                otherPicker.classList.toggle('hidden');
                            } else {
                                otherPicker.classList.add('hidden');
                            }
                        }
                    }
                });

                picker.querySelectorAll('.emoji-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const startPos = inputEl.selectionStart;
                        const endPos = inputEl.selectionEnd;
                        const text = inputEl.value;
                        const emoji = item.textContent;
                        inputEl.value = text.substring(0, startPos) + emoji + text.substring(endPos);
                        
                        const newPos = startPos + emoji.length;
                        inputEl.setSelectionRange(newPos, newPos);
                        inputEl.focus();

                        picker.classList.add('hidden');
                    });
                });
            }
        }

        document.addEventListener('click', () => {
            for (let j = 1; j <= numChats; j++) {
                const picker = document.getElementById(`emoji-picker-${j}`);
                if (picker) picker.classList.add('hidden');
            }
        });

        const submitBtn = document.getElementById('btn-submit-session');
        if (submitBtn) {
            const newBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newBtn, submitBtn);
            newBtn.addEventListener('click', handleEvaluateSimulator);
            newBtn.disabled = false;
        }

        const restartTrainingBtnFinal = document.querySelector('.restart-training-btn-final');
        if (restartTrainingBtnFinal) {
            restartTrainingBtnFinal.addEventListener('click', () => {
                const resultsOverlay = document.getElementById('results-overlay');
                if (resultsOverlay) resultsOverlay.classList.add('hidden');

                if (multiChatAgent) {
                    multiChatAgent.resetChats();
                }
                simulatorInitialized = false;
                initSimulator();

                currentSlide = 1;
                updateSlide();
                switchTab('tab-slides');
            });
        }

        simulatorInitialized = true;
    }

    async function handleSimulatorSendMessage(chatId) {
        // If disposed, block sending message
        if (disposedChats[chatId]) {
            showToast("This chat is resolved and disposed.", "error");
            return;
        }

        const inputEl = document.getElementById(`chat-input-${chatId}`);
        const chatBody = document.getElementById(`chat-body-${chatId}`);
        const typingIndicator = document.getElementById(`typing-indicator-${chatId}`);

        if (!inputEl || !chatBody) return;

        const text = inputEl.value.trim();
        if (!text) return;

        inputEl.value = '';
        inputEl.disabled = true;

        const empMsgEl = document.createElement('div');
        empMsgEl.className = 'message message-employee';
        empMsgEl.innerHTML = `<p>${escapeHtml(text)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
        chatBody.appendChild(empMsgEl);
        chatBody.scrollTop = chatBody.scrollHeight;

        if (typingIndicator) typingIndicator.classList.remove('hidden');
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const reply = await multiChatAgent.sendMessage(chatId, text);

            if (typingIndicator) typingIndicator.classList.add('hidden');

            const custMsgEl = document.createElement('div');
            custMsgEl.className = 'message message-customer';
            custMsgEl.innerHTML = `<p>${escapeHtml(reply)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
            chatBody.appendChild(custMsgEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        } catch (err) {
            if (typingIndicator) typingIndicator.classList.add('hidden');
            const errMsgEl = document.createElement('div');
            errMsgEl.className = 'system-message';
            errMsgEl.innerHTML = `<span style="color: var(--error);">Error: ${escapeHtml(err.message)}</span>`;
            chatBody.appendChild(errMsgEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        } finally {
            inputEl.disabled = false;
            inputEl.focus();
        }
    }

    async function handleEvaluateSimulator() {
        // Validate all 3 chats are disposed
        if (!disposedChats[1] || !disposedChats[2] || !disposedChats[3]) {
            showToast('Please resolve and dispose all 3 customer tickets before submitting!', 'error');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-session');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Evaluating...';
        }

        showToast('Connecting to evaluator coach...', 'info');

        try {
            const evaluation = await multiChatAgent.evaluateSession();

            const resScore = document.getElementById('res-score');
            const resErrors = document.getElementById('res-errors');
            const resGrade = document.getElementById('res-grade');
            const resNotes = document.getElementById('res-notes-text');
            const resultsOverlay = document.getElementById('results-overlay');

            if (resScore) resScore.textContent = `${evaluation.overallScore}%`;
            if (resErrors) {
                let errors = 0;
                if (evaluation.score1 < 7) errors++;
                if (evaluation.score2 < 7) errors++;
                if (evaluation.score3 < 7) errors++;
                resErrors.textContent = errors;
            }
            if (resGrade) {
                resGrade.textContent = evaluation.grade;
                if (evaluation.overallScore >= 80) {
                    resGrade.className = 'res-val text-gradient';
                } else if (evaluation.overallScore >= 60) {
                    resGrade.className = 'res-val text-green';
                } else {
                    resGrade.className = 'res-val text-red';
                }
            }
            if (resNotes) {
                resNotes.innerHTML = evaluation.notes.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }

            if (currentUser) {
                const resultData = {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    score: evaluation.overallScore,
                    errorsCount: 0,
                    grade: evaluation.grade
                };
                try {
                    await apiCall('/api/results', 'POST', resultData);
                    
                    if (isTestAssigned) {
                        let assignments = await apiCall('/api/assignments', 'GET');
                        assignments = assignments.filter(id => id !== currentUser.id && id !== 'all');
                        await apiCall('/api/assignments', 'POST', assignments);
                        isTestAssigned = false;
                        window.isTestAssigned = false;
                        await checkTestAssignment();
                    }
                } catch (e) {
                    console.error("Failed to save results to server", e);
                }
            }

            if (resultsOverlay) {
                resultsOverlay.classList.remove('hidden');
            }

        } catch (err) {
            showToast('Evaluation failed: ' + err.message, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> Submit Session & Get Evaluation';
            }
        }
    }


    // ==========================================
    // ADMIN PANEL & SCENARIOS MANAGER (TAB 3)
    // ==========================================
    const adminScenariosListUl = document.getElementById('admin-scenarios-list-ul');
    const noScenarioSelected = document.getElementById('no-scenario-selected');
    const scenarioEditForm = document.getElementById('scenario-edit-form');
    const addNewScenarioBtn = document.getElementById('add-new-scenario-btn');
    const deleteScenarioBtn = document.getElementById('delete-scenario-btn');
    const editTurnSelect = document.getElementById('edit-scenario-turn-select');
    
    // Form fields
    const editScenarioId = document.getElementById('edit-scenario-id');
    const editCustomerName = document.getElementById('edit-customer-name');
    const editCustomerQuery = document.getElementById('edit-customer-query');
    
    let selectedScenarioIndex = null;
    let selectedTurnIndex = 0;

    function openAdminPanel() {
        populateDispositionDropdowns('edit-scenario-correct-disp', 'edit-scenario-correct-sub');
        populateDispositionDropdowns('edit-ai-correct-disp', 'edit-ai-correct-sub');

        loadScenariosFromStorage();
        renderAdminScenariosList();
        selectScenario(null);

        loadAiScenariosFromStorage().then(() => {
            renderAdminAiScenariosList();
            selectAiScenario(null);
        });

        renderAdminSlidesList();
        selectSlide(null);
    }

    function renderAdminScenariosList() {
        if (!adminScenariosListUl) return;
        adminScenariosListUl.innerHTML = '';
        scenarios.forEach((sc, idx) => {
            const li = document.createElement('li');
            if (idx === selectedScenarioIndex) {
                li.className = 'active';
            }
            const textPreview = (sc.turns && sc.turns[0]) ? sc.turns[0].customerText : "بدون جولات حوارية";
            li.innerHTML = `
                <span class="li-title" style="font-weight:700;">${sc.customerName || "بلا اسم"}</span>
                <span class="li-desc" style="font-size:0.75rem; color:#64748b;">${textPreview}</span>
            `;
            li.addEventListener('click', () => selectScenario(idx));
            adminScenariosListUl.appendChild(li);
        });
    }

    function selectScenario(idx) {
        selectedScenarioIndex = idx;
        selectedTurnIndex = 0;

        if (!adminScenariosListUl) return;
        const lis = adminScenariosListUl.querySelectorAll('li');
        lis.forEach((li, i) => {
            if (i === idx) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });

        if (idx === null) {
            if (noScenarioSelected) noScenarioSelected.classList.remove('hidden');
            if (scenarioEditForm) scenarioEditForm.classList.add('hidden');
            return;
        }

        if (noScenarioSelected) noScenarioSelected.classList.add('hidden');
        if (scenarioEditForm) scenarioEditForm.classList.remove('hidden');

        const sc = scenarios[idx];
        if (editScenarioId) editScenarioId.value = idx;
        if (editCustomerName) editCustomerName.value = sc.customerName || '';
        if (editTurnSelect) editTurnSelect.value = "0";

        // Populate new configuration settings fields
        const chSelect = document.getElementById('edit-scenario-channel');
        if (chSelect) chSelect.value = sc.channel || 'WhatsApp Chat';

        const dispSelect = document.getElementById('edit-scenario-correct-disp');
        const subSelect = document.getElementById('edit-scenario-correct-sub');
        if (dispSelect && subSelect) {
            dispSelect.value = sc.correctDisp || '';
            populateAdminSubDispositions(sc.correctDisp || '', subSelect);
            subSelect.value = sc.correctSubDisp || '';
        }

        loadScenarioTurn(idx, 0);
    }

    function loadScenarioTurn(scIdx, turnIdx) {
        const sc = scenarios[scIdx];
        if (!sc) return;

        if (!sc.turns) sc.turns = [];
        if (!sc.turns[turnIdx]) {
            sc.turns[turnIdx] = {
                step: turnIdx + 1,
                customerText: `رسالة الجولة ${turnIdx + 1}...`,
                options: [
                    { text: "الرد المقترح الأول", isCorrect: false, feedback: "تعليق..." },
                    { text: "الرد المقترح الثاني", isCorrect: true, feedback: "تعليق..." },
                    { text: "الرد المقترح الثالث", isCorrect: false, feedback: "تعليق..." }
                ]
            };
        }

        const turn = sc.turns[turnIdx];
        if (editCustomerQuery) editCustomerQuery.value = turn.customerText || '';

        // Load 3 Options
        for (let i = 0; i < 3; i++) {
            const opt = turn.options[i] || { text: '', isCorrect: (i === 1), feedback: '' };
            const textField = document.getElementById(`edit-opt-${i}-text`);
            const feedbackField = document.getElementById(`edit-opt-${i}-feedback`);
            const radioField = document.getElementById(`correct-opt-${i}`);

            if (textField) textField.value = opt.text || '';
            if (feedbackField) feedbackField.value = opt.feedback || '';
            if (radioField) {
                radioField.checked = !!opt.isCorrect;
            }
            updateOptionCardHighlight(i, !!opt.isCorrect);
        }
    }

    function saveTurnToMemory(scIdx, turnIdx) {
        const sc = scenarios[scIdx];
        if (!sc) return;

        if (!sc.turns) sc.turns = [];
        if (!sc.turns[turnIdx]) {
            sc.turns[turnIdx] = { step: turnIdx + 1, customerText: '', options: [] };
        }

        const turn = sc.turns[turnIdx];
        if (editCustomerQuery) {
            turn.customerText = editCustomerQuery.value;
        }

        let correctIdx = 1;
        for (let i = 0; i < 3; i++) {
            const radio = document.getElementById(`correct-opt-${i}`);
            if (radio && radio.checked) {
                correctIdx = i;
                break;
            }
        }

        turn.options = [];
        for (let i = 0; i < 3; i++) {
            const textField = document.getElementById(`edit-opt-${i}-text`);
            const feedbackField = document.getElementById(`edit-opt-${i}-feedback`);

            turn.options.push({
                text: textField ? textField.value : '',
                isCorrect: (i === correctIdx),
                feedback: feedbackField ? feedbackField.value : ''
            });
        }
    }

    if (editTurnSelect) {
        editTurnSelect.addEventListener('change', function() {
            if (selectedScenarioIndex === null) return;
            // Save current turn state first
            saveTurnToMemory(selectedScenarioIndex, selectedTurnIndex);
            // Switch to the new turn index
            selectedTurnIndex = parseInt(editTurnSelect.value);
            loadScenarioTurn(selectedScenarioIndex, selectedTurnIndex);
        });
    }

    function updateOptionCardHighlight(optIdx, isCorrect) {
        const card = document.querySelector(`.option-edit-card[data-option-index="${optIdx}"]`);
        if (card) {
            if (isCorrect) {
                card.classList.add('correct');
            } else {
                card.classList.remove('correct');
            }
        }
    }

    // Toggle radio correct actions
    for (let i = 0; i < 3; i++) {
        const radio = document.getElementById(`correct-opt-${i}`);
        if (radio) {
            radio.addEventListener('change', () => {
                for (let j = 0; j < 3; j++) {
                    updateOptionCardHighlight(j, j === i);
                }
            });
        }
    }

    // Add New Scenario
    if (addNewScenarioBtn) {
        addNewScenarioBtn.addEventListener('click', () => {
            const newSc = {
                id: scenarios.length + 1,
                customerName: "New Customer",
                channel: "WhatsApp Chat",
                correctDisp: "",
                correctSubDisp: "",
                turns: []
            };
            scenarios.push(newSc);
            saveScenariosToStorage();
            renderAdminScenariosList();
            selectScenario(scenarios.length - 1);
        });
    }

    // Delete Scenario
    if (deleteScenarioBtn) {
        deleteScenarioBtn.addEventListener('click', () => {
            if (selectedScenarioIndex === null) return;
            if (confirm("هل أنت متأكد من رغبتك في حذف هذا السيناريو بالكامل؟")) {
                scenarios.splice(selectedScenarioIndex, 1);
                scenarios.forEach((s, idx) => {
                    s.id = idx + 1;
                });
                saveScenariosToStorage();
                renderAdminScenariosList();
                selectScenario(null);
            }
        });
    }

    // Scenario Edit Form Submit
    if (scenarioEditForm) {
        scenarioEditForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (selectedScenarioIndex === null) return;

            const sc = scenarios[selectedScenarioIndex];
            if (editCustomerName) sc.customerName = editCustomerName.value;

            // Save new platform channel and correct dispositions
            const chSelect = document.getElementById('edit-scenario-channel');
            const dispSelect = document.getElementById('edit-scenario-correct-disp');
            const subSelect = document.getElementById('edit-scenario-correct-sub');

            if (chSelect) sc.channel = chSelect.value;
            if (dispSelect) sc.correctDisp = dispSelect.value;
            if (subSelect) sc.correctSubDisp = subSelect.value;

            saveTurnToMemory(selectedScenarioIndex, selectedTurnIndex);

            try {
                await apiCall('/api/scenarios', 'POST', scenarios);
                console.log("Scenarios successfully synced to database server.");
            } catch (err) {
                console.error("API error while saving scenarios", err);
            }

            saveScenariosToStorage();
            renderAdminScenariosList();
            selectScenario(selectedScenarioIndex);

            const submitBtn = scenarioEditForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم الحفظ!';
                submitBtn.style.background = 'var(--success)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                }, 1500);
            }
        });
    }

    function saveScenariosToStorage() {
        localStorage.setItem('zain_cash_scenarios', JSON.stringify(scenarios));
    }


    // ==========================================
    // DYNAMIC SLIDES EDITOR (SUB-TAB 4)
    // ==========================================
    const adminSlidesListUl = document.getElementById('admin-slides-list-ul');
    const noSlideSelected = document.getElementById('no-slide-selected');
    const slideEditForm = document.getElementById('slide-edit-form');
    
    // Slide fields
    const editSlideId = document.getElementById('edit-slide-id');
    const editSlideType = document.getElementById('edit-slide-type');
    const editSlideTitle = document.getElementById('edit-slide-title');
    const editSlideBadge = document.getElementById('edit-slide-badge');
    const editSlideSubtitle = document.getElementById('edit-slide-subtitle');

    let selectedSlideIndex = null;

    function renderAdminSlidesList() {
        if (!adminSlidesListUl) return;
        adminSlidesListUl.innerHTML = '';
        // Edit only slides 1-5 (Welcome and core rules)
        slidesData.slice(0, 5).forEach((slide, idx) => {
            const li = document.createElement('li');
            if (idx === selectedSlideIndex) {
                li.className = 'active';
            }
            li.innerHTML = `
                <span class="li-title" style="font-weight:700;">سلايد ${slide.id}: ${slide.badge || 'الترحيب'}</span>
                <span class="li-desc" style="font-size:0.75rem; color:#64748b;">${slide.title}</span>
            `;
            li.addEventListener('click', () => selectSlide(idx));
            adminSlidesListUl.appendChild(li);
        });
    }

    function selectSlide(idx) {
        selectedSlideIndex = idx;
        if (!adminSlidesListUl) return;
        
        const lis = adminSlidesListUl.querySelectorAll('li');
        lis.forEach((li, i) => {
            if (i === idx) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });

        if (idx === null) {
            if (noSlideSelected) noSlideSelected.classList.remove('hidden');
            if (slideEditForm) slideEditForm.classList.add('hidden');
            return;
        }

        if (noSlideSelected) noSlideSelected.classList.add('hidden');
        if (slideEditForm) slideEditForm.classList.remove('hidden');

        const slide = slidesData[idx];
        if (editSlideId) editSlideId.value = idx;
        if (editSlideType) editSlideType.value = slide.type;
        if (editSlideTitle) editSlideTitle.value = slide.title || '';
        if (editSlideBadge) editSlideBadge.value = slide.badge || '';
        if (editSlideSubtitle) editSlideSubtitle.value = slide.subtitle || '';

        // Hide all specific type panels
        document.getElementById('fields-type-welcome').classList.add('hidden');
        document.getElementById('fields-type-comparison').classList.add('hidden');
        document.getElementById('fields-type-comparison-context').classList.add('hidden');
        document.getElementById('fields-type-steps').classList.add('hidden');

        // Show matching type panel and load values
        if (slide.type === 'welcome') {
            document.getElementById('fields-type-welcome').classList.remove('hidden');
            document.getElementById('edit-welcome-warning-title').value = slide.warningTitle || '';
            document.getElementById('edit-welcome-content').value = slide.content || '';
        } else if (slide.type === 'comparison') {
            document.getElementById('fields-type-comparison').classList.remove('hidden');
            document.getElementById('edit-comp-right-title').value = slide.rightTitle || '';
            document.getElementById('edit-comp-wrong-title').value = slide.wrongTitle || '';
            
            document.getElementById('edit-comp-right-1-text').value = slide.rightExamples[0]?.text || '';
            document.getElementById('edit-comp-wrong-1-text').value = slide.wrongExamples[0]?.text || '';
            
            document.getElementById('edit-comp-right-2-text').value = slide.rightExamples[1]?.text || '';
            document.getElementById('edit-comp-wrong-2-text').value = slide.wrongExamples[1]?.text || '';
            
            document.getElementById('edit-comp-tip').value = slide.tip || '';
        } else if (slide.type === 'comparison_context') {
            document.getElementById('fields-type-comparison-context').classList.remove('hidden');
            document.getElementById('edit-ctx-context').value = slide.context || '';
            document.getElementById('edit-ctx-right-title').value = slide.rightTitle || '';
            document.getElementById('edit-ctx-wrong-title').value = slide.wrongTitle || '';
            document.getElementById('edit-ctx-right-text').value = slide.rightText || '';
            document.getElementById('edit-ctx-wrong-text').value = slide.wrongText || '';
            document.getElementById('edit-ctx-right-critique').value = slide.rightCritique || '';
            document.getElementById('edit-ctx-wrong-critique').value = slide.wrongCritique || '';
        } else if (slide.type === 'steps') {
            document.getElementById('fields-type-steps').classList.remove('hidden');
            document.getElementById('edit-steps-1-title').value = slide.steps[0]?.title || '';
            document.getElementById('edit-steps-1-desc').value = slide.steps[0]?.desc || '';
            document.getElementById('edit-steps-2-title').value = slide.steps[1]?.title || '';
            document.getElementById('edit-steps-2-desc').value = slide.steps[1]?.desc || '';
            document.getElementById('edit-steps-3-title').value = slide.steps[2]?.title || '';
            document.getElementById('edit-steps-3-desc').value = slide.steps[2]?.desc || '';
            
            document.getElementById('edit-steps-right-title').value = slide.rightTitle || '';
            document.getElementById('edit-steps-context').value = slide.context || '';
            document.getElementById('edit-steps-right-text').value = slide.rightText || '';
        }
    }

    if (slideEditForm) {
        slideEditForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (selectedSlideIndex === null) return;

            const idx = selectedSlideIndex;
            const slide = slidesData[idx];

            slide.title = editSlideTitle.value;
            slide.badge = editSlideBadge.value;
            slide.subtitle = editSlideSubtitle.value;

            if (slide.type === 'welcome') {
                slide.warningTitle = document.getElementById('edit-welcome-warning-title').value;
                slide.content = document.getElementById('edit-welcome-content').value;
            } else if (slide.type === 'comparison') {
                slide.rightTitle = document.getElementById('edit-comp-right-title').value;
                slide.wrongTitle = document.getElementById('edit-comp-wrong-title').value;
                
                slide.rightExamples = [
                    { label: "اللهجة العراقية الرسمية والودية:", text: document.getElementById('edit-comp-right-1-text').value },
                    { label: "عند تقديم الخدمة:", text: document.getElementById('edit-comp-right-2-text').value }
                ];
                slide.wrongExamples = [
                    { label: "الفصحى الجافة (تشبه البوت):", text: document.getElementById('edit-comp-wrong-1-text').value },
                    { label: "العامية المبتذلة (غير رسمية):", text: document.getElementById('edit-comp-wrong-2-text').value }
                ];
                
                slide.tip = document.getElementById('edit-comp-tip').value;
            } else if (slide.type === 'comparison_context') {
                slide.context = document.getElementById('edit-ctx-context').value;
                slide.rightTitle = document.getElementById('edit-ctx-right-title').value;
                slide.wrongTitle = document.getElementById('edit-ctx-wrong-title').value;
                slide.rightText = document.getElementById('edit-ctx-right-text').value;
                slide.wrongText = document.getElementById('edit-ctx-wrong-text').value;
                slide.rightCritique = document.getElementById('edit-ctx-right-critique').value;
                slide.wrongCritique = document.getElementById('edit-ctx-wrong-critique').value;
            } else if (slide.type === 'steps') {
                slide.steps = [
                    { num: 1, title: document.getElementById('edit-steps-1-title').value, desc: document.getElementById('edit-steps-1-desc').value },
                    { num: 2, title: document.getElementById('edit-steps-2-title').value, desc: document.getElementById('edit-steps-2-desc').value },
                    { num: 3, title: document.getElementById('edit-steps-3-title').value, desc: document.getElementById('edit-steps-3-desc').value }
                ];
                slide.rightTitle = document.getElementById('edit-steps-right-title').value;
                slide.context = document.getElementById('edit-steps-context').value;
                slide.rightText = document.getElementById('edit-steps-right-text').value;
            }

            // Save to server API
            try {
                await apiCall('/api/slides', 'POST', slidesData);
                console.log("Slides successfully synced to database server.");
            } catch (err) {
                console.error("API error while saving slides", err);
            }

            // Save locally and rebuild presentation
            localStorage.setItem('zain_cash_slides', JSON.stringify(slidesData));
            renderDynamicSlides();
            renderAdminSlidesList();
            selectSlide(idx);

            const submitBtn = slideEditForm.querySelector('.btn-save-scenario');
            if (submitBtn) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم الحفظ!';
                submitBtn.style.background = 'var(--success)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                }, 1500);
            }
        });
    }

    // Reset Defaults Scenarios/Slides
    const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', async () => {
            if (confirm("هل أنت متأكد من استعادة السيناريوهات الافتراضية؟ سيتم حذف جميع تعديلاتك الحالية.")) {
                localStorage.removeItem('zain_cash_scenarios');
                scenarios = [...SCENARIOS_DATA];
                try {
                    await apiCall('/api/scenarios', 'POST', scenarios);
                } catch (e) {
                    console.error("API error while resetting default scenarios", e);
                }
                saveScenariosToStorage();
                renderAdminScenariosList();
                selectScenario(null);
                alert("تمت استعادة السيناريوهات الافتراضية بنجاح.");
            }
        });
    }

    // Export scenarios.js File
    const exportScenariosBtn = document.getElementById('export-scenarios-btn');
    if (exportScenariosBtn) {
        exportScenariosBtn.addEventListener('click', () => {
            let fileContent = `// =========================================================================\n`;
            fileContent += `// ملف السيناريوهات المخصصة لمحاكي خدمة العملاء - زين كاش\n`;
            fileContent += `// تم توليده تلقائياً من لوحة التحكم بالتطبيق\n`;
            fileContent += `// =========================================================================\n\n`;
            fileContent += `const SCENARIOS_DATA = ${JSON.stringify(scenarios, null, 4)};\n`;
            
            const blob = new Blob([fileContent], { type: 'application/javascript; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scenarios.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }


    // ==========================================
    // USER SESSION MANAGEMENT & LOGIN FLOW
    // ==========================================
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginErrorMsg = document.getElementById('login-error-msg');
    
    const headerUserProfile = document.getElementById('header-user-profile');
    const headerUserName = document.getElementById('header-user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const activeTestBanner = document.getElementById('active-test-banner');
    const openAdminBtn = document.getElementById('open-admin-btn');
    
    let currentUser = null;
    let isTestAssigned = false;
    let isAiTestAssigned = false;
    
    async function checkUserSession() {
        const urlParams = new URLSearchParams(window.location.search);
        const autoLoginZC = urlParams.get('login');
        
        if (autoLoginZC) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            
            try {
                const user = await apiCall('/api/login', 'POST', { username: autoLoginZC });
                sessionStorage.setItem('zain_cash_user', JSON.stringify(user));
                currentUser = user;
                await onUserLoggedIn();
                return;
            } catch (err) {
                console.error("Auto-login failed:", err);
            }
        }

        const storedUser = sessionStorage.getItem('zain_cash_user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            await onUserLoggedIn();
        } else {
            if (loginScreen) loginScreen.classList.remove('hidden');
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
            const username = loginUsernameInput.value.trim();
            
            try {
                const user = await apiCall('/api/login', 'POST', { username });
                sessionStorage.setItem('zain_cash_user', JSON.stringify(user));
                currentUser = user;
                await onUserLoggedIn();
            } catch (err) {
                if (loginErrorMsg) {
                    let displayErr = err.message || "رمز الموظف غير مسجل!";
                    if (displayErr === "Employee code not registered" || displayErr.includes("401") || displayErr.includes("non-registered")) {
                        displayErr = "Employee code not registered (Enter ZC000)";
                    }
                    loginErrorMsg.textContent = displayErr;
                    loginErrorMsg.classList.remove('hidden');
                }
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('zain_cash_user');
            currentUser = null;
            window.location.reload();
        });
    }
    
    async function onUserLoggedIn() {
        if (loginScreen) loginScreen.classList.add('hidden');
        if (headerUserName) headerUserName.textContent = `${currentUser.name} (${currentUser.id})`;
        if (headerUserProfile) headerUserProfile.classList.remove('hidden');
        
        const navTabs = document.querySelector('.amy-nav-tabs');
        if (navTabs) navTabs.classList.remove('hidden'); // Show navigation tabs for everyone

        const navBtnSim = document.getElementById('nav-btn-simulator');
        const navBtnAI = document.getElementById('nav-btn-ai-agent');

        if (currentUser.role === 'Admin') {
            if (openAdminBtn) openAdminBtn.classList.remove('hidden');
            if (navBtnSim) navBtnSim.style.display = '';
            if (navBtnAI) navBtnAI.style.display = '';
        } else {
            if (openAdminBtn) openAdminBtn.classList.add('hidden');
            if (navBtnSim) navBtnSim.style.display = 'none'; // Hide simulator tab initially for employees
            if (navBtnAI) navBtnAI.style.display = 'none';   // Hide AI Sandbox completely for employees
        }
        
        await loadSlidesData();
        await checkTestAssignment();
        await loadScenariosFromStorage();

        // Notify AI agent of logged-in user
        if (typeof window.onAIUserLoggedIn === 'function') {
            window.onAIUserLoggedIn(currentUser);
        }

        // Switch to slides first on login
        switchTab('tab-slides');
    }
    
    async function checkTestAssignment() {
        const navBtnSim = document.getElementById('nav-btn-simulator');
        const navBtnAI = document.getElementById('nav-btn-ai-agent');
        const navBtnHome = document.querySelector('.amy-nav-btn[data-amy-tab="tab-slides"]');

        if (!currentUser || currentUser.role === 'Admin') {
            if (activeTestBanner) activeTestBanner.classList.add('hidden');
            isTestAssigned = false;
            isAiTestAssigned = false;
            window.isTestAssigned = false;
            window.isAiTestAssigned = false;
            
            if (navBtnSim) navBtnSim.style.display = '';
            if (navBtnAI) navBtnAI.style.display = '';
            if (navBtnHome) navBtnHome.style.display = '';
            return;
        }
        
        try {
            const [assignments, aiAssignments] = await Promise.all([
                apiCall('/api/assignments', 'GET'),
                apiCall('/api/ai-assignments', 'GET')
            ]);
            
            isTestAssigned = assignments.includes(currentUser.id) || assignments.includes('all');
            isAiTestAssigned = aiAssignments.includes(currentUser.id) || aiAssignments.includes('all');
            window.isTestAssigned = isTestAssigned;
            window.isAiTestAssigned = isAiTestAssigned;
            
            const banner = document.getElementById('active-test-banner');
            const bannerText = document.getElementById('active-test-banner-text');
            
            if (isTestAssigned || isAiTestAssigned) {
                if (banner) banner.classList.remove('hidden');
                
                if (isTestAssigned && isAiTestAssigned) {
                    if (bannerText) bannerText.textContent = "لديك اختبار نشط في محاكي الدردشة والأيجنت الذكي! يرجى إكمالهما.";
                    if (navBtnSim) navBtnSim.style.display = '';
                    if (navBtnAI) navBtnAI.style.display = '';
                    if (navBtnHome) navBtnHome.style.display = 'none';
                    switchTab('tab-simulator');
                } else if (isTestAssigned) {
                    if (bannerText) bannerText.textContent = "لديك اختبار نشط في محاكي الدردشة! يرجى إكمال جميع المحادثات وتصنيفها.";
                    if (navBtnSim) navBtnSim.style.display = '';
                    if (navBtnAI) navBtnAI.style.display = 'none';
                    if (navBtnHome) navBtnHome.style.display = 'none';
                    switchTab('tab-simulator');
                } else {
                    if (bannerText) bannerText.textContent = "لديك اختبار نشط في الأيجنت الذكي! يرجى إكمال التدريب والتصنيف.";
                    if (navBtnSim) navBtnSim.style.display = 'none';
                    if (navBtnAI) navBtnAI.style.display = '';
                    if (navBtnHome) navBtnHome.style.display = 'none';
                    switchTab('tab-ai-agent');
                }
            } else {
                if (banner) banner.classList.add('hidden');
                if (navBtnSim) navBtnSim.style.display = '';
                if (navBtnAI) navBtnAI.style.display = '';
                if (navBtnHome) navBtnHome.style.display = '';
            }
        } catch (e) {
            console.error("Failed to check assignments", e);
            isTestAssigned = false;
            isAiTestAssigned = false;
            window.isTestAssigned = false;
            window.isAiTestAssigned = false;
        }
    }

    // ==========================================
    // ADMIN PANEL SUB-TABS (Assignments, Results)
    // ==========================================
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');
    
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            adminTabBtns.forEach(b => b.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) {
                targetEl.classList.add('active');
            }
            
            if (targetTab === 'tab-assignments') {
                loadAssignmentsTab();
            } else if (targetTab === 'tab-results') {
                loadResultsTab();
            } else if (targetTab === 'tab-scenarios') {
                renderAdminScenariosList();
                selectScenario(null);
            } else if (targetTab === 'tab-ai-scenarios') {
                loadAiScenariosFromStorage().then(() => {
                    renderAdminAiScenariosList();
                    selectAiScenario(null);
                });
            } else if (targetTab === 'tab-edit-slides') {
                renderAdminSlidesList();
                selectSlide(null);
            }
        });
    });

    let allUsers = [];
    let currentTestType = 'simulator'; // 'simulator' or 'ai-agent'
    let currentAssignments = [];
    let currentAiAssignments = [];
    let simulatorAssignAll = false;
    let aiAssignAll = false;
    
    async function loadAssignmentsTab() {
        const grid = document.getElementById('users-selection-grid');
        if (!grid) return;
        grid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted);">جاري تحميل قائمة الموظفين...</p>';
        
        try {
            allUsers = await apiCall('/api/users', 'GET');
            currentAssignments = await apiCall('/api/assignments', 'GET');
            currentAiAssignments = await apiCall('/api/ai-assignments', 'GET');
            
            allUsers = allUsers.filter(u => u.role !== 'Admin');
            
            simulatorAssignAll = currentAssignments.includes('all');
            aiAssignAll = currentAiAssignments.includes('all');
            
            const activeType = currentTestType;
            const assignAll = activeType === 'simulator' ? simulatorAssignAll : aiAssignAll;
            
            if (typeSimulatorRadio) typeSimulatorRadio.checked = (activeType === 'simulator');
            if (typeAiRadio) typeAiRadio.checked = (activeType === 'ai-agent');
            
            const radioAll = document.getElementById('assign-all-radio');
            const radioSpecific = document.getElementById('assign-specific-radio');
            
            if (radioAll) radioAll.checked = assignAll;
            if (radioSpecific) radioSpecific.checked = !assignAll;
            
            const listWrapper = document.getElementById('specific-users-list-wrapper');
            if (listWrapper) {
                if (assignAll) {
                    listWrapper.classList.add('hidden');
                } else {
                    listWrapper.classList.remove('hidden');
                }
            }
            
            renderUsersGrid();
        } catch (e) {
            console.error("Failed to load assignments tab data", e);
            grid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--error);">فشل في تحميل قائمة الموظفين.</p>';
        }
    }
    
    function renderUsersGrid() {
        const grid = document.getElementById('users-selection-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        const searchInput = document.getElementById('users-search-input');
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const filtered = allUsers.filter(u => 
            u.name.toLowerCase().includes(searchQuery) || 
            u.id.toLowerCase().includes(searchQuery)
        );
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted);">لا يوجد موظفين يطابقون البحث.</p>';
            return;
        }
        
        const activeList = currentTestType === 'simulator' ? currentAssignments : currentAiAssignments;
        
        filtered.forEach(user => {
            const isChecked = activeList.includes(user.id);
            
            // Generate initials
            const names = user.name.split(' ');
            const initials = names.length > 1 ? (names[0][0] + names[1][0]).toUpperCase() : names[0][0].toUpperCase();
            
            // Consistent avatar colors
            let hash = 0;
            for (let i = 0; i < user.name.length; i++) {
                hash = user.name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const hue = Math.abs(hash) % 360;
            const avatarBg = `hsl(${hue}, 65%, 40%)`;
            
            const isSimAssigned = currentAssignments.includes(user.id) || simulatorAssignAll;
            const isAiAssigned = currentAiAssignments.includes(user.id) || aiAssignAll;
            
            const card = document.createElement('div');
            card.className = `user-checkbox-card ${isChecked ? 'selected' : ''}`;
            card.dataset.userId = user.id;
            
            card.innerHTML = `
                <div class="user-card-left">
                    <input type="checkbox" id="chk-user-${user.id}" ${isChecked ? 'checked' : ''}>
                    <div class="user-card-avatar" style="background-color: ${avatarBg}">
                        ${initials}
                    </div>
                </div>
                <div class="user-card-main">
                    <div class="user-name">${user.name}</div>
                    <div class="user-sub-row">
                        <span class="user-id-badge">${user.id}</span>
                        <span class="user-role-badge">${user.role || 'Inbound'}</span>
                    </div>
                    <div class="user-assignment-badges">
                        ${isSimAssigned ? '<span class="status-badge badge-simulator"><i class="fa-solid fa-comments"></i> Chat Simulator Active</span>' : ''}
                        ${isAiAssigned ? '<span class="status-badge badge-ai"><i class="fa-solid fa-robot"></i> AI Agent Active</span>' : ''}
                    </div>
                </div>
                <div class="user-card-right">
                    <div class="user-email-input-group">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="email" class="user-email-input user-email-field" id="email-user-${user.id}" placeholder="Enter email..." value="${user.email || ''}">
                    </div>
                    <button type="button" class="btn-send-invite btn-send-invite-card" data-user-id="${user.id}">
                        <i class="fa-solid fa-paper-plane" style="font-size: 0.7rem;"></i> Invite
                    </button>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    const chk = document.getElementById(`chk-user-${user.id}`);
                    if (chk) {
                        chk.checked = !chk.checked;
                        chk.dispatchEvent(new Event('change'));
                    }
                }
            });
            
            bindCardInviteControls(card, user);
            
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const activeArray = currentTestType === 'simulator' ? currentAssignments : currentAiAssignments;
                    if (checkbox.checked) {
                        card.classList.add('selected');
                        if (!activeArray.includes(user.id)) {
                            activeArray.push(user.id);
                        }
                    } else {
                        card.classList.remove('selected');
                        const updated = activeArray.filter(id => id !== user.id);
                        if (currentTestType === 'simulator') {
                            currentAssignments = updated;
                        } else {
                            currentAiAssignments = updated;
                        }
                    }
                    
                    const badgeContainer = card.querySelector('.user-assignment-badges');
                    if (badgeContainer) {
                        const isSimAssignedNow = currentAssignments.includes(user.id) || simulatorAssignAll;
                        const isAiAssignedNow = currentAiAssignments.includes(user.id) || aiAssignAll;
                        badgeContainer.innerHTML = `
                            ${isSimAssignedNow ? '<span class="status-badge badge-simulator"><i class="fa-solid fa-comments"></i> Chat Simulator Active</span>' : ''}
                            ${isAiAssignedNow ? '<span class="status-badge badge-ai"><i class="fa-solid fa-robot"></i> AI Agent Active</span>' : ''}
                        `;
                    }
                });
            }
            
            grid.appendChild(card);
        });
    }
    
    const assignAllRadio = document.getElementById('assign-all-radio');
    const assignSpecificRadio = document.getElementById('assign-specific-radio');
    const specificUsersListWrapper = document.getElementById('specific-users-list-wrapper');
    
    if (assignAllRadio) {
        assignAllRadio.addEventListener('change', () => {
            if (specificUsersListWrapper) specificUsersListWrapper.classList.add('hidden');
            if (currentTestType === 'simulator') {
                simulatorAssignAll = true;
            } else {
                aiAssignAll = true;
            }
        });
    }
    
    if (assignSpecificRadio) {
        assignSpecificRadio.addEventListener('change', () => {
            if (specificUsersListWrapper) specificUsersListWrapper.classList.remove('hidden');
            if (currentTestType === 'simulator') {
                simulatorAssignAll = false;
            } else {
                aiAssignAll = false;
            }
            renderUsersGrid();
        });
    }
    
    const usersSearchInput = document.getElementById('users-search-input');
    if (usersSearchInput) {
        usersSearchInput.addEventListener('input', renderUsersGrid);
    }
    
    const btnSelectAllUsers = document.getElementById('btn-select-all-users');
    if (btnSelectAllUsers) {
        btnSelectAllUsers.addEventListener('click', () => {
            const activeArray = currentTestType === 'simulator' ? currentAssignments : currentAiAssignments;
            allUsers.forEach(u => {
                if (!activeArray.includes(u.id)) {
                    activeArray.push(u.id);
                }
            });
            renderUsersGrid();
        });
    }
    
    const btnDeselectAllUsers = document.getElementById('btn-deselect-all-users');
    if (btnDeselectAllUsers) {
        btnDeselectAllUsers.addEventListener('click', () => {
            if (currentTestType === 'simulator') {
                currentAssignments = [];
            } else {
                currentAiAssignments = [];
            }
            renderUsersGrid();
        });
    }

    const typeSimulatorRadio = document.getElementById('assign-test-type-simulator');
    const typeAiRadio = document.getElementById('assign-test-type-ai');
    
    function handleTestTypeChange(type) {
        currentTestType = type;
        const assignAll = type === 'simulator' ? simulatorAssignAll : aiAssignAll;
        
        if (assignAll) {
            if (assignAllRadio) assignAllRadio.checked = true;
            if (specificUsersListWrapper) specificUsersListWrapper.classList.add('hidden');
        } else {
            if (assignSpecificRadio) assignSpecificRadio.checked = true;
            if (specificUsersListWrapper) specificUsersListWrapper.classList.remove('hidden');
        }
        renderUsersGrid();
    }
    
    if (typeSimulatorRadio) {
        typeSimulatorRadio.addEventListener('change', () => handleTestTypeChange('simulator'));
    }
    if (typeAiRadio) {
        typeAiRadio.addEventListener('change', () => handleTestTypeChange('ai-agent'));
    }
    
    const btnSaveAssignments = document.getElementById('btn-save-assignments');
    if (btnSaveAssignments) {
        btnSaveAssignments.addEventListener('click', async () => {
            const activeTest = currentTestType;
            const assignAll = assignAllRadio && assignAllRadio.checked;
            
            let targets = [];
            if (assignAll) {
                targets = ['all'];
            } else {
                const activeArray = activeTest === 'simulator' ? currentAssignments : currentAiAssignments;
                targets = [...activeArray].filter(id => id !== 'all');
            }
            
            if (activeTest === 'simulator') {
                simulatorAssignAll = assignAll;
                currentAssignments = targets;
            } else {
                aiAssignAll = assignAll;
                currentAiAssignments = targets;
            }
            
            const endpoint = activeTest === 'simulator' ? '/api/assignments' : '/api/ai-assignments';
            
            try {
                await apiCall(endpoint, 'POST', targets);
                
                // Asynchronously trigger email invites in the background for all selected users
                let selectedUserIds = [];
                if (targets.includes('all')) {
                    selectedUserIds = allUsers.map(u => u.id);
                } else {
                    selectedUserIds = targets;
                }
                
                // Trigger invites asynchronously
                selectedUserIds.forEach(async (uId) => {
                    const usr = allUsers.find(u => u.id === uId);
                    if (usr && usr.email) {
                        try {
                            await apiCall('/api/send-invite', 'POST', { userId: usr.id, email: usr.email, testType: activeTest });
                        } catch (err) {
                            console.error(`Bulk invite failed for user ${usr.id}:`, err);
                        }
                    }
                });

                const originalHtml = btnSaveAssignments.innerHTML;
                btnSaveAssignments.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم التفعيل والإرسال بنجاح!';
                btnSaveAssignments.style.background = 'var(--success)';
                setTimeout(() => {
                    btnSaveAssignments.innerHTML = originalHtml;
                    btnSaveAssignments.style.background = '';
                }, 1500);
            } catch (e) {
                alert("فشل في حفظ التعيينات: " + e.message);
            }
        });
    }

    async function loadSimResults() {
        const tbody = document.getElementById('results-table-tbody');
        const placeholder = document.getElementById('no-results-placeholder');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Loading results...</td></tr>';
        if (placeholder) placeholder.classList.add('hidden');
        
        try {
            const results = await apiCall('/api/results', 'GET');
            tbody.innerHTML = '';
            
            if (results.length === 0) {
                if (placeholder) placeholder.classList.remove('hidden');
                return;
            }
            
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            results.forEach(res => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-family: var(--font-en); font-weight:700;">${res.userId}</td>
                    <td style="font-weight:700;">${res.userName}</td>
                    <td><strong>${res.score}%</strong></td>
                    <td>${res.errorsCount}</td>
                    <td><span class="${res.score >= 80 ? 'text-green' : (res.score >= 60 ? 'text-orange' : 'text-red')}" style="font-weight:700;">${res.grade}</span></td>
                    <td>${res.date}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Failed to load sim results", e);
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--error); padding: 20px;">Failed to load simulator results.</td></tr>';
        }
    }

    async function loadAIResults() {
        const tbody = document.getElementById('ai-results-table-tbody');
        const placeholder = document.getElementById('no-ai-results-placeholder');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">جاري تحميل النتائج...</td></tr>';
        if (placeholder) placeholder.classList.add('hidden');
        
        try {
            const results = await apiCall('/api/ai-results', 'GET');
            tbody.innerHTML = '';
            
            if (results.length === 0) {
                if (placeholder) placeholder.classList.remove('hidden');
                return;
            }
            
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            results.forEach(res => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-family: var(--font-en); font-weight:700;">${res.userId}</td>
                    <td style="font-weight:700;">${res.userName}</td>
                    <td><strong>${res.score}%</strong></td>
                    <td><span class="${res.score >= 80 ? 'text-green' : (res.score >= 60 ? 'text-orange' : 'text-red')}" style="font-weight:700;">${res.grade}</span></td>
                    <td>${res.date}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Failed to load AI results", e);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--error); padding: 20px;">Failed to load AI coach results.</td></tr>';
        }
    }

    async function loadResultsTab() {
        await Promise.all([
            loadSimResults(),
            loadAIResults()
        ]);
    }
    
    const refreshSimResultsBtn = document.getElementById('btn-refresh-results-sim');
    if (refreshSimResultsBtn) {
        refreshSimResultsBtn.addEventListener('click', loadSimResults);
    }

    const refreshAIResultsBtn = document.getElementById('btn-refresh-results-ai');
    if (refreshAIResultsBtn) {
        refreshAIResultsBtn.addEventListener('click', loadAIResults);
    }

    // Prevent input and button click bubbles & auto-save email changes
    function bindCardInviteControls(card, user) {
        const emailInput = card.querySelector('.user-email-input');
        if (emailInput) {
            emailInput.addEventListener('click', (ev) => ev.stopPropagation());
            emailInput.addEventListener('change', async () => {
                const emailVal = emailInput.value.trim();
                user.email = emailVal;
                try {
                    await apiCall('/api/users/update-email', 'POST', { id: user.id, email: emailVal });
                } catch (err) {
                    console.error("Failed to update email:", err);
                }
            });
        }
        
        const inviteBtn = card.querySelector('.btn-send-invite');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                
                const emailVal = emailInput ? emailInput.value.trim() : '';
                if (!emailVal) {
                    showToast("Please enter a valid email address first!", "warning");
                    return;
                }
                
                inviteBtn.disabled = true;
                inviteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                
                try {
                    const res = await apiCall('/api/send-invite', 'POST', { userId: user.id, email: emailVal, testType: currentTestType });
                    if (res.success) {
                        if (res.sent) {
                            showToast(`Invitation sent successfully to ${emailVal}!`, "success");
                        } else if (res.simulated) {
                            showQuickLinkModal(user.name, res.link);
                        }
                    } else {
                        showToast(`Failed to send: ${res.error}`, "error");
                    }
                } catch (err) {
                    showToast(`Error: ${err.message}`, "error");
                } finally {
                    inviteBtn.disabled = false;
                    inviteBtn.innerHTML = '<i class="fa-solid fa-paper-plane" style="font-size: 0.7rem;"></i> Invite';
                }
            });
        }
    }

    function showQuickLinkModal(employeeName, link) {
        const modal = document.createElement('div');
        modal.className = 'quick-link-modal-overlay';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(15, 23, 42, 0.6)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        
        modal.innerHTML = `
            <div style="background: #ffffff; padding: 25px; border-radius: 16px; width: 90%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; direction: rtl; text-align: right;">
                <h3 style="margin-top: 0; color: var(--primary); font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
                    <i class="fa-solid fa-link" style="color: var(--primary);"></i> رابط الدخول السريع (سيرفر محلي)
                </h3>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 10px;">
                    تم إنشاء رابط دعوة للموظف <strong>${employeeName}</strong>. 
                    <br><br>
                    بما أن إعدادات SMTP فارغة، يمكنك نسخ الرابط التالي وإرساله للموظف يدوياً:
                </p>
                <div style="display: flex; gap: 8px; margin: 15px 0;">
                    <input type="text" value="${link}" readonly style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem; font-family: monospace;" id="modal-link-input">
                    <button class="btn btn-primary" id="btn-modal-copy" style="padding: 8px 15px; font-size: 0.8rem;">نسخ</button>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
                    <button class="btn btn-secondary" id="btn-modal-close" style="font-size: 0.85rem; padding: 6px 15px;">إغلاق</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('#btn-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
        
        const copyBtn = modal.querySelector('#btn-modal-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const input = modal.querySelector('#modal-link-input');
                if (input) {
                    input.select();
                    document.execCommand('copy');
                    showToast("تم نسخ الرابط الحافظة!", "success");
                }
            });
        }
    }

    // SMTP Save event handler
    const btnSaveSMTP = document.getElementById('btn-save-smtp');
    if (btnSaveSMTP) {
        btnSaveSMTP.addEventListener('click', async () => {
            const host = document.getElementById('smtp-host').value.trim();
            const port = parseInt(document.getElementById('smtp-port').value.trim()) || 587;
            const ssl = document.getElementById('smtp-ssl').value === 'true';
            const username = document.getElementById('smtp-username').value.trim();
            const password = document.getElementById('smtp-password').value.trim();
            
            btnSaveSMTP.disabled = true;
            btnSaveSMTP.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            
            try {
                await apiCall('/api/smtp', 'POST', {
                    server: host,
                    port: port,
                    enableSsl: ssl,
                    username: username,
                    password: password
                });
                showToast("SMTP settings saved successfully!", "success");
            } catch (err) {
                showToast(`Failed to save: ${err.message}`, "error");
            } finally {
                btnSaveSMTP.disabled = false;
                btnSaveSMTP.innerHTML = 'Save SMTP Settings';
            }
        });
    }

    // Toggle SMTP settings block
    const smtpSettingsHeader = document.getElementById('smtp-settings-header');
    const smtpSettingsBody = document.getElementById('smtp-settings-body');
    const smtpChevron = document.getElementById('smtp-chevron');
    if (smtpSettingsHeader && smtpSettingsBody) {
        smtpSettingsHeader.addEventListener('click', () => {
            if (smtpSettingsBody.classList.contains('hidden')) {
                smtpSettingsBody.classList.remove('hidden');
                if (smtpChevron) smtpChevron.style.transform = 'rotate(180deg)';
                loadSMTPSettings();
            } else {
                smtpSettingsBody.classList.add('hidden');
                if (smtpChevron) smtpChevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    async function loadSMTPSettings() {
        try {
            const settings = await apiCall('/api/smtp', 'GET');
            if (settings) {
                document.getElementById('smtp-host').value = settings.server || '';
                document.getElementById('smtp-port').value = settings.port || 587;
                document.getElementById('smtp-ssl').value = settings.enableSsl !== false ? 'true' : 'false';
                document.getElementById('smtp-username').value = settings.username || '';
                document.getElementById('smtp-password').value = settings.password || '';
            }
        } catch (err) {
            console.error("Failed to load SMTP settings:", err);
        }
    }

    // Initial session check
    checkUserSession();
});
