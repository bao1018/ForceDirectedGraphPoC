Cytoscape.js allows you to easily display graphs in your websites. 
Because Cytoscape.js allows the user to interact with the graph and the library allows the client to hook into user events, Cytoscape.js is easily integrated into your webapp, especially since Cytoscape.js supports both desktop browsers, like Chrome, and mobile browsers, like on the iPad.
The function of a layout is to set the positions on the nodes in the graph. Layouts are extensions of Cytoscape.js such that it is possible for anyone to write a layout without modifying the library itself.It supports arbor as layout.
Cytoscape's selector is powerful and friendly. It supply selector like css selector. We can use  properties on nodes and edges, it is simple to set properties value like css's style it support.
However, it is difficult to add nodes and edges dynamically as our app does. The positions of newly added nodes must be defined. Nodes can not be placed in the graph without a valid position — otherwise they could not be displayed. So it is a big problem.
Besides, the node's image and color cannot show at the same time because they are both background properties.
