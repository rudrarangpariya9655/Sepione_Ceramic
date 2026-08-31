import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  return (
    <a
      className={styles.whatsapp}
      href="https://wa.me/919099950773?text=Hello%20Sepions%20Ceramic,%20I%20want%20to%20know%20more%20about%20your%20tiles."
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
    >
      <span>☏</span>
    </a>
  );
}
