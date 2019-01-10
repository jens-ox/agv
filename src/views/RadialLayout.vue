<template>
  <div>
    <h1>Radial Tree Layout Algorithm</h1>
    <p class='description'>
      An algorithm for producing radial layouts of arbitrary trees (algorithm by <a class="font-normal" href="https://arxiv.org/abs/cs/0606007">Pavlo, Homan and Schull</a> ).
    </p>
    <article>
      <section>
        <p>
          The <a @click="$router.push('/reingold-tilford')">Reingold-Tilford Algorithm</a> produces visualizations of binary trees in a layered manner. As an alternative to a top-down layout, trees can also be layouted in a radial way. This has the advantage of producing very compact visualizations:
        </p>
        <tree
          class="block mx-auto"
          :edges="edges"
          :vertices="vertices"
          :minX="minX"
          :minY="minY"
          :scaling="5"
          :minHeight="'280'"
          :width="'280'"
          :circleRadius="5"
        >
        <g v-if="showCircles">
          <circle
            class="background-circle"
            :cx="-minX * 5"
            :cy="-minY * 5"
            :r="innerRadius * 5"
          />
          <circle
            class="background-circle"
            v-for="(circle, i) in circles"
            :key="`circle-${i}`"
            :cx="-minX * 5 + circle.cx * 5"
            :cy="-minY * 5 + circle.cy * 5"
            :r="circle.r * 5"
          />
        </g>
        </tree>
        <button class="button my-2" @click="showCircles = !showCircles">Toggle circles</button>
        <p class="description text-center">A radially layouted tree.</p>

        <p>
          Using the algorithm by <a href="https://arxiv.org/abs/cs/0606007">Pavlo, Homan and Schull</a>, we can generate such visualizations &mdash; not only for binary trees, but for arbitrary ones.
        </p>
      </section>
      <section>
        <h2>Idea</h2>

        <p>
          The root of the tree will be at the center. We proceed in the following steps:
        </p>
        <ul>
          <li>We choose a fixed radius <span class="serif">r</span>, e.g. <span class="serif">r = 10</span>.</li>
          <li>We draw an imaginary circle with radius <span class="serif">r</span> around the root.</li>
          <li>We divide the circle around the root in as many same-sized pieces as the root has children (here 5).</li>
          <li>Select a fixed angle <span class="serif">θ &lt; π</span>. This will be the "opening angle" for the children of each child of the root (e.g. the angle between the first and last child of every child-node of the root.</li>
        </ul>

        <p>
          Now, the base for our visualization is finished. The next steps will be executed for each child of the root, recursively.
        </p>
        <ul>
          <li>
            Compute the angle between the child nodes:
            <p class="formula">
              θ' = θ / children.count
            </p>
            For the <span class="serif">i</span>-th child, the angle relative to its parent is therefore
            <p class="formula">
              i * θ' - θ / 2 + θ' / 2.
            </p>
          </li>
          <li>
            We are going to draw another imaginary circle around each child. Those circles should be as large as possible without overlapping (see the circles around the root's children in the visualization above). They can be computed as
            <p class="formula">
              r' = r * sin(θ' / 2),
            </p>
            where <span class="serif">r</span> is the radius of the circle around the actual node. The reasoning behind this is the <a href="https://www.wikiwand.com/de/Gleichschenkliges_Dreieck">formula to compute the lengths in an Isosceles Triangle</a> (<span class="serif">c</span> in the formula list).
          </li>
        </ul>
      </section>
      <section>
        <h2>Serialization</h2>

        <p>
          After computing the polar coordinates for each node like described above, we're going to
        </p>
        <ol>
          <li>set up a minimum x- and y-value,</li>
          <li>traverse the tree and recursively add the parent's angles to their children,</li>
          <li>convert all polar coordinates into cartesian coordinates,</li>
          <li>add up each node's coordinates with its parent coordinates (updating the minimum x- and y-values when necessary),</li>
          <li>push each node to a node list,</li>
          <li>construct the edges and push them to an edge list.</li>
        </ol>
        <p>
          When finished, we have everything we need to construct the visualization.
        </p>

        <tree
          class="block mx-auto"
          :edges="edges"
          :vertices="vertices"
          :minX="minX"
          :minY="minY"
          :scaling="5"
          :minHeight="'280'"
          :width="'280'"
          :circleRadius="5"
        />
      </section>
    </article>
  </div>
</template>

<script>
import Tree from '@/components/Tree.vue'

export default {
  components: { Tree },
  methods: {
    polarToCartesian (polar) {
      return [polar[0] * Math.cos(polar[1]), polar[0] * Math.sin(polar[1])]
    },
    computeRelativeCoordinates (tree) {
      // base case: root
      if (!tree.polar) {
        tree.polar = [0, 0]
        tree.coordinates = [0, 0]

        const angle = 2 * Math.PI / tree.children.length
        const radius = this.innerRadius * Math.sin(angle / 2)

        // compute coordinates for root's children
        for (let i = 0; i < tree.children.length; i++) {
          const polar = [this.innerRadius, 2 * Math.PI * i / tree.children.length]
          tree.children[i] = {
            ...tree.children[i],
            polar,
            coordinates: this.polarToCartesian(polar),
            radius
          }
        }
      } else if (tree.children && tree.children.length > 0) {
        // recursion case: not root

        // compute fractional angle and radius
        const angle = this.childrenOpening / tree.children.length
        const radius = tree.radius * Math.sin(angle / 2)

        for (let i = 0; i < tree.children.length; i++) {
          const childAngle = (i * angle) - (this.childrenOpening / 2) + (angle / 2)
          const polar = [tree.radius, tree.polar[1] + childAngle]
          tree.children[i] = {
            ...tree.children[i],
            polar,
            coordinates: this.polarToCartesian(polar),
            radius
          }
        }
      }

      // recursion
      if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
          this.computeRelativeCoordinates(tree.children[i])
        }
      }
    },

    serializeTree (tree) {
      const vertex = {
        marked: tree.marked,
        x: tree.coordinates[0],
        y: tree.coordinates[1]
      }
      this.vertices.push(vertex)
      if (tree.children) {
        this.circles.push({
          cx: vertex.x,
          cy: vertex.y,
          r: tree.radius
        })
        for (let i = 0; i < tree.children.length; i++) {
          // absolutify coordinates
          tree.children[i].coordinates = [tree.coordinates[0] + tree.children[i].coordinates[0], tree.coordinates[1] + tree.children[i].coordinates[1]]

          // set new bounds if necessary
          if (tree.children[i].coordinates[0] < this.minX) this.minX = tree.children[i].coordinates[0]
          if (tree.children[i].coordinates[1] < this.minY) this.minY = tree.children[i].coordinates[1]

          // push edges
          this.edges.push({
            from: vertex,
            to: {
              x: tree.children[i].coordinates[0],
              y: tree.children[i].coordinates[1]
            }
          })

          // recursion
          this.serializeTree(tree.children[i])
        }
      }
    }
  },
  beforeMount () {
    this.computeRelativeCoordinates(this.tree)
    this.serializeTree(this.tree)
  },
  data () {
    return {
      showCircles: true,
      innerRadius: 15,
      minX: 0,
      minY: 0,
      childrenOpening: 0.75 * Math.PI,
      vertices: [],
      edges: [],
      circles: [],
      tree: {
        marked: 'red',
        children: [
          {},
          {
            children: [{}, {}, {}, {}]
          },
          {
            children: [
              {},
              {
                children: [{}, {}, {}, {}]
              }
            ]
          },
          {
            children: [
              {},
              {
                children: [{}]
              },
              {}
            ]
          },
          {
            children: [{}, {}, {}]
          }
        ]
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.background-circle
  @apply fill-transparent stroke-grey
</style>
