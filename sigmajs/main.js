      var i,
        s,
        N = 10,
        E = 20,
        g = {
          nodes: [],
          edges: []
        };
      var edgeIndex = 0

       // Generate a random graph:
      for (i = 0; i < N; i++) {
        var _size = 50;
        var _label = i == 0 ? 'Root' : 'Node' + i;
        var _color = i==0 ? '#333': '#ec5148';
        g.nodes.push({
          id: 'n' + i,
          label: _label,
          x: Math.random(),
          y: Math.random(),
          size: _size,
          color: _color
        });
      }


      for (i = 0; i < N - 1; i++) {
        g.edges.push({
          id: 'e' + i,
          source: 'n0',
          target: 'n' + (i + 1),
          size: 5,
          color: '#ec5148'
        });
        edgeIndex++;
      }

       // Instanciate sigma:
      var s = new sigma({
        graph: g,
        renderer: {
          container: document.getElementById('graph-container'),
          type: 'canvas'
        },
        settings: {
          mouseEnabled: false,
          touchEnabled: false,
        }
      });

      var dom = document.querySelector('#graph-container canvas:last-child');
      var camera = s.cameras[0];
      dom.addEventListener('click', function(e) {
        x = sigma.utils.getX(e) - dom.offsetWidth / 2;
        y = sigma.utils.getY(e) - dom.offsetHeight / 2;
        var p = camera.cameraPosition(x, y);
        var x = p.x;
        var y = p.y;
        var selectedNodes = s.graph.nodes().filter(function(n) {
          return (Math.sqrt(
            Math.pow(n['read_cam0:x'] - x, 2) +
            Math.pow(n['read_cam0:y'] - y, 2)
          ) <= n.size);
        });
        if (selectedNodes.length == 0) return;
        var targetNode = selectedNodes[0];
        //remove existing node
        s.graph.nodes().forEach(function(node){
           if(node.id != targetNode.id){
            if(node.id != s.graph.nodes()[0].id)
              s.graph.dropNode(node.id);
              var relatedLinks = s.graph.edges().filter(function(e){
                return e.source == node.id || e.target == node.id
              });
              relatedLinks.forEach(function(link){
                s.graph.dropEdge(link.id);
              });
           }
        });
        //add new nodes
        for (var i = 0; i < 5; i++) {
          s.graph.addNode({
            id: targetNode.id + i,
            label: targetNode.label + i,
            x: Math.random(),
            y: Math.random(),
            size: 50,
            color: '#ec5148'
          });
          edgeIndex++;
          s.graph.addEdge({
            id: 'e' + edgeIndex,
            source: targetNode.id,
            target: targetNode.id + i,
            size: 5,
            color: '#ec5148'
          });
        }
          edgeIndex++;
          s.graph.addEdge({
            id: 'e' + edgeIndex,
            source: targetNode.id,
            target: s.graph.nodes()[0].id,
            size: 5,
            color: '#ec5148'
          });
        s.refresh();

      });