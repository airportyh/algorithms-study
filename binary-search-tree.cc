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

template<class K, class V>
struct BSTNode {
    K key;
    V value;
    BSTNode<K, V> *left;
    BSTNode<K, V> *right;
    BSTNode<K, V> *parent;
};

template<class K, class V>
BSTNode<K, V> *tree_search(BSTNode<K, V> *tree, K key) {
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
BSTNode<K, V> *tree_insert(BSTNode<K, V> *tree, BSTNode<K, V> *newNode) {
    BSTNode<K, V> *parentNode = NULL;
    BSTNode<K, V> *x = tree;
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
        return newNode;
    } else if (newNode->key < parentNode->key) {
        parentNode->left = newNode;
        return tree;
    } else {
        parentNode->right = newNode;
        return tree;
    }
}

template<class K, class V>
BSTNode<K, V> *tree_minimum(BSTNode<K, V> *tree) {
    if (tree == NULL) {
        return NULL;
    }
    while (tree->left != NULL) {
        tree = tree->left;
    }
    return tree;
}

template<class K, class V>
BSTNode<K, V> *tree_successor(BSTNode<K, V> *x) {
    if (x->right != NULL) {
        return tree_minimum(x->right);
    }
    BSTNode<K, V> *y = x->parent;
    while (y != NULL && x == y->right) {
        x = y;
        y = y->parent;
    }
    return y;
}

struct GraphVisWriterContext {
    int nextNullId;
};

void _write_to_gv(BSTNode<int, std::string> *tree, GraphVisWriterContext &context, std::ofstream &file) {
    if (tree == NULL) {
        return;
    }
    file << "  " << tree->key << " [label=\"" << tree->key << "|" << tree->value << "\"];" << std::endl;
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
    _write_to_gv(tree->left, context, file);
    _write_to_gv(tree->right, context, file);
}

void write_to_gv(BSTNode<int, std::string> *tree, std::string title) {
    std::ofstream file;
    std::string filename = title + ".gv";
    GraphVisWriterContext context;
    context.nextNullId = 1;
    file.open("visuals/" + filename);
    file << "digraph " << title << " {" << std::endl;
    file << "  node [shape=record];" << std::endl;
    _write_to_gv(tree, context, file);
    file << "}" << std::endl;
    file.close();
    std::cout << "Wrote " << filename << std::endl;
    std::string command = "dot -Tpng visuals/" + filename + " -o visuals/" + title + ".png";
    std::cout << command << std::endl;
    exec(command.c_str());
}

void inorder_insert() {
    BSTNode<int, std::string> *root = NULL;
    std::string names[] = {
        "Hafu",
        "xQc",
        "Forsen",
        "QTCinderalla",
        "Ludwig",
        "Hikaru",
        "Alex Botez",
        "Andrea Botez",
        "Anna Rudolph",
        "Levy",
        "Nemo",
        "Agadmator",
        "Carvana",
        "Magnus",
        "MVL"
    };
    
    write_to_gv(root, "In_Order_Insert_Tree_00");
    
    for (int i = 1; i <= 10; i++) {
        auto newNode = new BSTNode<int, std::string>();
        newNode->key = i;
        newNode->value = names[rand() % 15];
        newNode->left = NULL;
        newNode->right = NULL;
        root = tree_insert(root, newNode);
        write_to_gv(root, "In_Order_Insert_Tree" + std::to_string(i));
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
    BSTNode<int, std::string> *root = NULL;
    std::string names[] = {
        "Hafu",
        "xQc",
        "Forsen",
        "QTCinderalla",
        "Ludwig",
        "Hikaru",
        "Alex Botez",
        "Andrea Botez",
        "Anna Rudolph",
        "Levy",
        "Nemo",
        "Agadmator",
        "Carvana",
        "Magnus",
        "MVL"
    };
    
    write_to_gv(root, "Random_Order_Insert_Tree_00");
    
    int ids[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    for (int i = 0; i <= 10; i++) {
        int idx1 = rand() % 10;
        int idx2 = rand() % 10;
        int temp = ids[idx1];
        ids[idx1] = ids[idx2];
        ids[idx2] = temp;
    }
    
    for (int i = 0; i < 10; i++) {
        auto newNode = new BSTNode<int, std::string>();
        newNode->key = ids[i];
        newNode->value = names[rand() % 15];
        newNode->left = NULL;
        newNode->right = NULL;
        root = tree_insert(root, newNode);
        write_to_gv(root, "Random_Order_Insert_Tree_" + std::to_string(i));
    }
}

int main() {
    srand((unsigned) time(0));
    random_order_insert();
    inorder_insert();
}