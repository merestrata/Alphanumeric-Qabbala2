const all = document.getElementById('all');
const themes = document.getElementById('themes');
const graph = document.getElementById('graph');
const options = document.getElementById('options');
const content = document.getElementById('content');
const extra = document.getElementById('extra');
const first = document.getElementById('first');
const extraMargin = document.querySelector('#extra div');
const box = document.getElementById('box');
const list = document.getElementById('list');
const org = document.getElementById('org');
const lists = document.getElementById('lists');
const blocks = document.getElementById('blocks');


all.addEventListener('click', () => {
    all.style.backgroundColor = "#2d2d2d";
    themes.style.backgroundColor = "#000000";
    graph.style.display = "none";
    options.style.display = "block";
    content.style.display = "block";
    extra.style.display = "block";
    first.style.display = "none";
    extraMargin.style.marginTop = "28vh";
    org.style.display = "block";
});

themes.addEventListener('click', () => {
    all.style.backgroundColor = "#000000";
    themes.style.backgroundColor = "#2d2d2d";
    graph.style.display = "block";
    options.style.display = "none";
    content.style.display = "none";
    extra.style.display = "none";
    first.style.display = "block";
    extraMargin.style.marginTop = "18vh";
    org.style.display = "none";
});

first.addEventListener('click', () => {
    graph.style.display = "block";
    options.style.display = "none";
    content.style.display = "none";
    extra.style.display = "none";
    first.style.display = "block";
    extraMargin.style.marginTop = "18vh";
    org.style.display = "none";
});



box.addEventListener('click', () => {
    box.style.backgroundColor = "#4a4a4a";
    list.style.backgroundColor = "#2d2d2d";
    blocks.style.display = "grid";
    lists.style.display = "none";
});

list.addEventListener('click', () => {
    box.style.backgroundColor = "#2d2d2d";
    list.style.backgroundColor = "#4a4a4a";
    blocks.style.display = "none";
    lists.style.display = "block";
});







var nodes1 = [{"id": "Hinduism"}, {"id": "Cristianity"}, {"id": "Bible"}, {"id": "Tech"}, {"id": "Sea"}, {"id": "Crowley"}, {"id": "CCRU"}];

document.addEventListener('DOMContentLoaded', () => {
    Graph(nodes1);
});











function Graph(nodes){
    d3.select("#graph").selectAll("svg").remove();

    var links = [];
    var colorGroups = [];

    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");

    var zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", zoomed);

    svg.call(zoom);

    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 4, height / 4).scale(0.5));

    function zoomed() {
        g.attr("transform", d3.event.transform);
    }

    function customForce(alpha) {
        const centerX = width / 2;
        const centerY = height / 2;
        const strength = 0.05;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node.vx += (centerX - node.x) * strength * alpha;
            node.vy += (centerY - node.y) * strength * alpha;
        }
    }

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => {
            const sourceLinks = links.filter(link => link.source.id === d.source.id || link.target.id === d.source.id).length;
            const targetLinks = links.filter(link => link.source.id === d.target.id || link.target.id === d.target.id).length;
            return Math.min(150, Math.max(50, (sourceLinks + targetLinks) * 10));
        }))
        .force("charge", d3.forceManyBody().strength(-3500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("custom", customForce)
        .force("collision", labelCollision())
        .alphaDecay(0.02)
        .alphaMin(0.001)
        .on("tick", ticked);

    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
            var radius = 200;
            return radius;
        })
        .style("stroke", "#2d2d2d")
        .style("stroke-width", "0.4em")      
        .attr("fill", "#4a4a4a")
        .on("click", function(event, d) {
            options.style.display = "block";
            content.style.display = "block";
            extra.style.display = "block";
            graph.style.display = "none";
            org.style.display = "block";
        })
        .on("mouseover", function(event, d) {
            d3.select(this).raise()
            .transition() 
            .duration(200) 
            .attr("fill", "#2d2d2d")
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
            .transition() 
            .duration(200)
            .attr("fill", "#4a4a4a")
        })

        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var text = g.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(d => d.id);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr("x", d => d.x - 40)
            .attr("y", d => d.y - 150);
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.select(this)
        .transition()
        .duration(200)
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.select(this)
        .transition()
        .duration(200)
        d.fx = null;
        d.fy = null;
    }

    function labelCollision() {
        var alpha = 0.5;
        return function() {
            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    var nodeA = nodes[i];
                    var nodeB = nodes[j];
                    if (nodeA === nodeB) continue;

                    var dx = nodeA.x - nodeB.x;
                    var dy = nodeA.y - nodeB.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    var minDistance = 20;

                    if (distance < minDistance) {
                        var moveFactor = (minDistance - distance) / distance * alpha;
                        var mx = dx * moveFactor;
                        var my = dy * moveFactor;
                        nodeA.x += mx;
                        nodeA.y += my;
                        nodeB.x -= mx;
                        nodeB.y -= my;
                    }
                }
            }
        };
    }
}
