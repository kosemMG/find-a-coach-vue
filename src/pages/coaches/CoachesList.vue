<template>
  <div>
    <base-dialog @close='handleError' :show='!!error' title='An error occurred!'>
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter='setFilters'></coach-filter>
    </section>
    <section>
      <base-card>
        <div class='controls'>
          <base-button @click='loadCoaches(true)' mode='outline'>Refresh</base-button>
          <base-button v-if='!isCoach && !isLoading' link to='/register'>Register as Coach</base-button>
        </div>
        <div v-if='isLoading'>
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if='!isLoading && hasCoaches'>
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
  </div>
</template>

<script>
import CoachItem from '@/components/coaches/CoachItem.vue';
import CoachFilter from '@/components/coaches/CoachFilter.vue';

export default {
  name: 'CoachesList',
  components: { CoachFilter, CoachItem },
  data() {
    return {
      isLoading: false,
      error: null,
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
  created() {
    this.loadCoaches();
  },
  methods: {
    handleError() {
      this.error = null;
    },
    setFilters(filters) {
      this.filters = filters;
    },
    async loadCoaches(forceRefresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', { forceRefresh });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
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
