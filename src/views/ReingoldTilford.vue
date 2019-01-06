<template>
  <div>
    <h1>Reingold-Tilford Algorithm</h1>
    <p class='description'>
      An algorithm for producing compact visualizations of binary trees.
    </p>
    <article>
      <section>
        <p>
          Tree structures are common for the visualization of stuff, e.g. family trees. But how does one generate a tree from a set of data?
        </p>
        <p>
          We are going to use the <b>Reingold-Tilford Algorithm</b> to produce tree drawings. The Reingold-Tilford Algorithm produces nice visualizations of binary trees &mdash; trees, in which each node has a maximum of two child nodes (one left child node and one right child node). It can be extended to visualize arbitrary trees, but that is not going to be discussed here.
        </p>
        <p>
          So how do we get from a data structure like this to a visualization?
        </p>
        <div class='flex flex-col sm:flex-row flex-1 items-center'>
          <div>
            <pre class="pr-2">
{
  "name": "r",
  "left": {
    "name": "a",
    "left": {
      "name": "b",
      "right": {
        "name": "c",
        "left": { "name": "d" },
        "right": {
          "name": "e",
          "right": { "name": "f" }
        }
      }
    }
  },
  "right": {
    "name": "g",
    "left": {
      "name": "h",
      "left": { "name": "i" },
      "right": { "name": "j" }
    },
    "right": { "name": "k" }
  }
}</pre>
          </div>
          <div class='pl-2'>
            <tree
              :edges="edges"
              :vertices="vertices"
              :leftMax="leftMax"
            />
          </div>
        </div>
        <p class='description text-center'>
          A tree data structure and a corresponding visualization
        </p>
      </section>
      <section>
        <h2>Base Idea</h2>
        <p>
          The algorithm consists of two large steps:
        </p>
        <ol>
          <li>
            <b>Post-Order Traversal</b>. <br>
            In the first step, the <i>offsets</i> and <i>contours</i> are calculated for each node.
          </li>
          <li>
            <b>Pre-Order Traversal.</b> <br>
            In the second step, the offsets and contours are used to compute the final positions of the nodes.
          </li>
        </ol>
        First, let's see how the Post-Order Traversal is implemented (and what a post-order traversal is!).
      </section>
      <section>
        <h2>Implementation &mdash; Post-Order Traversal</h2>

        <p>
          During a post-order traversal, the nodes of the tree are processed in the following order: Left child, Right child, parent. This ordering is implemented through recursion &mdash; that means, that the algorithms starts with the leftmost leaf of the tree and works itself up to the root.
        </p>

        <tree
          class="block mx-auto"
          :edges="edges"
          :vertices="postOrderVertices"
          :leftMax="leftMax"
        />
        <p class='description description-image'>Order in which the nodes are visited during post-order traversal.</p>

        <p>
          First, the <i>offsets</i> of each node are calculated: The x-offset of the root node is 0, the left child receives <span class='mono'>parentOffset - 1</span>, the right child <span class='mono'>parentOffset + 1</span>. Additionally, we store the smallest offset, we are going to need it later to correctly plot the tree.
        </p>
        <p>
          The y-offsets are the depth of the nodes: The root has depth 0, each child receives <span class="mono">parentDepth + 1</span> (some publications also use <span class="mono">parentDepth - 1</span>).
        </p>

        <div class="flex flex-col sm:flex-row flex-1 items-center">
          <div>
            <tree
              :edges="edges"
              :vertices="xOffsetVertices"
              :leftMax="leftMax"
            />
          </div>
          <div>
            <tree
              :edges="edges"
              :vertices="yOffsetVertices"
              :leftMax="leftMax"
            />
          </div>
        </div>
        <p class="description description-image">x-offsets (left) and y-offsets (right) of each node. The smallest x-offset is marked in <span class="text-red">red</span>.</p>

        <p>
          The y-offsets look fine. They can be used as y-coordinates for the nodes. The x-offsets on the other side can not be used as x-coordinates: Note that different nodes on different subtrees currently have the same x-offset.
        </p>

        <tree
          class="block mx-auto"
          :edges="edges"
          :vertices="offsetClashVertices"
          :leftMax="leftMax"
        />
        <p class="description description-image">
          The marked nodes have the same x-offset. We have to make sure that there is a certain margin between them.
        </p>

        <p>
          To fix this, we are using the so-called <b>contours</b> of trees. The <i>left contour</i> of a tree are the nodes of the left subtree that have the largest offset at the specific depth (i.e. the most-right nodes at each level). The <i>right contour</i> of a tree are the nodes of the right subtree that have the smallest offset at the specific depth (i.e. the most-left nodes at each level).
        </p>

        <tree
          class="block mx-auto"
          :edges="edges"
          :vertices="contourVertices"
          :leftMax="leftMax"
        />
        <p class="description description-image">The <span class="text-red">left</span> and <span class="text-green">right</span> contour of the entire tree.</p>

        <p>
          Using the contours, we can now compute the current margin between the subtrees at each level. We only have to look at the levels with nodes on both subtrees (the first three in this example).
        </p>
        <p>
          Here, the margin at the first two levels is 2 (-1 to 1 and -2 to 0). But at the third level, the margin is 0! We want it to be at least 2. In order to achieve that, we take the current margin between the two subtrees, count how many steps we need to reach our desired margin of 2 (here 2), and half it &mdash; each side gets a half. Sometimes, this needs to be rounded up, as we are placing the nodes on a integer grid.
        </p>
        <p>
          Using mathematical notation, this "push" on each side can be computed as
        </p>
        <p class="formula">absolute(ceil((left.xOffset - right.xOffset - 2) / 2)).</p>
        <p>
          Now, we recursively apply this push to the subtrees: adding it to the right subtree's x-offsets and subtracting it from the left subtree's x-offsets.
        </p>

        <div class="flex flex-col sm:flex-row flex-1 items-center">
          <div>
            <tree
              :edges="edges"
              :vertices="xOffsetVertices"
              :leftMax="leftMax"
            />
          </div>
          <div>
            <tree
              :edges="edges"
              :vertices="xOffsetVertices2"
              :leftMax="leftMax"
            />
          </div>
        </div>
        <p class="description description-image">The x-offsets of the nodes before and after the correction. The smallest x-offset needs to be updated, too (in <span class="text-green">green</span>).</p>

        <p>
          Note that the post order-way of doing things also applies here! This contour check is done at each level, beginning at the smallest subtrees (the ones that look a little bit like cheries).
        </p>
        <p>
          As soon as the last contour correction &mdash; the one for the root of the tree &mdash; is finished, the first step of the algorithm is completed.
        </p>
      </section>
      <section>
        <h2>Implementation &mdash; Pre-Order Traversal</h2>
        <p>
          In this step, all we need to to is
        </p>
        <ol>
          <li>Extract all vertices from the tree structure,</li>
          <li>Subtract the previously stored smallest x-offset from all x-offsets (this pushes the vertices to the right, as the smallest x-offset is either negative or 0),</li>
          <li>Compute all edges (which are simply 2-tuples of already computed vertices).</li>
        </ol>
            <pre>
