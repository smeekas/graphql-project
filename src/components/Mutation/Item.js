import styles from "./Item.module.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function Item({ user, showUpdate, deleteById, disabledId }) {
  const deleteHandler = () => {
    deleteById(user.id);
    // deleteUser({
    //   variables: {
    //     id: user.id,
    //   },
    //   onCompleted: () => {
    //     refetch();
    //   },
    // });
  };
  const editHandler = () => {
    const data = {
      name: user.name,
      rocket: user.rocket,
      id: user.id,
    };
    showUpdate(data);
  };
  return (
    <li className={styles.listItem}>
      <section>Name:{user.name}</section>
      <section>Rocket:{user.rocket}</section>
      <section className={styles.editing}>
        <FiEdit onClick={editHandler} className={styles.edit} />
        <FiTrash2
          style={
            disabledId === user.id && { color: "grey", cursor: "not-allowed" }
          }
          onClick={disabledId !== user.id ? deleteHandler:()=>{}}
          className={styles.delete}
        />
      </section>
    </li>
  );
}

export default Item;
