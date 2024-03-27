
export class GraphClass {

    constructor() {
        const Graph = ForceGraph();
    }

    static makeGraph() {
        // Random tree
        const N = 300;
        const gData = {
            nodes: [...Array(N).keys()].map(i => ({ id: i })),
            links: [...Array(N).keys()]
                .filter(id => id)
                .map(id => ({
                    source: id,
                    target: Math.round(Math.random() * (id - 1))
                }))
        };

        this.Graph = ForceGraph()
        (document.getElementById('graph'))
        .linkDirectionalParticles(2)
        .graphData(gData);
    }

    static makeGraphFromJson(json) {
        const dataObj = JSON.parse(json);

        if (this.Graph != undefined && this.Graph.graphData()) {
            const { nodes, links } = this.Graph.graphData();

            //NODE CHANGES
            const isSameNode = (a, b) => a.id == b.id && a.val == b.val;
            // Get Nodes that only occur in the left array,
            // using the compareFunction to determine equality.
            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const onlyInA = onlyInLeft(dataObj.nodes, nodes, isSameNode);
            const onlyInB = onlyInLeft(nodes, dataObj.nodes, isSameNode);
            const nodeChange = [...onlyInA, ...onlyInB];

            
            //LINK CHANGES
            const isSameLinkLeft = (a, b) => {
               console.log(JSON.stringify(a), "\n", JSON.stringify(b))
               return a.target == b.target.id && a.source == b.source.id
            };
            const isSameLinkRight = (a, b) => {
                return b.target == a.target.id && b.source == a.source.id
            }

            const onlyInC = onlyInLeft(dataObj.links, links, isSameLinkLeft);
            const onlyInD = onlyInLeft(links, dataObj.links, isSameLinkRight);
            const linkChange = [...onlyInC, ...onlyInD];
            

            this.Graph.graphData({
                nodes: [...nodes, ...nodeChange],
                links: [...links, ...linkChange]
            })

            console.log("___----___---____----___----____");

        }
        else {
            this.Graph = ForceGraph()
                (document.getElementById('graph'))
                .linkDirectionalParticles(2)

                .d3Force('center', null)
                .d3Force('charge', null)

                .graphData(dataObj)
                .nodeId('id')
                .nodeVal('val')
                .nodeLabel('id')
                .nodeAutoColorBy('group')
                .linkSource('source')
                .linkTarget('target')
                .nodeCanvasObjectMode(() => 'after')
                .nodeCanvasObject((node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                })
                
                /*
                .nodePointerAreaPaint((node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                });*/
        }
    }
}

