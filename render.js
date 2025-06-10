// renderer.js

export class Renderer {
  constructor(ctx, ball) {
    this.ctx = ctx;
    this.ball = ball;
    // Спрайты
    this.ballImage = new Image();
    this.ballImage.src = 'assets/sprites/ball_sheet.png';
    this.goalTopImage = new Image();
    this.goalTopImage.src = 'assets/sprites/goal_top.png';
    this.goalBottomImage = new Image();
    this.goalBottomImage.src = 'assets/sprites/goal_bottom.png';

    // Настройки анимации мяча
    this.ballFrameCount = 8;      // число кадров в спрайт-листе
    this.ballFrameSize = 32;      // размер кадра (px)
    this.ballAnimSpeed = 0.1;     // скорость смены кадров (сек/кадр)
    this.ballAnimTimer = 0;
    this.currentBallFrame = 0;

    // Эффект тряски
    this.shakeDuration = 0;
    this.shakeMagnitude = 8;
  }

  // Вызываем при flip гравитации, чтобы дать немного shake
  shake() {
    this.shakeDuration = 0.1; // сек
  }

  // Фон (оставляем прозрачным — фон задаёт CSS)
  drawBackground(width, height) {
    // при необходимости можно добавить милый grid или линии
  }

  // Меню «тапни, чтобы начать»
  drawMenu(width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = '#00ffff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Gravity Duel', width / 2, height / 2 - 40);
    ctx.font = '16px monospace';
    ctx.fillText('Tap to Start', width / 2, height / 2 + 10);
    ctx.restore();
  }

  // Ворота сверху и снизу
  drawGoals(width, height) {
    const { ctx, goalTopImage, goalBottomImage } = this;
    const gw = goalTopImage.width;
    const gh = goalTopImage.height;
    // Верхние ворота
    ctx.drawImage(goalTopImage, (width - gw) / 2, 0, gw, gh);
    // Нижние ворота
    ctx.drawImage(goalBottomImage, (width - gw) / 2, height - gh, gw, gh);
  }

  // Мяч + анимация, + shake
  drawBall() {
    const { ctx, ball, ballImage, ballFrameCount, ballFrameSize } = this;
    // Обновляем анимацию
    this.ballAnimTimer += this.ballAnimSpeed;
    if (this.ballAnimTimer >= 1) {
      this.currentBallFrame = (this.currentBallFrame + 1) % ballFrameCount;
      this.ballAnimTimer = 0;
    }

    // Shake
    let offsetX = 0, offsetY = 0;
    if (this.shakeDuration > 0) {
      const mag = this.shakeMagnitude;
      offsetX = (Math.random() * 2 - 1) * mag;
      offsetY = (Math.random() * 2 - 1) * mag;
      this.shakeDuration -= 1 / 60;
    }

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Вычисляем координаты кадра
    const sx = this.currentBallFrame * ballFrameSize;
    const sy = 0;
    const sw = ballFrameSize;
    const sh = ballFrameSize;
    const dx = ball.x - ball.radius;
    const dy = ball.y - ball.radius;
    const dw = ball.radius * 2;
    const dh = ball.radius * 2;

    ctx.drawImage(ballImage, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  }
}
