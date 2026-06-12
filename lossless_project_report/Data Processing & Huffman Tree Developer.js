const readline = require("readline");

// Huffman Tree Node
class Node {
    constructor(ch, freq, left = null, right = null) {
        this.ch = ch;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

// Generate Huffman Codes
function generateCodes(root, code, huffmanCode) {
    if (!root) return;

    if (!root.left && !root.right) {
        huffmanCode[root.ch] = code || "0";
    }

    generateCodes(root.left, code + "0", huffmanCode);
    generateCodes(root.right, code + "1", huffmanCode);
}

// Decode Huffman String
function decode(root, encoded) {
    let decoded = "";

    // Single-character tree case
    if (!root.left && !root.right) {
        for (let i = 0; i < encoded.length; i++) {
            decoded += root.ch;
        }
        return decoded;
    }

    let current = root;

    for (const bit of encoded) {
        current = bit === "0" ? current.left : current.right;

        if (!current.left && !current.right) {
            decoded += current.ch;
            current = root;
        }
    }

    return decoded;
}

// Build Huffman Tree
function buildHuffmanTree(text) {
    const freq = {};

    for (const ch of text) {
        freq[ch] = (freq[ch] || 0) + 1;
    }

    let nodes = [];

    for (const ch in freq) {
        nodes.push(new Node(ch, freq[ch]));
    }

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);

        const left = nodes.shift();
        const right = nodes.shift();

        const parent = new Node(
            null,
            left.freq + right.freq,
            left,
            right
        );

        nodes.push(parent);
    }

    return nodes[0];
}

// User Input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter text: ", (text) => {

    if (!text.length) {
        console.log("Input is empty!");
        rl.close();
        return;
    }

    const root = buildHuffmanTree(text);

    const huffmanCode = {};
    generateCodes(root, "", huffmanCode);

    console.log("\nHuffman Codes:");

    for (const ch in huffmanCode) {
        console.log(`'${ch}' : ${huffmanCode[ch]}`);
    }

    let encoded = "";

    for (const ch of text) {
        encoded += huffmanCode[ch];
    }

    console.log("\nEncoded String:");
    console.log(encoded);

    const decoded = decode(root, encoded);

    console.log("\nDecoded String:");
    console.log(decoded);

    // Compression Statistics
    const originalBits = text.length * 8;
    const compressedBits = encoded.length;

    const compressionRatio =
        (1 - compressedBits / originalBits) * 100;

    console.log("\nCompression Statistics");
    console.log("----------------------");
    console.log("Original Bits   :", originalBits);
    console.log("Compressed Bits :", compressedBits);
    console.log(
        "Compression Ratio:",
        compressionRatio.toFixed(2) + "%"
    );

    rl.close();
});
