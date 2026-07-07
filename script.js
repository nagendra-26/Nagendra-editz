// --- CMS Logic & State Management ---
const STORAGE_KEY = 'portfolioData_v2';
let siteData = JSON.parse(localStorage.getItem(STORAGE_KEY));
let isFirstLoad = !siteData;

if (isFirstLoad) {
    siteData = {
        hero1: document.getElementById('edit-hero-1').innerText.trim(),
        hero2: document.getElementById('edit-hero-2').innerText.trim(),
        heroSub: document.getElementById('edit-hero-sub').innerText.trim(),
        about: document.getElementById('edit-about').innerText.trim(),
        footer: document.getElementById('edit-footer').innerText.trim(),
        email: document.getElementById('edit-email').innerText.trim(),
        projects: [
            { title: "Reels & Editz", desc: "Cerotex", bg: "#ffffff", label: "Branding", img: "project1.jpg", link: "https://drive.google.com/drive/folders/1yKYgSUodsjKtMFyeqTv-yBjhUmuQdq4K" },
            { title: "Poster Creatives", desc: "Study Abroad Creatives", bg: "#000000", label: "Ad Strategy", img: "project2.png", link: "https://drive.google.com/drive/folders/1s71RPUTnLdCJa_UVlCoh11XQoZ6ijfK9" },
            { title: "Thumbanil Creatives", desc: "Reels Thumbanil", bg: "#0a0a0c", label: "Social Media", img: "project3.png", link: "https://drive.google.com/drive/folders/1ib3hwazgZlB5D61YgpRwUZfXlv6Lgn3t" }
        ]
    };
}

