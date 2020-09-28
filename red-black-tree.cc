#include <iostream>
#include <memory>
#include <fstream>
#include <cstdio>
#include <stdexcept>
#include <string>
#include <array>
#include <vector>
#include <stdlib.h>
#include <ctime>
#include "exec.h"

enum RBTColor { Red, Black };

template<class K, class V>
struct RBTNode {
    K key;
    V value;
    RBTColor color;
    RBTNode<K, V> *left;
    RBTNode<K, V> *right;
    RBTNode<K, V> *parent;
    
    RBTNode(K _key, V _value) {
        key = _key;
        value = _value;
        left = NULL;
        right = NULL;
        parent = NULL;
        color = Red;
    }
};

template<class K, class V>
RBTNode<K, V> *tree_search(RBTNode<K, V> *tree, K key) {
    if (tree == NULL or key == tree->key) {
        return tree;
    }
    if (key < tree->key) {
        return tree_search(tree->left, key);
    } else {
        return tree_search(tree->right, key);
    }
}

template<class K, class V>
RBTNode<K, V> *right_rotate(RBTNode<K, V> *tree, RBTNode<K, V> *x) {
    RBTNode<K, V> *y = x->left;
    x->left = y->right;
    if (y->right != NULL) {
        y->right->parent = x;
    }
    y->parent = x->parent;
    if (x->parent == NULL) {
        tree = y;
    } else if (x == x->parent->right) {
        x->parent->right = y;
    } else {
        x->parent->left = y;
    }
    y->right = x;
    x->parent = y;
    return tree;
}

template<class K, class V>
RBTNode<K, V> *left_rotate(RBTNode<K, V> *tree, RBTNode<K, V> *x) {
    RBTNode<K, V> *y = x->right;
    x->right = y->left;
    if (y->left != NULL) {
        y->left->parent = x;
    }
    y->parent = x->parent;
    if (x->parent == NULL) {
        tree = y;
    } else if (x == x->parent->left) {
        x->parent->left = y;
    } else {
        x->parent->right = y;
    }
    y->left = x;
    x->parent = y;
    return tree;
}

template<class K, class V>
RBTNode<K, V> *tree_insert_fixup(RBTNode<K, V> *tree, RBTNode<K, V> *z, std::string label) {
    RBTNode<K, V> *y = NULL;
    int fixId = 1;
    while (z && z->parent && z->parent->parent && z->parent->color == Red) {
        if (z->parent == z->parent->parent->left) {
            y = z->parent->parent->right;
            if (y && y->color == Red) {
                z->parent->color = Black;
                y->color = Black;
                z->parent->parent->color = Red;
                write_to_gv(tree, label + "_" + std::to_string(fixId++) + "_recolor");
                z = z->parent->parent;
            } else {
                std::string sub_label = "";
                if (z == z->parent->right) {
                    z = z->parent;
                    std::string my_label = label + "_" + std::to_string(fixId++) + "_left_rotate_" + std::to_string(z->key) + "_" + z->value;
                    tree = left_rotate(tree, z);
                    write_to_gv(tree, my_label);
                }
                z->parent->color = Black;
                z->parent->parent->color = Red;
                std::string my_label = label + "_" + std::to_string(fixId++) + "_right_rotate_" + std::to_string(z->parent->parent->key) + "_" + z->parent->parent->value;
                tree = right_rotate(tree, z->parent->parent);
                write_to_gv(tree, my_label);
            }
        } else if (z->parent == z->parent->parent->right) {
            y = z->parent->parent->left;
            if (y && y->color == Red) {
                z->parent->color = Black;
                y->color = Black;
                z->parent->parent->color = Red;
                write_to_gv(tree, label + "_" + std::to_string(fixId++) + "_recolor");
                z = z->parent->parent;
            } else {
                if (z == z->parent->left) {
                    z = z->parent;
                    std::string my_label = label + "_" + std::to_string(fixId++) + "_right_rotate_" + std::to_string(z->key) + "_" + z->value;
                    tree = right_rotate(tree, z);
                    write_to_gv(tree, my_label);
                }
                z->parent->color = Black;
                z->parent->parent->color = Red;
                std::string my_label = label + "_" + std::to_string(fixId++) + "_left_rotate_" + std::to_string(z->parent->parent->key) + "_" + z->parent->parent->value;
                tree = left_rotate(tree, z->parent->parent);
                write_to_gv(tree, my_label);
            }
        }
    }
    tree->color = Black;
    write_to_gv(tree, label + "_" + std::to_string(fixId) + "_final");
    return tree;
}

