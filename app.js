// Zain Cash Customer Care Training Application Logic (Amyo Style)

document.addEventListener('DOMContentLoaded', () => {
    // Automatic Cache-Busting for Ameyo Telephony & Voice Call Simulator
    const STOCKS_DISP_VERSION = 'v22_webrtc_voice_calls';
    if (localStorage.getItem('zain_app_data_version') !== STOCKS_DISP_VERSION) {
        localStorage.removeItem('zain_cash_scenarios');
        localStorage.removeItem('zain_cash_slides');
        localStorage.removeItem('zain_cash_kb');
        localStorage.removeItem('zain_cash_ai_scenarios');
        localStorage.removeItem('amyo_gemini_system_prompt');
        localStorage.setItem('zain_app_data_version', STOCKS_DISP_VERSION);
        console.log("Purged legacy localStorage cache for WebRTC Voice Calls update!");
    }

    // Global Dispositions Catalog
    const GLOBAL_DISPOSITION_DATA = {
        "Inquiry": [
            "Agent & Shop Location",
            "Application Usage",
            "Become a agent & merchant",
            "E-Goods",
            "Forgot Wallet Number",
            "Government Bill Payment",
            "Wallet Top-up throught Visa or Master",
            "Merchant Wallet Linking",
            "Mastercard card top-up and transfer",
            "MasterCard Activation/Status",
            "MasterCard Limits & Fees",
            "MasterCard Order/ Delivery",
            "MasterCard Transaction",
            "Merchant Payment Service",
            "NBI Service",
            "Passport Upload for International TRX",
            "Top-Up Other Cards Using ZainCash Wallet",
            "Wallet Account Status",
            "Wallet Balance",
            "Wallet Cash-Out",
            "Wallet Limits & Fees",
            "Wallet Local Transfer",
            "Wallet Login",
            "Wallet PIN Reset or Change",
            "Wallet Registration Process",
            "Wallet Top-Up through Agent or Bank",
            "Western Union",
            "Zain IQ Recharge",
            "Wallet Change Number and Termination Process",
            "Inquiry About Outbound Call",
            "Change Wallet MSISDN(Korek)"
        ],
        "Request": [
            "Cancel Wallet Termination Request",
            "Card Statement",
            "Change Wallet MSISDN Status",
            "E-Goods PIN Send",
            "Lock / Unlock Wallet",
            "MasterCard Order Status - Delivery Schedule",
            "MasterCard Balance Refund Request",
            "Request Follow-up",
            "MasterCard Resend PIN",
            "Reset Wallet PIN",
            "Transaction Status Verification",
            "Update Customer Information & Documents",
            "Wallet Statement"
        ],
        "Complaint": [
            "Application Usage",
            "Cashback Issue",
            "E-Goods Other Issue",
            "E-Goods Redemption Failure",
            "Follow-up on Previous Escalation Ticket",
            "Government Bill Payment",
            "Local Transfer Failure",
            "MasterCard Activation Failure",
            "MasterCard Hold / Cancelled Card",
            "MasterCard International Transactions",
            "MasterCard Local Transactions",
            "MasterCard Negative Balance",
            "MasterCard Order or Delay Delivery",
            "MasterCard Top-up Transfer",
            "MasterCard Transaction Dispute",
            "Merchant Payment Failure",
            "NBI Link Issue",
            "Passport Upload",
            "Wallet Cash Disbursement",
            "Wallet Cash-out",
            "Wallet Change MSISDN",
            "Wallet Delay in Receiving OTP/PIN",
            "Wallet Limit-Fees",
            "Wallet Login Failure",
            "Wallet Registration",
            "Wallet Status",
            "Wallet Termination",
            "Wallet Top-up through Visa/Master",
            "Wallet Top-Up through Agent/Bank",
            "Western Union Add-Edit Beneficiary",
            "Western Union Received Money",
            "Western Union Refund Money",
            "Western Union Service on Hold",
            "WU Send Money",
            "Zain IQ Recharge",
            "IllegalAgentCharge"
        ],
        "Fraud & Security": [
            "Fraud or Scam",
            "Other Security Concern",
            "Suspicious Activity",
            "Unauthorized Transaction"
        ],
        "Customer Concern": [
            "Agent attitude",
            "Customer Care attitude",
            "Field Team attitude",
            "Process or Policy"
        ],
        "Support": [
            "English Support",
            "Kurdish Support",
            "Supervisor"
        ],
        "Incident": [
            "Application",
            "Hold Balance",
            "MasterCard",
            "Wallet Service Outage",
            "Western Union Outage"
        ],
        "Incomplete Contact": [
            "Disconnected Before Verification",
            "Disconnected During Conversation",
            "No Response",
            "Silent Call Only",
            "Spam / Junk",
            "Unclear Customer Request",
            "Traning & Test"
        ],
        "Social Media": [
            "Wallet / Application",
            "Mastercards (WalletCards)",
            "Western Union",
            "Digital Goods",
            "Cash-In by VISA/MC (HC)",
            "Zain IQ Top-Up",
            "Merchant Payment",
            "NBI",
            "GOV Bill Payment",
            "Report Fraud or Scam",
            "Junk",
            "Suggestion",
            "Positive Feedback",
            "Negative Feedback"
        ]
    };
    window.DISPOSITION_DATA = GLOBAL_DISPOSITION_DATA;

    // API base URL
    const API_BASE = window.location.origin.startsWith('http') ? window.location.origin : '';
    
    async function apiCall(endpoint, method = 'GET', data = null) {
        if (!API_BASE) {
            return handleOfflineApi(endpoint, method, data);
        }
        try {
            let roleHeader = 'Guest';
            let idHeader = 'Anonymous';
            if (currentUser && currentUser.role) {
                roleHeader = currentUser.role;
                idHeader = currentUser.id;
            } else {
                try {
                    const stored = JSON.parse(sessionStorage.getItem('zain_cash_user') || '{}');
                    if (stored.role) {
                        roleHeader = stored.role;
                        idHeader = stored.id;
                    }
                } catch(e) {}
            }

            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Role': roleHeader,
                    'X-User-Id': idHeader
                }
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            const response = await fetch(`${API_BASE}${endpoint}`, options);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const err = new Error(errData.error || `HTTP error ${response.status}`);
                err.isAuthError = response.status === 401 || response.status === 403 || endpoint === '/api/login';
                throw err;
            }
            return await response.json();
        } catch (e) {
            if (e.isAuthError) {
                throw e;
            }
            console.warn(`API call ${endpoint} failed, falling back to local simulation:`, e);
            return handleOfflineApi(endpoint, method, data);
        }
    }
    window.apiCall = apiCall;

    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    window.escapeHtml = escapeHtml;
    
    function handleOfflineApi(endpoint, method, data) {
        if (endpoint === '/api/login' && method === 'POST') {
            const raw = (data && data.username ? data.username : '').trim().toUpperCase();
            if (!raw) return Promise.reject(new Error("Username is required"));
            
            const validUsers = [
                { id: "ZC599", name: "Amr Nasr", email: "amr.nasr@zaincash.iq", role: "Admin" },
                { id: "ZC000", name: "Amr Nasr", email: "amr.nasr@zaincash.iq", role: "Admin" },
                { id: "ZC700", name: "Kadhim Mohammed Safi", email: "kadhim.mohammed@zaincash.iq", role: "Inbound" },
                { id: "ZC476", name: "Mustafa Khudhaier Abbas", email: "mustafa.khudher@zaincash.iq", role: "Inbound" },
                { id: "ZC552", name: "Aso Sarbest Nathmi", email: "aso.sarbast@zaincash.iq", role: "Inbound" },
                { id: "ZC733", name: "Tara faris fouad", email: "tara.faris@zaincash.iq", role: "Inbound" },
                { id: "ZC580", name: "Hayman Omed Mohammed", email: "hemn.omed@zaincash.iq", role: "Inbound" },
                { id: "ZC624", name: "Ruqaya Nadhim", email: "ruqaya.nadhum@zaincash.iq", role: "Inbound" },
                { id: "ZC739", name: "Ahmed Khalil Fatah", email: "ahmed.fatah@zaincash.iq", role: "Inbound" },
                { id: "ZC737", name: "Dheyaa Mohammed Khudhair", email: "dhyaa.mohammed@zaincash.iq", role: "Inbound" },
                { id: "ZC639", name: "Mustafa Abdulsahib Najim", email: "mustafa.abdulsahib@zaincash.iq", role: "Inbound" },
                { id: "ZC500", name: "Omar Fadhil Sleman", email: "omar.fadhil@zaincash.iq", role: "Inbound" },
                { id: "ZC291", name: "Ali Mohammed Ameen", email: "ali.ameen@zaincash.iq", role: "Inbound" },
                { id: "ZC672", name: "Mustafa Ahmed Khadir", email: "mustafa.ahmed@zaincash.iq", role: "Inbound" },
                { id: "ZC627", name: "Abdullah Loay", email: "abdullah.loay@zaincash.iq", role: "Inbound" },
                { id: "ZC735", name: "MOHAMMED RAGHEED HAMID", email: "mohammed.raghed@zaincash.iq", role: "Inbound" },
                { id: "ZC743", name: "Ali Shakir Eand", email: "ali.shakir@zaincash.iq", role: "Inbound" },
                { id: "ZC311", name: "Ahmed AbdulRazaq Hameed", email: "ahmed.abdulrazaq@zaincash.iq", role: "Inbound" },
                { id: "ZC703", name: "Houthaifa Waleed Razuki", email: "houthaifa.waleed@zaincash.iq", role: "Inbound" },
                { id: "ZC657", name: "Maytham Ali Mohammed", email: "maytham.ali@zaincash.iq", role: "Inbound" },
                { id: "ZC738", name: "Hazem Emad Hamdi", email: "hazem.emad@zaincash.iq", role: "Inbound" },
                { id: "ZC655", name: "Muhammad Zaman", email: "mohammed.zaman@zaincash.iq", role: "Inbound" },
                { id: "ZC683", name: "Ali Ryadh Hadi", email: "ali.riyadh@zaincash.iq", role: "Inbound" },
                { id: "ZC681", name: "Alaa Hussein Ali", email: "alaa.hussein@zaincash.iq", role: "Inbound" },
                { id: "ZC740", name: "Ali Wisam Abdulsattar", email: "ali.wisam@zaincash.iq", role: "Inbound" },
                { id: "ZC332", name: "Monier Yasir Monier", email: "monier.yasir@zaincash.iq", role: "Inbound" },
                { id: "ZC579", name: "Ahmed Haitham Kadhim", email: "ahmad.haitham@zaincash.iq", role: "Inbound" },
                { id: "ZC416", name: "Nooralhuda Ali Hamza", email: "nooralhuda.ali@zaincash.iq", role: "Inbound" },
                { id: "ZC676", name: "Hamza Dhiaa Mubder", email: "hamza.dhiaa@zaincash.iq", role: "Inbound" },
                { id: "ZC741", name: "Montzer Muneer Taha", email: "montadhar.monier@zaincash.iq", role: "Inbound" },
                { id: "ZC501", name: "Hussein Mohammed Ibrahim", email: "hussein.mohammed@zaincash.iq", role: "Inbound" },
                { id: "ZC578", name: "Maryam Thaer Talib", email: "maryam.thaer@zaincash.iq", role: "Inbound" },
                { id: "ZC577", name: "Hasan Ammar sabir", email: "hasan.ammar@zaincash.iq", role: "Inbound" },
                { id: "ZC194", name: "Haneen Ahmed Zaki", email: "haneen.ahmed@zaincash.iq", role: "Inbound" },
                { id: "ZC673", name: "Forqan Zuhaer Mohamed", email: "forqan.zuhaer@zaincash.iq", role: "Inbound" },
                { id: "ZC706", name: "Mustafa laith sophi", email: "mustafa.laith@zaincash.iq", role: "Inbound" },
                { id: "ZC532", name: "Maryam Tariq Jassam", email: "maryam.tariq@zaincash.iq", role: "Inbound" },
                { id: "ZC744", name: "Abdullah Faris Barghash", email: "abdullah.faris@zaincash.iq", role: "Inbound" },
                { id: "ZC489", name: "Sarah Ahmed Abd", email: "sarah.ahmed@zaincash.iq", role: "Inbound" },
                { id: "ZC485", name: "Ahmed Saad Abdulhadi", email: "ahmad.saad@zaincash.iq", role: "Inbound" },
                { id: "ZC366", name: "Sajjad Mahdi", email: "sajad.mahdi@zaincash.iq", role: "Inbound" },
                { id: "ZC434", name: "Aya Ali Hussien", email: "aya.ali@zaincash.iq", role: "Inbound" },
                { id: "ZC224", name: "Ali Sabeh Jassim", email: "ali.sabeeh@zaincash.iq", role: "Inbound" },
                { id: "ZC473", name: "Zainab Saad faeq", email: "zainab.saad@zaincash.iq", role: "Inbound" },
                { id: "ZC742", name: "Rahma Dored Jumaa", email: "rahma.duraid@zaincash.iq", role: "Inbound" },
                { id: "ZC625", name: "Ahmed Mohammed Khalil", email: "ahmed.khalil@zaincash.iq", role: "Inbound" },
                { id: "ZC609", name: "Ali Mohammed Sallal", email: "ali.mohammed@zaincash.iq", role: "Inbound" },
                { id: "ZC363", name: "Mohammed Asaad", email: "mohammed.asaad@zaincash.iq", role: "Inbound" },
                { id: "ZC582", name: "Maryam Ahmed Younis", email: "maryam.younis@zaincash.iq", role: "Inbound" },
                { id: "ZC471", name: "Dalia Salah Tayah", email: "dalia.salah@zaincash.iq", role: "Inbound" },
                { id: "ZC480", name: "Abdullah Abdulrahman Wahib", email: "abdullah.abdalrhman@zaincash.iq", role: "Inbound" },
                { id: "ZC702", name: "Abdullah Majid Hameed.", email: "abdullah.majid@zaincash.iq", role: "Inbound" },
                { id: "ZC646", name: "Yassir Khalil Qahtan", email: "yassir.khalil@zaincash.iq", role: "Inbound" },
                { id: "ZC315", name: "Mustafa Muwafaq Mohammedali", email: "mustafa.muwafaq@zaincash.iq", role: "Inbound" },
                { id: "ZC576", name: "Zaid Ahmed abbas", email: "zaid.ahmed@zaincash.iq", role: "Inbound" },
                { id: "ZC755", name: "Ibrahim Khalil Samir", email: "ibrahim.khalil@zaincash.iq", role: "Inbound" },
                { id: "ZC565", name: "Mohammed Waleed Mohammed", email: "mohammed.waleed@zaincash.iq", role: "Inbound" },
                { id: "ZC734", name: "Ali Abbas Rahman", email: "ali.abbas@zaincash.iq", role: "Inbound" },
                { id: "ZC643", name: "Mohammedalbaqir Haider Hussein", email: "mohammed.albaqer@zaincash.iq", role: "Inbound" },
                { id: "ZC758", name: "Nabaa Ali Mohhamed", email: "nabaa.ali@zaincash.iq", role: "Inbound" },
                { id: "ZC470", name: "Yaqeen Abdulkhdhur Hasan", email: "yakeen.abdulkhudhur@zaincash.iq", role: "Inbound" },
                { id: "ZC482", name: "Zainab Haider Jaffar", email: "zainab.haider@zaincash.iq", role: "Inbound" },
                { id: "ZC272", name: "Hasan Reyad Jabbar", email: "hassan.reyad@zaincash.iq", role: "Inbound" },
                { id: "ZC757", name: "Amna Dheyaa Hasan", email: "amna.dheyaa@zaincash.iq", role: "Inbound" },
                { id: "ZC745", name: "Abdul Razaq Haitham Mohsen", email: "abdulrazaq.haitham@zaincash.iq", role: "Inbound" },
                { id: "ZC481", name: "Yusor Raied Ismail", email: "yusor.raed@zaincash.iq", role: "Inbound" },
                { id: "ZC699", name: "Ameen saad nasef", email: "ameen.saad@zaincash.iq", role: "Inbound" },
                { id: "ZC262", name: "Sadoon Muhsin", email: "sadoon.mohsoun@zaincash.iq", role: "Inbound" }
            ];

            const found = validUsers.find(u => u.id.toUpperCase() === raw || u.name.toUpperCase().includes(raw));
            if (found) return Promise.resolve(found);
            return Promise.reject(new Error("ZC code not registered"));
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
                    brevoKey: "",
                    resendKey: "",
                    server: "smtp.gmail.com",
                    port: 465,
                    enableSsl: true,
                    username: "zaincash.testexam@gmail.com",
                    password: "kqnh huof iekb sqcm"
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
        if (endpoint.startsWith('/api/test-session')) {
            return Promise.resolve({});
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
            if (isCallTestAssigned) {
                if (!window.isTestSessionActive) {
                    if (tabId !== 'tab-slides') {
                        showToast('⚠️ يرجى قراءة السلايدات أولاً ثم بدء الاختبار!', 'error');
                        return;
                    }
                } else {
                    if (tabId !== 'tab-call-simulator') {
                        showToast('⚠️ يرجى التواجد في محاكي المكالمات لإكمال الاختبار الصوتي!', 'error');
                        return;
                    }
                }
            } else if (isAiTestAssigned) {
                if (!window.isTestSessionActive) {
                    if (tabId !== 'tab-slides') {
                        showToast('⚠️ يرجى قراءة السلايدات أولاً ثم بدء الاختبار!', 'error');
                        return;
                    }
                } else {
                    if (tabId !== 'tab-ai-agent') {
                        showToast('⚠️ يرجى إكمال اختبار الأيجنت الذكي أولاً!', 'error');
                        return;
                    }
                }
            } else if (isTestAssigned) {
                if (!window.isTestSessionActive) {
                    if (tabId !== 'tab-slides') {
                        showToast('⚠️ يرجى قراءة السلايدات أولاً ثم بدء الاختبار!', 'error');
                        return;
                    }
                } else {
                    if (tabId !== 'tab-simulator') {
                        showToast('⚠️ يرجى إكمال اختبار محاكي الدردشة أولاً!', 'error');
                        return;
                    }
                }
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
        } else if (tabId === 'tab-call-simulator') {
            if (typeof window.initAmeyoCallSimulator === 'function') {
                window.initAmeyoCallSimulator();
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
                    </div>
                `;
            } else {
                const badge = slide.badgeText || slide.badge || `Slide ${slide.id}`;
                const title = slide.title || '';
                const desc = slide.desc || slide.subtitle || slide.content || '';
                const bullets = slide.bulletPoints || [];

                html = `
                    <div class="slide-content" style="display:flex; flex-direction:column; gap:16px; text-align:right; direction:rtl; padding:20px;">
                        <div class="slide-header" style="display:flex; flex-direction:column; gap:8px;">
                            <span class="rule-badge" style="align-self:flex-start; background:rgba(12,79,138,0.1); color:var(--primary); padding:4px 12px; border-radius:20px; font-weight:700; font-size:0.85rem;">${escapeHtml(badge)}</span>
                            <h2 class="slide-title" style="font-size:1.6rem; font-weight:800; color:var(--primary); margin:0;">${escapeHtml(title)}</h2>
                        </div>
                        <p class="slide-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6; margin:0;">${escapeHtml(desc)}</p>
                        ${bullets.length > 0 ? `
                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-right:4px solid var(--primary); padding:18px; border-radius:14px; margin-top:10px;">
                                <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px;">
                                    ${bullets.map(bp => `
                                        <li style="display:flex; align-items:center; gap:10px; font-size:1rem; color:#1e293b; font-weight:600;">
                                            <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:1.1rem;"></i>
                                            <span>${escapeHtml(bp)}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
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

        const enterTestBtn = document.getElementById('btn-enter-assigned-test');
        if (enterTestBtn) {
            if (currentSlide === totalSlides && (window.isTestAssigned || window.isAiTestAssigned || window.isCallTestAssigned)) {
                enterTestBtn.classList.remove('hidden');
            } else {
                enterTestBtn.classList.add('hidden');
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

    const enterTestBtn = document.getElementById('btn-enter-assigned-test');
    if (enterTestBtn) {
        enterTestBtn.addEventListener('click', async () => {
            if (!currentUser) return;
            const activeTestType = window.isCallTestAssigned ? 'call-simulator' : (window.isAiTestAssigned ? 'ai-agent' : 'simulator');
            try {
                // Post to start the session, setting the startTime to now
                await apiCall('/api/test-session/start', 'POST', {
                    userId: currentUser.id,
                    testType: activeTestType
                });
                // Reload assignment state
                await checkTestAssignment();
            } catch (err) {
                console.error("Failed to start session:", err);
                showToast("❌ فشل الاتصال بالسيرفر لبدء الاختبار. حاول مجدداً.", "error");
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
    let userDispositions = {};

    // Toast helper for app.js
    function showToast(message, type = 'success') {
        window.showToast = showToast;
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
                <div class="chat-footer-mock live-footer" style="padding: 12px; display: flex; flex-direction: column; gap: 8px; background: #f8fafc; border-top: 1px solid #cbd5e1; height: auto; min-height: 60px; align-items: stretch;">
                    <div id="chat-options-container-${i}" style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                        <!-- Dynamic options buttons -->
                    </div>
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
                        <div class="disp-field-block" id="disp-block-${i}">
                            <label class="disp-field-label">Disposition</label>
                            <div class="disp-custom-select" id="disp-select-trigger-${i}">
                                <span id="disp-selected-text-${i}">Select a Disposition</span>
                                <i class="fa-solid fa-chevron-down disp-chevron"></i>
                            </div>
                            <div class="disp-dropdown-popup hidden" id="disp-popup-${i}">
                                <div class="disp-dropdown-search-wrap">
                                    <input type="text" class="disp-dropdown-search-input" id="disp-search-${i}" placeholder="" autocomplete="off">
                                </div>
                                <div class="disp-dropdown-list" id="disp-list-${i}"></div>
                            </div>
                        </div>

                        <div class="disp-field-block" id="sub-disp-block-${i}">
                            <label class="disp-field-label">Sub Disposition</label>
                            <div class="disp-custom-select" id="sub-disp-select-trigger-${i}">
                                <span id="sub-disp-selected-text-${i}">Select a Sub Disposition</span>
                                <i class="fa-solid fa-chevron-down disp-chevron"></i>
                            </div>
                            <div class="disp-dropdown-popup hidden" id="sub-disp-popup-${i}">
                                <div class="disp-dropdown-search-wrap">
                                    <input type="text" class="disp-dropdown-search-input" id="sub-disp-search-${i}" placeholder="" autocomplete="off">
                                </div>
                                <div class="disp-dropdown-list" id="sub-disp-list-${i}"></div>
                            </div>
                        </div>

                        <div class="disp-dotted-divider"></div>

                        <div class="quick-dispositions-grid">
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="Inquiry" data-sub="Application Usage">Application Usage</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="Complaint" data-sub="Local Transfer Failure">Local Transfer Failure</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="Incomplete Contact" data-sub="Spam / Junk">Spam / Junk</button>
                            <button type="button" class="quick-disp-btn" data-chat="${i}" data-disp="Inquiry" data-sub="Wallet Balance">Wallet Balance</button>
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

        // Clear MCQ state maps
        simulatorTurnMap = {};
        simulatorCorrectCountMap = {};
        simulatorSelectedAnswers = {};

        multiChatAgent.chats.forEach(chat => {
            const i = chat.id;
            disposedChats[i] = false;
            simulatorTurnMap[i] = 0;
            simulatorCorrectCountMap[i] = 0;
            simulatorSelectedAnswers[i] = [];
            
            // Render Turn 1 options immediately!
            renderSimulatorTurnOptions(i, 0);
        });

        const DISPOSITION_DATA = {
    "Inquiry": [
        "Agent & Shop Location",
        "Application Usage",
        "Become a agent & merchant",
        "E-Goods",
        "Forgot Wallet Number",
        "Government Bill Payment",
        "Wallet Top-up throught Visa or Master",
        "Merchant Wallet Linking",
        "Mastercard card top-up and transfer",
        "MasterCard Activation/Status",
        "MasterCard Limits & Fees",
        "MasterCard Order/ Delivery",
        "MasterCard Transaction",
        "Merchant Payment Service",
        "NBI Service",
        "Passport Upload for International TRX",
        "Top-Up Other Cards Using ZainCash Wallet",
        "Wallet Account Status",
        "Wallet Balance",
        "Wallet Cash-Out",
        "Wallet Limits & Fees",
        "Wallet Local Transfer",
        "Wallet Login",
        "Wallet PIN Reset or Change",
        "Wallet Registration Process",
        "Wallet Top-Up through Agent or Bank",
        "Western Union",
        "Zain IQ Recharge",
        "Wallet Change Number and Termination Process",
        "Inquiry About Outbound Call",
        "Change Wallet MSISDN(Korek)"
    ],
    "Request": [
        "Cancel Wallet Termination Request",
        "Card Statement",
        "Change Wallet MSISDN Status",
        "E-Goods PIN Send",
        "Lock / Unlock Wallet",
        "MasterCard Order Status - Delivery Schedule",
        "MasterCard Balance Refund Request",
        "Request Follow-up",
        "MasterCard Resend PIN",
        "Reset Wallet PIN",
        "Transaction Status Verification",
        "Update Customer Information & Documents",
        "Wallet Statement"
    ],
    "Complaint": [
        "Application Usage",
        "Cashback Issue",
        "E-Goods Other Issue",
        "E-Goods Redemption Failure",
        "Follow-up on Previous Escalation Ticket",
        "Government Bill Payment",
        "Local Transfer Failure",
        "MasterCard Activation Failure",
        "MasterCard Hold / Cancelled Card",
        "MasterCard International Transactions",
        "MasterCard Local Transactions",
        "MasterCard Negative Balance",
        "MasterCard Order or Delay Delivery",
        "MasterCard Top-up Transfer",
        "MasterCard Transaction Dispute",
        "Merchant Payment Failure",
        "NBI Link Issue",
        "Passport Upload",
        "Wallet Cash Disbursement",
        "Wallet Cash-out",
        "Wallet Change MSISDN",
        "Wallet Delay in Receiving OTP/PIN",
        "Wallet Limit-Fees",
        "Wallet Login Failure",
        "Wallet Registration",
        "Wallet Status",
        "Wallet Termination",
        "Wallet Top-up through Visa/Master",
        "Wallet Top-Up through Agent/Bank",
        "Western Union Add-Edit Beneficiary",
        "Western Union Received Money",
        "Western Union Refund Money",
        "Western Union Service on Hold",
        "WU Send Money",
        "Zain IQ Recharge",
        "IllegalAgentCharge"
    ],
    "Fraud & Security": [
        "Fraud or Scam",
        "Other Security Concern",
        "Suspicious Activity",
        "Unauthorized Transaction"
    ],
    "Customer Concern": [
        "Agent attitude",
        "Customer Care attitude",
        "Field Team attitude",
        "Process or Policy"
    ],
    "Support": [
        "English Support",
        "Kurdish Support",
        "Supervisor"
    ],
    "Incident": [
        "Application",
        "Hold Balance",
        "MasterCard",
        "Wallet Service Outage",
        "Western Union Outage"
    ],
    "Incomplete Contact": [
        "Disconnected Before Verification",
        "Disconnected During Conversation",
        "No Response",
        "Silent Call Only",
        "Spam / Junk",
        "Unclear Customer Request",
        "Traning & Test"
    ],
    "Social Media": [
        "Wallet / Application",
        "Mastercards (WalletCards)",
        "Western Union",
        "Digital Goods",
        "Cash-In by VISA/MC (HC)",
        "Zain IQ Top-Up",
        "Merchant Payment",
        "NBI",
        "GOV Bill Payment",
        "Report Fraud or Scam",
        "Junk",
        "Suggestion",
        "Positive Feedback",
        "Negative Feedback"
    ]
};
        window.DISPOSITION_DATA = DISPOSITION_DATA;

                for (let i = 1; i <= numChats; i++) {
            const inputEl = document.getElementById(`chat-input-${i}`);
            const sendBtn = document.getElementById(`chat-send-${i}`);
            const closeBtn = document.getElementById(`chat-close-${i}`);
            const backBtn = document.getElementById(`chat-back-${i}`);
            const profileBtn = document.getElementById(`chat-profile-${i}`);
            
            const dispPanel = document.getElementById(`disposition-panel-${i}`);
            const profPanel = document.getElementById(`profile-panel-${i}`);

            const dispBlock = document.getElementById(`disp-block-${i}`);
            const dispTrigger = document.getElementById(`disp-select-trigger-${i}`);
            const dispText = document.getElementById(`disp-selected-text-${i}`);
            const dispPopup = document.getElementById(`disp-popup-${i}`);
            const dispSearch = document.getElementById(`disp-search-${i}`);
            const dispList = document.getElementById(`disp-list-${i}`);

            const subDispBlock = document.getElementById(`sub-disp-block-${i}`);
            const subDispTrigger = document.getElementById(`sub-disp-select-trigger-${i}`);
            const subDispText = document.getElementById(`sub-disp-selected-text-${i}`);
            const subDispPopup = document.getElementById(`sub-disp-popup-${i}`);
            const subDispSearch = document.getElementById(`sub-disp-search-${i}`);
            const subDispList = document.getElementById(`sub-disp-list-${i}`);

            const saveBtn = document.getElementById(`btn-save-dispose-${i}`);
            const quickButtons = document.querySelectorAll(`.quick-disp-btn[data-chat="${i}"]`);

            let currentDisp = '';
            let currentSubDisp = '';

            const checkValidity = () => {
                if (currentDisp && currentSubDisp) {
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.classList.add('active');
                    }
                } else {
                    if (saveBtn) {
                        saveBtn.disabled = true;
                        saveBtn.classList.remove('active');
                    }
                }
            };

            const populateDispOptions = (filter = '') => {
                if (!dispList) return;
                const query = filter.toLowerCase().trim();
                const categories = Object.keys(DISPOSITION_DATA);
                const filtered = categories.filter(c => c.toLowerCase().includes(query));

                let html = `<div class="disp-dropdown-item ${!currentDisp ? 'selected' : ''}" data-val="">Select a Disposition</div>`;
                filtered.forEach(c => {
                    html += `<div class="disp-dropdown-item ${currentDisp === c ? 'selected' : ''}" data-val="${c}">${c}</div>`;
                });
                dispList.innerHTML = html;

                dispList.querySelectorAll('.disp-dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const val = item.getAttribute('data-val');
                        currentDisp = val;
                        quickButtons.forEach(b => b.classList.remove('active'));

                        if (dispText) {
                            dispText.textContent = val || 'Select a Disposition';
                            if (val) dispTrigger.classList.add('has-value');
                            else dispTrigger.classList.remove('has-value');
                        }
                        closePopups();

                        // Reset sub disposition
                        currentSubDisp = '';
                        if (subDispText) {
                            subDispText.textContent = 'Select a Sub Disposition';
                            subDispTrigger.classList.remove('has-value');
                        }
                        checkValidity();

                        // Automatically open Sub Disposition popup
                        if (val) {
                            setTimeout(() => {
                                openSubDispPopup();
                            }, 50);
                        }
                    });
                });
            };

            const populateSubDispOptions = (filter = '') => {
                if (!subDispList) return;
                const query = filter.toLowerCase().trim();
                let options = [];

                if (currentDisp && DISPOSITION_DATA[currentDisp]) {
                    options = DISPOSITION_DATA[currentDisp].map(s => ({ disp: currentDisp, sub: s }));
                } else {
                    Object.keys(DISPOSITION_DATA).forEach(d => {
                        DISPOSITION_DATA[d].forEach(s => {
                            options.push({ disp: d, sub: s });
                        });
                    });
                }

                const filtered = options.filter(o => o.sub.toLowerCase().includes(query));
                let html = `<div class="disp-dropdown-item ${!currentSubDisp ? 'selected' : ''}" data-disp="" data-sub="">Select a Sub Disposition</div>`;
                filtered.forEach(o => {
                    html += `<div class="disp-dropdown-item ${currentSubDisp === o.sub ? 'selected' : ''}" data-disp="${o.disp}" data-sub="${o.sub}">${o.sub}</div>`;
                });
                subDispList.innerHTML = html;

                subDispList.querySelectorAll('.disp-dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const sub = item.getAttribute('data-sub');
                        const disp = item.getAttribute('data-disp');
                        currentSubDisp = sub;
                        quickButtons.forEach(b => b.classList.remove('active'));

                        if (sub) {
                            if (!currentDisp && disp) {
                                currentDisp = disp;
                                if (dispText) {
                                    dispText.textContent = disp;
                                    dispTrigger.classList.add('has-value');
                                }
                            }
                            if (subDispText) {
                                subDispText.textContent = sub;
                                subDispTrigger.classList.add('has-value');
                            }
                        } else {
                            if (subDispText) {
                                subDispText.textContent = 'Select a Sub Disposition';
                                subDispTrigger.classList.remove('has-value');
                            }
                        }
                        closePopups();
                        checkValidity();
                    });
                });
            };

            const closePopups = () => {
                if (dispPopup) dispPopup.classList.add('hidden');
                if (dispBlock) dispBlock.classList.remove('open');
                if (subDispPopup) subDispPopup.classList.add('hidden');
                if (subDispBlock) subDispBlock.classList.remove('open');
            };

            const openDispPopup = () => {
                closePopups();
                populateDispOptions('');
                if (dispPopup) dispPopup.classList.remove('hidden');
                if (dispBlock) dispBlock.classList.add('open');
                if (dispSearch) {
                    dispSearch.value = '';
                    setTimeout(() => dispSearch.focus(), 30);
                }
            };

            const openSubDispPopup = () => {
                closePopups();
                populateSubDispOptions('');
                if (subDispPopup) subDispPopup.classList.remove('hidden');
                if (subDispBlock) subDispBlock.classList.add('open');
                if (subDispSearch) {
                    subDispSearch.value = '';
                    setTimeout(() => subDispSearch.focus(), 30);
                }
            };

            if (dispTrigger) {
                dispTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (dispPopup && !dispPopup.classList.contains('hidden')) {
                        closePopups();
                    } else {
                        openDispPopup();
                    }
                });
            }

            if (subDispTrigger) {
                subDispTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (subDispPopup && !subDispPopup.classList.contains('hidden')) {
                        closePopups();
                    } else {
                        openSubDispPopup();
                    }
                });
            }

            if (dispSearch) {
                dispSearch.addEventListener('input', () => {
                    populateDispOptions(dispSearch.value);
                });
                dispSearch.addEventListener('click', (e) => e.stopPropagation());
            }

            if (subDispSearch) {
                subDispSearch.addEventListener('input', () => {
                    populateSubDispOptions(subDispSearch.value);
                });
                subDispSearch.addEventListener('click', (e) => e.stopPropagation());
            }

            document.addEventListener('click', () => {
                closePopups();
            });

            if (inputEl && isAi) {
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiSendMessage(i);
                    }
                });
            }

            if (sendBtn && isAi) {
                sendBtn.addEventListener('click', () => {
                    handleAiSendMessage(i);
                });
            }

            quickButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const dispVal = btn.getAttribute('data-disp');
                    const subVal = btn.getAttribute('data-sub');

                    currentDisp = dispVal;
                    currentSubDisp = subVal;

                    if (dispText) {
                        dispText.textContent = dispVal;
                        dispTrigger.classList.add('has-value');
                    }
                    if (subDispText) {
                        subDispText.textContent = subVal;
                        subDispTrigger.classList.add('has-value');
                    }

                    quickButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    closePopups();
                    checkValidity();
                });
            });

            if (closeBtn && dispPanel) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (disposedChats[i]) return;
                    dispPanel.classList.toggle('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (profileBtn && profPanel) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profPanel.classList.toggle('hidden');
                    if (dispPanel) dispPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (dispPanel) dispPanel.classList.add('hidden');
                    if (profPanel) profPanel.classList.add('hidden');
                    closePopups();
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (currentDisp && currentSubDisp) {
                        disposedChats[i] = true;
                        userDispositions[i] = { disp: currentDisp, subDisp: currentSubDisp };
                        
                        if (dispPanel) dispPanel.classList.add('hidden');
                        
                        const disposedOverlay = document.getElementById(`disposed-overlay-${i}`);
                        if (disposedOverlay) {
                            disposedOverlay.classList.remove('hidden');
                        }
                        
                        const chatInp = document.getElementById(`chat-input-${i}`);
                        if (chatInp) {
                            chatInp.disabled = true;
                            chatInp.placeholder = 'Chat resolved and disposed.';
                        }
                        const optBox = document.getElementById(`simulator-options-${i}`);
                        if (optBox) {
                            optBox.innerHTML = '';
                        }
                        
                        showToast(`Chat ${i} disposed successfully.`, 'success');
                    }
                });
            }

            const smileyBtn = document.getElementById(`chat-smiley-${i}`);
            const picker = document.getElementById(`emoji-picker-${i}`);

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
            showToast('الرجاء تصنيف وإنهاء جميع المحادثات الثلاثة قبل تسليم التقييم!', 'error');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-session');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري استخراج النتيجة...';
        }

        try {
            // Rubric Totals
            let totalGreeting = 0; // max 5 * 3 = 15
            let totalTone = 0;     // max 5 * 3 = 15
            let totalProbing = 0;  // max 15 * 3 = 45
            let totalAccuracy = 0; // max 35 * 3 = 105
            let totalCompliance = 0; // max 35 * 3 = 105
            let totalDisp = 0;     // max 5 * 3 = 15

            let detailsHtml = `
                <div style="direction: rtl; text-align: right; font-family: var(--font-ar); line-height: 1.7; display:flex; flex-direction:column; gap:16px;">
                    <h3 style="font-size:1.15rem; font-weight:800; color:#1e1b4b; margin:0; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
                        <i class="fa-solid fa-square-poll-vertical" style="color:var(--primary);"></i> تقرير تحليل أداء التذاكر بالتفصيل:
                    </h3>
            `;

            multiChatAgent.chats.forEach(chat => {
                const sc = chat.originalScenario;
                const turns = sc.turns || [];
                
                let chatGreeting = 0;
                let chatProbing = 0;
                let chatAccuracy = 0;
                let chatTone = 0;
                let chatCompliance = 0;
                let chatDispScore = 0;

                let possibleGreeting = 0;
                let possibleTone = 0;
                let possibleProbing = 0;
                let possibleAccuracy = 0;
                let possibleCompliance = 0;
                let possibleDisp = sc.classificationWeight !== undefined ? sc.classificationWeight : 5;

                turns.forEach((turn, turnIdx) => {
                    possibleGreeting += turn.greetingWeight !== undefined ? turn.greetingWeight : (turnIdx === 0 ? 5 : 0);
                    possibleTone += turn.toneWeight !== undefined ? turn.toneWeight : (turnIdx === 2 ? 5 : 0);
                    possibleProbing += turn.probingWeight !== undefined ? turn.probingWeight : (turnIdx === 0 ? 15 : 0);
                    possibleAccuracy += turn.accuracyWeight !== undefined ? turn.accuracyWeight : (turnIdx === 1 ? 35 : 0);
                    possibleCompliance += turn.complianceWeight !== undefined ? turn.complianceWeight : (turnIdx === 2 ? 35 : 0);
                });

                let chatPossibleTotal = possibleGreeting + possibleTone + possibleProbing + possibleAccuracy + possibleCompliance + possibleDisp;
                if (chatPossibleTotal <= 0) chatPossibleTotal = 100;

                // 1. Calculate MCQ choices scores per turn
                turns.forEach((turn, turnIdx) => {
                    const selectedIdx = (simulatorSelectedAnswers[chat.id] && simulatorSelectedAnswers[chat.id][turnIdx] !== undefined)
                        ? simulatorSelectedAnswers[chat.id][turnIdx]
                        : -1;
                    
                    const opt = selectedIdx >= 0 ? turn.options[selectedIdx] : null;
                    if (opt && opt.isCorrect) {
                        chatGreeting += turn.greetingWeight !== undefined ? turn.greetingWeight : (turnIdx === 0 ? 5 : 0);
                        chatTone += turn.toneWeight !== undefined ? turn.toneWeight : (turnIdx === 2 ? 5 : 0);
                        chatProbing += turn.probingWeight !== undefined ? turn.probingWeight : (turnIdx === 0 ? 15 : 0);
                        chatAccuracy += turn.accuracyWeight !== undefined ? turn.accuracyWeight : (turnIdx === 1 ? 35 : 0);
                        chatCompliance += turn.complianceWeight !== undefined ? turn.complianceWeight : (turnIdx === 2 ? 35 : 0);
                    }
                });

                // 2. Ticket Disposition Score
                const selectedDisp = document.getElementById(`disp-select-${chat.id}`)?.value || '';
                const selectedSub = document.getElementById(`sub-disp-select-${chat.id}`)?.value || '';
                const expectedDisp = sc.correctDisp || '';
                const expectedSub = sc.correctSubDisp || '';

                const mainCorrect = (selectedDisp === expectedDisp && expectedDisp);
                const subCorrect = (selectedSub === expectedSub && expectedSub);

                if (mainCorrect) chatDispScore += (possibleDisp / 2);
                if (subCorrect) chatDispScore += (possibleDisp / 2);

                // Add to overall rubrics possible and awarded
                totalGreeting += chatGreeting;
                totalTone += chatTone;
                totalProbing += chatProbing;
                totalAccuracy += chatAccuracy;
                totalCompliance += chatCompliance;
                totalDisp += chatDispScore;

                // Track possible totals
                if (!window.totalGreetingPossible) {
                    window.totalGreetingPossible = 0;
                    window.totalTonePossible = 0;
                    window.totalProbingPossible = 0;
                    window.totalAccuracyPossible = 0;
                    window.totalCompliancePossible = 0;
                    window.totalDispPossible = 0;
                }
                window.totalGreetingPossible += possibleGreeting;
                window.totalTonePossible += possibleTone;
                window.totalProbingPossible += possibleProbing;
                window.totalAccuracyPossible += possibleAccuracy;
                window.totalCompliancePossible += possibleCompliance;
                window.totalDispPossible += possibleDisp;

                const chatTotal = Math.round((chatGreeting + chatProbing + chatAccuracy + chatTone + chatCompliance + chatDispScore) / chatPossibleTotal * 100);

                detailsHtml += `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #e2e8f0; padding-bottom:8px; margin-bottom:10px;">
                            <h4 style="margin: 0; color: #1e1b4b; font-size: 0.95rem; font-weight: 800;"><i class="fa-solid fa-user-tag" style="color:#4f46e5;"></i> العميل: ${escapeHtml(chat.customerName)}</h4>
                            <span style="background:${chatTotal >= 80 ? '#f0fdf4' : chatTotal >= 60 ? '#fff7ed' : '#fef2f2'}; color:${chatTotal >= 80 ? '#166534' : chatTotal >= 60 ? '#c2410c' : '#991b1b'}; border:1px solid ${chatTotal >= 80 ? '#bbf7d0' : chatTotal >= 60 ? '#fed7aa' : '#fecdd3'}; font-size:0.8rem; font-weight:800; padding:2px 10px; border-radius:20px;">
                                تقييم المحادثة: ${chatTotal}%
                            </span>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:0.8rem; color:#475569;">
                            <div>• التحية والتعريف: <strong style="color:${chatGreeting === possibleGreeting && possibleGreeting > 0 ? '#16a34a' : '#dc2626'}">${chatGreeting} / ${possibleGreeting}</strong></div>
                            <div>• فهم واستيضاح المشكلة: <strong style="color:${chatProbing === possibleProbing && possibleProbing > 0 ? '#16a34a' : '#dc2626'}">${chatProbing} / ${possibleProbing}</strong></div>
                            <div>• دقة الحل والمعلومات: <strong style="color:${chatAccuracy === possibleAccuracy && possibleAccuracy > 0 ? '#16a34a' : '#dc2626'}">${chatAccuracy} / ${possibleAccuracy}</strong></div>
                            <div>• الأسلوب واللغة والكتابة: <strong style="color:${chatTone === possibleTone && possibleTone > 0 ? '#16a34a' : '#dc2626'}">${chatTone} / ${possibleTone}</strong></div>
                            <div>• السياسات والسرية والخصوصية: <strong style="color:${chatCompliance === possibleCompliance && possibleCompliance > 0 ? '#16a34a' : '#dc2626'}">${chatCompliance} / ${possibleCompliance}</strong></div>
                            <div>• تصنيف التذكرة المعتمد: <strong style="color:${chatDispScore === possibleDisp && possibleDisp > 0 ? '#16a34a' : '#dc2626'}">${chatDispScore} / ${possibleDisp}</strong></div>
                        </div>
                        <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #f1f5f9; font-size:0.75rem; color:#64748b;">
                            <strong>التصنيف المختار:</strong> ${escapeHtml(selectedDisp)} / ${escapeHtml(selectedSub)} 
                            ${mainCorrect && subCorrect ? '<span style="color:#16a34a; font-weight:bold;">(مطابق للسياسة ✓)</span>' : '<span style="color:#dc2626; font-weight:bold;">(غير مطابق للسياسة ✗)</span>'}
                        </div>
                    </div>
                `;
            });

            // Calculate exact weighted averages relative to the rubrics possible points
            const gp = window.totalGreetingPossible || 15;
            const tp = window.totalTonePossible || 15;
            const pp = window.totalProbingPossible || 45;
            const ap = window.totalAccuracyPossible || 105;
            const cp = window.totalCompliancePossible || 105;
            const dp = window.totalDispPossible || 15;

            const avgGreeting = Math.round(totalGreeting / gp * 5);
            const avgTone = Math.round(totalTone / tp * 5);
            const avgProbing = Math.round(totalProbing / pp * 15);
            const avgAccuracy = Math.round(totalAccuracy / ap * 35);
            const avgCompliance = Math.round(totalCompliance / cp * 35);
            const avgDisp = Math.round(totalDisp / dp * 5);

            // Reset temp window possible totals
            window.totalGreetingPossible = 0;
            window.totalTonePossible = 0;
            window.totalProbingPossible = 0;
            window.totalAccuracyPossible = 0;
            window.totalCompliancePossible = 0;
            window.totalDispPossible = 0;

            // Final Overall Score
            const overallScore = Math.round(avgGreeting + avgTone + avgProbing + avgAccuracy + avgCompliance + avgDisp);

            let grade = 'مقبول';
            let gradeColor = 'text-gradient';
            if (overallScore === 100) {
                grade = 'خبير معتمد (امتياز كامل) 🌟';
                gradeColor = 'text-green';
            } else if (overallScore >= 90) {
                grade = 'امتياز';
                gradeColor = 'text-green';
            } else if (overallScore >= 75) {
                grade = 'جيد جداً';
                gradeColor = 'text-green';
            } else if (overallScore >= 60) {
                grade = 'جيد';
                gradeColor = 'text-gradient';
            } else {
                grade = 'ضعيف / يحتاج تدريب ومراجعة';
                gradeColor = 'text-red';
            }

            // Summary Rubric Table
            detailsHtml += `
                <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:18px; margin-top:5px;">
                    <h4 style="margin:0 0 10px 0; color:#0f172a; font-size:0.95rem; font-weight:800; border-bottom:1px solid #cbd5e1; padding-bottom:6px;">
                        🎯 الخلاصة الإجمالية لتوزيع درجات التقييم (Weighted Score):
                    </h4>
                    <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:right;">
                        <thead>
                            <tr style="border-bottom:2px solid #cbd5e1; color:#0f172a; font-weight:800;">
                                <th style="padding:6px 0;">معيار التقييم</th>
                                <th style="padding:6px 0; text-align:center;">الوزن</th>
                                <th style="padding:6px 0; text-align:center;">الدرجة المكتسبة</th>
                                <th style="padding:6px 0; text-align:center;">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:8px 0;">التحية والتعريف</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">5%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgGreeting === 5 ? '#16a34a' : '#dc2626'}">${avgGreeting}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgGreeting === 5 ? '#16a34a' : '#dc2626'}">${avgGreeting === 5 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:8px 0;">الأسلوب واللغة والكتابة</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">5%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgTone === 5 ? '#16a34a' : '#dc2626'}">${avgTone}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgTone === 5 ? '#16a34a' : '#dc2626'}">${avgTone === 5 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:8px 0;">فهم المشكلة واستيضاحها</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">15%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgProbing === 15 ? '#16a34a' : '#dc2626'}">${avgProbing}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgProbing === 15 ? '#16a34a' : '#dc2626'}">${avgProbing === 15 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:8px 0;">دقة الحل والمعلومات المقدمة</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">35%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgAccuracy === 35 ? '#16a34a' : '#dc2626'}">${avgAccuracy}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgAccuracy === 35 ? '#16a34a' : '#dc2626'}">${avgAccuracy === 35 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:8px 0;">الالتزام بالإجراءات والسياسات والخصوصية</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">35%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgCompliance === 35 ? '#16a34a' : '#dc2626'}">${avgCompliance}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgCompliance === 35 ? '#16a34a' : '#dc2626'}">${avgCompliance === 35 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="border-bottom:2px solid #cbd5e1;">
                                <td style="padding:8px 0;">تصنيف المكالمة / الشات الصحيح</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700;">5%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:800; color:${avgDisp === 5 ? '#16a34a' : '#dc2626'}">${avgDisp}%</td>
                                <td style="padding:8px 0; text-align:center; font-weight:700; color:${avgDisp === 5 ? '#16a34a' : '#dc2626'}">${avgDisp === 5 ? 'مستوفى' : 'غير مستوفى'}</td>
                            </tr>
                            <tr style="background:#e2e8f0; font-weight:800; font-size:0.9rem;">
                                <td style="padding:10px 8px;">النتيجة الكلية الموزونة</td>
                                <td style="padding:10px 8px; text-align:center;">100%</td>
                                <td style="padding:10px 8px; text-align:center; color:${overallScore === 100 ? '#16a34a' : '#dc2626'}">${overallScore}%</td>
                                <td style="padding:10px 8px; text-align:center; color:${overallScore === 100 ? '#16a34a' : '#dc2626'}">${overallScore === 100 ? 'معتمد كامل' : 'غير مكتمل'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;

            // 3. Handle Certificate Block rendering (ONLY unlocked at 100%)
            const certBlock = document.getElementById('certificate-block');
            if (overallScore === 100) {
                // Generate a unique Certificate ID
                const randomId = Math.floor(1000 + Math.random() * 9000);
                const today = new Date().toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
                const agentName = currentUser ? currentUser.name : "ممثل خدمة العملاء";
                
                detailsHtml += `
                    <div id="certificate-print-area" style="background:#ffffff; border:12px double #d97706; border-radius:16px; padding:35px; text-align:center; font-family:'Cairo', sans-serif; direction:rtl; margin-top:20px; box-shadow:0 10px 30px rgba(217,119,6,0.15); position:relative;">
                        <!-- Gold seal icon -->
                        <div style="font-size:3.5rem; color:#d97706; margin-bottom:12px;"><i class="fa-solid fa-award"></i></div>
                        <h2 style="font-size:1.6rem; font-weight:900; color:#1e1b4b; margin:0 0 10px 0; letter-spacing:0.5px;">شهادة تميز وإنجاز رسمي</h2>
                        <p style="font-size:0.9rem; color:#64748b; margin:0 0 20px 0;">تمنحها أكاديمية تدريب خدمة العملاء لشركة زين كاش</p>
                        
                        <p style="font-size:0.95rem; color:#475569; margin:0 0 8px 0;">نشهد بموجب هذا أن ممثل خدمة العملاء المتميز:</p>
                        <h3 style="font-size:1.5rem; font-weight:900; color:#4f46e5; margin:0 0 15px 0; text-decoration:underline;">${escapeHtml(agentName)}</h3>
                        
                        <p style="font-size:0.95rem; color:#475569; line-height:1.6; margin:0 0 25px 0; max-width:600px; margin-left:auto; margin-right:auto;">
                            قد اجتاز بنجاح تام **اختبار محاكي الدردشة المتكامل لخدمة تداول الأسهم والخدمات المالية** محققاً الدرجة الكاملة **(100%)** في دقة الحلول، الالتزام بقواعد الامتثال والسرية، وجودة الأسلوب واللغة الرسمية.
                        </p>
                        
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:2px solid #cbd5e1; padding-top:20px; font-size:0.8rem; color:#64748b; max-width:550px; margin-left:auto; margin-right:auto;">
                            <div>رقم الشهادة: <strong>ZC-STOCKS-${randomId}</strong></div>
                            <div>تاريخ الإصدار: <strong>${today}</strong></div>
                            <div style="font-weight:800; color:#d97706;"><i class="fa-solid fa-stamp"></i> ختم الأكاديمية الرسمي</div>
                        </div>

                        <!-- Print Trigger Button -->
                        <button onclick="window.print();" class="btn btn-primary" style="margin-top:25px; padding:10px 24px; font-weight:800; font-size:0.85rem; background:linear-gradient(135deg, #d97706, #b45309); border:none; box-shadow:0 4px 12px rgba(217,119,6,0.3); border-radius:10px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;">
                            <i class="fa-solid fa-print"></i> طباعة وتنزيل الشهادة الرسمية
                        </button>
                    </div>
                `;
            } else {
                detailsHtml += `
                    <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:12px; padding:15px; margin-top:20px; text-align:center; font-size:0.85rem; color:#b45309;">
                        <i class="fa-solid fa-circle-exclamation" style="font-size:1.2rem;"></i> <strong>ملاحظة:</strong> شهادة التميز والإنجاز الذهبية تُمنح للموظفين الذين يحققون درجة <strong>100% كاملة</strong> في التقييم الموزون. حاول مرة أخرى لتحقيق الدرجة الكاملة!
                    </div>
                `;
            }

            detailsHtml += '</div>';

            const resScore = document.getElementById('res-score');
            const resErrors = document.getElementById('res-errors');
            const resGrade = document.getElementById('res-grade');
            const resNotes = document.getElementById('res-notes-text');
            const resultsOverlay = document.getElementById('results-overlay');

            if (resScore) resScore.textContent = `${overallScore}%`;
            // Errors count is any criteria not 100% satisfied
            let finalErrorsCount = 0;
            if (avgGreeting < 5) finalErrorsCount++;
            if (avgTone < 5) finalErrorsCount++;
            if (avgProbing < 15) finalErrorsCount++;
            if (avgAccuracy < 35) finalErrorsCount++;
            if (avgCompliance < 35) finalErrorsCount++;
            if (avgDisp < 5) finalErrorsCount++;
            
            if (resErrors) resErrors.textContent = finalErrorsCount;
            if (resGrade) {
                resGrade.textContent = grade;
                resGrade.className = `res-val ${gradeColor}`;
            }
            if (resNotes) {
                resNotes.innerHTML = detailsHtml;
            }

            if (currentUser) {
                const resultData = {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    score: overallScore,
                    errorsCount: finalErrorsCount,
                    grade: grade,
                    detailsHtml: detailsHtml
                };
                try {
                    await apiCall('/api/results', 'POST', resultData);
                    
                    if (isTestAssigned) {
                        await apiCall('/api/test-session/complete', 'POST', { userId: currentUser.id, testType: 'simulator' });
                        if (testTimerInterval) clearInterval(testTimerInterval);
                        const timerBanner = document.getElementById('test-timer-banner');
                        if (timerBanner) timerBanner.classList.add('hidden');
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
                submitBtn.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> تسليم التقييم واستخراج النتيجة';
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

    function populateDispositionDropdowns(mainId, subId) {
        const mainSel = document.getElementById(mainId);
        const subSel = document.getElementById(subId);
        if (!mainSel || !subSel) return;

        const dispData = window.DISPOSITION_DATA || {};
        mainSel.innerHTML = '<option value="">اختر التصنيف الرئيسي</option>' +
            Object.keys(dispData).map(k => `<option value="${k}">${k}</option>`).join('');

        mainSel.addEventListener('change', () => {
            const mainVal = mainSel.value;
            if (mainVal && dispData[mainVal]) {
                subSel.innerHTML = '<option value="">اختر التصنيف الفرعي</option>' +
                    dispData[mainVal].map(s => `<option value="${s}">${s}</option>`).join('');
            } else {
                subSel.innerHTML = '<option value="">اختر التصنيف الفرعي</option>';
            }
        });
    }

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

        // Dynamically rebuild Turn options dropdown based on actual turns
        if (editTurnSelect) {
            editTurnSelect.innerHTML = '';
            const turnsCount = (sc.turns || []).length || 1;
            for (let t = 0; t < turnsCount; t++) {
                const opt = document.createElement('option');
                opt.value = t.toString();
                opt.textContent = `Turn ${t + 1}${t === 0 ? ' (Beginning of Conversation)' : ''}`;
                editTurnSelect.appendChild(opt);
            }
            editTurnSelect.value = "0";
        }

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

        const wClass = document.getElementById('edit-scenario-weight-classification');
        if (wClass) {
            wClass.value = sc.classificationWeight !== undefined ? sc.classificationWeight : 5;
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

        const wGreeting = document.getElementById('edit-turn-weight-greeting');
        const wTone = document.getElementById('edit-turn-weight-tone');
        const wProbing = document.getElementById('edit-turn-weight-probing');
        const wAccuracy = document.getElementById('edit-turn-weight-accuracy');
        const wCompliance = document.getElementById('edit-turn-weight-compliance');

        if (wGreeting) wGreeting.value = turn.greetingWeight !== undefined ? turn.greetingWeight : (turnIdx === 0 ? 5 : 0);
        if (wTone) wTone.value = turn.toneWeight !== undefined ? turn.toneWeight : (turnIdx === 2 ? 5 : 0);
        if (wProbing) wProbing.value = turn.probingWeight !== undefined ? turn.probingWeight : (turnIdx === 0 ? 15 : 0);
        if (wAccuracy) wAccuracy.value = turn.accuracyWeight !== undefined ? turn.accuracyWeight : (turnIdx === 1 ? 35 : 0);
        if (wCompliance) wCompliance.value = turn.complianceWeight !== undefined ? turn.complianceWeight : (turnIdx === 2 ? 35 : 0);

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

        const wGreeting = document.getElementById('edit-turn-weight-greeting');
        const wTone = document.getElementById('edit-turn-weight-tone');
        const wProbing = document.getElementById('edit-turn-weight-probing');
        const wAccuracy = document.getElementById('edit-turn-weight-accuracy');
        const wCompliance = document.getElementById('edit-turn-weight-compliance');

        if (wGreeting) turn.greetingWeight = parseInt(wGreeting.value) || 0;
        if (wTone) turn.toneWeight = parseInt(wTone.value) || 0;
        if (wProbing) turn.probingWeight = parseInt(wProbing.value) || 0;
        if (wAccuracy) turn.accuracyWeight = parseInt(wAccuracy.value) || 0;
        if (wCompliance) turn.complianceWeight = parseInt(wCompliance.value) || 0;

        const wClass = document.getElementById('edit-scenario-weight-classification');
        if (wClass) {
            sc.classificationWeight = parseInt(wClass.value) || 0;
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

    const btnAddTurn = document.getElementById('btn-add-turn');
    if (btnAddTurn) {
        btnAddTurn.addEventListener('click', () => {
            if (selectedScenarioIndex === null) return;
            const sc = scenarios[selectedScenarioIndex];
            if (!sc) return;
            if (!sc.turns) sc.turns = [];

            // Save current turn state first
            saveTurnToMemory(selectedScenarioIndex, selectedTurnIndex);

            // Add a new turn with empty options
            const newTurnIdx = sc.turns.length;
            sc.turns.push({
                step: newTurnIdx + 1,
                customerText: `رسالة الجولة ${newTurnIdx + 1}...`,
                greetingWeight: 0,
                toneWeight: 0,
                probingWeight: 0,
                accuracyWeight: 0,
                complianceWeight: 0,
                options: [
                    { text: "الرد المقترح الأول", isCorrect: false, feedback: "" },
                    { text: "الرد المقترح الثاني", isCorrect: true, feedback: "" },
                    { text: "الرد المقترح الثالث", isCorrect: false, feedback: "" }
                ]
            });

            // Rebuild dropdown select
            if (editTurnSelect) {
                editTurnSelect.innerHTML = '';
                for (let t = 0; t < sc.turns.length; t++) {
                    const opt = document.createElement('option');
                    opt.value = t.toString();
                    opt.textContent = `Turn ${t + 1}${t === 0 ? ' (Beginning of Conversation)' : ''}`;
                    editTurnSelect.appendChild(opt);
                }
                editTurnSelect.value = newTurnIdx.toString();
            }

            selectedTurnIndex = newTurnIdx;
            loadScenarioTurn(selectedScenarioIndex, selectedTurnIndex);
            showToast("تمت إضافة جولة جديدة بنجاح", "success");
        });
    }

    const btnDeleteTurn = document.getElementById('btn-delete-turn');
    if (btnDeleteTurn) {
        btnDeleteTurn.addEventListener('click', () => {
            if (selectedScenarioIndex === null) return;
            const sc = scenarios[selectedScenarioIndex];
            if (!sc || !sc.turns || sc.turns.length <= 1) {
                showToast("لا يمكن حذف الجولة الوحيدة المتبقية!", "error");
                return;
            }

            // Remove current turn
            sc.turns.splice(selectedTurnIndex, 1);

            // Re-index steps
            sc.turns.forEach((t, idx) => {
                t.step = idx + 1;
            });

            // Rebuild dropdown select
            if (editTurnSelect) {
                editTurnSelect.innerHTML = '';
                for (let t = 0; t < sc.turns.length; t++) {
                    const opt = document.createElement('option');
                    opt.value = t.toString();
                    opt.textContent = `Turn ${t + 1}${t === 0 ? ' (Beginning of Conversation)' : ''}`;
                    editTurnSelect.appendChild(opt);
                }
                editTurnSelect.value = "0";
            }

            selectedTurnIndex = 0;
            loadScenarioTurn(selectedScenarioIndex, 0);
            showToast("تم حذف الجولة بنجاح", "success");
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
    // ADMIN PANEL — AI SCENARIOS MANAGER
    // ==========================================
    let aiScenariosList = [];
    let selectedAiScenarioIndex = null;

    async function loadAiScenariosFromStorage() {
        try {
            const fetched = await apiCall('/api/ai-scenarios', 'GET');
            if (fetched && fetched.length > 0) {
                aiScenariosList = fetched;
            } else {
                aiScenariosList = (typeof defaultAiScenarios !== 'undefined') ? [...defaultAiScenarios] : [];
            }
        } catch(e) {
            console.error('Failed to load AI scenarios from server', e);
            aiScenariosList = (typeof defaultAiScenarios !== 'undefined') ? [...defaultAiScenarios] : [];
        }
    }

    function renderAdminAiScenariosList() {
        const ul = document.getElementById('admin-ai-scenarios-list-ul');
        if (!ul) return;
        ul.innerHTML = '';
        if (aiScenariosList.length === 0) {
            ul.innerHTML = '<li style="padding:12px; color:#94a3b8; font-size:0.82rem;">لا توجد سيناريوهات. اضغط Add New.</li>';
            return;
        }
        aiScenariosList.forEach((sc, idx) => {
            const li = document.createElement('li');
            if (idx === selectedAiScenarioIndex) li.className = 'active';
            li.innerHTML = `
                <span class="li-title" style="font-weight:700;">${sc.customerName || 'بلا اسم'}</span>
                <span class="li-desc" style="font-size:0.75rem; color:#64748b;">${(sc.initialMessage || '').substring(0, 55)}...</span>
            `;
            li.addEventListener('click', () => selectAiScenario(idx));
            ul.appendChild(li);
        });
    }

    function selectAiScenario(idx) {
        selectedAiScenarioIndex = idx;
        const ul = document.getElementById('admin-ai-scenarios-list-ul');
        if (ul) {
            ul.querySelectorAll('li').forEach((li, i) => {
                li.classList.toggle('active', i === idx);
            });
        }
        const noSel = document.getElementById('no-ai-scenario-selected');
        const form  = document.getElementById('ai-scenario-edit-form');

        if (idx === null || idx === undefined || !aiScenariosList[idx]) {
            if (noSel) noSel.classList.remove('hidden');
            if (form)  form.classList.add('hidden');
            return;
        }

        const sc = aiScenariosList[idx];
        if (noSel) noSel.classList.add('hidden');
        if (form)  form.classList.remove('hidden');

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('edit-ai-scenario-id', sc.id);
        setVal('edit-ai-customer-name', sc.customerName);
        setVal('edit-ai-customer-tone', sc.customerTone);
        setVal('edit-ai-initial-message', sc.initialMessage);
        populateDispositionDropdowns('edit-ai-correct-disp', 'edit-ai-correct-sub');
        setTimeout(() => {
            setVal('edit-ai-correct-disp', sc.correctDisp);
            setVal('edit-ai-correct-sub', sc.correctSubDisp);
        }, 80);
        updateAILivePreview();
    }

    function updateAILivePreview() {
        const name = document.getElementById('edit-ai-customer-name')?.value || '-';
        const tone = document.getElementById('edit-ai-customer-tone')?.value || '-';
        const msg  = document.getElementById('edit-ai-initial-message')?.value || 'رسالة البدء...';
        const disp = document.getElementById('edit-ai-correct-disp')?.value || 'Main Disp';
        const sub  = document.getElementById('edit-ai-correct-sub')?.value || 'Sub Disp';

        const panel = document.getElementById('ai-live-preview-panel');
        if (panel) panel.classList.remove('hidden');

        const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setTxt('ai-preview-cust-name', `الزبون: ${name}`);
        setTxt('ai-preview-tone', tone);
        setTxt('ai-preview-initial-msg', msg);
        setTxt('ai-preview-disp', disp);
        setTxt('ai-preview-sub-disp', sub);
    }

    // Add New AI Scenario
    const addNewAiScenarioBtn = document.getElementById('add-new-ai-scenario-btn');
    if (addNewAiScenarioBtn) {
        addNewAiScenarioBtn.addEventListener('click', () => {
            const newSc = {
                id: Date.now(),
                customerName: 'زبون جديد',
                customerTone: 'Polite & Inquiring (مهذب ومستفسر)',
                initialMessage: 'اكتب رسالة الزبون هنا...',
                correctDisp: '',
                correctSubDisp: ''
            };
            aiScenariosList.push(newSc);
            renderAdminAiScenariosList();
            selectAiScenario(aiScenariosList.length - 1);
        });
    }

    // Save AI Scenario
    const aiScenarioEditFormEl = document.getElementById('ai-scenario-edit-form');
    if (aiScenarioEditFormEl) {
        aiScenarioEditFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (selectedAiScenarioIndex === null || !aiScenariosList[selectedAiScenarioIndex]) return;
            const sc = aiScenariosList[selectedAiScenarioIndex];
            sc.customerName   = document.getElementById('edit-ai-customer-name')?.value || sc.customerName;
            sc.customerTone   = document.getElementById('edit-ai-customer-tone')?.value || sc.customerTone;
            sc.initialMessage = document.getElementById('edit-ai-initial-message')?.value || sc.initialMessage;
            sc.correctDisp    = document.getElementById('edit-ai-correct-disp')?.value   || '';
            sc.correctSubDisp = document.getElementById('edit-ai-correct-sub')?.value    || '';
            try {
                await apiCall('/api/ai-scenarios', 'POST', aiScenariosList);
                renderAdminAiScenariosList();
                selectAiScenario(selectedAiScenarioIndex);
                showToast('تم حفظ سيناريو الذكاء الاصطناعي بنجاح ✅', 'success');
            } catch(err) {
                console.error('Failed to save AI scenario', err);
                showToast('فشل حفظ السيناريو. تحقق من الاتصال.', 'error');
            }
        });
    }

    // Delete AI Scenario
    const deleteAiScenarioBtnEl = document.getElementById('delete-ai-scenario-btn');
    if (deleteAiScenarioBtnEl) {
        deleteAiScenarioBtnEl.addEventListener('click', async () => {
            if (selectedAiScenarioIndex === null) return;
            if (!confirm('هل أنت متأكد من حذف هذا السيناريو؟')) return;
            aiScenariosList.splice(selectedAiScenarioIndex, 1);
            try {
                await apiCall('/api/ai-scenarios', 'POST', aiScenariosList);
            } catch(err) {
                console.error('Failed to delete AI scenario', err);
            }
            selectedAiScenarioIndex = null;
            renderAdminAiScenariosList();
            selectAiScenario(null);
            showToast('تم حذف السيناريو بنجاح.', 'success');
        });
    }

    // Attach live preview listeners
    ['edit-ai-customer-name','edit-ai-customer-tone','edit-ai-initial-message','edit-ai-correct-disp','edit-ai-correct-sub'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.addEventListener('input', updateAILivePreview); el.addEventListener('change', updateAILivePreview); }
    });

    // ==========================================
    // CALL SCENARIOS MANAGEMENT (Manage Call Scenarios)
    // ==========================================
    let callScenariosList = [];
    let selectedCallScenarioIndex = null;

    async function loadCallScenariosFromStorage() {
        try {
            const fetched = await apiCall('/api/call-scenarios', 'GET');
            if (fetched && fetched.length > 0) {
                callScenariosList = fetched;
            } else {
                callScenariosList = (typeof CALL_SCENARIOS !== 'undefined') ? [...CALL_SCENARIOS] : [];
            }
        } catch(e) {
            console.error('Failed to load call scenarios from server', e);
            callScenariosList = (typeof CALL_SCENARIOS !== 'undefined') ? [...CALL_SCENARIOS] : [];
        }
    }
    window.loadCallScenariosFromStorage = loadCallScenariosFromStorage;

    function renderAdminCallScenariosList() {
        const ul = document.getElementById('admin-call-scenarios-list-ul');
        if (!ul) return;
        ul.innerHTML = '';
        if (callScenariosList.length === 0) {
            ul.innerHTML = '<li style="padding:12px; color:#94a3b8; font-size:0.82rem;">لا توجد سيناريوهات مكالمات. اضغط إضافة جديد.</li>';
            return;
        }
        callScenariosList.forEach((sc, idx) => {
            const li = document.createElement('li');
            if (idx === selectedCallScenarioIndex) li.className = 'active';
            li.innerHTML = `
                <span class="li-title" style="font-weight:700;">${sc.type === 'outbound' ? '📤' : '📥'} ${escapeHtml(sc.heading || sc.customerName || 'سيناريو')}</span>
                <span class="li-desc" style="font-size:0.75rem; color:#64748b;">${escapeHtml(sc.customerName || '')} • ${sc.campaign || 'Zain Cash'}</span>
            `;
            li.addEventListener('click', () => selectCallScenario(idx));
            ul.appendChild(li);
        });
    }

    function populateCallDispositions(type, targetMainId, targetSubId) {
        const mainSelect = document.getElementById(targetMainId);
        const subSelect = document.getElementById(targetSubId);
        if (!mainSelect || !subSelect) return;

        mainSelect.innerHTML = '';
        subSelect.innerHTML = '';

        if (type === 'outbound') {
            mainSelect.innerHTML = `<option value="Outbound Calls">Outbound Calls</option>`;
            const outSubOptions = [
                "Informations Required",
                "Customer Requested Call",
                "Clarifications Call",
                "Customer Callback",
                "Survey Call",
                "Manager Call",
                "Technical Assistance Follow-up"
            ];
            subSelect.innerHTML = outSubOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        } else {
            // Inbound Dispositions
            Object.keys(GLOBAL_DISPOSITIONS_CATALOG).forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                mainSelect.appendChild(opt);
            });

            const updateSubs = () => {
                const cat = mainSelect.value;
                subSelect.innerHTML = '';
                const subs = GLOBAL_DISPOSITIONS_CATALOG[cat] || [];
                subs.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s;
                    opt.textContent = s;
                    subSelect.appendChild(opt);
                });
            };

            mainSelect.onchange = updateSubs;
            updateSubs();
        }
    }

    function selectCallScenario(idx) {
        selectedCallScenarioIndex = idx;
        const ul = document.getElementById('admin-call-scenarios-list-ul');
        if (ul) {
            ul.querySelectorAll('li').forEach((li, i) => {
                li.classList.toggle('active', i === idx);
            });
        }

        const deleteBtn = document.getElementById('btn-delete-call-scenario');

        if (idx === null || idx === undefined || !callScenariosList[idx]) {
            if (deleteBtn) deleteBtn.style.display = 'none';
            return;
        }

        const sc = callScenariosList[idx];
        if (deleteBtn) deleteBtn.style.display = 'inline-block';

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('call-scenario-heading', sc.heading);
        setVal('call-scenario-type', sc.type || 'inbound');
        setVal('call-scenario-campaign', sc.campaign || 'Zain Cash');
        setVal('call-scenario-cust-name', sc.customerName);
        setVal('call-scenario-cust-phone', sc.customerPhone);
        setVal('call-scenario-balance', sc.balance);
        setVal('call-scenario-wallet-type', sc.walletType);
        setVal('call-scenario-status', sc.status);
        setVal('call-scenario-voice-text', sc.voiceText);

        populateCallDispositions(sc.type || 'inbound', 'call-scenario-correct-disp', 'call-scenario-correct-sub-disp');

        setTimeout(() => {
            setVal('call-scenario-correct-disp', sc.correctDisp);
            setVal('call-scenario-correct-sub-disp', sc.correctSubDisp);
        }, 60);
    }

    // Call Type change updates campaign and dispositions dropdown
    const callScenarioTypeSelect = document.getElementById('call-scenario-type');
    if (callScenarioTypeSelect) {
        callScenarioTypeSelect.addEventListener('change', (e) => {
            const t = e.target.value;
            const campSelect = document.getElementById('call-scenario-campaign');
            if (campSelect) {
                if (t === 'outbound') campSelect.value = 'Test Campaign';
                else campSelect.value = 'Zain Cash';
            }
            populateCallDispositions(t, 'call-scenario-correct-disp', 'call-scenario-correct-sub-disp');
        });
    }

    // Add New Call Scenario
    const addNewCallScenarioBtn = document.getElementById('add-new-call-scenario-btn');
    if (addNewCallScenarioBtn) {
        addNewCallScenarioBtn.addEventListener('click', () => {
            const newSc = {
                id: 'custom-call-' + Date.now(),
                type: 'inbound',
                campaign: 'Zain Cash',
                queue: 'CustomerService_Ar',
                heading: 'سيناريو مكالمة واردة جديدة',
                customerName: 'زبون تجريبي',
                customerPhone: '07720000000',
                balance: '250,000 د.ع',
                walletType: 'دائمية موثقة (Full KYC)',
                status: 'نشطة (Active)',
                voiceText: 'مرحبا أخي، عندي استفسار...',
                correctDisp: 'Inquiry',
                correctSubDisp: 'Application Usage'
            };
            callScenariosList.push(newSc);
            renderAdminCallScenariosList();
            selectCallScenario(callScenariosList.length - 1);
        });
    }

    // Save Call Scenario
    const saveCallScenarioBtn = document.getElementById('btn-save-call-scenario');
    if (saveCallScenarioBtn) {
        saveCallScenarioBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (selectedCallScenarioIndex === null || !callScenariosList[selectedCallScenarioIndex]) return;
            const sc = callScenariosList[selectedCallScenarioIndex];
            
            sc.heading = document.getElementById('call-scenario-heading')?.value || sc.heading;
            sc.type = document.getElementById('call-scenario-type')?.value || sc.type;
            sc.campaign = document.getElementById('call-scenario-campaign')?.value || sc.campaign;
            sc.customerName = document.getElementById('call-scenario-cust-name')?.value || sc.customerName;
            sc.customerPhone = document.getElementById('call-scenario-cust-phone')?.value || sc.customerPhone;
            sc.balance = document.getElementById('call-scenario-balance')?.value || sc.balance;
            sc.walletType = document.getElementById('call-scenario-wallet-type')?.value || sc.walletType;
            sc.status = document.getElementById('call-scenario-status')?.value || sc.status;
            sc.voiceText = document.getElementById('call-scenario-voice-text')?.value || sc.voiceText;
            sc.correctDisp = document.getElementById('call-scenario-correct-disp')?.value || '';
            sc.correctSubDisp = document.getElementById('call-scenario-correct-sub-disp')?.value || '';

            try {
                await apiCall('/api/call-scenarios', 'POST', callScenariosList);
                renderAdminCallScenariosList();
                selectCallScenario(selectedCallScenarioIndex);
                showToast('تم حفظ سيناريو المكالمة الصوتية بنجاح ✅', 'success');
            } catch(err) {
                console.error('Failed to save call scenario', err);
                showToast('فشل حفظ السيناريو. تحقق من الاتصال.', 'error');
            }
        });
    }

    // Test in Simulator (تجربة في المحاكي)
    const testCallScenarioBtn = document.getElementById('btn-test-call-scenario');
    if (testCallScenarioBtn) {
        testCallScenarioBtn.addEventListener('click', () => {
            if (selectedCallScenarioIndex === null || !callScenariosList[selectedCallScenarioIndex]) {
                showToast('يرجى اختيار أو حفظ سيناريو أولاً لتجربته!', 'warning');
                return;
            }
            const sc = callScenariosList[selectedCallScenarioIndex];
            showToast(`🚀 جاري تشغيل السيناريو (${sc.heading || sc.customerName}) في محاكي المكالمات...`, 'info');
            switchTab('tab-call-simulator');
            if (window.initAmeyoCallSimulator) window.initAmeyoCallSimulator();
            setTimeout(() => {
                if (sc.type === 'outbound') {
                    if (window.triggerOutboundCall) window.triggerOutboundCall(sc);
                } else {
                    if (window.triggerIncomingCall) window.triggerIncomingCall(sc);
                }
            }, 350);
        });
    }

    // Delete Call Scenario
    const deleteCallScenarioBtn = document.getElementById('btn-delete-call-scenario');
    if (deleteCallScenarioBtn) {
        deleteCallScenarioBtn.addEventListener('click', async () => {
            if (selectedCallScenarioIndex === null) return;
            if (!confirm('هل أنت متأكد من حذف سيناريو المكالمة هذا؟')) return;
            callScenariosList.splice(selectedCallScenarioIndex, 1);
            try {
                await apiCall('/api/call-scenarios', 'POST', callScenariosList);
            } catch(err) {
                console.error('Failed to delete call scenario', err);
            }
            selectedCallScenarioIndex = null;
            renderAdminCallScenariosList();
            selectCallScenario(null);
            showToast('تم حذف سيناريو المكالمة بنجاح.', 'success');
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
    let isTestSessionActive = false;
    window.isTestSessionActive = false;
    
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
                sessionStorage.removeItem('zain_cash_user');
            }
        }

        const storedUserStr = sessionStorage.getItem('zain_cash_user');
        if (storedUserStr) {
            try {
                const parsed = JSON.parse(storedUserStr);
                const user = await apiCall('/api/login', 'POST', { username: parsed.id || parsed.name });
                sessionStorage.setItem('zain_cash_user', JSON.stringify(user));
                currentUser = user;
                await onUserLoggedIn();
                return;
            } catch(e) {
                console.warn("Invalid user session cleared:", e);
                sessionStorage.removeItem('zain_cash_user');
                currentUser = null;
            }
        }

        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.style.display = 'flex';
        }
    }

    const doLogin = async () => {
        let username = '';
        if (loginUsernameInput) username = loginUsernameInput.value.trim();
        if (!username) {
            if (loginErrorMsg) {
                loginErrorMsg.textContent = 'Please enter your ZC employee code.';
                loginErrorMsg.classList.remove('hidden');
            }
            return;
        }

        const submitBtn = document.getElementById('login-submit-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.querySelector('span').textContent = 'Checking...'; }
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden');

        try {
            const user = await apiCall('/api/login', 'POST', { username: username });
            sessionStorage.setItem('zain_cash_user', JSON.stringify(user));
            currentUser = user;

            if (loginScreen) {
                loginScreen.classList.add('hidden');
                loginScreen.style.display = 'none';
            }

            try {
                await onUserLoggedIn();
            } catch(e) {
                console.error("Error inside onUserLoggedIn:", e);
            }
        } catch (err) {
            if (loginErrorMsg) {
                loginErrorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid ZC code. Please check and try again.';
                loginErrorMsg.classList.remove('hidden');
            }
            if (loginUsernameInput) { loginUsernameInput.value = ''; loginUsernameInput.focus(); }
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'Login'; }
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            doLogin();
            return false;
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
        window.currentUser = currentUser;
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.style.display = 'none';
        }
        if (headerUserName && currentUser) {
            const displayName = (currentUser.name && currentUser.name !== currentUser.id)
                ? `${currentUser.name} (${currentUser.id})`
                : currentUser.id;
            headerUserName.textContent = displayName;
        }
        const avatarCircle = document.getElementById('header-user-avatar');
        if (avatarCircle && currentUser) {
            avatarCircle.textContent = (currentUser.name || currentUser.id || 'Z').charAt(0).toUpperCase();
        }
        if (headerUserProfile) headerUserProfile.classList.remove('hidden');
        
        const navTabs = document.querySelector('.amy-nav-tabs');
        if (navTabs) navTabs.classList.remove('hidden');

        if (currentUser && currentUser.role === 'Admin') {
            if (openAdminBtn) openAdminBtn.classList.remove('hidden');
        } else {
            if (openAdminBtn) openAdminBtn.classList.add('hidden');
        }
        
        try { await loadSlidesData(); } catch(e){}
        try { await checkTestAssignment(); } catch(e){}
        try { await loadScenariosFromStorage(); } catch(e){}
        try { await initKb(); } catch(e){}

        if (typeof window.onAIUserLoggedIn === 'function') {
            try { window.onAIUserLoggedIn(currentUser); } catch(e){}
        }

        if (!window.isTestAssigned && !window.isAiTestAssigned) {
            switchTab('tab-kb');
        }
    }
    
    let assignmentTimerInterval = null;

    function startAssignmentTimer(assignedAt) {
        if (assignmentTimerInterval) clearInterval(assignmentTimerInterval);
        
        const banner = document.getElementById('active-test-banner');
        const bannerText = document.getElementById('active-test-banner-text') || (banner ? banner.querySelector('span') : null);
        if (!banner || !bannerText) return;

        banner.classList.remove('hidden');

        function updateTicking() {
            const now = Date.now();
            const elapsed = now - assignedAt;
            const remainingMs = Math.max(0, (24 * 60 * 60 * 1000) - elapsed);

            if (remainingMs <= 0) {
                clearInterval(assignmentTimerInterval);
                banner.classList.add('hidden');
                checkTestAssignment();
                return;
            }

            const totalSecs = Math.floor(remainingMs / 1000);
            const hrs = Math.floor(totalSecs / 3600);
            const mins = Math.floor((totalSecs % 3600) / 60);
            const secs = totalSecs % 60;

            const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            bannerText.innerHTML = `⚠️ <strong>تنبيه:</strong> لديك اختبار نشط مستحق! يرجى قراءة المادة التدريبية (السلايدات) والبدء بالاختبار قبل انتهاء صلاحية الدخول: <span style="font-family: monospace; font-weight: 800; background: #ea580c; color: white; padding: 2px 8px; border-radius: 4px; margin-right: 5px;">${timeStr}</span>`;
        }

        updateTicking();
        assignmentTimerInterval = setInterval(updateTicking, 1000);
    }

    async function checkTestAssignment() {
        window.checkTestAssignment = checkTestAssignment;
        const navBtnKb = document.querySelector('.amy-nav-btn[data-amy-tab="tab-kb"]');
        const navBtnTC = document.querySelector('.amy-nav-btn[data-amy-tab="tab-training-center"]');
        const navBtnSimHidden = document.getElementById('nav-btn-simulator-hidden');
        const navBtnAIHidden = document.getElementById('nav-btn-ai-agent-hidden');
        const backBtns = document.querySelectorAll('.btn-back-to-tc');
        const openAdminBtn = document.getElementById('open-admin-btn');
        const banner = document.getElementById('active-test-banner');
        const bannerText = document.getElementById('active-test-banner-text') || (banner ? banner.querySelector('span') : null);

        if (!currentUser) return;

        // Defensive Default State: Hide test tabs and Training Center by default for everyone (except admin override below)
        if (navBtnTC) navBtnTC.style.display = 'none';
        if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
        if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
        const navBtnCallSimHidden = document.getElementById('nav-btn-call-simulator-hidden');
        if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
        if (navBtnKb) navBtnKb.style.display = '';
        if (banner) banner.classList.add('hidden');
        if (assignmentTimerInterval) {
            clearInterval(assignmentTimerInterval);
            assignmentTimerInterval = null;
        }

        if (currentUser.role === 'Admin') {
            isTestAssigned = false;
            isAiTestAssigned = false;
            isCallTestAssigned = false;
            window.isTestAssigned = false;
            window.isAiTestAssigned = false;
            window.isCallTestAssigned = false;
            
            if (navBtnKb) navBtnKb.style.display = '';
            if (navBtnTC) navBtnTC.style.display = '';
            if (openAdminBtn) openAdminBtn.style.display = '';
            backBtns.forEach(btn => btn.style.display = '');
            
            const lockOverlay = document.getElementById('test-locked-overlay');
            if (lockOverlay) lockOverlay.classList.add('hidden');
            return;
        }
        
        try {
            const [assignments, aiAssignments, callAssignments] = await Promise.all([
                apiCall('/api/assignments', 'GET').catch(() => []),
                apiCall('/api/ai-assignments', 'GET').catch(() => []),
                apiCall('/api/call-assignments', 'GET').catch(() => [])
            ]);
            
            const metaRes = await apiCall('/api/assignments/meta', 'GET').catch(() => ({ 
                assignmentsMeta: { assignedAt: 0 }, 
                aiAssignmentsMeta: { assignedAt: 0 },
                callAssignmentsMeta: { assignedAt: 0 }
            }));
            
            let rawIsTest = assignments.includes(currentUser.id) || assignments.includes('all');
            let rawIsAiTest = aiAssignments.includes(currentUser.id) || aiAssignments.includes('all');
            let rawIsCallTest = callAssignments.includes(currentUser.id) || callAssignments.includes('all');

            const now = Date.now();
            const assignTime = metaRes.assignmentsMeta?.assignedAt;
            const aiAssignTime = metaRes.aiAssignmentsMeta?.assignedAt;
            const callAssignTime = metaRes.callAssignmentsMeta?.assignedAt;

            // Validity of 24 hours from assignment (fallback to valid if assignedAt is missing/0)
            isTestAssigned = rawIsTest && (!assignTime || (now - assignTime <= 24 * 60 * 60 * 1000));
            isAiTestAssigned = rawIsAiTest && (!aiAssignTime || (now - aiAssignTime <= 24 * 60 * 60 * 1000));
            isCallTestAssigned = rawIsCallTest && (!callAssignTime || (now - callAssignTime <= 24 * 60 * 60 * 1000));
            
            window.isTestAssigned = isTestAssigned;
            window.isAiTestAssigned = isAiTestAssigned;
            window.isCallTestAssigned = isCallTestAssigned;
            
            if (isTestAssigned || isAiTestAssigned || isCallTestAssigned) {
                // Priority: Call Simulator > AI Agent > Chat Simulator
                const activeTestType = isCallTestAssigned ? 'call-simulator' : (isAiTestAssigned ? 'ai-agent' : 'simulator');
                
                // Get the session state
                const sessionRes = await apiCall(`/api/test-session?userId=${currentUser.id}&testType=${activeTestType}`, 'GET');
                
                if (sessionRes && (sessionRes.status === 'completed' || sessionRes.status === 'expired')) {
                    window.isTestSessionActive = false;
                    const completedTime = sessionRes.completedAt ? new Date(sessionRes.completedAt).getTime() : 0;
                    const elapsedSinceCompleted = now - completedTime;

                    if (elapsedSinceCompleted < 60 * 60 * 1000) {
                        if (banner) banner.classList.remove('hidden');
                        if (bannerText) bannerText.textContent = "تم إكمال الاختبار. يمكنك الاطلاع على النتيجة والشهادة فقط لمدة ساعة بعد الإكمال.";
                        
                        if (navBtnKb) navBtnKb.style.display = 'none';
                        if (navBtnTC) navBtnTC.style.display = 'none';
                        if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                        if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                        if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                        backBtns.forEach(btn => btn.style.display = 'none');
                        
                        if (activeTestType === 'simulator') {
                            const simOverlay = document.getElementById('results-overlay');
                            if (simOverlay) simOverlay.classList.remove('hidden');
                            switchTab('tab-simulator');
                        } else if (activeTestType === 'ai-agent') {
                            const aiOverlay = document.getElementById('ai-results-overlay');
                            if (aiOverlay) aiOverlay.classList.remove('hidden');
                            switchTab('tab-ai-agent');
                        } else {
                            switchTab('tab-call-simulator');
                            if (window.initAmeyoCallSimulator) window.initAmeyoCallSimulator();
                        }
                        
                        const lockOverlay = document.getElementById('test-locked-overlay');
                        if (lockOverlay) lockOverlay.classList.add('hidden');
                        return;
                    } else {
                        if (banner) banner.classList.add('hidden');
                        if (navBtnKb) navBtnKb.style.display = '';
                        if (navBtnTC) navBtnTC.style.display = 'none';
                        if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                        if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                        if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                        backBtns.forEach(btn => btn.style.display = 'none');
                        
                        const simOverlay = document.getElementById('results-overlay');
                        if (simOverlay) simOverlay.classList.add('hidden');
                        const aiOverlay = document.getElementById('ai-results-overlay');
                        if (aiOverlay) aiOverlay.classList.add('hidden');
                        const lockOverlay = document.getElementById('test-locked-overlay');
                        if (lockOverlay) lockOverlay.classList.add('hidden');
                        
                        switchTab('tab-kb');
                        return;
                    }
                }

                if (sessionRes && sessionRes.status === 'active') {
                    window.isTestSessionActive = true;
                    if (banner) banner.classList.remove('hidden');
                    backBtns.forEach(btn => btn.style.display = 'none');
                    if (navBtnKb) navBtnKb.style.display = 'none';
                    if (navBtnTC) navBtnTC.style.display = 'none';

                    if (activeTestType === 'simulator') {
                        if (bannerText) bannerText.textContent = "لديك اختبار نشط في محاكي الدردشة! يرجى إكمال الحالات قبل نهاية الوقت.";
                        if (navBtnSimHidden) { navBtnSimHidden.style.display = ''; navBtnSimHidden.textContent = 'اختبار المحاكي النشط'; }
                        if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                        if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                        switchTab('tab-simulator');
                    } else if (activeTestType === 'ai-agent') {
                        if (bannerText) bannerText.textContent = "لديك اختبار نشط في الأيجنت الذكي! يرجى إكمال التقييم وتصنيف التذكرة.";
                        if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                        if (navBtnAIHidden) { navBtnAIHidden.style.display = ''; navBtnAIHidden.textContent = 'اختبار الأيجنت النشط'; }
                        if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                        switchTab('tab-ai-agent');
                    } else {
                        if (bannerText) bannerText.textContent = "لديك اختبار نشط في محاكي المكالمات (Call Center)! يرجى التواجد في وضع الاستعداد واستقبال مكالمة الاختبار وتصنيفها.";
                        if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                        if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                        if (navBtnCallSimHidden) { navBtnCallSimHidden.style.display = ''; navBtnCallSimHidden.textContent = 'اختبار الكول النشط'; }
                        switchTab('tab-call-simulator');
                        if (window.initAmeyoCallSimulator) window.initAmeyoCallSimulator();
                    }

                    if (typeof startTestTimer === 'function') {
                        startTestTimer(sessionRes.remainingSeconds, activeTestType, currentUser.id);
                    }
                    
                    const lockOverlay = document.getElementById('test-locked-overlay');
                    if (lockOverlay) lockOverlay.classList.add('hidden');
                    return;
                }

                // If not started yet: Show Slides tab first, and hide KB/TC tabs
                window.isTestSessionActive = false;
                if (navBtnKb) navBtnKb.style.display = 'none';
                if (navBtnTC) navBtnTC.style.display = 'none';
                if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                
                // Show hidden slides tab
                const navBtnSlides = document.getElementById('nav-btn-slides-hidden');
                if (navBtnSlides) navBtnSlides.style.display = '';
                
                switchTab('tab-slides');

                // Start the 24-hour warning countdown ticking clock
                const activeAssignedAt = isCallTestAssigned
                    ? (metaRes.callAssignmentsMeta?.assignedAt || Date.now())
                    : (isAiTestAssigned 
                        ? (metaRes.aiAssignmentsMeta?.assignedAt || Date.now())
                        : (metaRes.assignmentsMeta?.assignedAt || Date.now()));
                startAssignmentTimer(activeAssignedAt);
            } else {
                // Revert to showing Knowledge Base only (hide Training Center button for non-admins)
                if (banner) banner.classList.add('hidden');
                if (navBtnKb) navBtnKb.style.display = '';
                if (navBtnTC) navBtnTC.style.display = 'none';
                if (navBtnSimHidden) navBtnSimHidden.style.display = 'none';
                if (navBtnAIHidden) navBtnAIHidden.style.display = 'none';
                if (navBtnCallSimHidden) navBtnCallSimHidden.style.display = 'none';
                backBtns.forEach(btn => btn.style.display = '');
                
                const lockOverlay = document.getElementById('test-locked-overlay');
                if (lockOverlay) lockOverlay.classList.add('hidden');
            }
        } catch (e) {
            console.error("Failed to check assignments", e);
            isTestAssigned = false;
            isAiTestAssigned = false;
            isCallTestAssigned = false;
            window.isTestAssigned = false;
            window.isAiTestAssigned = false;
            window.isCallTestAssigned = false;
        }
    }

    let testTimerInterval = null;
    window.startTestTimer = startTestTimer;
    window.showTestLockedScreen = showTestLockedScreen;

    function showTestLockedScreen(reasonText = null) {
        const overlay = document.getElementById('test-locked-overlay');
        const descEl = document.getElementById('test-locked-desc');
        const timerBanner = document.getElementById('test-timer-banner');

        if (timerBanner) timerBanner.classList.add('hidden');
        if (testTimerInterval) clearInterval(testTimerInterval);

        if (descEl && reasonText) {
            descEl.textContent = reasonText;
        }
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    const btnLockedOk = document.getElementById('btn-locked-ok');
    if (btnLockedOk) {
        btnLockedOk.addEventListener('click', () => {
            window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname;
        });
    }

    function startTestTimer(remainingSeconds, testType, userId) {
        const timerBanner = document.getElementById('test-timer-banner');
        const timerDisplay = document.getElementById('test-timer-display');
        const timerTitle = document.getElementById('test-timer-title');

        if (!timerBanner || !timerDisplay) return;

        if (timerTitle) {
            timerTitle.textContent = testType === 'ai-agent' 
                ? "اختبار الأيجنت الذكي المباشر" 
                : (testType === 'call-simulator' ? "اختبار محاكي المكالمات الهاتفية (Call Center)" : "اختبار محاكي خدمة الزبائن");
        }

        timerBanner.classList.remove('hidden');
        if (testTimerInterval) clearInterval(testTimerInterval);

        let currentSeconds = remainingSeconds;

        function updateTimerUI() {
            if (currentSeconds <= 0) {
                clearInterval(testTimerInterval);
                timerBanner.classList.add('hidden');
                autoSubmitTestDueToTime(userId, testType);
                return;
            }

            const mins = Math.floor(currentSeconds / 60);
            const secs = currentSeconds % 60;
            timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (currentSeconds <= 300) {
                timerDisplay.style.color = '#ef4444';
                timerDisplay.style.borderColor = '#fca5a5';
            } else if (currentSeconds <= 900) {
                timerDisplay.style.color = '#f59e0b';
                timerDisplay.style.borderColor = '#fde68a';
            } else {
                timerDisplay.style.color = '#38bdf8';
                timerDisplay.style.borderColor = '#334155';
            }

            currentSeconds--;
        }

        updateTimerUI();
        testTimerInterval = setInterval(updateTimerUI, 1000);
    }

    async function autoSubmitTestDueToTime(userId, testType) {
        showToast("⏳ انتهت مدة الساعة المحددة للاختبار! جاري تسليم إجاباتك تلقائياً...", "warning");
        try {
            await apiCall('/api/test-session/complete', 'POST', { userId, testType });
            if (testType === 'simulator') {
                const btn = document.getElementById('btn-submit-session');
                if (btn) btn.click();
            } else {
                const btn = document.getElementById('btn-submit-ai-session');
                if (btn) btn.click();
            }
        } catch(e) {
            console.error("Auto submit failed:", e);
        }
    }

    // Excel Export Handlers
    const exportSimBtn = document.getElementById('btn-export-excel-sim');
    if (exportSimBtn) {
        exportSimBtn.addEventListener('click', async () => {
            try {
                const results = await apiCall('/api/results', 'GET') || [];
                exportToCsv(results, 'ZainCash_Simulator_Results.csv', 'simulator');
            } catch(e) {
                showToast("فشل تحميل نتائج المحاكي: " + e.message, "error");
            }
        });
    }

    const exportAiBtn = document.getElementById('btn-export-excel-ai');
    if (exportAiBtn) {
        exportAiBtn.addEventListener('click', async () => {
            try {
                const aiResults = await apiCall('/api/ai-results', 'GET') || [];
                exportToCsv(aiResults, 'ZainCash_AI_Coach_Results.csv', 'ai');
            } catch(e) {
                showToast("فشل تحميل نتائج الأيجنت الذكي: " + e.message, "error");
            }
        });
    }

    function cleanHtmlToText(html) {
        if (!html) return "";
        let text = html
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/tr>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/th>/gi, ' | ')
            .replace(/<\/td>/gi, ' | ');
        // Strip remaining HTML tags
        text = text.replace(/<[^>]*>/g, '');
        // Replace multiple consecutive newlines/spaces
        text = text.replace(/\n\s*\n/g, '\n').trim();
        return text;
    }

    function escapeCsvValue(val) {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        return '"' + str.replace(/"/g, '""') + '"';
    }

    function exportToCsv(data, filename, type) {
        if (!data || data.length === 0) {
            showToast("لا توجد نتائج مسجلة للتحميل حالياً", "warning");
            return;
        }

        let csvContent = "\uFEFF"; // UTF-8 BOM for Microsoft Excel Arabic rendering
        if (type === 'simulator') {
            csvContent += "رمز الموظف (Code),اسم الموظف (Name),نوع الاختبار (Test Type),النتيجة (Score %),الأخطاء (Errors),التقييم (Grade),تاريخ وساعة التسليم (Submitted At),تفاصيل التقييم (Evaluation Details)\n";
            data.forEach(r => {
                const cleanedDetails = cleanHtmlToText(r.detailsHtml);
                csvContent += `${escapeCsvValue(r.userId)},${escapeCsvValue(r.userName)},"محاكي المحادثات",${escapeCsvValue(r.score + '%')},${escapeCsvValue(r.errorsCount)},${escapeCsvValue(r.grade)},${escapeCsvValue(r.date)},${escapeCsvValue(cleanedDetails)}\n`;
            });
        } else {
            csvContent += "رمز الموظف (Code),اسم الموظف (Name),نوع الاختبار (Test Type),النتيجة (Score %),التقييم (Grade),تاريخ وساعة التسليم (Submitted At),تفاصيل التقييم (Evaluation Details)\n";
            data.forEach(r => {
                const cleanedDetails = cleanHtmlToText(r.detailsHtml);
                csvContent += `${escapeCsvValue(r.userId)},${escapeCsvValue(r.userName)},"المدرب الذكي",${escapeCsvValue(r.score + '%')},${escapeCsvValue(r.grade)},${escapeCsvValue(r.date)},${escapeCsvValue(cleanedDetails)}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("تم تحميل ملف النتائج Excel بنجاح! 📥", "success");
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
                stopResultsPolling();
                loadAssignmentsTab();
            } else if (targetTab === 'tab-results') {
                startResultsPolling();
            } else if (targetTab === 'tab-scenarios') {
                stopResultsPolling();
                renderAdminScenariosList();
                selectScenario(null);
            } else if (targetTab === 'tab-ai-scenarios') {
                stopResultsPolling();
                loadAiScenariosFromStorage().then(() => {
                    renderAdminAiScenariosList();
                    selectAiScenario(null);
                });
            } else if (targetTab === 'tab-call-scenarios') {
                stopResultsPolling();
                loadCallScenariosFromStorage().then(() => {
                    renderAdminCallScenariosList();
                    if (callScenariosList.length > 0) selectCallScenario(0);
                    else selectCallScenario(null);
                });
            } else if (targetTab === 'tab-edit-slides') {
                stopResultsPolling();
                renderAdminSlidesList();
                selectSlide(null);
            }
        });
    });

    function startResultsPolling() {
        loadResultsTab();
        if (!resultsLivePollInterval) {
            resultsLivePollInterval = setInterval(loadResultsTab, 3000);
        }
    }

    function stopResultsPolling() {
        if (resultsLivePollInterval) {
            clearInterval(resultsLivePollInterval);
            resultsLivePollInterval = null;
        }
    }

    let allUsers = [];
    let allTestSessions = {};
    let currentTestType = 'simulator'; // 'simulator', 'ai-agent', or 'call-simulator'
    let currentAssignments = [];
    let currentAiAssignments = [];
    let currentCallAssignments = [];
    let simulatorAssignAll = false;
    let aiAssignAll = false;
    let callAssignAll = false;
    
    async function loadAssignmentsTab() {
        loadSMTPSettings();
        const grid = document.getElementById('users-selection-grid');
        if (!grid) return;
        grid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted);">جاري تحميل قائمة الموظفين...</p>';
        
        try {
            allUsers = await apiCall('/api/users', 'GET');
            currentAssignments = await apiCall('/api/assignments', 'GET');
            currentAiAssignments = await apiCall('/api/ai-assignments', 'GET');
            currentCallAssignments = await apiCall('/api/call-assignments', 'GET').catch(() => []);
            allTestSessions = (await apiCall('/api/test-sessions', 'GET').catch(() => ({}))) || {};
            
            allUsers = allUsers.filter(u => u.role !== 'Admin');
            
            simulatorAssignAll = currentAssignments.includes('all');
            aiAssignAll = currentAiAssignments.includes('all');
            callAssignAll = currentCallAssignments.includes('all');
            
            const activeType = currentTestType;
            let assignAll = false;
            if (activeType === 'simulator') assignAll = simulatorAssignAll;
            else if (activeType === 'ai-agent') assignAll = aiAssignAll;
            else if (activeType === 'call-simulator') assignAll = callAssignAll;
            
            if (typeSimulatorRadio) typeSimulatorRadio.checked = (activeType === 'simulator');
            if (typeAiRadio) typeAiRadio.checked = (activeType === 'ai-agent');
            if (typeCallRadio) typeCallRadio.checked = (activeType === 'call-simulator');
            
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
    window.loadAssignmentsTab = loadAssignmentsTab;
    
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
        
        const activeList = currentTestType === 'simulator' ? currentAssignments : (currentTestType === 'ai-agent' ? currentAiAssignments : currentCallAssignments);
        
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
            const isCallAssigned = currentCallAssignments.includes(user.id) || callAssignAll;
            
            // Calculate status badges for the selected test type
            let statusBadgeHtml = '';
            const testKey = `${user.id}_${currentTestType}`;
            const sess = (allTestSessions || {})[testKey];
            
            if (isChecked) {
                if (sess && sess.completed) {
                    statusBadgeHtml = `<span class="status-badge" style="background:#def7ec; color:#03543f; border:1px solid #bcf0da; padding:2px 8px; border-radius:12px; font-weight:800; font-size:0.72rem; margin-right:5px;"><i class="fa-solid fa-circle-check"></i> مكتمل</span>`;
                } else {
                    statusBadgeHtml = `<span class="status-badge" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:2px 8px; border-radius:12px; font-weight:800; font-size:0.72rem; margin-right:5px;"><i class="fa-solid fa-hourglass-half"></i> قيد الاختبار</span>`;
                }
            } else {
                if (sess && sess.completed) {
                    statusBadgeHtml = `<span class="status-badge" style="background:#def7ec; color:#03543f; border:1px solid #bcf0da; padding:2px 8px; border-radius:12px; font-weight:800; font-size:0.72rem; margin-right:5px;"><i class="fa-solid fa-circle-check"></i> مكتمل</span>`;
                }
            }

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
                    <div class="user-sub-row" style="display:flex; align-items:center; gap:8px;">
                        <span class="user-id-badge">${user.id}</span>
                        <span class="user-role-badge">${user.role || 'Inbound'}</span>
                        ${statusBadgeHtml}
                    </div>
                    <div class="user-assignment-badges">
                        ${isSimAssigned ? '<span class="status-badge badge-simulator"><i class="fa-solid fa-comments"></i> Chat Simulator Active</span>' : ''}
                        ${isAiAssigned ? '<span class="status-badge badge-ai"><i class="fa-solid fa-robot"></i> AI Agent Active</span>' : ''}
                        ${isCallAssigned ? '<span class="status-badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;"><i class="fa-solid fa-phone"></i> Voice Call Active</span>' : ''}
                    </div>
                </div>
                <div class="user-card-right">
                    <div class="user-email-input-group">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="email" class="user-email-input user-email-field" id="email-user-${user.id}" placeholder="Enter email..." value="${user.email || ''}">
                    </div>
                    <div style="display:flex; gap:6px; margin-top:4px; align-items:center;">
                        <button type="button" class="btn-send-invite btn-send-invite-card" data-user-id="${user.id}">
                            <i class="fa-solid fa-paper-plane" style="font-size: 0.7rem;"></i> Invite
                        </button>
                        <button type="button" class="btn-call-user-direct" data-user-id="${user.id}" data-user-name="${escapeHtml(user.name)}" style="background:#0284c7; color:#fff; border:none; border-radius:6px; padding:6px 10px; font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; transition:0.2s;">
                            <i class="fa-solid fa-phone"></i> اتصل الآن
                        </button>
                    </div>
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
                    let activeArray = currentAssignments;
                    if (currentTestType === 'ai-agent') activeArray = currentAiAssignments;
                    else if (currentTestType === 'call-simulator') activeArray = currentCallAssignments;

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
                        } else if (currentTestType === 'ai-agent') {
                            currentAiAssignments = updated;
                        } else if (currentTestType === 'call-simulator') {
                            currentCallAssignments = updated;
                        }
                    }
                    
                    const badgeContainer = card.querySelector('.user-assignment-badges');
                    if (badgeContainer) {
                        const isSimAssignedNow = currentAssignments.includes(user.id) || simulatorAssignAll;
                        const isAiAssignedNow = currentAiAssignments.includes(user.id) || aiAssignAll;
                        const isCallAssignedNow = currentCallAssignments.includes(user.id) || callAssignAll;
                        badgeContainer.innerHTML = `
                            ${isSimAssignedNow ? '<span class="status-badge badge-simulator"><i class="fa-solid fa-comments"></i> Chat Simulator Active</span>' : ''}
                            ${isAiAssignedNow ? '<span class="status-badge badge-ai"><i class="fa-solid fa-robot"></i> AI Agent Active</span>' : ''}
                            ${isCallAssignedNow ? '<span class="status-badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;"><i class="fa-solid fa-phone"></i> Voice Call Active</span>' : ''}
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
            } else if (currentTestType === 'ai-agent') {
                aiAssignAll = true;
            } else if (currentTestType === 'call-simulator') {
                callAssignAll = true;
            }
        });
    }
    
    if (assignSpecificRadio) {
        assignSpecificRadio.addEventListener('change', () => {
            if (specificUsersListWrapper) specificUsersListWrapper.classList.remove('hidden');
            if (currentTestType === 'simulator') {
                simulatorAssignAll = false;
            } else if (currentTestType === 'ai-agent') {
                aiAssignAll = false;
            } else if (currentTestType === 'call-simulator') {
                callAssignAll = false;
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
            let activeArray = currentAssignments;
            if (currentTestType === 'ai-agent') activeArray = currentAiAssignments;
            else if (currentTestType === 'call-simulator') activeArray = currentCallAssignments;

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
            } else if (currentTestType === 'ai-agent') {
                currentAiAssignments = [];
            } else if (currentTestType === 'call-simulator') {
                currentCallAssignments = [];
            }
            renderUsersGrid();
        });
    }

    const typeSimulatorRadio = document.getElementById('assign-test-type-simulator');
    const typeAiRadio = document.getElementById('assign-test-type-ai');
    const typeCallRadio = document.getElementById('assign-test-type-call');
    
    function handleTestTypeChange(type) {
        currentTestType = type;
        let assignAll = false;
        if (type === 'simulator') assignAll = simulatorAssignAll;
        else if (type === 'ai-agent') assignAll = aiAssignAll;
        else if (type === 'call-simulator') assignAll = callAssignAll;
        
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
    if (typeCallRadio) {
        typeCallRadio.addEventListener('change', () => handleTestTypeChange('call-simulator'));
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
                let activeArray = currentAssignments;
                if (activeTest === 'ai-agent') activeArray = currentAiAssignments;
                else if (activeTest === 'call-simulator') activeArray = currentCallAssignments;
                targets = [...activeArray].filter(id => id !== 'all');
            }
            
            if (activeTest === 'simulator') {
                simulatorAssignAll = assignAll;
                currentAssignments = targets;
            } else if (activeTest === 'ai-agent') {
                aiAssignAll = assignAll;
                currentAiAssignments = targets;
            } else if (activeTest === 'call-simulator') {
                callAssignAll = assignAll;
                currentCallAssignments = targets;
            }
            
            let endpoint = '/api/assignments';
            if (activeTest === 'ai-agent') endpoint = '/api/ai-assignments';
            else if (activeTest === 'call-simulator') endpoint = '/api/call-assignments';
            
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
                            const keys = (typeof getSavedApiKeys === 'function') ? getSavedApiKeys() : {};
                            await apiCall('/api/send-invite', 'POST', {
                                userId: usr.id,
                                email: usr.email,
                                testType: activeTest,
                                brevoKey: keys.brevoKey || '',
                                resendKey: keys.resendKey || ''
                            });
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

        try {
            let serverResults = [];
            try {
                serverResults = await apiCall('/api/results', 'GET') || [];
            } catch(e) {
                console.warn("Server sim results fetch failed, using local backup:", e);
            }

            let localResults = [];
            try {
                localResults = JSON.parse(localStorage.getItem('zain_sim_results') || '[]');
            } catch(e) {}

            const combinedMap = new Map();
            [...serverResults, ...localResults].forEach(r => {
                const key = `${r.userId}_${r.date || r.score}`;
                if (!combinedMap.has(key)) {
                    combinedMap.set(key, r);
                }
            });

            const results = Array.from(combinedMap.values());
            tbody.innerHTML = '';
            
            if (results.length === 0) {
                if (placeholder) placeholder.classList.remove('hidden');
                return;
            }
            
            if (placeholder) placeholder.classList.add('hidden');
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            window.currentSimResults = results;
            results.forEach(res => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-family: var(--font-en); font-weight:700;">${res.userId || '-'}</td>
                    <td style="font-weight:700;">${res.userName || '-'}</td>
                    <td><strong>${res.score}%</strong></td>
                    <td>${res.errorsCount || 0}</td>
                    <td><span class="${res.score >= 80 ? 'text-green' : (res.score >= 60 ? 'text-orange' : 'text-red')}" style="font-weight:700;">${res.grade || '-'}</span></td>
                    <td>${res.date || '-'}</td>
                    <td>
                        <button class="btn btn-primary btn-sm btn-show-sim-result" data-userid="${res.userId}" data-date="${res.date}" style="font-size:0.72rem; padding:4px 8px; border-radius:6px; background:#4f46e5; color:#ffffff; border:none; cursor:pointer; margin-left:5px;">
                            <i class="fa-solid fa-eye"></i> SHOW
                        </button>
                        <button class="btn btn-red btn-sm btn-delete-sim-result" data-userid="${res.userId}" data-date="${res.date}" style="font-size:0.72rem; padding:4px 8px; border-radius:6px; background:#ef4444; color:#ffffff; border:none; cursor:pointer;">
                            <i class="fa-solid fa-trash-can"></i> مسح
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Failed to load sim results", e);
        }
    }

    async function loadAIResults() {
        const tbody = document.getElementById('ai-results-table-tbody');
        const placeholder = document.getElementById('no-ai-results-placeholder');
        if (!tbody) return;

        try {
            let serverResults = [];
            try {
                serverResults = await apiCall('/api/ai-results', 'GET') || [];
            } catch(e) {
                console.warn("Server AI results fetch failed, using local backup:", e);
            }

            let localResults = [];
            try {
                localResults = JSON.parse(localStorage.getItem('zain_ai_results') || '[]');
            } catch(e) {}

            const combinedMap = new Map();
            [...serverResults, ...localResults].forEach(r => {
                const key = `${r.userId}_${r.date || r.score}`;
                if (!combinedMap.has(key)) {
                    combinedMap.set(key, r);
                }
            });

            const results = Array.from(combinedMap.values());
            tbody.innerHTML = '';
            
            if (results.length === 0) {
                if (placeholder) placeholder.classList.remove('hidden');
                return;
            }
            
            if (placeholder) placeholder.classList.add('hidden');
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            window.currentAIResults = results;
            
            results.forEach(res => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-family: var(--font-en); font-weight:700;">${res.userId || '-'}</td>
                    <td style="font-weight:700;">${res.userName || '-'}</td>
                    <td><strong>${res.score}%</strong></td>
                    <td><span class="${res.score >= 80 ? 'text-green' : (res.score >= 60 ? 'text-orange' : 'text-red')}" style="font-weight:700;">${res.grade || '-'}</span></td>
                    <td>${res.date || '-'}</td>
                    <td>
                        <button class="btn btn-primary btn-sm btn-show-ai-result" data-userid="${res.userId}" data-date="${res.date}" style="font-size:0.72rem; padding:4px 8px; border-radius:6px; background:#4f46e5; color:#ffffff; border:none; cursor:pointer; margin-left:5px;">
                            <i class="fa-solid fa-eye"></i> SHOW
                        </button>
                        <button class="btn btn-red btn-sm btn-delete-ai-result" data-userid="${res.userId}" data-date="${res.date}" style="font-size:0.72rem; padding:4px 8px; border-radius:6px; background:#ef4444; color:#ffffff; border:none; cursor:pointer;">
                            <i class="fa-solid fa-trash-can"></i> مسح
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Failed to load AI results", e);
        }
    }

    let resultsLivePollInterval = null;

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

    // Event delegation for deleting/showing simulator results
    const resultsTbody = document.getElementById('results-table-tbody');
    if (resultsTbody) {
        resultsTbody.addEventListener('click', async (e) => {
            // SHOW button
            const btnShow = e.target.closest('.btn-show-sim-result');
            if (btnShow) {
                const userId = btnShow.getAttribute('data-userid');
                const date = btnShow.getAttribute('data-date');
                if (!userId || !date) return;
                
                const results = window.currentSimResults || [];
                const res = results.find(r => r.userId === userId && r.date === date);
                if (res) {
                    const modal = document.getElementById('admin-details-modal');
                    const modalTitle = document.getElementById('admin-details-modal-title');
                    const modalBody = document.getElementById('admin-details-modal-body');
                    
                    if (modal && modalTitle && modalBody) {
                        modalTitle.textContent = `تفاصيل إجابات الموظف: ${res.userName} (${res.userId})`;
                        
                        let bodyContent = res.detailsHtml || '';
                        if (!bodyContent) {
                            bodyContent = `
                                <div style="text-align:center; padding:30px; color:#64748b; font-size:0.9rem;">
                                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; color:#f59e0b; margin-bottom:10px; display:block;"></i>
                                    لا تتوفر تفاصيل إضافية مخزنة لهذه النتيجة القديمة.<br>
                                    الدرجة الإجمالية المحرزة: <strong>${res.score}%</strong> (التقييم: ${res.grade})
                                </div>
                            `;
                        } else if (!bodyContent.includes('<div') && !bodyContent.includes('<table')) {
                            bodyContent = `<div style="white-space: pre-wrap; text-align: right; direction: rtl; font-family: var(--font-ar); font-size: 0.95rem; line-height: 1.6; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; color: #1e293b;">${bodyContent}</div>`;
                        }
                        
                        modalBody.innerHTML = bodyContent;
                        modal.style.display = 'flex';
                    }
                }
                return;
            }

            // DELETE button
            const btn = e.target.closest('.btn-delete-sim-result');
            if (!btn) return;
            
            const userId = btn.getAttribute('data-userid');
            const date = btn.getAttribute('data-date');
            if (!userId || !date) return;
            
            if (confirm(`هل أنت متأكد من مسح نتيجة الموظف ${userId} بتاريخ ${date}؟`)) {
                try {
                    await apiCall('/api/results', 'DELETE', { userId, date });
                    
                    // Remove from localStorage
                    let localResults = [];
                    try {
                        localResults = JSON.parse(localStorage.getItem('zain_sim_results') || '[]');
                    } catch(err) {}
                    localResults = localResults.filter(r => !(r.userId === userId && r.date === date));
                    localStorage.setItem('zain_sim_results', JSON.stringify(localResults));
                    
                    showToast('تم مسح نتيجة المحاكاة بنجاح!', 'success');
                    loadSimResults();
                    if (window.loadAssignmentsTab) window.loadAssignmentsTab();
                } catch (err) {
                    showToast('فشل مسح النتيجة: ' + err.message, 'error');
                }
            }
        });
    }

    // Event delegation for deleting/showing AI coach results
    const aiResultsTbody = document.getElementById('ai-results-table-tbody');
    if (aiResultsTbody) {
        aiResultsTbody.addEventListener('click', async (e) => {
            // SHOW button
            const btnShow = e.target.closest('.btn-show-ai-result');
            if (btnShow) {
                const userId = btnShow.getAttribute('data-userid');
                const date = btnShow.getAttribute('data-date');
                if (!userId || !date) return;
                
                const results = window.currentAIResults || [];
                const res = results.find(r => r.userId === userId && r.date === date);
                if (res) {
                    const modal = document.getElementById('admin-details-modal');
                    const modalTitle = document.getElementById('admin-details-modal-title');
                    const modalBody = document.getElementById('admin-details-modal-body');
                    
                    if (modal && modalTitle && modalBody) {
                        modalTitle.textContent = `تفاصيل تقييم مدرب الذكاء الاصطناعي: ${res.userName} (${res.userId})`;
                        
                        let bodyContent = res.detailsHtml || '';
                        if (!bodyContent) {
                            bodyContent = `
                                <div style="text-align:center; padding:30px; color:#64748b; font-size:0.9rem;">
                                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; color:#f59e0b; margin-bottom:10px; display:block;"></i>
                                    لا تتوفر تفاصيل إضافية مخزنة لهذه النتيجة القديمة.<br>
                                    الدرجة الإجمالية المحرزة: <strong>${res.score}%</strong> (التقييم: ${res.grade})
                                </div>
                            `;
                        } else if (!bodyContent.includes('<div') && !bodyContent.includes('<table')) {
                            bodyContent = `<div style="white-space: pre-wrap; text-align: right; direction: rtl; font-family: var(--font-ar); font-size: 0.95rem; line-height: 1.6; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; color: #1e293b;">${bodyContent}</div>`;
                        }
                        
                        modalBody.innerHTML = bodyContent;
                        modal.style.display = 'flex';
                    }
                }
                return;
            }

            // DELETE button
            const btn = e.target.closest('.btn-delete-ai-result');
            if (!btn) return;
            
            const userId = btn.getAttribute('data-userid');
            const date = btn.getAttribute('data-date');
            if (!userId || !date) return;
            
            if (confirm(`هل أنت متأكد من مسح نتيجة الموظف ${userId} بتاريخ ${date}؟`)) {
                try {
                    await apiCall('/api/ai-results', 'DELETE', { userId, date });
                    
                    // Remove from localStorage
                    let localResults = [];
                    try {
                        localResults = JSON.parse(localStorage.getItem('zain_ai_results') || '[]');
                    } catch(err) {}
                    localResults = localResults.filter(r => !(r.userId === userId && r.date === date));
                    localStorage.setItem('zain_ai_results', JSON.stringify(localResults));
                    
                    showToast('تم مسح نتيجة الذكاء الاصطناعي بنجاح!', 'success');
                    loadAIResults();
                    if (window.loadAssignmentsTab) window.loadAssignmentsTab();
                } catch (err) {
                    showToast('فشل مسح النتيجة: ' + err.message, 'error');
                }
            }
        });
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
                    showToast("يرجى إدخال بريد إلكتروني صحيح للموظف أولاً!", "warning");
                    return;
                }
                
                inviteBtn.disabled = true;
                inviteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
                
                try {
                    const keys = (typeof getSavedApiKeys === 'function') ? getSavedApiKeys() : {};
                    const res = await apiCall('/api/send-invite', 'POST', {
                        userId: user.id,
                        email: emailVal,
                        testType: currentTestType,
                        brevoKey: keys.brevoKey || '',
                        resendKey: keys.resendKey || ''
                    });
                    if (res && res.sent) {
                        showToast(`تم إرسال دعوة الاختبار بنجاح إلى ${emailVal} 📧`, "success");
                    } else if (res && (res.simulated || res.link)) {
                        showToast(`تم تجهيز رابط الدخول المباشر للموظف بنجاح! 🚀`, "success");
                        showQuickLinkModal(user.name, res.link);
                    } else {
                        showToast(`تعذر إرسال الدعوة: ${res?.error || 'خطأ غير معروف'}`, "error");
                    }
                } catch (err) {
                    console.error("Invite error:", err);
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    showToast(`تم تجهيز رابط الدخول المباشر للموظف بنجاح! 🚀`, "success");
                    showQuickLinkModal(user.name, `${cleanUrl}?login=${user.id}`);
                } finally {
                    inviteBtn.disabled = false;
                    inviteBtn.innerHTML = '<i class="fa-solid fa-paper-plane" style="font-size: 0.7rem;"></i> Invite';
                }
            });
        }

        const callDirectBtn = card.querySelector('.btn-call-user-direct');
        if (callDirectBtn) {
            callDirectBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                // Switch to Call Simulator tab
                switchTab('tab-call-simulator');
                if (window.initAmeyoCallSimulator) window.initAmeyoCallSimulator();

                setTimeout(() => {
                    const employeeTargetSelect = document.getElementById('widget-employee-target-select');
                    if (employeeTargetSelect) {
                        employeeTargetSelect.value = 'emp_' + user.id;
                        employeeTargetSelect.dispatchEvent(new Event('change'));
                    }
                    const btnMakeCall = document.getElementById('btn-widget-make-call');
                    if (btnMakeCall) btnMakeCall.click();
                }, 300);
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
        modal.style.background = 'rgba(15, 23, 42, 0.65)';
        modal.style.backdropFilter = 'blur(6px)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';

        modal.innerHTML = `
            <div style="background: #ffffff; padding: 28px; border-radius: 20px; width: 92%; max-width: 480px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); border: 1px solid #cbd5e1; direction: rtl; text-align: right;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 16px;">
                    <h3 style="margin: 0; color: #0f172a; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 153, 0, 0.12); display: flex; align-items: center; justify-content: center; color: #ff9900;">
                            <i class="fa-solid fa-link" style="font-size: 1.1rem;"></i>
                        </div>
                        رابط دعوة الاختبار المباشر
                    </h3>
                    <span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                        <i class="fa-solid fa-circle-check"></i> جاهز للبدء
                    </span>
                </div>

                <p style="font-size: 0.9rem; color: #334155; margin-bottom: 14px; line-height: 1.5;">
                    تم إنشاء وتجهيز رابط الاختبار الخاص بالمشترك <strong>${employeeName}</strong>:
                </p>

                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                    <label style="font-size: 0.78rem; font-weight: 700; color: #64748b; display: block; margin-bottom: 6px;">رابط الدخول السريع:</label>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <input type="text" value="${link}" readonly style="flex: 1; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.82rem; font-family: monospace; background: #ffffff; color: #0f172a; direction: ltr; text-align: left;" id="modal-link-input">
                        <button class="btn btn-primary" id="btn-modal-copy" style="padding: 10px 18px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                            <i class="fa-solid fa-copy"></i> نسخ الرابط
                        </button>
                    </div>
                    <button class="btn" id="btn-modal-whatsapp" style="width: 100%; padding: 10px; background: #25D366; color: #ffffff; font-weight: 800; border-radius: 8px; border: none; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 3px 6px rgba(37, 211, 102, 0.25);">
                        <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i> إرسال رابط الدعوة عبر الواتساب فوراً
                    </button>
                </div>

                <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 20px; line-height: 1.4;">
                    💡 <strong>طريقة الاستخدام:</strong> يمكنك الضغط على زر الواتساب لإرسال الدعوة مباشرة للموظف، أو نسخ الرابط وإرساله له ليدخل للاختبار فوراً بدون طلب كلمة سر.
                </p>

                <div style="display: flex; justify-content: flex-end;">
                    <button class="btn btn-secondary" id="btn-modal-close" style="font-size: 0.85rem; padding: 8px 22px; border-radius: 8px;">إغلاق</button>
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
                    showToast("تم نسخ الرابط إلى الحافظة!", "success");
                }
            });
        }

        const waBtn = modal.querySelector('#btn-modal-whatsapp');
        if (waBtn) {
            waBtn.addEventListener('click', () => {
                const text = encodeURIComponent(`مرحباً ${employeeName} 👋\nإليك رابط دخولك المباشر للبدء باختبار التقييم:\n\n${link}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
            });
        }
    }

    function getSavedApiKeys() {
        const brevoEl  = document.getElementById('smtp-brevo-key');
        const resendEl = document.getElementById('smtp-resend-key');
        const brevoKey  = (brevoEl && brevoEl.value.trim()) || localStorage.getItem('smtp_brevo_key') || '';
        const resendKey = (resendEl && resendEl.value.trim()) || localStorage.getItem('smtp_resend_key') || '';
        return { brevoKey, resendKey };
    }

    // SMTP Save event handler
    const btnSaveSMTP = document.getElementById('btn-save-smtp');
    if (btnSaveSMTP) {
        btnSaveSMTP.addEventListener('click', async () => {
            const brevoKey  = document.getElementById('smtp-brevo-key')?.value.trim() || '';
            const resendKey = document.getElementById('smtp-resend-key')?.value.trim() || '';
            const host      = document.getElementById('smtp-host').value.trim();
            const port      = parseInt(document.getElementById('smtp-port').value.trim()) || 465;
            const ssl       = document.getElementById('smtp-ssl').value === 'true';
            const username  = document.getElementById('smtp-username').value.trim();
            const password  = document.getElementById('smtp-password').value.trim();
            
            if (brevoKey)  localStorage.setItem('smtp_brevo_key', brevoKey);
            if (resendKey) localStorage.setItem('smtp_resend_key', resendKey);

            btnSaveSMTP.disabled = true;
            btnSaveSMTP.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            
            try {
                await apiCall('/api/smtp', 'POST', {
                    brevoKey: brevoKey,
                    resendKey: resendKey,
                    server: host,
                    port: port,
                    enableSsl: ssl,
                    username: username,
                    password: password
                });
                showToast("Email settings saved successfully!", "success");
            } catch (err) {
                showToast(`Failed to save: ${err.message}`, "error");
            } finally {
                btnSaveSMTP.disabled = false;
                btnSaveSMTP.innerHTML = 'Save Email Settings';
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
            const localBrevo  = localStorage.getItem('smtp_brevo_key') || '';
            const localResend = localStorage.getItem('smtp_resend_key') || '';

            const brevoEl  = document.getElementById('smtp-brevo-key');
            const resendEl = document.getElementById('smtp-resend-key');
            const hostEl   = document.getElementById('smtp-host');
            const portEl   = document.getElementById('smtp-port');
            const sslEl    = document.getElementById('smtp-ssl');
            const userEl   = document.getElementById('smtp-username');
            const passEl   = document.getElementById('smtp-password');
            
            if (brevoEl)  brevoEl.value  = (settings && settings.brevoKey)  || localBrevo  || '';
            if (resendEl) resendEl.value = (settings && settings.resendKey) || localResend || '';
            if (hostEl)   hostEl.value   = (settings && settings.server)    || 'smtp.gmail.com';
            if (portEl)   portEl.value   = (settings && settings.port)      || 465;
            if (sslEl)    sslEl.value    = (settings && settings.enableSsl !== false) ? 'true' : 'false';
            if (userEl)   userEl.value   = (settings && settings.username)  || 'zaincash.testexam@gmail.com';
            if (passEl)   passEl.value   = (settings && settings.password)  || 'kqnh huof iekb sqcm';
        } catch (err) {
            console.error("Failed to load SMTP settings:", err);
        }
    }

    // ==========================================
    // KNOWLEDGE BASE LOGIC
    // ==========================================
    let kbArticles = [];
    let selectedKbCategory = 'all';
    let selectedKbArticleId = null;
    let kbArticleListAdmin = [];
    let currentKbSearchQuery = '';
    let activeMatchIndex = 0;
    let totalMatchElements = [];

    async function initKb() {
        try {
            kbArticles = await apiCall('/api/kb', 'GET');
            if (!kbArticles || kbArticles.length === 0) {
                if (window.EMBEDDED_KB_DATA && window.EMBEDDED_KB_DATA.length > 0) {
                    kbArticles = window.EMBEDDED_KB_DATA;
                }
            }
        } catch (err) {
            if (window.EMBEDDED_KB_DATA && window.EMBEDDED_KB_DATA.length > 0) {
                kbArticles = window.EMBEDDED_KB_DATA;
            }
        }

        if (kbArticles && Array.isArray(kbArticles)) {
            kbArticles.forEach((a, idx) => {
                if (!a.id) a.id = idx + 1;
            });
        }

        renderKbCategories();
        renderKbPopularArticles();
        bindKbSearchEvents();
        
        // Immediately view the first article smoothly without flashing welcome screen
        if (kbArticles && kbArticles.length > 0) {
            viewKbArticle(kbArticles[0].id);
        }

        if (currentUser && currentUser.role === 'Admin') {
            initAdminKb();
            initLivePreviews();
        }
    }

    function renderKbCategories(articlesToRender = null) {
        const ul = document.getElementById('kb-categories-ul');

        const list = articlesToRender !== null ? articlesToRender : (kbArticles || []);
        const matchCountEl = document.getElementById('kb-search-match-count');
        if (matchCountEl) {
            if (currentKbSearchQuery && currentKbSearchQuery.trim()) {
                matchCountEl.textContent = `(${list.length} قسم)`;
            } else {
                matchCountEl.textContent = '';
            }
        }

        if (!list || list.length === 0) {
            ul.innerHTML = '<li style="padding:14px; color:#94a3b8; font-size:0.85rem; text-align:center;"><i class="fa-solid fa-magnifying-glass" style="margin-bottom:6px; font-size:1.2rem; display:block;"></i>لا توجد نتائج مطابقة</li>';
            return;
        }

        let html = list.map(article => {
            const isStocks = (article.id === 1);
            const displayName = isStocks ? '📈 الدليل الشامل لخدمة تداول الأسهم' : article.title;
            const icon = isStocks ? 'fa-chart-line' : (article.icon || 'fa-folder-open');
            const isActive = (String(selectedKbArticleId) === String(article.id)) || (!selectedKbArticleId && isStocks);

            let countBadge = '';
            if (currentKbSearchQuery && currentKbSearchQuery.trim()) {
                const tokens = currentKbSearchQuery.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
                const fullText = (cleanSnippetText(article.content || '') + ' ' + (article.title || '')).toLowerCase();
                let matchOccurrences = 0;
                tokens.forEach(t => {
                    const matches = fullText.split(t).length - 1;
                    matchOccurrences += Math.max(0, matches);
                });
                if (matchOccurrences > 0) {
                    countBadge = `<span style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.72rem; font-weight:800; padding:1px 6px; border-radius:10px; flex-shrink:0;">${matchOccurrences}</span>`;
                }
            }

            return `
                <li class="${isActive ? 'active' : ''}" data-article-id="${article.id}" style="cursor:pointer; padding:9px 12px; margin:2px 4px; border-radius:10px; display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:0.84rem; font-weight:700; transition:all 0.2s; line-height:1.4;">
                    <div style="display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden;">
                        <i class="fa-solid ${icon}" style="color:var(--primary); font-size:0.92rem; width:18px; text-align:center; flex-shrink:0;"></i>
                        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(displayName)}</span>
                    </div>
                    ${countBadge}
                </li>
            `;
        }).join('');

        ul.innerHTML = html;

        ul.querySelectorAll('li[data-article-id]').forEach(li => {
            li.addEventListener('click', () => {
                ul.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                const articleId = parseInt(li.getAttribute('data-article-id')) || 1;
                selectedKbArticleId = articleId;
                selectedKbCategory = String(articleId);
                
                viewKbArticle(articleId);
            });
        });
    }

    function cleanSnippetText(rawContent) {
        if (!rawContent) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = rawContent;
        const text = tmp.textContent || tmp.innerText || '';
        return text.trim().replace(/\s+/g, ' ');
    }

    function highlightText(text, query) {
        if (!text) return '';
        if (!query || !query.trim()) return escapeHtml(text);
        const tokens = query.trim().split(/\s+/).filter(t => t.length > 0);
        if (tokens.length === 0) return escapeHtml(text);

        const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
        
        const safeText = escapeHtml(text);
        return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    function filterAndRenderKbArticles() {
        const searchInput = document.getElementById('kb-search-input');
        const rawQuery = searchInput ? searchInput.value.trim() : '';
        currentKbSearchQuery = rawQuery;
        const queryLower = rawQuery.toLowerCase();
        const tokens = queryLower.split(/\s+/).filter(t => t.length > 0);
        
        let filtered = kbArticles || [];
        if (tokens.length > 0) {
            filtered = filtered.filter(a => {
                const title = (a.title || '').toLowerCase();
                const cleanContent = cleanSnippetText(a.content || '').toLowerCase();
                const keywords = (a.keywords || '').toLowerCase();
                const category = (a.category || '').toLowerCase();
                const disp = (a.correctDisp || '').toLowerCase();
                const subDisp = (a.correctSubDisp || '').toLowerCase();

                return tokens.every(token => 
                    title.includes(token) || 
                    cleanContent.includes(token) || 
                    keywords.includes(token) ||
                    category.includes(token) ||
                    disp.includes(token) ||
                    subDisp.includes(token)
                );
            });
        }

        // Render filtered sidebar list
        renderKbCategories(tokens.length > 0 ? filtered : null);

        const viewArea = document.querySelector('.kb-content-area');
        if (!viewArea) return;

        const welcomeDiv = document.getElementById('kb-no-article-selected');
        if (welcomeDiv) welcomeDiv.classList.add('hidden');
        
        const oldResults = viewArea.querySelector('.kb-results-container');
        if (oldResults) oldResults.remove();

        if (filtered.length > 0) {
            // If currently selected article is in filtered list, stay on it, otherwise switch to first match
            const exists = filtered.find(a => String(a.id) === String(selectedKbArticleId));
            const targetId = exists ? selectedKbArticleId : filtered[0].id;
            viewKbArticle(targetId);
        } else {
            const articleView = document.getElementById('kb-article-view');
            if (articleView) articleView.classList.add('hidden');
            
            let listHtml = `
                <div class="kb-results-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:60px 20px; text-align:center;">
                    <div style="background:#f1f5f9; width:70px; height:70px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:2rem;">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 style="font-size:1.2rem; font-weight:800; color:#1e293b; margin:0;">لم يتم العثور على نتائج</h3>
                    <p style="color:#64748b; font-size:0.9rem; margin:0; max-width:400px; line-height:1.6;">
                        عذراً، لم نجد أي تعليمات أو إجراءات تطابق <strong>"${escapeHtml(rawQuery)}"</strong>. يرجى تجربة كلمات مفتاحية أخرى.
                    </p>
                </div>
            `;
            if (articleView) articleView.insertAdjacentHTML('afterend', listHtml);
        }
    }

    function renderKbPopularArticles() {
        const grid = document.getElementById('kb-popular-grid');
        if (!grid) return;

        const popularSections = [
            { id: 1, title: 'المفاهيم وسوق الأسهم وكسور الأسهم', targetSec: 'sec-1' },
            { id: 1, title: 'إنشاء الحساب، المتطلبات والاشتراكات', targetSec: 'sec-2' },
            { id: 1, title: 'الإيداع والسحب وتفاصيل محفظتك', targetSec: 'sec-3' },
            { id: 4, title: 'محفظة متوقفة CI والعمليات المسموحة', targetSec: null },
            { id: 8, title: 'تعبئة المحفظة الإلكترونية', targetSec: null },
            { id: 11, title: 'بطاقة الماستر كارد (والت كارد)', targetSec: null }
        ];

        grid.innerHTML = popularSections.map(s => `
            <div class="popular-item" data-article-id="${s.id}" data-target-sec="${s.targetSec || ''}">
                <i class="fa-solid fa-circle-play" style="color:var(--primary);"></i>
                <span>${escapeHtml(s.title)}</span>
            </div>
        `).join('');

        grid.querySelectorAll('.popular-item').forEach(item => {
            item.addEventListener('click', () => {
                const articleId = parseInt(item.getAttribute('data-article-id')) || 1;
                const targetSec = item.getAttribute('data-target-sec');
                viewKbArticle(articleId);
                if (targetSec) {
                    setTimeout(() => {
                        const el = document.getElementById(targetSec);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 60);
                }
            });
        });
    }

    function scrollToMatch(index) {
        if (!totalMatchElements || totalMatchElements.length === 0) return;
        
        totalMatchElements.forEach(el => el.classList.remove('active-match'));
        
        if (index < 0) index = totalMatchElements.length - 1;
        if (index >= totalMatchElements.length) index = 0;
        
        activeMatchIndex = index;
        const targetEl = totalMatchElements[activeMatchIndex];
        if (targetEl) {
            targetEl.classList.add('active-match');
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const currentIdxEl = document.getElementById('kb-current-match-idx');
            if (currentIdxEl) currentIdxEl.textContent = String(activeMatchIndex + 1);
        }
    }

    function viewKbArticle(articleId) {
        const article = (kbArticles || []).find(a => String(a.id) === String(articleId));
        if (!article) return;

        selectedKbArticleId = articleId;
        
        const welcomeDiv = document.getElementById('kb-no-article-selected');
        if (welcomeDiv) welcomeDiv.classList.add('hidden');
        
        const results = document.querySelector('.kb-results-container');
        if (results) results.remove();

        const view = document.getElementById('kb-article-view');
        if (view) view.classList.remove('hidden');

        const catEl = document.getElementById('kb-view-category');
        if (catEl) catEl.textContent = article.category || 'خدمات محفظة الأفراد';
        
        const titleEl = document.getElementById('kb-view-title');
        const contentEl = document.getElementById('kb-view-content');
        
        if (titleEl) {
            if (currentKbSearchQuery) {
                titleEl.innerHTML = highlightText(article.title, currentKbSearchQuery);
            } else {
                titleEl.textContent = article.title || '';
            }
        }

        if (contentEl) {
            let toolbarHtml = '';
            
            if (currentKbSearchQuery && currentKbSearchQuery.trim()) {
                const rawHtml = article.content || '';
                const tokens = currentKbSearchQuery.trim().split(/\s+/).filter(t => t.length > 0);
                
                if (tokens.length > 0) {
                    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                    const regex = new RegExp(`(?<!<[^>]*>)(${escapedTokens.join('|')})`, 'gi');
                    contentEl.innerHTML = rawHtml.replace(regex, '<mark class="search-highlight">$1</mark>');
                } else {
                    contentEl.innerHTML = rawHtml;
                }

                // Query all matching marks inside the article body
                totalMatchElements = Array.from(contentEl.querySelectorAll('mark.search-highlight'));
                
                if (totalMatchElements.length > 0) {
                    toolbarHtml = `
                        <div class="kb-search-toolbar" id="kb-active-search-toolbar">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 12px; border-radius:20px; font-size:0.82rem; border:1px solid #bfdbfe; display:inline-flex; align-items:center; gap:6px;">
                                    <i class="fa-solid fa-bullseye"></i> نتيجة <span id="kb-current-match-idx">1</span> من <span id="kb-total-match-idx">${totalMatchElements.length}</span>
                                </span>
                                <span style="font-size:0.84rem; color:#475569; font-weight:700;">لكلمة: <strong style="color:#0f172a;">"${escapeHtml(currentKbSearchQuery)}"</strong></span>
                            </div>
                            <div style="display:flex; gap:6px;">
                                <button type="button" class="kb-search-nav-btn" id="kb-btn-prev-match"><i class="fa-solid fa-chevron-up"></i> السابق</button>
                                <button type="button" class="kb-search-nav-btn" id="kb-btn-next-match">التالي <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    `;
                }
            } else {
                contentEl.innerHTML = article.content || '';
                totalMatchElements = [];
            }

            // Remove any existing toolbar and insert new if matches exist
            const oldToolbar = view.querySelector('#kb-active-search-toolbar');
            if (oldToolbar) oldToolbar.remove();
            
            if (toolbarHtml) {
                const headerBadge = view.querySelector('div[style*="justify-content:space-between"]');
                if (headerBadge) {
                    headerBadge.insertAdjacentHTML('afterend', toolbarHtml);
                    
                    const btnPrev = document.getElementById('kb-btn-prev-match');
                    const btnNext = document.getElementById('kb-btn-next-match');
                    if (btnPrev) btnPrev.addEventListener('click', () => scrollToMatch(activeMatchIndex - 1));
                    if (btnNext) btnNext.addEventListener('click', () => scrollToMatch(activeMatchIndex + 1));
                }
            }

            // Bind in-article anchor links for smooth scrolling
            contentEl.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // Automatically deep-scroll to the FIRST match immediately!
            if (totalMatchElements.length > 0) {
                setTimeout(() => {
                    scrollToMatch(0);
                }, 80);
            } else {
                contentEl.scrollTop = 0;
            }
        }

        const dispEl = document.getElementById('kb-view-correct-disp');
        if (dispEl) dispEl.textContent = article.category || 'خدمات محفظة الأفراد';
        
        const subDispEl = document.getElementById('kb-view-correct-sub');
        if (subDispEl) subDispEl.textContent = article.title || 'دليل الخدمات';
    }

    function bindKbSearchEvents() {
        const searchInput = document.getElementById('kb-search-input');
        if (searchInput) {
            let debounceTimer = null;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    filterAndRenderKbArticles();
                }, 120);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        scrollToMatch(activeMatchIndex - 1);
                    } else {
                        scrollToMatch(activeMatchIndex + 1);
                    }
                }
            });
        }

        const welcomeSearchInput = document.getElementById('kb-welcome-search-input');
        const welcomeSearchBtn = document.getElementById('kb-welcome-search-btn');
        
        if (welcomeSearchBtn && welcomeSearchInput) {
            const handleWelcomeSearch = () => {
                const val = welcomeSearchInput.value.trim();
                if (searchInput) {
                    searchInput.value = val;
                    filterAndRenderKbArticles();
                }
            };
            welcomeSearchBtn.addEventListener('click', handleWelcomeSearch);
            welcomeSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleWelcomeSearch();
            });
        }
    }

    // ==========================================
    // AI CHAT BOT LOGIC FOR KNOWLEDGE BASE
    // ==========================================
    let kbAiHistory = [];
    const chatBtn = document.getElementById('kb-ai-chat-btn');
    const chatPanel = document.getElementById('kb-ai-chat-panel');
    const closeBtn = document.getElementById('kb-ai-close-btn');
    const sendBtn = document.getElementById('kb-ai-send-btn');
    const chatInput = document.getElementById('kb-ai-chat-input');
    const chatBody = document.getElementById('kb-ai-chat-body');

    if (chatBtn && chatPanel) {
        chatBtn.addEventListener('click', () => {
            chatPanel.classList.toggle('hidden');
            if (!chatPanel.classList.contains('hidden') && chatInput) {
                chatInput.focus();
            }
        });
    }

    if (closeBtn && chatPanel) {
        closeBtn.addEventListener('click', () => {
            chatPanel.classList.add('hidden');
        });
    }

    async function handleKbAiChat() {
        if (!chatInput || !chatBody) return;
        const msg = chatInput.value.trim();
        if (!msg) return;

        chatInput.value = '';
        
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'chat-msg';
        userMsgDiv.style.alignSelf = 'flex-end';
        userMsgDiv.innerHTML = `
            <div class="user-msg">
                <p style="margin:0;">${msg}</p>
            </div>
        `;
        chatBody.appendChild(userMsgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg';
        typingDiv.style.alignSelf = 'flex-start';
        typingDiv.innerHTML = `
            <div class="ai-msg" style="align-self: flex-start; max-width: 85%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; font-size: 0.8rem; line-height: 1.5; color: #64748b; border-top-right-radius: 0;">
                <p style="margin:0;"><i class="fa-solid fa-spinner fa-spin"></i> جاري البحث في دليل المعرفة...</p>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const reply = await window.askKnowledgeBaseAI(msg, kbAiHistory, kbArticles);
            typingDiv.remove();

            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'chat-msg';
            aiMsgDiv.style.alignSelf = 'flex-start';
            aiMsgDiv.innerHTML = `
                <div class="ai-msg" style="align-self: flex-start; max-width: 85%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; font-size: 0.8rem; line-height: 1.5; color: #1e293b; border-top-right-radius: 0;">
                    <p style="margin:0; white-space: pre-line;">${reply}</p>
                </div>
            `;
            chatBody.appendChild(aiMsgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            kbAiHistory.push({ role: 'user', text: msg });
            kbAiHistory.push({ role: 'model', text: reply });
        } catch (err) {
            typingDiv.remove();
            const errDiv = document.createElement('div');
            errDiv.className = 'chat-msg';
            errDiv.style.alignSelf = 'flex-start';
            errDiv.innerHTML = `
                <div class="ai-msg" style="align-self: flex-start; max-width: 85%; background: #ffebee; border: 1px solid #ffcdd2; border-radius: 12px; padding: 10px 14px; font-size: 0.8rem; line-height: 1.5; color: #c62828; border-top-right-radius: 0;">
                    <p style="margin:0;">⚠️ عذراً عيني، واجهت مشكلة بالاتصال بالذكاء الاصطناعي. يرجى التأكد من مفتاح API في الإعدادات.</p>
                </div>
            `;
            chatBody.appendChild(errDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', handleKbAiChat);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleKbAiChat(); });

    // ==========================================
    // TRAINING CENTER HUB NAVIGATION
    // ==========================================
    const startSlides = document.getElementById('btn-start-slides');
    const startSimulator = document.getElementById('btn-start-simulator');
    const startAiAgent = document.getElementById('btn-start-ai-agent');
    const startCallSimulator = document.getElementById('btn-start-call-simulator');

    if (startSlides) startSlides.addEventListener('click', () => switchTab('tab-slides'));
    if (startSimulator) startSimulator.addEventListener('click', () => switchTab('tab-simulator'));
    if (startAiAgent) startAiAgent.addEventListener('click', () => switchTab('tab-ai-agent'));
    if (startCallSimulator) startCallSimulator.addEventListener('click', () => {
        switchTab('tab-call-simulator');
        if (window.initAmeyoCallSimulator) window.initAmeyoCallSimulator();
    });

    document.querySelectorAll('.btn-back-to-tc').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('tab-training-center');
        });
    });

    // ==========================================
    // ADMIN KNOWLEDGE BASE MANAGEMENT
    // ==========================================
    let isKbVisualMode = true;

    async function initAdminKb() {
        const listUl = document.getElementById('admin-kb-list-ul');
        if (!listUl) return;

        kbArticleListAdmin = [...kbArticles];
        renderAdminKbList();
        
        populateKBDispositionsDropdowns();
        populateKBCategoriesDatalist();
        initKBVisualEditor();

        const addNewBtn = document.getElementById('add-new-kb-btn');
        if (addNewBtn) {
            addNewBtn.addEventListener('click', () => {
                listUl.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                document.getElementById('no-kb-selected').classList.add('hidden');
                const form = document.getElementById('kb-edit-form');
                form.classList.remove('hidden');
                form.reset();
                
                const visualEl = document.getElementById('edit-kb-content-visual');
                const rawEl = document.getElementById('edit-kb-content');
                if (visualEl) visualEl.innerHTML = '<p>اكتب التعليمات والخطوات هنا...</p>';
                if (rawEl) rawEl.value = '<p>اكتب التعليمات والخطوات هنا...</p>';
                
                document.getElementById('edit-kb-id').value = 'new';
                document.getElementById('delete-kb-btn').style.display = 'none';
                updateKBLivePreview();
            });
        }

        const editForm = document.getElementById('kb-edit-form');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const idVal = document.getElementById('edit-kb-id').value;
                const title = document.getElementById('edit-kb-title').value.trim();
                const category = document.getElementById('edit-kb-category').value.trim() || 'خدمات محفظة الأفراد';
                
                // Read content from visual editor if in visual mode, else from raw textarea
                const visualEl = document.getElementById('edit-kb-content-visual');
                const rawEl = document.getElementById('edit-kb-content');
                let content = isKbVisualMode && visualEl ? visualEl.innerHTML.trim() : (rawEl ? rawEl.value.trim() : '');
                
                const keywords = document.getElementById('edit-kb-keywords').value.trim();
                const mainDisp = document.getElementById('edit-kb-correct-disp').value || '';
                const subDisp = document.getElementById('edit-kb-correct-sub').value || '';

                if (idVal === 'new') {
                    const newArt = {
                        id: Date.now(),
                        title,
                        category,
                        content,
                        keywords,
                        correctDisp: mainDisp,
                        correctSubDisp: subDisp
                    };
                    kbArticleListAdmin.push(newArt);
                } else {
                    const artId = parseInt(idVal);
                    const art = kbArticleListAdmin.find(a => a.id === artId);
                    if (art) {
                        art.title = title;
                        art.category = category;
                        art.content = content;
                        art.keywords = keywords;
                        art.correctDisp = mainDisp;
                        art.correctSubDisp = subDisp;
                    }
                }
                await saveAdminKbArticles();
            });
        }

        const deleteBtn = document.getElementById('delete-kb-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const idVal = document.getElementById('edit-kb-id').value;
                if (idVal !== 'new' && confirm('هل أنت متأكد من رغبتك في حذف هذا المقال المعرفي نهائياً؟')) {
                    const artId = parseInt(idVal);
                    kbArticleListAdmin = kbArticleListAdmin.filter(a => a.id !== artId);
                    await saveAdminKbArticles();
                }
            });
        }
    }

    function initKBVisualEditor() {
        const btnVisual = document.getElementById('btn-kb-mode-visual');
        const btnHtml = document.getElementById('btn-kb-mode-html');
        const toolbar = document.getElementById('kb-editor-toolbar');
        const visualEl = document.getElementById('edit-kb-content-visual');
        const rawEl = document.getElementById('edit-kb-content');

        if (btnVisual && btnHtml && visualEl && rawEl) {
            btnVisual.addEventListener('click', () => {
                isKbVisualMode = true;
                btnVisual.classList.add('active');
                btnHtml.classList.remove('active');
                if (toolbar) toolbar.classList.remove('hidden');
                visualEl.innerHTML = rawEl.value;
                visualEl.classList.remove('hidden');
                rawEl.classList.add('hidden');
                updateKBLivePreview();
            });

            btnHtml.addEventListener('click', () => {
                isKbVisualMode = false;
                btnHtml.classList.add('active');
                btnVisual.classList.remove('active');
                if (toolbar) toolbar.classList.add('hidden');
                rawEl.value = visualEl.innerHTML;
                rawEl.classList.remove('hidden');
                visualEl.classList.add('hidden');
                updateKBLivePreview();
            });

            visualEl.addEventListener('input', () => {
                rawEl.value = visualEl.innerHTML;
                updateKBLivePreview();
            });

            rawEl.addEventListener('input', () => {
                visualEl.innerHTML = rawEl.value;
                updateKBLivePreview();
            });
        }

        // Setup toolbar commands
        if (toolbar) {
            toolbar.querySelectorAll('button[data-cmd]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cmd = btn.getAttribute('data-cmd');
                    document.execCommand(cmd, false, null);
                    if (visualEl) visualEl.focus();
                    if (visualEl && rawEl) rawEl.value = visualEl.innerHTML;
                    updateKBLivePreview();
                });
            });

            toolbar.querySelectorAll('button[data-format]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tag = btn.getAttribute('data-format');
                    document.execCommand('formatBlock', false, `<${tag}>`);
                    if (visualEl) visualEl.focus();
                    if (visualEl && rawEl) rawEl.value = visualEl.innerHTML;
                    updateKBLivePreview();
                });
            });

            toolbar.querySelectorAll('button[data-snippet]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const snippet = btn.getAttribute('data-snippet');
                    let htmlSnippet = '';
                    if (snippet === 'alert-info') {
                        htmlSnippet = '<div class="kb-alert-box" style="background:#eff6ff; border:1px solid #bfdbfe; border-right:4px solid #3b82f6; border-radius:8px; padding:10px 14px; margin:10px 0;"><i class="fa-solid fa-circle-info" style="color:#2563eb; margin-left:6px;"></i><strong>ملاحظة هامة:</strong> اكتب الملاحظة هنا...</div>';
                    } else if (snippet === 'alert-warning') {
                        htmlSnippet = '<div class="kb-warning-box" style="background:#fffbeb; border:1px solid #fde68a; border-right:4px solid #f59e0b; border-radius:8px; padding:10px 14px; margin:10px 0;"><i class="fa-solid fa-triangle-exclamation" style="color:#d97706; margin-left:6px;"></i><strong>تنبيه وتحذير:</strong> اكتب التنبيه هنا...</div>';
                    } else if (snippet === 'step-card') {
                        htmlSnippet = '<div class="kb-step-card" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin:10px 0;"><h4 style="margin:0 0 6px 0; color:#1e293b; font-size:0.92rem;">📌 الخطوة 1: العنوان المطلوب</h4><p style="margin:0; font-size:0.85rem; color:#475569;">التفاصيل والإجراء...</p></div>';
                    } else if (snippet === 'queue-badge') {
                        htmlSnippet = '&nbsp;<span style="background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; display:inline-block;">BO-QueueName</span>&nbsp;';
                    }

                    if (htmlSnippet) {
                        document.execCommand('insertHTML', false, htmlSnippet);
                        if (visualEl) visualEl.focus();
                        if (visualEl && rawEl) rawEl.value = visualEl.innerHTML;
                        updateKBLivePreview();
                    }
                });
            });
        }
    }

    function renderAdminKbList() {
        const listUl = document.getElementById('admin-kb-list-ul');
        if (!listUl) return;

        listUl.innerHTML = kbArticleListAdmin.map(a => `
            <li data-art-id="${a.id}">
                <div style="font-size:0.65rem; color:#ff9900; font-weight:700;">${escapeHtml(a.category || 'خدمات محفظة الأفراد')}</div>
                <div style="font-size:0.8rem; font-weight:700; margin-top:2px;">${escapeHtml(a.title || '')}</div>
            </li>
        `).join('');

        listUl.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                listUl.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                
                const artId = parseInt(li.getAttribute('data-art-id'));
                const art = kbArticleListAdmin.find(a => a.id === artId);
                if (art) {
                    document.getElementById('no-kb-selected').classList.add('hidden');
                    const form = document.getElementById('kb-edit-form');
                    form.classList.remove('hidden');
                    document.getElementById('delete-kb-btn').style.display = 'block';

                    document.getElementById('edit-kb-id').value = art.id;
                    document.getElementById('edit-kb-title').value = art.title || '';
                    document.getElementById('edit-kb-category').value = art.category || '';
                    
                    const visualEl = document.getElementById('edit-kb-content-visual');
                    const rawEl = document.getElementById('edit-kb-content');
                    if (visualEl) visualEl.innerHTML = art.content || '';
                    if (rawEl) rawEl.value = art.content || '';

                    document.getElementById('edit-kb-keywords').value = art.keywords || '';
                    
                    const mainSel = document.getElementById('edit-kb-correct-disp');
                    if (mainSel) mainSel.value = art.correctDisp || '';
                    
                    populateKBSubDispositions();
                    const subSel = document.getElementById('edit-kb-correct-sub');
                    if (subSel) subSel.value = art.correctSubDisp || '';

                    updateKBLivePreview();
                }
            });
        });
    }

    async function saveAdminKbArticles() {
        try {
            await apiCall('/api/kb', 'POST', kbArticleListAdmin);
            showToast('✅ تم حفظ مقالات المعرفة بنجاح!', 'success');
            kbArticles = [...kbArticleListAdmin];
            renderKbCategories();
            renderKbPopularArticles();
            renderAdminKbList();
            populateKBCategoriesDatalist();
            document.getElementById('kb-edit-form').classList.add('hidden');
            document.getElementById('no-kb-selected').classList.remove('hidden');
            document.getElementById('kb-live-preview-panel').classList.add('hidden');
        } catch (err) {
            console.error("Failed to save articles", err);
            showToast('❌ عذراً، فشل حفظ التعديلات!', 'error');
        }
    }

    function populateKBDispositionsDropdowns() {
        const mainSel = document.getElementById('edit-kb-correct-disp');
        const subSel = document.getElementById('edit-kb-correct-sub');
        if (!mainSel || !subSel) return;

        const dispData = window.DISPOSITION_DATA || GLOBAL_DISPOSITION_DATA || {};
        mainSel.innerHTML = '<option value="">(بدون تصنيف / اختياري)</option>' + 
            Object.keys(dispData).map(k => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`).join('');

        mainSel.addEventListener('change', () => {
            populateKBSubDispositions();
            updateKBLivePreview();
        });
        subSel.addEventListener('change', () => {
            updateKBLivePreview();
        });
    }

    function populateKBSubDispositions() {
        const mainSel = document.getElementById('edit-kb-correct-disp');
        const subSel = document.getElementById('edit-kb-correct-sub');
        if (!mainSel || !subSel) return;

        const mainVal = mainSel.value;
        const dispData = window.DISPOSITION_DATA || GLOBAL_DISPOSITION_DATA || {};
        if (mainVal && dispData[mainVal]) {
            subSel.innerHTML = '<option value="">(بدون تصنيف فرعي / اختياري)</option>' + 
                dispData[mainVal].map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
        } else {
            subSel.innerHTML = '<option value="">(بدون تصنيف فرعي / اختياري)</option>';
        }
    }

    function populateKBCategoriesDatalist() {
        const datalist = document.getElementById('kb-categories-datalist');
        if (!datalist) return;
        const uniqueCats = Array.from(new Set((kbArticleListAdmin || []).map(a => a.category).filter(Boolean)));
        datalist.innerHTML = uniqueCats.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
    }

    // ==========================================
    // ADMIN LIVE PREVIEWS BINDINGS
    // ==========================================
    function initLivePreviews() {
        const mcqForm = document.getElementById('scenario-edit-form');
        if (mcqForm) {
            const inputs = [
                'edit-customer-name', 'edit-cust-msg', 
                'edit-opt1-text', 'edit-opt2-text', 'edit-opt3-text',
                'edit-opt1-correct', 'edit-opt2-correct', 'edit-opt3-correct'
            ];
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', updateMCQLivePreview);
                    el.addEventListener('change', updateMCQLivePreview);
                }
            });
            // Update on scenario selector change
            const selectList = document.getElementById('admin-scenarios-list-ul');
            if (selectList) {
                selectList.addEventListener('click', () => setTimeout(updateMCQLivePreview, 100));
            }
        }

        const slideForm = document.getElementById('slide-edit-form');
        if (slideForm) {
            slideForm.addEventListener('input', updateSlideLivePreview);
            slideForm.addEventListener('change', updateSlideLivePreview);
            
            const slideSelectList = document.getElementById('admin-slides-list-ul');
            if (slideSelectList) {
                slideSelectList.addEventListener('click', () => setTimeout(updateSlideLivePreview, 100));
            }
        }

        const kbForm = document.getElementById('kb-edit-form');
        if (kbForm) {
            kbForm.addEventListener('input', updateKBLivePreview);
            kbForm.addEventListener('change', updateKBLivePreview);
        }
    }

    function updateMCQLivePreview() {
        const name = document.getElementById('edit-customer-name').value || 'Mohammad';
        const msg = document.getElementById('edit-cust-msg').value || 'رسالة المشترك هنا...';
        const opt1 = document.getElementById('edit-opt1-text').value || 'Option 1';
        const opt2 = document.getElementById('edit-opt2-text').value || 'Option 2';
        const opt3 = document.getElementById('edit-opt3-text').value || 'Option 3';
        
        const opt1Correct = document.getElementById('edit-opt1-correct').checked;
        const opt2Correct = document.getElementById('edit-opt2-correct').checked;
        const opt3Correct = document.getElementById('edit-opt3-correct').checked;

        const panel = document.getElementById('mcq-live-preview-panel');
        if (panel) panel.classList.remove('hidden');

        document.getElementById('mcq-preview-name').textContent = name;
        document.getElementById('mcq-preview-avatar').textContent = name ? name.charAt(0).toUpperCase() : 'C';
        document.getElementById('mcq-preview-cust-msg').textContent = msg;
        
        const o1El = document.getElementById('mcq-preview-opt1');
        const o2El = document.getElementById('mcq-preview-opt2');
        const o3El = document.getElementById('mcq-preview-opt3');

        if (o1El) {
            o1El.style.background = opt1Correct ? 'rgba(255, 153, 0, 0.12)' : 'white';
            o1El.style.borderColor = opt1Correct ? 'var(--primary)' : '#cbd5e1';
            o1El.style.color = opt1Correct ? 'var(--primary)' : '#475569';
            o1El.innerHTML = (opt1Correct ? '<i class="fa-solid fa-circle-check"></i> ' : '') + opt1;
        }
        if (o2El) {
            o2El.style.background = opt2Correct ? 'rgba(255, 153, 0, 0.12)' : 'white';
            o2El.style.borderColor = opt2Correct ? 'var(--primary)' : '#cbd5e1';
            o2El.style.color = opt2Correct ? 'var(--primary)' : '#475569';
            o2El.innerHTML = (opt2Correct ? '<i class="fa-solid fa-circle-check"></i> ' : '') + opt2;
        }
        if (o3El) {
            o3El.style.background = opt3Correct ? 'rgba(255, 153, 0, 0.12)' : 'white';
            o3El.style.borderColor = opt3Correct ? 'var(--primary)' : '#cbd5e1';
            o3El.style.color = opt3Correct ? 'var(--primary)' : '#475569';
            o3El.innerHTML = (opt3Correct ? '<i class="fa-solid fa-circle-check"></i> ' : '') + opt3;
        }
    }

    function updateKBLivePreview() {
        const title = document.getElementById('edit-kb-title').value || 'عنوان المقال...';
        const category = document.getElementById('edit-kb-category').value || 'خدمات محفظة الأفراد';
        
        const visualEl = document.getElementById('edit-kb-content-visual');
        const rawEl = document.getElementById('edit-kb-content');
        const content = isKbVisualMode && visualEl ? visualEl.innerHTML : (rawEl ? rawEl.value : '');
        
        const disp = document.getElementById('edit-kb-correct-disp').value || '(بدون تصنيف)';
        const sub = document.getElementById('edit-kb-correct-sub').value || '(بدون تصنيف فرعي)';

        const panel = document.getElementById('kb-live-preview-panel');
        if (panel) panel.classList.remove('hidden');

        document.getElementById('kb-preview-title').textContent = title;
        document.getElementById('kb-preview-category').textContent = category;
        
        const contentPreview = document.getElementById('kb-preview-content');
        if (contentPreview) {
            contentPreview.innerHTML = content || '<span style="color:#94a3b8;">محتوى المقال سيظهر هنا...</span>';
        }
        
        document.getElementById('kb-preview-main-badge').textContent = disp;
        document.getElementById('kb-preview-sub-badge').textContent = sub;
    }

    function updateSlideLivePreview() {
        const title = document.getElementById('edit-slide-title').value || 'العنوان...';
        const subtitle = document.getElementById('edit-slide-subtitle').value || 'الوصف...';
        const type = document.getElementById('edit-slide-type').value;

        const panel = document.getElementById('slides-live-preview-panel');
        if (panel) panel.classList.remove('hidden');

        const container = document.getElementById('mini-slide-render-container');
        if (!container) return;

        let html = `<h3 style="font-size:0.95rem; color:var(--primary); font-weight:800; margin-bottom:5px; text-align:right; font-family:var(--font-ar);">${title}</h3>`;
        html += `<p style="font-size:0.75rem; color:#64748b; margin-bottom:12px; text-align:right; font-family:var(--font-ar);">${subtitle}</p>`;

        if (type === 'comparison') {
            const rTitle = document.getElementById('edit-comp-right-title').value || 'الرد المقبول';
            const rText = document.getElementById('edit-comp-right-text').value || '';
            const w1Text = document.getElementById('edit-comp-wrong-1-text').value || '';
            const tip = document.getElementById('edit-comp-tip').value || '';

            html += `<div style="background:#e8f5e9; border:1px solid #c8e6c9; padding:8px; border-radius:6px; margin-bottom:6px; color:#2e7d32; text-align:right; font-family:var(--font-ar);">
                <strong>✓ ${rTitle}</strong><br/>${rText}
            </div>`;
            if (w1Text) {
                html += `<div style="background:#ffebee; border:1px solid #ffcdd2; padding:8px; border-radius:6px; margin-bottom:6px; color:#c62828; text-align:right; font-family:var(--font-ar);">
                    <strong>✗ غير مقبول</strong><br/>${w1Text}
                </div>`;
            }
            if (tip) {
                html += `<div style="background:#fff9c4; border:1px solid #fff59d; padding:8px; border-radius:6px; font-size:0.65rem; color:#f57f17; text-align:right; font-family:var(--font-ar);">
                    💡 ${tip}
                </div>`;
            }
        } else if (type === 'comparison_context') {
            const ctx = document.getElementById('edit-ctx-context').value || '';
            const rTitle = document.getElementById('edit-ctx-right-title').value || 'الرد المقبول';
            const rText = document.getElementById('edit-ctx-right-text').value || '';
            const wText = document.getElementById('edit-ctx-wrong-text').value || '';

            if (ctx) html += `<div style="background:#f1f5f9; padding:6px; border-radius:4px; font-size:0.7rem; margin-bottom:8px; text-align:right; font-family:var(--font-ar);">السياق: ${ctx}</div>`;
            html += `<div style="background:#e8f5e9; border:1px solid #c8e6c9; padding:8px; border-radius:6px; margin-bottom:6px; color:#2e7d32; text-align:right; font-family:var(--font-ar);">
                <strong>✓ ${rTitle}</strong><br/>${rText}
            </div>`;
            if (wText) {
                html += `<div style="background:#ffebee; border:1px solid #ffcdd2; padding:8px; border-radius:6px; margin-bottom:6px; color:#c62828; text-align:right; font-family:var(--font-ar);">
                    <strong>✗ غير مقبول</strong><br/>${wText}
                </div>`;
            }
        } else if (type === 'steps') {
            const s1 = document.getElementById('edit-steps-1-title').value || '';
            const s2 = document.getElementById('edit-steps-2-title').value || '';
            const s3 = document.getElementById('edit-steps-3-title').value || '';
            const ctx = document.getElementById('edit-steps-context').value || '';
            const rText = document.getElementById('edit-steps-right-text').value || '';

            html += `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-bottom:10px; direction:rtl;">`;
            if (s1) html += `<div style="background:#eceff1; padding:5px; border-radius:4px; font-size:0.62rem; text-align:center;">1. ${s1}</div>`;
            if (s2) html += `<div style="background:#eceff1; padding:5px; border-radius:4px; font-size:0.62rem; text-align:center;">2. ${s2}</div>`;
            if (s3) html += `<div style="background:#eceff1; padding:5px; border-radius:4px; font-size:0.62rem; text-align:center;">3. ${s3}</div>`;
            html += `</div>`;

            if (ctx) html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; text-align:right; font-family:var(--font-ar);">
                <strong>مثال تطبيقي:</strong><br/>سؤال: ${ctx}<br/><span style="color:#2e7d32;">✓ الرد: ${rText}</span>
            </div>`;
        }

        container.innerHTML = html;
    }

    // Global maps to keep track of simulator state
    let simulatorTurnMap = {};
    let simulatorCorrectCountMap = {};
    let simulatorSelectedAnswers = {};

    function renderSimulatorTurnOptions(chatId, turnIdx) {
        const chat = multiChatAgent.chats.find(c => c.id === chatId);
        if (!chat) return;

        const sc = chat.originalScenario;
        const container = document.getElementById(`chat-options-container-${chatId}`);
        if (!container) return;

        container.innerHTML = '';

        if (!sc || !sc.turns || !sc.turns[turnIdx]) {
            const isAdm = currentUser && currentUser.role === 'Admin';
            container.innerHTML = `
                <div style="text-align: center; color: #16a34a; font-size: 0.8rem; font-weight: 700; padding: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-family: var(--font-ar); direction: rtl;">
                    <i class="fa-solid fa-circle-check"></i> ${isAdm ? 'اكتملت المحادثة! يرجى إغلاقها من الأعلى (X).' : 'اكتملت المحادثة! يرجى إغلاقها وتصنيف التذكرة من الأعلى (X).'}
                </div>
            `;
            if (turnIdx > 0) {
                const dispPanel = document.getElementById(`disposition-panel-${chatId}`);
                const profPanel = document.getElementById(`profile-panel-${chatId}`);
                if (dispPanel && !isAdm) {
                    dispPanel.classList.remove('hidden');
                }
                if (profPanel) {
                    profPanel.classList.add('hidden');
                }
            }
            return;
        }

        const turn = sc.turns[turnIdx];
        
        turn.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.innerHTML = `<span>${escapeHtml(opt.text)}</span>`;
            
            btn.addEventListener('click', () => {
                handleSimulatorOptionClick(chatId, turnIdx, idx);
            });
            
            container.appendChild(btn);
        });
    }

    async function handleSimulatorOptionClick(chatId, turnIdx, optionIdx) {
        const chat = multiChatAgent.chats.find(c => c.id === chatId);
        if (!chat) return;

        const sc = chat.originalScenario;
        const turn = sc.turns[turnIdx];
        const selectedOpt = turn.options[optionIdx];

        const chatBody = document.getElementById(`chat-body-${chatId}`);
        if (chatBody) {
            const empMsgEl = document.createElement('div');
            empMsgEl.className = 'message message-employee';
            empMsgEl.innerHTML = `<p>${escapeHtml(selectedOpt.text)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
            chatBody.appendChild(empMsgEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        if (!simulatorSelectedAnswers[chatId]) simulatorSelectedAnswers[chatId] = [];
        simulatorSelectedAnswers[chatId][turnIdx] = optionIdx;

        if (selectedOpt.isCorrect) {
            simulatorCorrectCountMap[chatId] = (simulatorCorrectCountMap[chatId] || 0) + 1;
        }

        // Silent recording: No instant green/red feedback message added during test mode

        const container = document.getElementById(`chat-options-container-${chatId}`);
        if (container) container.innerHTML = '';

        const nextTurnIdx = turnIdx + 1;
        simulatorTurnMap[chatId] = nextTurnIdx;

        if (sc.turns && sc.turns[nextTurnIdx]) {
            const typingIndicator = document.getElementById(`typing-indicator-${chatId}`);
            if (typingIndicator) typingIndicator.classList.remove('hidden');
            if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                if (typingIndicator) typingIndicator.classList.add('hidden');
                
                const nextTurn = sc.turns[nextTurnIdx];
                if (chatBody) {
                    const custMsgEl = document.createElement('div');
                    custMsgEl.className = 'message message-customer';
                    custMsgEl.innerHTML = `<p>${escapeHtml(nextTurn.customerText)}</p><span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
                    chatBody.appendChild(custMsgEl);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }

                renderSimulatorTurnOptions(chatId, nextTurnIdx);
            }, 1200);
        } else {
            renderSimulatorTurnOptions(chatId, nextTurnIdx);
        }
    }

    // =========================================================================
    // 📞 AMEYO TELEPHONY & VOICE CALL SIMULATOR ENGINE
    // =========================================================================
    const OUTBOUND_SUB_DISPOSITIONS = [
        "Informations Required",
        "Customer Requested Call",
        "Clarifications Call",
        "Customer Callback",
        "Survey Call",
        "Manager Call",
        "Technical Assistance Follow-up"
    ];

    const CALL_SCENARIOS = [
        {
            id: 'inbound-1',
            type: 'inbound',
            customerName: 'أحمد محمد عبد الله',
            customerPhone: '07723065187',
            campaign: 'Zain Cash',
            queue: 'CustomerService_Ar',
            heading: 'مكالمة واردة: استفسار عن تداول الأسهم الأمريكية (US Stocks)',
            voiceText: 'السلام عليكم أخي، ردت استفسر عن تداول الأسهم بالتطبيق، كاعد يطلعلي خطأ وما يقبل يسوي أمر الشراء، ممكن تساعدني وتوضحلي شنو المتطلبات وعقد W-8BEN؟',
            correctDisp: 'Inquiry',
            correctSubDisp: 'Application Usage',
            balance: '350,000 د.ع',
            walletType: 'دائمية موثقة (Full KYC)',
            status: 'نشطة (Active)'
        },
        {
            id: 'inbound-2',
            type: 'inbound',
            customerName: 'سارة فاضل عباس',
            customerPhone: '07802345678',
            campaign: 'Zain Cash',
            queue: 'CustomerService_Ar',
            heading: 'مكالمة واردة: محفظة متوقفة ورسالة CI (Inactive Wallet)',
            voiceText: 'مرحبا عيني، محفظتي انقفلت فجأة ومكتوب Additional Customer Information (CI) ومكاعد اكدر احول فلوس، شسوي حتى تفتح؟',
            correctDisp: 'Inquiry',
            correctSubDisp: 'Wallet Account Status',
            balance: '120,000 د.ع',
            walletType: 'دائمية (CI Flagged)',
            status: 'متوقفة مؤقتاً (Inactive / CI)'
        },
        {
            id: 'inbound-3',
            type: 'inbound',
            customerName: 'حيدر جاسم كاظم',
            customerPhone: '07719876543',
            campaign: 'Zain Cash',
            queue: 'CustomerService_Ar',
            heading: 'مكالمة واردة: حوالة ويسترن يونيون معلقة (WU Name Amendment)',
            voiceText: 'هلو أخي، استلمت حوالة ويسترن يونيون على المحفظة ومكتوب اسمي بي غلط بحرف واحد ومكاعد تنزل، شلون اصلح الاسم؟',
            correctDisp: 'Request',
            correctSubDisp: 'Western Union',
            balance: '500.00 $',
            walletType: 'دائمية موثقة (Full KYC)',
            status: 'نشطة (Active)'
        },
        {
            id: 'outbound-1',
            type: 'outbound',
            customerName: 'علي مهدي صالح',
            customerPhone: '07727900402',
            campaign: 'Zain Cash_Outbound',
            queue: 'Outbound_Campaign',
            heading: 'مكالمة صادرة: متابعة تذكرة دعم فني أو استبيان جودة',
            voiceText: 'أهلاً بك، أنا علي.. بخصوص الشكوى الي رفعتها قبل يومين مال استرجاع رصيد البطاقة، صار تحديث؟',
            correctDisp: 'Outbound Calls',
            correctSubDisp: 'Customer Callback',
            balance: '75,000 د.ع',
            walletType: 'دائمية موثقة',
            status: 'نشطة (Active)'
        }
    ];

    let currentCallState = 'idle'; // 'idle', 'ringing', 'active', 'disposition'
    let activeCallScenario = null;
    let callDurationSeconds = 0;
    let holdDurationSeconds = 0;
    let acwDurationSeconds = 0;
    let isCallOnHold = false;
    let isCallMuted = false;
    let callDurationInterval = null;
    let holdDurationInterval = null;
    let acwDurationInterval = null;

    // Web Audio Synthesizer for Zero-Asset Sound Effects
    let audioCtx = null;
    let activeRingOsc1 = null, activeRingOsc2 = null, ringGain = null;
    let activeHoldOsc = null, holdIntervalId = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playRingtone() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            stopRingtone();

            ringGain = ctx.createGain();
            ringGain.gain.setValueAtTime(0.15, ctx.currentTime);
            ringGain.connect(ctx.destination);

            activeRingOsc1 = ctx.createOscillator();
            activeRingOsc2 = ctx.createOscillator();
            activeRingOsc1.type = 'sine';
            activeRingOsc2.type = 'sine';
            activeRingOsc1.frequency.setValueAtTime(440, ctx.currentTime);
            activeRingOsc2.frequency.setValueAtTime(480, ctx.currentTime);

            activeRingOsc1.connect(ringGain);
            activeRingOsc2.connect(ringGain);
            activeRingOsc1.start();
            activeRingOsc2.start();
        } catch (e) {
            console.warn("Audio synthesis error", e);
        }
    }

    function stopRingtone() {
        try {
            if (activeRingOsc1) { activeRingOsc1.stop(); activeRingOsc1.disconnect(); activeRingOsc1 = null; }
            if (activeRingOsc2) { activeRingOsc2.stop(); activeRingOsc2.disconnect(); activeRingOsc2 = null; }
            if (ringGain) { ringGain.disconnect(); ringGain = null; }
        } catch (e) {}
    }

    function playHoldTune() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            stopHoldTune();

            const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25];
            let noteIdx = 0;

            holdIntervalId = setInterval(() => {
                try {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.5);
                    noteIdx++;
                } catch (e) {}
            }, 550);
        } catch (e) {}
    }

    function stopHoldTune() {
        if (holdIntervalId) {
            clearInterval(holdIntervalId);
            holdIntervalId = null;
        }
    }

    function playBeep(freq = 600, duration = 0.15) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    function formatTimeMMSS(totalSecs) {
        const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
        const s = (totalSecs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function formatTimeHHMMSS(totalSecs) {
        const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSecs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // ==========================================
    // 🎙️ WebRTC Real-Time Audio Manager
    // ==========================================
    let localStream = null;
    let peerConn = null;
    let remoteAudioEl = null;
    let pendingOfferSdp = null;

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
        ]
    };

    function ensureRemoteAudioElement() {
        if (!remoteAudioEl) {
            remoteAudioEl = document.createElement('audio');
            remoteAudioEl.id = 'webrtc-remote-audio';
            remoteAudioEl.autoplay = true;
            remoteAudioEl.style.display = 'none';
            document.body.appendChild(remoteAudioEl);
        }
        return remoteAudioEl;
    }

    async function startLocalAudioStream() {
        try {
            if (!localStream) {
                localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            }
            return localStream;
        } catch (err) {
            console.warn("Microphone access not granted or unavailable:", err);
            return null;
        }
    }

    function stopLocalAudioStream() {
        if (localStream) {
            localStream.getTracks().forEach(t => t.stop());
            localStream = null;
        }
        if (peerConn) {
            try { peerConn.close(); } catch(e){}
            peerConn = null;
        }
    }

    async function initWebRTCOffer(targetUserId, currentUserId) {
        stopLocalAudioStream();
        const audio = ensureRemoteAudioElement();
        const stream = await startLocalAudioStream();
        
        peerConn = new RTCPeerConnection(rtcConfig);

        if (stream) {
            stream.getTracks().forEach(track => peerConn.addTrack(track, stream));
        }

        peerConn.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                audio.srcObject = event.streams[0];
            }
        };

        peerConn.onicecandidate = (event) => {
            if (event.candidate) {
                apiCall('/api/call-signal', 'POST', {
                    toUserId: targetUserId,
                    fromUserId: currentUserId,
                    type: 'ice_candidate',
                    candidate: event.candidate
                }).catch(() => {});
            }
        };

        const offer = await peerConn.createOffer();
        await peerConn.setLocalDescription(offer);

        return offer;
    }

    async function handleWebRTCOffer(offerSdp, fromUserId, currentUserId) {
        stopLocalAudioStream();
        const audio = ensureRemoteAudioElement();
        const stream = await startLocalAudioStream();

        peerConn = new RTCPeerConnection(rtcConfig);

        if (stream) {
            stream.getTracks().forEach(track => peerConn.addTrack(track, stream));
        }

        peerConn.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                audio.srcObject = event.streams[0];
            }
        };

        peerConn.onicecandidate = (event) => {
            if (event.candidate) {
                apiCall('/api/call-signal', 'POST', {
                    toUserId: fromUserId,
                    fromUserId: currentUserId,
                    type: 'ice_candidate',
                    candidate: event.candidate
                }).catch(() => {});
            }
        };

        await peerConn.setRemoteDescription(new RTCSessionDescription(offerSdp));
        const answer = await peerConn.createAnswer();
        await peerConn.setLocalDescription(answer);

        return answer;
    }

    async function handleWebRTCAnswer(answerSdp) {
        if (peerConn && peerConn.signalingState !== 'closed') {
            await peerConn.setRemoteDescription(new RTCSessionDescription(answerSdp));
        }
    }

    async function handleRemoteIceCandidate(candidate) {
        if (peerConn && peerConn.signalingState !== 'closed') {
            try {
                await peerConn.addIceCandidate(new RTCIceCandidate(candidate));
            } catch(e){}
        }
    }

    function switchAmeyoPhoneView(viewName) {
        const views = {
            'idle': document.getElementById('phone-view-idle'),
            'ringing': document.getElementById('phone-view-ringing'),
            'active': document.getElementById('phone-view-active'),
            'disposition': document.getElementById('phone-view-disposition')
        };
        Object.keys(views).forEach(k => {
            if (views[k]) {
                if (k === viewName) views[k].classList.remove('hidden');
                else views[k].classList.add('hidden');
            }
        });
        currentCallState = viewName;

        const user = currentUser || window.currentUser || JSON.parse(sessionStorage.getItem('zain_cash_user') || localStorage.getItem('zain_cash_user') || '{}');
        const isAdmin = user.role === 'Admin' || user.id === 'admin' || user.id === 'u_admin' || user.id === 'ZC000' || user.id === 'ZC599';
        const idleWaiting = document.getElementById('crm-idle-waiting-state');
        const crmCards = document.getElementById('ameyo-crm-cards-grid');
        const liveWave = document.getElementById('ameyo-live-transcript-box');

        if (viewName === 'idle') {
            if (!isAdmin) {
                if (idleWaiting) idleWaiting.classList.remove('hidden');
                if (crmCards) crmCards.classList.add('hidden');
                if (liveWave) liveWave.classList.add('hidden');
            }
        } else if (viewName === 'ringing' || viewName === 'active') {
            if (idleWaiting) idleWaiting.classList.add('hidden');
            if (crmCards) crmCards.classList.remove('hidden');
        }
    }

    function updateCrmCustomerProfile(sc) {
        if (!sc) return;
        const idleWaiting = document.getElementById('crm-idle-waiting-state');
        const crmCards = document.getElementById('ameyo-crm-cards-grid');
        if (idleWaiting) idleWaiting.classList.add('hidden');
        if (crmCards) crmCards.classList.remove('hidden');

        const nameEl = document.getElementById('crm-cust-name');
        const phoneEl = document.getElementById('crm-cust-phone');
        const walletTypeEl = document.getElementById('crm-cust-wallet-type');
        const statusEl = document.getElementById('crm-cust-status');
        const balanceEl = document.getElementById('crm-cust-balance');
        const headingEl = document.getElementById('transcript-customer-heading');
        const textEl = document.getElementById('transcript-customer-text');
        const liveWave = document.getElementById('ameyo-live-transcript-box');

        if (nameEl) nameEl.textContent = sc.customerName || 'أحمد محمد عبد الله';
        if (phoneEl) phoneEl.textContent = sc.customerPhone || '07723065187';
        if (walletTypeEl) walletTypeEl.textContent = sc.walletType || 'دائمية موثقة (Full KYC)';
        if (statusEl) statusEl.textContent = sc.status || 'نشطة (Active)';
        if (balanceEl) balanceEl.textContent = sc.balance || '350,000 د.ع';
        if (headingEl) headingEl.textContent = sc.heading || 'محادثة الزبون الصوتية الحية:';
        if (textEl) textEl.textContent = `"${sc.voiceText || 'مرحبا، عندي استفسار عن خدمات زين كاش'}"`;
        if (liveWave) liveWave.classList.remove('hidden');
    }

    function triggerIncomingCall(sc) {
        activeCallScenario = sc || CALL_SCENARIOS[0];
        updateCrmCustomerProfile(activeCallScenario);

        const rNum = document.getElementById('ringing-caller-number');
        const rName = document.getElementById('ringing-caller-name');
        if (rNum) rNum.textContent = activeCallScenario.customerPhone;
        if (rName) rName.textContent = activeCallScenario.customerName;

        switchAmeyoPhoneView('ringing');
        playRingtone();
    }

    function triggerOutboundCall(sc) {
        activeCallScenario = sc || CALL_SCENARIOS[3];
        updateCrmCustomerProfile(activeCallScenario);

        playBeep(440, 0.4);
        setTimeout(() => {
            connectActiveCall();
        }, 800);
    }

    function connectActiveCall() {
        stopRingtone();
        stopHoldTune();
        isCallOnHold = false;
        isCallMuted = false;
        callDurationSeconds = 0;
        holdDurationSeconds = 0;

        const phoneDisp = document.getElementById('active-call-phone-display');
        const campDisp = document.getElementById('active-meta-campaign');
        const queueDisp = document.getElementById('active-meta-queue');
        const typeDisp = document.getElementById('active-meta-calltype');
        const statusInd = document.getElementById('active-call-status-indicator');
        const holdBtn = document.getElementById('btn-call-hold');
        const muteBtn = document.getElementById('btn-call-mute');
        const muteIcon = document.getElementById('mute-icon');

        if (phoneDisp) phoneDisp.textContent = activeCallScenario ? activeCallScenario.customerPhone : '07723065187';
        if (campDisp) campDisp.textContent = activeCallScenario ? activeCallScenario.campaign : 'Zain Cash';
        if (queueDisp) queueDisp.textContent = activeCallScenario ? activeCallScenario.queue : 'CustomerService_Ar';
        if (typeDisp) typeDisp.textContent = activeCallScenario && activeCallScenario.type === 'outbound' ? 'Outbound' : 'Inbound';
        if (statusInd) {
            statusInd.textContent = 'Connected';
            statusInd.className = 'active-call-status-label';
        }
        if (holdBtn) holdBtn.classList.remove('active-hold');
        if (muteBtn) muteBtn.classList.remove('active-mute');
        if (muteIcon) muteIcon.className = 'fa-solid fa-microphone-slash';

        switchAmeyoPhoneView('active');

        // Start call duration timer
        clearInterval(callDurationInterval);
        clearInterval(holdDurationInterval);
        const timerEl = document.getElementById('active-call-duration-timer');
        if (timerEl) timerEl.textContent = '00:00:00';

        callDurationInterval = setInterval(() => {
            callDurationSeconds++;
            if (timerEl) timerEl.textContent = formatTimeHHMMSS(callDurationSeconds);
        }, 1000);
    }

    function endActiveCall() {
        clearInterval(callDurationInterval);
        clearInterval(holdDurationInterval);
        stopHoldTune();
        playBeep(400, 0.3);

        const liveWave = document.getElementById('ameyo-live-transcript-box');
        if (liveWave) liveWave.classList.add('hidden');

        // Switch to Disposition view
        switchAmeyoPhoneView('disposition');

        // Populate Dispositions according to Inbound vs Outbound
        const isOutbound = activeCallScenario && activeCallScenario.type === 'outbound';
        const custNameEl = document.getElementById('disp-customer-name-display');
        if (custNameEl) {
            custNameEl.textContent = activeCallScenario ? activeCallScenario.customerName : 'Ahmad Muhammad';
        }

        const mainSelect = document.getElementById('call-disp-main-select');
        const subSelect = document.getElementById('call-disp-sub-select');
        const quickGrid = document.getElementById('call-quick-disp-grid');
        const saveBtn = document.getElementById('btn-save-and-dispose');

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.className = 'btn-save-and-dispose disabled';
        }

        if (isOutbound) {
            // OUTBOUND DISPOSITIONS LOGIC
            if (mainSelect) {
                mainSelect.innerHTML = `<option value="Outbound Calls" selected>Outbound Calls</option>`;
                mainSelect.disabled = true;
            }
            if (subSelect) {
                subSelect.innerHTML = `<option value="">Select a Sub Disposition</option>` +
                    OUTBOUND_SUB_DISPOSITIONS.map(s => `<option value="${s}">${s}</option>`).join('');
                subSelect.disabled = false;
            }
            if (quickGrid) {
                quickGrid.innerHTML = OUTBOUND_SUB_DISPOSITIONS.slice(0, 6).map(s => `
                    <button type="button" class="quick-disp-btn" data-sub="${s}" title="${s}">${s}</button>
                `).join('');
            }
        } else {
            // INBOUND DISPOSITIONS LOGIC
            const dispData = window.DISPOSITION_DATA || GLOBAL_DISPOSITION_DATA || {};
            const categories = Object.keys(dispData);

            if (mainSelect) {
                mainSelect.disabled = false;
                mainSelect.innerHTML = `<option value="">Select Disposition</option>` +
                    categories.map(c => `<option value="${c}">${c}</option>`).join('');
                if (categories.includes('Inquiry')) mainSelect.value = 'Inquiry';
            }

            const populateInboundSubs = (mainCat) => {
                if (subSelect) {
                    const subs = dispData[mainCat] || [];
                    subSelect.innerHTML = `<option value="">Select a Sub Disposition</option>` +
                        subs.map(s => `<option value="${s}">${s}</option>`).join('');
                }
            };

            populateInboundSubs('Inquiry');

            if (mainSelect) {
                mainSelect.onchange = (e) => {
                    populateInboundSubs(e.target.value);
                    checkDispositionReady();
                };
            }

            if (quickGrid) {
                const sampleQuick = [
                    { main: 'Inquiry', sub: 'Agent & Shop Location' },
                    { main: 'Complaint', sub: 'Agent/ROS attitude' },
                    { main: 'Inquiry', sub: 'Application' },
                    { main: 'Inquiry', sub: 'Application Usage' }
                ];
                quickGrid.innerHTML = sampleQuick.map(q => `
                    <button type="button" class="quick-disp-btn" data-main="${q.main}" data-sub="${q.sub}" title="${q.sub}">${q.sub}</button>
                `).join('');
            }
        }

        // Bind quick disposition clicks
        if (quickGrid) {
            quickGrid.querySelectorAll('.quick-disp-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    quickGrid.querySelectorAll('.quick-disp-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');

                    const targetMain = btn.getAttribute('data-main');
                    const targetSub = btn.getAttribute('data-sub');

                    if (targetMain && mainSelect && !isOutbound) {
                        mainSelect.value = targetMain;
                        const dispData = window.DISPOSITION_DATA || GLOBAL_DISPOSITION_DATA || {};
                        if (subSelect) {
                            subSelect.innerHTML = `<option value="">Select a Sub Disposition</option>` +
                                (dispData[targetMain] || []).map(s => `<option value="${s}">${s}</option>`).join('');
                        }
                    }
                    if (targetSub && subSelect) {
                        subSelect.value = targetSub;
                    }
                    checkDispositionReady();
                });
            });
        }

        if (subSelect) {
            subSelect.onchange = checkDispositionReady;
        }

        // Start ACW Wrap-up timer
        clearInterval(acwDurationInterval);
        acwDurationSeconds = 0;
        const acwTimerEl = document.getElementById('acw-wrapup-timer');
        if (acwTimerEl) acwTimerEl.textContent = '00:00';
        acwDurationInterval = setInterval(() => {
            acwDurationSeconds++;
            if (acwTimerEl) acwTimerEl.textContent = formatTimeMMSS(acwDurationSeconds);
        }, 1000);
    }

    function checkDispositionReady() {
        const subSelect = document.getElementById('call-disp-sub-select');
        const saveBtn = document.getElementById('btn-save-and-dispose');
        if (!saveBtn) return;

        if (subSelect && subSelect.value) {
            saveBtn.disabled = false;
            saveBtn.className = 'btn-save-and-dispose active';
        } else {
            saveBtn.disabled = true;
            saveBtn.className = 'btn-save-and-dispose disabled';
        }
    }

    let callSignalPollInterval = null;

    window.initAmeyoCallSimulator = async function() {
        const user = currentUser || window.currentUser || JSON.parse(sessionStorage.getItem('zain_cash_user') || localStorage.getItem('zain_cash_user') || '{}');
        const agentNamePill = document.getElementById('ameyo-agent-profile-name');
        if (agentNamePill) {
            agentNamePill.textContent = (user.name || 'Amr Nasr') + ` (${user.code || user.id || 'ZC000'})`;
        }

        const isAdmin = user.role === 'Admin' || user.id === 'admin' || user.id === 'u_admin' || user.id === 'ZC000' || user.id === 'ZC599';

        const adminVoiceBar = document.getElementById('admin-voice-scenario-launcher');
        const adminTargetWrap = document.getElementById('widget-employee-target-wrap');
        const idleWaitingState = document.getElementById('crm-idle-waiting-state');
        const crmCardsGrid = document.getElementById('ameyo-crm-cards-grid');
        const liveWaveBox = document.getElementById('ameyo-live-transcript-box');

        if (isAdmin) {
            if (adminVoiceBar) adminVoiceBar.classList.remove('hidden');
            if (adminTargetWrap) adminTargetWrap.classList.remove('hidden');
            if (idleWaitingState) idleWaitingState.classList.add('hidden');
            if (crmCardsGrid) crmCardsGrid.classList.remove('hidden');
        } else {
            if (adminVoiceBar) adminVoiceBar.classList.add('hidden');
            if (adminTargetWrap) adminTargetWrap.classList.add('hidden');
            if (idleWaitingState) idleWaitingState.classList.remove('hidden');
            if (crmCardsGrid) crmCardsGrid.classList.add('hidden');
            if (liveWaveBox) liveWaveBox.classList.add('hidden');
        }

        // Campaign Change Listener
        const campaignSelect = document.getElementById('widget-campaign-select');
        const employeeTargetSelect = document.getElementById('widget-employee-target-select');
        const phoneInput = document.getElementById('widget-customer-search-input');

        if (campaignSelect) {
            campaignSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'Zain Cash') {
                    activeCallScenario = CALL_SCENARIOS[0];
                } else {
                    activeCallScenario = CALL_SCENARIOS[3];
                    activeCallScenario.campaign = val;
                }
                updateCrmCustomerProfile(activeCallScenario);
            });
        }

        // Always Populate Target Employee / Customer Dropdown
        if (employeeTargetSelect) {
            try {
                const [usersList, callAssignments, serverScenarios] = await Promise.all([
                    apiCall('/api/users', 'GET').catch(() => []),
                    apiCall('/api/call-assignments', 'GET').catch(() => []),
                    apiCall('/api/call-scenarios', 'GET').catch(() => CALL_SCENARIOS)
                ]);

                const nonAdmins = usersList.filter(u => u.role !== 'Admin');
                const isAllAssigned = callAssignments.includes('all');
                const availableScenarios = (serverScenarios && serverScenarios.length > 0) ? serverScenarios : CALL_SCENARIOS;

                let opts = `<option value="">-- اختر الموظف أو الزبون المستهدف --</option>`;

                // Registered Employees Optgroup
                if (nonAdmins.length > 0) {
                    opts += `<optgroup label="👥 موظفو خدمة العملاء (Active Agents)">`;
                    nonAdmins.forEach(u => {
                        const isAssigned = isAllAssigned || callAssignments.includes(u.id);
                        opts += `<option value="emp_${u.id}" data-type="employee" data-id="${u.id}" data-name="${escapeHtml(u.name)}" data-phone="${u.phone || '07723065187'}">
                            📞 ${escapeHtml(u.name)} (${u.code || u.id}) ${isAssigned ? '⭐ [مسند له اختبار]' : ''}
                        </option>`;
                    });
                    opts += `</optgroup>`;
                }

                // Dynamic Training Scenarios Optgroup
                if (availableScenarios.length > 0) {
                    opts += `<optgroup label="📋 سيناريوهات التدريب الصوتي (Manage Call Scenarios)">`;
                    availableScenarios.forEach((sc, i) => {
                        opts += `<option value="sc_${sc.id}" data-type="scenario" data-sc-id="${sc.id}" data-name="${escapeHtml(sc.customerName || '')}" data-phone="${sc.customerPhone || '07723065187'}">
                            ${sc.type === 'outbound' ? '📤' : '📥'} ${escapeHtml(sc.heading || sc.customerName || `سيناريو ${i+1}`)} (${sc.customerPhone || '07723065187'})
                        </option>`;
                    });
                    opts += `</optgroup>`;
                }

                employeeTargetSelect.innerHTML = opts;

                // When user selects any item from the dropdown:
                employeeTargetSelect.onchange = () => {
                    const sel = employeeTargetSelect.options[employeeTargetSelect.selectedIndex];
                    if (!sel || !sel.value) return;

                    const dtype = sel.getAttribute('data-type');
                    const dphone = sel.getAttribute('data-phone') || '07723065187';
                    const dname = sel.getAttribute('data-name') || '';

                    if (phoneInput) phoneInput.value = dphone;

                    if (dtype === 'scenario') {
                        const scId = sel.getAttribute('data-sc-id');
                        const sc = availableScenarios.find(s => String(s.id) === String(scId)) || availableScenarios[0];
                        activeCallScenario = sc;
                        updateCrmCustomerProfile(sc);
                    } else if (dtype === 'employee') {
                        const empSc = {
                            id: 'live_emp_' + sel.getAttribute('data-id'),
                            type: campaignSelect && campaignSelect.value === 'Zain Cash' ? 'inbound' : 'outbound',
                            customerName: dname,
                            customerPhone: dphone,
                            campaign: campaignSelect ? campaignSelect.value : 'Zain Cash',
                            queue: 'Live_Training_Queue',
                            heading: `مكالمة تدريبية مباشرة مع الموظف: ${dname}`,
                            voiceText: `(اتصال صوتي تدريبي مباشر بين المشرف والموظف ${dname})`,
                            balance: '350,000 د.ع',
                            walletType: 'دائمية موثقة (Full KYC)',
                            status: 'متصل الآن (Live Calling)',
                            isLiveCall: true,
                            targetUserId: sel.getAttribute('data-id')
                        };
                        activeCallScenario = empSc;
                        updateCrmCustomerProfile(empSc);
                    }
                };
            } catch (err) {
                console.error("Failed to populate target employee select:", err);
            }
        }

        // Quick Scenario Buttons
        const btnIn1 = document.getElementById('btn-trigger-inbound-1');
        const btnIn2 = document.getElementById('btn-trigger-inbound-2');
        const btnIn3 = document.getElementById('btn-trigger-inbound-3');
        const btnOut = document.getElementById('btn-trigger-outbound-sim');
        const btnMakeCall = document.getElementById('btn-widget-make-call');

        if (btnIn1) {
            btnIn1.onclick = () => {
                if (employeeTargetSelect) employeeTargetSelect.value = 'sc_inbound-1';
                triggerIncomingCall(CALL_SCENARIOS[0]);
            };
        }
        if (btnIn2) {
            btnIn2.onclick = () => {
                if (employeeTargetSelect) employeeTargetSelect.value = 'sc_inbound-2';
                triggerIncomingCall(CALL_SCENARIOS[1]);
            };
        }
        if (btnIn3) {
            btnIn3.onclick = () => {
                if (employeeTargetSelect) employeeTargetSelect.value = 'sc_inbound-3';
                triggerIncomingCall(CALL_SCENARIOS[2]);
            };
        }
        if (btnOut) {
            btnOut.onclick = () => {
                const campVal = campaignSelect ? campaignSelect.value : 'Test Campaign';
                if (employeeTargetSelect) employeeTargetSelect.value = 'sc_outbound-1';
                const sc = { ...CALL_SCENARIOS[3], campaign: campVal === 'Zain Cash' ? 'Test Campaign' : campVal };
                triggerOutboundCall(sc);
            };
        }

        if (btnMakeCall) {
            btnMakeCall.onclick = async () => {
                const campVal = campaignSelect ? campaignSelect.value : 'Zain Cash';
                const sel = employeeTargetSelect && employeeTargetSelect.selectedIndex >= 0 ? employeeTargetSelect.options[employeeTargetSelect.selectedIndex] : null;
                const dtype = sel ? sel.getAttribute('data-type') : null;

                // If calling a real employee from the list
                if (dtype === 'employee' && sel) {
                    const targetEmpId = sel.getAttribute('data-id');
                    const targetEmpName = sel.getAttribute('data-name') || 'الموظف';
                    const targetEmpPhone = sel.getAttribute('data-phone') || phoneInput?.value || '07723065187';

                    showToast(`📞 جاري الاتصال المباشر بالموظف: ${targetEmpName}...`, 'info');

                    let offerSdp = null;
                    try {
                        offerSdp = await initWebRTCOffer(targetEmpId, user.id);
                    } catch (e) {
                        console.warn("WebRTC offer init:", e);
                    }

                    // Send Call Offer Signal to target employee
                    await apiCall('/api/call-signal', 'POST', {
                        toUserId: targetEmpId,
                        fromUserId: user.id,
                        fromUserName: user.name || 'المشرف (Admin)',
                        type: 'call_offer',
                        campaign: campVal,
                        phone: targetEmpPhone,
                        sdp: offerSdp
                    }).catch(console.error);

                    const liveSc = {
                        id: 'live-admin-call',
                        type: campVal === 'Zain Cash' ? 'inbound' : 'outbound',
                        customerName: `${targetEmpName} (${targetEmpId})`,
                        customerPhone: targetEmpPhone,
                        campaign: campVal,
                        queue: 'Live_Training_Queue',
                        heading: `مكالمة تدريبية مباشرة مع الموظف: ${targetEmpName}`,
                        voiceText: `(اتصال صوتي تدريبي مباشر بين الأدمن والموظف ${targetEmpName})`,
                        balance: '350,000 د.ع',
                        walletType: 'دائمية موثقة (Full KYC)',
                        status: 'متصل الآن (Live Call)',
                        isLiveCall: true,
                        targetUserId: targetEmpId
                    };
                    triggerOutboundCall(liveSc);
                } else if (dtype === 'scenario' && sel) {
                    const scId = sel.getAttribute('data-sc-id');
                    const sc = CALL_SCENARIOS.find(s => s.id === scId) || CALL_SCENARIOS[0];
                    if (sc.type === 'outbound') triggerOutboundCall(sc);
                    else triggerIncomingCall(sc);
                } else {
                    // Regular fallback call based on campaign
                    const isOut = campVal !== 'Zain Cash';
                    const sc = isOut ? { ...CALL_SCENARIOS[3], campaign: campVal } : CALL_SCENARIOS[0];
                    if (isOut) triggerOutboundCall(sc);
                    else triggerIncomingCall(sc);
                }
            };
        }

        // Ringing Action Buttons
        const btnAnswer = document.getElementById('btn-ringing-answer');
        const btnReject = document.getElementById('btn-ringing-reject');
        if (btnAnswer) {
            btnAnswer.onclick = async () => {
                if (activeCallScenario && activeCallScenario.isLiveCall && activeCallScenario.fromUserId) {
                    let answerSdp = null;
                    if (pendingOfferSdp) {
                        try {
                            answerSdp = await handleWebRTCOffer(pendingOfferSdp, activeCallScenario.fromUserId, user.id);
                        } catch(e) {
                            console.warn("WebRTC answer handle:", e);
                        }
                    }

                    await apiCall('/api/call-signal', 'POST', {
                        toUserId: activeCallScenario.fromUserId,
                        fromUserId: user.id,
                        type: 'call_answered',
                        sdp: answerSdp
                    }).catch(console.error);
                }
                connectActiveCall();
            };
        }
        if (btnReject) {
            btnReject.onclick = async () => {
                if (activeCallScenario && activeCallScenario.isLiveCall && activeCallScenario.fromUserId) {
                    await apiCall('/api/call-signal', 'POST', {
                        toUserId: activeCallScenario.fromUserId,
                        fromUserId: user.id,
                        type: 'call_ended'
                    }).catch(console.error);
                }
                stopLocalAudioStream();
                stopRingtone();
                switchAmeyoPhoneView('idle');
            };
        }

        // Active Call Controls
        const btnHold = document.getElementById('btn-call-hold');
        const holdTimerText = document.getElementById('hold-timer-text');
        const statusLabel = document.getElementById('active-call-status-indicator');

        if (btnHold) {
            btnHold.onclick = () => {
                isCallOnHold = !isCallOnHold;
                if (localStream) {
                    localStream.getAudioTracks().forEach(t => t.enabled = !isCallOnHold);
                }
                if (isCallOnHold) {
                    btnHold.classList.add('active-hold');
                    if (statusLabel) {
                        statusLabel.textContent = 'On Hold';
                        statusLabel.className = 'active-call-status-label on-hold';
                    }
                    playHoldTune();
                    holdDurationSeconds = 0;
                    if (holdTimerText) holdTimerText.textContent = '00:00';
                    clearInterval(holdDurationInterval);
                    holdDurationInterval = setInterval(() => {
                        holdDurationSeconds++;
                        if (holdTimerText) holdTimerText.textContent = formatTimeMMSS(holdDurationSeconds);
                    }, 1000);
                } else {
                    btnHold.classList.remove('active-hold');
                    if (statusLabel) {
                        statusLabel.textContent = 'Connected';
                        statusLabel.className = 'active-call-status-label';
                    }
                    stopHoldTune();
                    clearInterval(holdDurationInterval);
                    if (holdTimerText) holdTimerText.textContent = '00:00';
                }
            };
        }

        const btnMute = document.getElementById('btn-call-mute');
        const muteIcon = document.getElementById('mute-icon');
        if (btnMute) {
            btnMute.onclick = () => {
                isCallMuted = !isCallMuted;
                if (localStream) {
                    localStream.getAudioTracks().forEach(t => t.enabled = !isCallMuted);
                }
                if (isCallMuted) {
                    btnMute.classList.add('active-mute');
                    if (muteIcon) muteIcon.className = 'fa-solid fa-microphone';
                } else {
                    btnMute.classList.remove('active-mute');
                    if (muteIcon) muteIcon.className = 'fa-solid fa-microphone-slash';
                }
            };
        }

        const btnEnd = document.getElementById('btn-call-end');
        if (btnEnd) {
            btnEnd.onclick = async () => {
                stopLocalAudioStream();
                if (activeCallScenario && activeCallScenario.isLiveCall) {
                    const targetId = activeCallScenario.targetUserId || activeCallScenario.fromUserId;
                    if (targetId) {
                        await apiCall('/api/call-signal', 'POST', {
                            toUserId: targetId,
                            fromUserId: user.id,
                            type: 'call_ended'
                        }).catch(console.error);
                    }
                }
                endActiveCall();
            };
        }

        // Copy Phone Number
        const btnCopyPhone = document.getElementById('btn-copy-active-phone');
        if (btnCopyPhone) {
            btnCopyPhone.onclick = () => {
                const phone = document.getElementById('active-call-phone-display')?.textContent || '';
                if (navigator.clipboard) navigator.clipboard.writeText(phone);
                showToast('✅ تم نسخ رقم الهاتف: ' + phone, 'success');
            };
        }

        // Save and Dispose
        const btnSaveDisp = document.getElementById('btn-save-and-dispose');
        const dispOverlay = document.getElementById('disp-success-overlay');
        if (btnSaveDisp) {
            btnSaveDisp.onclick = () => {
                clearInterval(acwDurationInterval);
                playBeep(800, 0.2);

                const subVal = document.getElementById('call-disp-sub-select')?.value || '';
                const mainVal = document.getElementById('call-disp-main-select')?.value || '';

                if (dispOverlay) dispOverlay.classList.remove('hidden');

                // Save call session log
                const callRecord = {
                    type: activeCallScenario?.type || 'inbound',
                    customerName: activeCallScenario?.customerName || 'Customer',
                    customerPhone: activeCallScenario?.customerPhone || '07700000000',
                    duration: callDurationSeconds,
                    holdDuration: holdDurationSeconds,
                    wrapupDuration: acwDurationSeconds,
                    disposition: mainVal,
                    subDisposition: subVal,
                    date: new Date().toLocaleString()
                };

                const storedCalls = JSON.parse(localStorage.getItem('zain_call_training_logs') || '[]');
                storedCalls.push(callRecord);
                localStorage.setItem('zain_call_training_logs', JSON.stringify(storedCalls));

                setTimeout(() => {
                    if (dispOverlay) dispOverlay.classList.add('hidden');
                    switchAmeyoPhoneView('idle');
                    showToast('✅ تم إنهاء وتصنيف المكالمة بنجاح، والعودة للوضع المتاح Available', 'success');
                }, 1400);
            };
        }

        // Agent Status Dropdown
        const statusToggle = document.getElementById('ameyo-agent-status-toggle');
        const statusMenu = document.getElementById('ameyo-status-menu');
        const statusLabelEl = document.getElementById('ameyo-agent-status-label');

        if (statusToggle && statusMenu) {
            statusToggle.onclick = (e) => {
                e.stopPropagation();
                statusMenu.classList.toggle('hidden');
            };
            statusMenu.querySelectorAll('.status-option').forEach(opt => {
                opt.onclick = () => {
                    const st = opt.getAttribute('data-status');
                    if (statusLabelEl) statusLabelEl.textContent = st;
                    statusMenu.querySelectorAll('.status-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    statusMenu.classList.add('hidden');
                };
            });
            document.addEventListener('click', () => {
                if (!statusMenu.classList.contains('hidden')) statusMenu.classList.add('hidden');
            });
        }

        // Live Call Background Signaling Polling
        if (user.id) {
            if (callSignalPollInterval) clearInterval(callSignalPollInterval);
            callSignalPollInterval = setInterval(async () => {
                try {
                    const res = await apiCall(`/api/call-signal?userId=${user.id}`, 'GET');
                    if (res && res.signal) {
                        const sig = res.signal;
                        if (sig.type === 'call_offer' && currentCallState === 'idle') {
                            // Acknowledge/clear signal
                            await apiCall(`/api/call-signal?userId=${user.id}`, 'DELETE').catch(() => {});
                            
                            pendingOfferSdp = sig.sdp;
                            const liveIncoming = {
                                id: 'live-admin-incoming',
                                type: sig.campaign === 'Zain Cash' ? 'inbound' : 'outbound',
                                customerName: `${sig.fromUserName || 'مشرف التدريب'} (Admin)`,
                                customerPhone: sig.phone || '07723065187',
                                campaign: sig.campaign || 'Zain Cash',
                                queue: 'Live_Training_Call',
                                heading: `📞 مكالمة تدريبية مباشرة واردة من المشرف: ${sig.fromUserName}`,
                                voiceText: `مرحباً، أنا المشرف وأقوم بإجراء اتصال تدريبي مباشر معك.`,
                                balance: '350,000 د.ع',
                                walletType: 'دائمية موثقة (Full KYC)',
                                status: 'نشطة (Active)',
                                isLiveCall: true,
                                fromUserId: sig.fromUserId
                            };

                            triggerIncomingCall(liveIncoming);
                        } else if (sig.type === 'call_answered') {
                            await apiCall(`/api/call-signal?userId=${user.id}`, 'DELETE').catch(() => {});
                            if (sig.sdp) {
                                await handleWebRTCAnswer(sig.sdp).catch(console.warn);
                            }
                            showToast("🟢 تم الرد وبدء المحادثة الصوتية المباشرة!", "success");
                        } else if (sig.type === 'ice_candidate') {
                            await apiCall(`/api/call-signal?userId=${user.id}`, 'DELETE').catch(() => {});
                            if (sig.candidate) {
                                await handleRemoteIceCandidate(sig.candidate).catch(console.warn);
                            }
                        } else if (sig.type === 'call_ended' && (currentCallState === 'active' || currentCallState === 'ringing')) {
                            await apiCall(`/api/call-signal?userId=${user.id}`, 'DELETE').catch(() => {});
                            stopLocalAudioStream();
                            if (currentCallState === 'ringing') {
                                stopRingtone();
                                switchAmeyoPhoneView('idle');
                            } else {
                                endActiveCall();
                            }
                        }
                    }
                } catch (e) {}
            }, 1200);
        }
    };

    // Initial session check
    checkUserSession();
});
