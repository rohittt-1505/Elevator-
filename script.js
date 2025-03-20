// DOM Elements
const elevatorCar = document.querySelector('.elevator-car');
const floorIndicator = document.getElementById('floor-indicator');
const floors = document.querySelectorAll('.floor');
const floorSections = document.querySelectorAll('.floor-section');
const navLinks = document.querySelectorAll('.nav-menu a');
const upButton = document.querySelector('.elevator-button.up');
const downButton = document.querySelector('.elevator-button.down');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const doors = document.querySelectorAll('.floor-doors');

// Variables
let currentFloor = 1;
let isMoving = false;
let lastScrollTop = 0;
const totalFloors = floorSections.length;
const movementDuration = 600; // ms - elevator movement duration

// Initialize
function init() {
    // Set initial floor position
    setFloorActive(currentFloor);
    
    // Position elevator car at first floor
    updateElevatorPosition(currentFloor);
    
    // Set initial floor as active
    floorSections[currentFloor - 1].classList.add('active');
    
    // Set initial navigation as active
    navLinks[currentFloor - 1].classList.add('active');
    
    // Show initial floor content
    showFloorContent(currentFloor);
    
    // Open doors for active floor
    setTimeout(() => {
        openDoors(currentFloor);
    }, 300);
}

// Set floor as active
function setFloorActive(floor) {
    // Update floor indicator
    floorIndicator.textContent = floor;
    
    // Remove active class from all floors
    floors.forEach(f => f.classList.remove('active'));
    
    // Add active class to current floor
    floors[floor - 1].classList.add('active');
    
    // Update current floor
    currentFloor = floor;
    
    // Update elevator controls visibility
    updateElevatorControls();
}

// Update elevator controls visibility
function updateElevatorControls() {
    // Disable up button on top floor
    if (currentFloor === totalFloors) {
        upButton.classList.add('disabled');
    } else {
        upButton.classList.remove('disabled');
    }
    
    // Disable down button on bottom floor
    if (currentFloor === 1) {
        downButton.classList.add('disabled');
    } else {
        downButton.classList.remove('disabled');
    }
}

// Update elevator car position
function updateElevatorPosition(floor) {
    // Calculate elevator position based on floor
    const shaftHeight = document.querySelector('.elevator-shaft').offsetHeight;
    const floorHeight = shaftHeight / totalFloors;
    const topPosition = shaftHeight - (floor * floorHeight) + (floorHeight / 2);
    
    // Add animation class
    elevatorCar.classList.add('moving');
    
    // Play elevator sound
    playElevatorSound(currentFloor, floor);
    
    // Update elevator car position
    elevatorCar.style.top = `${topPosition}px`;
    
    // Remove animation class after transition completes
    setTimeout(() => {
        elevatorCar.classList.remove('moving');
    }, movementDuration);
}

// Open doors for a specific floor
function openDoors(floor) {
    // Close all doors first
    doors.forEach(door => {
        const leftDoor = door.querySelector('.door.left');
        const rightDoor = door.querySelector('.door.right');
        
        leftDoor.classList.remove('open');
        rightDoor.classList.remove('open');
    });
    
    // Open doors for active floor
    const activeDoors = doors[floor - 1];
    const leftDoor = activeDoors.querySelector('.door.left');
    const rightDoor = activeDoors.querySelector('.door.right');
    
    // Play door sound
    playDoorSound();
    
    // Delay door opening slightly
    setTimeout(() => {
        leftDoor.classList.add('open');
        rightDoor.classList.add('open');
    }, 100);
}

// Play elevator movement sound
function playElevatorSound(fromFloor, toFloor) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    
    // Calculate frequency change based on movement
    const frequencyShift = (toFloor > fromFloor) ? 20 : -20;
    oscillator.frequency.linearRampToValueAtTime(
        200 + (frequencyShift * Math.abs(toFloor - fromFloor)),
        audioContext.currentTime + 0.5
    );
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Play door sound
function playDoorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Show floor content
function showFloorContent(floor) {
    // Remove active class from all floor sections
    floorSections.forEach(section => {
        section.classList.remove('active');
        section.classList.remove('leaving');
    });
    
    // Add active class to current floor section
    floorSections[floor - 1].classList.add('active');
    
    // Update active navigation link
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[floor - 1].classList.add('active');
    
    // Open doors for current floor
    setTimeout(() => {
        openDoors(floor);
    }, 300);
}

