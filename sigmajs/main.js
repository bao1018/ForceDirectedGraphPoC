      var i,
        s,
        N = 10,
        E = 20,
        g = {
          nodes: [],
          edges: []
        };

       // Generate a random graph:
      for (i = 0; i < N; i++) {
        var _size = i == 0 ? 50 : 30;
        var _label = i == 0 ? 'Root' : 'Node' + i;
        g.nodes.push({
          id: 'n' + i,
          label: _label,
          x: Math.random(),
          y: Math.random(),
          size: _size,
          color: '#ec5148'
        });
      }


      for (i = 0; i < N - 1; i++)
        g.edges.push({
          id: 'e' + i,
          source: 'n0',
          target: 'n' + (i + 1),
          size: Math.random(),
          color: '#ec5148'
        });

       // Instanciate sigma:
      s = new sigma({
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