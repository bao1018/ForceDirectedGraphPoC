$(function(){ // on dom ready

$('#cy').cytoscape({
  layout: {
    name: 'arbor',
    liveUpdate: true, // whether to show the layout as it's running
    ready: undefined, // callback on layoutready 
    stop: undefined, // callback on layoutstop
    maxSimulationTime: 10000, // max length in ms to run the layout
    fit: true, // reset viewport to fit default simulationBounds
    padding: [ 50, 50, 50, 50 ], // top, right, bottom, left
    simulationBounds: undefined, // [x1, y1, x2, y2]; [0, 0, width, height] by default
    ungrabifyWhileSimulating: true, // so you can't drag nodes during layout

    // forces used by arbor (use arbor default on undefined)
    repulsion: undefined,
    stiffness: undefined,
    friction: undefined,
    gravity: true,
    fps: undefined,
    precision: undefined,

    // static numbers or functions that dynamically return what these
    // values should be for each element
    nodeMass: undefined, 
    edgeLength: undefined,

    stepSize: 1, // size of timestep in simulation

    // function that returns true if the system is stable to indicate
    // that the layout can be stopped
    // stableEnergy: function( energy ){
    //     var e = energy; 
    //     return (e.max <= 0.5) || (e.mean <= 0.3);
    // }
  },
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'left',
        'color': 'white',
        'text-outline-width': 1,
        'text-outline-color': '#888',
        'background-image': 'data(image)',
        'background-color': 'data(color)',
        // 'shape': 'roundrectangle'
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
        'opacity': 0,
        'text-opacity': 0
      }),
  
  elements: {
    nodes: [
      { data: { id: 'j', name: 'Jerry', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'e', name: 'Elaine', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'k', name: 'Kramer', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'g', name: 'George', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'a', name: 'George', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'b', name: 'George', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'c', name: 'George', image: 'group_128.png', color:'#a7af00' } },
      { data: { id: 'd', name: 'George', image: 'group_128.png', color:'#a7af00' } }
    ],
    edges: [
      { data: { source: 'j', target: 'e' } },
      { data: { source: 'j', target: 'k' } },
      { data: { source: 'j', target: 'g' } },
      { data: { source: 'e', target: 'a' } },
      { data: { source: 'k', target: 'b' } },
      { data: { source: 'g', target: 'c' } },
      { data: { source: 'e', target: 'd' } }
    ]
  },
  
  ready: function(){
    window.cy = this;
    
    // giddy up...
    
    cy.elements().unselectify();
    
    cy.on('tap', 'node', function(e){
      var node = e.cyTarget; 
      var neighborhood = node.neighborhood().add(node);
      
      cy.elements().addClass('faded');
      neighborhood.removeClass('faded');
    });
    
    cy.on('tap', function(e){
      if( e.cyTarget === cy ){
        cy.elements().removeClass('faded');
      }
    });
  }
});

}); // on dom ready