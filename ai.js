// ai.js

/**
 * Простая AI-логика для одиночной игры.
 * Режим: реагирует на смену направления с небольшой задержкой.
 */
export class AI {
  /**
   * @param {Ball} ball — объект мяча из physics.js
   * @param {number} minDelay — мин. задержка между флипами в мс (например, 80)
   * @param {number} maxDelay — макс. задержка между флипами в мс (например, 180)
   */
  constructor(ball, minDelay = 80, maxDelay = 180) {
    this.ball = ball;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
    this._scheduleNextFlip();
  }

  _scheduleNextFlip() {
    const range = this.maxDelay - this.minDelay;
    this.nextFlipAt = performance.now() + this.minDelay + Math.random() * range;
  }

  /**
   * Вызывать в игровом цикле после physics.update(dt).
   * Если пришло время — меняет гравитацию.
   */
  update() {
    const now = performance.now();
    if (now >= this.nextFlipAt) {
      // Инвертируем направление: если сейчас падает вниз (+), заставляем вверх (-), и наоборот
      const currentDir = Math.sign(this.ball.accel) || (Math.random() < 0.5 ? 1 : -1);
      this.ball.setGravity(-currentDir);
      this._scheduleNextFlip();
    }
  }
}
