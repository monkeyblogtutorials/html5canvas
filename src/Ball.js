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
};