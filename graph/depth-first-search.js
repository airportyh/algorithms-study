const { saveVisual } = require("./save-visual");

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

depthFirstSearch("s", vertices, adjacencies);

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