// Move elevator to floor
function moveToFloor(floor) {
    // Prevent multiple movements
    if (isMoving || floor === currentFloor) return;
    
    isMoving = true;
    
    // Close doors first
    closeDoors();
    
    // Add leaving class to current floor section
    floorSections[currentFloor - 1].classList.add('leaving');
    
    // Update floor indicator after a short delay
    setTimeout(() => {
        setFloorActive(floor);
        
        // Update elevator position
        updateElevatorPosition(floor);
        
        // Scroll to floor section
        floorSections[floor - 1].scrollIntoView({ behavior: 'smooth' });
        
        // Show floor content with delay
        setTimeout(() => {
            showFloorContent(floor);
            isMoving = false;
        }, movementDuration);
    }, 500); // Door closing delay
}

// Close all doors
function closeDoors() {
    doors.forEach(door => {
        const leftDoor = door.querySelector('.door.left');
        const rightDoor = door.querySelector('.door.right');
        
        leftDoor.classList.remove('open');
        rightDoor.classList.remove('open');
    });
    
    // Play door sound
    playDoorSound();
}

// Elevator control buttons
upButton.addEventListener('click', () => {
    if (currentFloor < totalFloors && !isMoving) {
        moveToFloor(currentFloor + 1);
    }
});

downButton.addEventListener('click', () => {
    if (currentFloor > 1 && !isMoving) {
        moveToFloor(currentFloor - 1);
    }
});

// Floor button clicks
floors.forEach(floor => {
    floor.addEventListener('click', () => {
        const floorNumber = parseInt(floor.getAttribute('data-floor'));
        if (!isMoving) {
            moveToFloor(floorNumber);
        }
    });
});

// Navigation menu clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const floorNumber = parseInt(href.replace('#floor', ''));
        if (!isMoving) {
            moveToFloor(floorNumber);
            
            // Close mobile menu when clicking a link
            navMenu.classList.remove('active');
        }
    });
});

// Menu toggle for mobile
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Scroll event handler
window.addEventListener('scroll', () => {
    // Throttle scroll event
    if (isMoving) return;
    
    // Get current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction
    const isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop;
    
    // Find current visible floor
    const windowHeight = window.innerHeight;
    const windowCenter = scrollTop + (windowHeight / 2);
    
    let visibleFloor = 1;
    floorSections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (windowCenter >= sectionTop && windowCenter <= sectionBottom) {
            visibleFloor = index + 1;
        }
    });
    
    // Update elevator position if floor changed
    if (visibleFloor !== currentFloor) {
        // Add leaving class to current floor section
        floorSections[currentFloor - 1].classList.add('leaving');
        
        // Update floor indicator
        setFloorActive(visibleFloor);
        
        // Update elevator position
        updateElevatorPosition(visibleFloor);
        
        // Show floor content with delay
        setTimeout(() => {
            showFloorContent(visibleFloor);
        }, 300);
    }
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
    if (isMoving) return;
    
    // Up arrow or Page Up
    if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentFloor < totalFloors) {
        moveToFloor(currentFloor + 1);
    }
    
    // Down arrow or Page Down
    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentFloor > 1) {
        moveToFloor(currentFloor - 1);
    }
    
    // Number keys 1-6
    if (e.key >= '1' && e.key <= '6' && parseInt(e.key) <= totalFloors) {
        moveToFloor(parseInt(e.key));
    }
});

// Initialize on page load
window.addEventListener('load', init);

// Handle window resize
window.addEventListener('resize', () => {
    // Update elevator position on resize
    updateElevatorPosition(currentFloor);
});

// Handle scroll to hash on page load
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const hash = window.location.hash;
        const floorNumber = parseInt(hash.replace('#floor', ''));
        
        if (floorNumber >= 1 && floorNumber <= totalFloors) {
            // Delay to allow page to load properly
            setTimeout(() => {
                moveToFloor(floorNumber);
            }, 500);
        }
    }
});

// Preload images for smoother transitions
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const newImg = new Image();
            newImg.src = src;
        }
    });
}

// Call preload function
preloadImages();

// Add loading animation
document.body.classList.add('loaded');