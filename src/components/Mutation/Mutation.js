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
      returning {
        id
        name
        rocket
      }
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
const DELETE_ID = gql`
  mutation ($id: uuid) {
    delete_users(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
const UPDATE = gql`
  mutation ($id: uuid, $name: String, $rocket: String) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { name: $name, rocket: $rocket }
    ) {
      returning {
        id
        name
        rocket
      }
    }
  }
`;
function Mutation() {
  const insertNameRef = useRef();
  const insertRocketRef = useRef();
  const [userList, setUserList] = useState();
  const deleteNameRef = useRef();
  const {  loading, refetch } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      setUserList(data.users);
    },
  });
  const [addUser] = useMutation(INSERT);
  const [deleteUser] = useMutation(DELETE);
  const [deleteUserById] = useMutation(DELETE_ID);
  const [updateUser] = useMutation(UPDATE);
  const [update, setUpdate] = useState({});
  const [search, setSearch] = useState("");
  const [disabledId, setDisabledId] = useState(null);
  const deleteByIdHandler = (id) => {
    console.log(id);
    deleteUserById({
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        console.log(data);
        setUserList((prev) => {
          return prev.filter((user) => {
            return user.id !== data.delete_users.returning[0].id;
          });
        });
        // refetch();
      },
    });
  };
  const insertHandler = () => {
    addUser({
      variables: {
        name: insertNameRef.current.value,
        rocket: insertRocketRef.current.value,
      },
      onCompleted: (data) => {
        // refetch();
        console.log(data);
        setUserList((prev) => {
          return [
            ...prev,
            {
              id: data.insert_users.returning[0].id,
              name: data.insert_users.returning[0].name,
              rocket: data.insert_users.returning[0].rocket,
            },
          ];
        });
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
      onCompleted: (data) => {
        setDisabledId(null);
        setUpdate({});
        console.log(data);
        insertNameRef.current.value = "";
        insertRocketRef.current.value = "";
        setUserList((list) => {
          return list.map((user) => {
            if (user.id === data.update_users.returning.id) {
              return {
                id: data.update_users.returning.id,
                name: data.update_users.returning.name,
                rocket: data.update_users.returning.rocket,
              };
            }
            return user;
          });
        });
        // refetch();
      },
    });
  };
  const showUpdate = (data) => {
    setDisabledId(data.id);
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
        {userList
          .filter((user) => {
            if (user.name) {
              return user.name.includes(search);
            } else {
              return false;
            }
          })
          .map((user) => {
            return (
              <Item
                showUpdate={showUpdate}
                key={user.id}
                refetch={refetch}
                user={user}
                disabledId={disabledId}
                deleteById={deleteByIdHandler}
              />
            );
          })}
      </ul>
    </div>
  );
}
export default Mutation;
