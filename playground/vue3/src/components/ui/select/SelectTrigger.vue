<script setup lang="ts">
import { type HTMLAttributes, computed, useAttrs, inject } from "vue";
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from "radix-vue";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes["class"]; label?: string }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const attrs = useAttrs();
const isSubmitted = inject("isSubmitted");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <Label
    :for="attrs.id"
    :class="{ 'group-[:has(:invalid)]:text-red-500': isSubmitted }"
    >{{ label }}</Label
  >
  <SelectTrigger
    :id="attrs.id"
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="w-4 h-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
