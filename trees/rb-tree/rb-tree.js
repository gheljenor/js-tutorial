var Tree = require("../tree");

var RBTree = function() {
    Tree.call(this);
    this.root = null;
};

RBTree.RED = true;
RBTree.BLACK = false;

RBTree._createNode = function(value, parent, color) {
    return {
        parent: parent,
        value: value,
        color: color,
        left: null,
        right: null
    };
};

RBTree.prototype = new Tree();

RBTree.prototype.add = function(value) {
    var node;

    if (!this.root) {
        node = RBTree._createNode(value, null, RBTree.BLACK);
    } else {
        node = this._findInsert(value);
        node.value = value;
        node.color = RBTree.RED;
    }

    node.left = RBTree._createNode(null, node, RBTree.BLACK);
    node.right = RBTree._createNode(null, node, RBTree.BLACK);

    return this._balanceInsert(node);
};

RBTree.prototype.remove = function(value) {
    var node = this.find(value);

    if (!node) {
        return this;
    }

    if (node.left.value !== null && node.right.value !== null) {
        var rep;

        if (node === node.parent.left) {
            rep = this._findMax(node.left);
        } else {
            rep = this._findMin(node.right);
        }

        node.value = rep.value;
        node = rep;
    }

    var child = node.left.value != null ? node.left : node.right;

    if (node === node.parent.left) {
        node.parent.left = child;
    } else {
        node.parent.right = child;
    }

    child.parent = node.parent;

    if (node.color === RBTree.RED || child.color === RBTree.RED) {
        child.color = RBTree.BLACK;
    }

    return this._balanceRemove(child);
};

RBTree.prototype._balanceRemove = function(node) {
    if (!node.parent) {
        this.root = node;
        return this;
    }

    var brother = node.parent.left === node ? node.parent.right : node.parent.left;
    var parent = node.parent;

    if (brother.color === RBTree.RED) {
        brother.color = RBTree.BLACK;
        parent.color = RBTree.RED;

        if (parent.left === node) {
            this._rotateLeft(parent);
        } else {
            this._rotateRight(parent);
        }
    } else if (brother.left.color === RBTree.BLACK && brother.right.color === RBTree.BLACK) {
        brother.color = RBTree.RED;

        if (parent.color === RBTree.BLACK) {
            return this._balanceRemove(node.parent);
        } else {
            parent.color = RBTree.BLACK;
        }
    } else {
        if (parent.left === node && brother.left.color === RBTree.RED) {

            brother.color = RBTree.RED;
            brother.left.color = RBTree.BLACK;

            this._rotateRight(brother);
            brother = brother.parent;
        } else if (parent.right === node && brother.right.color === RBTree.RED) {

            brother.color = RBTree.RED;
            brother.right.color = RBTree.BLACK;

            this._rotateLeft(brother);
            brother = brother.parent;
        }

        brother.color = parent.color;
        parent.color = RBTree.BLACK;

        if (parent.left === node) {
            brother.right.color = RBTree.BLACK;
            this._rotateLeft(parent);
        } else {
            brother.left.color = RBTree.BLACK;
            this._rotateRight(parent);
        }
    }

    return this;
};

RBTree.prototype._balanceInsert = function(node) {
    if (!node.parent) {
        node.color = RBTree.BLACK;
        this.root = node;
    } else if (node.parent.color === RBTree.RED) { // если предок чёрный, то ничего делать не надо
        var parent = node.parent;
        var grand = parent.parent;
        var uncle = grand.left === parent ? grand.right : grand.left;

        if (uncle.color === RBTree.RED) {
            grand.color = RBTree.RED;
            node.parent.color = RBTree.BLACK;
            uncle.color = RBTree.BLACK;

            return this._balanceInsert(grand);
        } else if (uncle.color === RBTree.BLACK) {
            if (node === parent.right && parent === grand.left) {
                this._rotateLeft(parent);
                node = parent;
                parent = node.parent;
            } else if (node === parent.left && parent === grand.right) {
                this._rotateRight(parent);
                node = parent;
                parent = node.parent;
            }

            if (node === parent.left) {
                this._rotateRight(grand);
            } else {
                this._rotateLeft(grand);
            }

            parent.color = RBTree.BLACK;
            grand.color = RBTree.RED;
        }
    }

    return this;
};

RBTree.prototype.find = function(value) {
    var node = this.root;

    while (node.value !== null && node.value !== value) {
        if (node.value > value) {
            node = node.left;
        } else {
            node = node.right;
        }
    }

    if (node.value === value) {
        return node;
    } else {
        return null;
    }
};

RBTree.prototype._rotateLeft = function(node) {
    var pivot = node.right;
    pivot.parent = node.parent;

    if (node.parent != null) {
        if (node.parent.left == node) {
            node.parent.left = pivot;
        } else {
            node.parent.right = pivot;
        }
    } else {
        this.root = pivot;
    }

    node.right = pivot.left;
    if (pivot.left != null) {
        pivot.left.parent = node;
    }

    node.parent = pivot;
    pivot.left = node;

    return this;
};

//TODO: проверить есть ли отличия во вращении с AVL-деревом
RBTree.prototype._rotateRight = function(node) {
    var pivot = node.left;
    pivot.parent = node.parent;

    if (node.parent !== null) {
        if (node.parent.left == node) {
            node.parent.left = pivot;
        } else {
            node.parent.right = pivot;
        }
    } else {
        this.root = pivot;
    }

    node.left = pivot.right;
    if (pivot.right != null) {
        pivot.right.parent = node;
    }

    node.parent = pivot;
    pivot.right = node;

    return this;
};

module.exports = RBTree;
