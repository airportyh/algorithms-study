const { MinPriorityQueue } = require("../heap/min-priority-queue");

class Edge {
    constructor(source, destination, weight) {
        this.source = source;
        this.destination = destination;
        this.weight = weight;
    }
}

const graph1 = {
    vertices: ["a", "b", "c"],
    adjacencies: [
        new Edge("a", "b", 1), 
        new Edge("b", "c", 2),
        new Edge("a", "c", 4),
    ]
};

const graph2 = {
    vertices: ["a", "b", "c"],
    adjacencies: [
        new Edge("a", "b", 3), 
        new Edge("b", "c", 2),
        new Edge("a", "c", 4),
    ]
};

const graph3 = {
    vertices: ["a", "b", "c", "d", "f"],
    adjacencies: [
        new Edge("a", "b", 19),
        new Edge("b", "d", 7),
        new Edge("a", "d", 6),
        new Edge("d", "f", 7),
        new Edge("c", "b", 1),
        new Edge("c", "f", 3),
        new Edge("f", "c", 4),
    ]
};

function main() {
    console.log("Graph 1");
    findShortestPaths(graph1, "a");
    console.log("Graph 2");
    findShortestPaths(graph2, "a");
    console.log("Graph 3");
    findShortestPaths(graph3, "a");
}

function findShortestPaths(graph, source) {
    const q = new MinPriorityQueue(graph.vertices, v => source === v ? 0 : Infinity);
    const attrs = new Map();
    for (let vertex of graph.vertices) {
        attrs.set(vertex, {
            distance: Infinity,
            predecessor: null
        });
    }
    attrs.get(source).distance = 0;
    while (q.size() > 0) {
        const vertex = q.extractMinimum();
        //console.log("Considering", vertex);
        for (let edge of graph.adjacencies) {
            if (edge.source === vertex) {
                // relax
                const altDistance = attrs.get(vertex).distance + edge.weight;
                if (altDistance < attrs.get(edge.destination).distance) {
                    attrs.get(edge.destination).distance = altDistance;
                    attrs.get(edge.destination).predecessor = vertex;
                    //console.log("New best distance to reach", edge.destination, "(via", vertex, ") =", altDistance);
                    q.decreaseKey(edge.destination, altDistance);
                }
            }
        }
    }
    
    console.log("From", source + ":");
    for (let entry of attrs.entries()) {
        const [vertex, vAttrs] = entry;
        console.log("  Shortest path to", vertex + ":", getPathEndingAt(vertex, attrs).join(" -> "));
        console.log("    with distance:", vAttrs.distance);
    }
    
    function getPathEndingAt(vertex, attrs) {
        const pred = attrs.get(vertex).predecessor;
        if (pred) {
            return [...getPathEndingAt(pred, attrs), vertex];
        } else {
            return [vertex];
        }
    }
}

main();