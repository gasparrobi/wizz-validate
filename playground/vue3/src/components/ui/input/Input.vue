<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";
import { inject } from "vue";
import { Label } from "@/components/ui/label";

const isSubmitted = inject("isSubmitted");

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  errorMessage?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div>
    <Label
      :for="$attrs.id"
      :class="
        cn('group-[:has(:user-invalid)]:text-red-500', {
          'group-[:has(:invalid)]:text-red-500': isSubmitted,
        })
      "
      >{{ $attrs.label }}</Label
    >
    <input
      v-model="modelValue"
      v-bind="$attrs"
      :class="
        cn(
          'flex h-10 w-full rounded-md border peer border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          '[&:user-invalid]:border-red-500 [&:user-invalid]:bg-red-50',
          `${
            isSubmitted && '[&:invalid]:border-red-500 [&:invalid]:bg-red-50'
          }`,
          props.class
        )
      "
    />
    <div
      :class="
        cn(
          'text-red-500 text-xs leading-7 hidden peer-[:user-invalid]:block',
          `${isSubmitted && ' peer-[:invalid]:block'}`
        )
      "
    >
      {{ props.errorMessage }}
    </div>
  </div>
</template>
