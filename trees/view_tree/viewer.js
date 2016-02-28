var Viewer = function(tree, field) {
    this.tree = tree;
    this.field = field;

    this.field.svg = SVG(this.field).size('100%', '100%');

    this._id = 1;
    this.nodes = [];
    this.links = {};
};

Viewer.prototype.update = function() {
    var k, l, node;
    var height = 0;

    this.tree.walk(function(node, x, y) {
        height = Math.max(height, y);
        node._visited = true;

        if (node.id) {
            this._updateNode(node, x, y);
        } else {
            this._addNode(node, x, y);
            this.nodes.push(node);
        }
    }.bind(this), false);

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

    this._redraw(height + 1);
};

Viewer.prototype._drawNode = function(node) {
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

Viewer.prototype._addNode = function(node, x, y) {
    node.id = this._id++;
    node.x = x;
    node.y = y;

    this._drawNode(node);

    if (node.parent) {
        this.links[node.id] = this.field.svg.line(0, 0, 1, 1).addClass("link");
    }
};

Viewer.prototype._updateNode = function(node, x, y) {
    node.x = x;
    node.y = y;
    this._drawNode(node);

    if (!node.parent && this.links[node.id]) {
        this.links[node.id].remove();
        this.links[node.id] = null;
    } else if (node.parent && !this.links[node.id]) {
        this.links[node.id] = this.field.svg.line(0, 0, 1, 1).addClass("link");
    }
};

Viewer.prototype._removeNode = function(node) {
    this.field.removeChild(node.dom);
    delete node.dom;

    if (this.links[node.id]) {
        this.links[node.id].remove();
        this.links[node.id] = null;
    }
};

Viewer.prototype._redraw = function(height) {
    var node;
    var x, y;

    height = height - 1;

    for (var k = 0, l = this.nodes.length; k < l; k++) {
        node = this.nodes[k];

        x = ((0.5 + node.x) / Math.pow(2, node.y) * 100).toFixed(3) + "%";
        y = (node.y / height * 100).toFixed(3) + "%";

        node.dom.style.left = x;
        node.dom.style.top = y;

        if (this.links[node.id]) {
            (function(link, x1, y1, x2, y2) {
                link.animate(500, '>').attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
            })(
                this.links[node.id],
                x,
                y,
                ((0.5 + node.parent.x) / Math.pow(2, node.parent.y) * 100).toFixed(3) + "%",
                (node.parent.y / height * 100).toFixed(3) + "%"
            );
        }
    }
};

module.exports = Viewer;
