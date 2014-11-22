function drawGraph(json) {

    // establish width and height of the svg
    var width = 500,
        height = 500;

    // color established as a scale
    var color = d3.scale.category10();

    // appends svg tag to graph-result div
    var svg = d3.select(".graph-result").append("svg")
        .attr("width", width)
        .attr("height", height);

    // this function handles the parameters of the force-directed layout
    var force = d3.layout.force()
        .gravity(0.05)
        .distance(function(d) {
          if (d.value == 1) {
            return 150;
          } else { return 80; }
        })
        .charge(-200)
        .size([width, height]);

    // this calls the function force on the nodes and links
    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var defs = svg.append("defs")
        .attr("id", "imgdefs");

    // this appends the marker tag to the svg tag, applies arrowhead attributes
    defs.selectAll("marker")
        .data(["arrow"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 23)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-4L10,0L0,4Z");


    // append attributes for each link in the json
    var link = svg.selectAll(".link")
        .data(json.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#666")
        // .style("opacity", 0.5)
        .attr("marker-end", "url(#arrow)");

    // select subset of g that are nodes
    var node = svg.selectAll("g.node")
          .data(json.nodes)
        .enter().append("svg:g")
          .attr("class", "node")
          .call(force.drag);

    // select subset of nodes that are in the path
    var pathNodes = node.filter(function(d) {
        return d.group == "path";
    });

    var pathLinks = link.filter(function(d) {
        return d.value == 1;
    });
    console.log(pathLinks);

    // iterate through queryImages, write a unique pattern for each (e.g. 'id0')
    Object.keys(queryImages).forEach(function(img) {
        img = queryImages[img];
        console.log(img);
          defs.append("pattern")
              .attr("id", 'img'+img['id'].toString())
              .attr("height", 1)
              .attr("width", 1)
              .attr("x", "0")
              .attr("y", "0")
            .append("image")
              .attr("height", img['height'])
              .attr("width", img['width'])
              .attr("xlink:href", img['url']);
    });

  // <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  //   <clipPath id="clipCircle">
  //     <circle r="50" cx="50" cy="50"/>
  //   </clipPath>
  //   <rect width="100" height="100" clip-path="url(#clipCircle)"/>
  // </svg>

    pathLinks
        .style("stroke-width", "3px");

    node.append("circle")
        .attr("r", 12)
        .style("fill", function(d) { return color(d.type); });

    pathNodes.append("circle")
        .attr("r", 35)
        .style("fill", "#333");

    pathNodes.append("circle")
        .attr("r", 35)
        .style("fill", function(d) {
            var x = 'img'+queryImages[d.name]['id'];
            return "url(#"+x+")";
        });

    // pathNodes.append("text")
    //     .text(function(d) {
    //         return d.name;
    //     })
    //     .attr("y", 60)
    //     .attr("text-anchor", "middle");

    // this appends a mouseover text field to each node with name and type
    node.append("title")
        .text(function(d) {
            return d.name + " (" + d.id + "), " + d.type;
        });

    function tick() {
        node.attr("cx", function(d) { return d.x = Math.max(15, Math.min(width - 15, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(15, Math.min(height - 15, d.y)); });

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        }
    
    // for each tick, the distance between each pair of linked nodes is computed,
    // the links move to converge on the desired distance
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
}