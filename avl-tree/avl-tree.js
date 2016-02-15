var AVLTree = function () {
    this.root = null;
};

AVLTree.prototype._rotateSmallLeft = function (node) {
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

AVLTree.prototype._rotateSmallRight = function (node) {
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

AVLTree.prototype._rotateBigLeft = function (node) {
    if (node.parent.left === node) {
        node.parent.left = node.right.left;
    } else {
        node.parent.right = node.right.left;
    }

    node.parent = node.right.left;

    node.right.left = node.parent.right;
    node.parent.right = node.right;
    node.right.parent = node.parent;

    node.right = node.parent.left;
    node.right.parent = node;
    node.parent.left = node;

    return this;
};

AVLTree.prototype._rotateBigRight = function (node) {
    if (node.parent.left === node) {
        node.parent.left = node.right.right;
    } else {
        node.parent.right = node.right.right;
    }

    node.parent = node.left.right;

    node.left.right = node.parent.left;
    node.parent.left = node.left;
    node.left.parent = node.parent;

    node.left = node.parent.right;
    node.left.parent = node;
    node.parent.right = node;

    return this;
};
