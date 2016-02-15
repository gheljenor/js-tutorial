var Presenter = function (tree, field) {
    this.tree = tree;
    this.field = field;

    this.field.svg = SVG(this.field).size('100%', '100%');

    this._id = 0;
    this.nodes = [];
    this.links = {};
};

Presenter.prototype.walk = function (callback) {
    var node = this.tree.root;
    var prev = node;
    var x = 0;
    var y = 0;

    while (node) {
        if (node.right === prev) {
            prev = node;
            node = node.parent;
            y--;
            x += node.right === prev ? -1 : 1;
        } else if (node.left && node.left !== prev) {
            prev = node;
            node = node.left;
            y++;
            x--;
        } else {
            callback(node, x, y);

            if (node.right) {
                prev = node;
                node = node.right;
                y++;
                x++;
            } else {
                prev = node.right;
            }
        }
    }
};

Presenter.prototype.update = function () {
    var k, l, node;

    var minX = 0;
    var maxX = 0;
    var maxY = 0;

    this.walk(function (node, x, y) {
        node._visited = true;

        if (node.id) {
            this._updateNode(node, x, y);
        } else {
            this._addNode(node, x, y);
            this.nodes.push(node);
        }

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }.bind(this));

    for (k = 0, l = this.nodes.length; k < l; k++) {
        node = this.nodes[k];

        if (!node._visited) {
            this._removeNode(node);
            this.nodes.splice(k, 1);
            k--;
            l--;
        }

        delete node._visited;
    }

    this._redraw(minX, maxX, maxY);
};

Presenter.prototype._drawNode = function (node) {
    if (!node.dom) {
        node.dom = document.createElement("div");
        node.dom.classList.add("node");

        node.dom.text = document.createElement("span");
        node.dom.text.classList.add("node__text");

        node.dom.appendChild(node.dom.text);
        this.field.appendChild(node.dom);
    }

    node.dom.text.innerText = node.value;
};

Presenter.prototype._addNode = function (node, x, y) {
    node.id = this._id++;
    node._x = x;
    node._y = y;

    this._drawNode(node);

    if (node.parent) {
        this.links[node.id] = this.field.svg.line(0, 0, 1, 1).addClass("link");
    }
};

Presenter.prototype._updateNode = function (node, x, y) {
    node._x = x;
    node._y = y;
    this._drawNode(node);

    if (!node.parent && this.links[node.id]) {
        this.links[node.id].remove();
        this.links[node.id] = null;
    } else if (node.parent && !this.links[node.id]) {
        this.links[node.id] = this.field.svg.line(0, 0, 1, 1).addClass("link");
    }
};

Presenter.prototype._removeNode = function (node) {
    this.field.removeChild(node.dom);
    delete node.dom;

    if (this.links[node.id]) {
        this.links[node.id].remove();
        this.links[node.id] = null;
    }
};

Presenter.prototype._redraw = function (minX, maxX, height) {
    var node;
    var x, y;

    var width = maxX - minX;

    var fWidth = this.field.offsetWidth / width;
    var fHeight = this.field.offsetHeight / height;

    for (var k = 0, l = this.nodes.length; k < l; k++) {
        node = this.nodes[k];

        x = (node._x - minX) / width;
        y = node._y / height;

        node.dom.style.left = (x * 100).toFixed(3) + "%";
        node.dom.style.top = (y * 100).toFixed(3) + "%";

        if (this.links[node.id]) {
            this.links[node.id].animate(100).plot(
                x * fWidth,
                y * fHeight,
                (node.parent._x - minX) * fWidth,
                node.parent._y * fHeight
            );
        }
    }
};