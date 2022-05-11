import styles from "./Item.module.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { gql, useMutation } from "@apollo/client";

const DELETE = gql`
  mutation ($id: uuid) {
    delete_users(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
function Item({ user, refetch, showUpdate }) {
  const [deleteUser] = useMutation(DELETE);
  const deleteHandler = () => {
    deleteUser({
      variables: {
        id: user.id,
      },
      onCompleted: () => {
        refetch();
      },
    });
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
    <li key={Math.random().toString()} className={styles.listItem}>
      <section>Name:{user.name}</section>
      <section>Rocket:{user.rocket}</section>
      <section className={styles.editing}>
        <FiEdit onClick={editHandler} className={styles.edit} />
        <FiTrash2 onClick={deleteHandler} className={styles.delete} />
      </section>
    </li>
  );
}

export default Item;
