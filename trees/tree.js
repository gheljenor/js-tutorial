var Tree = function() {
    this.root = null;
};

Tree.prototype.find = function(value) {
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

Tree.prototype.walk = function(callback, nulls) {
    var node = this.root;
    var prev = node;
    var y = 0;
    var x = 0;

    var i = 0;

    while (node) {
        if (node.right === prev) {
            prev = node;
            node = node.parent;
            y--;
            x = x >> 1;
        } else if (node.left && node.left !== prev) {
            prev = node;
            node = node.left;
            y++;
            x = x * 2;
        } else {
            if (node.value != null || nulls) {
                callback(node, x, y);
            }

            if (node.right) {
                prev = node;
                node = node.right;
                y++;
                x = x * 2 + 1;
            } else {
                prev = node.right;
            }
        }

        //i++;
        //if (i > 250) {
        //    console.error ("INFINITE!!!");
        //    return;
        //}
    }
};

Tree.prototype._findMin = function(node) {
    while (node.left.value !== null) {
        node = node.left;
    }

    return node;
};

Tree.prototype._findMax = function(node) {
    while (node.right.value !== null) {
        node = node.right;
    }

    return node;
};

Tree.prototype._findInsert = function(value) {
    var node = this.root;

    while (node.value !== null) {
        if (node.value > value) {
            node = node.left;
        } else {
            node = node.right;
        }
    }

    return node;
};

module.exports = Tree;
