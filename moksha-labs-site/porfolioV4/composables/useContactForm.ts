import { ref } from "vue";

export const useContactForm = () => {
  const message = useState("contact-message", () => "");
  const subject = useState("contact-subject", () => "");

  const prefillAndScroll = (sub: string) => {
    const { $ScrollTrigger, $lenis } = useNuxtApp() as any;

    // Set the subject first
    subject.value = sub;

    // Refresh ScrollTrigger in the next tick to prevent blocking the click
    setTimeout(() => {
      if ($ScrollTrigger) $ScrollTrigger.refresh();

      const lenis = $lenis || useNuxtApp().$lenis;

      if (lenis) {
        lenis.scrollTo("#contact", {
          offset: 0,
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        const el = document.querySelector("#contact");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);
  };

  return {
    message,
    subject,
    prefillAndScroll,
  };
};
