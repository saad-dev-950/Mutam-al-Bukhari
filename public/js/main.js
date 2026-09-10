// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = contactForm.querySelector('.btn-submit');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showMessage(data.error || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showMessage(text, type) {
    if (window.showToast) {
        window.showToast(text, type);
    } else {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Admin login modal
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const closeAdminLoginBtn = document.getElementById('closeAdminLogin');
const adminLoginMessage = document.getElementById('adminLoginMessage');

function openAdminLoginModal() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.add('active');
    adminLoginModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const usernameField = document.getElementById('adminUsername');
    if (usernameField) {
        usernameField.focus();
    }
}

function closeAdminLoginModal() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.remove('active');
    adminLoginModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (adminLoginMessage) {
        adminLoginMessage.textContent = '';
        adminLoginMessage.className = 'form-message';
    }
}

if (adminLoginModal) {
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
            event.preventDefault();
            openAdminLoginModal();
        }

        if (event.key === 'Escape' && adminLoginModal.classList.contains('active')) {
            closeAdminLoginModal();
        }
    });

    adminLoginModal.addEventListener('click', (event) => {
        if (event.target === adminLoginModal) {
            closeAdminLoginModal();
        }
    });

    if (closeAdminLoginBtn) {
        closeAdminLoginBtn.addEventListener('click', closeAdminLoginModal);
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;

            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = '/admin';
                } else {
                    if (window.showToast) {
                        window.showToast(data.error || 'Login failed', 'error', 'Login Failed');
                    } else if (adminLoginMessage) {
                        adminLoginMessage.textContent = data.error || 'Login failed';
                        adminLoginMessage.className = 'form-message error';
                    }
                }
            } catch (error) {
                console.error('Admin login error:', error);
                if (window.showToast) {
                    window.showToast('Unable to connect to the server.', 'error', 'Network Error');
                } else if (adminLoginMessage) {
                    adminLoginMessage.textContent = 'Unable to connect to the server.';
                    adminLoginMessage.className = 'form-message error';
                }
            }
        });
    }

    // Password visibility toggle for admin login
    const adminPasswordToggle = document.getElementById('adminPasswordToggle');
    const adminPasswordField = document.getElementById('adminPassword');
    if (adminPasswordToggle && adminPasswordField) {
        adminPasswordToggle.addEventListener('click', () => {
            const isPassword = adminPasswordField.getAttribute('type') === 'password';
            adminPasswordField.setAttribute('type', isPassword ? 'text' : 'password');
            const icon = adminPasswordToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
            const showing = adminPasswordField.getAttribute('type') === 'text';
            adminPasswordToggle.setAttribute('aria-pressed', showing ? 'true' : 'false');
            adminPasswordToggle.setAttribute('title', showing ? 'Hide password' : 'Show password');
        });
    }
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auth') === 'required') {
    openAdminLoginModal();
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Highlight current section in navbar
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});
