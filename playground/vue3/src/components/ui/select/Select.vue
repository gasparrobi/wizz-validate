<script setup lang="ts">
import { inject } from "vue";
import type { SelectRootEmits, SelectRootProps } from "radix-vue";
import { SelectRoot, useForwardPropsEmits } from "radix-vue";

const props = defineProps<SelectRootProps & { errorMessage?: string }>();
const emits = defineEmits<SelectRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
const isSubmitted = inject("isSubmitted");
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <slot />
    <div
      :class="[
        'hidden',
        { 'group-[:has(:invalid)]:block text-red-500 text-xs': isSubmitted },
      ]"
    >
      {{ props.errorMessage }}
    </div>
  </SelectRoot>
</template>