function renderContent() {
    // Only overwrite text if it came from localStorage, preventing HTML edits from being lost
    if (!isFirstLoad) {
        // Force update the old example email to the new one in local storage
        if (siteData.email === 'hello@example.com') {
            siteData.email = 'paramagurunagendra@gmail.com';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        }

        // Force update old default projects to the new ones
        if (siteData.projects && siteData.projects.length > 0 && siteData.projects[0].title === "Neon Nights") {
            siteData.projects = [
                { title: "Logo & Brand Identity", desc: "Dhaya Art Hub", bg: "#ffffff", label: "Branding", img: "project1.jpg", link: "https://drive.google.com/drive/folders/1yKYgSUodsjKtMFyeqTv-yBjhUmuQdq4K" },
                { title: "Poster Creatives", desc: "Study Abroad Creatives", bg: "#000000", label: "Ad Strategy", img: "project2.png", link: "https://drive.google.com/drive/folders/1s71RPUTnLdCJa_UVlCoh11XQoZ6ijfK9" },
                { title: "Thumbnail Creatives", desc: "Reels Thumbnail", bg: "#0a0a0c", label: "Social Media", img: "project3.png", link: "https://drive.google.com/drive/folders/1ib3hwazgZlB5D61YgpRwUZfXlv6Lgn3t" }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        }

        // Add link to projects if missing or update if it's the old link
        if (siteData.projects && siteData.projects.length > 0) {
            if (!siteData.projects[0].link || siteData.projects[0].link === "https://drive.google.com/drive/folders/1ib3hwazgZlB5D61YgpRwUZfXlv6Lgn3t") {
                siteData.projects[0].link = "https://drive.google.com/drive/folders/1yKYgSUodsjKtMFyeqTv-yBjhUmuQdq4K";
                localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
            }
        }
        if (siteData.projects && siteData.projects.length > 1 && !siteData.projects[1].link) {
            siteData.projects[1].link = "https://drive.google.com/drive/folders/1s71RPUTnLdCJa_UVlCoh11XQoZ6ijfK9";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        }
        if (siteData.projects && siteData.projects.length > 2) {
            if (!siteData.projects[2].link) {
                siteData.projects[2].link = "https://drive.google.com/drive/folders/1ib3hwazgZlB5D61YgpRwUZfXlv6Lgn3t";
            }
            if (siteData.projects[2].bg === "#e2ede2") {
                siteData.projects[2].bg = "#0a0a0c";
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        }

        document.getElementById('edit-hero-1').innerText = siteData.hero1;
        document.getElementById('edit-hero-2').innerText = siteData.hero2;
        document.getElementById('edit-hero-sub').innerText = siteData.heroSub;
        document.getElementById('edit-about').innerText = siteData.about;
        document.getElementById('edit-footer').innerText = siteData.footer;

        const emailEl = document.getElementById('edit-email');
        const defaultEmail = 'paramagurunagendra@gmail.com';
        emailEl.innerText = siteData.email || defaultEmail;
        emailEl.href = 'mailto:' + (siteData.email || defaultEmail);
    }

    // Projects
    const projectsWrapper = document.getElementById('projects-wrapper');
    projectsWrapper.innerHTML = ''; // Clear
    siteData.projects.forEach((proj, index) => {
        const bgStyle = proj.img ? `background-image: url('${proj.img}'); background-size: cover; background-repeat: no-repeat; background-position: center; background-color: ${proj.bg};` : `background-color: ${proj.bg};`;

        const clickHandler = proj.link ? `onclick="window.open('${proj.link}', '_blank')"` : '';
        const cursorStyle = proj.link ? `cursor: pointer;` : '';

        const html = `
            <div class="project panel" data-index="${index}" ${clickHandler} style="${cursorStyle}">
                <div class="project-image" style="${bgStyle}">
                    <span>${proj.label}</span>
                    <div class="admin-project-controls">
                        <button onclick="event.stopPropagation(); changeProjectImage(${index})">Image</button>
                        <button onclick="event.stopPropagation(); editProjectText(${index})">Edit</button>
                        <button onclick="event.stopPropagation(); editProjectLink(${index})">Link</button>
                        <button onclick="event.stopPropagation(); deleteProject(${index})">Del</button>
                    </div>
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
            </div>
        `;
        projectsWrapper.insertAdjacentHTML('beforeend', html);
    });
}

// Initial Render
renderContent();

// --- Admin Controls ---
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminUI = document.getElementById('admin-ui');
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

if (isAdmin) {
    enableAdminMode();
}

adminLoginBtn.addEventListener('click', () => {
    const pwd = prompt("Enter Admin Password:");
    if (pwd === "Nagendra") {
        sessionStorage.setItem('isAdmin', 'true');
        location.reload(); // Reload to enable edit mode properly before GSAP
    } else if (pwd !== null) {
        alert("Incorrect Password!");
    }
});

document.getElementById('admin-logout').addEventListener('click', () => {
    sessionStorage.removeItem('isAdmin');
    location.reload();
});

function enableAdminMode() {
    document.body.classList.add('admin-mode');
    adminLoginBtn.classList.add('hidden');
    adminUI.classList.remove('hidden');

    // Make text fields editable
    const editableIds = ['edit-hero-1', 'edit-hero-2', 'edit-hero-sub', 'edit-about', 'edit-footer', 'edit-email'];
    editableIds.forEach(id => {
        document.getElementById(id).setAttribute('contenteditable', 'true');
    });
}

document.getElementById('admin-save').addEventListener('click', () => {
    // Save Texts
    siteData.hero1 = document.getElementById('edit-hero-1').innerText;
    siteData.hero2 = document.getElementById('edit-hero-2').innerText;
    siteData.heroSub = document.getElementById('edit-hero-sub').innerText;
    siteData.about = document.getElementById('edit-about').innerText;
    siteData.footer = document.getElementById('edit-footer').innerText;
    siteData.email = document.getElementById('edit-email').innerText;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    alert("Changes Saved Successfully!");
    location.reload();
});

document.getElementById('admin-add-project').addEventListener('click', () => {
    const title = prompt("Project Title:", "New Project");
    if (!title) return;
    const desc = prompt("Project Description:", "Description");
    const label = prompt("Project Label:", "New");
    const link = prompt("Project Link (Optional):", "");

    siteData.projects.push({ title, desc, label, bg: "#222", img: "", link: link || "" });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    location.reload();
});

// Global functions for inline handlers
window.changeProjectImage = function (index) {
    const url = prompt("Enter Image URL (e.g., https://example.com/img.jpg):", siteData.projects[index].img);
    if (url !== null) {
        siteData.projects[index].img = url;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        location.reload();
    }
};

window.editProjectText = function (index) {
    const title = prompt("Edit Title:", siteData.projects[index].title);
    if (title === null) return;
    const desc = prompt("Edit Description:", siteData.projects[index].desc);
    if (desc === null) return;
    const label = prompt("Edit Label:", siteData.projects[index].label);
    if (label === null) return;

    siteData.projects[index].title = title;
    siteData.projects[index].desc = desc;
    siteData.projects[index].label = label;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    location.reload();
};

window.editProjectLink = function (index) {
    const url = prompt("Enter Project Link URL:", siteData.projects[index].link || "");
    if (url !== null) {
        siteData.projects[index].link = url;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        location.reload();
    }
};

window.deleteProject = function (index) {
    if (confirm("Are you sure you want to delete this project?")) {
        siteData.projects.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        location.reload();
    }
};

// --- Text Splitting Utilities ---
function splitTextIntoChars(selector) {
    if (isAdmin) return; // Don't split in admin mode to allow easy editing
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('char');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.innerText = char;
            }
            el.appendChild(span);
        });
    });
}

function splitTextIntoWords(selector) {
    if (isAdmin) return;
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.trim().split(/\s+/).forEach(word => {
            const span = document.createElement('span');
            span.classList.add('word');
            span.innerText = word;
            el.appendChild(span);
            el.appendChild(document.createTextNode(' '));
        });
    });
}

// --- Initialize Lenis Smooth Scrolling ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: true,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, .project');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor follow
gsap.ticker.add(() => {
    if (window.innerWidth > 768) {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        gsap.set(cursor, { x: cursorX, y: cursorY });
        gsap.set(follower, { x: followerX, y: followerY });
    }
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
    });
    target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
    });
});


