<template>
  <svg class="block" :width="width" :height="height">
    <g :transform='`translate(${30},${30})`'>
      <slot />
      <line
        v-for='(edge, i) in edges'
        :key='i'
        :x1='(edge.from.x - minX) * scaling'
        :y1='(edge.from.y - minY) * scaling'
        :x2='(edge.to.x - minX) * scaling'
        :y2='(edge.to.y - minY) * scaling'
        class="tree-line"
      />
      <g
        v-for='vertex in vertices'
        :key='vertex.name'
      >
        <circle
          :cx='(vertex.x - minX) * scaling'
          :cy='(vertex.y - minY) * scaling'
          :r='circleRadius'
          class="tree-circle"
          :class="{
            'tree-circle-marked-red': vertex.marked && vertex.marked === 'red',
            'tree-circle-marked-green': vertex.marked && vertex.marked === 'green'
          }"
        />
        <text
          :x="(vertex.x - minX) * scaling"
          :y="(vertex.y - minY) * scaling + 1"
          class="tree-text"
        >{{ vertex.name }}</text>
      </g>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    minX: {
      type: Number,
      default: 0
    },
    minY: {
      type: Number,
      default: 0
    },
    scaling: {
      type: Number,
      default: 40
    },
    circleRadius: {
      type: Number,
      default: 10
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: 280
    },
    edges: Array,
    vertices: Array
  }
}
</script>
