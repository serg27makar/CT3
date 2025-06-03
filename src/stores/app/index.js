import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore("app", () => {
    const appName = ref("Advantage Investigations");
    const logo = ref("/src/assets/images/logo/Advantage_Icon_GoldFoil.png");
    const darklogo = ref("/src/assets/images/logo/Advantage_Icon_GoldFoil.png");
    const appLogoImage = ref('/src/assets/images/logo/SmartTrak_Logo_Inverse.png')
    const icon = ref("a-right ri-sun-line");
    const dark = ref(false);

    const user = ref({
        name: "Bill Yerds",
        image: "/src/assets/images/down-aerrow.gif",
    });

    function toggleDarkMode(isDark) {
        dark.value = isDark;
        if (isDark) {
            logo.value = "/src/assets/images/logo/Advantage_Icon_GoldFoil.png";
            icon.value = "a-right ri-sun-line";
        } else {
            logo.value = "/src/assets/images/logo/Advantage_Icon_GoldFoil.png";
            icon.value = "a-left ri-moon-clear-line";
        }
    }

    return {
        appName,
        logo,
        appLogoImage,
        darklogo,
        icon,
        dark,
        user,
        toggleDarkMode,
        getUserName: computed(() => user.value.name),
        getUserImage: computed(() => user.value.image),
    };
});
