<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch/Switch.vue";
import { provide, ref } from "vue";
import { cn } from "@/lib/utils";

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  framework: "",
  isFrameworkRequired: true,
  address: {
    street: "",
    city: "",
  },
});

const isSubmitted = ref(false);
provide("isSubmitted", isSubmitted);

function onSubmit(event: Event) {
  event.preventDefault();
  isSubmitted.value = true;

  const isValid = event.target.checkValidity();

  if (!isValid) {
    const form = new FormData(event.target as HTMLFormElement);

    for (const element of Array.from(form.entries())) {
      const formElement = event.target[element[0] as any];
      if (formElement instanceof HTMLElement) {
        if (formElement.checkValidity() === false) {
          formElement.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        }
      }
    }

    return;
  }
}

function externalAsyncData() {
  return new Promise((resolve, reject) => {
    if (form.userName === "akos") return reject("This username is reserved");
    resolve(true);
  });
}
</script>
<template>
  <Card class="w-[350px] mx-auto">
    <CardHeader>
      <CardTitle>Registration</CardTitle>
      <CardDescription>Register user </CardDescription>
    </CardHeader>
    <form @submit.prevent="onSubmit" novalidate>
      <CardContent>
        <div class="grid items-center w-full gap-4">
          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="first-name"
              name="first-name"
              label="First Name"
              v-model="form.firstName"
              placeholder="First Name"
              required
              pattern="^[\w\s]+$"
              error-message="The first name field is required"
            />
          </section>

          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="last-name"
              name="last-name"
              label="Last Name"
              v-model="form.lastName"
              placeholder="Last Name"
              required
              pattern="^[\w\s]+$"
              error-message="The last name field is required"
            />
          </section>

          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail"
              v-model="form.email"
              placeholder="E-mail"
              required
              error-message="Please enter a valid email"
            />
          </section>

          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="user-name"
              name="user-name"
              label="User Name"
              v-model="form.userName"
              placeholder="User Name"
              required
              error-message="The username field is required"
            />
          </section>

          <section class="flex items-center space-x-2">
            <Switch
              id="framework-required"
              v-model:checked="form.isFrameworkRequired"
            >
            </Switch>
            <Label for="framework-required">Framework Required</Label>
          </section>

          <section class="flex flex-col space-y-1.5 group">
            <Select
              v-model="form.framework"
              :required="form.isFrameworkRequired"
              error-message="Please select Framework"
            >
              <SelectTrigger
                id="framework"
                label="Framework"
                :class="{
                  'group-[:has(:invalid)]:border-red-500 group-[:has(:invalid)]:bg-red-50':
                    isSubmitted,
                }"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="nuxt"> Nuxt.js </SelectItem>
                <SelectItem value="next"> Next.js </SelectItem>
                <SelectItem value="sveltekit"> SvelteKit </SelectItem>
                <SelectItem value="astro"> Astro </SelectItem>
              </SelectContent>
            </Select>
          </section>

          <h2 class="text-md font-bold">Address</h2>
          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="street"
              name="street"
              label="Street"
              v-model="form.address.street"
              required
              placeholder="Street"
              error-message="The street field is required"
            />
          </section>

          <section class="flex flex-col space-y-1.5 group">
            <Input
              id="city"
              name="city"
              label="City"
              v-model="form.address.city"
              placeholder="City"
              required
              error-message="The city field is required"
            />
          </section>
        </div>
      </CardContent>
      <CardFooter class="flex justify-end py-6">
        <!-- <Button @click="onValidate">Register</Button> -->
        <Button type="submit">Register</Button>
      </CardFooter>
    </form>
  </Card>

  <pre>{{ form }}</pre>
</template>
