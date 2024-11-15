import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  pathname: string;
}

const NavLink = ({ href, label, pathname }: NavLinkProps) => (
  <li>
    <Link
      href={href}
      role="button"
      className={pathname === href ? "btn-active" : ""}
    >
      {label}
    </Link>
  </li>
);

export default NavLink;
