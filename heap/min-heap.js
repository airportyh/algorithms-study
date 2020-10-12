
exports.parent = parent;

function parent(i) {
    return Math.floor(((i + 1) / 2) - 1);
}

exports.left = left;

function left(i) {
    return (2 * (i + 1)) - 1;
}

exports.right = right;

function right(i) {
    return (2 * (i + 1) + 1) - 1;
}

exports.minHeapify = minHeapify;

function minHeapify(heap, i) {
    let l = left(i);
    let r = right(i);
    let smallest = i;
    if (l < heap.length && heap[l] < heap[smallest]) {
        smallest = l;
    } 
    if (r < heap.length && heap[r] < heap[smallest]) {
        smallest = r;
    }
    
    //console.log("i=", i, "l=", l, "r=", r, "smallest=", smallest);
    
    if (smallest < heap.length && smallest !== i) {
        //console.log("swapping", i, "and", smallest);
        let temp = heap[i];
        heap[i] = heap[smallest];
        heap[smallest] = temp;
        minHeapify(heap, smallest);
    }
}

exports.buildMinHeap = buildMinHeap;
function buildMinHeap(heap) {
    for (let i = Math.floor(heap.length / 2); i >= 0; i--) {
        //console.log("calling minHeapify on", i);
        minHeapify(heap, i);
    }
}

exports.min = min;
function min(heap) {
    return heap[0];
}

exports.extractMin = extractMin;
function extractMin(heap) {
    let max = heap[0];
    let last = heap.pop();
    if (heap.length > 0) {
        heap[0] = last;    
        minHeapify(heap, 0);
    }
    return max;
}

exports.decreaseKey = decreaseKey;
function decreaseKey(heap, i, newKey) {
    heap[i] = newKey;
    while (i > 0 && heap[parent(i)] > heap[i]) {
        let p = parent(i);
        let temp = heap[i];
        heap[i] = heap[p];
        heap[p] = temp;
        i = p;
    }
}

exports.minInsert = minInsert;
function minInsert(heap, key) {
    heap.push(-Infinity);
    decreaseKey(heap, heap.length - 1, key);
}

function main() {
    let myHeap = [5, 4, 3, 2, 1];
    console.log(myHeap);
    buildMinHeap(myHeap);
    console.log(myHeap);
    let min = extractMin(myHeap);
    console.log("Got min:", min);
    console.log(myHeap);
    minInsert(myHeap, 2.5);
    console.log(myHeap);
}

//main();
    



