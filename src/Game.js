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
};