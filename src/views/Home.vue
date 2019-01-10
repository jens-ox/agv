<template>
  <div>
    <h1>Algorithms for Graph Visualization</h1>
    <article>
      <section>
        <p>
          This page contains the algorithms presented at the <a href="https://i11www.iti.kit.edu/teaching/winter2018/graphvis/index">Lecture on Algorithms for Graph Visualization</a> at the Karlsruhe Institute for Technology in Winter 2018/2019.
        </p>
      </section>
      <section>
        <div class="field">
          <input class="input-main" type="text" placeholder="Search for a thing (algorithm, graph type,...)" v-model="search">
        </div>
        <div
          v-for="algorithm in filteredAlgorithms"
          :key="algorithm.link"
          class="card flex-col md:flex-row"
          @click="$router.push(algorithm.link)"
        >
          <img class="w-32 h-32 block mx-auto" :src="algorithm.image" :alt="algorithm.imageAlt">
          <div class="content">
            <div class="title">{{ algorithm.name }}</div>
            <div class="meta">{{ algorithm.description }}</div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    filteredAlgorithms () {
      if (this.search === '') {
        return this.algorithms
      }

      return this.algorithms.filter(algorithm => {
        return algorithm.searchTerms.some(term => term.includes(this.search.toLowerCase()))
      })
    }
  },
  data () {
    return {
      search: '',
      algorithms: [
        {
          link: '/reingold-tilford',
          name: 'Reingold-Tilford Algorithm',
          description: 'An algorithm for producing compact visualizations of binary trees.',
          image: require('@/assets/img/binary-tree.jpg'),
          imageAlt: 'Binary Tree',
          searchTerms: [
            'binary', 'tree', 'reingold', 'tilford'
          ]
        },
        {
          link: '/hv-layout',
          name: 'Right-Heavy HV Layout Algorithm',
          description: 'An algorithm for producing grid-like visualizations of binary trees.',
          image: require('@/assets/img/hv.jpg'),
          imageAlt: 'HV-Layout of a binary tree',
          searchTerms: [
            'binary', 'tree', 'hv', 'layout', 'right', 'heavy'
          ]
        },
        {
          link: '/radial-layout',
          name: 'Radial Tree Layout Algorithm',
          description: 'An algorithm for producing radial layouts of arbitrary trees (by Pavlo, Homan and Schull).',
          image: require('@/assets/img/radial.jpg'),
          imageAlt: 'Radial Layout of a tree',
          searchTerms: [
            'arbitrary', 'tree', 'radial', 'layout', 'circular', 'pavlo', 'homan', 'schull'
          ]
        }
      ]
    }
  }
}
</script>

<style lang="sass">
h1
  @apply font-normal mb-4

.field
  @apply w-full

.input-main
  @apply w-full bg-grey-lighter p-3 rounded outline-none border-2 border-grey-lighter

  &:focus
    @apply border-indigo bg-white

.card
  @apply flex border-grey border shadow-md p-4 my-4 rounded cursor-pointer

  .content
    @apply px-2

  .title
    @apply font-bold

  .meta
    @apply text-grey-dark
</style>
