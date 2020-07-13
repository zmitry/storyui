class TrieNode {
  parent: TrieNode;
  children: Map<string, TrieNode>;
  end: boolean;
  constructor(public key: string, public value?: any) {
    this.children = new Map();
  }
}

// we implement Trie with just a simple root with null value.
export class Trie<T = any> {
  root: TrieNode;
  constructor(m?: Map<string, T>) {
    this.root = new TrieNode(null);

    for (let [key, value] of m.entries()) {
      this.insert(key, value);
    }
  }

  // inserts a word into the trie.
  // time complexity: O(k), k = word length
  insert(word, value) {
    let node = this.root; // we start at the root 😬

    // for every character in the word
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== "/" && i !== word.length - 1) {
        continue;
      }

      if (i === word.length - 1) {
        i += 1;
      }
      let sub = word.substr(0, i);

      if (!node.children.has(sub)) {
        // check to see if character node exists in children.
        // if it doesn't exist, we then create it.
        node.children.set(sub, new TrieNode(sub));

        // we also assign the parent to the child node.
        node.children.get(sub).parent = node;
      }
      // proceed to the next depth in the trie.
      node = node.children.get(sub);

      // finally, we check to see if it's the last word.
      if (i === word.length - 1) {
        // if it is, we set the end flag to true.
        node.value = value;
      }
    }
    node.end = true;
    node.value = value;
  }

  // check if it contains a whole word.
  // time complexity: O(k), k = word length
  contains(word) {
    let node = this.root;

    // for every character in the word
    for (let i = 0; i < word.length; i++) {
      // check to see if character node exists in children.
      if (node.children.has(word[i])) {
        // if it exists, proceed to the next depth of the trie.
        node = node.children.get(word[i]);
      } else {
        // doesn't exist, return false since it's not a valid word.
        return false;
      }
    }

    // we finished going through all the words, but is it a whole word?
    return node.end;
  }

  // returns every word with given prefix
  // time complexity: O(p + n), p = prefix length, n = number of child paths
  find(prefix) {
    let node = this.root;
    // for every character in the prefix
    for (let i = 0; i <= prefix.length; i++) {
      if (prefix[i] !== "/" && i !== prefix.length - 1) {
        continue;
      }

      let sub = prefix.substring(0, i + 1).replace(/\/$/, "");
      // make sure prefix actually has words
      if (node.children.has(sub)) {
        node = node.children.get(sub);
      } else {
        // there's none. just return it.
        return [];
      }
    }
    const output = [];

    if (node.end) {
      output.push(node);
    }
    dfsInternal(node, (value) => {
      if (value.end) {
        output.push(value);
      }
    });
    return output;
  }
}

type FN = (node: TrieNode, d: number, parentKey?: string) => void;
export function dfs(root: Trie, fn: FN) {
  dfsInternal(root.root, fn);
}
function dfsInternal(root: TrieNode, fn: FN, depth = 0) {
  for (let [, v] of root.children) {
    let n = v;
    // find first node with more than 1 children
    while (n.children.size === 1 && !n.end) {
      for (let [, chv] of n.children) {
        n = chv;
      }
    }
    // pass original but not direct parent to iterator function
    fn(n, depth, v.parent?.key);
    dfsInternal(n, fn, depth + 1);
  }
}
