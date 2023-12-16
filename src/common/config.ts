import { InjectionKey, onMounted, reactive, UnwrapNestedRefs, watch } from "vue";

export type Theme = "light" | "dark";

export interface ApplicationConfiguration {
  theme: Theme;
}

export const GlobalConfigKey = Symbol() as InjectionKey<ApplicationConfiguration>;

export const DefaultAppConfig: ApplicationConfiguration = {
  theme: "light",
};

export function getDefaultAppConfig(): UnwrapNestedRefs<ApplicationConfiguration> {
  return reactive<ApplicationConfiguration>(DefaultAppConfig);
}

export function anotherTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

function theme(theme: Theme): string {
  return `theme-${theme}`;
}

export function useApplicationConfig(): ApplicationConfiguration {
  const config = getDefaultAppConfig();

  onMounted(() => {
    document.body.classList.add(theme(config.theme));
  });

  watch(
    () => config.theme,
    () => {
      const before: Theme = anotherTheme(config.theme)
      document.body.classList.replace(theme(before), theme(config.theme));
    },
  );

  return config;
}