// --- Animations Setup ---
document.addEventListener('DOMContentLoaded', () => {

    // Split texts before animating (skips if isAdmin)
    splitTextIntoChars('.split-text');
    splitTextIntoChars('.footer-title');
    splitTextIntoWords('.about-text');

    const tl = gsap.timeline();

    // Loader logic
    if (!isAdmin) {
        splitTextIntoChars('.loader-text');
        tl.to('.loader-text .char', {
            y: '0%',
            duration: 1,
            stagger: 0.05,
            ease: 'power4.out',
            delay: 0.2
        })
            .to('.loader-text .char', {
                y: '-100%',
                duration: 0.8,
                stagger: 0.03,
                ease: 'power4.in'
            }, '+=0.5')
            .to('.loader', {
                yPercent: -100,
                duration: 1,
                ease: 'power4.inOut'
            });
    } else {
        // Quick hide loader for admins to edit faster
        document.querySelector('.loader').style.display = 'none';
    }

    // Hero Reveal
    if (!isAdmin) {
        tl.to('.hero-title .char', {
            y: '0%',
            duration: 1.2,
            stagger: 0.02,
            ease: 'power4.out'
        }, '-=0.5')
    } else {
        gsap.set('.hero-title, .hero-subtitle', { opacity: 1, y: 0 });
    }

    tl.to('.hero-subtitle', {
        opacity: 1,
        duration: 1,
        y: 0,
        ease: 'power3.out'
    }, isAdmin ? 0 : '-=0.8');

    // Hero Color Mix Animation on Scroll
    if (!isAdmin) {
        gsap.to('.hero-title .char', {
            keyframes: {
                "0%": { color: "#ffffff" },
                "25%": { color: "#ff2a5f" },
                "50%": { color: "#00d4ff" },
                "75%": { color: "#b900ff" },
                "100%": { color: "#ffffff" }
            },
            stagger: 0.05,
            scrollTrigger: {
                trigger: '.hero',
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // About Section Scroll Reveal
    if (!isAdmin) {
        // Animate the section title
        gsap.from('.about .section-title', {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 75%'
            }
        });

        // Sophisticated word stagger reveal
        gsap.fromTo('.about-text .word', {
            opacity: 0,
            y: 40,
            rotationX: 90,
            transformOrigin: "0% 50% -50"
        }, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.05,
            duration: 1.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%'
            }
        });
    } else {
        gsap.set('.about-text', { opacity: 1 });
    }

    // About Section Parallax Background
    gsap.to('.about-profile-bg', {
        yPercent: 30,
        scale: 1.1,
        rotation: 3,
        ease: "none",
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Education Section Animation
    if (!isAdmin) {
        gsap.from('.education .section-title', {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.education',
                start: 'top 75%'
            }
        });

        const eduItems = document.querySelectorAll('.education-item');
        eduItems.forEach((item, index) => {
            gsap.from(item, {
                y: 80,
                opacity: 0,
                rotationX: -45,
                transformOrigin: "50% 100%",
                duration: 1.2,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    } else {
        gsap.set('.education .section-title, .education-item', { opacity: 1, y: 0, x: 0 });
    }

    // Horizontal Scroll for Work Section
    const workContainer = document.querySelector('.work-container');

    setTimeout(() => {
        let mm = gsap.matchMedia();

        // Desktop: only run horizontal scroll pinning if viewport > 768px
        mm.add("(min-width: 769px)", () => {
            let totalWidth = workContainer.scrollWidth;
            if (totalWidth > window.innerWidth) {
                gsap.to(workContainer, {
                    x: () => -(totalWidth - window.innerWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".work",
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => "+=" + totalWidth,
                        invalidateOnRefresh: true
                    }
                });
            }
        });

        // Mobile: on screens <= 768px, do not pin or scroll horizontally
        mm.add("(max-width: 768px)", () => {
            gsap.set(workContainer, { clearProps: "all" });
        });

        // Expertise Cards Reveal (moved here so it calculates after the pin)
        gsap.from('.expertise-item', {
            y: 80,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.expertise',
                start: 'top 85%'
            }
        });

        // Expertise accordion interaction for mobile screens
        const expertiseItems = document.querySelectorAll('.expertise-item');
        expertiseItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    expertiseItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    item.classList.toggle('active');
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                    }, 300);
                }
            });
        });

        // Footer Reveal
        if (!isAdmin) {
            const footerTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.contact',
                    start: 'top 70%'
                }
            });

            footerTl.from('.footer-title .char', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.05,
                ease: 'back.out(1.5)'
            })
                .from('.email-link', {
                    y: 30,
                    duration: 0.8,
                    ease: 'power3.out'
                }, "-=0.5")
                .from('.socials a', {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                }, "-=0.4")
                .from('.copyright', {
                    opacity: 0,
                    duration: 1
                }, "-=0.2");
        } else {
            gsap.set('.footer-title, .email-link, .socials a, .copyright', { opacity: 1, y: 0 });
        }

        ScrollTrigger.refresh();
    }, 200);
});
