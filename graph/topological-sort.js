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

//breathFirstSearch("s", vertices, adjacencies);
//depthFirstSearch("s", vertices, adjacencies);
topologicalSort(vertices, adjacencies);

// interprets edges as one-way instead of two-way
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
        depthFirstSearchHelper(source, vertices, adjacencies, attributes, 0);
    }
    
    //console.log("output", output);
    return output;
    
    function depthFirstSearchHelper(node, vertices, adjacencies, attributes, level) {
        const indent = Array(level + 1).join("  ");
        attributes.get(node).color = "gray";
        saveVisualTopological(vertices, adjacencies, attributes, output, "Graph-Topological-Sort-Step-" + String(step++).padStart(2, "0"));
        for (let edge of adjacencies) {
            if (edge[0] === node) {
                attributes.get(edge).used = true;
                const other = edge[1];
                const otherAttrs = attributes.get(other);
                if (otherAttrs.color === "white") {
                    otherAttrs.predecessor = node;
                    otherAttrs.distance = attributes.get(node).distance + 1;
                    otherAttrs.color = "gray";
                    depthFirstSearchHelper(other, vertices, adjacencies, attributes, level + 1);
                }
            }
        }
        attributes.get(node).color = "black";
        output.unshift(node);
        queue.splice(queue.indexOf(node), 1);
        saveVisualTopological(vertices, adjacencies, attributes, output, "Graph-Topological-Sort-Step-" + String(step++).padStart(2, "0"));
    }
    
    function saveVisualTopological(vertices, adjacencies, attributes, output, title) {
        const filename = title + ".dot";
        let edgeLines = [];
        let vertexLines = [];
        if (output.length > 1) {
            vertexLines.push("  " + output.map(v => "_" + v).join(" -> ") + ";");
        }
        for (let vertex of output) {
            vertexLines.push(`  _${vertex} [label="${vertex}"];`);
            vertexLines.push(`{ rank=same; _${vertex}; ${vertex}; }`);
        }
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
}