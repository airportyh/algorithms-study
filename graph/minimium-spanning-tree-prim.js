const { MinPriorityQueue } = require("../heap/min-priority-queue");

class Edge {
    constructor(one, other, weight) {
        this._one = one;
        this._other = other;
        this.weight = weight;
    }
    
    contains(vertex) {
        return this._one === vertex || this._other === vertex;
    }
    
    other(vertex) {
        return this._one === vertex ? this._other : this._one;
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
        new Edge("a", "b", 8), 
        new Edge("b", "c", 2),
        new Edge("a", "c", 4),
    ]
};

const graph3 = {
    vertices: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
    adjacencies: [
        new Edge("a", "b", 4),
        new Edge("a", "h", 8),
        new Edge("b", "h", 11),
        new Edge("b", "c", 8),
        new Edge("h", "i", 7),
        new Edge("h", "g", 1),
        new Edge("i", "c", 2),
        new Edge("i", "g", 6),
        new Edge("c", "d", 7),
        new Edge("c", "f", 4),
        new Edge("g", "f", 2),
        new Edge("d", "e", 9),
        new Edge("d", "f", 14),
        new Edge("e", "f", 10),
    ]
};

function findMinimumSpanningTree(graph) {
    const q = new MinPriorityQueue(graph.vertices, v => Infinity);
    const attrs = new Map();
    for (let vertex of graph.vertices) {
        attrs.set(vertex, {
            distance: Infinity,
            parent: null
        });
    }
    const vertices = new Set();
    while (q.size() > 0) {
        const vertex = q.extractMinimum();
        console.log("Considering vertex", vertex);
        vertices.add(vertex);
        for (let edge of graph.adjacencies) {
            const destination = edge.other(vertex);
            if (!vertices.has(destination) && edge.contains(vertex)) {
                if (edge.weight < attrs.get(destination).distance) {
                    attrs.get(destination).distance = edge.weight;
                    attrs.get(destination).parent = vertex;
                    console.log("Better light edge for", destination, "found via", vertex);
                    q.decreaseKey(destination, edge.weight);
                }
            }
        }
    }
    console.log("Vertices:", vertices);
    console.log(attrs);
}

function main() {
    console.log("Graph 1:");
    findMinimumSpanningTree(graph1);
    console.log("Graph 2:");
    findMinimumSpanningTree(graph2);
    console.log("Graph 3:");
    findMinimumSpanningTree(graph3);
}

main();