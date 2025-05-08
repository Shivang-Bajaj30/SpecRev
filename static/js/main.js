// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     // // Background Slider
//     // const slides = document.querySelectorAll('.slide-item');
//     // let currentSlide = 0;
    
//     // function nextSlide() {
//     //     // Remove active-prev class from all slides
//     //     slides.forEach(slide => {
//     //         slide.classList.remove('active-prev');
//     //     });
        
//     //     // Set the current active slide to active-prev (sliding left)
//     //     slides[currentSlide].classList.add('active-prev');
//     //     slides[currentSlide].classList.remove('active');
        
//     //     // Move to next slide
//     //     currentSlide = (currentSlide + 1) % slides.length;
        
//     //     // Set the new slide as active
//     //     slides[currentSlide].classList.add('active');
//     // }
    
//     // Start the slider
//     setInterval(nextSlide, 3000);
    
//     // Start Comparing button scroll to compare section
//     const startComparingBtn = document.querySelector('.hero-buttons .btn-primary');
//     if (startComparingBtn) {
//         startComparingBtn.addEventListener('click', function() {
//             const compareSection = document.getElementById('compare');
//             if (compareSection) {
//                 compareSection.scrollIntoView({ behavior: 'smooth' });
//             }
//         });
//     }
// });