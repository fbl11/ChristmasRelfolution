class Game {
	constructor() {
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.elves = [];
		this.bullets = [];
		this.weapons = [];

		this.canvasOffset = canvas.getBoundingClientRect();

		this.valid = false;
		this.dragging = false;
		this.selection = null;
		this.dragoffx = 0;
		this.dragoffy = 0;

		this.canvas.addEventListener('selectstart', (e) => {
			e.preventDefault();
			return false;
		}, false);

		this.canvas.addEventListener('mousedown', (e) => {
			var mouse = this.getMouse(e);
			var mx = mouse.x;
			var my = mouse.y;
			var weapons = this.weapons;
			var l = weapons.length;
			for (var i = l - 1; i >= 0; i--) {
				if (weapons[i].contains(mx, my)) {
					var mySel = weapons[i];
					this.dragoffx = mx - mySel.x;
					this.dragoffy = my - mySel.y;
					this.dragging = true;
					this.selection = mySel;
					this.valid = false;
					return;
				}
			}
			if (this.selection) {
				this.selection = null;
				this.valid = false;
			}
		}, true);
		canvas.addEventListener('mousemove', (e) => {
			if (this.dragging) {
				var mouse = this.getMouse(e);
				this.selection.x = mouse.x - this.dragoffx;
				this.selection.y = mouse.y - this.dragoffy;
				this.valid = false;
			}
		}, true);
		canvas.addEventListener('mouseup', (e) => {
			var mouse = this.getMouse(e);
			var occupied = this.checkOccupied(mouse);
			if (occupied == true) {
				this.selection.x = this.selection.position.x;
				this.selection.y = this.selection.position.y;
				this.dragging = false;
			} else {
				var center = this.findCenter(mouse);
				this.dragging = false;
				this.selection.x = center.x - (this.selection.w / 2);
				this.selection.y = center.y - (this.selection.h / 2);
				this.selection.position = {
					x: this.selection.x,
					y: this.selection.y
				}
			}
			this.valid = false;
		}, true);

		this.selectionColor = '#CC0000';
		this.selectionWidth = 2;
		this.interval = 30;
		setInterval(() => {
			this.draw();
		}, this.interval);


		this.update();
	}

	update() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.elves.forEach((elf) => {
			elf.update(this.ctx);
		});
		this.weapons.forEach((weapon) => {
			weapon.update(this.ctx);
		});
		this.bullets.forEach((bullet) => {
			bullet.update(this.ctx);
		});

		requestAnimationFrame(() => {
			this.update()
		});
	}

	addElf() {
		this.elves.push(new Elf());
	}

	addWeapon(weapon) {
		this.weapons.push(weapon);
		this.valid = false;
	}

	getMouse(e) {
		let mx = e.pageX - this.canvasOffset.top;
		let my = e.pageY - this.canvasOffset.left;

		return {
			x: mx,
			y: my
		};
	}

	draw() {
		if (!this.valid) {
			this.weapons.forEach((weapon) => {
				if (weapon.x > this.width || weapon.y > this.height ||
					weapon.x + weapon.w < 0 || weapon.y + weapon.h < 0) return;
				weapon.draw(this.ctx);
			})
			this.valid = true;
		}
	}

	findCenter(mouse) {
		if (mouse.x.toString().length == 2) {
			var mx = 50;
		} else {
			var mx = parseInt(mouse.x.toString()[0]);
			mx = (mx * 100) + 50;
		}

		if (mouse.y.toString().length == 2) {
			var my = 50;
		} else {
			var my = parseInt(mouse.y.toString()[0]);
			my = (my * 100) + 50;
		}
		return {
			x: mx,
			y: my
		};
	}

	checkOccupied(mouse) {
		var mx = parseInt(mouse.x.toString()[0]);
		var my = parseInt(mouse.y.toString()[0]);
		var weapons = this.weapons;
		var l = weapons.length;
		for (var i = l - 1; i >= 0; i--) {
			var mySel = weapons[i];
			var gridX = parseInt(mySel.position.x.toString()[0]);
			var gridY = parseInt(mySel.position.y.toString()[0]);
			if (gridX == mx && gridY == my) {
				return true;
			}
		}
	}
}

const game = new Game();
game.addWeapon(new Weapon(0, 0, 100, 100)); // The default is gray
game.addWeapon(new Weapon(0, 500, 100, 100, 'lightskyblue'));
// Lets make some partially transparent
game.addWeapon(new Weapon(700, 0, 100, 100, 'rgba(127, 255, 212, .5)'));
game.addWeapon(new Weapon(700, 500, 100, 100, 'rgba(245, 222, 179, .7)'));

setInterval(() => {
	game.addElf(document.getElementById('canvas'));
}, 3000);