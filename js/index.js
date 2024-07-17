const menuitem = document.querySelectorAll('.sidebar .menu .menu-item');

menuitem.forEach((item) => {
    item.addEventListener('click', () => {
        menuitem.forEach((item) => {
        item.classList.remove('active');
        });
        item.classList.add('active');
    });
});

const sidebartoggle = document.querySelector('.sidebar-toggle');

sidebartoggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('close');
    document.querySelector('.main').classList.toggle('extented');
});