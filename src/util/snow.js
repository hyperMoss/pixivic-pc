export default function snow() {
  const COUNT = 50;
  const masthead = document.querySelector('.snow');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let width = masthead.clientWidth;
  let height = masthead.clientHeight;
  let i = 0;
  let active = false;

  // shim layer with setTimeout fallback
  const requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || function (callback) {
        window.setTimeout(callback, 1000 / 10);
      }
    );
  }());

  function onResize() {
    width = masthead.clientWidth;
    height = masthead.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#FFF';

    const wasActive = active;
    active = width > 100;

    if (!wasActive && active) {
      requestAnimFrame(update);
    }
  }

  const Snowflake = function () {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 0;

    this.reset();
  };

  Snowflake.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.vy = 1 + Math.random() * 3;
    this.vx = 0.5 - Math.random();
    this.r = 2 + Math.random() * 8;
    this.o = 0.5 + Math.random() * 0.5;
  };

  canvas.style.position = 'absolute';
  canvas.style.left = canvas.style.top = '0';

  const snowflakes = [];
  let snowflake;
  for (i = 0; i < COUNT; i++) {
    snowflake = new Snowflake();
    snowflake.reset();
    snowflakes.push(snowflake);
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    if (!active) {
      return;
    }

    for (i = 0; i < COUNT; i++) {
      snowflake = snowflakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;

      ctx.globalAlpha = snowflake.o;
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      if (snowflake.y > height) {
        snowflake.reset();
      }
    }

    requestAnimFrame(update);
  }

  onResize();
  window.addEventListener('resize', onResize, false);

  masthead.appendChild(canvas);
}
