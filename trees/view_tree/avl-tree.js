var AVLTree = require('../avl-tree/avl-tree');
var Viewer = require('./viewer');

var tree = window.tree = new AVLTree();
var view = new Viewer(tree, document.querySelector(".view"));

var add = tree.add;
var remove = tree.remove;

var drawNode = view._drawNode;
view._drawNode = function(node) {
    var init = !node.dom;

    drawNode.apply(view, arguments);

    if (init) {
        node.dom.len = document.createElement("div");
        node.dom.len.classList.add("node__length");
        node.dom.appendChild(node.dom.len);
    }

    node.dom.len.innerHTML = node.length;
};

tree.add = function(v) {
    console.log("add", v);
    var result = add.apply(tree, arguments);
    view.update();
    return result;
};

tree.remove = function(v) {
    console.log("remove", v);
    var result = remove.apply(tree, arguments);
    view.update();
    return result;
};

window.add = function(count) {
    for (var k = 0; k < count; k++) {
        tree.add(Math.floor(Math.random() * 100));
    }
};

window.remove = function(count) {
    for (var k = 0; k < count; k++) {
        tree.remove(Math.floor(Math.random() * 100));
    }
};
