import { gql, useQuery } from "@apollo/client";
import styles from "./Mutation.module.css";
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import Item from "./Item";
const GET_USERS = gql`
  query {
    users {
      name
      rocket
      id
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
const DELETE = gql`
  mutation ($name: String) {
    delete_users(where: { name: { _eq: $name } }) {
      affected_rows
    }
  }
`;
const UPDATE = gql`
  mutation ($id: uuid, $name: String, $rocket: String) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { name: $name, rocket: $rocket }
    ) {
      affected_rows
    }
  }
`;
function Mutation() {
  const insertNameRef = useRef();
  const insertRocketRef = useRef();
  const deleteNameRef = useRef();
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [addUser] = useMutation(INSERT);
  const [deleteUser] = useMutation(DELETE);
  const [updateUser] = useMutation(UPDATE);
  const [update, setUpdate] = useState({});
  const [search, setSearch] = useState("");
  console.log(update);
  const insertHandler = () => {
    addUser({
      variables: {
        name: insertNameRef.current.value,
        rocket: insertRocketRef.current.value,
      },
      onCompleted: () => {
        refetch();
        insertNameRef.current.value = "";
        insertRocketRef.current.value = "";
      },
    });
  };
  const updateHandler = () => {
    updateUser({
      variables: {
        id: update.id,
        name: insertNameRef.current.value,
        rocket: insertRocketRef.current.value,
      },
      onCompleted: () => {
        setUpdate({});
        insertNameRef.current.value = "";
        insertRocketRef.current.value = "";
        refetch();
      },
    });
  };
  const showUpdate = (data) => {
    setUpdate({
      show: true,
      id: data.id,
    });
    insertNameRef.current.value = data.name;
    insertRocketRef.current.value = data.rocket;
  };
  const deleteHandler = () => {
    deleteUser({
      variables: {
        name: deleteNameRef.current.value,
      },
      onCompleted: () => {
        refetch();
      },
    });
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
          <button
            onClick={!update.show ? insertHandler : updateHandler}
            className={styles.btn}
          >
            {!update.show ? "Insert" : "update"}
          </button>
        </section>
        <section className={styles.io}>
          Name:{" "}
          <input ref={deleteNameRef} className={styles.input} type="text" />
          <button onClick={deleteHandler} className={styles.btn}>
            Delete Multiple
          </button>
        </section>
      </section>
      search:{" "}
      <input
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className={styles.input}
      />
      <ul className={styles.list}>
        {data.users
          .filter((user) => {
            return user.name.includes(search);
          })
          .map((user) => {
            return (
              <Item
                showUpdate={showUpdate}
                key={user.id}
                refetch={refetch}
                user={user}
              />
            );
          })}
      </ul>
    </div>
  );
}
export default Mutation;
