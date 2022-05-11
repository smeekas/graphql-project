import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
function Navbar() {
  return (
    <div className={styles.navbar}>
      <Link className={styles.link} to="/">
        All missions
      </Link>
      <Link className={styles.link} to="/mutation">
        mutation
      </Link>
    </div>
  );
}
export default Navbar;
