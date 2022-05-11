import { gql, useQuery } from "@apollo/client";
import styles from "./Mutation.module.css";
import { useRef } from "react";
import { useMutation } from "@apollo/client";
const GET_USERS = gql`
  query {
    users {
      name
      rocket
    }
  }
`;

const INSERT = gql`
  mutation ($name: String, $rocket: String) {
    insert_users(objects: { name: $name, rocket: $rocket }) {
      affected_rows
    }
  }
`;
function Mutation() {
  const insertNameRef = useRef();
  const insertRocketRef = useRef();
  const { data, loading,refetch } = useQuery(GET_USERS);
  const [addUser, addedData] = useMutation(INSERT);
  const insertHandler = () => {
    addUser({
      variables: {
        name: insertNameRef.current.value,
        rocket: insertRocketRef.current.value,
      },
    });
    refetch()
    insertNameRef.current.value=""
    insertRocketRef.current.value=""
    
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div>
      <section className={styles.crud}>
        <section className={styles.io}>
          Name:{" "}
          <input ref={insertNameRef} className={styles.input} type="text" />
          Rocket:{" "}
          <input ref={insertRocketRef} className={styles.input} type="text" />
          <button onClick={insertHandler} className={styles.btn}>
            Insert
          </button>
        </section>
        <section className={styles.io}>
          Name: <input className={styles.input} type="text" />
          <button className={styles.btn}>Delete</button>
        </section>
      </section>
      <input className={styles.input}/>
      <ul className={styles.list}>
        {data.users.map((user) => {
          return (
            <li className={styles.listItem}>
              <section>Name:{user.name}</section>
              <section>Rocket:{user.rocket}</section>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Mutation;
