const fs = require("fs");

const vertices = ["r", "s", "t", "u", "v", "w", "x", "y"];
const adjacencies = [
    ["r", "s"],
    ["r", "v"],
    ["s", "w"],
    ["w", "t"],
    ["w", "x"],
    ["t", "u"],
    ["t", "x"],
    ["x", "y"],
    ["u", "y"],
    ["u", "x"]
];

breathFirstSearch("s", vertices, adjacencies);
depthFirstSearch("s", vertices, adjacencies);
topologicalSort(vertices, adjacencies);

function topologicalSort(vertices, adjacencies) {
    const queue = vertices.slice();
    const output = [];
    let step = 0;
    const attributes = new Map();
    for (let vertex of vertices) {
        attributes.set(vertex, {
            color: "white",
            distance: Infinity,
            predecessor: null,
        });
    }
    for (let edge of adjacencies) {
        attributes.set(edge, { used: false });
    }
    
    while (queue.length > 0) {
        const source = queue[0];
        attributes.get(source).distance = 0;
        depthFirstSearchHelper(source, vertices, adjacencies, attributes);
    }
    
    console.log("output", output);
    return output;
    
    function depthFirstSearchHelper(node, vertices, adjacencies, attributes) {
        attributes.get(node).color = "gray";
        saveVisualDirected(vertices, adjacencies, attributes, "Graph-Topological-Sort-Step-" + String(step++).padStart(2, "0"));
        for (let edge of adjacencies) {
            const idx = edge.indexOf(node);
            if (idx !== -1) {
                attributes.get(edge).used = true;
                const other = edge[idx === 1 ? 0: 1];
                const otherAttrs = attributes.get(other);
                if (otherAttrs.color === "white") {
                    otherAttrs.predecessor = node;
                    otherAttrs.distance = attributes.get(node).distance + 1;
                    otherAttrs.color = "gray";
                    depthFirstSearchHelper(other, vertices, adjacencies, attributes);
                }
            }
        }
        attributes.get(node).color = "black";
        output.unshift(node);
        queue.splice(queue.indexOf(node), 1);
        saveVisualDirected(vertices, adjacencies, attributes, "Graph-Topological-Sort-Step-" + String(step++).padStart(2, "0"));
    }
}

function depthFirstSearch(source, vertices, adjacencies) {
    let step = 0;
    const attributes = new Map();
    for (let vertex of vertices) {
        attributes.set(vertex, {
            color: "white",
            distance: Infinity,
            predecessor: null,
        });
    }
    for (let edge of adjacencies) {
        attributes.set(edge, { used: false });
    }
    
    attributes.get(source).distance = 0;
    depthFirstSearchHelper(source, vertices, adjacencies, attributes);
    
    function depthFirstSearchHelper(node, vertices, adjacencies, attributes) {
        attributes.get(node).color = "gray";
        saveVisual(vertices, adjacencies, attributes, "Graph-DFS-Step-" + String(step++).padStart(2, "0"));
        for (let edge of adjacencies) {
            const idx = edge.indexOf(node);
            if (idx !== -1) {
                attributes.get(edge).used = true;
                const other = edge[idx === 1 ? 0: 1];
                const otherAttrs = attributes.get(other);
                if (otherAttrs.color === "white") {
                    otherAttrs.predecessor = node;
                    otherAttrs.distance = attributes.get(node).distance + 1;
                    otherAttrs.color = "gray";
                    depthFirstSearchHelper(other, vertices, adjacencies, attributes);
                }
            }
        }
        attributes.get(node).color = "black";
        saveVisual(vertices, adjacencies, attributes, "Graph-DFS-Step-" + String(step++).padStart(2, "0"));
    }
}

function breathFirstSearch(source, vertices, adjacencies) {
    const attributes = new Map();
    for (let vertex of vertices) {
        attributes.set(vertex, {
            color: "white",
            distance: Infinity,
            predecessor: null,
        });
    }
    for (let edge of adjacencies) {
        attributes.set(edge, { used: false });
    }
    
    attributes.get(source).distance = 0;
    attributes.get(source).color = "gray";
    
    const queue = [source];
    let step = 0;
    
    let currentNode;
    let parentNode;
    while (true) {
        parentNode = currentNode;
        currentNode = queue.pop();
        if (!currentNode) {
            break;
        }
        
        saveVisual(vertices, adjacencies, attributes, "Graph-State-" + String(step).padStart(2, "0"));
        for (let edge of adjacencies) {
            const idx = edge.indexOf(currentNode);
            if (idx !== -1) {
                attributes.get(edge).used = true;
                const other = edge[idx === 1 ? 0: 1];
                const otherAttrs = attributes.get(other);
                if (otherAttrs.color === "white") {
                    otherAttrs.predecessor = currentNode;
                    otherAttrs.distance = attributes.get(currentNode).distance + 1;
                    otherAttrs.color = "gray";
                    queue.push(other);
                }
            }
        }
        attributes.get(currentNode).color = "black";
        step++;
    }
    saveVisual(vertices, adjacencies, attributes, "Graph-State-" + String(step).padStart(2, "0"));
}

function saveVisual(vertices, adjacencies, attributes, title) {
    const filename = title + ".neato";
    let edgeLines = [];
    let vertexLines = [];
    for (let vertex of vertices) {
        const attrs = attributes.get(vertex);
        const distance = attrs.distance === Infinity ? "∞": attrs.distance;
        const predecessor = attrs.predecessor;
        const fillColor = attrs.color;
        const color = fillColor === "black" ? "white": "black";
        vertexLines.push(`  ${vertex} [style=filled fontcolor="${color}" fillcolor=${fillColor} label="${vertex}(${distance})"];`);
    }
    for (let edge of adjacencies) {
        if (attributes.get(edge).used) {
            edgeLines.push(`  ${edge[0]} -- ${edge[1]} [color="black" style="bold"];`);
        } else {
            edgeLines.push(`  ${edge[0]} -- ${edge[1]} [color="gray"];`);
        }
    }
    const gv = `graph MyGraph {\n  node [shape=circle fontname="Inconsolata" fontsize="16"];` + 
        `\n  edge [len="1.5"];\n` +
        vertexLines.join("\n") + "\n" + edgeLines.join("\n") + "\n}";
    fs.writeFile("visuals/" + filename, gv, () => undefined);
}

function saveVisualDirected(vertices, adjacencies, attributes, title) {
    const filename = title + ".dot";
    let edgeLines = [];
    let vertexLines = [];
    for (let vertex of vertices) {
        const attrs = attributes.get(vertex);
        const distance = attrs.distance === Infinity ? "∞": attrs.distance;
        const predecessor = attrs.predecessor;
        const fillColor = attrs.color;
        const color = fillColor === "black" ? "white": "black";
        vertexLines.push(`  ${vertex} [style=filled fontcolor="${color}" fillcolor=${fillColor} label="${vertex}(${distance})"];`);
    }
    for (let edge of adjacencies) {
        if (attributes.get(edge).used) {
            edgeLines.push(`  ${edge[0]} -> ${edge[1]} [color="black" style="bold"];`);
        } else {
            edgeLines.push(`  ${edge[0]} -> ${edge[1]} [color="gray"];`);
        }
    }
    const gv = `digraph MyGraph {\n  node [shape=circle fontname="Inconsolata" fontsize="16"];` + 
        `\n  edge [len="1.5"];\n` +
        vertexLines.join("\n") + "\n" + edgeLines.join("\n") + "\n}";
    fs.writeFile("visuals/" + filename, gv, () => undefined);
}
