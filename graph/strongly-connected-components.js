const { saveVisual } = require("./save-visual");

const graph1 = {
    vertices: ["a", "b", "e", "f", "g"],
    adjacencies: [
        ["a", "b"], ["b", "e"], ["e", "a"], ["e", "f"],
        ["f", "g"], ["g", "f"]
    ]
};

const graph2 = {
    vertices: ["a", "b", "c", "d", "e", "f", "g", "h"],
    adjacencies: [
        ["a", "b"], ["b", "e"], ["e", "a"], ["e", "f"],
        ["b", "f"],
        ["f", "g"], ["g", "f"], ["g", "h"],
        ["h", "h"],
        ["b", "c"], ["c", "d"], ["d", "c"],
        ["c", "g"], ["d", "h"]
    ]
};

//findStronglyConnectComponents(graph1);
findStronglyConnectComponents(graph2);

// For directed graphs
function findStronglyConnectComponents(graph) {
    let time = 1;
    let queue = graph.vertices.slice();
    let visited = new Map();
    while (queue.length > 0) {
        const source = queue[0];
        console.log("starting dfs at", source);
        dfs(source, graph, visited, 0);
        queue = queue.filter(n => !visited.has(n));
    }
    
    const graphTransposed = {
        vertices: graph.vertices,
        adjacencies: graph.adjacencies.map(edge => [edge[1], edge[0]])
    };
    queue = graph.vertices.slice();
    queue.sort((n1, n2) => visited.get(n2) - visited.get(n1));
    console.log("second queue");
    for (let node of queue) {
        console.log(node, visited.get(node));
    }
    let allVisited = new Set();
    while (queue.length > 0) {
        const source = queue[0];
        const visited = new Map();
        console.log("starting dfs at", source);
        dfs(source, graphTransposed, visited, 0);
        queue = queue.filter(n => !visited.has(n));
        const component = new Set();
        for (let node of visited.keys()) {
            if (!allVisited.has(node)) {
                component.add(node);
                allVisited.add(node);
            }
        }
        console.log("component:", component);
    }
    
    function dfs(node, graph, visited, level) {
        const indent = Array(level + 1).join("  ");
        if (visited.has(node)) {
            return;
        }
        //console.log(indent, "visited", node);
        visited.set(node, time++);
        for (let edge of graph.adjacencies) {
            if (node === edge[0]) {
                const other = edge[1];
                //console.log(indent, "going from", node, "to", other);
                dfs(other, graph, visited, level + 1);
            }
        }
        visited.set(node, time++);
    }
    
    function mergeMap(map1, map2) {
        return new Map([...map1, ...map2]);
    }
}