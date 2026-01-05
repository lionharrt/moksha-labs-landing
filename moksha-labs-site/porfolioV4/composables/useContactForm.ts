export const useContactForm = () => {
  const message = useState("contact-message", () => "");
  const subject = useState("contact-subject", () => "");

  const prefillAndScroll = (sub: string) => {
    const { $lenis } = useNuxtApp() as any;

    // Set the subject
    subject.value = sub;

    // Smooth scroll to contact
    if ($lenis) {
      $lenis.scrollTo("#contact", {
        offset: 0,
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.querySelector("#contact");
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth"
        });
      }
    }
  };

  return {
    message,
    subject,
    prefillAndScroll,
  };
};
