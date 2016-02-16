var Tree = require('../tree');

var AVLTree = function() {
    Tree.call(this);
    this.root = null;
};

AVLTree._createNode = function(value, parent) {
    return {
        value: value,
        parent: parent,
        length: 1,
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
        node.left = AVLTree._createNode(null, node);
        node.right = AVLTree._createNode(null, node);
    }

    return this._balance(node);
};

AVLTree.prototype.remove = function(value) {
    var node = this.find(value);
    var rep;

    if (node.length != 2) {
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

    while (node) {
        if (!node.parent) {
            this.root = node;
        }

        dl = node.left.length - node.right.length;

        if (dl >= 2) {
            if (node.left.left.length > node.left.right.length) {
                this._rotateBigRight(node);
            } else {
                this._rotateSmallRight(node);
            }
        } else if (dl <= -2) {
            if (node.right.right.length > node.right.left.length) {
                this._rotateBigLeft(node);
            } else {
                this._rotateSmallLeft(node);
            }
        }

        node.length = Math.max(node.left.length, node.right.length) + 1;
        node = node.parent;
    }

    return this;
};

AVLTree.prototype._rotateSmallLeft = function(node) {
    if (node.parent.left === node) {
        node.parent.left = node.right;
    } else {
        node.parent.right = node.right;
    }

    node.right.parent = node.parent;
    node.parent = node.right;

    node.right = node.parent.left;
    node.parent.left = node;

    return this;
};

AVLTree.prototype._rotateSmallRight = function(node) {
    if (node.parent.left === node) {
        node.parent.left = node.left;
    } else {
        node.parent.right = node.left;
    }

    node.left.parent = node.parent;
    node.parent = node.left;

    node.left = node.parent.right;
    node.parent.right = node;

    return this;
};

AVLTree.prototype._rotateBigLeft = function(node) {
    if (node.parent.left === node) {
        node.parent.left = node.right.left;
    } else {
        node.parent.right = node.right.left;
    }

    node.right.length = Math.max(node.right.right.length, node.right.left.right.length) + 1;

    node.parent = node.right.left;

    node.right.left = node.parent.right;
    node.parent.right = node.right;
    node.right.parent = node.parent;

    node.right = node.parent.left;
    node.right.parent = node;
    node.parent.left = node;

    return this;
};

AVLTree.prototype._rotateBigRight = function(node) {
    if (node.parent.left === node) {
        node.parent.left = node.right.right;
    } else {
        node.parent.right = node.right.right;
    }

    node.left.length = Math.max(node.left.left.length, node.left.right.left.length) + 1;

    node.parent = node.left.right;

    node.left.right = node.parent.left;
    node.parent.left = node.left;
    node.left.parent = node.parent;

    node.left = node.parent.right;
    node.left.parent = node;
    node.parent.right = node;

    return this;
};
