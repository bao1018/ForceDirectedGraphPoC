//
// site.js
//
// the arbor.js website
//
(function($){
  // var trace = function(msg){
  //   if (typeof(window)=='undefined' || !window.console) return
  //   var len = arguments.length, args = [];
  //   for (var i=0; i<len; i++) args.push("arguments["+i+"]")
  //   eval("console.log("+args.join(",")+")")
  // }  
  NodeDatabase = { "demos": { nodes : { halfviz:{color:'#a7af00', alpha:1},
                                        atlas:{color:'#a7af00', alpha:1},
                                        echolalia:{color:'#a7af00', alpha:1} 
                                      },
                              edges : { "demos" : { halfviz:{}, atlas:{}, echolalia:{} } }
                            },
                    "docs": { edges : { "docs" : { reference:{},introduction:{} } },
                            nodes : { reference:{color:'#a7af00'},
                                      introduction:{color:'#a7af00'}
                                    }
                          },
                    "code": { edges : { "code" : { ".zip":{},".tar.gz":{},"github":{} } },
                            nodes : {
                                      github:{color:'#a7af00'},
                                       ".zip":{color:'#a7af00'},
                                       ".tar.gz":{color:'#a7af00'}
                                    }
                          }
                  };
  var EtrLoadNode = function(node, sys){
    if (node.data.load_related == true)
      return false
    else {
      var related_nodes = NodeDatabase[node.name]
      console.log(related_nodes)
      if(related_nodes){
        sys.graft(related_nodes);
        node.data.load_related = true 
      };
    }
  }
  var Renderer = function(elt){
    var dom = $(elt)
    var canvas = dom.get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var sys = null

    var _vignette = null
    var selected = null,
        nearest = null,
        _mouseP = null;

    var image = new Image();
    image.src = 'group_128.png';

    var that = {
      init:function(pSystem){
        sys = pSystem
        sys.screen({size:{width:dom.width(), height:dom.height()},
                    padding:[36,60,36,60]})

        $(window).resize(that.resize)
        that.resize()
        that._initMouseHandling()

        if (document.referrer.match(/echolalia|atlas|halfviz/)){
          // if we got here by hitting the back button in one of the demos, 
          // start with the demos section pre-selected
          that.switchSection('demos')
        }
      },
      resize:function(){
        // canvas.width = $(window).width()
        // canvas.height = .75* $(window).height()
        sys.screen({size:{width:canvas.width, height:canvas.height}})
        _vignette = null
        that.redraw()
      },
      redraw:function(){
        gfx.clear()
        gfx.background("#FFF8D7");
        sys.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return
          gfx.line(p1, p2, {stroke:"#b2b19d", width:2, alpha:edge.target.data.alpha})
        })
        sys.eachNode(function(node, pt){
          var w = node.data.radius || Math.max(30, 30)
          if (node.data.alpha===0) return
          gfx.oval(pt.x-w/2, pt.y-w/2, w, w, {fill:node.data.color, alpha:node.data.alpha})
          gfx.text(node.data.name, pt.x+50, pt.y, {color:"black", align:"center", font:"Arial", size:12})
          // ctx.fillStyle = (node.data.alone) ? "orange" : "black"
          // ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
          ctx.drawImage(image, pt.x-12, pt.y-12);
        })
        that._drawVignette()
      },
      
      _drawVignette:function(){
        var w = canvas.width
        var h = canvas.height
        var r = 20

        if (!_vignette){
          var top = ctx.createLinearGradient(0,0,0,r)
          top.addColorStop(0, "#e0e0e0")
          top.addColorStop(.7, "rgba(255,255,255,0)")

          var bot = ctx.createLinearGradient(0,h-r,0,h)
          bot.addColorStop(0, "rgba(255,255,255,0)")
          bot.addColorStop(1, "white")

          _vignette = {top:top, bot:bot}
        }
        // // top
        // ctx.fillStyle = _vignette.top
        // ctx.fillRect(0,0, w,r)

        // // bot
        // ctx.fillStyle = _vignette.bot
        // ctx.fillRect(0,h-r, w,r)
      },

      switchMode:function(e){
        if (e.mode=='hidden'){
          dom.stop(true).fadeTo(e.dt,0, function(){
            if (sys) sys.stop()
            $(this).hide()
          })
        }else if (e.mode=='visible'){
          dom.stop(true).css('opacity',0).show().fadeTo(e.dt,1,function(){
            that.resize()
          })
          if (sys) sys.start()
        }
      },
      
      switchSection:function(newSection){
        // var parent = sys.getEdgesFrom(newSection)[0].source
        // var children = $.map(sys.getEdgesFrom(newSection), function(edge){
        //   return edge.target
        // })
        var selected = sys.getNode(newSection)
        var related = []
        $.map(sys.getEdgesFrom(newSection), function(edge){
          related.push (edge.target)
        });
        $.map(sys.getEdgesTo(newSection), function(edge){
          related.push (edge.source)
        });
        related.push(selected);
        sys.eachNode(function(node){
          // if (node.data.shape=='dot') return // skip all but leafnodes
          var nowVisible = ($.inArray(node, related)>=0)
          var newAlpha = (nowVisible) ? 1 : 0
          var dt = (nowVisible) ? .5 : .5
          sys.tweenNode(node, dt, {alpha:newAlpha})

          if (newAlpha==1){
            node.p.x = selected.p.x + .05*Math.random() - .025
            node.p.y = selected.p.y + .05*Math.random() - .025
            node.tempMass = .001
          }
        })
      },
      
      
      _initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var oldmass = 1

        var _section = null

        var handler = {
          moved:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = sys.nearest(_mouseP);

            if (!nearest.node) return false

            if (nearest.node.data.shape!='dot'){
              selected = (nearest.distance < 50) ? nearest : null
              if (selected){
                 dom.addClass('linkable')
                 window.status = selected.node.data.link.replace(/^\//,"http://"+window.location.host+"/").replace(/^#/,'')
              }
              else{
                 dom.removeClass('linkable')
                 window.status = ''
              }
            }else if ($.inArray(nearest.node.name, ['arbor.js','code','docs','demos']) >=0 ){
              if (nearest.node.name!=_section){
                _section = nearest.node.name
                that.switchSection(_section)
              }
              dom.removeClass('linkable')
              window.status = ''
            }
            
            return false
          },
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = dragged = sys.nearest(_mouseP);
            
            // if (nearest && selected && nearest.node===selected.node){
            //   var link = selected.node.data.link
            //   if (link.match(/^#/)){
            //      $(that).trigger({type:"navigate", path:link.substr(1)})
            //   }else{
            //      window.location = link
            //   }
            //   return false
            // }
            if (nearest.node) {
              var _section = nearest.node.name;
              var pos = $(canvas).offset();
              var center = arbor.Point(canvas.width/2+pos.left, canvas.height/2+pos.top);
              var p = sys.fromScreen(center);
              nearest.node.p = p;
              EtrLoadNode(nearest.node, sys);
              that.switchSection(_section);
            }
            
            if (dragged && dragged.node !== null) dragged.node.fixed = true

            // $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (!nearest) return
            if (dragged !== null && dragged.node !== null){
              var p = sys.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null;
            // selected = null
            // $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            // $(canvas).bind('mousemove', handler.moved);
            _mouseP = null
            return false
          }


        }

        $(canvas).mousedown(handler.clicked);
        $(canvas).bind('touchend', handler.clicked);
        // $(canvas).mousemove(handler.moved);
        // $(canvas).clicked()
      }
    }
    
    return that
  }
  
  
  $(document).ready(function(){
    var CLR = {
      branch:"#b2b19d",
      code:"orange",
      doc:"#922E00",
      demo:"#a7af00"
    }

    var theUI = {
      nodes:{"arbor.js":{color:"red", shape:"dot", alpha:1, radius: 30}, 
      
             "demos":{color:CLR.branch, shape:"dot", alpha:1}, 
          

             "docs":{color:CLR.branch, shape:"dot", alpha:1}, 
             

             "code":{color:CLR.branch, shape:"dot", alpha:1},
            },
      edges:{
        "arbor.js":{
          "demos":{length:.8},
          "docs":{length:.8},
          "code":{length:.8}
        }
      }
    }


    var sys = arbor.ParticleSystem()
    sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015})
    sys.renderer = Renderer("#sitemap")
    sys.graft(theUI)
    
  })
})(this.jQuery)