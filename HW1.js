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
        return { r, g, b };
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.z = Math.random() * 20;
            this.color = color;
            this.initialColor = hexToRgb(color);
            this.alpha = 1;
            this.initialSize = Math.random() * 4 + 4;

            this.numVertices = Math.floor(Math.random() * 4) + 3;
            this.vertices = [];

            for (let i = 0; i < this.numVertices; i++) {
                const angle = (Math.PI * 2 / this.numVertices) * i + (Math.random() * 0.5 - 0.25);
                const radius = this.initialSize * (Math.random() * 0.5 + 0.5);
                this.vertices.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
            }

            // Увеличиваем диапазон скорости для хаотичности
            this.velocity = {
                x: (Math.random() - 0.5) * (15 + this.z * 0.75),
                y: (Math.random() - 0.5) * (15 + this.z * 0.75)
            };
            // Добавляем случайное вращение
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        }

        draw() {
            const size = this.initialSize * (1 + this.z / 10);
            const brightness = 1 - (this.z / 20);

            ctx.save();
            ctx.globalAlpha = this.alpha;

            const { r, g, b } = this.initialColor;
            ctx.fillStyle = `rgb(${r * brightness}, ${g * brightness}, ${b * brightness})`;

            // Вращаем канвас
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Рисуем многоугольник
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
            this.alpha -= 0.0000001;
            // Обновляем угол вращения
            this.rotation += this.rotationSpeed;
        }
    }

    const colors = [
        '#f58d7d', '#FFD700', '#a2fd07', '#10c1fd', '#FF4500',
        '#fd0089', '#8e02f8', '#00f5f5', '#012aff', '#E6E6FA',
        '#FF8C00', '#c31b1b'
    ];

    function createParticles(x, y) {
        for (let i = 0; i < 90; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw();
            if (particle.alpha <= 0.05) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }

    const audio = document.getElementById('bg-music');
    const playButton = document.getElementById('play-btn');


    const playlist = [
        './music/1.mp3',
        './music/2.mp3', // Добавь здесь свои треки
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
    // ---- Конец кода для музыкального плейлиста ----

    if (playButton) {
        playButton.addEventListener('click', (event) => {
            playButton.style.display = 'none';
            // Запускаем первый трек из плейлиста
            audio.src = playlist[currentTrackIndex];
            audio.play();
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            createParticles(x, y);
        });
    }

    animate();
});

function sumEventDigits(num)
{
    let sum = 0;
    while (num > 0) {
        let lastNum = num % 10;
        if (lastNum % 2 === 0) {
            sum += lastNum;
        }
        num = Math.floor(num / 10);
    }
    return sum;
}
const num = 1234567;
const result = sumEventDigits(num);
console.log(`result = ${result}`); // Output: result = 12