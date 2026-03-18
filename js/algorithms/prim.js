/*
====================================
PRIM ALGORITHM (STEP GENERATOR)
====================================
*/

export function runPrim(graphManager, startNode) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;


    // duplicated edges handling
    const uniqueEdges = [];
    const seen = new Set();

    edges.forEach(e => {

        const key = e.from < e.to
            ? `${e.from}-${e.to}`
            : `${e.to}-${e.from}`;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueEdges.push(e);
        }
    });

    const steps = [];

    const visited = new Set();
    const mst = [];

    // ========================
    // INIT
    // ========================
    visited.add(startNode);

    steps.push({
        type: "visitNode",
        node: startNode,
        message: `Start at node ${startNode}`
    });

    // ========================
    // MAIN LOOP
    // ========================
    while (visited.size < nodes.length) {

        let candidateEdge = null;
        let minWeight = Infinity;

        // tüm edge’leri gez
        uniqueEdges.forEach(edge => {

            const from = edge.from;
            const to = edge.to;
            const weight = Number(edge.weight);

            // sadece boundary edge (visited → unvisited)
            if (visited.has(from) && !visited.has(to)) {

                steps.push({
                    type: "relaxEdge",
                    edge: edge.id,
                    message: `Checking edge ${from} → ${to} (w=${weight})`
                });

                if (weight < minWeight) {
                    minWeight = weight;
                    candidateEdge = edge;
                }
            }

            // UNDIRECTED support (çok önemli)
            if (visited.has(to) && !visited.has(from)) {

                steps.push({
                    type: "relaxEdge",
                    edge: edge.id,
                    message: `Checking edge ${to} → ${from} (w=${weight})`
                });

                if (weight < minWeight) {
                    minWeight = weight;
                    candidateEdge = {
                        ...edge,
                        from: to,
                        to: from
                    };
                }
            }

        });

        // eğer edge bulunamadıysa graph disconnected
        if (!candidateEdge) {
            steps.push({
                type: "log",
                message: "Graph is not connected!"
            });
            break;
        }

        // edge'i MST'ye ekle
        mst.push(candidateEdge);
        visited.add(candidateEdge.to);

        steps.push({
            type: "highlightPath",
            edge: candidateEdge.id,
            message: `Edge ${candidateEdge.from} → ${candidateEdge.to} added to MST`
        });

        steps.push({
            type: "visitNode",
            node: candidateEdge.to,
            message: `Visit node ${candidateEdge.to}`
        });

    }

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