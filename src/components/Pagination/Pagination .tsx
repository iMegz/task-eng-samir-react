import { SetURLSearchParams } from "react-router-dom";
import styles from "./Pagination.module.css";

interface PaginationProps {
  count: number;
  current: number;
  setParams: SetURLSearchParams;
}
export default function Pagination({
  count,
  current,
  setParams,
}: PaginationProps) {
  const pages = Array.from({ length: Math.ceil(count / 3) }, (_, i) => (
    <li className={styles["page-item"]} key={i + 1}>
      <button
        onClick={() => setParams(`p=${i + 1}`)}
        className={`${styles["page-link"]}${
          current === i + 1 ? ` ${styles.active}` : ""
        }`}
      >
        {i + 1}
      </button>
    </li>
  ));

  return (
    <div className={styles.pagination}>
      <ul>
        <li className={styles["page-item"]}>
          <button
            disabled={current === 1}
            onClick={() => setParams(`p=${current - 1}`)}
            className={styles["page-link"]}
          >
            &laquo; Prev
          </button>
        </li>
        {pages}
        <li className={styles["page-item"]}>
          <button
            disabled={current >= pages.length}
            onClick={() => setParams(`p=${current + 1}`)}
            className={styles["page-link"]}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
}
