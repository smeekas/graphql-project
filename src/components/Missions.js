import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import styles from "./Users.module.css";
import { Link } from "react-router-dom";
const GET_USERS = gql`
  query {
    launches {
      mission_name
      id
    }
  }
`;

function Missions() {
  const { data, loading } = useQuery(GET_USERS);
  const [search, setSearch] = useState("");
  return (
    <>
      <h1>All missions</h1>
     {data&& <input placeholder="search missions" className={styles.searchbar} onChange={(e) => setSearch(e.target.value)} />}
      <Data data={data} loading={loading} search={search} />
    </>
  );
}
export default Missions;

function Data({ search,data,loading }) {


  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.list}>
      {data.launches
        .filter((mission) => {
          return mission.mission_name.includes(search);
        })
        .map((mission) => {
          return (
          <Link className={styles.mission} to={`/${mission.id}`}>
            <div  key={Math.random().toString()}>
              {mission.mission_name} {mission.id}
            </div>
          </Link>
          );
        })}
    </div>
  );
}
