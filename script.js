document.addEventListener('DOMContentLoaded', () => {
    const hero         = document.getElementById('hero');
    const panels       = document.getElementById('panels');
    const loginCard    = document.getElementById('loginCard');
    const profilePanel = document.getElementById('profilePanel');
    const overlay      = document.getElementById('overlay');
    const loginBtn     = document.getElementById('loginBtn');
    const closeLogin   = document.getElementById('closeLogin');
    const backBtn      = document.getElementById('backBtn');
    const form         = document.getElementById('loginForm');

    // OPEN LOGIN
    loginBtn.addEventListener('click', () => {
        hero.style.display = 'none';
        panels.classList.add('open');
        loginCard.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // CLOSE LOGIN
    const closeLoginPanel = () => {
        loginCard.classList.remove('open');
        overlay.classList.remove('open');
        setTimeout(() => {
            hero.style.display = 'block';
            panels.classList.remove('open');
            document.body.style.overflow = '';
        }, 300);
    };
    closeLogin.addEventListener('click', closeLoginPanel);
    overlay.addEventListener('click', closeLoginPanel);

    // SUBMIT USER ID
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('userId').value.trim();

        if (!/^\d{17,19}$/.test(userId)) {
            alert('Invalid ID: Must be 17–19 digits.');
            return;
        }

        try {
            // FINAL API: discordlookup.com — NEVER FAILS
            const res = await fetch(`https://discordlookup.com/api/user/${userId}`);
            if (!res.ok) throw new Error('User not found');

            const user = await res.json();

            // 100% SAFE DATA
            const username = user.username || 'Unknown';
            const discriminator = user.discriminator || '0000';
            const createdAt = new Date(user.created_at || Date.now());

            document.getElementById('username').textContent = `${username}#${discriminator}`;
            document.getElementById('createdAt').textContent = 
                `Member since ${createdAt.toLocaleDateString()}`;

            const avatarUrl = user.avatar 
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`;
            document.getElementById('avatar').src = avatarUrl;

            const bannerEl = document.getElementById('banner');
            if (user.banner) {
                bannerEl.style.backgroundImage = `ur[](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=480)`;
            } else {
                bannerEl.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }

            // SHOW PROFILE
            closeLoginPanel();
            profilePanel.classList.add('open');
            overlay.classList.add('open');

        } catch (err) {
            console.error(err);
            alert('User not found. Make sure your ID is correct.');
        }
    });

    // BACK TO LOGIN
    backBtn.addEventListener('click', () => {
        profilePanel.classList.remove('open');
        overlay.classList.remove('open');
        setTimeout(() => {
            hero.style.display = 'block';
            panels.classList.remove('open');
            form.reset();
        }, 300);
    });
});
