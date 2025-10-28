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
            const res = await fetch(`https://japi.rest/discord/v1/user/${userId}`);
            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.message || 'User not found');
            }
            
            const user = await res.json();

            // Fill profile
            document.getElementById('username').textContent = `${user.username}#${user.discriminator}`;
            document.getElementById('createdAt').textContent = 
                `Member since ${new Date(user.created_at).toLocaleDateString()}`;

            const avatarUrl = user.avatar 
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
                : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
            document.getElementById('avatar').src = avatarUrl;

            const bannerEl = document.getElementById('banner');
            if (user.banner) {
                bannerEl.style.backgroundImage = `ur[](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=480)`;
            } else {
                bannerEl.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }

            // Show profile
            closeLoginPanel();
            profilePanel.classList.add('open');
            overlay.classList.add('open');

        } catch (err) {
            alert(`Error: ${err.message}. Make sure your User ID is correct.`);
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
