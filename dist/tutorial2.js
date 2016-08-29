var Ball = function Ball(ptPos, radius, color, ptVelocity) {
    this.pos = ptPos;
    this.radius = radius;
    this.color = color;
    this.velocity = ptVelocity;
};

Ball.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
};

Ball.prototype.update = function(state) {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    var isOutside = {
        right: this.pos.x + this.radius > state.size.width,
        left: this.pos.x - this.radius < 0,
        bottom: this.pos.y + this.radius > state.size.height,
        top: this.pos.y - this.radius < 0
    };

    if(isOutside.left || isOutside.right) {
        this.velocity.x = -this.velocity.x;
    }

    if(isOutside.top || isOutside.bottom) {
        this.velocity.y = -this.velocity.y;
    }
};var Game = function Game(canvasId) {
    this.canvasId = canvasId;
    this.init();
};

Game.prototype.init = function init() {
    this.canvas = document.getElementById(this.canvasId);
    this.state = {
        size: {
            width: this.canvas.width,
            height: this.canvas.height
        }
    };
    this.balls = [
        new Ball(new Point(50, 50), 15, 'red', new Point(6, 3)),
        new Ball(new Point(200, 120), 25, 'blue', new Point(-7, -4)),
        new Ball(new Point(150, 250), 20, 'green', new Point(.75, 6))
    ];
    this.ctx = this.canvas.getContext('2d');
};

Game.prototype.update = function() {
    var state = this.state;
    this.balls.forEach(function(ball) {
        ball.update(state);
    });
};

Game.prototype.render = function() {

    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.state.size.width, this.state.size.height);
    this.balls.forEach(function(ball) {
        ball.draw(ctx);
    });
};

Game.prototype.start = function() {

    var self = this;

    (function tick() {
        self.update();
        self.render();
        window.requestAnimationFrame(tick);
    })();
};var Point = function Point(x, y) {
    this.x = x;
    this.y = y;
};