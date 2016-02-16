var RBTree = require('../rb-tree/rb-tree');
var Viewer = require('./viewer');

var tree = window.tree = new RBTree();
var view = new Viewer(tree, document.querySelector(".view"));

var add = tree.add;
var remove = tree.remove;

var drawNode = view._drawNode;
view._drawNode = function(node) {
    drawNode.apply(view, arguments);

    if (node.color === RBTree.RED) {
        node.dom.classList.add("node_red");
        node.dom.classList.remove("node_black");
    } else {
        node.dom.classList.add("node_black");
        node.dom.classList.remove("node_red");
    }
};

tree.add = function() {
    var result = add.apply(tree, arguments);
    view.update();
    return result;
};

tree.remove = function() {
    var result = remove.apply(tree, arguments);
    view.update();
    return result;
};
