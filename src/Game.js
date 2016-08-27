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
};