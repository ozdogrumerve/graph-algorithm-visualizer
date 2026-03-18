/*
====================================
KRUSKAL ALGORITHM (STEP GENERATOR)
====================================
*/

export function runKruskal(graphManager) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;

    // duplicate edge problem solved

    const uniqueEdges = [];
    const seen = new Set();

    edges.forEach(e => {

        const key1 = `${e.from}-${e.to}`;
        const key2 = `${e.to}-${e.from}`;

        if (!seen.has(key1) && !seen.has(key2)) {
            seen.add(key1);
            uniqueEdges.push(e);
        }
    });

    const steps = [];

    // ========================
    // INIT
    // ========================
    let mst = [];
    let parent = {};

    nodes.forEach(node => {
        parent[node.id] = node.id;
    });

    // find (union-find)
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    // union
    function union(x, y) {
        parent[find(x)] = find(y);
    }

    // ========================
    // EDGE SORT
    // ========================
    const sortedEdges = [...uniqueEdges].sort(
        (a, b) => Number(a.weight) - Number(b.weight)
    );

    steps.push({
        type: "log",
        message: "Edges sorted by weight"
    });

    // ========================
    // MAIN LOOP
    // ========================
    sortedEdges.forEach(edge => {

        const from = edge.from;
        const to = edge.to;
        const weight = Number(edge.weight);

        steps.push({
            type: "relaxEdge",
            edge: edge.id,
            message: `Checking edge ${from} → ${to} (w=${weight})`
        });

        if (find(from) !== find(to)) {

            union(from, to);
            mst.push(edge);

            steps.push({
                type: "highlightPath",
                edge: edge.id,
                message: `Edge ${from} → ${to} added to MST`
            });

        } else {

            steps.push({
                type: "log",
                message: `Cycle detected! Edge ${from} → ${to} skipped`
            });
        }

    });

    // ========================
    // RESULT
    // ========================
    const totalWeight = mst.reduce((sum, e) => sum + Number(e.weight), 0);

    steps.push({
        type: "log",
        message: `MST completed. Total weight = ${totalWeight}`
    });

    return steps;
}