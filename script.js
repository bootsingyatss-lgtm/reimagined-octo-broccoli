try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    if (!res.ok) throw new Error('User offline or not found');
    
    const data = await res.json();
    const user = data.data.discord_user;

    // Fill profile
    document.getElementById('username').textContent = `${user.username}#${user.discriminator}`;
    document.getElementById('createdAt').textContent = 
        `Member since ${new Date((BigInt(user.id) / 4194304n) + 1420070400000n).toLocaleDateString()}`;

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    document.getElementById('avatar').src = avatarUrl;

    // Banner (if user has one and is online)
    const bannerEl = document.getElementById('banner');
    if (data.data.discord_user.banner) {
        bannerEl.style.backgroundImage = `ur[](https://cdn.discordapp.com/banners/${user.id}/${data.data.discord_user.banner}.png?size=480)`;
    } else {
        bannerEl.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }

    // Show profile
    closeLoginPanel();
    profilePanel.classList.add('open');
    overlay.classList.add('open');

} catch (err) {
    alert('User must be online in Discord to view profile.');
}
