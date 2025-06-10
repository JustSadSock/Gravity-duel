// physics.js

const GRAVITY = 800;    // ускорение, px/s²
const MAX_VEL = 1200;   // максимальная скорость, px/s

export class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 0;       // текущая скорость по Y
    this.accel = 0;     // текущее ускорение по Y
    this.radius = 16;   // радиус мяча, в пикселях
  }

  // direction: -1 (вверх), +1 (вниз)
  setGravity(direction) {
    this.accel = direction * GRAVITY;
  }

  // dt — прошедшее время в секундах
  update(dt) {
    // обновляем скорость
    this.vel += this.accel * dt;
    // ограничиваем
    this.vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, this.vel));
    // обновляем позицию
    this.y += this.vel * dt;
  }

  // возвращаем мяч в центр + сбрасываем скорость/ускорение
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 0;
    this.accel = 0;
  }
}