template<class K, class V>
RBTNode<K, V> *tree_insert(RBTNode<K, V> *tree, RBTNode<K, V> *newNode, std::string label) {
    RBTNode<K, V> *parentNode = NULL;
    RBTNode<K, V> *x = tree;
    while (x != NULL) {
        parentNode = x;
        if (newNode->key < x->key) {
            x = x->left;
        } else {
            x = x->right;
        }
    }
    newNode->parent = parentNode;
    if (parentNode == NULL) {
        tree = newNode;
    } else if (newNode->key < parentNode->key) {
        parentNode->left = newNode;
    } else {
        parentNode->right = newNode;
    }
    newNode->left = NULL;
    newNode->right = NULL;
    newNode->color = Red;
    write_to_gv(tree, label + "_0_before_fixup");
    tree = tree_insert_fixup(tree, newNode, label);
    return tree;
}

template<class K, class V>
RBTNode<K, V> *tree_minimum(RBTNode<K, V> *tree) {
    if (tree == NULL) {
        return NULL;
    }
    while (tree->left != NULL) {
        tree = tree->left;
    }
    return tree;
}

template<class K, class V>
RBTNode<K, V> *tree_successor(RBTNode<K, V> *x) {
    if (x->right != NULL) {
        return tree_minimum(x->right);
    }
    RBTNode<K, V> *y = x->parent;
    while (y != NULL && x == y->right) {
        x = y;
        y = y->parent;
    }
    return y;
}

struct GraphVisWriterContext {
    int nextNullId;
};

void _write_to_gv(RBTNode<int, std::string> *tree, GraphVisWriterContext &context, std::ofstream &file) {
    if (tree == NULL) {
        return;
    }
    file << "  " << tree->key << " [";
    file << "fillcolor=\"" << (tree->color == Red ? "red" : "black") << "\" ";
    file << "label=\"" << tree->key << "|" << tree->value << "\" ";
    file << "];" << std::endl;
    if (tree->left != NULL) {
        file << "  " << tree->key << " -> " << tree->left->key << ";" << std::endl;
    } else {
        int nullId = context.nextNullId++;
        file << "  null" << nullId << " [shape=point];" << std::endl;
        file << "  " << tree->key << " -> null" << nullId << std::endl;
    }
    if (tree->right != NULL) {
        file << "  " << tree->key << " -> " << tree->right->key << ";" << std::endl;
    } else {
        int nullId = context.nextNullId++;
        file << "  null" << nullId << " [shape=point];" << std::endl;
        file << "  " << tree->key << " -> null" << nullId << std::endl;
    }
    /*if (tree->parent != NULL) {
        file << "  " << tree->key << " -> " << tree->parent->key << ";" << std::endl;
    }*/
    _write_to_gv(tree->left, context, file);
    _write_to_gv(tree->right, context, file);
}

void write_to_gv(RBTNode<int, std::string> *tree, std::string title) {
    std::ofstream file;
    std::string filename = title + ".gv";
    GraphVisWriterContext context;
    context.nextNullId = 1;
    file.open("visuals/" + filename);
    file << "digraph " << title << " {" << std::endl;
    file << "  node [shape=record style=filled fontcolor=white fontname=Helvetica color=white];" << std::endl;
    _write_to_gv(tree, context, file);
    file << "}" << std::endl;
    file.close();
    std::cout << "Wrote " << filename << std::endl;
    std::string command = "dot -Tpng visuals/" + filename + " -o visuals/" + title + ".png";
    std::cout << command << std::endl;
    exec(command.c_str());
}

