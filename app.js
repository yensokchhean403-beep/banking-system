document.addEventListener('DOMContentLoaded', () => {
    
    // View Management
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    
    // Tab Switching Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Navigation active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Find target view ID
            const targetId = item.dataset.target;

            // Hide all views and show target
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active-view');
                } else {
                    view.classList.remove('active-view');
                }
            });
        });
    });

    // Mock Logout interaction
    document.getElementById('logout-btn').addEventListener('click', () => {
        document.getElementById('app-view').style.display = 'none';
        
        // Reset and show login
        document.getElementById('login-form').reset();
        document.getElementById('auth-view').classList.add('active-view');
    });

    // Login Form interaction
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value;
        const pass = document.getElementById('login-pass').value;

        // Simple mock validation (any input works for demo, but we can check specifically)
        if (user && pass) {
            // Hide Auth
            document.getElementById('auth-view').classList.remove('active-view');
            setTimeout(() => {
                document.getElementById('auth-view').style.display = 'none';
                
                // Show App
                document.getElementById('app-view').style.display = 'flex';
                // Trigger dashboard showing properly if needed
                document.querySelector('.nav-item[data-target="dashboard-view"]').click();
            }, 300);
        }
    });

    // --- Transactions State & Logic ---
    let txHistory = [
        { type: 'withdrawal', desc: 'Online payment', date: 'Feb 12, 2026, 11:20 PM', amount: -75.50, status: 'completed' },
        { type: 'transfer', desc: 'Transfer to checking', date: 'Feb 12, 2026, 05:45 PM', amount: -500.00, status: 'completed' },
        { type: 'deposit', desc: 'Salary deposit', date: 'Feb 10, 2026, 04:30 PM', amount: 1500.00, status: 'completed' }
    ];

    const txModal = document.getElementById('transaction-modal');
    const openTxModalBtn = document.getElementById('open-tx-modal');
    const closeTxModalBtn = document.getElementById('close-tx-modal');
    const txForm = document.getElementById('new-tx-form');
    const txTypeSelect = document.getElementById('tx-type');
    const txToGroup = document.getElementById('tx-to-group');

    // Action Cards
    document.getElementById('action-deposit').addEventListener('click', () => openModalWithType('deposit'));
    document.getElementById('action-withdraw').addEventListener('click', () => openModalWithType('withdrawal'));
    document.getElementById('action-transfer').addEventListener('click', () => openModalWithType('transfer'));

    function openModalWithType(type) {
        txTypeSelect.value = type;
        toggleToAccountField();
        openModal();
    }

    function openModal() {
        txModal.style.display = 'flex';
    }

    function closeModal() {
        txModal.style.display = 'none';
        txForm.reset();
        toggleToAccountField();
    }

    openTxModalBtn.addEventListener('click', openModal);
    closeTxModalBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === txModal) closeModal();
    });

    // Toggle "To Account" field based on type
    function toggleToAccountField() {
        if (txTypeSelect.value === 'transfer') {
            txToGroup.style.display = 'block';
            document.getElementById('tx-to').required = true;
        } else {
            txToGroup.style.display = 'none';
            document.getElementById('tx-to').required = false;
        }
    }

    txTypeSelect.addEventListener('change', toggleToAccountField);

    // Form Submission
    txForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = txTypeSelect.value;
        const amount = parseFloat(document.getElementById('tx-amount').value);
        let desc = document.getElementById('tx-desc').value;
        const toAcc = document.getElementById('tx-to').value;

        if (!desc) {
            if (type === 'transfer') desc = `Transfer to ${toAcc || 'account'}`;
            else if (type === 'deposit') desc = 'Cash deposit';
            else desc = 'Cash withdrawal';
        }

        const now = new Date();
        const dateStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Add to mock state
        txHistory.unshift({
            type: type,
            desc: desc,
            date: dateStr,
            amount: type === 'deposit' ? amount : -amount,
            status: 'completed'
        });

        // Re-render
        renderTransactions();
        
        // Show success and close
        alert('Transaction processed successfully!');
        closeModal();
        
        // Navigate back to Dashboard to see it
        document.querySelector('.nav-item[data-target="dashboard-view"]').click();
    });

    // Render Function
    function renderTransactions() {
        const listContainer = document.getElementById('dashboard-tx-list');
        listContainer.innerHTML = ''; // clear

        // Take top 3 for dashboard
        const displayTx = txHistory.slice(0, 3);

        displayTx.forEach(tx => {
            const isPos = tx.amount > 0;
            const sign = isPos ? '+' : '';
            const colorClass = isPos ? 'positive' : 'negative';
            const iconBgClass = tx.type === 'deposit' ? 'green' : (tx.type === 'transfer' ? 'blue' : 'red');
            const iconCode = tx.type === 'deposit' ? 'ph-arrow-down-left' : (tx.type === 'transfer' ? 'ph-arrows-left-right' : 'ph-arrow-up-right');
            
            const title = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);

            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="account-info">
                    <div class="icon-circle ${iconBgClass}"><i class="ph ${iconCode}"></i></div>
                    <div class="acc-details">
                        <h4>${title}</h4>
                        <p>${tx.desc}<br>${tx.date}</p>
                    </div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount ${colorClass}">${sign}$${Math.abs(tx.amount).toFixed(2)}</div>
                    <span class="badge badge-dark">${tx.status}</span>
                </div>
            `;
            listContainer.appendChild(div);
        });
    }

    // Initial Render
    renderTransactions();

});
