/** */
const handleExplosion = (store, module, date) => {
  if (Number.isNaN(new Date(date).getTime())) return;

  const expiration = new Date(date);
  const now = new Date();
  const timeDelta = expiration - now;

  setTimeout(() => {
    store.commit(`${module}/TIME_BOMB_EXPLODE`);
  }, timeDelta || 0);
};

/** */
const plugin = (store) => {
  store.subscribe(({ type, payload }) => {
    const [module, mutation] = type.split('/');
    if (mutation === 'SET_TIME_BOMB' && payload !== null) {
      handleExplosion(store, module, payload);
    }
  });
};

/** */
const getters = () => ({
  timeBombHasExpired (state) {
    if (state.timeBomb === null) return false;
    return new Date().getTime() >= new Date(state.timeBomb).getTime();
  },
});

/** */
const mutations = () => ({
  TIME_BOMB_EXPLODE (state) {
    Object.assign(state, {
      timeBomb: new Date(),
    });
  },
});

/** */
const component = (getter) => ({
  computed: {
    timeBombHasExpired () {
      return this.$store.getters[getter];
    },
  },
  watch: {
    timeBombHasExpired (oldValue) {
      if (oldValue === true) {
        this.handleTimeBomb();
      }
    },
  },
  created () {
    if (this.timeBombHasExpired) {
      this.handleTimeBomb();
    }
  },
  methods: {
    handleTimeBomb () {
      this.$emit('explode');
    },
  },
  render () {
    return this.$slots.default;
  },
});

export default {
  plugin,
  getters,
  mutations,
  component,
};