[
  { "name": "r", "x": 0, "y": 0 },
  { "name": "a", "x": -2, "y": 1 },
  { "name": "b", "x": -3, "y": 2 },
  { "name": "c", "x": -2, "y": 3 },
  { "name": "d", "x": -3, "y": 4 },
  { "name": "e", "x": -1, "y": 4 },
  { "name": "f", "x": 0, "y": 5 },
  { "name": "g", "x": 2, "y": 1 },
  { "name": "h", "x": 1, "y": 2 },
  { "name": "i", "x": 0, "y": 3 },
  { "name": "j", "x": 2, "y": 3 },
  { "name": "k", "x": 3, "y": 2 }
]</pre>
        <p class="description description-image">Computed list of vertices.</p>
      </section>
      <section>
        <h2>Complexity</h2>
        <ul>
          <li><b>Time Complexity</b>: In both steps, only a constant number of operations is needed per vertex. Therefore, the time complexity of the Reingold-Tilford Algorithm is <b><span class="serif">O(n)</span></b>.</li>
          <li><b>Needed space</b>: In the worst case, the tree is a diagonal line &mdash; each node having only a right child (except the last node). Therefore, the maximum needed space is <b><span class="serif">O(n<sup>2</sup>)</span></b>.</li>
        </ul>
      </section>
      <section>
        <h2>Code</h2>
        <p>The actual implementation of the algorithm to generate the graphs on this page can be <a href="https://github.com/jens-ox/agv">explored on GitHub</a>.</p>
      </section>
      <section>
        <h2>Optimizations</h2>
        <p>
          The algorithm implemented here is only for educational purposes. If you want to see what this looks like in production, head over to the <a href="https://github.com/d3/d3-hierarchy/blob/master/src/tree.js#L100">implementation in D3.js</a>.
        </p>
        <p>
          I left out some stuff in this post. That includes:
        </p>
        <ul>
          <li>
            <b>Maximize space usage</b>. The trees shown here are scaled using a constant factor. Instead, the available space could be passed to scale the layout to the available dimensions.
          </li>
          <li>
            <b>Support non-binary trees</b>. The "classical" algorithm by Reingold and Tilford only supports binary trees. Walker and Buchheim et al extended the algorithm to support non-binary trees.
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script>
import Tree from '@/components/Tree.vue'

