<template>
  <div>
    <base-dialog @close='handleError' :show='!!error' title='An error occurred'>
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show='isLoading' title='Authenticating...' fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent='submitForm'>
        <div class='form-control' :class='{ invalid: !email.valid }'>
          <label for='email'><span class='red'>*</span>&nbsp;Email</label>
          <input @blur='clearValidity("email")' v-model.trim='email.value' type='email' id='email'>
          <p v-if='!email.valid'>Must be a valid email</p>
        </div>
        <div class='form-control' :class='{ invalid: !password.valid }'>
          <label for='password'><span class='red'>*</span>&nbsp;Password</label>
          <input @blur='clearValidity("password")' v-model.trim='password.value' type='password' id='password'>
          <p v-if='!password.valid'>Password must not be at least 6 characters long</p>
        </div>
        <p class='red' v-if='!formIsValid'>Please enter valid email and password</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button @click='switchAuthMode' mode='flat' type='button'>{{ switchModeButtonCaption }} instead
        </base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  name: 'UserAuth',
  data() {
    return {
      email: { value: '', valid: true },
      password: { value: '', valid: true },
      formIsValid: true,
      mode: 'login',
      isLoading: false,
      error: null
    };
  },
  computed: {
    submitButtonCaption() {
      return this.mode === 'login' ? 'Login' : 'Signup';
    },
    switchModeButtonCaption() {
      return this.mode === 'login' ? 'Signup' : 'Login';
    }
  },
  methods: {
    async submitForm() {
      this.validateForm();
      if (!this.formIsValid) return;

      this.isLoading = true;

      try {
        await this.$store.dispatch(this.mode, {
          email: this.email.value,
          password: this.password.value
        });

        const { redirect } = this.$route.query;
        const redirectUrl = (redirect?.startsWith('/') ? '' : '/') + (redirect || 'coaches');
        await this.$router.replace(redirectUrl);
      } catch (error) {
        this.error = error.message || 'Failed to authenticate.';
      }

      this.isLoading = false;
    },
    validateForm() {
      this.formIsValid = true;
      this.email.valid = this.email.value?.includes('@');
      this.password.valid = this.password.value?.length >= 6;
      this.formIsValid = [this.email, this.password].every(control => control.valid);
    },
    clearValidity(input) {
      const control = this[input];
      control.valid = input === 'email' ? control.value?.includes('@') : control.value?.length >= 6;
    },
    switchAuthMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login';
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.invalid label, .invalid p, .red {
  color: red;
}

.invalid input {
  border: 1px solid red;
}
</style>
