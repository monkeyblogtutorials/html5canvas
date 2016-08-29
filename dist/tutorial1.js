var Game = function Game(canvasId) {
    this.canvasId = canvasId;
    this.init();
};

Game.prototype.init = function init() {
    this.canvas = document.getElementById(this.canvasId);
    this.state = {
        size: {
            width: this.canvas.width,
            height: this.canvas.height
        },
        ballStartPos: {
            x: 50,
            y: 50
        }
    };
    this.ball = {
        x: null,
        y: null,
        radius: 20,
        color: 'blue',
        vx: 2,
        vy: 1,
        draw: function(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    };
    this.ctx = this.canvas.getContext('2d');
};

Game.prototype.update = function() {
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    var isOutside = {
        horizontal: this.ball.x > this.state.size.width,
        vertical: this.ball.y > this.state.size.height
    };
    if(isOutside.horizontal || isOutside.vertical) {
        this.resetBallPosition();
    }
};

Game.prototype.render = function() {

    this.ctx.clearRect(0, 0, this.state.size.width, this.state.size.height);
    this.ball.draw(this.ctx);
};

Game.prototype.resetBallPosition = function() {
    this.ball.x = this.state.ballStartPos.x;
    this.ball.y = this.state.ballStartPos.y;
};

Game.prototype.start = function() {

    var self = this;
    self.resetBallPosition();

    (function tick() {
        self.update();
        self.render();
        window.requestAnimationFrame(tick);
    })();
};