<template>
  <svg class="block" style="min-height: 270px">
    <g :transform='`translate(${30},${30})`'>
      <line
        v-for='(edge, i) in edges'
        :key='i'
        :x1='(edge.from.x - leftMax) * scaling'
        :y1='edge.from.y * scaling'
        :x2='(edge.to.x - leftMax) * scaling'
        :y2='edge.to.y * scaling'
        class="tree-line"
      />
            <g
              v-for='vertex in vertices'
              :key='vertex.name'
            >
              <circle
                :cx='(vertex.x - leftMax) * scaling'
                :cy='vertex.y * scaling'
                :r='circleRadius'
                class="tree-circle"
                :class="{
                  'tree-circle-marked-red': vertex.marked && vertex.marked === 'red',
                  'tree-circle-marked-green': vertex.marked && vertex.marked === 'green'
                }"
              />
              <text
                :x="(vertex.x - leftMax) * scaling"
                :y="vertex.y * scaling + 1"
                class="tree-text"
              >{{ vertex.name }}</text>
            </g>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    leftMax: Number,
    scaling: {
      type: Number,
      default: 40
    },
    circleRadius: {
      type: Number,
      default: 10
    },
    edges: Array,
    vertices: Array
  }
}
</script>
