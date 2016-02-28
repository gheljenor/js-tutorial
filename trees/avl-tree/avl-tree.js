var Tree = require('../tree');

var AVLTree = function() {
    Tree.call(this);
    this.root = null;
};

AVLTree._createNode = function(value, parent) {
    return {
        value: value,
        parent: parent,
        length: 0,
        left: null,
        right: null
    };
};

AVLTree.prototype = new Tree();

AVLTree.prototype.add = function(value) {
    var node;

    if (!this.root) {
        node = AVLTree._createNode(value, null);
    } else {
        node = this._findInsert(value);
        node.value = value;
    }

    node.left = AVLTree._createNode(null, node);
    node.right = AVLTree._createNode(null, node);

    return this._balance(node);
};

AVLTree.prototype.remove = function(value) {
    var node = this.find(value);

    if (!node) {
        return this;
    }

    var rep;

    if (node.length != 1) {
        if (node.left.length > node.right.length) {
            rep = this._findMax(node.left);
        } else {
            rep = this._findMin(node.right);
        }
        node.value = rep.value;
        node = rep;
    }

    if (node === node.parent.left) {
        node.parent.left = AVLTree._createNode(null, node.parent);
    } else {
        node.parent.right = AVLTree._createNode(null, node.parent);
    }

    this._balance(node.parent);
};

AVLTree.prototype._balance = function(node) {
    var dl;

    var i = 0;

    while (node) {
        if (!node.parent) {
            this.root = node;
        }

        dl = Math.max(0, node.left.length) - Math.max(0, node.right.length);

        if (dl >= 2) {
            if (node.left.left.length < node.left.right.length) {
                this._rotateBigRight(node);
            } else {
                this._rotateSmallRight(node);
            }
        } else if (dl <= -2) {
            if (node.right.right.length < node.right.left.length) {
                this._rotateBigLeft(node);
            } else {
                this._rotateSmallLeft(node);
            }
        }

        node.length = Math.max(node.left.length, node.right.length) + 1;
        node = node.parent;

        i++;
        if (i > 250) {
            console.error("INFINITE ballance!!!");
            return;
        }
    }

    return this;
};

AVLTree.prototype._rotateSmallLeft = function(node) {
    console.log("rotate small left");
    if (node.parent) {
        if (node.parent.left === node) {
            node.parent.left = node.right;
        } else {
            node.parent.right = node.right;
        }
    }

    node.right.parent = node.parent; // b.parent = a
    node.parent = node.right; // a.parent = b

    node.right = node.parent.left; // a.right = b.left
    node.right.parent = node; // a.right.parent = a

    node.parent.left = node; // b.left = a

    return this;
};

AVLTree.prototype._rotateSmallRight = function(node) {
    console.log("rotate small right");
    if (node.parent) {
        if (node.parent.right === node) {
            node.parent.right = node.left;
        } else {
            node.parent.left = node.left;
        }
    }

    node.left.parent = node.parent; // b.parent = a
    node.parent = node.left; // a.parent = b

    node.left = node.parent.right; // a.left = b.right
    node.left.parent = node; // a.left.parent = a

    node.parent.right = node; // b.right = a

    return this;
};

AVLTree.prototype._rotateBigLeft = function(node) {
    console.log("rotate big left");
    if (node.parent) {
        if (node.parent.left === node) {
            node.parent.left = node.right.left;
        } else {
            node.parent.right = node.right.left;
        }
    }

    node.right.length = Math.max(node.right.right.length, node.right.left.right.length) + 1;

    node.right.left.parent = node.parent; // c.parent = a.parent
    node.parent = node.right.left; // a.parent = c

    node.right.left = node.parent.right; // b.left = c.right
    node.right.left.parent = node.right; // b.left.parent = b

    node.parent.right = node.right; // c.right = b
    node.right.parent = node.parent; // b.parent = c

    node.right = node.parent.left; // a.right = c.left
    node.right.parent = node; // a.right.parent = a

    node.parent.left = node; // c.left = a

    return this;
};

AVLTree.prototype._rotateBigRight = function(node) {
    console.log("rotate big right");
    if (node.parent) {
        if (node.parent.right === node) {
            node.parent.right = node.left.right;
        } else {
            node.parent.left = node.left.right;
        }
    }

    node.left.length = Math.max(node.left.left.length, node.left.right.left.length) + 1;

    node.left.right.parent = node.parent; // c.parent = a.parent
    node.parent = node.left.right; // a.parent = c

    node.left.right = node.parent.left; // b.right = c.left
    node.left.right.parent = node.left; // b.right.parent = b

    node.parent.left = node.left; // c.left = b
    node.left.parent = node.parent; // b.parent = c

    node.left = node.parent.right; // a.left = c.right
    node.left.parent = node; // a.left.parent = a

    node.parent.right = node; // c.right = a

    return this;
};

module.exports = AVLTree;
