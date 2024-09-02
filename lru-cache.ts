class CacheNode<K, V> {
    public key: K;
    public value: V;
    public next: CacheNode<K, V> | null = null;
    public prev: CacheNode<K, V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

class LruCache<K, V> {
    private static instance: LruCache<any, any>;
    private head: CacheNode<K, V>;
    private tail: CacheNode<K, V>;
    private cacheMap: Map<K, CacheNode<K, V>>;
    private capacity: number;

    private constructor(capacity: number) {
        this.capacity = capacity;
        this.cacheMap = new Map();
        // Dummy head and tail to make adding/removing nodes easier
        this.head = new CacheNode<K, V>(null as any, null as any);
        this.tail = new CacheNode<K, V>(null as any, null as any);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    public static getInstance<K, V>(capacity: number): LruCache<K, V> {
        if (!LruCache.instance) {
            LruCache.instance = new LruCache<K, V>(capacity);
        }
        return LruCache.instance;
    }

    public get(key: K): V | undefined {
        const node = this.cacheMap.get(key);
        if (!node) {
            return undefined; // Key not found
        }

        // Move the accessed node to the head (most recently used)
        this.removeCacheNode(node);
        this.addCacheNode(node);

        return node.value;
    }

    public set(key: K, value: V): void {
        const node = this.cacheMap.get(key);

        if (node) {
            // Update the value
            node.value = value;
            // Move to head as it's now the most recently used
            this.removeCacheNode(node);
            this.addCacheNode(node);
        } else {
            // Create a new node
            const newNode = new CacheNode(key, value);
            // Add the new node to the cache
            this.addCacheNode(newNode);
            this.cacheMap.set(key, newNode);

            // If cache exceeds the capacity, remove the least recently used item
            if (this.cacheMap.size > this.capacity) {
                // The node next to head is the least recently used
                const lruNode = this.head.next;
                if (lruNode) {
                    this.removeCacheNode(lruNode);
                    this.cacheMap.delete(lruNode.key);
                }
            }
        }
    }

    private addCacheNode(node: CacheNode<K, V>): void {
        // Insert node right before the tail
        const prev = this.tail.prev;

        if (prev) {
            prev.next = node;
            node.prev = prev;
            node.next = this.tail;
            this.tail.prev = node;
        }
    }

    private removeCacheNode(node: CacheNode<K, V> | null | undefined): void {
        if (!node) return;

        const prev = node.prev;
        const next = node.next;

        if (prev) prev.next = next;
        if (next) next.prev = prev;
    }
}

// Usage example
const cacheInstance = LruCache.getInstance<string, number>(3); // Create a cache with a capacity of 3

cacheInstance.set("a", 1);
cacheInstance.set("b", 2);
cacheInstance.set("c", 3);

console.log(cacheInstance.get("a")); // Output: 1, as 'a' is accessed, it's moved to the head (most recently used)

cacheInstance.set("d", 4); // This will evict "b" since the cache capacity is 3

console.log(cacheInstance.get("b")); // Output: undefined, as "b" has been evicted
console.log(cacheInstance.get("c")); // Output: 3
console.log(cacheInstance.get("d")); // Output: 4
