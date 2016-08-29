var Ball = function Ball(ptPos, radius, color, ptVelocity) {
    this.pos = ptPos;
    this.radius = radius;
    this.color = color;
    this.velocity = ptVelocity;
    this.bounce = .65;
    this.minVelocity = .5;
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

    var isOutside,
        maxPosY = state.size.height - this.radius;

    // vertical
    if(this.velocity.y || this.pos.y < maxPosY) {
        this.velocity.y += state.gravity;
        this.pos.y += this.velocity.y;
        isOutside = {
            bottom: this.pos.y + this.radius > state.size.height,
            top: this.pos.y - this.radius < 0
        };
        if(isOutside.top || isOutside.bottom) {
            this.pos.y = isOutside.top ? 0 + this.radius : state.size.height - this.radius;
            this.velocity.y = -this.velocity.y * this.bounce;
        }
        if(Math.abs(this.velocity.y) <= this.minVelocity && this.pos.y >= maxPosY) {
            this.velocity.y = 0;
            this.color = 'red';
        }
    }

    // horizontal
    this.pos.x += this.velocity.x;
    isOutside = {
        right: this.pos.x + this.radius > state.size.width,
        left: this.pos.x - this.radius < 0
    };
    if(isOutside.left || isOutside.right) {
        this.pos.x = isOutside.left ? 0 + this.radius : state.size.width -  this.radius;
        this.velocity.x = -this.velocity.x * this.bounce;
    }
};var Game = function Game(canvasId) {
    this.canvasId = canvasId;
    this.init();
};

Game.prototype.init = function init() {
    this.canvas = document.getElementById(this.canvasId);
    this.canvas.addEventListener('click', this.canvasClickHandler.bind(this));
    this.state = {
        size: {
            width: this.canvas.width,
            height: this.canvas.height
        },
        gravity: .3
    };
    this.balls = [];
    this.ctx = this.canvas.getContext('2d');
};

Game.prototype.getRandomColor = function() {
    var letters = '456789AB';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 8)];
    }
    return color;
}

Game.prototype.canvasClickHandler = function(e) {
    this.balls = [
        new Ball(
            new Point(e.offsetX, e.offsetY),
            10 + Math.random()*20,
            this.getRandomColor(),
            new Point(-2 + Math.random()*4, 0)
        )
    ];
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