import { gql, useQuery } from "@apollo/client";
import styles from "./Mission.module.css";
import { Link, useParams } from "react-router-dom";
const GET_MISSION = gql`
  query ($id: ID!) {
    launch(id: $id) {
      launch_success
      launch_year
      launch_site {
        site_name
        site_name_long
      }
      mission_name
      rocket {
        rocket {
          name
          id
        }
      }
      details
    }
  }
`;

function Mission() {
  const { missionId } = useParams();
  console.log(missionId);
  const { data, loading } = useQuery(GET_MISSION, {
    variables: {
      id: missionId,
    },
  });
  if (loading) {
    return <h2 className={styles.center}>Loading...</h2>;
  }
  const status = data && data.launch.launch_success;
  return (
    <>
      <div className={styles.mission}>
        <span className={styles.missionDetail}>Mission Detail</span>
        <div className={styles.padding}>

        
        <section className={styles.missionName}>
          {data.launch.mission_name}
        </section>
        <section className={styles.info}>
          <div>launch year: {data.launch.launch_year}</div>

          <div className={styles.status}>
            status:{" "}
            <span className={status ? styles.success : styles.failed}>
              {status ? "launch successful" : "launch failed"}
            </span>
          </div>
        </section>
        <div className={styles.location}>
          location: {data.launch.launch_site.site_name_long}
        </div>
        <div className={styles.rocket}>
          Rocket:{" "}
          <Link
            className={styles.rocketLink}
            to={`/rocket/${data.launch.rocket.rocket.id}`}
          >
            <span>{data.launch.rocket.rocket.name}</span>
          </Link>
        </div>
        <p>{data.launch.details}</p>
        </div>
      </div>
    </>
  );
}
export default Mission;
