const fs = require("fs");

exports.saveVisual = function saveVisual(data, name, filename) {
    let gv = genGraphviz(data, name);
    fs.writeFile(filename, gv, () => undefined);
};

exports.genGraphviz = genGraphviz;
function genGraphviz(data, name) {
    const context = { nextNodeId: 1, idMap: new Map() };
    return [
        `digraph ${name} {`,
        `  node [shape=none fontname=Inconsolata style=invisible];`,
        `  rankdir=LR;`,
        ...genGraphvizForData(data, context).lines,
        "}"
    ].join("\n");
};

function genGraphvizForData(data, context) {
    if (data === null) {
        return {
            id: null,
            display: "null",
            lines: []
        };
    } else if (context.idMap.has(data)) {
        return {
            id: context.idMap.get(data),
            display: null,
            lines: []
        };
    } else if (Array.isArray(data)) {
        return genGraphvisForArray(data, context);
    } else if (data instanceof Map) {
        return genGraphvisForMap(data, context);
    } else if (typeof data === "object") {
        return genGraphvisForObject(data, context);
    } else {
        // number, string, boolean, null, undefined
        const display = String(data === undefined ? "undefined" : JSON.stringify(data));
        return {
            id: null,
            display: display,
            lines: []
        };
    }
}

function genGraphvisForArray(data, context) {
    const id = String(context.nextNodeId++);
    context.idMap.set(data, id);
    if (data.length === 0) {
        return {
            id,
            display: null,
            lines: [`  ${id} [label=<<table cellspacing="0" border="0" cellborder="1"><tr><td>(Empty array)</td></tr></table>>];`]
        };
    }
    let childLines = [];
    let linkLines = [];
    let tags = `<<table cellspacing="0" border="0" cellborder="1"><tr>`;
    for (let i = 0; i < data.length; i++) {
        const value = data[i];
        const result = genGraphvizForData(value, context);
        childLines.push(...result.lines);
        if (result.id) {
            const portId = String(context.nextNodeId++);
            tags += `<td port="${portId}"> <sub><font color="#666666">${i}</font></sub></td>`;
            linkLines.push(`  ${id}:${portId} -> ${result.id};`);
        } else {
            tags += `<td>${result.display}<sub><font color="#666666">${i}</font></sub></td>`;
        }
    }
    tags += `</tr></table>>`;
    return {
        id: id,
        display: null,
        lines: [`  ${id} [label=${tags}];`, ...childLines, ...linkLines]
    };
}

function genGraphvisForObject(data, context) {
    const id = String(context.nextNodeId++);
    context.idMap.set(data, id);
    let childLines = [];
    let linkLines = [];
    let tags = '<<table cellspacing="0" border="0" cellborder="1">';
    let typeName = data.constructor.name;
    tags += `<tr><td colspan="2">${typeName}</td></tr>`;
    for (let key in data) {
        const value = data[key];
        const result = genGraphvizForData(value, context);
        childLines.push(...result.lines);
        if (result.id) {
            const portId = String(context.nextNodeId++);
            linkLines.push(`  ${id}:${portId} -> ${result.id};`);
            tags += `<tr><td>${key}</td><td port="${portId}"></td></tr>`;
        } else {
            tags += `<tr><td>${key}</td><td>${result.display}</td></tr>`;
        }
    }
    tags += `</table>>`;
    return {
        id: id,
        display: null,
        lines: [`  ${id} [label=${tags}];`, ...childLines, ...linkLines]
    };
}

function genGraphvisForMap(data, context) {
    const id = String(context.nextNodeId++);
    context.idMap.set(data, id);
    let childLines = [];
    let linkLines = [];
    let tags = '<<table cellspacing="0" border="0" cellborder="1">';
    let typeName = data.constructor.name;
    tags += `<tr><td colspan="2">${typeName}</td></tr>`;
    for (let entry of data.entries()) {
        const [key, value] = entry;
        const keyResult = genGraphvizForData(key, context);
        childLines.push(...keyResult.lines);
        if (keyResult.id) {
            const portId = String(context.nextNodeId++);
            linkLines.push(`  ${id}:${portId} -> ${keyResult.id};`);
            tags += `<tr><td port="${portId}"> </td>`;
        } else {
            tags += `<tr><td>${keyResult.display}</td>`;
        }
        const valueResult = genGraphvizForData(value, context);
        childLines.push(...valueResult.lines);
        if (valueResult.id) {
            const portId = String(context.nextNodeId++);
            linkLines.push(`  ${id}:${portId} -> ${valueResult.id};`);
            tags += `<td port="${portId}"></td> </tr>`;
        } else {
            tags += `<td>${valueResult.display}</td></tr>`;
        }
    }
    tags += `</table>>`;
    return {
        id: id,
        display: null,
        lines: [`  ${id} [label=${tags}];`, ...childLines, ...linkLines]
    };
}

function escape(str) {
    return str.replace(/"/g, '\\"');
}