export default {
  components: { Tree },
  methods: {
    serializeTree (tree) {
      // push tree root
      this.vertices.push({
        name: tree.name,
        x: tree.offset,
        y: tree.y
      })

      // push edges to children
      if (tree.left) {
        this.edges.push({
          from: {
            x: tree.offset,
            y: tree.y
          },
          to: {
            x: tree.left.offset,
            y: tree.left.y
          }
        })
        this.serializeTree(tree.left)
      }
      if (tree.right) {
        this.edges.push({
          from: {
            x: tree.offset,
            y: tree.y
          },
          to: {
            x: tree.right.offset,
            y: tree.right.y
          }
        })
        this.serializeTree(tree.right)
      }
    },
    fixDeviation (tree, deviation) {
      tree.offset += deviation
      if (tree.offset < this.leftMax) {
        this.leftMax = tree.offset
      }
      if (tree.left) {
        this.fixDeviation(tree.left, deviation)
      }
      if (tree.right) {
        this.fixDeviation(tree.right, deviation)
      }
    },
    computeDeviation (contour1, contour2) {
      const length = (contour1.length > contour2.length) ? contour2.length : contour1.length
      let margins = []
      for (let i = 0; i < length; i++) {
        margins[i] = Math.abs(contour1[i] - contour2[i])
      }
      const minimum = Math.min(...margins)
      return Math.abs(Math.ceil((minimum - 2) / 2))
    },
    mergeContours (contour1, contour2, isLeftContour) {
      // calculate merged contour for the length of contour1
      let mergedContour = contour1.map((boundary, i) => {
        if (typeof contour2[i] !== 'undefined') {
          return isLeftContour ? Math.min(contour1[i], contour2[i]) : Math.max(contour1[i], contour2[i])
        } else {
          return contour1[i]
        }
      })

      // if contour2 is longer, attach remaining contour2 boundaries
      if (contour2.length > contour1.length) {
        for (let i = contour1.length; i < contour2.length; i++) {
          mergedContour.push(contour2[i])
        }
      }

      return mergedContour
    },
    computeOffsets (tree) {
      // set root offsets
      if (!tree.offset) {
        tree.offset = 0
      }
      if (!tree.y) {
        tree.y = 0
      }

      // set left offsets
      if (tree.left) {
        tree.left.offset = tree.offset - 1
        if (tree.left.offset < this.leftMax) {
          this.leftMax = tree.left.offset
        }
        tree.left.y = tree.y + 1
        this.computeOffsets(tree.left)
      }

      // set right offsets
      if (tree.right) {
        tree.right.offset = tree.offset + 1
        tree.right.y = tree.y + 1
        this.computeOffsets(tree.right)
      }
    },
    computeBoundaries (tree) {
      if (tree.left || tree.right) {
        if (tree.right) {
          const rightContours = this.computeBoundaries(tree.right)
          tree.rightContour = [tree.offset].concat(this.mergeContours(rightContours.left, rightContours.right, false))
          if (!tree.left) {
            tree.leftContour = tree.rightContour
          }
        }
        if (tree.left) {
          const leftContours = this.computeBoundaries(tree.left)
          tree.leftContour = [tree.offset].concat(this.mergeContours(leftContours.left, leftContours.right, true))
          if (!tree.right) {
            tree.rightContour = tree.leftContour
          }
        }
        if (tree.left && tree.right) {
          const deviation = this.computeDeviation(tree.left.rightContour, tree.right.leftContour)
          if (deviation > 0) {
            this.fixDeviation(tree.left, -deviation)
            this.fixDeviation(tree.right, deviation)
          }
        }
      } else {
        // leaves return their offsets as left and right contour
        tree.leftContour = [tree.offset]
        tree.rightContour = [tree.offset]
      }

      return {
        left: tree.leftContour,
        right: tree.rightContour
      }
    }
  },
  beforeMount () {
    this.computeOffsets(this.binaryTree)
    this.computeBoundaries(this.binaryTree)
    this.serializeTree(this.binaryTree)
  },
  data () {
    return {
      leftMax: 0,
      scaling: 40,
      circleRadius: 10,
      vertices: [],
      edges: [],
      binaryTree: {
        name: 'r',
        left: {
          name: 'a',
          left: {
            name: 'b',
            right: {
              name: 'c',
              left: {
                name: 'd'
              },
              right: {
                name: 'e',
                right: {
                  name: 'f'
                }
              }
            }
          }
        },
        right: {
          name: 'g',
          left: {
            name: 'h',
            left: {
              name: 'i'
            },
            right: {
              name: 'j'
            }
          },
          right: {
            name: 'k'
          }
        }
      },
      postOrderVertices: [
        { name: '12', x: 0, y: 0 },
        { name: '6', x: -2, y: 1 },
        { name: '5', x: -3, y: 2 },
        { name: '4', x: -2, y: 3 },
        { name: '1', x: -3, y: 4 },
        { name: '3', x: -1, y: 4 },
        { name: '2', x: 0, y: 5 },
        { name: '11', x: 2, y: 1 },
        { name: '9', x: 1, y: 2 },
        { name: '7', x: 0, y: 3 },
        { name: '8', x: 2, y: 3 },
        { name: '10', x: 3, y: 2 }
      ],
      xOffsetVertices: [
        { name: '0', x: 0, y: 0 },
        { name: '-1', x: -2, y: 1 },
        { name: '-2', x: -3, y: 2, marked: 'red' },
        { name: '-1', x: -2, y: 3 },
        { name: '-2', x: -3, y: 4, marked: 'red' },
        { name: '0', x: -1, y: 4 },
        { name: '1', x: 0, y: 5 },
        { name: '1', x: 2, y: 1 },
        { name: '0', x: 1, y: 2 },
        { name: '-1', x: 0, y: 3 },
        { name: '1', x: 2, y: 3 },
        { name: '2', x: 3, y: 2 }
      ],
      yOffsetVertices: [
        { name: '0', x: 0, y: 0 },
        { name: '1', x: -2, y: 1 },
        { name: '2', x: -3, y: 2 },
        { name: '3', x: -2, y: 3 },
        { name: '4', x: -3, y: 4 },
        { name: '4', x: -1, y: 4 },
        { name: '5', x: 0, y: 5 },
        { name: '1', x: 2, y: 1 },
        { name: '2', x: 1, y: 2 },
        { name: '3', x: 0, y: 3 },
        { name: '3', x: 2, y: 3 },
        { name: '2', x: 3, y: 2 }
      ],
      offsetClashVertices: [
        { name: '0', x: 0, y: 0 },
        { name: '-1', x: -2, y: 1 },
        { name: '-2', x: -3, y: 2 },
        { name: '-1', x: -2, y: 3, marked: 'red' },
        { name: '-2', x: -3, y: 4 },
        { name: '0', x: -1, y: 4 },
        { name: '1', x: 0, y: 5 },
        { name: '1', x: 2, y: 1 },
        { name: '0', x: 1, y: 2 },
        { name: '-1', x: 0, y: 3, marked: 'red' },
        { name: '1', x: 2, y: 3 },
        { name: '2', x: 3, y: 2 }
      ],
      contourVertices: [
        { name: '0', x: 0, y: 0 },
        { name: '-1', x: -2, y: 1, marked: 'red' },
        { name: '-2', x: -3, y: 2, marked: 'red' },
        { name: '-1', x: -2, y: 3, marked: 'red' },
        { name: '-2', x: -3, y: 4 },
        { name: '0', x: -1, y: 4, marked: 'red' },
        { name: '1', x: 0, y: 5, marked: 'red' },
        { name: '1', x: 2, y: 1, marked: 'green' },
        { name: '0', x: 1, y: 2, marked: 'green' },
        { name: '-1', x: 0, y: 3, marked: 'green' },
        { name: '1', x: 2, y: 3 },
        { name: '2', x: 3, y: 2 }
      ],
      xOffsetVertices2: [
        { name: '0', x: 0, y: 0 },
        { name: '-2', x: -2, y: 1 },
        { name: '-3', x: -3, y: 2, marked: 'green' },
        { name: '-2', x: -2, y: 3 },
        { name: '-3', x: -3, y: 4, marked: 'green' },
        { name: '-1', x: -1, y: 4 },
        { name: '0', x: 0, y: 5 },
        { name: '2', x: 2, y: 1 },
        { name: '1', x: 1, y: 2 },
        { name: '0', x: 0, y: 3 },
        { name: '2', x: 2, y: 3 },
        { name: '3', x: 3, y: 2 }
      ]
    }
  }
}
</script>
