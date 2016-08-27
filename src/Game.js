var Game = function Game(canvasId) {
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
        }
    };
    this.balls = [];
    this.ctx = this.canvas.getContext('2d');
};

Game.prototype.canvasClickHandler = function(e) {
    this.balls.push(
        new Ball(new Point(e.offsetX, e.offsetY), 20, 'red', new Point(0, 0))
    );
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