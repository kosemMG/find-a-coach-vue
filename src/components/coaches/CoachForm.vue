<template>
  <form @submit.prevent='submitForm'>
    <div class='form-control' :class='{ invalid: !firstName.valid }'>
      <label for='firstname'><span class='red'>*</span>&nbsp;Firstname</label>
      <input type='text' id='firstname' v-model.trim='firstName.value' @blur="clearValidity('firstName')">
      <p v-if='!firstName.valid'>Firstname must not be empty</p>
    </div>
    <div class='form-control' :class='{ invalid: !lastName.valid }'>
      <label for='lastname'><span class='red'>*</span>&nbsp;Lastname</label>
      <input type='text' id='lastname' v-model.trim='lastName.value' @blur="clearValidity('lastName')">
      <p v-if='!lastName.valid'>Lastname must not be empty</p>
    </div>
    <div class='form-control' :class='{ invalid: !description.valid }'>
      <label for='description'><span class='red'>*</span>&nbsp;Description</label>
      <textarea id='description' rows='5' v-model.trim='description.value' @blur="clearValidity('description')"></textarea>
      <p v-if='!description.valid'>Description must not be empty</p>
    </div>
    <div class='form-control' :class='{ invalid: !rate.valid }'>
      <label for='rate'><span class='red'>*</span>&nbsp;Hourly Rate</label>
      <input type='number' id='rate' v-model.number='rate.value' @blur="clearValidity('rate')">
      <p v-if='!rate.valid'>Rate must not be greater than 0</p>
    </div>
    <div class='form-control' :class='{ invalid: !areas.valid }'>
      <h3><span class='red'>*</span>&nbsp;Areas of Expertise</h3>
      <div>
        <input type='checkbox' id='frontend' value='frontend' v-model='areas.value' @change="clearValidity('areas')">
        <label for='frontend'>Frontend Development</label>
      </div>
      <div>
        <input type='checkbox' id='backend' value='backend' v-model='areas.value' @change="clearValidity('areas')">
        <label for='backend'>Backend Development</label>
      </div>
      <div>
        <input type='checkbox' id='career' value='career' v-model='areas.value' @change="clearValidity('areas')">
        <label for='career'>Career Advisory</label>
      </div>
      <p v-if='!areas.valid'>At least one expertise must be selected</p>
    </div>
    <p class='red' v-if='!formIsValid'>Please fix the errors and submit again</p>
    <base-button>Register</base-button>
  </form>
</template>

<script>
export default {
  name: 'CoachForm',
  emits: ['save-data'],
  data() {
    return {
      firstName: { value: '', valid: true },
      lastName: { value: '', valid: true },
      description: { value: '', valid: true },
      rate: { value: null, valid: true },
      areas: { value: [], valid: true },
      formIsValid: true
    }
  },
  methods: {
    submitForm() {
      this.validateForm();
      if (!this.formIsValid) return;

      const formData = {
        first: this.firstName.value,
        last: this.lastName.value,
        desc: this.description.value,
        rate: this.rate.value,
        areas: this.areas.value
      };
      this.$emit('save-data', formData);
    },
    validateForm() {
      this.formIsValid = true;

      this.firstName.valid = !!this.firstName.value;
      this.lastName.valid = !!this.lastName.value;
      this.description.valid = !!this.description.value;
      this.rate.valid = this.rate.value > 0;
      this.areas.valid = !!this.areas.value.length;

      this.formIsValid = [this.firstName, this.lastName, this.description, this.rate, this.areas]
        .every(control => control.valid);
    },
    clearValidity(input) {
      const control = this[input];
      control.valid = typeof control.value === 'string' && !!control.value ||
        typeof control.value === 'number' && control.value > 0 ||
        Array.isArray(control.value) && control.value.length;
    }
  }
};
</script>

<style scoped>
.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
    font-weight: normal;
    display: inline;
    margin: 0 0 0 0.5rem;
}

input,
textarea {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
}

input:focus,
textarea:focus {
    background-color: #f0e6fd;
    outline: none;
    border-color: #3d008d;
}

input[type='checkbox'] {
    display: inline;
    width: auto;
    border: none;
}

input[type='checkbox']:focus {
    outline: #3d008d solid 1px;
}

h3 {
    margin: 0.5rem 0;
    font-size: 1rem;
}

.invalid label, .invalid p, .red {
    color: red;
}

.invalid input,
.invalid textarea {
    border: 1px solid red;
}
</style>
