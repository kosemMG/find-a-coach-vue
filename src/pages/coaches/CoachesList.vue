<template>
  <section>
    <coach-filter @change-filter='setFilters'></coach-filter>
  </section>
  <section>
    <base-card>
      <div class='controls'>
        <base-button mode='outline'>Refresh</base-button>
        <base-button v-if='!isCoach' link to='/register'>Register as Coach</base-button>
      </div>
      <ul v-if='hasCoaches'>
        <coach-item v-for='coach in filteredCoaches'
                    :key='coach.id'
                    :id='coach.id'
                    :first-name='coach.firstName'
                    :last-name='coach.lastName'
                    :rate='coach.hourlyRate'
                    :areas='coach.areas'>
        </coach-item>
      </ul>
      <h3 v-else>No coaches found</h3>
    </base-card>
  </section>
</template>

<script>
import CoachItem from '@/components/coaches/CoachItem.vue';
import CoachFilter from '@/components/coaches/CoachFilter.vue';

export default {
  name: 'CoachesList',
  components: { CoachFilter, CoachItem },
  data() {
    return {
      filters: {
        frontend: true,
        backend: true,
        career: true
      }
    };
  },
  computed: {
    filteredCoaches() {
      return this.$store.getters['coaches/coaches'].filter(coach => {
        if (this.filters.frontend && coach.areas.includes('frontend')) return true;
        if (this.filters.backend && coach.areas.includes('backend')) return true;
        if (this.filters.career && coach.areas.includes('career')) return true;
        return false;
      });
    },
    hasCoaches() {
      return this.$store.getters['coaches/hasCoaches'];
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    }
  },
  methods: {
    setFilters(filters) {
      this.filters = filters;
    }
  }
};
</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}
</style>