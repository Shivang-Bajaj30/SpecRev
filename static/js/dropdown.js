
document.addEventListener('DOMContentLoaded', function () {
    const userBtn = document.getElementById('user-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const userProfile = document.querySelector('.user-profile');
    // Toggle dropdown visibility when user icon is clicked
    userBtn.addEventListener('click', function (event) {
        dropdownMenu.classList.toggle('show');
        event.stopPropagation(); // Prevent the click from closing the dropdown immediately
});
    // Close the dropdown if clicked outside of it
    document.addEventListener('click', function (event) {
        if (!userProfile.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});
