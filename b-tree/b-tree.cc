#include <map>
#include <vector>
#include <string>

#define MINIMUM_DEGREE = 2;
typedef unsigned int key;
typedef unsigned int page_id;

template<class V>
struct BTNode {
    page_id id;
    bool isLeaf;
    std::vector<key> keys;
    std::vector<V> values;
    std::vector<unsigned int> children;
};

template<class V>
struct Pager {
    page_id next_id;
    std::map<unsigned int, struct BTNode<V> *> pages;
};

template<class V>
BTNode<V> *pager_disk_read(unsigned int page_id, struct Pager<V> *pager) {
    // TODO
}

template<class V>
void pager_disk_write(struct BTNode<V> *node, struct Pager<V> *pager) {
    auto value = node->values[0];
    value.serialize();
}

template<class V>
page_id pager_assign_id(struct Pager<V> * pager) {
    return pager->next_id++;
}

template<class V>
struct BTNode<V> *btree_create(struct Pager<V> *pager) {
    auto node = new BTNode<V>();
    node->id = pager_assign_id(pager);
    node->isLeaf = true;
    node->keys = std::vector<key>();
    node->values = std::vector<V>();
    node->children = std::vector<unsigned int>();
    pager_disk_write(node, pager);
    return node;
}

template<class V>
V *btree_search(struct BTNode<V> *node, key key) {
    unsigned int i = 0;
    while (i <= node->keys.size() && key > node->keys[i]) {
        i++;
    }
    if (i <= node->keys.size() && key == node->keys[i]) {
        return &node->values[i];
    } else if (node->isLeaf) {
        return NULL;
    } else {
        struct BTNode<V> *child_node = pager_disk_read<V>(node->children[i]);
        return btree_search(child_node, key);
    }
}

template<class V>
void btree_split_child(struct BTNode<V> *node, unsigned int index) {
    auto new_node = new BTNode<V>();
//    y = 
}

int main() {
    auto pager = new Pager<std::string>();
    auto root = btree_create<std::string>(pager);
}