import Image from "next/image";
import styles from "./page.module.css";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button type="primary" size="px14">
        Primary 14px
      </Button>
      <Button type="secondary" size="px14">
        Primary 14px
      </Button>
      <Button type="gradient" size="px14">
        Primary 14px
      </Button>
      <Button type="primary" size="px16">
        Primary 16px
      </Button>
      <Button type="secondary" size="px16">
        Primary 16px
      </Button>
      <Button type="gradient" size="px16">
        Primary 16px
      </Button>
    </div>
  );
}
