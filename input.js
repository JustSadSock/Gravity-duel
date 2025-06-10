// input.js

export const inputState = {
  flipA: false,    // игрок A (верхняя половина)
  flipB: false,    // игрок B (нижняя половина)
  started: false   // первый тап запускает игру из меню
};

export function setupInput(canvas) {
  let hasStarted = false;

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // первый тап — старт
    if (!hasStarted) {
      inputState.started = true;
      hasStarted = true;
      return;
    }

    // последующие — флип гравитации
    if (y < canvas.height / 2) {
      inputState.flipA = true;
    } else {
      inputState.flipB = true;
    }
  });
}
