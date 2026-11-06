import { Link } from "react-router";
import logo from "../../assets/logo.png";

export default function BrandWordmark() {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2"
      aria-label="Hillside Hotel — Home"
    >
      <img
        src={logo}
        alt=""
        width={260}
        height={253}
        className="h-12.5 w-auto shrink-0"
      />

      <div className="flex flex-col text-gold-bright">
        <span className="text-[32px] font-bold leading-[1.1]">HILLSIDE</span>

        <span className="text-[13.6px] font-medium leading-[1.1]">HOTEL</span>
      </div>
    </Link>
  );
}
