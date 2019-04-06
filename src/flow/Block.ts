
class Block {
    uuid?: string;
    name?: string; // word-characters only
    label?: string; // optional
    semantic_label?: string; // optional
    type?: string;
    config?: object;
    exits?: Exit[];
}
