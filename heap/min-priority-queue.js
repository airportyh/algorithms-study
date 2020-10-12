const { saveVisual } = require("../lib/gen-vis");

class MinPriorityQueue {
    // Public:
    
    constructor(elements, getInitialKey) {
        this.heap = elements.slice();
        this.initIndexMap();
        this.initKeyMap(getInitialKey);
        this.buildHeap();
    }
    
    getMinimum() {
        return this.heap[0];
    }
    
    extractMinimum() {
        let max = this.heap[0];
        this.indexMap.delete(max);
        this.keyMap.delete(max);
        if (this.heap.length === 1) {
            this.heap = [];
            this.indexMap.delete(max);
            return max;
        } else {
            let last = this.heap.pop();
            this.heap[0] = last;
            this.heapify(0);
        }
        return max;
    }
    
    decreaseKey(element, newKey) {
        const oldKey = this.getKey(element);
        if (newKey > oldKey) {
            throw new Error("New key to decreaseKey must be less or equal to the old key.");
        }
        this.keyMap.set(element, newKey);
        let i = this.indexMap.get(element);
        //console.log("i=", i, "parent=", this.parent(i));
        while (
            i > 0 && 
            (
                this.getKey(this.heap[this.parent(i)]) > 
                this.getKey(this.heap[i])
            )) {
            let p = this.parent(i);
            let temp = this.heap[i];
            this.heap[i] = this.heap[p];
            this.indexMap.set(this.heap[i], i);
            this.heap[p] = temp;
            this.indexMap.set(this.heap[p], p);
            i = p;
        }
    }
    
    insertElement(element) {
        this.indexMap.set(element, this.heap.length);
        this.updateElement(element);
    }
    
    size() {
        return this.heap.length;
    }
    
    // Private:
    
    initIndexMap() {
        this.indexMap = new Map();
        for (let i = 0; i < this.heap.length; i++) {
            this.indexMap.set(this.heap[i], i);
        }
    }
    
    initKeyMap(getInitialKey) {
        this.keyMap = new Map();
        for (let i = 0; i < this.heap.length; i++) {
            this.keyMap.set(this.heap[i], getInitialKey(this.heap[i]));
        }
    }
    
    getKey(element) {
        return this.keyMap.get(element);
    }
    
    buildHeap() {
        for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
            this.heapify(i);
        }
    }
    
    heapify(i) {
        let l = this.left(i);
        let r = this.right(i);
        let smallest = i;
        if (l < this.heap.length && 
            this.getKey(this.heap[l]) < 
            this.getKey(this.heap[smallest])) {
            smallest = l;
        }
        if (r < this.heap.length && 
            this.getKey(this.heap[r]) < 
            this.getKey(this.heap[smallest])) {
            smallest = r;
        }
        
        if (smallest < this.heap.length && smallest !== i) {
            //console.log("swapping", i, "and", smallest);
            let temp = this.heap[i];
            this.heap[i] = this.heap[smallest];
            this.indexMap.set(this.heap[i], i);
            this.heap[smallest] = temp;
            this.indexMap.set(this.heap[smallest], smallest);
            this.heapify(smallest);
        }
    }
    
    parent(i) {
        return Math.floor(((i + 1) / 2) - 1);
    }

    left(i) {
        return (2 * (i + 1)) - 1;
    }

    right(i) {
        return (2 * (i + 1) + 1) - 1;
    }
    
}

exports.MinPriorityQueue = MinPriorityQueue;

function main() {
    const elements = [
        { name: "A", distance: 5 },
        { name: "B", distance: 4 },
        { name: "C", distance: 3 },
        { name: "D", distance: 2 },
        { name: "E", distance: 1 },
    ];
    const q = new MinPriorityQueue(elements, e => e.distance);
    //saveVisual(q, "MinPriorityQueueBegin", "MinPriorityQueue-Begin.gv");
    console.log(q);
    elements[0].distance = 1.5;
    q.decreaseKey(elements[0], 1.5);
    console.log(q);
}