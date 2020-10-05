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

breathFirstSearch("s", vertices, adjacencies);

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
        
        saveVisual(vertices, adjacencies, attributes, "Graph-BFS-" + String(step).padStart(2, "0"));
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
    saveVisual(vertices, adjacencies, attributes, "Graph-BFS-" + String(step).padStart(2, "0"));
}