void inorder_insert() {
    RBTNode<int, std::string> *root = NULL;
    std::string names[] = {
        "Hafu",
        "xQc",
        "Forsen",
        "QTCinderalla",
        "Ludwig",
        "Hikaru",
        "Alex",
        "Andrea",
        "Anna",
        "Levy",
        "Nemo",
        "Agadmator",
        "Carvana",
        "Magnus",
        "MVL"
    };
    
    write_to_gv(root, "In_Order_Insert_RBTree_0_Initial");
    
    for (int i = 0; i < 15; i++) {
        auto id = i + 1;
        auto newNode = new RBTNode<int, std::string>(id, names[i]);
        auto my_label = "In_Order_Insert_RBTree_" + std::to_string(id) + "_" + newNode->value;
        root = tree_insert(root, newNode, my_label);
    }
}

/*
http://www.cplusplus.com/reference/algorithm/shuffle/
void shuffle (RandomAccessIterator first, RandomAccessIterator last, URNG&& g)
{
    for (auto i=(last-first)-1; i>0; --i) {
      std::uniform_int_distribution<decltype(i)> d(0,i);
      swap (first[i], first[d(g)]);
    }
}
*/

void random_order_insert() {
    RBTNode<int, std::string> *root = NULL;
    std::string names[] = {
        "Hafu",
        "xQc",
        "Forsen",
        "QTCinderalla",
        "Ludwig",
        "Hikaru",
        "Alex",
        "Andrea",
        "Anna",
        "Levy",
        "Nemo",
        "Agadmator",
        "Carvana",
        "Magnus",
        "MVL"
    };
    
    write_to_gv(root, "Random_Order_Insert_RBTree_00");
    
    int ids[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    for (int i = 0; i <= 20; i++) {
        int idx1 = rand() % 10;
        int idx2 = rand() % 10;
        int temp = ids[idx1];
        ids[idx1] = ids[idx2];
        ids[idx2] = temp;
    }
    
    for (int i = 0; i < 10; i++) {
        auto newNode = new RBTNode<int, std::string>(ids[i], names[rand() % 15]);
        std::string label = "Random_Order_Insert_RBTree_" + std::to_string(i);
        root = tree_insert(root, newNode, label);
    }
}

void test_left_rotate() {
    auto a = new RBTNode<int, std::string>(1, "a");
    auto b = new RBTNode<int, std::string>(2, "b");
    auto c = new RBTNode<int, std::string>(3, "c");
    auto d = new RBTNode<int, std::string>(4, "d");
    auto e = new RBTNode<int, std::string>(5, "e");
    write_to_gv(a, "Rotate_Left_Test_0");
    auto newRoot = left_rotate(a, a);
    write_to_gv(newRoot, "Rotate_Left_Test_1");
}

void test_insert() {
    auto a = new RBTNode<int, std::string>(1, "Bobby");
    auto b = new RBTNode<int, std::string>(2, "Kelly");
    auto c = new RBTNode<int, std::string>(3, "Pratik");
    auto d = new RBTNode<int, std::string>(4, "Sunay");
    auto e = new RBTNode<int, std::string>(5, "Hunter");
    write_to_gv(a, "Test_Insert_0");
    a = tree_insert(a, b, "Test_Insert_1");
    a = tree_insert(a, c, "Test_Insert_2");
    a = tree_insert(a, d, "Test_Insert_3");
    a = tree_insert(a, e, "Test_Insert_4");
}

int main() {
    srand((unsigned) time(0));
    random_order_insert();
    //inorder_insert();
    //test_left_rotate();
    //test_insert();
}