// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.getElementById('explosion-canvas');
//     const ctx = canvas.getContext('2d');
//     const particles = [];
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//
//     function hexToRgb(hex) {
//         const bigint = parseInt(hex.slice(1), 16);
//         const r = (bigint >> 16) & 255;
//         const g = (bigint >> 8) & 255;
//         const b = bigint & 255;
//         return {r, g, b};
//     }
//
//     class Particle {
//         constructor(x, y, color) {
//             this.x = x;
//             this.y = y;
//             this.color = color;
//             this.initialColor = hexToRgb(color);
//             this.alpha = 1;
//             this.initialSize = Math.random() * 7 + 3;
//             this.numVertices = Math.floor(Math.random() * 4) + 3;
//             this.vertices = [];
//             for (let i = 0; i < this.numVertices; i++) {
//                 const angle = (Math.PI * 2 / this.numVertices) * i + (Math.random() * 0.5 - 0.25);
//                 const radius = this.initialSize * (Math.random() * 0.5 + 0.5);
//                 this.vertices.push({x: Math.cos(angle) * radius, y: Math.sin(angle) * radius});
//             }
//
//             this.velocity = {
//                 x: (Math.random() - 0.5) * (4 + Math.random() * 4),
//                 y: (Math.random() - 0.5) * (4 + Math.random() * 4)
//             };
//
//             this.rotation = Math.random() * Math.PI * 2;
//             this.rotationSpeed = (Math.random() - 0.5) * 0.05;
//             this.pulseSpeed = Math.random() * 0.02 + 0.002;
//             this.pulsePhase = Math.random() * Math.PI * 2;
//             this.pulseIntensity = 1;
//
//             this.friction = 0.9999;
//             this.minVelocity = 0.1;
//         }
//
//         draw() {
//             const size = this.initialSize;
//             const brightness = 0.3 + 0.7 * Math.abs(Math.sin(this.pulsePhase));
//             const finalBrightness = brightness * this.pulseIntensity;
//
//             ctx.save();
//             ctx.globalAlpha = 1;
//             const {r, g, b} = this.initialColor;
//             ctx.fillStyle = `rgb(${r * finalBrightness}, ${g * finalBrightness}, ${b * finalBrightness})`;
//
//             ctx.translate(this.x, this.y);
//             ctx.rotate(this.rotation);
//
//             ctx.beginPath();
//             ctx.moveTo(this.vertices[0].x * size, this.vertices[0].y * size);
//             for (let i = 1; i < this.numVertices; i++) {
//                 ctx.lineTo(this.vertices[i].x * size, this.vertices[i].y * size);
//             }
//             ctx.closePath();
//             ctx.fill();
//             ctx.restore();
//         }
//
//         update() {
//             this.x += this.velocity.x;
//             this.y += this.velocity.y;
//
//             // Отражение от границ с учётом размера частицы
//             if (this.x - this.initialSize < 0 || this.x + this.initialSize > canvas.width) {
//                 this.velocity.x *= -1;
//             }
//             if (this.y - this.initialSize < 0 || this.y + this.initialSize > canvas.height) {
//                 this.velocity.y *= -1;
//             }
//
//             // Плавная пульсация
//             this.pulsePhase += this.pulseSpeed;
//
//             // Плавное вращение
//             this.rotation += this.rotationSpeed;
//
//             // Трение и минимальная скорость
//             this.velocity.x *= this.friction;
//             this.velocity.y *= this.friction;
//             if (Math.abs(this.velocity.x) < this.minVelocity) this.velocity.x = this.minVelocity * (this.velocity.x > 0 ? 1 : -1);
//             if (Math.abs(this.velocity.y) < this.minVelocity) this.velocity.y = this.minVelocity * (this.velocity.y > 0 ? 1 : -1);
//         }
//     }
//
//     const colors = [
//         '#f58d7d', '#FFD700', '#a2fd07', '#10c1fd', '#FF4500',
//         '#fd0089', '#8e02f8', '#00f5f5', '#012aff', '#E6E6FA',
//         '#FF8C00', '#c31b1b'
//     ];
//
//     let isExplosionOver = false;
//
//     function createParticles(x, y) {
//         for (let i = 0; i < 150; i++) {
//             const color = colors[Math.floor(Math.random() * colors.length)];
//             particles.push(new Particle(x, y, color));
//         }
//
//         setTimeout(() => {
//             isExplosionOver = true;
//         }, 500);
//     }
//
//     // Столкновения с вероятностью 20%
//     function handleCollisions() {
//         for (let i = 0; i < particles.length; i++) {
//             for (let j = i + 1; j < particles.length; j++) {
//                 if (Math.random() > 0.8) {
//                     const p1 = particles[i];
//                     const p2 = particles[j];
//                     const dx = p2.x - p1.x;
//                     const dy = p2.y - p1.y;
//                     const distance = Math.sqrt(dx * dx + dy * dy);
//                     const minDistance = (p1.initialSize + p2.initialSize) * 0.8;
//                     if (distance < minDistance) {
//                         const tempVelX = p1.velocity.x;
//                         const tempVelY = p1.velocity.y;
//                         p1.velocity.x = p2.velocity.x;
//                         p1.velocity.y = p2.velocity.y;
//                         p2.velocity.x = tempVelX;
//                         p2.velocity.y = tempVelY;
//                         p1.pulseIntensity = 1.5;
//                         p2.pulseIntensity = 1.5;
//                     }
//                 }
//             }
//         }
//     }
//
//     function animate() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         for (let i = 0; i < particles.length; i++) {
//             particles[i].update();
//             particles[i].draw();
//         }
//         handleCollisions();
//         requestAnimationFrame(animate);
//     }
//
//     const audio = document.getElementById('bg-music');
//     const playButton = document.getElementById('play-btn');
//
//     const playlist = [
//         './music/1.mp3',
//         './music/2.mp3',
//         './music/3.mp3',
//         './music/4.mp3',
//         './music/5.mp3'
//     ];
//     let currentTrackIndex = 0;
//
//     function playNextTrack() {
//         currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
//         audio.src = playlist[currentTrackIndex];
//         audio.play();
//     }
//
//     audio.addEventListener('ended', playNextTrack);
//
//     if (playButton) {
//         playButton.addEventListener('click', () => {
//             playButton.style.display = 'none';
//             audio.src = playlist[currentTrackIndex];
//             audio.play();
//             const x = window.innerWidth / 2;
//             const y = window.innerHeight / 2;
//             createParticles(x, y);
//         });
//     }
//
//     animate();
// });

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('explosion-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return {r, g, b};
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.z = Math.random() * 2; // глубина от 0 до 2
            this.color = color;
            this.initialColor = hexToRgb(color);
            this.alpha = 1;
            this.initialSize = Math.random() * 7 + 3;
            this.numVertices = Math.floor(Math.random() * 4) + 3;
            this.vertices = [];
            for (let i = 0; i < this.numVertices; i++) {
                const angle = (Math.PI * 2 / this.numVertices) * i + (Math.random() * 0.5 - 0.25);
                const radius = this.initialSize * (Math.random() * 0.5 + 0.5);
                this.vertices.push({x: Math.cos(angle) * radius, y: Math.sin(angle) * radius});
            }

            this.velocity = {
                x: (Math.random() - 0.5) * (4 + Math.random() * 4),
                y: (Math.random() - 0.5) * (4 + Math.random() * 4),
                z: (Math.random() - 0.5) * 0.05
            };

            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.pulseSpeed = Math.random() * 0.02 + 0.002;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseIntensity = 1;

            this.friction = 0.9999;
            this.minVelocity = 0.1;
        }

        draw() {
            const scale = this.z;
            const size = this.initialSize * scale;

            const brightness = 0.3 + 0.7 * Math.abs(Math.sin(this.pulsePhase));
            const finalBrightness = brightness * this.pulseIntensity;

            ctx.save();
            ctx.globalAlpha = 1;
            const {r, g, b} = this.initialColor;
            ctx.fillStyle = `rgb(${r * finalBrightness}, ${g * finalBrightness}, ${b * finalBrightness})`;

            // ---- тени ----
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
            ctx.shadowBlur = 15 * scale;
            ctx.shadowOffsetX = 3 * (scale - 1);
            ctx.shadowOffsetY = 3 * (scale - 1);

            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            ctx.beginPath();
            ctx.moveTo(this.vertices[0].x * size, this.vertices[0].y * size);
            for (let i = 1; i < this.numVertices; i++) {
                ctx.lineTo(this.vertices[i].x * size, this.vertices[i].y * size);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.z += this.velocity.z;

            // границы по XY
            if (this.x - this.initialSize < 0 || this.x + this.initialSize > canvas.width) {
                this.velocity.x *= -1;
            }
            if (this.y - this.initialSize < 0 || this.y + this.initialSize > canvas.height) {
                this.velocity.y *= -1;
            }

            // границы по Z
            if (this.z < 0.5 || this.z > 2) {
                this.velocity.z *= -1;
            }

            this.pulsePhase += this.pulseSpeed;
            this.rotation += this.rotationSpeed;

            // трение
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            if (Math.abs(this.velocity.x) < this.minVelocity) this.velocity.x = this.minVelocity * (this.velocity.x > 0 ? 1 : -1);
            if (Math.abs(this.velocity.y) < this.minVelocity) this.velocity.y = this.minVelocity * (this.velocity.y > 0 ? 1 : -1);
        }
    }

    const colors = [
        '#f58d7d', '#FFD700', '#a2fd07', '#10c1fd', '#FF4500',
        '#fd0089', '#8e02f8', '#00f5f5', '#012aff', '#E6E6FA',
        '#FF8C00', '#c31b1b'
    ];

    let isExplosionOver = false;

    function createParticles(x, y) {
        for (let i = 0; i < 150; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }

        setTimeout(() => {
            isExplosionOver = true;
        }, 500);
    }

    // столкновения с вероятностью 20%
    function handleCollisions() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (Math.random() > 0.8) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = (p1.initialSize + p2.initialSize) * 0.8;
                    if (distance < minDistance) {
                        const tempVelX = p1.velocity.x;
                        const tempVelY = p1.velocity.y;
                        p1.velocity.x = p2.velocity.x;
                        p1.velocity.y = p2.velocity.y;
                        p2.velocity.x = tempVelX;
                        p2.velocity.y = tempVelY;
                        p1.pulseIntensity = 1.5;
                        p2.pulseIntensity = 1.5;
                    }
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        handleCollisions();
        requestAnimationFrame(animate);
    }

    const audio = document.getElementById('bg-music');
    const playButton = document.getElementById('play-btn');

    const playlist = [
        './music/1.mp3',
        './music/2.mp3',
        './music/3.mp3',
        './music/4.mp3',
        './music/5.mp3'
    ];
    let currentTrackIndex = 0;

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        audio.src = playlist[currentTrackIndex];
        audio.play();
    }

    audio.addEventListener('ended', playNextTrack);

    if (playButton) {
        playButton.addEventListener('click', () => {
            playButton.style.display = 'none';
            audio.src = playlist[currentTrackIndex];
            audio.play();
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            createParticles(x, y);
        });
    }

    animate();
});


// Домашнее задание вебинар
console.log(`Домашнее задание вебинар`);

function sumEventDigits(num) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
        throw new Error(`Введите целое число`)
    }
    if (num < 0) {
        num = -num;
    }
    {
        let sum = 0;
        while (num > 0) {
            let lastNum = num % 10;
            if (lastNum % 2 === 0) sum += lastNum;
            num = Math.floor(num / 10);
        }
        return sum;
    }
}

const num = 1234567;
const result = sumEventDigits(num);
console.log(`result = ${result}`);

console.log(`====================`);

// Домашнее задание 2 основной курс
console.log(`Домашнее задание 2 основной курс`);

function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let flag = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = true;
            }
        }
        if (!flag) {
            break;
        }
    }
    return arr;
}

const arr = [9, 2, 4, 1, 5, 2, 9, 1, 2, 0];
const res = bubbleSort(arr);
console.log(`result=${res}`);
