// renderer.js

// Быстрый «juice»: пульсация радиуса ±2 px и плавный сдвиг hue
const COLOR_SPEED = 40;   // °/сек добавляется к оттенку
const ROT_SPEED   = 2.5;  // рад/сек вращается декоративная полоса
const PULSE_SPEED = 3;    // кол/сек пульс
const PULSE_MAG   = 2;    // пиксели отклонения радиуса

export class Renderer {
  constructor(ctx, ball) {
    this.ctx  = ctx;
    this.ball = ball;

    this.hue   = 0;           // текущий оттенок HSL
    this.angle = 0;           // угол для полосы
  }

  /* ----- вспомогательные эффекты (shake) ----- */
  shake(duration = 0.1, magnitude = 8) {
    this.shakeDuration  = duration;
    this.shakeMagnitude = magnitude;
  }

  /* ----- отрисовка ----- */
  drawBackground(width, height) {
    // фон уже задан в CSS; можно добавить сетку/градиент если захочешь
  }

  drawMenu(width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle   = '#00ffff';
    ctx.textAlign   = 'center';
    ctx.font        = '24px monospace';
    ctx.fillText('Gravity Duel', width / 2, height / 2 - 40);
    ctx.font        = '16px monospace';
    ctx.fillText('Tap to Start',  width / 2, height / 2 + 10);
    ctx.restore();
  }

  drawGoals(width, height) {
    const { ctx } = this;
    const gw = 96, gh = 16;               // фикс. размеры
    ctx.fillStyle = '#00ffff';
    ctx.globalAlpha = 0.4;
    // верх
    ctx.fillRect((width - gw) / 2, 0, gw, gh);
    // низ
    ctx.fillRect((width - gw) / 2, height - gh, gw, gh);
    ctx.globalAlpha = 1;
  }

  drawBall(dt = 1 / 60) {
    const { ctx, ball } = this;

    /* --- обновляем параметры анимации --- */
    this.hue   = (this.hue + COLOR_SPEED * dt) % 360;
    this.angle = (this.angle + ROT_SPEED * dt) % (Math.PI * 2);

    // пульсация радиуса
    const pulse   = Math.sin(performance.now() / 1000 * PULSE_SPEED) * PULSE_MAG;
    const radius  = ball.radius + pulse;

    /* --- shake (если активен) --- */
    let offsetX = 0, offsetY = 0;
    if (this.shakeDuration > 0) {
      const m = this.shakeMagnitude;
      offsetX = (Math.random() * 2 - 1) * m;
      offsetY = (Math.random() * 2 - 1) * m;
      this.shakeDuration -= dt;
    }

    ctx.save();
    ctx.translate(offsetX, offsetY);

    /* --- сама «сфера» --- */
    const grad = ctx.createRadialGradient(
      ball.x, ball.y, 0,
      ball.x, ball.y, radius
    );
    grad.addColorStop(0,   `hsl(${this.hue}, 100%, 70%)`);
    grad.addColorStop(1,   `hsl(${(this.hue + 60) % 360}, 100%, 30%)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
    ctx.fill();

    /* --- декоративная полоса (рисует ощущение вращения) --- */
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, 0);
    ctx.lineTo( radius * 0.8, 0);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
