var graph = new Springy.Graph();

function randRGB() {
	return Math.floor(Math.random() * 16777215).toString(16);
}
var nodeSize = 30;

var nodeIndex = 0;

var clickEvent = function(e, node) {
	//hide
	graph.forEachEdge(function(edge) {
		graph.removeEdge(edge);
		if (edge.source.id != node.id && edge.target.id != node.id) {

			if (edge.target.id != 0)
				graph.removeNode(edge.target);
			if (edge.source.id != 0)
				graph.removeNode(edge.source);
		} else {
			graph.newEdge(graph.nodes[0], edge.target, {
				directional: false,
				color: '#000',
			});
		}
	});

	addNodes(node);
};

var addNodes = function(sourceNode) {
	for (var i = 0; i < 10; i++) {
		nodeIndex++;
		var node = graph.newNode({
			image: {
				src: 'img.png',
				width: nodeSize,
				height: nodeSize
			},
			label: 'node' + nodeIndex,
			onclick: clickEvent
		});
		graph.newEdge(sourceNode, node, {
			directional: false,
			color: '#ccc'
		});
	}
};

var root = graph.newNode({
	image: {
		src: 'img.png',
		width: nodeSize,
		height: nodeSize
	},
	label: 'root',
	onclick: clickEvent
});

addNodes(root);

jQuery(function() {
	var springy = window.springy = jQuery('#springydemo').springy({
		graph: graph,
		stiffness: 400,
		repulsion: 100,
		damping: 0.3,
		nodeSelected: function(node) {
			console.log('Node selected: ' + JSON.stringify(node.data));
		},
		repulsion: 150
	});
});