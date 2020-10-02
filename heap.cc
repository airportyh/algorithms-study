#include <iostream>
#include <vector>
#include <string>
#include <math.h>

typedef unsigned int heap_index;

heap_index heap_parent(heap_index i) {
    return ((i + 1) / 2) - 1;
}

heap_index heap_left(heap_index i) {
    return (2 * (i + 1)) - 1;
}

heap_index heap_right(heap_index i) {
    return (2 * (i + 1) + 1) - 1;
}

template<class V>
void heap_max_heapify(std::vector<V>& heap, heap_index i) {
    // std::cout << "heap_max_heapify " << std::to_string(i) << std::endl;
    heap_index left = heap_left(i);
    heap_index right = heap_right(i);
    heap_index largest;
    if (left < heap.size() && heap[left] > heap[i]) {
        largest = left;
    } else {
        largest = right;
    }
    if (right < heap.size() && heap[right] > heap[largest]) {
        largest = right;
    }
    /*std::cout << "left = " << std::to_string(left) <<
                 ", right = " << std::to_string(right) <<
                 ", largest = " << std::to_string(largest) <<
                 std::endl;*/
    if (largest < heap.size() && largest != i) {
        /*std::cout << "Performing swap of " << std::to_string(i) << " and " 
            << std::to_string(largest) << std::endl;*/
        auto temp = heap[i];
        heap[i] = heap[largest];
        heap[largest] = temp;
        heap_max_heapify(heap, largest);
    }
}

template<class V>
void heap_build_max_heap(std::vector<V>& heap) {
    for (heap_index i = heap.size() / 2; i != 0; i--) {
        //std::cout << "calling heap_max_heapify " << std::to_string(i) << std::endl;
        heap_max_heapify(heap, i);
    }
    heap_max_heapify(heap, 0);
}

template<class V>
void heap_display(std::vector<V>& heap) {
    for (heap_index i = 0; i < heap.size(); i++) {
        std::cout << heap[i] << " ";
    }
    std::cout << std::endl;
}

template<class V>
void heap_max(std::vector<V>& heap) {
    return heap[0];
}

template<class V>
V heap_extract_max(std::vector<V>& heap) {
    auto max = heap[0];
    heap[0] = heap[heap.size() - 1];
    heap.pop_back();
    heap_max_heapify(heap, 0);
    return max;
}

// In the literature this is called heap_increase_key
template <class V>
void heap_increase_value(std::vector<V>& heap, heap_index i, V value) {
    heap[i] = value;
    while (i > 0 && heap[heap_parent(i)] < heap[i]) {
        auto parent = heap_parent(i);
        auto temp = heap[i];
        heap[i] = heap[parent];
        heap[parent] = temp;
        i = parent;
    }
}

template <class V>
void heap_max_insert(std::vector<V>& heap, V value) {
    heap.push_back(-INFINITY);
    heap_increase_value(heap, heap.size() - 1, value);
}

int main() {
    std::vector<int> my_heap = std::vector<int>();
    my_heap.push_back(1);
    my_heap.push_back(2);
    my_heap.push_back(3);
    my_heap.push_back(4);
    my_heap.push_back(5);
    heap_display(my_heap);
    heap_build_max_heap(my_heap);
    heap_display(my_heap);
    auto max = heap_extract_max(my_heap);
    std::cout << "got max: " << max << std::endl;
    heap_display(my_heap);
    heap_max_insert(my_heap, 6);
    heap_display(my_heap);
}