import { ref, watch, toValue, type MaybeRefOrGetter } from "vue";
import { groupBy, get, toPath, head } from "lodash-es";
import type { ZodTypeAny, ZodIssue } from "zod";

export type ScrollOptions = {
  rootElement?: HTMLElement;
  offset?: number;
};

export function useValidation<T extends MaybeRefOrGetter<ZodTypeAny>>(
  schema: T,
  data: MaybeRefOrGetter<Record<string, unknown>>,
  options?: { mode: "eager" | "lazy" }
) {
  const _options = Object.assign({}, { mode: "lazy" }, options);

  let unwatch: null | (() => void) = null;

  const isValid = ref(false);
  const errors = ref<Record<string, ZodIssue[]> | null>(null);

  watch(
    () => toValue(schema),
    async () => {
      if (unwatch === null) return;
      await validate();
    },
    { deep: true }
  );

  function validationWatch() {
    if (unwatch !== null) return;

    unwatch = watch(
      () => toValue(data),
      async () => {
        await validate();
      },
      { deep: true }
    );
  }

  async function validate() {
    clearErrors();
    const result = await toValue(schema).safeParseAsync(toValue(data));

    isValid.value = result.success;

    if (!result.success) {
      errors.value = groupBy(result.error.issues, "path");
      validationWatch();
    }

    return result.success;
  }

  function clearErrors() {
    errors.value = null;
  }

  function getErrorMessage(errorPath: string) {
    return get(errors.value, [toPath(errorPath).join(","), 0, "message"]);
  }

  function hasError(errorPath: string) {
    const errorObject = get(errors.value, toPath(errorPath).join(","));
    return Boolean(errorObject);
  }

  function externalErrors(key: string, message: unknown) {
    errors.value = { ...errors.value, [key]: [{ message }] } as Record<
      string,
      ZodIssue[]
    >;
  }

  function scrollToFirstError(options: ScrollOptions = {}) {
    const { rootElement = document, offset = 0 } = options;
    const firstError: string | undefined = head(
      Object.keys(errors.value || {})
    );
    if (!firstError) return;

    const element = rootElement.querySelector(
      `[data-wv-name="${convertPath(firstError)}"]`
    );
    if (!element) return;
    const topOffset =
      element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset;

    window.scrollTo({
      behavior: "smooth",
      top: topOffset,
    });
  }

  if (_options.mode === "eager") {
    validationWatch();
  }

  return {
    errors,
    isValid,
    validate,
    hasError,
    clearErrors,
    externalErrors,
    getErrorMessage,
    scrollToFirstError,
  };
}

function convertPath(path: string) {
  return path.replace(",", "-");
}
