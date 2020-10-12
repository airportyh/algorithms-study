const fs = require("fs");
exports.saveVisual = saveVisual;

function saveVisual(vertices, adjacencies, attributes, title) {
    const filename = title.replace(/ /g, "-") + ".neato";
    let edgeLines = [];
    let vertexLines = [];
    for (let vertex of vertices) {
        const attrs = attributes.get(vertex);
        const distance = attrs.distance === Infinity ? "∞": attrs.distance;
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

exports.saveVisualDirected = saveVisualDirected;
function saveVisualDirected(vertices, adjacencies, attributes, title) {
    const filename = title + ".dot";
    let edgeLines = [];
    let vertexLines = [];
    for (let vertex of vertices) {
        const attrs = attributes.get(vertex);
        const distance = attrs.distance === Infinity ? "∞": attrs.distance;
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
