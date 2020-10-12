const fs = require("fs");

const graph1 = {
    vertices: ["a", "b", "c"],
    adjacencies: [["a", "b"], ["b", "c"]]
};

const graph2 = {
    vertices: ["a", "b", "c"],
    adjacencies: [["a", "b"], ["b", "c"], ["c", "a"]]
};

const graph2_5 = {
    vertices: ["a", "b", "c", "d"],
    adjacencies: [["a", "b"], ["b", "c"], ["c", "d"], ["d", "a"]]
};

const graph3 = {
    vertices: ["a", "b", "c", "d", "e"],
    adjacencies: [["a", "b"], ["a", "c"], ["b", "c"], ["c", "d"], ["c", "e"], ["d", "e"]]
};

const graph4 = {
    vertices: ["a", "b", "c", "d", "e"],
    adjacencies: [["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"]]
};

const graph5 = {
    vertices: ["a", "b", "c", "d", "e", "f", "g", "h"],
    adjacencies: [
        ["a", "b"], ["b", "c"], ["c", "a"], ["c", "d"],
        ["d", "e"], ["e", "g"], ["g", "f"], ["e", "f"],
        ["f", "h"]
    ],
};

const graph6 = {
    vertices: ["3", "7", "1", "5", "9"],
    adjacencies: [
        ["3", "1"], ["3", "5"], ["9", "7"], ["7", "5"], ["7", "1"]
    ],
};

const graph7 = {
    vertices: ["3", "7", "1", "5", "9"],
    adjacencies: [
        ["3", "1"], ["3", "5"], ["9", "7"], ["7", "5"], ["7", "1"], ["3", "9"]
    ],
};

const graph8 = {
    vertices: ["4", "1", "7", "2"],
    adjacencies: [
        ["4", "2"], ["1", "2"], ["7", "2"]
    ],
};

console.log(findArticulationPoints(graph1, "Graph 1"));
console.log(findArticulationPoints(graph2, "Graph 2"));
console.log(findArticulationPoints(graph2_5, "Graph 2.5"));
console.log(findArticulationPoints(graph3, "Graph 3"));
console.log(findArticulationPoints(graph4, "Graph 4"));
console.log(findArticulationPoints(graph5, "Graph 5"));
console.log(findArticulationPoints(graph6, "Graph 6"));
console.log(findArticulationPoints(graph7, "Graph 7"));
console.log(findArticulationPoints(graph8, "Graph 8"));

// For undirected graphs
function findArticulationPoints(graph, title) {
    const attributes = new Map();
    for (let node of graph.vertices) {
        attributes.set(node, {
            color: "white",
            distance: Infinity,
            time: "?",
            low: "?"
        });
    }
    for (let edge of graph.adjacencies) {
        attributes.set(edge, {
            used: false
        });
    }
    
    saveVisual(graph.vertices, graph.adjacencies, attributes, "Articulation-Point-" + title + "-0");
    let time = 1;
    let queue = graph.vertices.slice();
    const articulationPoints = new Set();
    while (queue.length > 0) {
        let source = queue[0];
        attributes.get(source).distance = 0;
        let visited = new Map();
        dfs(source, visited, 0);
        queue = queue.filter(n => !visited.has(n));
    }
    
    return articulationPoints;
    
    function dfs(node, visited, level) {
        const myTime = time++;
        let myEarliestEncounted = myTime;
        let myDegree = 0;
        attributes.get(node).color = "gray";
        attributes.get(node).time = myTime;
        
        visited.set(node, myTime);
        saveVisual(graph.vertices, graph.adjacencies, attributes, "Articulation-Point-" + title + "-" + time);
        
        for (let edge of graph.adjacencies) {
            const idx = edge.indexOf(node);
            if (idx !== -1) {
                attributes.get(edge).used = true;
                const other = idx === 0 ? edge[1] : edge[0];
                let earliestEncounted;
                if (visited.has(other)) {
                    earliestEncounted = visited.get(other);
                } else {
                    myDegree++;
                    attributes.get(other).distance = attributes.get(node).distance + 1;
                    earliestEncounted = dfs(other, visited, level + 1);
                    if (level > 0 && earliestEncounted >= myTime) {
                        articulationPoints.add(node);
                        attributes.get(node).color = "red";
                        time++;
                        saveVisual(graph.vertices, graph.adjacencies, attributes, "Articulation-Point-" + title + "-" + time);
                    }
                }
                myEarliestEncounted = Math.min(myEarliestEncounted, earliestEncounted);
            }
        }
        attributes.get(node).low = myEarliestEncounted;
        
        if (level === 0) {
            if (myDegree >= 2) {
                //console.log(node, "is an articulation point from case A");
                articulationPoints.add(node);
            }
        }
        if (articulationPoints.has(node)) {
            attributes.get(node).color = "red";
        } else {
            attributes.get(node).color = "black";
        }
        time++;
        saveVisual(graph.vertices, graph.adjacencies, attributes, "Articulation-Point-" + title + "-" + time);
        //console.log(node, "myTime =", myTime, ", myEarliestEncounted =", myEarliestEncounted, "myDegree =", myDegree, ", level =", level);
        return myEarliestEncounted;
    }
}

function saveVisual(vertices, adjacencies, attributes, title) {
    const filename = title.replace(/ /g, "-") + ".neato";
    let edgeLines = [];
    let vertexLines = [];
    for (let vertex of vertices) {
        const attrs = attributes.get(vertex);
        const time = attrs.time;
        const low = attrs.low;
        const fillColor = attrs.color;
        const color = fillColor === "black" ? "white": "black";
        vertexLines.push(`  ${vertex} [style=filled fontcolor="${color}" fillcolor=${fillColor} label="${vertex}(${time},${low})"];`);
    }
    for (let edge of adjacencies) {
        if (attributes.get(edge).used) {
            edgeLines.push(`  ${edge[0]} -- ${edge[1]} [color="black" style="bold"];`);
        } else {
            edgeLines.push(`  ${edge[0]} -- ${edge[1]} [color="gray"];`);
        }
    }
    const gv = `graph MyGraph {\n  node [shape=circle fontname="Inconsolata" fontsize="16"];` + 
        `\n  edge [len="2"];\n` +
        vertexLines.join("\n") + "\n" + edgeLines.join("\n") + "\n}";
    fs.writeFile("visuals/" + filename, gv, () => undefined);
}
